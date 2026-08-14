# Platforms of the Past

Play at: https://elonxie2024-netizen.github.io/Platforms-of-the-Past/

A browser-based platformer where the world changes across time. Run, jump, avoid hazards, and collect stars while exploring levels that will eventually shift between the past, present, and future.

No install, download, or plugins. It runs entirely in the browser.

> **Development status:** The platforming prototype is playable now. Rewind is introduced in the ending cinematic, while its gameplay mechanic will be implemented later.

**Current version:** `v0.8.3`

## How it works

Reach the flag at the end of each level while crossing gaps, avoiding spikes, and collecting stars along the way.

**Keep moving.** Build momentum, jump between platforms, and recover quickly when a route goes wrong.

**Avoid hazards.** Spikes and missed jumps send you back to the beginning of the current level.

**Collect stars.** Each level hides stars across its main route and more dangerous jumps.

**Reach the flag.** Finish all seven levels to complete the current adventure and see your final results.

**Awaken rewind.** Completing the introductory adventure triggers a cinematic in which the slime discovers a time machine and gains its first time-travel power. Click the game screen to skip directly to the results.

**Race the clock.** The speedrun timer starts with your first move or jump and continues between levels. Your final score is 300 minus your completion time in seconds, plus 2 points for every star.

**Compare your splits.** A second timer tracks the current level and resets whenever you restart that level. The run timer keeps going, while the results screen records the successful attempt for each level.

**Publish a run.** Complete the full adventure from Dirtbound Trail, name the run, and optionally publish it to the global leaderboard. Records are shared across devices, gameplay-changing releases use separate boards, and rankings can be viewed by fastest time, most stars, or highest total score.

**Play past versions.** Open Versions from the main menu to launch any archived release build in a new tab.

**Follow development.** Open the changelog from the main menu or pause menu to read every version and Git commit in the game's history.

**Choose your route.** Play opens a level roadmap for the current session. Completed levels and the next challenge can be replayed, while future levels remain locked until reached. Refreshing or selecting Restart session begins again from Dirtbound Trail.

**Change the past.** In the finished game, time travel will let you switch eras and reshape the level. A bridge that is broken in the present may still stand in the past, while a seed planted long ago could become a path through the future.

## Controls

| Input | Action |
| --- | --- |
| `A` / `D` or arrow keys | Move left and right |
| `W`, Up Arrow, or Space | Jump |
| `E` | Flip a nearby switch |
| `P` | Pause or resume the run |
| `R` | Restart the current level |
| `T` | Restart the whole run and reset the timer |
| Touch buttons | Move and jump on mobile devices |

## Current game

The playable prototype includes:

- Seven compact side-scrolling levels that introduce the terrain textures and mechanics in stages
- A jump pad in level 3 and automatically cycling moving platforms in level 4
- Required crate-pushing puzzles in level 5; crates act as movable steps
- Asset-textured floating blocks and visibly cracked breakable variants that burst into material-specific debris in level 6
- A session-based level roadmap with connected numbered stages and progression locks
- Reversible nearby switches with clickable `E - FLIP` prompts that raise or submerge linked platforms in level 7
- A story cutscene after level 7 that reveals the time machine and the slime's rewind power
- An evolved post-cutscene main menu where two continuously moving platforms trade places while the slime climbs with its real in-game jump physics
- Animated lava, spikes, steeper elevation changes, and more demanding star routes
- A persistent speedrun timer and completion score
- Per-level timing and a complete split summary
- A pause menu that freezes the timer
- A global, version-separated leaderboard for named full-adventure runs
- A playable archive of every released version
- A complete in-game changelog based on the Git history
- Responsive running and jumping
- Coyote time and jump buffering
- Hazards, collectibles, and level exits
- A following camera and completion summary
- A main menu with a saved volume setting
- Quit controls during a run and after completing the game
- Procedural soundtracks for the menu and each level
- Surface-aware landing sounds plus effects for collecting, finishing, and dying
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

## Leaderboard maintenance

The public leaderboard tables and access rules are created by [`supabase-setup.sql`](supabase-setup.sql). The displayed game version and the leaderboard ruleset are intentionally separate: cosmetic, texture, audio, menu, and cutscene-only releases keep the existing ruleset, while changes to physics, levels, timing, stars, or scoring must introduce a new ruleset in both the game configuration and Supabase.

Playable release snapshots are generated from their original Git commits by [`tools/build-version-archive.ps1`](tools/build-version-archive.ps1). Run that script after adding a committed release to its version map.
