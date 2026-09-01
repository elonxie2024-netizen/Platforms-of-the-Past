-- v0.37.2: accept the UX-only release on the unchanged v0.37 gameplay rulesets.

update public.leaderboard_rulesets
set label = 'Custom Routes · Version 0.37.0 to 0.37.2',
    accepted_versions = array['v0.37.0', 'v0.37.1', 'v0.37.2'],
    active = true
where id = 'full-custom-routes-v1';

update public.leaderboard_rulesets
set label = 'Classic Adventure · Version 0.24.1 to 0.37.2',
    accepted_versions = array_append(accepted_versions, 'v0.37.2'),
    active = true
where id = 'crate-jump-collision-v1'
  and not ('v0.37.2' = any(accepted_versions));

drop policy if exists "Anyone can submit validated scores" on public.leaderboard_scores;
create policy "Anyone can submit validated scores"
  on public.leaderboard_scores for insert
  to anon, authenticated
  with check (
    exists (
      select 1 from public.leaderboard_rulesets ruleset
      where ruleset.id = leaderboard_id
        and ruleset.active
        and game_version = any(ruleset.accepted_versions)
    )
    and char_length(run_type_id) between 1 and 500
    and (
      game_version not in ('v0.37.0', 'v0.37.1', 'v0.37.2')
      or (leaderboard_id = 'crate-jump-collision-v1' and run_type_id = 'classic')
      or (leaderboard_id = 'full-custom-routes-v1' and run_type_id <> 'classic')
    )
    and (
      ((select auth.uid()) is null and user_id is null)
      or (
        user_id = (select auth.uid())
        and name = (
          select profile.display_name from public.player_profiles profile
          where profile.user_id = (select auth.uid())
        )
      )
    )
  );
