-- Safe metadata-only migration. v0.26.4 fixes editor validation without changing campaign gameplay.
update public.leaderboard_rulesets
set
  label = 'Version 0.24.1 to 0.26.4',
  accepted_versions = case
    when 'v0.26.4' = any(accepted_versions) then accepted_versions
    else array_append(accepted_versions, 'v0.26.4')
  end
where id = 'crate-jump-collision-v1';
