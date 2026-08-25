-- Run this entire file once in the Supabase SQL Editor.
-- It creates leaderboard, account-progress, private custom-level, sharing, and publishing data with RLS.

create schema if not exists extensions;
create extension if not exists citext with schema extensions;

create table if not exists public.leaderboard_rulesets (
  id text primary key,
  label text not null,
  accepted_versions text[] not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

insert into public.leaderboard_rulesets (id, label, accepted_versions)
values
  ('crate-jump-collision-v1', 'Version 0.24.1 to 0.31.0', array['v0.24.1', 'v0.24.2', 'v0.25.0', 'v0.26.0', 'v0.26.1', 'v0.26.2', 'v0.26.3', 'v0.26.4', 'v0.26.5', 'v0.26.6', 'v0.27.0', 'v0.27.1', 'v0.28.0', 'v0.28.1', 'v0.28.2', 'v0.29.0', 'v0.29.1', 'v0.30.0', 'v0.30.1', 'v0.30.2', 'v0.30.3', 'v0.31.0']),
  ('crate-platform-collision-v1', 'Version 0.23.2 to 0.24.0', array['v0.23.2', 'v0.24.0']),
  ('history-forge-gate-v1', 'Version 0.23.1 to 0.23.1', array['v0.23.1']),
  ('crate-gravity-v1', 'Version 0.23.0 to 0.23.0', array['v0.23.0']),
  ('chapter-gate-fixes-v1', 'Version 0.22.2 to 0.22.2', array['v0.22.2']),
  ('chapter-gauntlets-v1', 'Version 0.22.0 to 0.22.1', array['v0.22.0', 'v0.22.1']),
  ('zero-delay-platform-v1', 'Version 0.21.4 to 0.21.5', array['v0.21.4', 'v0.21.5']),
  ('cargo-gate-star-v1', 'Version 0.21.3 to 0.21.3', array['v0.21.3']),
  ('cargo-gate-collision-v1', 'Version 0.21.2 to 0.21.2', array['v0.21.2']),
  ('blade-recall-corridor-v1', 'Version 0.21.1 to 0.21.1', array['v0.21.1']),
  ('combined-chapter-v1', 'Version 0.21.0 to 0.21.0', array['v0.21.0']),
  ('rewind-final-crossing-v1', 'Version 0.19.7 to 0.20.1', array['v0.19.7', 'v0.20.0', 'v0.20.1']),
  ('direct-chapter-timer-v1', 'Version 0.19.6 to 0.19.6', array['v0.19.6']),
  ('chapter-timer-continuation-v1', 'Version 0.19.5 to 0.19.5', array['v0.19.5']),
  ('echo-shortcut-fix-v1', 'Version 0.19.2 to 0.19.4', array['v0.19.2', 'v0.19.3', 'v0.19.4']),
  ('echo-route-preview-v1', 'Version 0.19.1 to 0.19.1', array['v0.19.1']),
  ('echo-final-v1', 'Version 0.19.0 to 0.19.0', array['v0.19.0']),
  ('echo-chapter-timing-v1', 'Version 0.18.0 to 0.18.0', array['v0.18.0']),
  ('first-echo-v1', 'Version 0.17.0 to 0.17.0', array['v0.17.0']),
  ('roadmap-rewind-timing-v1', 'Version 0.16.1 to 0.16.1', array['v0.16.1']),
  ('systemic-rewind-v1', 'Version 0.16.0 to 0.16.0', array['v0.16.0']),
  ('rewind-state-fix-v1', 'Version 0.15.3 to 0.15.3', array['v0.15.3']),
  ('rewind-hold-v1', 'Version 0.15.2 to 0.15.2', array['v0.15.2']),
  ('rewind-final-fix-v1', 'Version 0.15.1 to 0.15.1', array['v0.15.1']),
  ('rewind-final-v1', 'Version 0.15.0 to 0.15.0', array['v0.15.0']),
  ('dangerous-rewind-v1', 'Version 0.14.5 to 0.14.5', array['v0.14.5']),
  ('rewind-field-v1', 'Version 0.14.1 to 0.14.4', array['v0.14.1', 'v0.14.2', 'v0.14.3', 'v0.14.4']),
  ('rewind-chapter-v2', 'Version 0.14.0 to 0.14.0', array['v0.14.0']),
  ('hazard-instance-runs-v1', 'Version 0.13.2 to 0.13.2', array['v0.13.2']),
  ('custom-runs-v1', 'Version 0.13.0 to 0.13.1', array['v0.13.0', 'v0.13.1']),
  ('first-rewind-v1', 'Version 0.12.0 to 0.12.0', array['v0.12.0']),
  ('enemy-star-drops-v1', 'Version 0.11.6 to 0.11.7', array['v0.11.6', 'v0.11.7']),
  ('flag-star-cleanup-v1', 'Version 0.11.5 to 0.11.5', array['v0.11.5']),
  ('intro-ten-v1', 'Version 0.11.0 to 0.11.4', array['v0.11.0', 'v0.11.1', 'v0.11.2', 'v0.11.3', 'v0.11.4']),
  ('pressure-gate-v1', 'Version 0.10.4 to 0.10.4', array['v0.10.4']),
  ('pressure-route-v2', 'Version 0.10.3 to 0.10.3', array['v0.10.3']),
  ('eight-intro-v1', 'Version 0.10.2 to 0.10.2', array['v0.10.2']),
  ('edge-collision-v1', 'Version 0.10.1 to 0.10.1', array['v0.10.1']),
  ('pressure-plates-v1', 'Version 0.10.0 to 0.10.0', array['v0.10.0']),
  ('intro-seven-v1', 'Version 0.6.2 to 0.9.2', array['v0.8.0', 'v0.8.1', 'v0.8.3', 'v0.9.0', 'v0.9.1', 'v0.9.2'])
on conflict (id) do update
set label = excluded.label,
    accepted_versions = excluded.accepted_versions,
    active = true;

create table if not exists public.player_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  username extensions.citext not null unique check (username::text ~ '^[a-z0-9][a-z0-9-]{2,23}$'),
  display_name text not null check (
    char_length(btrim(display_name)) between 1 and 24
    and display_name !~ '[[:cntrl:]]'
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.player_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  highest_unlocked_level integer not null default 0 check (highest_unlocked_level >= 0),
  completed_chapters integer[] not null default '{}',
  completed_gauntlets text[] not null default '{}',
  menu_customization_unlocked boolean not null default false,
  updated_at timestamptz not null default now(),
  check (completed_chapters <@ array[0, 1, 2, 3]),
  check (completed_gauntlets <@ array['G1', 'G2', 'G3', 'G4'])
);

create table if not exists public.leaderboard_scores (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete set null,
  leaderboard_id text not null references public.leaderboard_rulesets(id),
  game_version text not null check (game_version ~ '^v[0-9]+\.[0-9]+\.[0-9]+$'),
  name text not null check (char_length(btrim(name)) between 1 and 24 and name !~ '[[:cntrl:]]'),
  seconds numeric(8,1) not null check (seconds between 1 and 36000),
  stars smallint not null check (stars between 0 and 61),
  score numeric(8,1) generated always as (round(300 - seconds + stars * 2, 1)) stored,
  splits jsonb not null check (jsonb_typeof(splits) = 'array' and jsonb_array_length(splits) in (7, 8, 10)),
  run_type_id text not null default 'classic',
  ranking_metric text not null default 'time' check (ranking_metric in ('time', 'score', 'stars')),
  created_at timestamptz not null default now()
);

alter table public.leaderboard_scores
  add column if not exists run_type_id text not null default 'classic';
alter table public.leaderboard_scores
  add column if not exists ranking_metric text not null default 'time';
alter table public.leaderboard_scores
  add column if not exists user_id uuid references auth.users(id) on delete set null;

alter table public.leaderboard_scores
  drop constraint if exists leaderboard_scores_ranking_metric_check;
alter table public.leaderboard_scores
  add constraint leaderboard_scores_ranking_metric_check check (ranking_metric in ('time', 'score', 'stars'));

alter table public.leaderboard_scores
  drop constraint if exists leaderboard_scores_stars_check;
alter table public.leaderboard_scores
  add constraint leaderboard_scores_stars_check check (stars between 0 and 61);

alter table public.leaderboard_scores
  drop constraint if exists leaderboard_scores_splits_check;
alter table public.leaderboard_scores
  add constraint leaderboard_scores_splits_check
  check (jsonb_typeof(splits) = 'array' and jsonb_array_length(splits) between 1 and 10);

create index if not exists leaderboard_scores_rank_idx
  on public.leaderboard_scores (leaderboard_id, score desc, seconds asc, created_at asc);

create index if not exists leaderboard_scores_run_type_rank_idx
  on public.leaderboard_scores (leaderboard_id, run_type_id, ranking_metric, seconds asc, score desc, stars desc);

create index if not exists leaderboard_scores_user_idx
  on public.leaderboard_scores (user_id, created_at desc)
  where user_id is not null;

create or replace function public.merge_player_progress(
  p_highest_unlocked_level integer,
  p_completed_chapters integer[],
  p_completed_gauntlets text[],
  p_menu_customization_unlocked boolean
)
returns public.player_progress
language plpgsql
security invoker
set search_path = ''
as $$
declare
  merged public.player_progress;
  current_user_id uuid := (select auth.uid());
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  insert into public.player_progress as existing (
    user_id, highest_unlocked_level, completed_chapters, completed_gauntlets,
    menu_customization_unlocked, updated_at
  ) values (
    current_user_id,
    greatest(0, coalesce(p_highest_unlocked_level, 0)),
    coalesce(p_completed_chapters, '{}'::integer[]),
    coalesce(p_completed_gauntlets, '{}'::text[]),
    coalesce(p_menu_customization_unlocked, false),
    now()
  )
  on conflict (user_id) do update set
    highest_unlocked_level = greatest(
      existing.highest_unlocked_level,
      excluded.highest_unlocked_level
    ),
    completed_chapters = array(
      select distinct chapter
      from unnest(existing.completed_chapters || excluded.completed_chapters) chapter
      order by chapter
    ),
    completed_gauntlets = array(
      select distinct gauntlet
      from unnest(existing.completed_gauntlets || excluded.completed_gauntlets) gauntlet
      order by gauntlet
    ),
    menu_customization_unlocked =
      existing.menu_customization_unlocked or excluded.menu_customization_unlocked,
    updated_at = now()
  returning * into merged;

  return merged;
end;
$$;

alter table public.leaderboard_rulesets enable row level security;
alter table public.leaderboard_scores enable row level security;
alter table public.player_profiles enable row level security;
alter table public.player_progress enable row level security;

drop policy if exists "Users can read their own profile" on public.player_profiles;
drop policy if exists "Anyone can read public profiles" on public.player_profiles;
create policy "Anyone can read public profiles"
  on public.player_profiles for select
  to anon, authenticated
  using (true);

drop policy if exists "Users can create their own profile" on public.player_profiles;
create policy "Users can create their own profile"
  on public.player_profiles for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own profile" on public.player_profiles;
create policy "Users can update their own profile"
  on public.player_profiles for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can read their own progression" on public.player_progress;
create policy "Users can read their own progression"
  on public.player_progress for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can create their own progression" on public.player_progress;
create policy "Users can create their own progression"
  on public.player_progress for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own progression" on public.player_progress;
create policy "Users can update their own progression"
  on public.player_progress for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Anyone can read leaderboard rulesets" on public.leaderboard_rulesets;
create policy "Anyone can read leaderboard rulesets"
  on public.leaderboard_rulesets for select
  to anon, authenticated
  using (true);

drop policy if exists "Anyone can read leaderboard scores" on public.leaderboard_scores;
create policy "Anyone can read leaderboard scores"
  on public.leaderboard_scores for select
  to anon, authenticated
  using (true);

drop policy if exists "Anyone can submit validated scores" on public.leaderboard_scores;
create policy "Anyone can submit validated scores"
  on public.leaderboard_scores for insert
  to anon, authenticated
  with check (
    exists (
      select 1
      from public.leaderboard_rulesets ruleset
      where ruleset.id = leaderboard_id
        and ruleset.active
        and game_version = any(ruleset.accepted_versions)
    )
    and (
      ((select auth.uid()) is null and user_id is null)
      or (
        user_id = (select auth.uid())
        and name = (
          select profile.display_name
          from public.player_profiles profile
          where profile.user_id = (select auth.uid())
        )
      )
    )
  );

grant select on public.leaderboard_rulesets to anon, authenticated;
grant select, insert on public.leaderboard_scores to anon, authenticated;
grant usage, select on sequence public.leaderboard_scores_id_seq to anon, authenticated;
revoke all on table public.player_profiles from anon, authenticated;
grant select (user_id, display_name, username) on public.player_profiles to anon, authenticated;
grant insert (user_id, display_name, username) on public.player_profiles to authenticated;
grant update (display_name, username, updated_at) on public.player_profiles to authenticated;
grant select, insert, update on public.player_progress to authenticated;
revoke all on function public.merge_player_progress(integer, integer[], text[], boolean) from public;
grant execute on function public.merge_player_progress(integer, integer[], text[], boolean) to authenticated;

-- Intentionally grant no update or delete permissions to public leaderboard visitors.

-- v0.28.0: account-owned custom-level drafts, collaboration permissions, and public snapshots.
-- Run this file once in the Supabase SQL Editor before using the v0.28.0 cloud editor.

create table if not exists public.custom_levels (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Untitled Level' check (
    char_length(btrim(title)) between 1 and 80 and title !~ '[[:cntrl:]]'
  ),
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
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (level_id, user_id),
  check (owner_id <> user_id)
);

