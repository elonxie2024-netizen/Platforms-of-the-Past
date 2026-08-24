-- Run once after the v0.29.x collaboration migrations.
-- Adds a metadata-only public catalog for currently published custom levels.

create index if not exists published_custom_levels_published_idx
  on public.published_custom_levels (published_at desc);

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

revoke all on function public.list_published_custom_levels(text, text, integer, integer) from public;
grant execute on function public.list_published_custom_levels(text, text, integer, integer) to anon, authenticated;

update public.leaderboard_rulesets
set label = 'Version 0.24.1 to 0.30.0',
    accepted_versions = case
      when 'v0.30.0' = any(accepted_versions) then accepted_versions
      else array_append(accepted_versions, 'v0.30.0')
    end
where id = 'crate-jump-collision-v1';
