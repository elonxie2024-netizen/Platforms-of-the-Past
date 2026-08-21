-- Safe metadata-only migration for the existing v0.24.1+ gameplay leaderboard.
-- v0.26.0 changes the editor, not campaign gameplay, so it shares this ruleset.
update public.leaderboard_rulesets
set
  label = 'Version 0.24.1 to 0.26.0',
  accepted_versions = case
    when 'v0.26.0' = any(accepted_versions) then accepted_versions
    else array_append(accepted_versions, 'v0.26.0')
  end
where id = 'crate-jump-collision-v1';