create table if not exists public.published_custom_levels (
  level_id uuid primary key references public.custom_levels(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  level_data jsonb not null check (
    jsonb_typeof(level_data) = 'object'
    and octet_length(level_data::text) <= 8000000
  ),
  version integer not null default 1 check (version > 0),
  published_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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

create index if not exists custom_levels_owner_idx
  on public.custom_levels (owner_id, updated_at desc);
create index if not exists custom_level_permissions_user_idx
  on public.custom_level_permissions (user_id, updated_at desc);
create index if not exists published_custom_levels_updated_idx
  on public.published_custom_levels (updated_at desc);
create index if not exists published_custom_levels_published_idx
  on public.published_custom_levels (published_at desc);

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

alter table public.custom_levels enable row level security;
alter table public.custom_level_permissions enable row level security;
alter table public.published_custom_levels enable row level security;
alter table public.published_custom_level_versions enable row level security;

revoke all on table public.custom_levels from anon, authenticated;
revoke all on table public.custom_level_permissions from anon, authenticated;
revoke all on table public.published_custom_levels from anon, authenticated;
revoke all on table public.published_custom_level_versions from anon, authenticated;

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

drop policy if exists "Collaborators can leave shared levels" on public.custom_level_permissions;
create policy "Collaborators can leave shared levels"
  on public.custom_level_permissions for delete
  to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "Anyone can read published custom levels" on public.published_custom_levels;
create policy "Anyone can read published custom levels"
  on public.published_custom_levels for select
  to anon, authenticated
  using (true);

drop policy if exists "Current publications and owners can read version history" on public.published_custom_level_versions;
create policy "Current publications and owners can read version history"
  on public.published_custom_level_versions for select
  to anon, authenticated
  using (
    exists (select 1 from public.published_custom_levels current where current.level_id = published_custom_level_versions.level_id)
    or exists (select 1 from public.custom_levels draft where draft.id = published_custom_level_versions.level_id and draft.owner_id = (select auth.uid()))
  );

drop function if exists public.grant_custom_level_access(uuid, text, text);
create function public.grant_custom_level_access(
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

drop function if exists public.publish_custom_level(uuid);
create function public.publish_custom_level(p_level_id uuid)
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

drop function if exists public.list_published_custom_levels(text, text, integer, integer);
create function public.list_published_custom_levels(
  p_query text default '',
  p_sort text default 'newest',
  p_offset integer default 0,
  p_limit integer default 13
)
returns table (
  level_id uuid,
  level_name text,
  owner_name text,
  owner_username text,
  version integer,
  published_at timestamptz,
  updated_at timestamptz
)
language sql
security definer
set search_path = ''
stable
as $$
  select published.level_id,
    coalesce(nullif(btrim(published.level_data ->> 'name'), ''), 'Untitled Level'),
    profile.display_name,
    profile.username::text,
    published.version,
    published.published_at,
    published.updated_at
  from public.published_custom_levels published
  join public.player_profiles profile on profile.user_id = published.owner_id
  where left(btrim(coalesce(p_query, '')), 80) = ''
    or position(
      lower(left(btrim(coalesce(p_query, '')), 80)) in lower(concat_ws(' ',
        published.level_data ->> 'name', profile.display_name, profile.username::text
      ))
    ) > 0
  order by
    case when p_sort = 'updated' then published.updated_at end desc nulls last,
    case when p_sort <> 'updated' then published.published_at end desc nulls last,
    published.level_id
  offset least(greatest(coalesce(p_offset, 0), 0), 100000)
  limit least(greatest(coalesce(p_limit, 13), 1), 51);
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
grant insert (owner_id, title, level_data) on public.custom_levels to authenticated;
grant update (title, level_data) on public.custom_levels to authenticated;
grant delete on public.custom_levels to authenticated;
grant select, delete on public.custom_level_permissions to authenticated;
grant select (level_id, level_data, version, published_at, updated_at) on public.published_custom_levels to anon, authenticated;
grant select (level_id, version, level_data, published_at) on public.published_custom_level_versions to anon, authenticated;

revoke all on function public.grant_custom_level_access(uuid, text, text) from public;
revoke all on function public.remove_custom_level_access(uuid, uuid) from public;
revoke all on function public.leave_custom_level(uuid) from public;
revoke all on function public.publish_custom_level(uuid) from public;
revoke all on function public.unpublish_custom_level(uuid) from public;
revoke all on function public.get_published_custom_level(uuid) from public;
revoke all on function public.list_published_custom_levels(text, text, integer, integer) from public;
grant execute on function public.grant_custom_level_access(uuid, text, text) to authenticated;
grant execute on function public.remove_custom_level_access(uuid, uuid) to authenticated;
grant execute on function public.leave_custom_level(uuid) to authenticated;
grant execute on function public.publish_custom_level(uuid) to authenticated;
grant execute on function public.unpublish_custom_level(uuid) to authenticated;
grant execute on function public.get_published_custom_level(uuid) to anon, authenticated;
grant execute on function public.list_published_custom_levels(text, text, integer, integer) to anon, authenticated;

-- No public insert/update/delete grants exist for published snapshots.
-- Permission rows can only be deleted by their collaborator; owner-managed sharing stays behind RPCs.
