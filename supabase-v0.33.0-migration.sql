-- Run once after the v0.32.0 account/custom-level setup.
-- Adds public player profiles, authoritative published-level clear records, and creator IDs to publication RPCs.

update public.leaderboard_rulesets
set label = 'Version 0.24.1 to 0.33.0',
    accepted_versions = array_append(accepted_versions, 'v0.33.0')
where id = 'crate-jump-collision-v1'
  and not ('v0.33.0' = any(accepted_versions));

drop function if exists public.get_published_custom_level(uuid);
create function public.get_published_custom_level(p_level_id uuid)
returns table (
  level_id uuid, owner_id uuid, owner_name text, owner_username text,
  level_data jsonb, version integer, published_at timestamptz, updated_at timestamptz
)
language sql security definer set search_path = '' stable
as $$
  select published.level_id, published.owner_id, profile.display_name, profile.username::text,
    published.level_data, published.version, published.published_at, published.updated_at
  from public.published_custom_levels published
  join public.player_profiles profile on profile.user_id = published.owner_id
  where published.level_id = p_level_id;
$$;

drop function if exists public.list_published_custom_levels(text, text, integer, integer);
create function public.list_published_custom_levels(
  p_query text default '', p_sort text default 'newest',
  p_offset integer default 0, p_limit integer default 13
)
returns table (
  level_id uuid, owner_id uuid, level_name text, owner_name text, owner_username text,
  version integer, published_at timestamptz, updated_at timestamptz
)
language sql security definer set search_path = '' stable
as $$
  select published.level_id, published.owner_id,
    coalesce(nullif(btrim(published.level_data ->> 'name'), ''), 'Untitled Level'),
    profile.display_name, profile.username::text, published.version,
    published.published_at, published.updated_at
  from public.published_custom_levels published
  join public.player_profiles profile on profile.user_id = published.owner_id
  where left(btrim(coalesce(p_query, '')), 80) = ''
    or position(lower(left(btrim(coalesce(p_query, '')), 80)) in lower(concat_ws(' ',
      published.level_data ->> 'name', profile.display_name, profile.username::text))) > 0
  order by
    case when p_sort = 'updated' then published.updated_at end desc nulls last,
    case when p_sort <> 'updated' then published.published_at end desc nulls last,
    published.level_id
  offset least(greatest(coalesce(p_offset, 0), 0), 100000)
  limit least(greatest(coalesce(p_limit, 13), 1), 51);
$$;

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
create policy "Players can read their custom clears" on public.custom_level_completions
  for select to authenticated using (user_id = (select auth.uid()));

drop function if exists public.record_custom_level_completion(uuid, integer, numeric, integer, integer);
create function public.record_custom_level_completion(
  p_level_id uuid, p_level_version integer, p_seconds numeric, p_stars integer, p_deaths integer
)
returns public.custom_level_completions
language plpgsql security definer set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
  snapshot jsonb; snapshot_name text; star_count integer := 0; difficulty integer := 1;
  result public.custom_level_completions;
