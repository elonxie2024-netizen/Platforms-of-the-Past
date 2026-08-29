-- v0.37.0: full custom-run routes use their own ruleset and support up to 44 route splits.

insert into public.leaderboard_rulesets (id, label, accepted_versions, active)
values
  ('full-custom-routes-v1', 'Custom Routes · Version 0.37.0', array['v0.37.0'], true),
  ('crate-jump-collision-v1', 'Classic Adventure · Version 0.24.1 to 0.37.0',
    array['v0.24.1', 'v0.24.2', 'v0.25.0', 'v0.26.0', 'v0.26.1', 'v0.26.2', 'v0.26.3', 'v0.26.4', 'v0.26.5', 'v0.26.6', 'v0.27.0', 'v0.27.1', 'v0.28.0', 'v0.28.1', 'v0.28.2', 'v0.29.0', 'v0.29.1', 'v0.30.0', 'v0.30.1', 'v0.30.2', 'v0.30.3', 'v0.31.0', 'v0.31.1', 'v0.32.0', 'v0.32.1', 'v0.33.0', 'v0.33.1', 'v0.33.2', 'v0.33.3', 'v0.34.0', 'v0.34.1', 'v0.34.2', 'v0.35.0', 'v0.35.1', 'v0.35.2', 'v0.36.0', 'v0.36.1', 'v0.36.2', 'v0.37.0'], true)
on conflict (id) do update set
  label = excluded.label,
  accepted_versions = excluded.accepted_versions,
  active = excluded.active;

alter table public.leaderboard_scores drop constraint if exists leaderboard_scores_stars_check;
alter table public.leaderboard_scores add constraint leaderboard_scores_stars_check check (stars between 0 and 500);

alter table public.leaderboard_scores drop constraint if exists leaderboard_scores_splits_check;
alter table public.leaderboard_scores add constraint leaderboard_scores_splits_check
  check (jsonb_typeof(splits) = 'array' and jsonb_array_length(splits) between 1 and 44);

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
      game_version <> 'v0.37.0'
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
