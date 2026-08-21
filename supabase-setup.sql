-- Run this entire file once in the Supabase SQL Editor.
-- It creates the public leaderboard while keeping score calculation on the database.

create table if not exists public.leaderboard_rulesets (
  id text primary key,
  label text not null,
  accepted_versions text[] not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

insert into public.leaderboard_rulesets (id, label, accepted_versions)
values
  ('chapter-gauntlets-v1', 'Version 0.22.0 to 0.22.0', array['v0.22.0']),
  ('zero-delay-platform-v1', 'Version 0.21.4 to 0.21.5', array['v0.21.4', 'v0.21.5']),
  ('cargo-gate-star-v1', 'Version 0.21.3 to 0.21.3', array['v0.21.3']),
  ('cargo-gate-collision-v1', 'Version 0.21.2 to 0.21.2', array['v0.21.2']),
  ('blade-recall-corridor-v1', 'Version 0.21.1 to 0.21.1', array['v0.21.1']),
  ('combined-chapter-v1', 'Version 0.21.0 to 0.21.0', array['v0.21.0']),
  ('rewind-final-crossing-v1', 'Version 0.19.7 to 0.20.1', array['v0.19.7', 'v0.20.0', 'v0.20.1']),
  ('direct-chapter-timer-v1', 'Version 0.19.6 to 0.19.6', array['v0.19.6']),
  ('chapter-timer-continuation-v1', 'Version 0.19.5 to 0.19.5', array['v0.19.5']),
  ('echo-shortcut-fix-v1', 'Version 0.19.2 to 0.19.4', array['v0.19.2', 'v0.19.3', 'v0.19.4']),
  ('echo-route-preview-v1', 'Version 0.19.1 to 0.19.1', array['v0.19.1']),
  ('echo-final-v1', 'Version 0.19.0 to 0.19.0', array['v0.19.0']),
  ('echo-chapter-timing-v1', 'Version 0.18.0 to 0.18.0', array['v0.18.0']),
  ('first-echo-v1', 'Version 0.17.0 to 0.17.0', array['v0.17.0']),
  ('roadmap-rewind-timing-v1', 'Version 0.16.1 to 0.16.1', array['v0.16.1']),
  ('systemic-rewind-v1', 'Version 0.16.0 to 0.16.0', array['v0.16.0']),
  ('rewind-state-fix-v1', 'Version 0.15.3 to 0.15.3', array['v0.15.3']),
  ('rewind-hold-v1', 'Version 0.15.2 to 0.15.2', array['v0.15.2']),
  ('rewind-final-fix-v1', 'Version 0.15.1 to 0.15.1', array['v0.15.1']),
  ('rewind-final-v1', 'Version 0.15.0 to 0.15.0', array['v0.15.0']),
  ('dangerous-rewind-v1', 'Version 0.14.5 to 0.14.5', array['v0.14.5']),
  ('rewind-field-v1', 'Version 0.14.1 to 0.14.4', array['v0.14.1', 'v0.14.2', 'v0.14.3', 'v0.14.4']),
  ('rewind-chapter-v2', 'Version 0.14.0 to 0.14.0', array['v0.14.0']),
  ('hazard-instance-runs-v1', 'Version 0.13.2 to 0.13.2', array['v0.13.2']),
  ('custom-runs-v1', 'Version 0.13.0 to 0.13.1', array['v0.13.0', 'v0.13.1']),
  ('first-rewind-v1', 'Version 0.12.0 to 0.12.0', array['v0.12.0']),
  ('enemy-star-drops-v1', 'Version 0.11.6 to 0.11.7', array['v0.11.6', 'v0.11.7']),
  ('flag-star-cleanup-v1', 'Version 0.11.5 to 0.11.5', array['v0.11.5']),
  ('intro-ten-v1', 'Version 0.11.0 to 0.11.4', array['v0.11.0', 'v0.11.1', 'v0.11.2', 'v0.11.3', 'v0.11.4']),
  ('pressure-gate-v1', 'Version 0.10.4 to 0.10.4', array['v0.10.4']),
  ('pressure-route-v2', 'Version 0.10.3 to 0.10.3', array['v0.10.3']),
  ('eight-intro-v1', 'Version 0.10.2 to 0.10.2', array['v0.10.2']),
  ('edge-collision-v1', 'Version 0.10.1 to 0.10.1', array['v0.10.1']),
  ('pressure-plates-v1', 'Version 0.10.0 to 0.10.0', array['v0.10.0']),
  ('intro-seven-v1', 'Version 0.6.2 to 0.9.2', array['v0.8.0', 'v0.8.1', 'v0.8.3', 'v0.9.0', 'v0.9.1', 'v0.9.2'])
on conflict (id) do update
set label = excluded.label,
    accepted_versions = excluded.accepted_versions,
    active = true;

create table if not exists public.leaderboard_scores (
  id bigint generated always as identity primary key,
  leaderboard_id text not null references public.leaderboard_rulesets(id),
  game_version text not null check (game_version ~ '^v[0-9]+\.[0-9]+\.[0-9]+$'),
  name text not null check (char_length(btrim(name)) between 1 and 24 and name !~ '[[:cntrl:]]'),
  seconds numeric(8,1) not null check (seconds between 1 and 36000),
  stars smallint not null check (stars between 0 and 61),
  score numeric(8,1) generated always as (round(300 - seconds + stars * 2, 1)) stored,
  splits jsonb not null check (jsonb_typeof(splits) = 'array' and jsonb_array_length(splits) in (7, 8, 10)),
  run_type_id text not null default 'classic',
  ranking_metric text not null default 'time' check (ranking_metric in ('time', 'score', 'stars')),
  created_at timestamptz not null default now()
);

alter table public.leaderboard_scores
  add column if not exists run_type_id text not null default 'classic';
alter table public.leaderboard_scores
  add column if not exists ranking_metric text not null default 'time';

alter table public.leaderboard_scores
  drop constraint if exists leaderboard_scores_ranking_metric_check;
alter table public.leaderboard_scores
  add constraint leaderboard_scores_ranking_metric_check check (ranking_metric in ('time', 'score', 'stars'));

alter table public.leaderboard_scores
  drop constraint if exists leaderboard_scores_stars_check;
alter table public.leaderboard_scores
  add constraint leaderboard_scores_stars_check check (stars between 0 and 61);

alter table public.leaderboard_scores
  drop constraint if exists leaderboard_scores_splits_check;
alter table public.leaderboard_scores
  add constraint leaderboard_scores_splits_check
  check (jsonb_typeof(splits) = 'array' and jsonb_array_length(splits) between 1 and 10);

create index if not exists leaderboard_scores_rank_idx
  on public.leaderboard_scores (leaderboard_id, score desc, seconds asc, created_at asc);

create index if not exists leaderboard_scores_run_type_rank_idx
  on public.leaderboard_scores (leaderboard_id, run_type_id, ranking_metric, seconds asc, score desc, stars desc);

alter table public.leaderboard_rulesets enable row level security;
alter table public.leaderboard_scores enable row level security;

drop policy if exists "Anyone can read leaderboard rulesets" on public.leaderboard_rulesets;
create policy "Anyone can read leaderboard rulesets"
  on public.leaderboard_rulesets for select
  to anon, authenticated
  using (true);

drop policy if exists "Anyone can read leaderboard scores" on public.leaderboard_scores;
create policy "Anyone can read leaderboard scores"
  on public.leaderboard_scores for select
  to anon, authenticated
  using (true);

drop policy if exists "Anyone can submit validated scores" on public.leaderboard_scores;
create policy "Anyone can submit validated scores"
  on public.leaderboard_scores for insert
  to anon, authenticated
  with check (
    exists (
      select 1
      from public.leaderboard_rulesets ruleset
      where ruleset.id = leaderboard_id
        and ruleset.active
        and game_version = any(ruleset.accepted_versions)
    )
  );

grant select on public.leaderboard_rulesets to anon, authenticated;
grant select, insert on public.leaderboard_scores to anon, authenticated;
grant usage, select on sequence public.leaderboard_scores_id_seq to anon, authenticated;

-- Intentionally grant no update or delete permissions to public visitors.