begin
  if current_user_id is null then raise exception 'Authentication required'; end if;
  if p_seconds is null or p_seconds <= 0 or p_seconds > 86400 then raise exception 'Invalid completion time'; end if;
  if p_deaths is null or p_deaths < 0 or p_deaths > 100000 then raise exception 'Invalid death count'; end if;

  select published.level_data, coalesce(nullif(btrim(published.level_data ->> 'name'), ''), 'Untitled Level')
  into snapshot, snapshot_name from public.published_custom_levels published
  where published.level_id = p_level_id and published.version = p_level_version;
  if snapshot is null then raise exception 'Published level version is unavailable'; end if;

  select count(*) filter (where object ->> 'type' in ('star', 'enemy'))::integer,
    greatest(1, (count(*) + coalesce(sum(case object ->> 'type'
      when 'hazard' then 5 when 'movingObstacle' then 7 when 'enemy' then 5
      when 'breakableBlock' then 3 when 'crate' then 3 when 'movingPlatform' then 3
      when 'controlledPlatform' then 4 when 'rewindPlatform' then 5
      when 'switch' then 2 when 'pressurePlate' then 2 when 'jumpPad' then 1 else 0 end), 0)
      + greatest(0, coalesce((snapshot ->> 'width')::numeric, 960) - 960) / 160
      + case when snapshot #>> '{settings,rewind,enabled}' = 'true' then 8 else 0 end
      + case when snapshot #>> '{settings,echo,enabled}' = 'true' then 8 else 0 end)::integer)
  into star_count, difficulty
  from jsonb_array_elements(coalesce(snapshot -> 'objects', '[]'::jsonb)) object;

  insert into public.custom_level_completions as existing
    (user_id, level_id, level_version, level_name, seconds, stars, stars_available, deaths, difficulty_score, completed_at)
  values (current_user_id, p_level_id, p_level_version, left(snapshot_name, 80), round(p_seconds, 3),
    least(greatest(coalesce(p_stars, 0), 0), star_count), star_count, p_deaths, difficulty, now())
  on conflict (user_id, level_id, level_version) do update set
    level_name = excluded.level_name, seconds = least(existing.seconds, excluded.seconds),
    stars = greatest(existing.stars, excluded.stars), stars_available = excluded.stars_available,
    deaths = least(existing.deaths, excluded.deaths), difficulty_score = excluded.difficulty_score,
    completed_at = now()
  returning * into result;
  return result;
end;
$$;

drop function if exists public.get_public_player_profile(uuid);
create function public.get_public_player_profile(p_user_id uuid)
returns table (user_id uuid, display_name text, username text)
language sql security definer set search_path = '' stable
as $$
  select profile.user_id, profile.display_name, profile.username::text
  from public.player_profiles profile where profile.user_id = p_user_id;
$$;

drop function if exists public.list_public_profile_categories(uuid, integer);
create function public.list_public_profile_categories(p_user_id uuid, p_limit integer default 12)
returns table (
  leaderboard_id text, leaderboard_label text, run_type_id text, run_type_label text,
  ranking_metric text, seconds numeric, stars smallint, score numeric, world_rank bigint
)
language sql security definer set search_path = '' stable
as $$
  with competitor_runs as (
    select ranked.* from (
      select score_row.*, row_number() over (
        partition by score_row.leaderboard_id, score_row.run_type_id, score_row.ranking_metric,
          coalesce(score_row.user_id::text, 'guest:' || score_row.id::text)
        order by case when score_row.ranking_metric = 'time' then score_row.seconds end asc nulls last,
          case when score_row.ranking_metric = 'stars' then score_row.stars end desc nulls last,
          case when score_row.ranking_metric = 'score' then score_row.score end desc nulls last,
          score_row.seconds asc, score_row.stars desc, score_row.score desc, score_row.created_at asc
      ) as player_row from public.leaderboard_scores score_row
    ) ranked where ranked.player_row = 1
  ), placed as (
    select competitor_runs.*, rank() over (
      partition by competitor_runs.leaderboard_id, competitor_runs.run_type_id, competitor_runs.ranking_metric
      order by case when competitor_runs.ranking_metric = 'time' then competitor_runs.seconds end asc nulls last,
        case when competitor_runs.ranking_metric = 'stars' then competitor_runs.stars end desc nulls last,
        case when competitor_runs.ranking_metric = 'score' then competitor_runs.score end desc nulls last,
        competitor_runs.seconds asc, competitor_runs.stars desc, competitor_runs.score desc, competitor_runs.created_at asc
    ) as placement from competitor_runs
  )
  select placed.leaderboard_id, ruleset.label, placed.run_type_id,
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
  from placed join public.leaderboard_rulesets ruleset on ruleset.id = placed.leaderboard_id
  where placed.user_id = p_user_id and placed.ranking_metric = 'time'
  order by placed.placement, placed.seconds, placed.created_at
  limit least(greatest(coalesce(p_limit, 12), 1), 30);
$$;

drop function if exists public.list_public_profile_levels(uuid);
create function public.list_public_profile_levels(p_user_id uuid)
returns table (level_id uuid, level_name text, version integer, published_at timestamptz, updated_at timestamptz)
language sql security definer set search_path = '' stable
as $$
  select published.level_id, coalesce(nullif(btrim(published.level_data ->> 'name'), ''), 'Untitled Level'),
    published.version, published.published_at, published.updated_at
  from public.published_custom_levels published where published.owner_id = p_user_id
  order by published.updated_at desc, published.level_id limit 50;
$$;

drop function if exists public.list_public_profile_highlights(uuid);
create function public.list_public_profile_highlights(p_user_id uuid)
returns table (
  highlight_label text, level_id uuid, level_name text, level_version integer,
  seconds numeric, stars smallint, deaths integer, difficulty_score integer
)
language sql security definer set search_path = '' stable
as $$
  with eligible as (
    select clear.*, (clear.difficulty_score * 100
      + case when clear.stars_available > 0 then clear.stars * 30 / clear.stars_available else 0 end
      - least(clear.deaths, 20) * 3 - least(clear.seconds, 600)::integer / 20) as impressive_score
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
revoke all on function public.get_published_custom_level(uuid) from public;
revoke all on function public.list_published_custom_levels(text, text, integer, integer) from public;
grant execute on function public.record_custom_level_completion(uuid, integer, numeric, integer, integer) to authenticated;
grant execute on function public.get_public_player_profile(uuid) to anon, authenticated;
grant execute on function public.list_public_profile_categories(uuid, integer) to anon, authenticated;
grant execute on function public.list_public_profile_levels(uuid) to anon, authenticated;
grant execute on function public.list_public_profile_highlights(uuid) to anon, authenticated;
grant execute on function public.get_published_custom_level(uuid) to anon, authenticated;
grant execute on function public.list_published_custom_levels(text, text, integer, integer) to anon, authenticated;
