-- Safe metadata-only migration for v0.33.1.
-- The leaderboard layout changed, but gameplay and ranking rules did not.

update public.leaderboard_rulesets
set label = 'Version 0.24.1 to 0.33.1',
    accepted_versions = case
      when 'v0.33.1' = any(accepted_versions) then accepted_versions
      else array_append(accepted_versions, 'v0.33.1')
    end
where id = 'crate-jump-collision-v1';
