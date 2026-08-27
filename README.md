# Platforms of the Past

Play at: https://elonxie2024-netizen.github.io/Platforms-of-the-Past/

A browser-based platformer where the world changes across time. Run, jump, avoid hazards, and collect stars while exploring levels that will eventually shift between the past, present, and future.

No install, download, or plugins. It runs entirely in the browser.

> **Development status:** The platforming prototype is playable now. Ten rewind levels, ten Echo Chapter levels, and ten combined Rewind + Echo levels follow the introductory adventure and awakening cinematic. Four optional chapter gauntlets provide harder challenges outside the forty-level campaign.

**Current version:** `v0.36.0`

## How it works

Reach the flag at the end of each level while crossing gaps, avoiding spikes, and collecting stars along the way.

**Keep moving.** Build momentum, jump between platforms, and recover quickly when a route goes wrong.

**Avoid hazards.** Spikes and missed jumps send you back to the beginning of the current level.

**Collect stars.** Each level hides stars across its main route and more dangerous jumps.

**Reach the flag.** Finish all ten introductory levels to complete the current adventure and see your final results.

**Awaken rewind.** Completing the introductory adventure opens the results screen, followed by a cinematic in which the slime discovers a time machine and gains its first time-travel power. Click the cinematic to skip directly to level 11.

**Recall a path.** Starting in level 11, hold `F` to preview actual recent history backward. Keep holding `F` and hold `G` to move the preview forward again, then release `F` to commit. Pushable crates always record where the player moves them, breakable blocks record whether they still exist, and enemies record both their patrol and whether they are alive. After the rewind field is introduced, it remains available in later levels and rewinds every eligible object it reaches. The slime and collected rewards remain in the present.

**Create an echo.** Completing level 20 opens a chapter-ending screen and a second time-machine cinematic before level 21. Press `C` to start recording the slime's real movement, jumps, and switch interactions. Press `C` again to stop and preview the route with a golden starting outline and directional arrows, then press `C` once more to create the cyan looping echo. Press `V` to remove it. Later Echo Chapter levels combine repeated timing, remote switches, pressure plates, crates, enemies, hazards, and moving platforms before the level-30 final exam.

**Converge timelines.** Chapter 4 combines rewind and echoes across levels 31–40. Echo actions continue changing the present while platforms, crates, broken blocks, enemies, and dangerous moving blades retrace their recorded history. The chapter emphasizes interactions between established rules rather than tighter execution, ending with a long combined final exam.

**Race the clock.** The speedrun timer starts with your first move or jump and continues between levels. Continuing the story preserves the same run timer across the Introduction, Rewind, and Echo chapters while pausing it during both cutscenes. Your final score is 300 minus your completion time in seconds, plus 2 points for every star.

**Compare your splits.** A second timer tracks the current level and resets whenever you restart that level. The run timer keeps going, while the results screen records the successful attempt for each level.

**Publish a run.** Complete the full adventure from Dirtbound Trail and optionally publish it to the global leaderboard. Guests choose a run name; signed-in players publish under their public display name. Records are shared across devices, gameplay-changing releases use separate boards, and rankings can be viewed by fastest time, most stars, or highest total score.

**Use an optional account.** Sign up or sign in with email and password to synchronize roadmap unlocks, completed chapters, gauntlets, and private level drafts through Supabase. Public usernames enable safe level sharing without exposing or looking up email addresses. Passwords are handled only by Supabase Auth, and guest play continues to work without an account or network connection.

**View public profiles.** Click a signed-in runner on the global leaderboard or a creator in Community Levels to see their public username, best run categories and world placements, currently published levels, and notable signed-in custom-level clears. Custom-level highlights are recorded only for current published snapshots completed without developer cheats.

**Choose a custom-level type.** Creators can publish Exit, Exit + Required Stars, or Survival levels. Exit versions become verified after their first valid cheat-free completion; Survival versions rank immediately by longest time. Every gameplay-changing publication is verified independently. Survival strategy disputes start without invalidating a run, require at least three community votes and a two-thirds majority, and remain reversible without deleting run records.

**Verify published runs.** Published play begins with a one-use Supabase ticket bound to the exact immutable level version and current guest or account session. The browser records timestamped input changes, Rewind and Echo actions, checkpoints, initial and terminal state, collection events, and permanent integrity events. Its public RPC can only enqueue that bounded evidence as pending. A deployed Supabase Edge Function retrieves the immutable snapshot with its private service role, derives the outcome, and alone can finalize a trusted rank or version verification. The v0.35.1 audit additionally rejects compressed or duplicate checkpoint time, terminal mismatches, impossible velocities and collections, invalid object states, illegal Rewind/Echo sequences, cross-death attempt splicing, malformed payloads, and oversized requests. Older client-verified runs remain visible as unranked legacy history.

