-- Run this entire idempotent file in the Supabase SQL Editor after each database-backed release.
-- It creates or updates leaderboard, account-progress, private custom-level, sharing, publishing, and verification data with RLS.

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
  ('crate-jump-collision-v1', 'Version 0.24.1 to 0.35.0', array['v0.24.1', 'v0.24.2', 'v0.25.0', 'v0.26.0', 'v0.26.1', 'v0.26.2', 'v0.26.3', 'v0.26.4', 'v0.26.5', 'v0.26.6', 'v0.27.0', 'v0.27.1', 'v0.28.0', 'v0.28.1', 'v0.28.2', 'v0.29.0', 'v0.29.1', 'v0.30.0', 'v0.30.1', 'v0.30.2', 'v0.30.3', 'v0.31.0', 'v0.31.1', 'v0.32.0', 'v0.32.1', 'v0.33.0', 'v0.33.1', 'v0.33.2', 'v0.33.3', 'v0.34.0', 'v0.34.1', 'v0.34.2', 'v0.35.0']),
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
grant select (user_id, display_name, username) on public.player_profiles to anon;
grant select on public.player_profiles to authenticated;
grant insert (user_id, display_name, username) on public.player_profiles to authenticated;
grant update (display_name, username, updated_at) on public.player_profiles to authenticated;
grant select, insert, update on public.player_progress to authenticated;
revoke all on function public.merge_player_progress(integer, integer[], text[], boolean) from public;
grant execute on function public.merge_player_progress(integer, integer[], text[], boolean) to authenticated;

-- Intentionally grant no update or delete permissions to public leaderboard visitors.

-- v0.28.0: account-owned custom-level drafts, collaboration permissions, and public snapshots.
-- v0.28.0 foundation: account-owned drafts, collaboration permissions, and public snapshots.

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

