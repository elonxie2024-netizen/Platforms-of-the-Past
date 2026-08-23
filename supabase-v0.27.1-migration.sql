-- Safe metadata-only migration. v0.27.1 adds local save codes without changing campaign gameplay.
update public.leaderboard_rulesets
set
  label = 'Version 0.24.1 to 0.27.1',
  accepted_versions = case
    when 'v0.27.1' = any(accepted_versions) then accepted_versions
    else array_append(accepted_versions, 'v0.27.1')
  end
where id = 'crate-jump-collision-v1';