**Store replay evidence efficiently.** Version 0.35.2 records new runs as compact `POTP-RUN-3` evidence: timestamps are delta-encoded, checkpoints are flattened, and nonempty world state is stored in a sparse stream. The trusted verifier expands it internally and applies the same rules, while historical `POTP-RUN-2` evidence remains supported. Compact runs are capped at 650 KB and one hour. Leaderboard and profile listings request metadata only; full replay data is loaded only by the private verifier when it claims one pending run.

**Inspect published levels before playing.** Community Levels and creator profiles now open a public detail screen with creator attribution, level type, objective, immutable version, verification status, the signed-in player's best trusted result, and a per-version leaderboard. Exit levels rank fastest trusted completions; Survival ranks longest trusted runs while keeping disputed and invalidated strategies visible but unranked. The full level snapshot is downloaded only after Play is selected, and existing direct-play links still launch immediately.

**Play past versions.** Open Versions from the main menu to launch any archived release build in a new tab.

**Build on serialized levels.** The first level-data foundation represents gameplay as validated JSON-compatible objects with stable IDs and safe links. Four campaign levels now prove the format while the remaining levels continue through the legacy declarations. See [`LEVEL_FORMAT.md`](LEVEL_FORMAT.md) for the complete schema and development utilities.

**Customize the menu.** After completing the final cutscene, switch between the original and awakened animations, choose grass, stone, or crate platforms from the game assets, and swap the sunny backdrop for the lava-dark sky.

**Follow development.** Open the changelog from the main menu or pause menu to read every version and Git commit in the game's history.

**Run regression tests.** From PowerShell in the repository folder, run `powershell -ExecutionPolicy Bypass -File .\tests\run-tests.ps1`. The dependency-free suite launches Chrome or Edge headlessly and tests custom-level types, trusted replay derivation, compact replay round trips and measured byte sizes, one-hour and oversized Survival evidence, forged claims, immutable publications, exact-version published leaderboards, metadata-only detail queries, personal-best trust filters, Survival ranking and review rules, serialization, save codes, the complete game boot path, and matching database/source contracts without manual browser interaction. GitHub Actions runs the same command automatically on pushes and pull requests.

**Choose your route.** Play lets you choose Custom run or Roadmap. Custom run opens the challenge builder, while Roadmap separates the adventure into Introduction, Rewind, and Echo chapter pages where you can replay completed levels and your next unlocked challenge. Switch pages with the on-screen arrows or the Left and Right Arrow keys. Guest progress now survives refreshes; Restart session clears it, while signed-in account progress remains protected in the cloud.

**Build a run.** Before starting, combine an objective, a constraint, and a leaderboard metric. Run objectives include completing the full introduction or selected levels, collecting every star, dying once to every placed hazard, and activating every available mechanic. Falls are not placed hazards and do not count. Rankings are separated by challenge and can use Time, Score, or Stars.

**Change the past.** In the finished game, time travel will let you switch eras and reshape the level. A bridge that is broken in the present may still stand in the past, while a seed planted long ago could become a path through the future.

## Controls

| Input | Action |
| --- | --- |
| `A` / `D` or arrow keys | Move left and right |
| `W`, Up Arrow, or Space | Jump |
| `F` | Hold to preview backward; release to commit the rewind |
| `G` | While holding `F`, move the rewind preview forward; release to hold its position |
| `C` | Start recording; press again to preview; press once more to create the echo |
| `V` | Destroy the current echo |
| `E` | Flip a nearby switch |
| `P` | Pause or resume the run |
| `R` | Restart the current level |
| `T` | Restart the whole run and reset the timer |
| Touch buttons | Move and jump on mobile devices |

## Current game

The playable prototype includes:

