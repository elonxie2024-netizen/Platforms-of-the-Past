-- Safe metadata-only migration for v0.30.2.

update public.leaderboard_rulesets
set label = 'Version 0.24.1 to 0.30.2',
    accepted_versions = case
      when 'v0.30.2' = any(accepted_versions) then accepted_versions
      else array_append(accepted_versions, 'v0.30.2')
    end
where id = 'crate-jump-collision-v1';
