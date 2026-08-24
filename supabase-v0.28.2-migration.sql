-- Safe metadata-only migration. v0.28.2 changes public-link routing without changing campaign gameplay.
update public.leaderboard_rulesets
set
  label = 'Version 0.24.1 to 0.28.2',
  accepted_versions = array(
    select distinct version
    from unnest(accepted_versions || array['v0.28.1', 'v0.28.2']) version
    order by version
  )
where id = 'crate-jump-collision-v1';
