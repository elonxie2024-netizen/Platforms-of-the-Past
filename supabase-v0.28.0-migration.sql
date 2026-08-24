-- v0.28.0: account-owned custom-level drafts, collaboration permissions, and public snapshots.
-- Run this file once in the Supabase SQL Editor before using the v0.28.0 cloud editor.

update public.leaderboard_rulesets
set
  label = 'Version 0.24.1 to 0.28.0',
  accepted_versions = array(
    select distinct version
    from unnest(accepted_versions || array['v0.27.1', 'v0.28.0']) version
    order by version
  )
where id = 'crate-jump-collision-v1';

create table if not exists public.custom_levels (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  level_data jsonb not null check (
    jsonb_typeof(level_data) = 'object'
    and octet_length(level_data::text) <= 8000000
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.custom_level_permissions (
  level_id uuid not null references public.custom_levels(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('editor', 'viewer')),
  display_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (level_id, user_id),
  check (owner_id <> user_id)
);

create table if not exists public.published_custom_levels (
  level_id uuid primary key references public.custom_levels(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  owner_name text not null,
  level_data jsonb not null check (
    jsonb_typeof(level_data) = 'object'
    and octet_length(level_data::text) <= 8000000
  ),
  version integer not null default 1 check (version > 0),
  published_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists custom_levels_owner_idx
  on public.custom_levels (owner_id, updated_at desc);
create index if not exists custom_level_permissions_user_idx
  on public.custom_level_permissions (user_id, updated_at desc);
create index if not exists published_custom_levels_updated_idx
  on public.published_custom_levels (updated_at desc);

alter table public.custom_levels enable row level security;
alter table public.custom_level_permissions enable row level security;
alter table public.published_custom_levels enable row level security;

revoke all on table public.custom_levels from anon, authenticated;
revoke all on table public.custom_level_permissions from anon, authenticated;
revoke all on table public.published_custom_levels from anon, authenticated;

drop policy if exists "Owners and collaborators can read drafts" on public.custom_levels;
create policy "Owners and collaborators can read drafts"
  on public.custom_levels for select
  to authenticated
  using (
    owner_id = (select auth.uid())
    or exists (
      select 1
      from public.custom_level_permissions permission
      where permission.level_id = id
        and permission.user_id = (select auth.uid())
    )
  );

drop policy if exists "Users can create owned drafts" on public.custom_levels;
create policy "Users can create owned drafts"
  on public.custom_levels for insert
  to authenticated
  with check (owner_id = (select auth.uid()));

drop policy if exists "Owners and editors can update drafts" on public.custom_levels;
create policy "Owners and editors can update drafts"
  on public.custom_levels for update
  to authenticated
  using (
    owner_id = (select auth.uid())
    or exists (
      select 1
      from public.custom_level_permissions permission
      where permission.level_id = id
        and permission.user_id = (select auth.uid())
        and permission.role = 'editor'
    )
  )
  with check (
    owner_id = (select auth.uid())
    or exists (
      select 1
      from public.custom_level_permissions permission
      where permission.level_id = id
        and permission.user_id = (select auth.uid())
        and permission.role = 'editor'
    )
  );

drop policy if exists "Owners can delete drafts" on public.custom_levels;
create policy "Owners can delete drafts"
  on public.custom_levels for delete
  to authenticated
  using (owner_id = (select auth.uid()));

drop policy if exists "Participants can read draft permissions" on public.custom_level_permissions;
create policy "Participants can read draft permissions"
  on public.custom_level_permissions for select
  to authenticated
  using (
    owner_id = (select auth.uid())
    or user_id = (select auth.uid())
  );

drop policy if exists "Anyone can read published custom levels" on public.published_custom_levels;
create policy "Anyone can read published custom levels"
  on public.published_custom_levels for select
  to anon, authenticated
  using (true);

create or replace function public.grant_custom_level_access(
  p_level_id uuid,
  p_account_email text,
  p_role text
)
returns public.custom_level_permissions
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
  target_user auth.users;
  target_name text;
  result public.custom_level_permissions;
begin
  if current_user_id is null then raise exception 'Authentication required'; end if;
  if p_role not in ('editor', 'viewer') then raise exception 'Role must be editor or viewer'; end if;
  if not exists (
    select 1 from public.custom_levels level
    where level.id = p_level_id and level.owner_id = current_user_id
  ) then raise exception 'Only the owner can share this level'; end if;

  select * into target_user
  from auth.users
  where lower(email) = lower(btrim(p_account_email))
  limit 1;
  if target_user.id is null then raise exception 'No account uses that email'; end if;
  if target_user.id = current_user_id then raise exception 'The owner already has full control'; end if;

  select profile.display_name into target_name
  from public.player_profiles profile
  where profile.user_id = target_user.id;
  target_name := coalesce(nullif(btrim(target_name), ''), 'Traveler-' || left(target_user.id::text, 6));

  insert into public.custom_level_permissions as permission (
    level_id, owner_id, user_id, role, display_name, updated_at
  ) values (
    p_level_id, current_user_id, target_user.id, p_role, target_name, now()
  )
  on conflict (level_id, user_id) do update set
    role = excluded.role,
    display_name = excluded.display_name,
    updated_at = now()
  returning * into result;
  return result;
end;
$$;

create or replace function public.remove_custom_level_access(
  p_level_id uuid,
  p_user_id uuid
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
begin
  if current_user_id is null then raise exception 'Authentication required'; end if;
  if not exists (
    select 1 from public.custom_levels level
    where level.id = p_level_id and level.owner_id = current_user_id
  ) then raise exception 'Only the owner can change sharing'; end if;
  delete from public.custom_level_permissions
  where level_id = p_level_id and user_id = p_user_id and owner_id = current_user_id;
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
  publisher_name text;
  result public.published_custom_levels;
begin
  if current_user_id is null then raise exception 'Authentication required'; end if;
  select * into draft from public.custom_levels
  where id = p_level_id and owner_id = current_user_id;
  if draft.id is null then raise exception 'Only the owner can publish this level'; end if;

  select profile.display_name into publisher_name
  from public.player_profiles profile
  where profile.user_id = current_user_id;
  publisher_name := coalesce(nullif(btrim(publisher_name), ''), 'Traveler-' || left(current_user_id::text, 6));

  insert into public.published_custom_levels as published (
    level_id, owner_id, owner_name, level_data, version, published_at, updated_at
  ) values (
    draft.id, draft.owner_id, publisher_name, draft.level_data, 1, now(), now()
  )
  on conflict (level_id) do update set
    owner_name = excluded.owner_name,
    level_data = excluded.level_data,
    version = published.version + 1,
    updated_at = now()
  returning * into result;
  return result;
end;
$$;

create or replace function public.unpublish_custom_level(p_level_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
begin
  if current_user_id is null then raise exception 'Authentication required'; end if;
  if not exists (
    select 1 from public.custom_levels level
    where level.id = p_level_id and level.owner_id = current_user_id
  ) then raise exception 'Only the owner can unpublish this level'; end if;
  delete from public.published_custom_levels
  where level_id = p_level_id and owner_id = current_user_id;
end;
$$;

grant select on public.custom_levels to authenticated;
grant insert (owner_id, level_data) on public.custom_levels to authenticated;
grant update (level_data, updated_at) on public.custom_levels to authenticated;
grant delete on public.custom_levels to authenticated;
grant select on public.custom_level_permissions to authenticated;
grant select on public.published_custom_levels to anon, authenticated;

revoke all on function public.grant_custom_level_access(uuid, text, text) from public;
revoke all on function public.remove_custom_level_access(uuid, uuid) from public;
revoke all on function public.publish_custom_level(uuid) from public;
revoke all on function public.unpublish_custom_level(uuid) from public;
grant execute on function public.grant_custom_level_access(uuid, text, text) to authenticated;
grant execute on function public.remove_custom_level_access(uuid, uuid) to authenticated;
grant execute on function public.publish_custom_level(uuid) to authenticated;
grant execute on function public.unpublish_custom_level(uuid) to authenticated;

-- No public insert/update/delete grants exist for published snapshots.
-- No direct insert/update/delete grants exist for permission rows; owner-only RPCs enforce sharing.