- Ten introductory levels that introduce the terrain textures and mechanics, then test them in longer combined challenges
- A jump pad in level 3 and automatically cycling moving platforms in level 4
- Required crate-pushing puzzles beginning in level 5; crates are heavy movable steps that fall from unsupported ledges, ride or collide with moving platforms, trigger plates, and retain their motion history for Rewind
- Asset-textured floating blocks and visibly cracked breakable variants that burst into material-specific debris in level 6
- A saved level roadmap with connected numbered stages, progression locks, and safe guest-to-account merging
- A custom run builder with mix-and-match objectives, constraints, specific level routes, and leaderboard metrics
- Reversible nearby switches with clickable `E - FLIP` prompts that raise or submerge linked platforms in level 7
- A completed-run results screen after level 10 with publishing, quitting, and a prominent story Continue button that pulses after publication
- Ten focused rewind levels built on a consistent history system for moving platforms, player-pushed crates, breakable blocks, and enemies
- A Rewind Chapter completion screen and second time-machine cinematic that unlocks the echo ability before level 21
- Ten Echo Chapter levels beginning at level 21, introducing deterministic looping action recordings, physical echo collisions, repeated plate timing, replayed switch interactions, moving weight, crossing schedules, stable crate pushing, enemy safety windows, and coordinated platforms
- Thin automatic pressure plates and plate-controlled platforms in level 8, with a no-wait first shuttle and a required crate-held second bridge
- Two patrolling red slime enemies in level 9 that reverse at ledges and obstacles, defeat the player from the side, burst into red slime pieces when stomped, and each drop a collectible star
- A long final test in level 10 that combines floating platforms, jump pads, automatic movers, crates, switches, and pressure plates
- An evolved post-cutscene main menu where two continuously moving platforms trade places while the slime climbs with its real in-game jump physics
- Post-cutscene menu controls for animation style, asset-based platform texture, and backdrop
- Animated lava, spikes, steeper elevation changes, and more demanding star routes
- A persistent speedrun timer and completion score
- Per-level timing and a complete split summary
- A pause menu that freezes the timer
- A global, version-separated leaderboard for named full-adventure runs
- A metadata-only Community Levels browser with creator search, publication sorting, incremental loading, and direct play of current published snapshots
- Optional Supabase email/password accounts with persistent sessions, password recovery, private emails, public display names, cloud progression, and account-scoped browser preferences
- A versioned, validated level-data format with safe import/export, stable object links, and runtime-state cloning
- A visual level editor with one temporary blank guest workspace, strictly isolated lazy Supabase account workspaces, crash recovery, conflict-aware Owner/Editor collaboration, play-first Viewer access, username sharing, append-only publication history, stable direct-to-play public links, JSON import/export, portable `POTP1-` text save codes, and isolated in-engine playtesting
- A playable archive of every released version
- A complete in-game changelog based on the Git history
- Responsive running and jumping with stable high-speed platform-edge landings
- Coyote time and jump buffering
- Hazards, collectibles, and level exits
- A following camera and completion summary
- A main menu whose progression, appearance, display, and audio settings restore per account while every guest session starts from defaults
- Quit controls during a run and after completing the game
- Four-section procedural soundtracks for the menu and levels, with persistent master, music, and per-effect volume controls
- Surface-aware landing sounds and particles plus effects for collecting, finishing, and dying
- Keyboard and touchscreen controls

## Time-travel plans

The full game is planned to include:

- Past, present, and future versions of each level
- Fast era switching during platforming
- Different platforms, hazards, and routes in each period
- Cause-and-effect puzzles that change later eras
- Secrets found by comparing the same place across time

## Play locally

Download or clone the repository, then open `index.html` in a modern browser.

You can also start a local server from the project folder:

```powershell
python -m http.server 8000
```

Then visit [http://localhost:8000](http://localhost:8000).

## Credits

Made by [elonxie2024-netizen](https://github.com/elonxie2024-netizen).

## Supabase maintenance

The public leaderboard, account profiles, private progression records, custom-level drafts, collaboration permissions, publication history, community catalog, replay evidence, and access rules are created by [`supabase-setup.sql`](supabase-setup.sql). Run the complete current file in the Supabase SQL Editor when updating the live project; it is written to preserve existing data while applying missing schema and function changes.

Trusted replay validation also requires the server-side function in [`supabase/functions/verify-custom-run/index.ts`](supabase/functions/verify-custom-run/index.ts). After installing the Supabase CLI, link the project and deploy it:

```powershell
supabase login
supabase link --project-ref fuhqixfcdeyyjzpdnivy
supabase functions deploy verify-custom-run
```

The hosted function receives `SUPABASE_SERVICE_ROLE_KEY` from Supabase and never exposes it to the browser. [`supabase/config.toml`](supabase/config.toml) disables the legacy JWT gateway check because this project uses a modern publishable key; the function itself requires that configured publishable key before processing a pending replay.

In Supabase Authentication settings, keep Email enabled and add `https://elonxie2024-netizen.github.io/Platforms-of-the-Past/` to the allowed redirect URLs. Set it as the Site URL when GitHub Pages is the production host. Email confirmation may remain enabled; the game supports both confirmed-email and immediate-session sign-up configurations. Password reset emails use the same allowed return URL.

The displayed game version and the leaderboard ruleset are intentionally separate: cosmetic, account, texture, audio, menu, and cutscene-only releases keep the existing ruleset, while changes to physics, levels, timing, stars, or scoring must introduce a new ruleset in both the game configuration and Supabase.

Playable release snapshots are generated from their original Git commits by [`tools/build-version-archive.ps1`](tools/build-version-archive.ps1). Run that script after adding a committed release to its version map.
