-- v0.38.0: private account favorites and aggregate Community discovery.

create table if not exists public.custom_level_favorites (
  level_id uuid not null references public.custom_levels(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (level_id, user_id)
);

create index if not exists custom_level_favorites_user_idx
  on public.custom_level_favorites (user_id, created_at desc);
create index if not exists custom_level_favorites_level_idx
  on public.custom_level_favorites (level_id);

alter table public.custom_level_favorites enable row level security;
revoke all on table public.custom_level_favorites from anon, authenticated;

drop policy if exists "Players can read their own favorites" on public.custom_level_favorites;
create policy "Players can read their own favorites" on public.custom_level_favorites
  for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists "Players can add their own favorites" on public.custom_level_favorites;
create policy "Players can add their own favorites" on public.custom_level_favorites
  for insert to authenticated with check (user_id = (select auth.uid()));
drop policy if exists "Players can remove their own favorites" on public.custom_level_favorites;
create policy "Players can remove their own favorites" on public.custom_level_favorites
  for delete to authenticated using (user_id = (select auth.uid()));

drop function if exists public.set_custom_level_favorite(uuid, boolean);
create function public.set_custom_level_favorite(p_level_id uuid, p_favorited boolean)
returns table (favorited boolean, favorite_count bigint)
language plpgsql security definer set search_path = '' as $$
declare current_user_id uuid := (select auth.uid());
begin
  if current_user_id is null then raise exception 'Authentication required'; end if;
  if coalesce(p_favorited, false) then
    if not exists (
      select 1 from public.published_custom_levels published where published.level_id = p_level_id
    ) then raise exception 'Only published levels can be favorited'; end if;
    insert into public.custom_level_favorites (level_id, user_id)
      values (p_level_id, current_user_id)
      on conflict (level_id, user_id) do nothing;
  else
    delete from public.custom_level_favorites favorite
      where favorite.level_id = p_level_id and favorite.user_id = current_user_id;
  end if;
  return query select
    exists (
      select 1 from public.custom_level_favorites own
      where own.level_id = p_level_id and own.user_id = current_user_id
    ),
    (select count(*)::bigint from public.custom_level_favorites aggregate where aggregate.level_id = p_level_id);
end;
$$;

drop function if exists public.get_published_custom_level_details(uuid);
create function public.get_published_custom_level_details(p_level_id uuid)
returns table (
  level_id uuid, owner_id uuid, level_name text, owner_name text, owner_username text,
  version integer, published_at timestamptz, updated_at timestamptz, level_type text,
  required_stars integer, verification_status text, review_status text, objective text,
  player_best_seconds numeric, player_best_stars smallint, player_best_rank bigint,
  player_best_status text, favorite_count bigint, is_favorited boolean
)
language sql security definer set search_path = '' stable as $$
  with details as (
    select published.level_id, published.owner_id,
      coalesce(nullif(btrim(published.level_data ->> 'name'), ''), 'Untitled Level') as level_name,
      profile.display_name as owner_name, profile.username::text as owner_username,
      published.version, published.published_at, published.updated_at,
      status.level_type, status.required_stars, status.verification_status,
      case
        when exists (select 1 from public.survival_exploit_reports report
          where report.level_id = published.level_id and report.level_version = published.version
            and report.decision_status = 'invalidated') then 'invalidated'
        when exists (select 1 from public.survival_exploit_reports report
          where report.level_id = published.level_id and report.level_version = published.version
            and report.decision_status = 'disputed') then 'disputed'
        else 'valid'
      end as review_status,
      case status.level_type
        when 'survival' then 'Survive as long as possible.'
        when 'exit-stars' then concat('Collect at least ', status.required_stars, ' star',
          case when status.required_stars = 1 then '' else 's' end, ', then reach the exit.')
        else 'Reach the exit.'
      end as objective
    from public.published_custom_levels published
    join public.player_profiles profile on profile.user_id = published.owner_id
    join public.published_custom_level_status status
      on status.level_id = published.level_id and status.level_version = published.version
    where published.level_id = p_level_id
  ), ranked as (
    select run.user_id, run.seconds, run.stars, run.ranking_status,
      row_number() over (
        order by case when details.level_type = 'survival' then run.seconds end desc,
          case when details.level_type <> 'survival' then run.seconds end asc,
          run.created_at, run.id
      ) as display_rank
    from public.custom_level_runs run cross join details
    where run.level_id = details.level_id and run.level_version = details.version
      and run.validation_state = 'trusted' and run.ranking_status in ('valid', 'restored')
  )
  select details.level_id, details.owner_id, details.level_name, details.owner_name,
    details.owner_username, details.version, details.published_at, details.updated_at,
    details.level_type, details.required_stars, details.verification_status,
    details.review_status, details.objective,
    best.seconds, best.stars, best.display_rank, best.ranking_status,
    (select count(*)::bigint from public.custom_level_favorites favorite
      where favorite.level_id = details.level_id),
    exists (select 1 from public.custom_level_favorites own
      where own.level_id = details.level_id and own.user_id = (select auth.uid()))
  from details
  left join lateral (
    select ranked.seconds, ranked.stars, ranked.display_rank, ranked.ranking_status
    from ranked where ranked.user_id = (select auth.uid())
    order by ranked.display_rank limit 1
  ) best on true;
$$;

drop function if exists public.list_published_custom_levels(text, text, integer, integer);
drop function if exists public.list_published_custom_levels(text, text, integer, integer, boolean);
create function public.list_published_custom_levels(
  p_query text default '', p_sort text default 'newest', p_offset integer default 0,
  p_limit integer default 13, p_favorites_only boolean default false
)
returns table (
  level_id uuid, owner_id uuid, level_name text, owner_name text, owner_username text,
  version integer, published_at timestamptz, updated_at timestamptz, level_type text,
  required_stars integer, verification_status text, review_status text,
  favorite_count bigint, is_favorited boolean
)
language sql security definer set search_path = '' stable as $$
  with favorite_counts as (
    select favorite.level_id, count(*)::bigint as favorite_count
    from public.custom_level_favorites favorite group by favorite.level_id
  ), catalog as (
    select published.level_id, published.owner_id,
      coalesce(nullif(btrim(published.level_data ->> 'name'), ''), 'Untitled Level') as level_name,
      profile.display_name as owner_name, profile.username::text as owner_username,
      published.version, published.published_at, published.updated_at,
      status.level_type, status.required_stars, status.verification_status,
      case
        when exists (select 1 from public.survival_exploit_reports report
          where report.level_id = published.level_id and report.level_version = published.version
            and report.decision_status = 'invalidated') then 'invalidated'
        when exists (select 1 from public.survival_exploit_reports report
          where report.level_id = published.level_id and report.level_version = published.version
            and report.decision_status = 'disputed') then 'disputed'
        else 'valid'
      end as review_status,
      coalesce(favorite_counts.favorite_count, 0)::bigint as favorite_count,
      exists (select 1 from public.custom_level_favorites own
        where own.level_id = published.level_id and own.user_id = (select auth.uid())) as is_favorited
    from public.published_custom_levels published
    join public.player_profiles profile on profile.user_id = published.owner_id
    join public.published_custom_level_status status
      on status.level_id = published.level_id and status.level_version = published.version
    left join favorite_counts on favorite_counts.level_id = published.level_id
    where (
      left(btrim(coalesce(p_query, '')), 80) = ''
      or position(lower(left(btrim(coalesce(p_query, '')), 80)) in
        lower(concat_ws(' ', published.level_data ->> 'name', profile.display_name, profile.username::text))) > 0
    ) and (
      not coalesce(p_favorites_only, false)
      or exists (select 1 from public.custom_level_favorites own
        where own.level_id = published.level_id and own.user_id = (select auth.uid()))
    )
  )
  select catalog.* from catalog
  order by
    case when p_sort = 'favorites' then catalog.favorite_count end desc nulls last,
    case when p_sort = 'updated' then catalog.updated_at end desc nulls last,
    case when p_sort not in ('updated', 'favorites') then catalog.published_at end desc nulls last,
    catalog.level_id
  offset least(greatest(coalesce(p_offset, 0), 0), 100000)
  limit least(greatest(coalesce(p_limit, 13), 1), 51);
$$;

revoke all on function public.set_custom_level_favorite(uuid, boolean) from public;
revoke all on function public.get_published_custom_level_details(uuid) from public;
revoke all on function public.list_published_custom_levels(text, text, integer, integer, boolean) from public;
grant execute on function public.set_custom_level_favorite(uuid, boolean) to authenticated;
grant execute on function public.get_published_custom_level_details(uuid) to anon, authenticated;
grant execute on function public.list_published_custom_levels(text, text, integer, integer, boolean) to anon, authenticated;

update public.leaderboard_rulesets
set label = 'Custom Routes · Version 0.37.0 to 0.38.0',
    accepted_versions = array['v0.37.0', 'v0.37.1', 'v0.37.2', 'v0.38.0'], active = true
where id = 'full-custom-routes-v1';

update public.leaderboard_rulesets
set label = 'Classic Adventure · Version 0.24.1 to 0.38.0',
    accepted_versions = array_append(accepted_versions, 'v0.38.0'), active = true
where id = 'crate-jump-collision-v1' and not ('v0.38.0' = any(accepted_versions));

drop policy if exists "Anyone can submit validated scores" on public.leaderboard_scores;
create policy "Anyone can submit validated scores" on public.leaderboard_scores for insert
to anon, authenticated with check (
  exists (select 1 from public.leaderboard_rulesets ruleset
    where ruleset.id = leaderboard_id and ruleset.active and game_version = any(ruleset.accepted_versions))
  and char_length(run_type_id) between 1 and 500
  and (
    game_version not in ('v0.37.0', 'v0.37.1', 'v0.37.2', 'v0.38.0')
    or (leaderboard_id = 'crate-jump-collision-v1' and run_type_id = 'classic')
    or (leaderboard_id = 'full-custom-routes-v1' and run_type_id <> 'classic')
  )
  and (
    ((select auth.uid()) is null and user_id is null)
    or (user_id = (select auth.uid()) and name = (
      select profile.display_name from public.player_profiles profile where profile.user_id = (select auth.uid())
    ))
  )
);
