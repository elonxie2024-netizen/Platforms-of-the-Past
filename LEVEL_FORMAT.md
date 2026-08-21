# Level data format

Platforms of the Past level data uses a versioned, JSON-serializable format. The current format is `schemaVersion: 1`. It contains data only: functions, callbacks, constructor names, HTML, and executable scripts are not valid level fields.

The implementation and representative campaign data live in [`level-data.js`](level-data.js). The runtime adapter in [`game.js`](game.js) converts validated objects into the shapes already used by the game engine.

## Top-level structure

```json
{
  "schemaVersion": 1,
  "id": "example-level",
  "name": "Example Level",
  "width": 1600,
  "spawn": { "x": 55, "y": 448 },
  "exit": { "id": "level-exit", "x": 1515, "y": 360, "width": 34, "height": 90 },
  "settings": {
    "music": "level2",
    "theme": "rewind",
    "requiredLevelStars": 1,
    "rewind": {
      "enabled": true,
      "tutorial": false,
      "field": { "enabled": true, "radius": 400, "offset": 150 }
    },
    "echo": { "enabled": true, "tutorial": false, "canPushCrates": false }
  },
  "objects": []
}
```

- `id` is a stable machine-readable ID using lowercase letters, numbers, and hyphens.
- `name` is the player-facing name.
- `width` is the horizontal world size.
- `spawn` is the slime's top-left starting position.
- `exit` is the flag rectangle and has its own stable ID.
- `settings` contains allowlisted level-wide configuration.
- `objects` contains every gameplay object. Every object has a unique `id` and a supported `type`.

Unknown fields are rejected. This is intentional: misspellings fail clearly, and untrusted data cannot smuggle callbacks or unsupported behavior into the loader.

## Level settings

| Field | Meaning |
| --- | --- |
| `music` | `level1`, `level2`, or `level3` |
| `theme` | `default`, `lava`, or `rewind` |
| `postRun` | Marks later campaign-style content played after the introductory run |
| `requiredStars` | Total star requirement used by existing campaign rules |
| `requiredLevelStars` | Stars that must be collected in this level before the exit succeeds |
| `rewind.enabled` | Enables the level's Rewind chapter behavior |
| `rewind.tutorial` | Enables established Rewind control presentation |
| `rewind.showHintOnPlate` | Shows the established contextual Rewind hint after a plate activates |
| `rewind.field` | Enables and sizes the object-selection field with `radius` and `offset` |
| `echo.enabled` | Enables Echo recording/replay behavior |
| `echo.tutorial` | Enables the established first-use Echo control presentation |
| `echo.canPushCrates` | Allows Echo actors to push crates |
| `gauntlet` | Optional campaign metadata: `{ "id": "G1", "chapter": 0 }` |

Story transitions, cutscene selection, account data, leaderboard rules, roadmap unlocking, and run construction are deliberately not level data.

## Supported object types

All rectangle objects use `x`, `y`, `width`, and `height`. Textured objects use `material: "grass"`, `"stone"`, or `"crate"`.

### `platform`

A solid static rectangle.

```json
{ "id": "ground", "type": "platform", "x": 0, "y": 490, "width": 500, "height": 80, "material": "stone" }
```

### `floatingPlatform`

A standalone asset-textured block. It uses the same rectangle and material fields as `platform`.

### `crate`

A pushable, gravity-affected crate.

```json
{ "id": "cargo", "type": "crate", "x": 300, "y": 430, "width": 60, "height": 60, "rewindable": true }
```

### `breakableBlock`

Uses `trigger: "stand"` or `"impact"`. `rewindable` and `rewindSpeed` configure the existing state-history behavior.

### `jumpPad`

A jump-pad rectangle. Its launch strength remains an engine rule rather than arbitrary level code.

### `hazard`

Uses `hazard: "spikes"` or `"lava"`. A normal hazard has rectangle fields. Spikes attached to a moving object use `attachedTo`, offsets, width, and height:

```json
{
  "id": "gate-spikes",
  "type": "hazard",
  "hazard": "spikes",
  "attachedTo": "cargo-gate",
  "offsetX": 0,
  "offsetY": -18,
  "width": 80,
  "height": 18
}
```

### `star`

Uses center coordinates: `{ "id": "star-1", "type": "star", "x": 420, "y": 365 }`.

### `movingPlatform`

An automatically oscillating platform. `motion.axis` is `x` or `y`; `range`, `speed`, and optional `phase` match the existing cycle mechanic.

