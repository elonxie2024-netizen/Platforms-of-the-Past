-- Safe metadata-only migration. v0.26.1 changes layout, not campaign gameplay.
update public.leaderboard_rulesets
set
  label = 'Version 0.24.1 to 0.26.1',
  accepted_versions = case
    when 'v0.26.1' = any(accepted_versions) then accepted_versions
    else array_append(accepted_versions, 'v0.26.1')
  end
where id = 'crate-jump-collision-v1';
