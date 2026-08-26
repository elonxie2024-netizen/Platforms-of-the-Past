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
    "levelType": "exit-stars",
    "requiredStars": 1,
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

- `id` is any non-empty text identifier. IDs are case-sensitive and must be unique where they share an object namespace.
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
| `music` | `level1`, `level2`, `level3`, or `custom` |
| `customMusic` | Safe embedded audio used with `music: "custom"`; contains `name`, an audio `dataUrl`, `loop`, and `volume` |
| `theme` | `default`, `lava`, or `rewind` |
| `postRun` | Marks later campaign-style content played after the introductory run |
| `levelType` | Exactly `exit`, `exit-stars`, or `survival`; omitted legacy data defaults to Exit unless it already has a positive `requiredStars` value |
| `requiredStars` | Required only for `exit-stars`; the count that must be collected before the exit verifies the run |
| `requiredLevelStars` | Stars that must be collected in this level before the exit succeeds |
| `rewind.enabled` | Enables the level's Rewind chapter behavior |
| `rewind.tutorial` | Enables established Rewind control presentation |
| `rewind.showHintOnPlate` | Shows the established contextual Rewind hint after a plate activates |
| `rewind.field` | Sizes and positions the automatic object-selection field with `radius` and `offset`; the field is always active when Rewind is enabled (legacy `enabled` values are accepted but ignored) |
| `echo.enabled` | Enables Echo recording/replay behavior |
| `echo.tutorial` | Enables the established first-use Echo control presentation |
| `echo.canPushCrates` | Allows Echo actors to push crates |
| `gauntlet` | Optional campaign metadata: `{ "id": "G1", "chapter": 0 }` |

Story transitions, cutscene selection, account data, leaderboard rules, roadmap unlocking, and run construction are deliberately not level data.

Published levels attach verification and leaderboard records to the exact immutable publication version, not to the editable draft. Exit and Exit + Required Stars versions begin unverified and require a valid completed run with no Fly or developer-cheat use. Survival versions are ranked immediately, have no exit completion condition, and sort by longest time.

## Supported object types

All rectangle objects use `x`, `y`, `width`, and `height`. Textured objects use `material: "grass"`, `"stone"`, or `"crate"`.

Every object may also have a `groupId`. Objects sharing the same non-empty group ID form one rigid editor/runtime group: motion applied to any member translates every member by the same amount, while collision and interaction behavior remain specific to each member. A grouped spike still hurts, a grouped jump pad still launches, and a grouped platform remains solid. Group IDs contain data only and cannot run scripts.

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

### Controlled movement on any object

Every supported object type, plus the exit flag, may receive an optional `control` block. This uses the same switch/pressure-plate rule without changing the object's identity or collision behavior. For example, these spikes travel upward while `danger-plate` is active:

```json
{
  "id": "rising-spikes",
  "type": "hazard",
  "hazard": "spikes",
  "x": 620,
  "y": 472,
  "width": 90,
  "height": 18,
  "control": {
    "controllerIds": ["danger-plate"],
    "target": { "x": 620, "y": 350 },
    "releaseDelay": 0,
    "moveDuration": 1.15,
    "initialProgress": 0
  }
}
```

All listed controllers must be active. `releaseDelay` keeps the target active briefly after release, `moveDuration` is travel time in seconds, and `initialProgress` selects the starting point from base (`0`) to target (`1`). An attached hazard cannot also have direct controlled movement; the editor detaches it before adding a control. Adding this block to an automatic platform, Rewind platform, blade, or enemy overrides its ordinary automatic route while preserving its normal object behavior and timeline history.

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
PlatformsLevelDev.importSaveCode(code)
PlatformsLevelDev.exportSaveCode(levelData)
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

Version 0.26.0 adds a Level Editor entry to the main menu. It edits this schema directly—there is no editor-only format or executable scripting layer. The canvas supports grid placement, selection, dragging, resizing, ID-based controller and attachment links, motion-path handles, initial states, and the allowlisted level settings above. Controlled movement can be added to every placed object and the exit, with controller links and target positions edited directly in the inspector or canvas.