```json
{
  "id": "lift",
  "type": "movingPlatform",
  "x": 600,
  "y": 400,
  "width": 150,
  "height": 40,
  "material": "stone",
  "motion": { "axis": "y", "range": 70, "speed": 1.2, "phase": 0 }
}
```

### `controlledPlatform`

A switch- or pressure-plate-controlled platform. `target` is its active position. `controllerIds` contains stable IDs of switches or plates, never object references.

```json
{
  "id": "entry-gate",
  "type": "controlledPlatform",
  "x": 520,
  "y": 535,
  "width": 210,
  "height": 40,
  "material": "stone",
  "target": { "x": 520, "y": 430 },
  "controllerIds": ["entry-plate"],
  "requiresActive": true,
  "releaseDelay": 0.15
}
```

Multiple controller IDs currently mean that all referenced pressure plates are required. `moveDuration` optionally uses the existing controlled-platform timing rule. `initialProgress` chooses an exact starting point from `0` (base) through `1` (target).

### `rewindPlatform`

A moving platform with recorded motion history. It may use a `target`, a `motionPath`, or both. Supported established flags are `controllerId`, `speed`, `releaseDelay`, `pathIndex`, `autoStart`, `autoWhenRidden`, `carryDuringRewind`, `resumeAfterRewind`, `loopPath`, and `carryPlayer`.

Paths are arrays of plain points:

```json
"motionPath": [
  { "x": 1010, "y": 430 },
  { "x": 1280, "y": 430 }
]
```

### `switch`

Uses its own object `id` as the link target. Optional `momentary` and `pulseDuration` fields use the existing reversible or timed switch rules. `initialFlipped` configures its playtest starting state.

### `pressurePlate`

Uses `width` and `filter: "any"`, `"crate"`, or `"enemy"`. Its stable object ID is referenced by controlled or rewindable platforms.

### `enemy`

Defines the existing red slime patrol with `x`, `surfaceY`, `patrolMinX`, `patrolMaxX`, `direction`, `speed`, optional `stopAtBoundary`, and optional `rewindable`.

### `movingObstacle`

Defines the existing dangerous blade using `x`, `y`, `size`, `speed`, `motionPath`, optional `pathIndex`, optional `loopPath`, and optional `resumeAfterRewind`. `pathIndex` selects the first waypoint the blade travels toward. Dangerousness and collision behavior are fixed engine rules.

## Validation and safe loading

Before runtime conversion, the loader checks:

- schema version and allowlisted top-level fields;
- plain JSON-compatible values only;
- no functions, symbols, non-finite numbers, circular structures, custom prototypes, or prototype-related keys;
- supported object types and type-specific fields;
- unique stable IDs;
- valid ID references and compatible referenced object types;
- numeric and collection-size limits;
- supported materials, themes, filters, paths, and mechanic options.

Malformed JSON, unknown properties, missing links, and unsupported mechanics return an error list. They do not start a level or execute data as code. Campaign boot also retains the matching legacy definition as a defensive fallback if a migrated built-in level is ever invalid.

## Development utilities

The browser console exposes `window.PlatformsLevelDev`:

```js
PlatformsLevelDev.validate(levelData)
PlatformsLevelDev.clone(levelData)
PlatformsLevelDev.importJSON(jsonText)
PlatformsLevelDev.exportJSON(levelData)
PlatformsLevelDev.load(levelDataOrJson)
```

Each utility returns an object with `ok`/`valid`, `errors`, and the requested result. Loading the same source twice creates independent runtime state, including independent motion-history arrays.

## Migrated campaign proof

Four existing levels currently load through this format:

- Level 1, Dirtbound Trail: static terrain, spikes, stars, and exit.
- Level 5, Crateyard Climb: crate gravity and pushing.
- Level 7, Switchback Summit: switches linked to controlled platforms.
- Level 31, Shared History: a pressure-plate gate, Rewind motion path, Rewind field, and Echo capability.

All other campaign levels continue using their previous declarations to minimize regression risk.

## Visual editor

Version 0.26.0 adds a Level Editor entry to the main menu. It edits this schema directly—there is no editor-only format or executable scripting layer. The canvas supports grid placement, selection, dragging, resizing, ID-based controller and attachment links, motion-path handles, initial states, and the allowlisted level settings above.

The editor keeps one browser-local draft under a separate storage key, with bounded undo/redo history for the current session. Import and export pass through the same validation and cloning utilities as campaign migration. Playtest loads a fresh runtime clone through the generic adapter, then removes it on return; it cannot unlock campaign levels, alter account progress, or submit to leaderboards.

Community publishing, browsing, ratings, comments, collaboration, arbitrary scripting, and account-backed draft storage remain out of scope.