drop function if exists public.get_published_custom_level(uuid);
create function public.get_published_custom_level(p_level_id uuid)
returns table (
  level_id uuid,
  owner_id uuid,
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
  select published.level_id, published.owner_id, profile.display_name, profile.username::text,
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
  owner_id uuid,
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
    published.owner_id,
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

create table if not exists public.custom_level_completions (
  user_id uuid not null references auth.users(id) on delete cascade,
  level_id uuid not null references public.custom_levels(id) on delete cascade,
  level_version integer not null check (level_version >= 1),
  level_name text not null check (char_length(btrim(level_name)) between 1 and 80),
  seconds numeric(10,3) not null check (seconds > 0 and seconds <= 86400),
  stars smallint not null check (stars >= 0),
  stars_available smallint not null check (stars_available >= 0),
  deaths integer not null check (deaths >= 0),
  difficulty_score integer not null check (difficulty_score >= 1),
  completed_at timestamptz not null default now(),
  primary key (user_id, level_id, level_version)
);

create index if not exists custom_level_completions_profile_idx
  on public.custom_level_completions (user_id, difficulty_score desc, seconds asc);

alter table public.custom_level_completions enable row level security;

drop policy if exists "Players can read their custom clears" on public.custom_level_completions;
create policy "Players can read their custom clears"
  on public.custom_level_completions for select
  to authenticated
  using (user_id = (select auth.uid()));

drop function if exists public.record_custom_level_completion(uuid, integer, numeric, integer, integer);
create function public.record_custom_level_completion(
  p_level_id uuid,
  p_level_version integer,
  p_seconds numeric,
  p_stars integer,
  p_deaths integer
)
returns public.custom_level_completions
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
  snapshot jsonb;
  snapshot_name text;
  object_count integer := 0;
  star_count integer := 0;
  difficulty integer := 1;
  result public.custom_level_completions;
begin
  if current_user_id is null then raise exception 'Authentication required'; end if;
  if p_seconds is null or p_seconds <= 0 or p_seconds > 86400 then raise exception 'Invalid completion time'; end if;
  if p_deaths is null or p_deaths < 0 or p_deaths > 100000 then raise exception 'Invalid death count'; end if;

  select published.level_data,
    coalesce(nullif(btrim(published.level_data ->> 'name'), ''), 'Untitled Level')
  into snapshot, snapshot_name
  from public.published_custom_levels published
  where published.level_id = p_level_id and published.version = p_level_version;
  if snapshot is null then raise exception 'Published level version is unavailable'; end if;

  select count(*)::integer,
    count(*) filter (where object ->> 'type' in ('star', 'enemy'))::integer,
    greatest(1, (
      count(*)
      + coalesce(sum(case object ->> 'type'
          when 'hazard' then 5
          when 'movingObstacle' then 7
          when 'enemy' then 5
          when 'breakableBlock' then 3
          when 'crate' then 3
          when 'movingPlatform' then 3
          when 'controlledPlatform' then 4
          when 'rewindPlatform' then 5
          when 'switch' then 2
          when 'pressurePlate' then 2
          when 'jumpPad' then 1
          else 0 end), 0)
      + greatest(0, coalesce((snapshot ->> 'width')::numeric, 960) - 960) / 160
      + case when snapshot #>> '{settings,rewind,enabled}' = 'true' then 8 else 0 end
      + case when snapshot #>> '{settings,echo,enabled}' = 'true' then 8 else 0 end
    )::integer)
  into object_count, star_count, difficulty
  from jsonb_array_elements(coalesce(snapshot -> 'objects', '[]'::jsonb)) object;

  insert into public.custom_level_completions as existing (
    user_id, level_id, level_version, level_name, seconds, stars,
    stars_available, deaths, difficulty_score, completed_at
  ) values (
    current_user_id, p_level_id, p_level_version, left(snapshot_name, 80),
    round(p_seconds, 3), least(greatest(coalesce(p_stars, 0), 0), star_count),
    star_count, p_deaths, difficulty, now()
  )
  on conflict (user_id, level_id, level_version) do update set
    level_name = excluded.level_name,
    seconds = least(existing.seconds, excluded.seconds),
    stars = greatest(existing.stars, excluded.stars),
    stars_available = excluded.stars_available,
    deaths = least(existing.deaths, excluded.deaths),
    difficulty_score = excluded.difficulty_score,
    completed_at = now()
  returning * into result;
  return result;
end;
$$;

drop function if exists public.get_public_player_profile(uuid);
create function public.get_public_player_profile(p_user_id uuid)
returns table (user_id uuid, display_name text, username text)
language sql
security definer
set search_path = ''
stable
as $$
  select profile.user_id, profile.display_name, profile.username::text
  from public.player_profiles profile
  where profile.user_id = p_user_id;
$$;

drop function if exists public.list_public_profile_categories(uuid, integer);
create function public.list_public_profile_categories(p_user_id uuid, p_limit integer default 12)
returns table (
  leaderboard_id text,
  leaderboard_label text,
  run_type_id text,
  run_type_label text,
  ranking_metric text,
  seconds numeric,
  stars smallint,
  score numeric,
  world_rank bigint
)
language sql
security definer
set search_path = ''
stable
as $$
  with competitor_runs as (
    select ranked.* from (
      select score_row.*,
        row_number() over (
          partition by score_row.leaderboard_id, score_row.run_type_id, score_row.ranking_metric,
            coalesce(score_row.user_id::text, 'guest:' || score_row.id::text)
          order by
            case when score_row.ranking_metric = 'time' then score_row.seconds end asc nulls last,
            case when score_row.ranking_metric = 'stars' then score_row.stars end desc nulls last,
            case when score_row.ranking_metric = 'score' then score_row.score end desc nulls last,
            score_row.seconds asc, score_row.stars desc, score_row.score desc, score_row.created_at asc
        ) as player_row
      from public.leaderboard_scores score_row
    ) ranked
    where ranked.player_row = 1
  ), placed as (
    select competitor_runs.*,
      rank() over (
        partition by competitor_runs.leaderboard_id, competitor_runs.run_type_id, competitor_runs.ranking_metric
        order by
          case when competitor_runs.ranking_metric = 'time' then competitor_runs.seconds end asc nulls last,
          case when competitor_runs.ranking_metric = 'stars' then competitor_runs.stars end desc nulls last,
          case when competitor_runs.ranking_metric = 'score' then competitor_runs.score end desc nulls last,
          competitor_runs.seconds asc, competitor_runs.stars desc, competitor_runs.score desc, competitor_runs.created_at asc
      ) as placement
    from competitor_runs
  )
  select placed.leaderboard_id, ruleset.label,
    placed.run_type_id,
    case when placed.run_type_id = 'classic' then 'Classic adventure' else concat(
      case split_part(placed.run_type_id, ':', 1)
        when 'complete-all' then 'Complete all levels' when 'specific' then 'Specific levels'
        when 'all-stars' then 'Collect all stars' when 'all-hazards' then 'Die to every hazard'
        when 'all-mechanics' then 'Activate every mechanic' else 'Custom run' end,
      case when split_part(placed.run_type_id, ':', 1) = 'specific'
        then ' (' || replace(split_part(placed.run_type_id, ':', 2), '-', ', ') || ')' else '' end,
      case split_part(placed.run_type_id, ':', 3)
        when 'no-stars' then ' · No stars' when 'all-stars' then ' · All stars'
        when 'all-hazards' then ' · Every hazard' when 'all-mechanics' then ' · Every mechanic'
        else '' end
    ) end,
    placed.ranking_metric, placed.seconds, placed.stars, placed.score, placed.placement
  from placed
  join public.leaderboard_rulesets ruleset on ruleset.id = placed.leaderboard_id
  where placed.user_id = p_user_id and placed.ranking_metric = 'time'
  order by placed.placement, placed.seconds, placed.created_at
  limit least(greatest(coalesce(p_limit, 12), 1), 30);
$$;

drop function if exists public.list_public_profile_levels(uuid);
create function public.list_public_profile_levels(p_user_id uuid)
returns table (level_id uuid, level_name text, version integer, published_at timestamptz, updated_at timestamptz)
language sql
security definer
set search_path = ''
stable
as $$
  select published.level_id,
    coalesce(nullif(btrim(published.level_data ->> 'name'), ''), 'Untitled Level'),
    published.version, published.published_at, published.updated_at
  from public.published_custom_levels published
  where published.owner_id = p_user_id
  order by published.updated_at desc, published.level_id
  limit 50;
$$;

drop function if exists public.list_public_profile_highlights(uuid);
create function public.list_public_profile_highlights(p_user_id uuid)
returns table (
  highlight_label text,
  level_id uuid,
  level_name text,
  level_version integer,
  seconds numeric,
  stars smallint,
  deaths integer,
  difficulty_score integer
)
language sql
security definer
set search_path = ''
stable
as $$
  with eligible as (
    select clear.*,
      (clear.difficulty_score * 100
        + case when clear.stars_available > 0 then clear.stars * 30 / clear.stars_available else 0 end
        - least(clear.deaths, 20) * 3
        - least(clear.seconds, 600)::integer / 20) as impressive_score
    from public.custom_level_completions clear
    join public.published_custom_levels published on published.level_id = clear.level_id
    where clear.user_id = p_user_id
  )
  select result.highlight_label, result.level_id, result.level_name, result.level_version,
    result.seconds, result.stars, result.deaths, result.difficulty_score
  from (
    (select 'Hardest Clear'::text as highlight_label, eligible.* from eligible
      order by eligible.difficulty_score desc, eligible.seconds asc limit 1)
    union all
    (select 'Fastest Clear'::text as highlight_label, eligible.* from eligible
      order by eligible.seconds asc, eligible.difficulty_score desc limit 1)
    union all
    (select 'Most Impressive'::text as highlight_label, eligible.* from eligible
      order by eligible.impressive_score desc, eligible.difficulty_score desc, eligible.seconds asc limit 1)
  ) result
  order by case result.highlight_label when 'Hardest Clear' then 1 when 'Fastest Clear' then 2 else 3 end;
$$;

grant select on public.custom_level_completions to authenticated;
revoke all on function public.record_custom_level_completion(uuid, integer, numeric, integer, integer) from public;
revoke all on function public.get_public_player_profile(uuid) from public;
revoke all on function public.list_public_profile_categories(uuid, integer) from public;
revoke all on function public.list_public_profile_levels(uuid) from public;
revoke all on function public.list_public_profile_highlights(uuid) from public;
grant execute on function public.record_custom_level_completion(uuid, integer, numeric, integer, integer) to authenticated;
grant execute on function public.get_public_player_profile(uuid) to anon, authenticated;
grant execute on function public.list_public_profile_categories(uuid, integer) to anon, authenticated;
grant execute on function public.list_public_profile_levels(uuid) to anon, authenticated;
grant execute on function public.list_public_profile_highlights(uuid) to anon, authenticated;

-- v0.34.0-v0.34.1: exact-version verification, hardened run evidence, and reversible Survival review.

create table if not exists public.published_custom_level_status (
  level_id uuid not null references public.custom_levels(id) on delete cascade,
  level_version integer not null check (level_version > 0),
  level_type text not null check (level_type in ('exit', 'exit-stars', 'survival')),
  required_stars integer not null default 0 check (required_stars >= 0),
  verification_status text not null check (verification_status in ('unverified', 'verified', 'ranked')),
  verified_run_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (level_id, level_version),
  constraint published_custom_level_status_published_version_fkey
    foreign key (level_id, level_version) references public.published_custom_level_versions(level_id, version) on delete cascade
);

create table if not exists public.custom_level_runs (
  id uuid primary key default gen_random_uuid(),
  run_ticket_id uuid unique,
  level_id uuid not null references public.custom_levels(id) on delete cascade,
  level_version integer not null check (level_version > 0),
  user_id uuid references auth.users(id) on delete set null,
  runner_name text not null check (char_length(btrim(runner_name)) between 1 and 24 and runner_name !~ '[[:cntrl:]]'),
  level_type text not null check (level_type in ('exit', 'exit-stars', 'survival')),
  seconds numeric(12,3) not null check (seconds > 0 and seconds <= 86400),
  stars smallint not null check (stars >= 0),
  reached_exit boolean not null default false,
  fly_ever boolean not null default false,
  cheat_ever boolean not null default false,
  replay_data jsonb not null check (jsonb_typeof(replay_data) = 'object' and octet_length(replay_data::text) <= 4000000),
  strategy_fingerprint text check (strategy_fingerprint is null or strategy_fingerprint ~ '^[a-f0-9]{8,64}$'),
  ranking_status text not null default 'valid' check (ranking_status in ('valid', 'disputed', 'invalidated', 'restored')),
  status_reason text,
  invalidated_by_report uuid,
  created_at timestamptz not null default now()
);

alter table public.custom_level_runs
  add column if not exists run_ticket_id uuid;

create table if not exists public.custom_level_run_tickets (
  id uuid primary key default gen_random_uuid(),
  level_id uuid not null,
  level_version integer not null,
  user_id uuid references auth.users(id) on delete cascade,
  issued_at timestamptz not null default clock_timestamp(),
  expires_at timestamptz not null default (clock_timestamp() + interval '24 hours'),
  used_at timestamptz,
  foreign key (level_id, level_version)
    references public.published_custom_level_status(level_id, level_version) on delete cascade,
  check (expires_at > issued_at)
);

create unique index if not exists custom_level_runs_ticket_idx
  on public.custom_level_runs (run_ticket_id) where run_ticket_id is not null;
create index if not exists custom_level_run_tickets_expiry_idx
  on public.custom_level_run_tickets (expires_at) where used_at is null;

alter table public.published_custom_level_status
  drop constraint if exists published_custom_level_status_verified_run_id_fkey;
alter table public.published_custom_level_status
  add constraint published_custom_level_status_verified_run_id_fkey
  foreign key (verified_run_id) references public.custom_level_runs(id) on delete set null;

alter table public.published_custom_level_status
  drop constraint if exists published_custom_level_status_published_version_fkey;
alter table public.published_custom_level_status
  add constraint published_custom_level_status_published_version_fkey
  foreign key (level_id, level_version)
  references public.published_custom_level_versions(level_id, version) on delete cascade;

alter table public.custom_level_runs
  drop constraint if exists custom_level_runs_published_version_fkey;
alter table public.custom_level_runs
  add constraint custom_level_runs_published_version_fkey
  foreign key (level_id, level_version)
  references public.published_custom_level_status(level_id, level_version) on delete cascade;

alter table public.custom_level_runs
  drop constraint if exists custom_level_runs_ticket_fkey;
alter table public.custom_level_runs
  add constraint custom_level_runs_ticket_fkey
  foreign key (run_ticket_id) references public.custom_level_run_tickets(id) on delete set null;

create table if not exists public.survival_exploit_reports (
  id uuid primary key default gen_random_uuid(),
  level_id uuid not null references public.custom_levels(id) on delete cascade,
  level_version integer not null check (level_version > 0),
  run_id uuid not null references public.custom_level_runs(id) on delete cascade,
  reporter_id uuid not null references auth.users(id) on delete cascade,
  strategy_fingerprint text not null check (strategy_fingerprint ~ '^[a-f0-9]{8,64}$'),
  description text not null check (char_length(btrim(description)) between 12 and 1000 and description !~ '[[:cntrl:]]'),
  evidence_url text check (evidence_url is null or (char_length(evidence_url) <= 500 and evidence_url ~ '^https?://')),
  decision_status text not null default 'disputed' check (decision_status in ('valid', 'disputed', 'invalidated', 'restored')),
  ever_invalidated boolean not null default false,
  created_at timestamptz not null default now(),
  decided_at timestamptz,
  unique (run_id, reporter_id)
);

alter table public.survival_exploit_reports
  add column if not exists ever_invalidated boolean not null default false;
update public.survival_exploit_reports
  set ever_invalidated = true
  where decision_status in ('invalidated', 'restored') and not ever_invalidated;

alter table public.custom_level_runs
  drop constraint if exists custom_level_runs_invalidated_by_report_fkey;
alter table public.custom_level_runs
  add constraint custom_level_runs_invalidated_by_report_fkey
  foreign key (invalidated_by_report) references public.survival_exploit_reports(id) on delete set null;

create table if not exists public.survival_exploit_votes (
  report_id uuid not null references public.survival_exploit_reports(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  vote text not null check (vote in ('valid', 'invalidated')),
  updated_at timestamptz not null default now(),
  primary key (report_id, user_id)
);

create index if not exists custom_level_runs_board_idx
  on public.custom_level_runs (level_id, level_version, seconds, created_at);
create index if not exists custom_level_runs_fingerprint_idx
  on public.custom_level_runs (level_id, level_version, strategy_fingerprint)
  where strategy_fingerprint is not null;
create index if not exists survival_reports_level_idx
  on public.survival_exploit_reports (level_id, level_version, decision_status, created_at desc);

alter table public.published_custom_level_status enable row level security;
alter table public.custom_level_runs enable row level security;
alter table public.custom_level_run_tickets enable row level security;
alter table public.survival_exploit_reports enable row level security;
alter table public.survival_exploit_votes enable row level security;

drop policy if exists "Anyone can read published level status" on public.published_custom_level_status;
create policy "Anyone can read published level status" on public.published_custom_level_status
  for select to anon, authenticated using (
    exists (select 1 from public.published_custom_levels current where current.level_id = published_custom_level_status.level_id)
  );
drop policy if exists "Anyone can read published level runs" on public.custom_level_runs;
create policy "Anyone can read published level runs" on public.custom_level_runs
  for select to anon, authenticated using (
    exists (select 1 from public.published_custom_levels current where current.level_id = custom_level_runs.level_id)
  );
-- Run tickets are private bearer records. They are issued and consumed only through RPCs.
drop policy if exists "Anyone can read Survival reports" on public.survival_exploit_reports;
create policy "Anyone can read Survival reports" on public.survival_exploit_reports
  for select to anon, authenticated using (
    exists (select 1 from public.published_custom_levels current where current.level_id = survival_exploit_reports.level_id)
  );
drop policy if exists "Anyone can read Survival votes" on public.survival_exploit_votes;
create policy "Anyone can read Survival votes" on public.survival_exploit_votes
  for select to anon, authenticated using (true);

create or replace function public.resolve_level_type(p_level_data jsonb)
returns text language sql immutable set search_path = '' as $$
  select case
    when p_level_data #>> '{settings,levelType}' in ('exit', 'exit-stars', 'survival')
      then p_level_data #>> '{settings,levelType}'
    when coalesce((p_level_data #>> '{settings,requiredStars}')::integer, 0) > 0 then 'exit-stars'
    else 'exit'
  end;
$$;

create or replace function public.publish_custom_level(p_level_id uuid)
returns public.published_custom_levels
language plpgsql security definer set search_path = '' as $$
declare
  current_user_id uuid := (select auth.uid());
  draft public.custom_levels;
  next_version integer;
  result public.published_custom_levels;
  resolved_type text;
  required_count integer;
begin
  if current_user_id is null then raise exception 'Authentication required'; end if;
  select * into draft from public.custom_levels where id = p_level_id and owner_id = current_user_id for update;
  if draft.id is null then raise exception 'Only the owner can publish this level'; end if;
  resolved_type := public.resolve_level_type(draft.level_data);
  required_count := case when resolved_type = 'exit-stars'
    then greatest(1, coalesce((draft.level_data #>> '{settings,requiredStars}')::integer, 0)) else 0 end;
  select coalesce(max(history.version), 0) + 1 into next_version
    from public.published_custom_level_versions history where history.level_id = draft.id;
  insert into public.published_custom_levels as current (level_id, owner_id, level_data, version, published_at, updated_at)
    values (draft.id, draft.owner_id, draft.level_data, next_version, now(), now())
    on conflict (level_id) do update set level_data = excluded.level_data, version = excluded.version, updated_at = now()
    returning * into result;
  insert into public.published_custom_level_versions (level_id, version, level_data, published_at)
    values (draft.id, next_version, draft.level_data, result.updated_at);
  insert into public.published_custom_level_status (level_id, level_version, level_type, required_stars, verification_status, updated_at)
    values (draft.id, next_version, resolved_type, required_count,
      case when resolved_type = 'survival' then 'ranked' else 'unverified' end, now());
  return result;
end;
$$;

insert into public.published_custom_level_versions (level_id, version, level_data, published_at)
select current.level_id, current.version, current.level_data, current.updated_at
from public.published_custom_levels current
on conflict (level_id, version) do nothing;

insert into public.published_custom_level_status (level_id, level_version, level_type, required_stars, verification_status)
select history.level_id, history.version, public.resolve_level_type(history.level_data),
  case when public.resolve_level_type(history.level_data) = 'exit-stars'
    then greatest(1, coalesce((history.level_data #>> '{settings,requiredStars}')::integer, 0)) else 0 end,
  case when public.resolve_level_type(history.level_data) = 'survival' then 'ranked' else 'unverified' end
from public.published_custom_level_versions history
on conflict (level_id, level_version) do nothing;

drop function if exists public.issue_custom_level_run_ticket(uuid, integer);
create function public.issue_custom_level_run_ticket(p_level_id uuid, p_level_version integer)
returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  ticket_id uuid;
begin
  if not exists (
    select 1 from public.published_custom_levels current
    where current.level_id = p_level_id and current.version = p_level_version
  ) then raise exception 'Published level version is unavailable'; end if;

  insert into public.custom_level_run_tickets (level_id, level_version, user_id)
  values (p_level_id, p_level_version, (select auth.uid()))
  returning id into ticket_id;
  return ticket_id;
end;
$$;
revoke all on function public.issue_custom_level_run_ticket(uuid, integer) from public;

create or replace function public.custom_level_run_evidence_error(
  p_level_data jsonb,
  p_run_ticket uuid,
  p_level_id uuid,
  p_level_version integer,
  p_level_type text,
  p_seconds numeric,
  p_stars integer,
  p_reached_exit boolean,
  p_fly_ever boolean,
  p_cheat_ever boolean,
  p_replay_data jsonb
)
returns text
language plpgsql immutable set search_path = '' as $$
declare
  samples jsonb;
  actions jsonb;
  sample_item jsonb;
  action_item jsonb;
  action_name text;
  sample_count integer;
  action_star_count integer;
  placed_star_count integer;
  enemy_count integer;
  previous_time numeric := null;
  previous_x numeric := null;
  previous_y numeric := null;
  sample_time numeric;
  sample_x numeric;
  sample_y numeric;
  sample_mask integer;
  delta_time numeric;
  last_time numeric := null;
  last_x numeric := null;
  last_y numeric := null;
  exit_x numeric;
  exit_y numeric;
  exit_width numeric;
  exit_height numeric;
  spawn_x numeric;
  is_truncated boolean;
begin
  if jsonb_typeof(p_replay_data) <> 'object' or p_replay_data ->> 'format' <> 'POTP-RUN-1' then
    return 'Invalid run evidence';
  end if;
  if p_replay_data ->> 'runTicket' is distinct from p_run_ticket::text then
    return 'Run evidence does not match its server ticket';
  end if;
  if p_replay_data ->> 'levelId' is distinct from p_level_id::text
     or coalesce((p_replay_data ->> 'levelVersion')::integer, 0) <> p_level_version then
    return 'Run evidence belongs to another published version';
  end if;
  if jsonb_typeof(p_replay_data -> 'integrity') <> 'object'
     or (p_replay_data #>> '{integrity,flyEver}')::boolean is distinct from coalesce(p_fly_ever, false)
     or (p_replay_data #>> '{integrity,cheatEver}')::boolean is distinct from coalesce(p_cheat_ever, false) then
    return 'Run integrity flags are inconsistent';
  end if;
  if coalesce((p_replay_data ->> 'endStars')::integer, -1) <> coalesce(p_stars, 0) then
    return 'Run star evidence is inconsistent';
  end if;

  samples := p_replay_data -> 'samples';
  actions := p_replay_data -> 'actions';
  if jsonb_typeof(samples) <> 'array' or jsonb_typeof(actions) <> 'array' then return 'Run evidence is incomplete'; end if;
  sample_count := jsonb_array_length(samples);
  if sample_count < 1 or sample_count > 3600 or jsonb_array_length(actions) > 10000 then return 'Run evidence has an invalid length'; end if;
  is_truncated := coalesce((p_replay_data ->> 'truncated')::boolean, false);
  if is_truncated and (sample_count < 2700 or p_seconds < 675) then return 'Truncated run evidence is inconsistent'; end if;
  if not is_truncated and sample_count < greatest(1, floor(p_seconds)::integer) then return 'Run evidence has too few checkpoints'; end if;

  for sample_item in select value from jsonb_array_elements(samples) loop
    if jsonb_typeof(sample_item) <> 'array' or jsonb_array_length(sample_item) < 6
       or jsonb_typeof(sample_item -> 0) <> 'number'
       or jsonb_typeof(sample_item -> 1) <> 'number'
       or jsonb_typeof(sample_item -> 2) <> 'number'
       or jsonb_typeof(sample_item -> 3) <> 'number'
       or jsonb_typeof(sample_item -> 4) <> 'number'
       or jsonb_typeof(sample_item -> 5) <> 'number' then return 'Run checkpoint is malformed'; end if;
    sample_time := (sample_item ->> 0)::numeric;
    sample_x := (sample_item ->> 1)::numeric;
    sample_y := (sample_item ->> 2)::numeric;
    sample_mask := (sample_item ->> 5)::integer;
    if sample_time < 0 or sample_mask < 0 or sample_mask > 63 then return 'Run checkpoint contains unsupported input'; end if;
    if sample_x < -5 or sample_x > coalesce((p_level_data ->> 'width')::numeric, 0) + 5
       or sample_y < -5000 or sample_y > 10000 then return 'Run checkpoint is outside the level'; end if;
    if previous_time is not null then
      delta_time := (sample_time - previous_time) / 1000;
      if delta_time < 0 then return 'Run checkpoint time moved backward'; end if;
      if abs(sample_x - previous_x) > 60 + 3000 * delta_time
         or abs(sample_y - previous_y) > 80 + 3000 * delta_time then return 'Run motion is not physically plausible'; end if;
    elsif not is_truncated and sample_time > 1000 then return 'Run evidence does not begin near the timer start';
    end if;
    previous_time := sample_time; previous_x := sample_x; previous_y := sample_y;
    last_time := sample_time; last_x := sample_x; last_y := sample_y;
  end loop;

  if abs(last_time - p_seconds * 1000) > 1000 then return 'Run time does not match its checkpoints'; end if;
  if p_seconds > 0 and p_level_type <> 'survival' and p_seconds < .05 then return 'Completion time is not physically plausible'; end if;
  spawn_x := coalesce((p_level_data #>> '{spawn,x}')::numeric, 0);
  if p_level_type <> 'survival' and p_seconds + .02 < greatest(0, abs(last_x - spawn_x) - 30) / 3000 then
    return 'Completion time is not physically plausible';
  end if;

  select count(*) filter (where object ->> 'type' = 'star')::integer,
    count(*) filter (where object ->> 'type' = 'enemy')::integer
  into placed_star_count, enemy_count
  from jsonb_array_elements(coalesce(p_level_data -> 'objects', '[]'::jsonb)) object;
  if p_stars < 0 or p_stars > placed_star_count + enemy_count then return 'Claimed stars exceed the published level'; end if;

  action_star_count := 0;
  for action_item in select value from jsonb_array_elements(actions) loop
    if jsonb_typeof(action_item) <> 'array' or jsonb_array_length(action_item) < 2
       or jsonb_typeof(action_item -> 0) <> 'number' or jsonb_typeof(action_item -> 1) <> 'string' then
      return 'Run action evidence is malformed';
    end if;
    action_name := action_item ->> 1;
    if action_name ~ '^star:[0-9]+$' then
      if split_part(action_name, ':', 2)::integer >= placed_star_count then return 'Run references an unavailable star'; end if;
    elsif action_name ~ '^enemy-star:[0-9]+$' then
      if split_part(action_name, ':', 2)::integer >= enemy_count then return 'Run references an unavailable enemy star'; end if;
    end if;
  end loop;
  select count(distinct action.value ->> 1)::integer into action_star_count
  from jsonb_array_elements(actions) action(value)
  where action.value ->> 1 ~ '^(star|enemy-star):[0-9]+$';
  if action_star_count <> p_stars then return 'Run star count does not match collection evidence'; end if;

  if p_level_type = 'survival' then
    if coalesce(p_reached_exit, false) then return 'Survival runs cannot complete through the exit'; end if;
  else
    if not coalesce(p_reached_exit, false) then return 'The exit was not reached'; end if;
    exit_x := (p_level_data #>> '{exit,x}')::numeric;
    exit_y := (p_level_data #>> '{exit,y}')::numeric;
    exit_width := (p_level_data #>> '{exit,width}')::numeric;
    exit_height := (p_level_data #>> '{exit,height}')::numeric;
    if not (last_x < exit_x + exit_width and last_x + 30 > exit_x
      and last_y < exit_y + exit_height and last_y + 42 > exit_y) then
      return 'Final checkpoint does not reach the exit';
    end if;
  end if;
  return null;
exception when others then
  return 'Malformed run evidence';
end;
$$;
revoke all on function public.custom_level_run_evidence_error(jsonb, uuid, uuid, integer, text, numeric, integer, boolean, boolean, boolean, jsonb) from public;

drop function if exists public.submit_custom_level_run(uuid, integer, text, numeric, integer, boolean, boolean, boolean, jsonb, text);
drop function if exists public.submit_custom_level_run(uuid, uuid, integer, text, numeric, integer, boolean, boolean, boolean, jsonb, text);
create function public.submit_custom_level_run(
  p_run_ticket uuid, p_level_id uuid, p_level_version integer, p_runner_name text, p_seconds numeric,
  p_stars integer, p_reached_exit boolean, p_fly_ever boolean, p_cheat_ever boolean,
  p_replay_data jsonb, p_strategy_fingerprint text default null
)
returns public.custom_level_runs
language plpgsql security definer set search_path = '' as $$
declare
  current_user_id uuid := (select auth.uid());
  ticket public.custom_level_run_tickets;
  snapshot jsonb;
  status_row public.published_custom_level_status;
  clean_name text;
  clean_fingerprint text;
  evidence_error text;
  safe_replay jsonb;
  safe_seconds numeric;
  safe_stars integer;
  available_stars integer := 0;
  wall_seconds numeric;
  integrity_ok boolean;
  completion_ok boolean;
  strategy_review text;
  result public.custom_level_runs;
begin
  if p_run_ticket is null then raise exception 'A server-issued run ticket is required'; end if;
  select * into ticket from public.custom_level_run_tickets
    where id = p_run_ticket for update;
  if ticket.id is null then raise exception 'Run ticket is unavailable'; end if;
  if ticket.used_at is not null then raise exception 'Run ticket has already been used'; end if;
  if ticket.expires_at <= clock_timestamp() then raise exception 'Run ticket has expired'; end if;
  if ticket.level_id <> p_level_id or ticket.level_version <> p_level_version then
    raise exception 'Run ticket belongs to another published version';
  end if;
  if ticket.user_id is distinct from current_user_id then
    raise exception 'Run ticket belongs to another account session';
  end if;

  select history.level_data into snapshot from public.published_custom_level_versions history
    where history.level_id = p_level_id and history.version = p_level_version;
  select * into status_row from public.published_custom_level_status
    where level_id = p_level_id and level_version = p_level_version;
  if snapshot is null or status_row.level_id is null then raise exception 'Published level version is unavailable'; end if;
  if not exists (select 1 from public.published_custom_levels current where current.level_id = p_level_id)
    then raise exception 'Level is not currently published'; end if;

  select count(*) filter (where object ->> 'type' in ('star', 'enemy'))::integer
    into available_stars
    from jsonb_array_elements(coalesce(snapshot -> 'objects', '[]'::jsonb)) object;
  safe_seconds := least(86400, greatest(.001, coalesce(p_seconds, .001)));
  safe_stars := least(available_stars, greatest(0, coalesce(p_stars, 0)));
  safe_replay := case
    when jsonb_typeof(p_replay_data) = 'object' and octet_length(p_replay_data::text) <= 4000000
      then p_replay_data
    else jsonb_build_object('format', 'POTP-REJECTED-1', 'reason', 'Invalid run evidence')
  end;
  wall_seconds := extract(epoch from (clock_timestamp() - ticket.issued_at));
  evidence_error := case
    when p_seconds is null or p_seconds <= 0 or p_seconds > 86400 then 'Invalid run time'
    when p_stars is null or p_stars < 0 or p_stars > available_stars then 'Claimed stars exceed the published level'
    when p_seconds > wall_seconds + 2 then 'Run time exceeds the server-issued session'
    else public.custom_level_run_evidence_error(
      snapshot, p_run_ticket, p_level_id, p_level_version, status_row.level_type,
      p_seconds, p_stars, p_reached_exit, p_fly_ever, p_cheat_ever, p_replay_data
    ) end;

  if current_user_id is not null then
    select profile.display_name into clean_name from public.player_profiles profile where profile.user_id = current_user_id;
  else clean_name := left(regexp_replace(btrim(coalesce(p_runner_name, 'Guest')), '[[:cntrl:]]', '', 'g'), 24);
  end if;
  if clean_name is null or char_length(clean_name) < 1 then clean_name := 'Guest'; end if;
  clean_fingerprint := case when coalesce(p_strategy_fingerprint, '') ~ '^[a-f0-9]{8,64}$'
    then p_strategy_fingerprint else null end;
  integrity_ok := evidence_error is null
    and not coalesce(p_fly_ever, false) and not coalesce(p_cheat_ever, false);
  completion_ok := evidence_error is null and (status_row.level_type = 'survival' or (
    coalesce(p_reached_exit, false) and
    (status_row.level_type <> 'exit-stars' or coalesce(p_stars, 0) >= status_row.required_stars)
  ));
  if status_row.level_type = 'survival' and clean_fingerprint is not null and integrity_ok then
    select case
      when exists (select 1 from public.survival_exploit_reports report where report.level_id = p_level_id and report.level_version = p_level_version and report.strategy_fingerprint = clean_fingerprint and report.decision_status = 'invalidated') then 'invalidated'
      when exists (select 1 from public.survival_exploit_reports report where report.level_id = p_level_id and report.level_version = p_level_version and report.strategy_fingerprint = clean_fingerprint and report.decision_status = 'disputed') then 'disputed'
      else null end into strategy_review;
  end if;
  update public.custom_level_run_tickets set used_at = clock_timestamp() where id = ticket.id;
  insert into public.custom_level_runs (
    run_ticket_id, level_id, level_version, user_id, runner_name, level_type, seconds, stars, reached_exit,
    fly_ever, cheat_ever, replay_data, strategy_fingerprint, ranking_status, status_reason
  ) values (
    ticket.id, p_level_id, p_level_version, current_user_id, clean_name, status_row.level_type,
    round(safe_seconds, 3), safe_stars, coalesce(p_reached_exit, false),
    coalesce(p_fly_ever, false), coalesce(p_cheat_ever, false), safe_replay,
    case when status_row.level_type = 'survival' then clean_fingerprint else null end,
    case when not integrity_ok or not completion_ok then 'invalidated'
      when strategy_review = 'invalidated' then 'invalidated'
      when strategy_review = 'disputed' then 'disputed' else 'valid' end,
    case when evidence_error is not null then evidence_error
      when not integrity_ok then 'Cheats used' when not completion_ok then 'Incomplete run'
      when strategy_review = 'invalidated' then 'Invalid strategy'
      when strategy_review = 'disputed' then 'Disputed motion' else null end
  ) returning * into result;
  if integrity_ok and completion_ok and status_row.level_type <> 'survival'
     and status_row.verification_status = 'unverified' then
    update public.published_custom_level_status set verification_status = 'verified', verified_run_id = result.id, updated_at = now()
      where level_id = p_level_id and level_version = p_level_version;
  end if;
  return result;
end;
$$;
revoke all on function public.submit_custom_level_run(uuid, uuid, integer, text, numeric, integer, boolean, boolean, boolean, jsonb, text) from public;

drop function if exists public.record_custom_level_completion(uuid, integer, numeric, integer, integer);
drop function if exists public.record_custom_level_completion(uuid, integer);
create function public.record_custom_level_completion(
  p_run_id uuid,
  p_deaths integer
)
returns public.custom_level_completions
language plpgsql security definer set search_path = '' as $$
declare
  current_user_id uuid := (select auth.uid());
  accepted_run public.custom_level_runs;
  snapshot jsonb;
  snapshot_name text;
  star_count integer := 0;
  difficulty integer := 1;
  result public.custom_level_completions;
begin
  if current_user_id is null then raise exception 'Authentication required'; end if;
  if p_deaths is null or p_deaths < 0 or p_deaths > 100000 then raise exception 'Invalid death count'; end if;

  select * into accepted_run
  from public.custom_level_runs run
  where run.id = p_run_id
    and run.user_id = current_user_id
    and run.level_type <> 'survival'
    and run.ranking_status in ('valid', 'restored');
  if accepted_run.id is null then raise exception 'A validated completion run is required'; end if;

  select history.level_data,
    coalesce(nullif(btrim(history.level_data ->> 'name'), ''), 'Untitled Level')
  into snapshot, snapshot_name
  from public.published_custom_level_versions history
  where history.level_id = accepted_run.level_id and history.version = accepted_run.level_version;
  if snapshot is null then raise exception 'Published level version is unavailable'; end if;

  select count(*) filter (where object ->> 'type' in ('star', 'enemy'))::integer,
    greatest(1, (
      count(*)
      + coalesce(sum(case object ->> 'type'
          when 'hazard' then 5 when 'movingObstacle' then 7 when 'enemy' then 5
          when 'breakableBlock' then 3 when 'crate' then 3 when 'movingPlatform' then 3
          when 'controlledPlatform' then 4 when 'rewindPlatform' then 5
          when 'switch' then 2 when 'pressurePlate' then 2 when 'jumpPad' then 1 else 0 end), 0)
      + greatest(0, coalesce((snapshot ->> 'width')::numeric, 960) - 960) / 160
      + case when snapshot #>> '{settings,rewind,enabled}' = 'true' then 8 else 0 end
      + case when snapshot #>> '{settings,echo,enabled}' = 'true' then 8 else 0 end
    )::integer)
  into star_count, difficulty
  from jsonb_array_elements(coalesce(snapshot -> 'objects', '[]'::jsonb)) object;

  insert into public.custom_level_completions as existing (
    user_id, level_id, level_version, level_name, seconds, stars,
    stars_available, deaths, difficulty_score, completed_at
  ) values (
    current_user_id, accepted_run.level_id, accepted_run.level_version, left(snapshot_name, 80),
    accepted_run.seconds, least(accepted_run.stars, star_count), star_count,
    p_deaths, difficulty, now()
  )
  on conflict (user_id, level_id, level_version) do update set
    level_name = excluded.level_name,
    seconds = least(existing.seconds, excluded.seconds),
    stars = greatest(existing.stars, excluded.stars),
    stars_available = excluded.stars_available,
    deaths = least(existing.deaths, excluded.deaths),
    difficulty_score = excluded.difficulty_score,
    completed_at = now()
  returning * into result;
  return result;
end;
$$;
revoke all on function public.record_custom_level_completion(uuid, integer) from public;

drop function if exists public.list_custom_level_runs(uuid, integer, integer, integer);
create function public.list_custom_level_runs(p_level_id uuid, p_level_version integer, p_offset integer default 0, p_limit integer default 25)
returns table (run_id uuid, user_id uuid, runner_name text, seconds numeric, stars smallint, ranking_status text, status_reason text, display_rank bigint, created_at timestamptz)
language sql security definer set search_path = '' stable as $$
  with ordered as (
    select run.*,
      sum(case when run.ranking_status in ('valid', 'restored') then 1 else 0 end) over (
        order by case when run.level_type = 'survival' then run.seconds end desc,
          case when run.level_type <> 'survival' then run.seconds end asc, run.created_at, run.id
      ) as valid_position
    from public.custom_level_runs run
    where run.level_id = p_level_id and run.level_version = p_level_version
      and exists (select 1 from public.published_custom_levels current where current.level_id = p_level_id)
  )
  select ordered.id, ordered.user_id, ordered.runner_name, ordered.seconds, ordered.stars,
    ordered.ranking_status, ordered.status_reason,
    case when ordered.ranking_status in ('valid', 'restored') then ordered.valid_position else null end,
    ordered.created_at
  from ordered
  order by case when ordered.level_type = 'survival' then ordered.seconds end desc,
    case when ordered.level_type <> 'survival' then ordered.seconds end asc, ordered.created_at, ordered.id
  offset least(greatest(coalesce(p_offset, 0), 0), 100000)
  limit least(greatest(coalesce(p_limit, 25), 1), 100);
$$;

drop function if exists public.report_survival_strategy(uuid, text, text);
create function public.report_survival_strategy(p_run_id uuid, p_description text, p_evidence_url text default null)
returns public.survival_exploit_reports
language plpgsql security definer set search_path = '' as $$
declare current_user_id uuid := (select auth.uid()); target public.custom_level_runs; result public.survival_exploit_reports;
begin
  if current_user_id is null then raise exception 'Authentication required'; end if;
  select * into target from public.custom_level_runs where id = p_run_id and level_type = 'survival';
  if target.id is null or target.strategy_fingerprint is null then raise exception 'Survival run evidence is unavailable'; end if;
  if target.fly_ever or target.cheat_ever
     or target.status_reason is not null and target.status_reason not in ('Disputed motion', 'Invalid strategy') then
    raise exception 'Only integrity-valid Survival runs can be reviewed';
  end if;
  if not exists (select 1 from public.published_custom_levels current where current.level_id = target.level_id)
    then raise exception 'Level is not currently published'; end if;
  insert into public.survival_exploit_reports (level_id, level_version, run_id, reporter_id, strategy_fingerprint, description, evidence_url)
    values (target.level_id, target.level_version, target.id, current_user_id, target.strategy_fingerprint,
      btrim(p_description), nullif(btrim(coalesce(p_evidence_url, '')), '')) returning * into result;
  update public.custom_level_runs set ranking_status = 'disputed', status_reason = 'Disputed motion'
    where level_id = target.level_id and level_version = target.level_version
      and strategy_fingerprint = target.strategy_fingerprint and ranking_status in ('valid', 'restored');
  return result;
end;
$$;

drop function if exists public.vote_survival_strategy(uuid, text);
create function public.vote_survival_strategy(p_report_id uuid, p_vote text)
returns public.survival_exploit_reports
language plpgsql security definer set search_path = '' as $$
declare current_user_id uuid := (select auth.uid()); report public.survival_exploit_reports; invalid_votes integer; valid_votes integer; new_state text;
begin
  if current_user_id is null then raise exception 'Authentication required'; end if;
  if p_vote not in ('valid', 'invalidated') then raise exception 'Vote must be valid or invalidated'; end if;
  select * into report from public.survival_exploit_reports where id = p_report_id for update;
  if report.id is null then raise exception 'Report not found'; end if;
  if not exists (select 1 from public.published_custom_levels current where current.level_id = report.level_id)
    then raise exception 'Level is not currently published'; end if;
  insert into public.survival_exploit_votes (report_id, user_id, vote, updated_at)
    values (report.id, current_user_id, p_vote, now())
    on conflict (report_id, user_id) do update set vote = excluded.vote, updated_at = now();
  select count(*) filter (where vote = 'invalidated'), count(*) filter (where vote = 'valid')
    into invalid_votes, valid_votes from public.survival_exploit_votes where report_id = report.id;
  new_state := case
    when invalid_votes + valid_votes < 3 then 'disputed'
    when invalid_votes * 3 >= (invalid_votes + valid_votes) * 2 then 'invalidated'
    when valid_votes * 3 >= (invalid_votes + valid_votes) * 2 then case when report.ever_invalidated or report.decision_status in ('invalidated', 'restored') then 'restored' else 'valid' end
    else 'disputed' end;
  update public.survival_exploit_reports set decision_status = new_state,
    ever_invalidated = report.ever_invalidated or new_state = 'invalidated',
    decided_at = case when new_state in ('valid', 'invalidated', 'restored') then now() else null end
    where id = report.id returning * into report;
  if exists (select 1 from public.survival_exploit_reports other where other.level_id = report.level_id and other.level_version = report.level_version and other.strategy_fingerprint = report.strategy_fingerprint and other.decision_status = 'invalidated') then
    update public.custom_level_runs set ranking_status = 'invalidated', status_reason = 'Invalid strategy',
      invalidated_by_report = (select other.id from public.survival_exploit_reports other where other.level_id = report.level_id and other.level_version = report.level_version and other.strategy_fingerprint = report.strategy_fingerprint and other.decision_status = 'invalidated' order by other.created_at limit 1)
      where level_id = report.level_id and level_version = report.level_version and strategy_fingerprint = report.strategy_fingerprint;
  elsif exists (select 1 from public.survival_exploit_reports other where other.level_id = report.level_id and other.level_version = report.level_version and other.strategy_fingerprint = report.strategy_fingerprint and other.decision_status = 'disputed') then
    update public.custom_level_runs set ranking_status = 'disputed', status_reason = 'Disputed motion', invalidated_by_report = null
      where level_id = report.level_id and level_version = report.level_version and strategy_fingerprint = report.strategy_fingerprint;
  else
    update public.custom_level_runs set ranking_status = 'restored', status_reason = null, invalidated_by_report = null
      where level_id = report.level_id and level_version = report.level_version and strategy_fingerprint = report.strategy_fingerprint;
  end if;
  return report;
end;
$$;

drop function if exists public.get_custom_level_review_state(uuid, integer);
create function public.get_custom_level_review_state(p_level_id uuid, p_level_version integer)
returns table (report_id uuid, run_id uuid, strategy_fingerprint text, description text, evidence_url text, decision_status text, invalid_votes bigint, valid_votes bigint, created_at timestamptz)
language sql security definer set search_path = '' stable as $$
  select report.id, report.run_id, report.strategy_fingerprint, report.description, report.evidence_url,
    report.decision_status, count(vote.report_id) filter (where vote.vote = 'invalidated'),
    count(vote.report_id) filter (where vote.vote = 'valid'), report.created_at
  from public.survival_exploit_reports report
  left join public.survival_exploit_votes vote on vote.report_id = report.id
  where report.level_id = p_level_id and report.level_version = p_level_version
    and exists (select 1 from public.published_custom_levels current where current.level_id = p_level_id)
  group by report.id order by report.created_at desc;
$$;

drop function if exists public.get_published_custom_level(uuid);
create function public.get_published_custom_level(p_level_id uuid)
returns table (level_id uuid, owner_id uuid, owner_name text, owner_username text, level_data jsonb, version integer, published_at timestamptz, updated_at timestamptz, level_type text, required_stars integer, verification_status text, review_status text)
language sql security definer set search_path = '' stable as $$
  select published.level_id, published.owner_id, profile.display_name, profile.username::text,
    published.level_data, published.version, published.published_at, published.updated_at,
    status.level_type, status.required_stars, status.verification_status,
    case when exists (select 1 from public.survival_exploit_reports report where report.level_id = published.level_id and report.level_version = published.version and report.decision_status = 'invalidated') then 'invalidated'
      when exists (select 1 from public.survival_exploit_reports report where report.level_id = published.level_id and report.level_version = published.version and report.decision_status = 'disputed') then 'disputed'
      else 'valid' end
  from public.published_custom_levels published
  join public.player_profiles profile on profile.user_id = published.owner_id
  join public.published_custom_level_status status on status.level_id = published.level_id and status.level_version = published.version
  where published.level_id = p_level_id;
$$;

drop function if exists public.list_published_custom_levels(text, text, integer, integer);
create function public.list_published_custom_levels(p_query text default '', p_sort text default 'newest', p_offset integer default 0, p_limit integer default 13)
returns table (level_id uuid, owner_id uuid, level_name text, owner_name text, owner_username text, version integer, published_at timestamptz, updated_at timestamptz, level_type text, required_stars integer, verification_status text, review_status text)
language sql security definer set search_path = '' stable as $$
  select published.level_id, published.owner_id,
    coalesce(nullif(btrim(published.level_data ->> 'name'), ''), 'Untitled Level'), profile.display_name, profile.username::text,
    published.version, published.published_at, published.updated_at, status.level_type, status.required_stars, status.verification_status,
    case when exists (select 1 from public.survival_exploit_reports report where report.level_id = published.level_id and report.level_version = published.version and report.decision_status = 'invalidated') then 'invalidated'
      when exists (select 1 from public.survival_exploit_reports report where report.level_id = published.level_id and report.level_version = published.version and report.decision_status = 'disputed') then 'disputed'
      else 'valid' end
  from public.published_custom_levels published
  join public.player_profiles profile on profile.user_id = published.owner_id
  join public.published_custom_level_status status on status.level_id = published.level_id and status.level_version = published.version
  where left(btrim(coalesce(p_query, '')), 80) = '' or position(lower(left(btrim(coalesce(p_query, '')), 80)) in lower(concat_ws(' ', published.level_data ->> 'name', profile.display_name, profile.username::text))) > 0
  order by case when p_sort = 'updated' then published.updated_at end desc nulls last,
    case when p_sort <> 'updated' then published.published_at end desc nulls last, published.level_id
  offset least(greatest(coalesce(p_offset, 0), 0), 100000)
  limit least(greatest(coalesce(p_limit, 13), 1), 51);
$$;

revoke all on table public.published_custom_level_status, public.custom_level_run_tickets, public.custom_level_runs, public.survival_exploit_reports, public.survival_exploit_votes from anon, authenticated;
grant select on public.published_custom_level_status, public.survival_exploit_reports, public.survival_exploit_votes to anon, authenticated;
revoke all on function public.resolve_level_type(jsonb) from public;
revoke all on function public.issue_custom_level_run_ticket(uuid, integer) from public;
revoke all on function public.custom_level_run_evidence_error(jsonb, uuid, uuid, integer, text, numeric, integer, boolean, boolean, boolean, jsonb) from public;
revoke all on function public.submit_custom_level_run(uuid, uuid, integer, text, numeric, integer, boolean, boolean, boolean, jsonb, text) from public;
revoke all on function public.list_custom_level_runs(uuid, integer, integer, integer) from public;
revoke all on function public.report_survival_strategy(uuid, text, text) from public;
revoke all on function public.vote_survival_strategy(uuid, text) from public;
revoke all on function public.get_custom_level_review_state(uuid, integer) from public;
revoke all on function public.get_published_custom_level(uuid) from public;
revoke all on function public.list_published_custom_levels(text, text, integer, integer) from public;
grant execute on function public.issue_custom_level_run_ticket(uuid, integer) to anon, authenticated;
grant execute on function public.submit_custom_level_run(uuid, uuid, integer, text, numeric, integer, boolean, boolean, boolean, jsonb, text) to anon, authenticated;
grant execute on function public.record_custom_level_completion(uuid, integer) to authenticated;
grant execute on function public.list_custom_level_runs(uuid, integer, integer, integer) to anon, authenticated;
grant execute on function public.report_survival_strategy(uuid, text, text) to authenticated;
grant execute on function public.vote_survival_strategy(uuid, text) to authenticated;
grant execute on function public.get_custom_level_review_state(uuid, integer) to anon, authenticated;
grant execute on function public.get_published_custom_level(uuid) to anon, authenticated;
grant execute on function public.list_published_custom_levels(text, text, integer, integer) to anon, authenticated;

-- v0.35.0: public evidence intake plus service-role-only trusted replay validation.

alter table public.custom_level_runs
  add column if not exists validation_state text not null default 'legacy';
alter table public.custom_level_runs
  add column if not exists verifier_version text;
alter table public.custom_level_runs
  add column if not exists trusted_result jsonb;
alter table public.custom_level_runs
  add column if not exists validation_started_at timestamptz;
alter table public.custom_level_runs
  add column if not exists verified_at timestamptz;
alter table public.custom_level_completions
  add column if not exists verified_run_id uuid references public.custom_level_runs(id) on delete set null;
alter table public.custom_level_runs
  drop constraint if exists custom_level_runs_validation_state_check;
alter table public.custom_level_runs
  add constraint custom_level_runs_validation_state_check
  check (validation_state in ('legacy', 'pending', 'processing', 'trusted', 'rejected'));
alter table public.custom_level_runs alter column validation_state set default 'pending';

-- Rows created before v0.35.0 remain available as historical evidence, but cannot
-- acquire a trusted rank or verify a version without a new server-validated replay.
update public.published_custom_level_status status
set verification_status = 'unverified', verified_run_id = null, updated_at = now()
where status.verified_run_id is not null
  and exists (
    select 1 from public.custom_level_runs run
    where run.id = status.verified_run_id and run.validation_state = 'legacy'
  );

drop function if exists public.enqueue_custom_level_run(uuid, uuid, integer, text, jsonb, text);
create function public.enqueue_custom_level_run(
  p_run_ticket uuid,
  p_level_id uuid,
  p_level_version integer,
  p_runner_name text,
  p_replay_data jsonb,
  p_strategy_fingerprint text default null
)
returns public.custom_level_runs
language plpgsql security definer set search_path = '' as $$
declare
  current_user_id uuid := (select auth.uid());
  ticket public.custom_level_run_tickets;
  status_row public.published_custom_level_status;
  clean_name text;
  terminal_ms numeric;
  result public.custom_level_runs;
begin
  if p_run_ticket is null then raise exception 'A server-issued run ticket is required'; end if;
  select * into ticket from public.custom_level_run_tickets where id = p_run_ticket for update;
  if ticket.id is null then raise exception 'Run ticket is unavailable'; end if;
  if ticket.used_at is not null then raise exception 'Run ticket has already been used'; end if;
  if ticket.expires_at <= clock_timestamp() then raise exception 'Run ticket has expired'; end if;
  if ticket.level_id <> p_level_id or ticket.level_version <> p_level_version then
    raise exception 'Run ticket belongs to another published version';
  end if;
  if ticket.user_id is distinct from current_user_id then raise exception 'Run ticket belongs to another account session'; end if;
  if not exists (
    select 1 from public.published_custom_levels current
    where current.level_id = p_level_id and current.version = p_level_version
  ) then raise exception 'Published level version is unavailable'; end if;
  select * into status_row from public.published_custom_level_status
    where level_id = p_level_id and level_version = p_level_version;
  if status_row.level_id is null then raise exception 'Published level status is unavailable'; end if;

  if jsonb_typeof(p_replay_data) <> 'object'
     or p_replay_data ->> 'format' <> 'POTP-RUN-2'
     or octet_length(p_replay_data::text) > 1500000 then raise exception 'Invalid or oversized replay evidence'; end if;
  if p_replay_data ->> 'runTicket' is distinct from p_run_ticket::text
     or p_replay_data ->> 'levelId' is distinct from p_level_id::text
     or coalesce((p_replay_data ->> 'levelVersion')::integer, 0) <> p_level_version then
    raise exception 'Replay evidence belongs to another ticket or version';
  end if;
  if jsonb_typeof(p_replay_data -> 'inputEvents') <> 'array'
     or jsonb_typeof(p_replay_data -> 'checkpoints') <> 'array'
     or jsonb_typeof(p_replay_data -> 'actions') <> 'array'
     or jsonb_typeof(p_replay_data -> 'integrityEvents') <> 'array'
     or jsonb_typeof(p_replay_data -> 'terminal') <> 'object' then raise exception 'Replay evidence is incomplete'; end if;
  terminal_ms := (p_replay_data #>> '{terminal,atMs}')::numeric;
  if terminal_ms is null or terminal_ms <= 0 or terminal_ms > 3600000 then raise exception 'Replay duration is invalid'; end if;

  if current_user_id is not null then
    select profile.display_name into clean_name from public.player_profiles profile where profile.user_id = current_user_id;
  else
    clean_name := left(regexp_replace(btrim(coalesce(p_runner_name, 'Guest')), '[[:cntrl:]]', '', 'g'), 24);
  end if;
  if clean_name is null or char_length(clean_name) < 1 then clean_name := 'Guest'; end if;

  update public.custom_level_run_tickets set used_at = clock_timestamp() where id = ticket.id;
  insert into public.custom_level_runs (
    run_ticket_id, level_id, level_version, user_id, runner_name, level_type,
    seconds, stars, reached_exit, fly_ever, cheat_ever, replay_data,
    strategy_fingerprint, ranking_status, status_reason, validation_state
  ) values (
    ticket.id, p_level_id, p_level_version, current_user_id, clean_name, status_row.level_type,
    round(terminal_ms / 1000, 3), 0, false, false, false, p_replay_data,
    case when status_row.level_type = 'survival' and coalesce(p_strategy_fingerprint, '') ~ '^[a-f0-9]{8,64}$'
      then p_strategy_fingerprint else null end,
    'invalidated', 'Pending trusted replay verification', 'pending'
  ) returning * into result;
  return result;
exception when invalid_text_representation or numeric_value_out_of_range then
  raise exception 'Replay evidence is malformed';
end;
$$;

drop function if exists public.claim_custom_level_run_verification(uuid);
create function public.claim_custom_level_run_verification(p_run_id uuid)
returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  run public.custom_level_runs;
  ticket public.custom_level_run_tickets;
  snapshot jsonb;
begin
  select * into run from public.custom_level_runs
  where id = p_run_id and (
    validation_state = 'pending'
    or (validation_state = 'processing' and validation_started_at < clock_timestamp() - interval '5 minutes')
  ) for update;
  if run.id is null then return null; end if;
  update public.custom_level_runs set validation_state = 'processing', validation_started_at = clock_timestamp()
    where id = run.id;
  select * into ticket from public.custom_level_run_tickets where id = run.run_ticket_id;
  select history.level_data into snapshot from public.published_custom_level_versions history
    where history.level_id = run.level_id and history.version = run.level_version;
  if ticket.id is null or snapshot is null then
    update public.custom_level_runs set validation_state = 'rejected', status_reason = 'Immutable replay context is unavailable'
      where id = run.id;
    return null;
  end if;
  return jsonb_build_object(
    'runId', run.id, 'levelId', run.level_id, 'levelVersion', run.level_version,
    'runTicket', ticket.id, 'issuedAt', ticket.issued_at, 'receivedAt', run.created_at,
    'levelData', snapshot, 'replayData', run.replay_data
  );
end;
$$;

drop function if exists public.finalize_custom_level_run_verification(uuid, jsonb);
create function public.finalize_custom_level_run_verification(p_run_id uuid, p_validation_result jsonb)
returns public.custom_level_runs
language plpgsql security definer set search_path = '' as $$
declare
  run public.custom_level_runs;
  status_row public.published_custom_level_status;
  accepted boolean := coalesce((p_validation_result ->> 'accepted')::boolean, false);
  derived_seconds numeric;
  derived_stars integer;
  derived_exit boolean;
  derived_fly boolean;
  derived_cheat boolean;
  verifier text;
  strategy_review text;
  result public.custom_level_runs;
begin
  select * into run from public.custom_level_runs where id = p_run_id and validation_state = 'processing' for update;
  if run.id is null then raise exception 'Pending replay is unavailable'; end if;
  select * into status_row from public.published_custom_level_status
    where level_id = run.level_id and level_version = run.level_version;
  verifier := left(coalesce(p_validation_result ->> 'verifierVersion', 'unknown'), 80);

  if accepted then
    derived_seconds := (p_validation_result ->> 'seconds')::numeric;
    derived_stars := (p_validation_result ->> 'stars')::integer;
    derived_exit := coalesce((p_validation_result ->> 'reachedExit')::boolean, false);
    derived_fly := coalesce((p_validation_result ->> 'flyEver')::boolean, false);
    derived_cheat := coalesce((p_validation_result ->> 'cheatEver')::boolean, false);
    if derived_seconds <= 0 or derived_seconds > 3600 or derived_stars < 0
       or derived_fly or derived_cheat
       or p_validation_result ->> 'levelType' is distinct from run.level_type
       or (run.level_type <> 'survival' and not derived_exit)
       or (run.level_type = 'exit-stars' and derived_stars < status_row.required_stars) then
      accepted := false;
      p_validation_result := jsonb_build_object(
        'accepted', false, 'reason', 'Trusted result failed database completion rules',
        'verifierVersion', verifier
      );
    end if;
  end if;

  if accepted and run.level_type = 'survival' and run.strategy_fingerprint is not null then
    select case
      when exists (select 1 from public.survival_exploit_reports report where report.level_id = run.level_id and report.level_version = run.level_version and report.strategy_fingerprint = run.strategy_fingerprint and report.decision_status = 'invalidated') then 'invalidated'
      when exists (select 1 from public.survival_exploit_reports report where report.level_id = run.level_id and report.level_version = run.level_version and report.strategy_fingerprint = run.strategy_fingerprint and report.decision_status = 'disputed') then 'disputed'
      else null end into strategy_review;
  end if;

  update public.custom_level_runs set
    seconds = case when accepted then round(derived_seconds, 3) else seconds end,
    stars = case when accepted then derived_stars else 0 end,
    reached_exit = case when accepted then derived_exit else false end,
    fly_ever = case when accepted then derived_fly else false end,
    cheat_ever = case when accepted then derived_cheat else false end,
    validation_state = case when accepted then 'trusted' else 'rejected' end,
    verifier_version = verifier,
    trusted_result = p_validation_result,
    verified_at = clock_timestamp(),
    ranking_status = case when not accepted then 'invalidated'
      when strategy_review = 'invalidated' then 'invalidated'
      when strategy_review = 'disputed' then 'disputed' else 'valid' end,
    status_reason = case when not accepted then left(coalesce(p_validation_result ->> 'reason', 'Replay validation failed'), 500)
      when strategy_review = 'invalidated' then 'Invalid strategy'
      when strategy_review = 'disputed' then 'Disputed motion' else null end
  where id = run.id returning * into result;

  if accepted and run.level_type <> 'survival' and status_row.verification_status = 'unverified' then
    update public.published_custom_level_status
      set verification_status = 'verified', verified_run_id = result.id, updated_at = now()
      where level_id = run.level_id and level_version = run.level_version;
  end if;
  return result;
exception when invalid_text_representation or numeric_value_out_of_range then
  update public.custom_level_runs set validation_state = 'rejected', ranking_status = 'invalidated',
    status_reason = 'Trusted verifier returned malformed results', verified_at = clock_timestamp()
    where id = p_run_id returning * into result;
  return result;
end;
$$;

drop function if exists public.list_custom_level_runs(uuid, integer, integer, integer);
create function public.list_custom_level_runs(
  p_level_id uuid, p_level_version integer, p_offset integer default 0, p_limit integer default 25
)
returns table (
  run_id uuid, user_id uuid, runner_name text, seconds numeric, stars smallint,
  ranking_status text, status_reason text, display_rank bigint, created_at timestamptz,
  validation_state text, verifier_version text
)
language sql security definer set search_path = '' stable as $$
  with ordered as (
    select run.*,
      sum(case when run.validation_state = 'trusted' and run.ranking_status in ('valid', 'restored') then 1 else 0 end) over (
        order by case when run.level_type = 'survival' then run.seconds end desc,
          case when run.level_type <> 'survival' then run.seconds end asc, run.created_at, run.id
      ) as valid_position
    from public.custom_level_runs run
    where run.level_id = p_level_id and run.level_version = p_level_version
      and exists (select 1 from public.published_custom_levels current where current.level_id = p_level_id)
  )
  select ordered.id, ordered.user_id, ordered.runner_name, ordered.seconds, ordered.stars,
    ordered.ranking_status, ordered.status_reason,
    case when ordered.validation_state = 'trusted' and ordered.ranking_status in ('valid', 'restored')
      then ordered.valid_position else null end,
    ordered.created_at, ordered.validation_state, ordered.verifier_version
  from ordered
  order by case when ordered.level_type = 'survival' then ordered.seconds end desc,
    case when ordered.level_type <> 'survival' then ordered.seconds end asc, ordered.created_at, ordered.id
  offset least(greatest(coalesce(p_offset, 0), 0), 100000)
  limit least(greatest(coalesce(p_limit, 25), 1), 100);
$$;

create or replace function public.record_custom_level_completion(p_run_id uuid, p_deaths integer)
returns public.custom_level_completions
language plpgsql security definer set search_path = '' as $$
declare
  current_user_id uuid := (select auth.uid());
  accepted_run public.custom_level_runs;
  snapshot jsonb;
  snapshot_name text;
  star_count integer := 0;
  difficulty integer := 1;
  result public.custom_level_completions;
begin
  if current_user_id is null then raise exception 'Authentication required'; end if;
  if p_deaths is null or p_deaths < 0 or p_deaths > 100000 then raise exception 'Invalid death count'; end if;
  select * into accepted_run from public.custom_level_runs run
  where run.id = p_run_id and run.user_id = current_user_id and run.level_type <> 'survival'
    and run.validation_state = 'trusted' and run.ranking_status in ('valid', 'restored');
  if accepted_run.id is null then raise exception 'A trusted replay completion is required'; end if;
  select history.level_data, coalesce(nullif(btrim(history.level_data ->> 'name'), ''), 'Untitled Level')
    into snapshot, snapshot_name from public.published_custom_level_versions history
    where history.level_id = accepted_run.level_id and history.version = accepted_run.level_version;
  if snapshot is null then raise exception 'Published level version is unavailable'; end if;
  select count(*) filter (where object ->> 'type' in ('star', 'enemy'))::integer,
    greatest(1, (count(*) + coalesce(sum(case object ->> 'type'
      when 'hazard' then 5 when 'movingObstacle' then 7 when 'enemy' then 5 when 'breakableBlock' then 3
      when 'crate' then 3 when 'movingPlatform' then 3 when 'controlledPlatform' then 4 when 'rewindPlatform' then 5
      when 'switch' then 2 when 'pressurePlate' then 2 when 'jumpPad' then 1 else 0 end), 0)
      + greatest(0, coalesce((snapshot ->> 'width')::numeric, 960) - 960) / 160
      + case when snapshot #>> '{settings,rewind,enabled}' = 'true' then 8 else 0 end
      + case when snapshot #>> '{settings,echo,enabled}' = 'true' then 8 else 0 end)::integer)
    into star_count, difficulty from jsonb_array_elements(coalesce(snapshot -> 'objects', '[]'::jsonb)) object;
  insert into public.custom_level_completions as existing (
    user_id, level_id, level_version, level_name, seconds, stars, stars_available, deaths,
    difficulty_score, completed_at, verified_run_id
  ) values (
    current_user_id, accepted_run.level_id, accepted_run.level_version, left(snapshot_name, 80), accepted_run.seconds,
    least(accepted_run.stars, star_count), star_count, p_deaths, difficulty, now(), accepted_run.id
  ) on conflict (user_id, level_id, level_version) do update set
    level_name = excluded.level_name, seconds = least(existing.seconds, excluded.seconds),
    stars = greatest(existing.stars, excluded.stars), stars_available = excluded.stars_available,
    deaths = least(existing.deaths, excluded.deaths), difficulty_score = excluded.difficulty_score,
    completed_at = now(), verified_run_id = excluded.verified_run_id
  returning * into result;
  return result;
end;
$$;

create or replace function public.report_survival_strategy(
  p_run_id uuid, p_description text, p_evidence_url text default null
)
returns public.survival_exploit_reports
language plpgsql security definer set search_path = '' as $$
declare
  current_user_id uuid := (select auth.uid());
  target public.custom_level_runs;
  result public.survival_exploit_reports;
begin
  if current_user_id is null then raise exception 'Authentication required'; end if;
  select * into target from public.custom_level_runs
    where id = p_run_id and level_type = 'survival' and validation_state = 'trusted';
  if target.id is null or target.strategy_fingerprint is null then
    raise exception 'Trusted Survival run evidence is unavailable';
  end if;
  if target.fly_ever or target.cheat_ever
     or target.status_reason is not null and target.status_reason not in ('Disputed motion', 'Invalid strategy') then
    raise exception 'Only integrity-valid Survival runs can be reviewed';
  end if;
  if not exists (select 1 from public.published_custom_levels current where current.level_id = target.level_id) then
    raise exception 'Level is not currently published';
  end if;
  insert into public.survival_exploit_reports (
    level_id, level_version, run_id, reporter_id, strategy_fingerprint, description, evidence_url
  ) values (
    target.level_id, target.level_version, target.id, current_user_id, target.strategy_fingerprint,
    btrim(p_description), nullif(btrim(coalesce(p_evidence_url, '')), '')
  ) returning * into result;
  update public.custom_level_runs set ranking_status = 'disputed', status_reason = 'Disputed motion'
    where level_id = target.level_id and level_version = target.level_version
      and validation_state = 'trusted' and strategy_fingerprint = target.strategy_fingerprint
      and ranking_status in ('valid', 'restored');
  return result;
end;
$$;

create or replace function public.list_public_profile_highlights(p_user_id uuid)
returns table (
  highlight_label text, level_id uuid, level_name text, level_version integer,
  seconds numeric, stars smallint, deaths integer, difficulty_score integer
)
language sql security definer set search_path = '' stable as $$
  with eligible as (
    select clear.*,
      (clear.difficulty_score * 100
        + case when clear.stars_available > 0 then clear.stars * 30 / clear.stars_available else 0 end
        - least(clear.deaths, 20) * 3
        - least(clear.seconds, 600)::integer / 20) as impressive_score
    from public.custom_level_completions clear
    join public.custom_level_runs trusted_run
      on trusted_run.id = clear.verified_run_id and trusted_run.validation_state = 'trusted'
    join public.published_custom_levels published on published.level_id = clear.level_id
    where clear.user_id = p_user_id
  )
  select result.highlight_label, result.level_id, result.level_name, result.level_version,
    result.seconds, result.stars, result.deaths, result.difficulty_score
  from (
    (select 'Hardest Clear'::text as highlight_label, eligible.* from eligible
      order by eligible.difficulty_score desc, eligible.seconds asc limit 1)
    union all
    (select 'Fastest Clear'::text as highlight_label, eligible.* from eligible
      order by eligible.seconds asc, eligible.difficulty_score desc limit 1)
    union all
    (select 'Most Impressive'::text as highlight_label, eligible.* from eligible
      order by eligible.impressive_score desc, eligible.difficulty_score desc, eligible.seconds asc limit 1)
  ) result
  order by case result.highlight_label when 'Hardest Clear' then 1 when 'Fastest Clear' then 2 else 3 end;
$$;

-- The old public decision RPC is intentionally removed. Public callers may only enqueue evidence.
drop function if exists public.submit_custom_level_run(uuid, uuid, integer, text, numeric, integer, boolean, boolean, boolean, jsonb, text);
revoke all on function public.enqueue_custom_level_run(uuid, uuid, integer, text, jsonb, text) from public;
revoke all on function public.claim_custom_level_run_verification(uuid) from public;
revoke all on function public.finalize_custom_level_run_verification(uuid, jsonb) from public;
grant execute on function public.enqueue_custom_level_run(uuid, uuid, integer, text, jsonb, text) to anon, authenticated;
grant execute on function public.claim_custom_level_run_verification(uuid) to service_role;
grant execute on function public.finalize_custom_level_run_verification(uuid, jsonb) to service_role;
grant execute on function public.list_custom_level_runs(uuid, integer, integer, integer) to anon, authenticated;
grant execute on function public.record_custom_level_completion(uuid, integer) to authenticated;
