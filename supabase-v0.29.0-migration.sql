-- v0.29.0: safe collaborative workspaces, public usernames, publish history, and bounded storage.
-- Run this once after the v0.28.x migration. Existing drafts and current publications are preserved.

update public.leaderboard_rulesets
set
  label = 'Version 0.24.1 to 0.29.0',
  accepted_versions = array(
    select distinct version
    from unnest(accepted_versions || array['v0.28.1', 'v0.28.2', 'v0.29.0']) version
    order by version
  )
where id = 'crate-jump-collision-v1';

create schema if not exists extensions;
create extension if not exists citext with schema extensions;

alter table public.player_profiles add column if not exists username extensions.citext;
update public.player_profiles
set username = ('u' || left(replace(user_id::text, '-', ''), 23))::extensions.citext
where username is null or btrim(username::text) = '';
alter table public.player_profiles alter column username set not null;
alter table public.player_profiles drop constraint if exists player_profiles_username_format_check;
alter table public.player_profiles add constraint player_profiles_username_format_check
  check (username::text ~ '^[a-z0-9][a-z0-9-]{2,23}$');
create unique index if not exists player_profiles_username_unique_idx
  on public.player_profiles (username);

alter table public.custom_levels add column if not exists title text;
update public.custom_levels
set title = coalesce(nullif(btrim(level_data->>'name'), ''), 'Untitled Level')
where title is null or btrim(title) = '';
alter table public.custom_levels alter column title set default 'Untitled Level';
alter table public.custom_levels alter column title set not null;
alter table public.custom_levels drop constraint if exists custom_levels_title_check;
alter table public.custom_levels add constraint custom_levels_title_check
  check (char_length(btrim(title)) between 1 and 80 and title !~ '[[:cntrl:]]');

create or replace function public.touch_custom_level_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := clock_timestamp();
  return new;
end;
$$;
drop trigger if exists custom_levels_touch_updated_at on public.custom_levels;
create trigger custom_levels_touch_updated_at
before update of level_data, title on public.custom_levels
for each row execute function public.touch_custom_level_updated_at();

create table if not exists public.published_custom_level_versions (
  level_id uuid not null references public.custom_levels(id) on delete cascade,
  version integer not null check (version > 0),
  level_data jsonb not null check (
    jsonb_typeof(level_data) = 'object'
    and octet_length(level_data::text) <= 8000000
  ),
  published_at timestamptz not null default now(),
  primary key (level_id, version)
);
insert into public.published_custom_level_versions (level_id, version, level_data, published_at)
select level_id, version, level_data, updated_at
from public.published_custom_levels
on conflict (level_id, version) do nothing;

drop function if exists public.grant_custom_level_access(uuid, text, text);
drop function if exists public.publish_custom_level(uuid);
alter table public.custom_level_permissions drop column if exists display_name;
alter table public.published_custom_levels drop column if exists owner_name;

drop policy if exists "Users can read their own profile" on public.player_profiles;
drop policy if exists "Anyone can read public profiles" on public.player_profiles;
create policy "Anyone can read public profiles"
  on public.player_profiles for select
  to anon, authenticated
  using (true);

drop policy if exists "Collaborators can leave shared levels" on public.custom_level_permissions;
create policy "Collaborators can leave shared levels"
  on public.custom_level_permissions for delete
  to authenticated
  using (user_id = (select auth.uid()));

alter table public.published_custom_level_versions enable row level security;
drop policy if exists "Current publications and owners can read version history" on public.published_custom_level_versions;
create policy "Current publications and owners can read version history"
  on public.published_custom_level_versions for select
  to anon, authenticated
  using (
    exists (select 1 from public.published_custom_levels current where current.level_id = published_custom_level_versions.level_id)
    or exists (select 1 from public.custom_levels draft where draft.id = published_custom_level_versions.level_id and draft.owner_id = (select auth.uid()))
  );

create or replace function public.grant_custom_level_access(
  p_level_id uuid,
  p_username text,
  p_role text
)
returns public.custom_level_permissions
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
  target_user_id uuid;
  result public.custom_level_permissions;