Version 0.26.3 makes the editor preview use the same shared game assets as playtest mode. Its bounded world viewport supports two-axis panning, zooming, fitting the complete level with visible exterior space, and dragging the right world boundary to edit the schema-backed `width`. The vertical world size remains the engine's fixed 570-pixel editor space and is intentionally not added to the serialized schema.

The editor keeps a browser-local workspace containing multiple independent level drafts. The toolbar can create, switch, duplicate, delete, import, and export levels; older single-draft storage migrates into the workspace automatically. Shift/Ctrl-click selects several objects, Group gives them one rigid `groupId`, Alt-click selects one group member for individual property editing, and Ctrl+C/Ctrl+V copies either individual objects or complete groups while remapping internal IDs and links. Undo/redo history remains bounded to the currently edited level and resets when switching levels so changes cannot cross between drafts. Import and export pass through the same validation and cloning utilities as campaign migration. Level Settings can embed an imported audio track with per-level volume and looping; the audio remains part of exported level JSON and is decoded as media rather than executable content. Playtest loads a fresh runtime clone through the generic adapter, then removes it on return; it cannot unlock campaign levels, alter account progress, or submit to leaderboards.

Version 0.27.1 adds portable save codes. `exportSaveCode(levelData)` validates and serializes the same level JSON, UTF-8 encodes it, and wraps URL-safe Base64 data in the `POTP1-` format prefix. `importSaveCode(code)` accepts only that versioned prefix, decodes it as UTF-8 JSON, and passes it through the existing importer and complete schema validation before returning a level. The editor adds a validated imported code as a new draft, so malformed, unsupported, or invalid codes cannot replace the active draft.

Version 0.28.0 keeps the existing browser-local workspace exclusively for guests. Authenticated workspaces load private and shared draft rows from Supabase and never read another account's browser workspace. Owners can grant Editor or Viewer access by account email; Editors can update the private draft, while Viewers and public visitors receive a read-only editor with playtesting. Publishing copies a validated private draft into a separate public snapshot row. Later edits affect only the private draft until the owner explicitly publishes an updated version. Public links use `?level=<published-level-uuid>` and do not provide browsing, ratings, comments, or search.

Community browsing, search, ratings, comments, arbitrary scripting, and real-time co-editing remain out of scope.

## Published verification boundary

Version 0.34.1 treats each `(level_id, level_version)` pair as a separate immutable verification target. Opening the current published snapshot requests a private, one-use run ticket. The ticket is bound to that exact version and to the current authentication state: an account ticket cannot be submitted by another account or by a signed-out guest, and a guest ticket cannot be submitted after signing in. Tickets expire after 24 hours and cannot be reused.

The submit RPC reads the immutable snapshot and independently checks the claimed level type and available stars. It also validates the ticket identity, replay format and size, checkpoint timing and bounds, plausible movement, recorded star-collection identifiers, final star count, final exit overlap, elapsed server session, and permanent Fly/developer-cheat flags. Failed evidence is retained as an invalidated, unranked run where it can be represented safely; it cannot verify a version. Public-profile clear metadata accepts a validated run ID and derives its level, version, time, and stars from that server record instead of trusting those values a second time.

Exit and Exit + Required Stars versions begin unverified and only the exact version completed by a valid run becomes verified. A later publication receives a new version row and fresh state. Survival versions rank longest time first. Valid and restored runs receive sequential ranks; disputed and invalidated runs remain visible in time order, display no numeric rank, and do not consume a rank. Strategy decisions are reversible and never delete run records.

This is hardened client-evidence verification, not server-authoritative gameplay. A modified client can still attempt to synthesize internally consistent replay evidence because the browser owns the physics simulation. Fully preventing that class of forgery would require authoritative server simulation or cryptographically attested execution; the current checks are designed to reject obvious/manual RPC forgery and preserve auditable evidence without claiming that stronger guarantee.
