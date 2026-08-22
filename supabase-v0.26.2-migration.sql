-- Safe metadata-only migration. v0.26.2 changes fullscreen layout, not campaign gameplay.
update public.leaderboard_rulesets
set
  label = 'Version 0.24.1 to 0.26.2',
  accepted_versions = case
    when 'v0.26.2' = any(accepted_versions) then accepted_versions
    else array_append(accepted_versions, 'v0.26.2')
  end
where id = 'crate-jump-collision-v1';
