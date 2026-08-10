# Platforms of the Past

A browser-based platformer where the world changes across time. Run, jump, avoid hazards, and collect stars while exploring levels that will eventually shift between the past, present, and future.

No install, download, or plugins. It runs entirely in the browser.

> **Development status:** The platforming prototype is playable now. The time-travel mechanic is the next major feature and is not implemented yet.

## How it works

Reach the flag at the end of each level while crossing gaps, avoiding spikes, and collecting stars along the way.

**Keep moving.** Build momentum, jump between platforms, and recover quickly when a route goes wrong.

**Avoid hazards.** Spikes and missed jumps send you back to the beginning of the current level.

**Collect stars.** Each level hides stars across its main route and more dangerous jumps.

**Reach the flag.** Finish all three levels to complete the current adventure and see your final results.

**Change the past.** In the finished game, time travel will let you switch eras and reshape the level. A bridge that is broken in the present may still stand in the past, while a seed planted long ago could become a path through the future.

## Controls

| Input | Action |
| --- | --- |
| `A` / `D` or arrow keys | Move left and right |
| `W`, Up Arrow, or Space | Jump |
| `R` | Restart the current level |
| Touch buttons | Move and jump on mobile devices |

## Current game

The playable prototype includes:

- Three side-scrolling levels
- Responsive running and jumping
- Coyote time and jump buffering
- Hazards, collectibles, and level exits
- A following camera and completion summary
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