begin
  if current_user_id is null then raise exception 'Authentication required'; end if;
  if p_role not in ('editor', 'viewer') then raise exception 'Role must be editor or viewer'; end if;
  if not exists (
    select 1 from public.custom_levels level
    where level.id = p_level_id and level.owner_id = current_user_id
  ) then raise exception 'Only the owner can share this level'; end if;

  select profile.user_id into target_user_id
  from public.player_profiles profile
  where profile.username = btrim(lower(p_username))::extensions.citext
  limit 1;
  if target_user_id is null or target_user_id = current_user_id then
    raise exception 'Could not share with that account';
  end if;

  insert into public.custom_level_permissions as permission (
    level_id, owner_id, user_id, role, updated_at
  ) values (
    p_level_id, current_user_id, target_user_id, p_role, now()
  )
  on conflict (level_id, user_id) do update set
    role = excluded.role,
    updated_at = now()
  returning * into result;
  return result;
exception
  when unique_violation or foreign_key_violation then
    raise exception 'Could not share with that account';
end;
$$;

create or replace function public.leave_custom_level(p_level_id uuid)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  delete from public.custom_level_permissions
  where level_id = p_level_id and user_id = (select auth.uid());
end;
$$;

create or replace function public.publish_custom_level(p_level_id uuid)
returns public.published_custom_levels
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
  draft public.custom_levels;
  next_version integer;
  result public.published_custom_levels;
begin
  if current_user_id is null then raise exception 'Authentication required'; end if;
  select * into draft from public.custom_levels
  where id = p_level_id and owner_id = current_user_id
  for update;
  if draft.id is null then raise exception 'Only the owner can publish this level'; end if;

  select coalesce(max(history.version), 0) + 1 into next_version
  from public.published_custom_level_versions history
  where history.level_id = draft.id;

  insert into public.published_custom_levels as current (
    level_id, owner_id, level_data, version, published_at, updated_at
  ) values (
    draft.id, draft.owner_id, draft.level_data, next_version, now(), now()
  )
  on conflict (level_id) do update set
    level_data = excluded.level_data,
    version = excluded.version,
    updated_at = now()
  returning * into result;

  insert into public.published_custom_level_versions (level_id, version, level_data, published_at)
  values (draft.id, next_version, draft.level_data, result.updated_at);
  return result;
end;
$$;

create or replace function public.get_published_custom_level(p_level_id uuid)
returns table (
  level_id uuid,
  owner_name text,
  owner_username text,
  level_data jsonb,
  version integer,
  published_at timestamptz,
  updated_at timestamptz
)
language sql
security definer
set search_path = ''
stable
as $$
  select published.level_id, profile.display_name, profile.username::text,
    published.level_data, published.version, published.published_at, published.updated_at
  from public.published_custom_levels published
  join public.player_profiles profile on profile.user_id = published.owner_id
  where published.level_id = p_level_id;
$$;

create or replace function public.enforce_custom_level_quota()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform pg_advisory_xact_lock(hashtextextended(new.owner_id::text, 0));
  if (select count(*) from public.custom_levels where owner_id = new.owner_id) >= 50 then
    raise exception 'Each account can own at most 50 levels';
  end if;
  return new;
end;
$$;
drop trigger if exists custom_levels_owner_quota on public.custom_levels;
create trigger custom_levels_owner_quota
before insert on public.custom_levels
for each row execute function public.enforce_custom_level_quota();

revoke all on table public.player_profiles from anon, authenticated;
grant select (user_id, display_name, username) on public.player_profiles to anon, authenticated;
grant insert (user_id, display_name, username) on public.player_profiles to authenticated;
grant update (display_name, username, updated_at) on public.player_profiles to authenticated;

revoke all on table public.custom_levels from authenticated;
grant select on public.custom_levels to authenticated;
grant insert (owner_id, title, level_data) on public.custom_levels to authenticated;
grant update (title, level_data) on public.custom_levels to authenticated;
grant delete on public.custom_levels to authenticated;

revoke all on table public.custom_level_permissions from authenticated;
grant select, delete on public.custom_level_permissions to authenticated;

revoke all on table public.published_custom_levels from anon, authenticated;
grant select (level_id, level_data, version, published_at, updated_at)
  on public.published_custom_levels to anon, authenticated;
revoke all on table public.published_custom_level_versions from anon, authenticated;
grant select (level_id, version, level_data, published_at)
  on public.published_custom_level_versions to anon, authenticated;

revoke all on function public.grant_custom_level_access(uuid, text, text) from public;
revoke all on function public.leave_custom_level(uuid) from public;
revoke all on function public.publish_custom_level(uuid) from public;
revoke all on function public.get_published_custom_level(uuid) from public;
grant execute on function public.grant_custom_level_access(uuid, text, text) to authenticated;
grant execute on function public.leave_custom_level(uuid) to authenticated;
grant execute on function public.publish_custom_level(uuid) to authenticated;
grant execute on function public.get_published_custom_level(uuid) to anon, authenticated;
