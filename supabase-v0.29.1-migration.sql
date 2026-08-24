-- Safe metadata-only migration. v0.29.1 tightens client-side workspace isolation without changing gameplay or database access rules.
update public.leaderboard_rulesets
set
  label = 'Version 0.24.1 to 0.29.1',
  accepted_versions = case
    when 'v0.29.1' = any(accepted_versions) then accepted_versions
    else array_append(accepted_versions, 'v0.29.1')
  end
where id = 'crate-jump-collision-v1';
