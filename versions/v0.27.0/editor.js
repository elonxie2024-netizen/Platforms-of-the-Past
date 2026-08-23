"use strict";

(() => {
  const api = window.PlatformsLevelData;
  const host = document.querySelector("#levelEditor");
  const LEGACY_STORAGE_KEY = "platforms-past-level-editor-draft-v1";
  const STORAGE_KEY = "platforms-past-level-editor-workspace-v2";
  const LAYOUT_STORAGE_KEY = "platforms-past-level-editor-layout-v1";
  const GRID = 20;
  const WORLD_H = 570;
  const HISTORY_LIMIT = 80;
  const MIN_ZOOM = .02;
  const MAX_ZOOM = 2.5;
  const VIEW_PADDING = 34;
  const RECT_TYPES = new Set(["platform", "floatingPlatform", "crate", "breakableBlock", "jumpPad", "hazard", "movingPlatform", "controlledPlatform", "rewindPlatform"]);
  const RESIZABLE = new Set([...RECT_TYPES, "pressurePlate"]);
  const LABELS = {
    select: "Select", settings: "Level Settings", spawn: "Spawn", exit: "Exit", platform: "Platform", floatingPlatform: "Floating",
    crate: "Crate", breakableBlock: "Breakable", jumpPad: "Jump Pad", spikes: "Spikes", lava: "Lava",
    star: "Star", movingPlatform: "Auto Move", controlledPlatform: "Controlled", rewindPlatform: "Rewind Move",
    switch: "Switch", pressurePlate: "Plate", enemy: "Enemy", movingObstacle: "Blade"
  };
  const PLACE_TO_TYPE = { spikes: "hazard", lava: "hazard" };
  const images = {};
  for (const [key, src] of Object.entries({
    player: "../assets/slime-player.svg", enemy: "../assets/slime-enemy.svg",
    switch: "../assets/switch-left.svg", pressurePlateBase: "../assets/pressure-plate-base.svg",
    pressurePlateTop: "../assets/pressure-plate-top.svg", jumpPadBase: "../assets/jump-pad-base.svg",
    jumpPadTop: "../assets/jump-pad-top.svg", blade: "../assets/moving-obstacle.svg",
    cracks: "../assets/fragile-block-cracks.svg"
  })) {
    const image = new Image(); image.src = src; image.onload = () => draw(); images[key] = image;
  }

  let data = freshLevel();
  let drafts = [];
  let activeDraftKey = "";
  let draftSerial = Date.now();
  let selected = "@spawn";
  let selectedIds = new Set();
  let objectClipboard = null;
  let tool = "select";
  let cameraX = 0;
  let cameraY = 0;
  let zoom = 1;
  let viewFitted = false;
  let snap = true;
  let drag = null;
  let undoStack = [];
  let redoStack = [];
  let statusNote = "Ready.";
  let playtestCallback = null;
  let openedOnce = false;

  host.innerHTML = `
    <div class="editor-toolbar">
      <strong>Level Editor · v0.27.0</strong>
      <label class="editor-level-picker"><span>Level</span><select data-role="draft-picker" aria-label="Level being edited"></select></label>
      <button data-action="new">New</button><button data-action="duplicate">Duplicate</button><button data-action="delete-draft">Delete</button><button data-action="clear">Clear</button>
      <button data-action="group">Group</button><button data-action="ungroup">Ungroup</button>
      <button data-action="copy">Copy</button><button data-action="paste">Paste</button>
      <button data-action="undo">Undo</button><button data-action="redo">Redo</button>
      <button data-action="import">Import</button><button data-action="export">Export</button>
      <button data-action="snap">Snap: On</button>
      <button class="editor-playtest" data-action="playtest">Playtest</button>
      <button class="editor-close" data-action="close">Main Menu</button>
      <input data-role="import" type="file" accept="application/json,.json" hidden>
      <input data-role="music-import" type="file" accept="audio/*,.mp3,.wav,.ogg,.m4a,.aac,.flac" hidden>
    </div>
    <div class="editor-workspace">
      <aside class="editor-sidebar"><h3>Place</h3><div class="editor-palette"></div></aside>
      <div class="editor-panel-resizer" data-resize-panel="left" title="Drag to resize the object palette"></div>
      <div class="editor-viewport">
        <canvas class="editor-canvas" width="960" height="570"></canvas>
        <div class="editor-zoom-controls" aria-label="Editor zoom controls">
          <button type="button" data-action="zoom-out" aria-label="Zoom out">−</button>
          <output data-role="zoom">100%</output>
          <button type="button" data-action="zoom-in" aria-label="Zoom in">+</button>
          <button type="button" data-action="zoom-fit">Fit Level</button>
        </div>
        <p class="editor-camera-note">Wheel / arrows: pan · Ctrl + wheel: zoom · drag the level edge to resize</p>
      </div>
      <div class="editor-panel-resizer" data-resize-panel="right" title="Drag to resize the properties panel"></div>
      <aside class="editor-inspector"><h3>Properties</h3><div class="editor-fields"></div></aside>
    </div>
    <div class="editor-status" role="status" aria-live="polite"></div>`;

  const canvas = host.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  const palette = host.querySelector(".editor-palette");
  const fields = host.querySelector(".editor-fields");
  const status = host.querySelector(".editor-status");
  const importInput = host.querySelector('[data-role="import"]');
  const musicImportInput = host.querySelector('[data-role="music-import"]');
  const draftPicker = host.querySelector('[data-role="draft-picker"]');
  const viewport = host.querySelector(".editor-viewport");
  const zoomOutput = host.querySelector('[data-role="zoom"]');

  Object.keys(LABELS).forEach((name) => {
    const button = document.createElement("button");
    button.type = "button"; button.dataset.tool = name; button.textContent = LABELS[name];
    button.addEventListener("click", () => setTool(name)); palette.append(button);
  });

  function readPanelWidths() {
    try {
      const saved = JSON.parse(localStorage.getItem(LAYOUT_STORAGE_KEY) || "null");
      return {
        left: Math.max(130, Math.min(300, Number(saved?.left) || 170)),
        right: Math.max(180, Math.min(380, Number(saved?.right) || 235))
      };
    } catch { return { left: 170, right: 235 }; }
  }
  let panelWidths = readPanelWidths();
  function applyPanelWidths(save = false) {
    host.style.setProperty("--editor-sidebar-width", `${panelWidths.left}px`);
    host.style.setProperty("--editor-inspector-width", `${panelWidths.right}px`);
    if (save) try { localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(panelWidths)); } catch { /* Layout remains usable for this session. */ }
  }
  applyPanelWidths();
  host.querySelectorAll("[data-resize-panel]").forEach((handle) => {
    handle.addEventListener("pointerdown", (event) => {
      const side = handle.dataset.resizePanel;
      const startX = event.clientX;
      const startWidth = panelWidths[side];
      handle.setPointerCapture(event.pointerId);
      handle.classList.add("active");
      const move = (moveEvent) => {
        const displayScale = host.clientWidth / Math.max(1, host.getBoundingClientRect().width);
        const delta = (moveEvent.clientX - startX) * displayScale * (side === "right" ? -1 : 1);
        const maximum = side === "left" ? 300 : 380;
        panelWidths[side] = Math.max(side === "left" ? 130 : 180, Math.min(maximum, startWidth + delta));
        applyPanelWidths();
      };
      const end = () => {
        handle.classList.remove("active");
        handle.removeEventListener("pointermove", move);
        handle.removeEventListener("pointerup", end);
        handle.removeEventListener("pointercancel", end);
        applyPanelWidths(true);
        resizeCanvas();
      };
      handle.addEventListener("pointermove", move);
      handle.addEventListener("pointerup", end);
      handle.addEventListener("pointercancel", end);
    });
  });

  function freshLevel() {
    return { schemaVersion: 1, id: "my-level", name: "My Level", width: 1600,
      spawn: { x: 60, y: 430 }, exit: { id: "level-exit", x: 1500, y: 400, width: 34, height: 90 },
      settings: { music: "level1", theme: "default", requiredLevelStars: 0,
        rewind: { enabled: false, tutorial: false, field: { enabled: false, radius: 360, offset: 0 } },
        echo: { enabled: false, tutorial: false, canPushCrates: true } },
      objects: []
    };
  }

  function clone(value) { return JSON.parse(JSON.stringify(value)); }
  function nextDraftKey() {
    let key;
    do key = `draft-${draftSerial++}`; while (drafts.some((draft) => draft.key === key));
    return key;
  }
  function activeDraft() { return drafts.find((draft) => draft.key === activeDraftKey) || null; }
  function uniqueLevelIdentity(baseName = "My Level", baseId = "my-level") {
    const ids = new Set(drafts.map((draft) => draft.level.id));
    let index = 1, id = baseId;
    while (ids.has(id)) id = `${baseId}-${++index}`;
    return { id, name: index === 1 ? baseName : `${baseName} ${index}` };
  }
  function syncDraftPicker() {
    draftPicker.replaceChildren(...drafts.map((draft, index) => {
      const option = new Option(draft.level.name || draft.level.id || `Untitled Level ${index + 1}`, draft.key);
      option.title = draft.level.id;
      return option;
    }));
    draftPicker.value = activeDraftKey;
    host.querySelector('[data-action="delete-draft"]').disabled = drafts.length <= 1;
  }
  function snapValue(value) { return snap ? Math.round(value / GRID) * GRID : Math.round(value); }
  function allIds() { return new Set([data.exit.id, ...data.objects.map((object) => object.id)]); }
  function nextId(type) { let index = 1; const ids = allIds(); while (ids.has(`${type}-${index}`)) index++; return `${type}-${index}`; }
  function selectionObject() {
    if (selected === "@spawn") return { type: "spawn", ...data.spawn };
    if (selected === "@exit") return { type: "exit", ...data.exit };
    return data.objects.find((object) => object.id === selected) || null;
  }
  function findObject(id) { return data.objects.find((object) => object.id === id); }
  function serialize() { return JSON.stringify(data); }

  function persist() {
    const current = activeDraft();
    if (current) current.level = data;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 2, activeDraftKey, drafts }));
      localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(data));
    } catch { statusNote = "Draft changed, but browser storage is full or unavailable."; }
  }
  function selectedObjects() { return data.objects.filter((object) => selectedIds.has(object.id)); }
  function setSingleSelection(token) {
    selected = token;
    selectedIds = token && !token.startsWith("@") ? new Set([token]) : new Set();
  }
  function selectObjectOrGroup(object) {
    selected = object.id;
    selectedIds = object.groupId
      ? new Set(data.objects.filter((candidate) => candidate.groupId === object.groupId).map((candidate) => candidate.id))
      : new Set([object.id]);
  }
  function nextGroupId() {
    const used = new Set(data.objects.map((object) => object.groupId).filter(Boolean));
    let index = 1; while (used.has(`group-${index}`)) index++;
    return `group-${index}`;
  }
  function repairKnownEditorData(level) {
    if (!level || typeof level !== "object" || !Array.isArray(level.objects)) return false;
    let repaired = false;
    level.objects.forEach((object) => {
      if (object?.type !== "enemy" || !Object.prototype.hasOwnProperty.call(object, "y")) return;
      if (!Number.isFinite(object.surfaceY) && Number.isFinite(object.y)) object.surfaceY = object.y + 42;
      delete object.y;
      repaired = true;
    });
    return repaired;
  }
  function restore() {
    try {
      const savedWorkspace = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      let repairedCount = 0, rejectedCount = 0, restoredStoredDraft = false;
      if (savedWorkspace?.version === 2 && Array.isArray(savedWorkspace.drafts)) {
        for (const saved of savedWorkspace.drafts) {
          if (!saved || typeof saved.key !== "string") { rejectedCount++; continue; }
          const candidate = clone(saved.level);
          if (repairKnownEditorData(candidate)) repairedCount++;
          const result = api.importLevel(JSON.stringify(candidate));
          if (result.ok && !drafts.some((draft) => draft.key === saved.key)) { drafts.push({ key: saved.key, level: result.level }); restoredStoredDraft = true; }
          else rejectedCount++;
        }
        activeDraftKey = drafts.some((draft) => draft.key === savedWorkspace.activeDraftKey) ? savedWorkspace.activeDraftKey : drafts[0]?.key || "";
      }
      if (!drafts.length) {
        const legacyText = localStorage.getItem(LEGACY_STORAGE_KEY);
        if (legacyText) {
          const legacy = JSON.parse(legacyText);
          if (repairKnownEditorData(legacy)) repairedCount++;
          const result = api.importLevel(JSON.stringify(legacy));
          if (result.ok) { drafts.push({ key: nextDraftKey(), level: result.level }); restoredStoredDraft = true; }
        }
      }
      if (!drafts.length) drafts.push({ key: nextDraftKey(), level: data });
      activeDraftKey ||= drafts[0].key;
      data = activeDraft().level;
      statusNote = restoredStoredDraft
        ? `Restored ${drafts.length} local level${drafts.length === 1 ? "" : "s"}.${repairedCount ? ` Repaired ${repairedCount}.` : ""}${rejectedCount ? ` Skipped ${rejectedCount} invalid draft${rejectedCount === 1 ? "" : "s"}.` : ""}`
        : "Started a new local level workspace.";
      persist();
    } catch {
      drafts = [{ key: nextDraftKey(), level: data }]; activeDraftKey = drafts[0].key;
      statusNote = "Saved editor levels could not be read safely; started a new local level.";
      persist();
    }
  }
  function commit(mutator, note = "Draft updated.") {
    const before = serialize(); mutator(); const after = serialize();
    if (before === after) return;
    undoStack.push(before); if (undoStack.length > HISTORY_LIMIT) undoStack.shift(); redoStack = [];
    statusNote = note; persist(); refresh();
  }
  function finishDrag(before, note) {
    if (!before || before === serialize()) return refresh();
    undoStack.push(before); if (undoStack.length > HISTORY_LIMIT) undoStack.shift(); redoStack = [];
    statusNote = note; persist(); refresh();
  }
  function undo() {
    if (!undoStack.length) return;
    redoStack.push(serialize()); data = JSON.parse(undoStack.pop()); selectedIds = new Set([...selectedIds].filter((id)=>data.objects.some((object)=>object.id===id))); if (!selectionObject()) setSingleSelection("@spawn"); clampCamera();
    statusNote = "Undid the last editor action."; persist(); refresh();
  }
  function redo() {
    if (!redoStack.length) return;
    undoStack.push(serialize()); data = JSON.parse(redoStack.pop()); selectedIds = new Set([...selectedIds].filter((id)=>data.objects.some((object)=>object.id===id))); if (!selectionObject()) setSingleSelection("@spawn"); clampCamera();
    statusNote = "Redid the editor action."; persist(); refresh();
  }

  function validate() {
    const result = api.validateLevel(data);
    status.className = `editor-status ${result.valid ? "ok" : "error"}`;
    status.textContent = result.valid ? statusNote : `${result.errors.length} issue${result.errors.length === 1 ? "" : "s"}: ${result.errors.slice(0, 3).join(" · ")}`;
    host.querySelector('[data-action="playtest"]').disabled = !result.valid;
    return result;
  }

  function setTool(name) {
    if (name === "settings") {
      tool = "select";
      selected = "@settings";
      canvas.dataset.tool = "select";
      host.querySelectorAll("[data-tool]").forEach((button) => button.classList.toggle("active", button.dataset.tool === "settings"));
      refresh();
      return;
    }
    tool = name; canvas.dataset.tool = name;
    host.querySelectorAll("[data-tool]").forEach((button) => button.classList.toggle("active", button.dataset.tool === name));
  }

  function visibleWorldWidth() { return canvas.width / zoom; }
  function visibleWorldHeight() { return canvas.height / zoom; }
  function clampAxis(value, worldSize, visibleSize) {
    const padding = VIEW_PADDING / zoom;
    const minimum = -padding;
    const maximum = worldSize - visibleSize + padding;
    if (maximum < minimum) return (worldSize - visibleSize) / 2;
    return Math.max(minimum, Math.min(maximum, value));
  }
  function clampCamera() {
    cameraX = clampAxis(cameraX, data.width, visibleWorldWidth());
    cameraY = clampAxis(cameraY, WORLD_H, visibleWorldHeight());
  }
  function updateZoomLabel() { zoomOutput.value = `${Math.round(zoom * 100)}%`; }
  function setZoom(nextZoom, anchorX = canvas.width / 2, anchorY = canvas.height / 2) {
    const next = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, nextZoom));
    const worldX = cameraX + anchorX / zoom;
    const worldY = cameraY + anchorY / zoom;
    zoom = next;
    cameraX = worldX - anchorX / zoom;
    cameraY = worldY - anchorY / zoom;
    viewFitted = false;
    clampCamera();
    updateZoomLabel();
    draw();
  }
  function fitLevel() {
    if (!canvas.width || !canvas.height) return;
    const horizontal = (canvas.width - VIEW_PADDING * 2) / data.width;
    const vertical = (canvas.height - VIEW_PADDING * 2) / WORLD_H;
    zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, horizontal, vertical));
    cameraX = (data.width - visibleWorldWidth()) / 2;
    cameraY = (WORLD_H - visibleWorldHeight()) / 2;
    viewFitted = true;
    updateZoomLabel();
    draw();
  }

  function worldPoint(event) {
    const rect = canvas.getBoundingClientRect();
    const screenX = (event.clientX - rect.left) / rect.width * canvas.width;
    const screenY = (event.clientY - rect.top) / rect.height * canvas.height;
    return {
      x: cameraX + screenX / zoom,
      y: cameraY + screenY / zoom,
      screenX,
      screenY
    };
  }
  function objectRect(object) {
    const withControl = (rect) => {
      if (!object.control) return rect;
      const baseX = object.x;
      const baseY = object.type === "enemy" ? object.surfaceY - 42 : object.y;
      const progress = object.control.initialProgress || 0;
      const eased = progress * progress * (3 - 2 * progress);
      return {
        ...rect,
        x: rect.x + (object.control.target.x - baseX) * eased,
        y: rect.y + (object.control.target.y - baseY) * eased
      };
    };
    if (object.type === "hazard" && object.attachedTo) {
      const parent = findObject(object.attachedTo);
      if (parent) return withControl({ x: parent.x + (object.offsetX || 0), y: parent.y + (object.offsetY || 0), width: object.width, height: object.height });
    }
    if (object.type === "spawn") return withControl({ x: object.x, y: object.y, width: 46, height: 42 });
    if (object.type === "movingPlatform" && !object.control) {
      const offset = Math.sin(object.motion.phase || 0) * object.motion.range;
      return { x: object.x + (object.motion.axis === "x" ? offset : 0), y: object.y + (object.motion.axis === "y" ? offset : 0), width: object.width, height: object.height };
    }
    if (object.type === "controlledPlatform" && object.initialProgress) {
      const progress = object.initialProgress, eased = progress * progress * (3 - 2 * progress);
      return { x: object.x + (object.target.x - object.x) * eased, y: object.y + (object.target.y - object.y) * eased, width: object.width, height: object.height };
    }
    if (object.type === "exit") return withControl(object);
    if (object.type === "star") return withControl({ x: object.x - 16, y: object.y - 16, width: 32, height: 32 });
    if (object.type === "switch") return withControl({ x: object.x, y: object.y, width: 42, height: 44 });
    if (object.type === "pressurePlate") return withControl({ x: object.x, y: object.y, width: object.width, height: 12 });
    if (object.type === "enemy") return withControl({ x: object.x, y: object.surfaceY - 42, width: 46, height: 42 });
    if (object.type === "movingObstacle") return withControl({ x: object.x, y: object.y, width: object.size, height: object.size });
    return withControl({ x: object.x, y: object.y, width: object.width, height: object.height });
  }
  function translateSchemaObject(object, dx, dy, movingIds = selectedIds) {
    if (object.type === "hazard" && object.attachedTo) {
      if (!movingIds.has(object.attachedTo)) { object.offsetX = (object.offsetX || 0) + dx; object.offsetY = (object.offsetY || 0) + dy; }
      return;
    }
    object.x += dx;
    if (object.type === "enemy") {
      object.surfaceY += dy; object.patrolMinX += dx; object.patrolMaxX += dx;
    } else object.y += dy;
    if (object.target) { object.target.x += dx; object.target.y += dy; }
    if (object.control?.target) { object.control.target.x += dx; object.control.target.y += dy; }
    if (object.motionPath) object.motionPath.forEach((point) => { point.x += dx; point.y += dy; });
  }
  function hitTest(point) {
    const choices = [
      ...data.objects.map((object) => ({ object, token: object.id })).reverse(),
      { object: { type: "exit", ...data.exit }, token: "@exit" },
      { object: { type: "spawn", ...data.spawn }, token: "@spawn" }
    ];
    return choices.find(({ object }) => { const rect = objectRect(object); return point.x >= rect.x && point.x <= rect.x + rect.width && point.y >= rect.y && point.y <= rect.y + rect.height; }) || null;
  }

  function defaultObject(placeType, x, y) {
    const type = PLACE_TO_TYPE[placeType] || placeType;
    const base = { id: nextId(placeType === "spikes" || placeType === "lava" ? placeType : type), type, x: snapValue(x), y: snapValue(y) };
    const rect = (width, height, extra = {}) => ({ ...base, width, height, ...extra });
    if (type === "platform") return rect(160, 80, { material: "grass" });
    if (type === "floatingPlatform") return rect(120, 50, { material: "stone" });
    if (type === "crate") return rect(60, 60, { rewindable: true });
    if (type === "breakableBlock") return rect(110, 54, { material: "stone", trigger: "stand", rewindable: true, rewindSpeed: 260 });
    if (type === "jumpPad") return rect(72, 20);
    if (type === "hazard") return rect(placeType === "lava" ? 180 : 80, placeType === "lava" ? 70 : 18, { hazard: placeType });
    if (type === "star") return base;
    if (type === "movingPlatform") return rect(140, 40, { material: "stone", motion: { axis: "x", range: 140, speed: 1, phase: 0 } });
    const controller = data.objects.find((object) => ["switch", "pressurePlate"].includes(object.type));
    if (type === "controlledPlatform") return rect(140, 40, { material: "stone", target: { x: snapValue(x + 180), y: snapValue(y) }, controllerIds: [controller.id], requiresActive: true, releaseDelay: 0, moveDuration: 1.15, initialProgress: 0 });
    if (type === "rewindPlatform") return rect(160, 40, { material: "stone", target: { x: snapValue(x + 240), y: snapValue(y) }, speed: 260, releaseDelay: 2, motionPath: [{ x: snapValue(x), y: snapValue(y) }, { x: snapValue(x + 240), y: snapValue(y) }], pathIndex: 1, autoStart: true, carryDuringRewind: true, resumeAfterRewind: true, loopPath: false, carryPlayer: true });
    if (type === "switch") return { ...base, momentary: false, pulseDuration: 1, initialFlipped: false };
    if (type === "pressurePlate") return { ...base, width: 100, filter: "any" };
    if (type === "enemy") return { id: base.id, type, x: base.x, surfaceY: snapValue(y + 42), patrolMinX: snapValue(x - 100), patrolMaxX: snapValue(x + 160), direction: 1, speed: 62, stopAtBoundary: false, rewindable: true };
    if (type === "movingObstacle") return { ...base, size: 58, speed: 170, motionPath: [{ x: snapValue(x), y: snapValue(y) }, { x: snapValue(x + 220), y: snapValue(y) }], pathIndex: 1, loopPath: true, resumeAfterRewind: true };
    return base;
  }

  function place(point) {
    if (tool === "spawn") return commit(() => { data.spawn.x = snapValue(point.x); data.spawn.y = snapValue(point.y); setSingleSelection("@spawn"); }, "Moved the player spawn.");
    if (tool === "exit") return commit(() => { data.exit.x = snapValue(point.x); data.exit.y = snapValue(point.y); setSingleSelection("@exit"); }, "Moved the level exit.");
    if (tool === "controlledPlatform" && !data.objects.some((object) => ["switch", "pressurePlate"].includes(object.type))) {
      statusNote = "Place a switch or pressure plate before adding a controlled platform.";
      refresh();
      return;
    }
    const object = defaultObject(tool, point.x, point.y);
    commit(() => { data.objects.push(object); setSingleSelection(object.id); tool = "select"; }, `Placed ${LABELS[PLACE_TO_TYPE[tool] || tool] || tool}.`);
    setTool("select");
  }

  function waypointHit(point, object) {
    if (!object?.motionPath || object.control) return -1;
    return object.motionPath.findIndex((waypoint) => Math.hypot(waypoint.x - point.x, waypoint.y - point.y) < 12 / zoom);
  }
  function specialHandleHit(point, object) {
    const tolerance = 12 / zoom;
    if (object?.control?.target && Math.hypot(object.control.target.x - point.x, object.control.target.y - point.y) < tolerance) return "control-target";
    if (!object?.control && object?.target && Math.hypot(object.target.x - point.x, object.target.y - point.y) < tolerance) return "target";
    if (object?.type === "enemy") {
      if (Math.abs(object.patrolMinX - point.x) < tolerance && Math.abs(object.surfaceY - point.y) < 35 / zoom) return "min";
      if (Math.abs(object.patrolMaxX - point.x) < tolerance && Math.abs(object.surfaceY - point.y) < 35 / zoom) return "max";
    }
    return null;
  }
  function levelWidthHandleHit(point) {
    return Math.abs(point.x - data.width) <= 15 / zoom && point.y >= 0 && point.y <= WORLD_H;
  }

  canvas.addEventListener("pointerdown", (event) => {
    const point = worldPoint(event);
    if (tool !== "select") return place(point);
    const current = selectionObject(); const wp = waypointHit(point, current); const special = specialHandleHit(point, current);
    if (levelWidthHandleHit(point)) {
      setSingleSelection("@settings");
      viewFitted = false;
      drag = { kind: "level-width", before: serialize() };
      refresh();
    } else if (wp >= 0 || special) {
      drag = { kind: wp >= 0 ? "waypoint" : special, index: wp, before: serialize() };
    } else {
      const hit = hitTest(point);
      if (!hit) { setSingleSelection(null); viewFitted = false; drag = { kind: "pan", clientX: event.clientX, clientY: event.clientY, cameraX, cameraY }; refresh(); }
      else {
        if ((event.shiftKey || event.ctrlKey || event.metaKey) && !hit.token.startsWith("@")) {
          const members = hit.object.groupId ? data.objects.filter((object) => object.groupId === hit.object.groupId) : [hit.object];
          const remove = members.every((object) => selectedIds.has(object.id));
          members.forEach((object) => remove ? selectedIds.delete(object.id) : selectedIds.add(object.id));
          selected = selectedIds.has(hit.object.id) ? hit.object.id : [...selectedIds][0] || null;
          drag = null; refresh(); return;
        }
        if (hit.token.startsWith("@")) setSingleSelection(hit.token);
        else if (event.altKey) setSingleSelection(hit.token);
        else if (selectedIds.size > 1 && selectedIds.has(hit.object.id)) selected = hit.object.id;
        else selectObjectOrGroup(hit.object);
        const rect = objectRect(hit.object);
        const tolerance = 14 / zoom;
        const resize = selectedIds.size <= 1 && RESIZABLE.has(hit.object.type) && Math.abs(point.x - (rect.x + rect.width)) < tolerance && Math.abs(point.y - (rect.y + rect.height)) < tolerance;
        drag = { kind: resize ? "resize" : "move", before: serialize(), offsetX: point.x - rect.x, offsetY: point.y - rect.y };
        refresh();
      }
    }
    canvas.setPointerCapture(event.pointerId); canvas.classList.add("dragging");
  });
  canvas.addEventListener("pointermove", (event) => {
    const point = worldPoint(event);
    if (!drag) {
      canvas.style.cursor = tool === "select" && levelWidthHandleHit(point) ? "ew-resize" : "";
      return;
    }
    const object = selectionObject();
    if (drag.kind === "pan") {
      const canvasRect = canvas.getBoundingClientRect();
      const deltaX = (event.clientX - drag.clientX) / canvasRect.width * canvas.width / zoom;
      const deltaY = (event.clientY - drag.clientY) / canvasRect.height * canvas.height / zoom;
      cameraX = drag.cameraX - deltaX;
      cameraY = drag.cameraY - deltaY;
      clampCamera();
    }
    else if (drag.kind === "level-width") { data.width = Math.max(320, snapValue(point.x)); clampCamera(); }
    else if (drag.kind === "waypoint") { object.motionPath[drag.index].x = snapValue(point.x); object.motionPath[drag.index].y = snapValue(point.y); }
    else if (drag.kind === "control-target") {
      const editable = selected === "@exit" ? data.exit : object;
      editable.control.target.x = snapValue(point.x); editable.control.target.y = snapValue(point.y);
    }
    else if (drag.kind === "target") { object.target.x = snapValue(point.x); object.target.y = snapValue(point.y); }
    else if (drag.kind === "min") object.patrolMinX = Math.min(snapValue(point.x), object.patrolMaxX - GRID);
    else if (drag.kind === "max") object.patrolMaxX = Math.max(snapValue(point.x), object.patrolMinX + GRID);
    else if (drag.kind === "move") {
      const x = snapValue(point.x - drag.offsetX), y = snapValue(point.y - drag.offsetY);
      if (selected === "@spawn") Object.assign(data.spawn, { x, y });
      else if (selectedIds.size > 1 || object.groupId) {
        const current = objectRect(object), dx = x - current.x, dy = y - current.y;
        const moving = object.groupId ? data.objects.filter((member) => member.groupId === object.groupId) : selectedObjects();
        const movingIds = new Set(moving.map((member) => member.id));
        moving.forEach((member) => translateSchemaObject(member, dx, dy, movingIds));
      }
      else if (object.control) {
        const editable = selected === "@exit" ? data.exit : object;
        const current = objectRect(object), dx = x - current.x, dy = y - current.y;
        if (editable.type === "enemy") { editable.x += dx; editable.surfaceY += dy; }
        else if (editable.type === "star") { editable.x += dx; editable.y += dy; }
        else { editable.x += dx; editable.y += dy; }
        editable.control.target.x += dx;
        editable.control.target.y += dy;
      }
      else if (selected === "@exit") Object.assign(data.exit, { x, y });
      else if (object.type === "enemy") { const dy = y - (object.surfaceY - 42); object.x = x; object.surfaceY += dy; }
      else if (object.type === "movingPlatform") { const current=objectRect(object);object.x+=x-current.x;object.y+=y-current.y; }
      else if (object.type === "controlledPlatform" && object.initialProgress) { const current=objectRect(object),dx=x-current.x,dy=y-current.y;object.x+=dx;object.y+=dy;object.target.x+=dx;object.target.y+=dy; }
      else if (object.type === "hazard" && object.attachedTo) { const parent=findObject(object.attachedTo);object.offsetX=x-parent.x;object.offsetY=y-parent.y; }
      else Object.assign(object, { x, y });
    } else if (drag.kind === "resize") {
      const rect = objectRect(object); object.width = Math.max(GRID, snapValue(point.x - rect.x));
      if (object.type !== "pressurePlate") object.height = Math.max(GRID, snapValue(point.y - rect.y));
    }
    draw();
  });
  function endPointer() {
    if (!drag) return;
    const { before, kind } = drag;
    drag = null;
    canvas.classList.remove("dragging");
    canvas.style.cursor = "";
    if (kind === "level-width") finishDrag(before, "Changed the level width.");
    else if (kind !== "pan") finishDrag(before, "Moved the selected editor item.");
    else draw();
  }
  canvas.addEventListener("pointerup", endPointer); canvas.addEventListener("pointercancel", endPointer);
  canvas.addEventListener("wheel", (event) => {
    event.preventDefault();
    if (event.ctrlKey || event.metaKey) {
      const point = worldPoint(event);
      setZoom(zoom * Math.exp(-event.deltaY * .0015), point.screenX, point.screenY);
      return;
    }
    const hasVerticalOverflow = visibleWorldHeight() < WORLD_H;
    viewFitted = false;
    if (hasVerticalOverflow && !event.shiftKey && Math.abs(event.deltaY) >= Math.abs(event.deltaX)) cameraY += event.deltaY / zoom;
    else cameraX += (event.deltaX || event.deltaY) / zoom;
    clampCamera();
    draw();
  }, { passive: false });

  function field(label, key, value, options = {}) {
    const wrapper = document.createElement("label"); wrapper.className = "editor-field"; wrapper.innerHTML = `<span>${label}</span>`;
    let input;
    if (options.values) { input = document.createElement("select"); options.values.forEach(([v, text]) => input.add(new Option(text, v))); input.value = String(value ?? ""); }
    else { input = document.createElement("input"); input.type = options.type || (typeof value === "number" ? "number" : "text"); if (options.step) input.step = options.step; input.value = value ?? ""; }
    input.addEventListener("change", () => options.change ? options.change(input) : changeProperty(key, input, options)); wrapper.append(input); fields.append(wrapper); return input;
  }
  function check(label, key, value, options = {}) {
    const wrapper = document.createElement("label"); wrapper.className = "editor-check"; const input = document.createElement("input"); input.type = "checkbox"; input.checked = Boolean(value);
    input.addEventListener("change", () => options.change ? options.change(input) : commit(() => setPath(selectionObject(), key, input.checked), `Changed ${label}.`)); wrapper.append(input, document.createTextNode(label)); fields.append(wrapper);
  }
  function heading(text) { const section = document.createElement("div"); section.className = "editor-section"; section.innerHTML = `<h4>${text}</h4>`; fields.append(section); }
  function setPath(object, path, value) { const parts = path.split("."); let target = object; while (parts.length > 1) target = target[parts.shift()]; target[parts[0]] = value; }
  function changeProperty(key, input, options = {}) {
    const parsed = options.type === "text" || input.type === "text" || input.tagName === "SELECT" && options.number !== true ? input.value : Number(input.value);
    commit(() => setPath(selectionObject(), key, parsed), `Changed ${key}.`);
  }
  function renameId(input) {
    const object = selectionObject(); const old = object.id; const next = input.value;
    if (!next.trim()) { statusNote = "IDs cannot be empty."; return refresh(); }
    if (next !== old && allIds().has(next)) { statusNote = `The ID “${next}” is already used. Choose a different one.`; return refresh(); }
    commit(() => {
      if (selected === "@exit") data.exit.id = next;
      else { object.id = next; selectedIds.delete(old); selectedIds.add(next); selected = next; }
      data.objects.forEach((item) => {
        if (item.controllerId === old) item.controllerId = next;
        if (item.attachedTo === old) item.attachedTo = next;
        if (item.controllerIds) item.controllerIds = item.controllerIds.map((id) => id === old ? next : id);
        if (item.control?.controllerIds) item.control.controllerIds = item.control.controllerIds.map((id) => id === old ? next : id);
      });
      if (data.exit.control?.controllerIds) data.exit.control.controllerIds = data.exit.control.controllerIds.map((id) => id === old ? next : id);
    }, `Renamed ${old} and updated its links.`);
  }

  function controllerLinks(object, control = object) {
    heading("Controllers");
    const eligible = data.objects.filter((item) => item !== object && ["switch", "pressurePlate"].includes(item.type));
    const list = document.createElement("div"); list.className = "editor-link-list";
    eligible.forEach((item) => {
      const label = document.createElement("label"), input = document.createElement("input"); input.type = "checkbox"; input.checked = control.controllerIds.includes(item.id);
      input.disabled = input.checked && control.controllerIds.length === 1;
      input.title = input.disabled ? "Controlled movement needs at least one controller." : "";
      input.addEventListener("change", () => commit(() => {
        control.controllerIds = input.checked ? [...new Set([...control.controllerIds, item.id])] : control.controllerIds.filter((id) => id !== item.id);
      }, `Updated links for ${object.id}.`)); label.append(input, document.createTextNode(`${item.id} (${item.type})`)); list.append(label);
    });
    if (!eligible.length) list.textContent = "Place a switch or pressure plate first."; fields.append(list);
  }

  function controlBasePoint(object) {
    return { x: object.x, y: object.type === "enemy" ? object.surfaceY - 42 : object.y };
  }

  function addGenericControl(object) {
    const controller = data.objects.find((item) => item !== object && ["switch", "pressurePlate"].includes(item.type));
    if (!controller) { statusNote = "Place a switch or pressure plate before controlling this object."; return refresh(); }
    commit(() => {
      if (object.type === "hazard" && object.attachedTo) {
        const rect = objectRect(object);
        object.x = rect.x; object.y = rect.y;
        delete object.attachedTo; delete object.offsetX; delete object.offsetY;
      }
      const base = controlBasePoint(object);
      object.control = {
        controllerIds: [controller.id],
        target: { x: Math.min(data.width, base.x + 180), y: base.y },
        releaseDelay: 0,
        moveDuration: 1.15,
        initialProgress: 0
      };
    }, `Added controlled movement to ${object.id}.`);
  }

  function renderGenericControl(object) {
    heading("Controlled Movement");
    if (!object.control) {
      const add = document.createElement("button"); add.type = "button"; add.textContent = "Add Controlled Movement";
      add.addEventListener("click", () => addGenericControl(object)); fields.append(add); return;
    }
    if (["movingPlatform","rewindPlatform","movingObstacle","enemy"].includes(object.type)) {
      const note=document.createElement("p");note.className="editor-control-note";note.textContent="Controlled movement overrides this object's normal automatic movement during playtest.";fields.append(note);
    }
    const controlNumber = (label, key, value, step = undefined) => field(label, key, value, {
      ...(step ? { step } : {}),
      change: (input) => commit(() => { object.control[key] = Number(input.value); }, `Changed controlled movement ${key}.`)
    });
    field("Controlled target X", "control.target.x", object.control.target.x, { change: (input) => commit(() => { object.control.target.x = Number(input.value); }, "Changed controlled target X.") });
    field("Controlled target Y", "control.target.y", object.control.target.y, { change: (input) => commit(() => { object.control.target.y = Number(input.value); }, "Changed controlled target Y.") });
    controlNumber("Initial progress", "initialProgress", object.control.initialProgress || 0, ".05");
    controlNumber("Release delay", "releaseDelay", object.control.releaseDelay || 0, ".05");
    controlNumber("Move duration", "moveDuration", object.control.moveDuration || 1.15, ".05");
    controllerLinks(object, object.control);
    const remove=document.createElement("button");remove.type="button";remove.textContent="Remove Controlled Movement";remove.addEventListener("click",()=>commit(()=>delete object.control,`Removed controlled movement from ${object.id}.`));fields.append(remove);
  }

  function pathEditor(object) {
    heading("Motion Path");
    object.motionPath.forEach((point, index) => {
      const row = document.createElement("div"); row.className = "editor-waypoint";
      for (const axis of ["x", "y"]) { const input = document.createElement("input"); input.type = "number"; input.value = point[axis]; input.title = `${axis.toUpperCase()} coordinate`; input.addEventListener("change", () => commit(() => point[axis] = Number(input.value), `Changed waypoint ${index + 1}.`)); row.append(input); }
      const remove = document.createElement("button"); remove.type = "button"; remove.textContent = "×"; remove.disabled = object.motionPath.length <= 2; remove.addEventListener("click", () => commit(() => { object.motionPath.splice(index, 1); object.pathIndex = Math.min(object.pathIndex || 0, object.motionPath.length - 1); }, "Removed a waypoint.")); row.append(remove); fields.append(row);
    });
    const add = document.createElement("button"); add.type = "button"; add.textContent = "Add waypoint"; add.addEventListener("click", () => commit(() => { const last = object.motionPath.at(-1); object.motionPath.push({ x: Math.min(data.width, last.x + 120), y: last.y }); }, "Added a waypoint.")); fields.append(add);
  }

  function renderInspector() {
    fields.replaceChildren(); const object = selectionObject();
    if (selected === "@settings") { renderSettings(); return; }
    if (selectedIds.size > 1) {
      const members = selectedObjects();
      const groupIds = new Set(members.map((member) => member.groupId).filter(Boolean));
      fields.innerHTML = `<p class="editor-selection-summary">${members.length} objects selected${groupIds.size === 1 && members.every((member) => member.groupId) ? ` · ${[...groupIds][0]}` : ""}. Drag any selected object to move the selection together.</p>`;
      return;
    }
    if (!object) { fields.textContent = "Select an object or choose something from the placement palette."; return; }
    if (object.type === "spawn") { field("X", "x", data.spawn.x); field("Y", "y", data.spawn.y); return; }
    if (object.type === "exit") {
      const exitNumber = (label, key) => field(label, key, data.exit[key], { change: (input) => commit(() => { data.exit[key] = Number(input.value); }, `Changed exit ${key}.`) });
      field("ID", "id", data.exit.id, { type: "text", change: renameId });
      exitNumber("X", "x"); exitNumber("Y", "y"); exitNumber("Width", "width"); exitNumber("Height", "height");
      renderGenericControl(data.exit); return;
    }
    if (object.groupId) {
      const groupNote = document.createElement("p"); groupNote.className = "editor-selection-summary";
      groupNote.textContent = `${object.groupId}: moving this object moves the whole group. Alt-click a member to edit it by itself.`;
      fields.append(groupNote);
    }
    field("Stable ID", "id", object.id, { type: "text", change: renameId });
    field("X", "x", object.x); field(object.type === "enemy" ? "Surface Y" : "Y", object.type === "enemy" ? "surfaceY" : "y", object.type === "enemy" ? object.surfaceY : object.y);
    if (RECT_TYPES.has(object.type)) { field("Width", "width", object.width); field("Height", "height", object.height); }
    if (object.type === "pressurePlate") field("Width", "width", object.width);
    if (["platform","floatingPlatform","breakableBlock","movingPlatform","controlledPlatform","rewindPlatform"].includes(object.type)) field("Material", "material", object.material, { values: [["grass","Grass"],["stone","Stone"],["crate","Crate"]] });
    if (["crate","breakableBlock","enemy"].includes(object.type)) check("Rewindable", "rewindable", object.rewindable !== false);
    if (object.type === "breakableBlock") { field("Break trigger", "trigger", object.trigger, { values: [["stand","Stand"],["impact","Jump impact"]] }); field("Rewind speed", "rewindSpeed", object.rewindSpeed || 260); }
    if (object.type === "hazard") {
      field("Hazard", "hazard", object.hazard, { values: [["spikes","Spikes"],["lava","Lava"]] });
      field("Attach to moving object", "attachedTo", object.attachedTo || "", { values: [["","None"], ...data.objects.filter((item) => item !== object && ["movingPlatform","controlledPlatform","rewindPlatform"].includes(item.type)).map((item) => [item.id,item.id])], change: (input) => commit(() => { if (input.value) { object.attachedTo=input.value;object.offsetX ||= 0;object.offsetY ||= -object.height; } else { const rect=objectRect(object);delete object.attachedTo;delete object.offsetX;delete object.offsetY;object.x=rect.x;object.y=rect.y; } }, "Changed hazard attachment.") });
      if (object.attachedTo) { field("Attachment offset X", "offsetX", object.offsetX || 0); field("Attachment offset Y", "offsetY", object.offsetY || 0); }
    }
    if (object.type === "movingPlatform") { field("Axis", "motion.axis", object.motion.axis, { values: [["x","Horizontal"],["y","Vertical"]] }); field("Range", "motion.range", object.motion.range); field("Speed", "motion.speed", object.motion.speed, { step: ".1" }); field("Starting phase", "motion.phase", object.motion.phase || 0, { step: ".1" }); }
    if (object.type === "controlledPlatform") { field("Target X", "target.x", object.target.x); field("Target Y", "target.y", object.target.y); field("Initial progress", "initialProgress", object.initialProgress || 0, { step: ".05" }); check("Requires active control", "requiresActive", object.requiresActive); field("Release delay", "releaseDelay", object.releaseDelay || 0, { step: ".05" }); field("Move duration", "moveDuration", object.moveDuration || 1.15, { step: ".05" }); controllerLinks(object); }
    if (object.type === "rewindPlatform") {
      field("Target X", "target.x", object.target.x); field("Target Y", "target.y", object.target.y); field("Speed", "speed", object.speed); field("Release delay", "releaseDelay", object.releaseDelay || 0, { step: ".05" }); field("Starting waypoint", "pathIndex", object.pathIndex || 0);
      field("Controller plate", "controllerId", object.controllerId || "", { values: [["","None"], ...data.objects.filter((item) => item.type === "pressurePlate").map((item) => [item.id,item.id])], change: (input) => commit(() => { if (input.value) object.controllerId=input.value; else delete object.controllerId; }, "Changed the Rewind platform controller.") });
      for (const key of ["autoStart","autoWhenRidden","carryDuringRewind","resumeAfterRewind","loopPath","carryPlayer"]) check(key.replace(/[A-Z]/g, (letter) => ` ${letter.toLowerCase()}`), key, object[key]);
      pathEditor(object);
    }
    if (object.type === "switch") { check("Momentary", "momentary", object.momentary); check("Starts flipped", "initialFlipped", object.initialFlipped); field("Pulse duration", "pulseDuration", object.pulseDuration || 1, { step: ".05" }); }
    if (object.type === "pressurePlate") field("Activation filter", "filter", object.filter, { values: [["any","Any weight"],["crate","Crate only"],["enemy","Enemy only"]] });
    if (object.type === "enemy") { field("Patrol min X", "patrolMinX", object.patrolMinX); field("Patrol max X", "patrolMaxX", object.patrolMaxX); field("Starting direction", "direction", object.direction, { values: [["1","Right"],["-1","Left"]], number: true }); field("Speed", "speed", object.speed); check("Stop at boundary", "stopAtBoundary", object.stopAtBoundary); }
    if (object.type === "movingObstacle") { field("Size", "size", object.size); field("Speed", "speed", object.speed); field("Starting waypoint", "pathIndex", object.pathIndex || 0); check("Loop path", "loopPath", object.loopPath); check("Resume after rewind", "resumeAfterRewind", object.resumeAfterRewind); pathEditor(object); }
    if (object.type !== "controlledPlatform") renderGenericControl(object);
    const remove = document.createElement("button"); remove.type = "button"; remove.className = "editor-danger"; remove.textContent = "Delete object"; remove.addEventListener("click", deleteSelected); fields.append(remove);
  }

  function groupSelection() {
    const members = selectedObjects();
    if (members.length < 2) { statusNote = "Select at least two objects with Shift or Ctrl, then choose Group."; return refresh(); }
    const groupId = nextGroupId();
    commit(() => {
      members.forEach((object) => {
        if (object.type === "hazard" && object.attachedTo) {
          const rect = objectRect(object); object.x = rect.x; object.y = rect.y;
          delete object.attachedTo; delete object.offsetX; delete object.offsetY;
        }
        object.groupId = groupId;
      });
    }, `Grouped ${members.length} objects as ${groupId}.`);
  }

  function ungroupSelection() {
    const groupIds = new Set(selectedObjects().map((object) => object.groupId).filter(Boolean));
    if (!groupIds.size) { statusNote = "The selected objects are not grouped."; return refresh(); }
    const members = data.objects.filter((object) => groupIds.has(object.groupId));
    selectedIds = new Set(members.map((object) => object.id)); selected = members[0]?.id || null;
    commit(() => members.forEach((object) => delete object.groupId), `Ungrouped ${members.length} objects.`);
  }

  function copySelection() {
    const members = selectedObjects();
    if (!members.length) { statusNote = "Select an object or group before copying."; return refresh(); }
    objectClipboard = { kind: "platforms-editor-objects", objects: clone(members) };
    try { localStorage.setItem("platforms-past-editor-object-clipboard-v1", JSON.stringify(objectClipboard)); } catch { /* In-memory copy still works. */ }
    navigator.clipboard?.writeText(JSON.stringify(objectClipboard)).catch(() => {});
    statusNote = `Copied ${members.length} object${members.length === 1 ? "" : "s"}.`; refresh();
  }

  function uniqueCopiedId(original, reserved) {
    let index = 1, candidate = `${original}-copy`;
    while (reserved.has(candidate)) candidate = `${original}-copy-${++index}`;
    reserved.add(candidate); return candidate;
  }

  async function pasteSelection() {
    let payload = objectClipboard;
    if (!payload) {
      try { payload = JSON.parse(localStorage.getItem("platforms-past-editor-object-clipboard-v1") || "null"); } catch { /* No saved editor copy. */ }
    }
    if (!payload && navigator.clipboard?.readText) {
      try { payload = JSON.parse(await navigator.clipboard.readText()); } catch { /* Clipboard did not contain editor objects. */ }
    }
    if (payload?.kind !== "platforms-editor-objects" || !Array.isArray(payload.objects) || !payload.objects.length) {
      statusNote = "Nothing copied from the level editor."; return refresh();
    }
    const copies = clone(payload.objects), reserved = allIds(), idMap = new Map(), groupMap = new Map();
    const reservedGroups = new Set(data.objects.map((object) => object.groupId).filter(Boolean));
    const copiedGroupId = () => { let index = 1; while (reservedGroups.has(`group-${index}`)) index++; const id = `group-${index}`; reservedGroups.add(id); return id; };
    copies.forEach((object) => idMap.set(object.id, uniqueCopiedId(object.id, reserved)));
    copies.forEach((object) => {
      const oldId = object.id; object.id = idMap.get(oldId);
      if (object.groupId) { if (!groupMap.has(object.groupId)) groupMap.set(object.groupId, copiedGroupId()); object.groupId = groupMap.get(object.groupId); }
      if (idMap.has(object.controllerId)) object.controllerId = idMap.get(object.controllerId);
      if (idMap.has(object.attachedTo)) object.attachedTo = idMap.get(object.attachedTo);
      if (object.controllerIds) object.controllerIds = object.controllerIds.map((id) => idMap.get(id) || id);
      if (object.control?.controllerIds) object.control.controllerIds = object.control.controllerIds.map((id) => idMap.get(id) || id);
    });
    const pastedIds = new Set(copies.map((object) => object.id));
    copies.forEach((object) => translateSchemaObject(object, 40, 40, pastedIds));
    commit(() => { data.objects.push(...copies); selectedIds = pastedIds; selected = copies[0].id; }, `Pasted ${copies.length} object${copies.length === 1 ? "" : "s"}.`);
  }

  function deleteSelected() {
    const objects = selectedObjects(); if (!objects.length || selected?.startsWith("@")) return;
    const ids = new Set(objects.map((object) => object.id));
    const refs = data.objects.filter((item) => !ids.has(item.id) && (ids.has(item.controllerId) || ids.has(item.attachedTo) || item.controllerIds?.some((id) => ids.has(id)) || item.control?.controllerIds?.some((id) => ids.has(id))));
    if (data.exit.control?.controllerIds?.some((id) => ids.has(id))) refs.push(data.exit);
    if (refs.length && !confirm(`The selection is linked to ${refs.map((item) => item.id).join(", ")}. Delete it and clean those references?`)) return;
    commit(() => {
      data.objects = data.objects.filter((item) => !ids.has(item.id) && !ids.has(item.attachedTo));
      data.objects.forEach((item) => {
        if (ids.has(item.controllerId)) delete item.controllerId;
        if (item.controllerIds) item.controllerIds = item.controllerIds.filter((id) => !ids.has(id));
        if (item.control?.controllerIds) {
          item.control.controllerIds = item.control.controllerIds.filter((id) => !ids.has(id));
          if (!item.control.controllerIds.length) delete item.control;
        }
      });
      if (data.exit.control?.controllerIds) {
        data.exit.control.controllerIds = data.exit.control.controllerIds.filter((id) => !ids.has(id));
        if (!data.exit.control.controllerIds.length) delete data.exit.control;
      }
      setSingleSelection(null);
    }, `Deleted ${objects.length} object${objects.length === 1 ? "" : "s"}.`);
  }

  function renderSettings() {
    fields.replaceChildren();
    data.settings ||= {};
    data.settings.rewind ||= {};
    data.settings.rewind.field ||= {};
    data.settings.echo ||= {};
    field("Level ID", "id", data.id, { type: "text", change: (input) => {
      if (!input.value.trim()) { statusNote = "The level ID cannot be empty."; return refresh(); }
      commit(() => data.id = input.value, "Changed the level ID.");
    } });
    field("Name", "name", data.name, { type: "text", change: (input) => commit(() => data.name = input.value, "Changed the level name.") });
    field("World width", "width", data.width, { change: (input) => commit(() => { data.width = Number(input.value); clampCamera(); }, "Changed world width; out-of-bounds objects are reported below.") });
    field("Music", "settings.music", data.settings.music, { values: [["level1","Trail"],["level2","Rewind"],["level3","Lava"], ...(data.settings.customMusic ? [["custom", `Imported: ${data.settings.customMusic.name}`]] : [])], change: (input) => commit(() => data.settings.music = input.value, "Changed music.") });
    const importMusic = document.createElement("button"); importMusic.type = "button"; importMusic.textContent = data.settings.customMusic ? "Replace Imported Song" : "Import Song";
    importMusic.addEventListener("click", () => musicImportInput.click()); fields.append(importMusic);
    if (data.settings.customMusic) {
      field("Imported-song volume", "settings.customMusic.volume", data.settings.customMusic.volume ?? .8, { step: ".05", change: (input) => commit(() => data.settings.customMusic.volume = Math.max(0, Math.min(1, Number(input.value))), "Changed imported-song volume.") });
      check("Loop imported song", "settings.customMusic.loop", data.settings.customMusic.loop !== false, { change: (input) => commit(() => data.settings.customMusic.loop = input.checked, "Changed imported-song looping.") });
      const removeMusic = document.createElement("button"); removeMusic.type = "button"; removeMusic.textContent = "Remove Imported Song";
      removeMusic.addEventListener("click", () => commit(() => { delete data.settings.customMusic; if (data.settings.music === "custom") data.settings.music = "level1"; }, "Removed the imported song.")); fields.append(removeMusic);
    }
    field("Theme", "settings.theme", data.settings.theme || "default", { values: [["default","Default"],["lava","Lava"],["rewind","Rewind"]], change: (input) => commit(() => data.settings.theme = input.value, "Changed theme.") });
    field("Required level stars", "settings.requiredLevelStars", data.settings.requiredLevelStars || 0, { change: (input) => commit(() => data.settings.requiredLevelStars = Number(input.value), "Changed required stars.") });
    check("Enable Rewind", "settings.rewind.enabled", data.settings.rewind?.enabled, { change: (input) => commit(() => { data.settings.rewind ||= {}; data.settings.rewind.enabled = input.checked; }, "Changed Rewind availability.") });
    check("Show Rewind tutorial", "settings.rewind.tutorial", data.settings.rewind?.tutorial, { change: (input) => commit(() => { data.settings.rewind ||= {}; data.settings.rewind.tutorial = input.checked; }, "Changed Rewind tutorial presentation.") });
    check("Hint after pressure plate", "settings.rewind.showHintOnPlate", data.settings.rewind?.showHintOnPlate, { change: (input) => commit(() => { data.settings.rewind ||= {}; data.settings.rewind.showHintOnPlate = input.checked; }, "Changed the contextual Rewind hint.") });
    check("Enable Rewind field", "settings.rewind.field.enabled", data.settings.rewind?.field?.enabled, { change: (input) => commit(() => { data.settings.rewind ||= {}; data.settings.rewind.field ||= { radius: 360, offset: 0 }; data.settings.rewind.field.enabled = input.checked; }, "Changed Rewind field availability.") });
    field("Field radius", "settings.rewind.field.radius", data.settings.rewind.field.radius || 360, { change: (input) => commit(() => { data.settings.rewind.field.radius = Number(input.value); }, "Changed field radius.") });
    field("Field offset", "settings.rewind.field.offset", data.settings.rewind?.field?.offset || 0, { change: (input) => commit(() => { data.settings.rewind.field.offset = Number(input.value); }, "Changed field offset.") });
    check("Enable Echo", "settings.echo.enabled", data.settings.echo?.enabled, { change: (input) => commit(() => { data.settings.echo ||= {}; data.settings.echo.enabled = input.checked; }, "Changed Echo availability.") });
    check("Show Echo tutorial", "settings.echo.tutorial", data.settings.echo?.tutorial, { change: (input) => commit(() => { data.settings.echo ||= {}; data.settings.echo.tutorial = input.checked; }, "Changed Echo tutorial presentation.") });
    check("Echo pushes crates", "settings.echo.canPushCrates", data.settings.echo?.canPushCrates, { change: (input) => commit(() => { data.settings.echo ||= {}; data.settings.echo.canPushCrates = input.checked; }, "Changed Echo crate interaction.") });
  }

  function drawGrid() {
    const theme = data.settings?.theme;
    const gradient = ctx.createLinearGradient(0, 0, 0, WORLD_H);
    gradient.addColorStop(0, theme === "lava" ? "#382337" : theme === "rewind" ? "#25466c" : "#5ac8fa");
    gradient.addColorStop(1, theme === "lava" ? "#d97a43" : theme === "rewind" ? "#b7e4e8" : "#edfaff");
    ctx.save();
    ctx.beginPath(); ctx.rect(0, 0, data.width, WORLD_H); ctx.clip();
    ctx.fillStyle = gradient; ctx.fillRect(0, 0, data.width, WORLD_H);

    ctx.fillStyle = theme === "lava" ? "#d7b3a326" : "#ffffff4d";
    for (let x = 100; x < data.width; x += 360) {
      ctx.beginPath(); ctx.ellipse(x, 105 + (x / 360 % 3) * 55, 66, 19, 0, 0, Math.PI * 2);
      ctx.ellipse(x + 43, 98 + (x / 360 % 3) * 55, 38, 25, 0, 0, Math.PI * 2); ctx.fill();
    }

    const showMinor = GRID * zoom >= 8;
    if (showMinor) {
      ctx.strokeStyle = "rgba(18, 48, 78, .12)";
      ctx.lineWidth = 1 / zoom;
      ctx.beginPath();
      for (let x = 0; x <= data.width; x += GRID) { ctx.moveTo(x, 0); ctx.lineTo(x, WORLD_H); }
      for (let y = 0; y <= WORLD_H; y += GRID) { ctx.moveTo(0, y); ctx.lineTo(data.width, y); }
      ctx.stroke();
    }
    let majorGrid = GRID * 5;
    while (majorGrid * zoom < 35) majorGrid *= 2;
    ctx.strokeStyle = "rgba(15, 42, 69, .27)";
    ctx.lineWidth = 1.4 / zoom;
    ctx.beginPath();
    for (let x = 0; x <= data.width; x += majorGrid) { ctx.moveTo(x, 0); ctx.lineTo(x, WORLD_H); }
    for (let y = 0; y <= WORLD_H; y += majorGrid) { ctx.moveTo(0, y); ctx.lineTo(data.width, y); }
    ctx.stroke();
    ctx.restore();
  }
  function materialColor(material) { return material === "grass" ? "#76512e" : material === "crate" ? "#a86c34" : "#65707f"; }
  function drawArrowLine(a, b, color = "#f4c95d") {
    const unit = 1 / zoom;
    ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineWidth=3*unit;ctx.setLineDash([8*unit,6*unit]);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.setLineDash([]);
    const angle=Math.atan2(b.y-a.y,b.x-a.x),size=9*unit;ctx.beginPath();ctx.moveTo(b.x,b.y);ctx.lineTo(b.x-Math.cos(angle-.6)*size,b.y-Math.sin(angle-.6)*size);ctx.lineTo(b.x-Math.cos(angle+.6)*size,b.y-Math.sin(angle+.6)*size);ctx.fill();
  }
  function drawObject(object) {
    const rect = objectRect(object), x=rect.x, y=rect.y;
    if (x+rect.width < cameraX || x > cameraX + visibleWorldWidth() || y+rect.height < cameraY || y > cameraY + visibleWorldHeight()) return;
    const preview = window.PlatformsGamePreview;
    const drawArt = (name, dx, dy, width, height, fallback) => {
      if (preview?.drawGameArt(name, dx, dy, width, height, ctx)) return true;
      const image = images[fallback || name];
      if (image?.complete && image.naturalWidth) { ctx.drawImage(image, dx, dy, width, height); return true; }
      return false;
    };
    ctx.save();
    if (object.type === "platform" || object.type === "floatingPlatform" || ["movingPlatform","controlledPlatform","rewindPlatform"].includes(object.type)) {
      if (preview) preview.drawAssetRectangle(object.material,x,y,rect.width,rect.height,ctx);
      else { ctx.fillStyle=materialColor(object.material);ctx.fillRect(x,y,rect.width,rect.height);ctx.fillStyle=object.material==="grass"?"#67b84c":"rgba(255,255,255,.18)";ctx.fillRect(x,y,rect.width,Math.min(12,rect.height)); }
    } else if (object.type === "crate") {
      if (!preview?.drawSprite(2,x,y,rect.width,rect.height,ctx)) {
        if (preview) preview.drawAssetRectangle("crate",x,y,rect.width,rect.height,ctx);
        else {ctx.fillStyle="#a76728";ctx.fillRect(x,y,rect.width,rect.height);}
      }
    }
    else if (object.type === "breakableBlock") {
      if (preview) preview.drawAssetRectangle(object.material,x,y,rect.width,rect.height,ctx);
      else {ctx.fillStyle=materialColor(object.material);ctx.fillRect(x,y,rect.width,rect.height);}
      drawArt("fragileBlockCracks",x,y,rect.width,rect.height,"cracks");
    }
    else if (object.type === "hazard") {
      if(object.hazard==="lava"){
        ctx.fillStyle="#d43a25";ctx.fillRect(x,y,rect.width,rect.height);ctx.fillStyle="#ff8128";ctx.beginPath();ctx.moveTo(x,y+5);
        for(let px=0;px<=rect.width;px+=10)ctx.lineTo(x+px,y+5+Math.sin((object.x+px)*.05)*4);
        ctx.lineTo(x+rect.width,y+rect.height);ctx.lineTo(x,y+rect.height);ctx.closePath();ctx.fill();
      } else if (!preview?.drawSprite(3,x,y-29,rect.width,48,ctx)) {
        ctx.fillStyle="#e9f5ff";for(let i=0;i<rect.width;i+=20){ctx.beginPath();ctx.moveTo(x+i,y+rect.height);ctx.lineTo(x+i+10,y-16);ctx.lineTo(x+i+20,y+rect.height);ctx.fill();}
      }
    }
    else if (object.type === "star") {
      if(!preview?.drawSprite(4,object.x-20,object.y-20,40,40,ctx)){ctx.fillStyle="#ffd83d";ctx.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?8:18;ctx.lineTo(object.x+Math.cos(a)*r,object.y+Math.sin(a)*r);}ctx.closePath();ctx.fill();}
    }
    else if (object.type === "spawn") drawArt("player",x,y,rect.width,rect.height,"player");
    else if (object.type === "exit") {
      if(!preview?.drawSprite(5,x-25,y-18,82,rect.height+25,ctx)){ctx.fillStyle="#f5c54e";ctx.fillRect(x+4,y,6,rect.height);ctx.fillStyle="#f0445a";ctx.beginPath();ctx.moveTo(x+10,y+5);ctx.lineTo(x+55,y+18);ctx.lineTo(x+10,y+34);ctx.fill();}
    }
    else if (object.type === "enemy") drawArt("enemy",x,y,rect.width,rect.height,"enemy");
    else if (object.type === "switch") drawArt("switchLeft",x,y,rect.width,rect.height,"switch");
    else if (object.type === "pressurePlate") {
      drawArt("pressurePlateBase",x,y+5,rect.width,7,"pressurePlateBase");
      drawArt("pressurePlateTop",x+4,y,rect.width-8,6,"pressurePlateTop");
    }
    else if (object.type === "jumpPad") {
      drawArt("jumpPadBase",x,y+7,rect.width,Math.max(1,rect.height-7),"jumpPadBase");
      drawArt("jumpPadTop",x+3,y+2,rect.width-6,10,"jumpPadTop");
    }
    else if (object.type === "movingObstacle") drawArt("movingObstacle",x,y,rect.width,rect.height,"blade");
    else { ctx.fillStyle="#5f8daf";ctx.fillRect(x,y,rect.width,rect.height); }
    const unit=1/zoom;ctx.fillStyle="rgba(8,18,31,.88)";ctx.font=`700 ${11*unit}px system-ui`;ctx.fillText(object.type==="spawn"?"SPAWN":object.type==="exit"?"EXIT":object.id,x+3*unit,Math.max(12*unit,y-5*unit));ctx.restore();
  }
  function drawLinks() {
    /* Legacy compact overlay renderer, retained inert below. 
    const object = selectionObject(); if (!object) return;
    if (object.controllerIds) object.controllerIds.forEach((id) => { const controller=findObject(id);if(controller)drawArrowLine({x:objectRect(controller).x+objectRect(controller).width/2,y:objectRect(controller).y},{x:object.x+object.width/2,y:object.y+object.height/2},"#56d4f5"); });
    if (object.controllerId) { const controller=findObject(object.controllerId);if(controller)drawArrowLine({x:objectRect(controller).x+20,y:objectRect(controller).y},{x:object.x+object.width/2,y:object.y+object.height/2},"#56d4f5"); }
    if (object.attachedTo) { const parent=findObject(object.attachedTo);if(parent)drawArrowLine({x:objectRect(parent).x+objectRect(parent).width/2,y:objectRect(parent).y},{x:objectRect(object).x+objectRect(object).width/2,y:objectRect(object).y},"#e85757"); }
    if (object.motionPath) { object.motionPath.slice(0,-1).forEach((point,index)=>drawArrowLine(point,object.motionPath[index+1])); object.motionPath.forEach((point,index)=>{ctx.fillStyle=index===(object.pathIndex||0)?"#fff":"#f4c95d";ctx.beginPath();ctx.arc(point.x-cameraX,point.y,7,0,Math.PI*2);ctx.fill();}); }
    if (object.target) { drawArrowLine({x:object.x+object.width/2,y:object.y+object.height/2},object.target);ctx.fillStyle="#f4c95d";ctx.fillRect(object.target.x-cameraX-6,object.target.y-6,12,12); }
    if (object.type==="movingPlatform") { const a={x:object.x+(object.motion.axis==="x"?-object.motion.range:object.width/2),y:object.y+(object.motion.axis==="y"?-object.motion.range:object.height/2)},b={x:object.x+(object.motion.axis==="x"?object.motion.range+object.width:object.width/2),y:object.y+(object.motion.axis==="y"?object.motion.range+object.height/2)};drawArrowLine(a,b);const sign=Math.cos(object.motion.phase||0)>=0?1:-1,center={x:object.x+object.width/2,y:object.y+object.height/2},direction={x:center.x+(object.motion.axis==="x"?sign*38:0),y:center.y+(object.motion.axis==="y"?sign*38:0)};drawArrowLine(center,direction,"#ffffff"); }
    */
    const object = selectionObject();
    if (!object) return;
    const rect = objectRect(object);
    for (const id of object.controllerIds || []) {
      const controller = findObject(id);
      if (controller) drawArrowLine(
        { x: objectRect(controller).x + objectRect(controller).width / 2, y: objectRect(controller).y },
        { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 }, "#56d4f5"
      );
    }
    if (object.controllerId) {
      const controller = findObject(object.controllerId);
      if (controller) drawArrowLine(
        { x: objectRect(controller).x + 20, y: objectRect(controller).y },
        { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 }, "#56d4f5"
      );
    }
    if (object.attachedTo) {
      const parent = findObject(object.attachedTo);
      if (parent) drawArrowLine(
        { x: objectRect(parent).x + objectRect(parent).width / 2, y: objectRect(parent).y },
        { x: rect.x + rect.width / 2, y: rect.y }, "#e85757"
      );
    }
    if (object.motionPath && !object.control) {
      object.motionPath.slice(0, -1).forEach((point, index) => drawArrowLine(point, object.motionPath[index + 1]));
      object.motionPath.forEach((point, index) => {
        ctx.fillStyle = index === (object.pathIndex || 0) ? "#fff" : "#f4c95d";
        ctx.beginPath(); ctx.arc(point.x, point.y, 7 / zoom, 0, Math.PI * 2); ctx.fill();
      });
    }
    if (object.target && !object.control) {
      drawArrowLine({ x: object.x + object.width / 2, y: object.y + object.height / 2 }, object.target);
      ctx.fillStyle = "#f4c95d"; ctx.fillRect(object.target.x - 6 / zoom, object.target.y - 6 / zoom, 12 / zoom, 12 / zoom);
    }
    if (object.control) {
      for (const id of object.control.controllerIds) {
        const controller = findObject(id);
        if (controller) {
          const controllerRect = objectRect(controller);
          drawArrowLine(
            { x: controllerRect.x + controllerRect.width / 2, y: controllerRect.y },
            { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 },
            "#56d4f5"
          );
        }
      }
      const base = controlBasePoint(object);
      drawArrowLine(base, object.control.target, "#f4c95d");
      ctx.fillStyle = "#f4c95d";
      ctx.fillRect(object.control.target.x - 7 / zoom, object.control.target.y - 7 / zoom, 14 / zoom, 14 / zoom);
    }
    if (object.type === "movingPlatform" && !object.control) {
      const horizontal = object.motion.axis === "x";
      const a = { x: object.x + (horizontal ? -object.motion.range : object.width / 2), y: object.y + (horizontal ? object.height / 2 : -object.motion.range) };
      const b = { x: object.x + (horizontal ? object.motion.range + object.width : object.width / 2), y: object.y + (horizontal ? object.height / 2 : object.motion.range + object.height) };
      drawArrowLine(a, b);
      const sign = Math.cos(object.motion.phase || 0) >= 0 ? 1 : -1;
      const center = { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
      drawArrowLine(center, { x: center.x + (horizontal ? sign * 38 : 0), y: center.y + (horizontal ? 0 : sign * 38) }, "#ffffff");
    }
    if (object.type === "enemy" && !object.control) drawArrowLine({ x: object.patrolMinX, y: object.surfaceY }, { x: object.patrolMaxX, y: object.surfaceY }, "#e85757");
  }
  function drawSelection() {
    const objects = selectedIds.size ? selectedObjects() : [selectionObject()].filter(Boolean);
    if (!objects.length || selected === "@settings") return;
    const unit=1/zoom;ctx.strokeStyle="#f4c95d";ctx.lineWidth=3*unit;
    objects.forEach((object) => { const r=objectRect(object);ctx.strokeRect(r.x-3*unit,r.y-3*unit,r.width+6*unit,r.height+6*unit);
      if(objects.length===1&&RESIZABLE.has(object.type)){ctx.fillStyle="#f4c95d";ctx.fillRect(r.x+r.width-6*unit,r.y+r.height-6*unit,12*unit,12*unit);} });
  }
  function drawBounds() {
    const unit=1/zoom;
    ctx.save();ctx.strokeStyle="#ffe05d";ctx.lineWidth=4*unit;ctx.setLineDash([12*unit,7*unit]);ctx.strokeRect(0,0,data.width,WORLD_H);ctx.setLineDash([]);
    ctx.fillStyle="#ffe05d";ctx.beginPath();ctx.roundRect(data.width-7*unit,WORLD_H/2-25*unit,14*unit,50*unit,6*unit);ctx.fill();
    ctx.fillStyle="#07162de8";ctx.font=`800 ${12*unit}px system-ui`;ctx.textAlign="right";ctx.fillText(`LEVEL END · ${data.width}px`,data.width-14*unit,22*unit);ctx.restore();
  }
  function draw() {
    if(host.hidden)return;
    ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,canvas.width,canvas.height);ctx.fillStyle="#07101f";ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.setTransform(zoom,0,0,zoom,-cameraX*zoom,-cameraY*zoom);
    drawGrid();drawLinks();data.objects.forEach(drawObject);drawObject({type:"exit",...data.exit});drawObject({type:"spawn",...data.spawn});drawSelection();drawBounds();
    ctx.setTransform(1,0,0,1,0,0);
  }
  function resizeCanvas() {
    const width=Math.max(320,Math.round(viewport.clientWidth));
    const height=Math.max(240,Math.round(viewport.clientHeight));
    if(canvas.width===width&&canvas.height===height){draw();return;}
    const centerX=cameraX+visibleWorldWidth()/2,centerY=cameraY+visibleWorldHeight()/2;
    canvas.width=width;canvas.height=height;
    if(viewFitted){fitLevel();return;}
    cameraX=centerX-visibleWorldWidth()/2;cameraY=centerY-visibleWorldHeight()/2;clampCamera();draw();
  }
  function refresh() {
    syncDraftPicker();
    host.querySelector('[data-action="undo"]').disabled=!undoStack.length;host.querySelector('[data-action="redo"]').disabled=!redoStack.length;
    host.querySelector('[data-action="group"]').disabled=selectedIds.size<2;
    host.querySelector('[data-action="ungroup"]').disabled=!selectedObjects().some((object)=>object.groupId);
    host.querySelector('[data-action="copy"]').disabled=!selectedIds.size;
    renderInspector();validate();draw();
  }

  function resetDraftView() {
    setSingleSelection("@spawn"); tool = "select"; canvas.dataset.tool = "select";
    cameraX = 0; cameraY = 0; undoStack = []; redoStack = []; viewFitted = false;
    host.querySelectorAll("[data-tool]").forEach((button) => button.classList.toggle("active", button.dataset.tool === "select"));
  }
  function activateDraft(key, note) {
    if (key === activeDraftKey || !drafts.some((draft) => draft.key === key)) return;
    persist(); activeDraftKey = key; data = activeDraft().level; resetDraftView();
    statusNote = note || `Now editing ${data.name}.`; persist(); fitLevel(); refresh();
  }
  function addDraft(level, note) {
    persist();
    const draft = { key: nextDraftKey(), level };
    drafts.push(draft); activeDraftKey = draft.key; data = draft.level; resetDraftView();
    statusNote = note; persist(); fitLevel(); refresh();
  }

  function newLevel(clearOnly = false) {
    if (clearOnly) {
      if (!confirm("Clear all placed objects from this level? Spawn, exit, and level settings will remain.")) return;
      commit(() => data.objects = [], "Cleared all placed objects from this level.");
      return;
    }
    const identity = uniqueLevelIdentity();
    const level = freshLevel(); Object.assign(level, identity);
    addDraft(level, `Created ${level.name}. Your other levels were preserved.`);
  }
  function duplicateLevel() {
    const sourceName = data.name;
    const copy = clone(data);
    const identity = uniqueLevelIdentity(`${data.name} Copy`, `${data.id}-copy`);
    Object.assign(copy, identity);
    addDraft(copy, `Duplicated ${sourceName} as ${copy.name}.`);
  }
  function deleteDraft() {
    if (drafts.length <= 1) return;
    const index = drafts.findIndex((draft) => draft.key === activeDraftKey);
    if (!confirm(`Delete the local level “${data.name}”? This cannot be undone.`)) return;
    drafts.splice(index, 1);
    const replacement = drafts[Math.min(index, drafts.length - 1)];
    activeDraftKey = replacement.key; data = replacement.level; resetDraftView();
    statusNote = "Deleted the level and switched to another local draft."; persist(); fitLevel(); refresh();
  }
  function exportData() { const result=api.exportLevel(data);if(!result.ok){statusNote=result.errors[0];return refresh();}const blob=new Blob([result.json],{type:"application/json"}),link=document.createElement("a");link.href=URL.createObjectURL(blob);link.download=`${data.id}.json`;link.click();URL.revokeObjectURL(link.href);statusNote="Exported validated level JSON.";refresh(); }
  async function importFile(file) {
    if(!file)return;
    const text=await file.text();let importedText=text,repaired=false;
    try { const parsed=JSON.parse(text);repaired=repairKnownEditorData(parsed);if(repaired)importedText=JSON.stringify(parsed); } catch { /* The safe importer reports malformed JSON below. */ }
    const result=api.importLevel(importedText);
    if(!result.ok){statusNote=`Import rejected: ${result.errors.join(" · ")}`;return refresh();}
    addDraft(result.level, repaired?"Imported a new level and repaired its enemy placement data.":"Imported a new validated level without replacing your other drafts.");
  }

  async function importMusicFile(file) {
    if (!file) return;
    if (file.size > 4_500_000) { statusNote = "Imported songs must be 4.5 MB or smaller so the local workspace remains reliable."; return refresh(); }
    if (file.type && !file.type.startsWith("audio/")) { statusNote = "Choose an audio file."; return refresh(); }
    try {
      const dataUrl = await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(file); });
      if (typeof dataUrl !== "string" || !dataUrl.startsWith("data:audio/")) throw new Error("unsupported audio");
      commit(() => {
        data.settings ||= {};
        data.settings.customMusic = { name: file.name, dataUrl, loop: true, volume: .8 };
        data.settings.music = "custom";
      }, `Imported ${file.name} for this level.`);
    } catch { statusNote = "The selected song could not be imported."; refresh(); }
  }

  host.addEventListener("click", (event) => {
    const action=event.target.closest("[data-action]")?.dataset.action;if(!action)return;
    if(action==="new")newLevel(false);else if(action==="duplicate")duplicateLevel();else if(action==="delete-draft")deleteDraft();else if(action==="clear")newLevel(true);
    else if(action==="group")groupSelection();else if(action==="ungroup")ungroupSelection();else if(action==="copy")copySelection();else if(action==="paste")pasteSelection();
    else if(action==="undo")undo();else if(action==="redo")redo();else if(action==="import")importInput.click();else if(action==="export")exportData();
    else if(action==="snap"){snap=!snap;event.target.textContent=`Snap: ${snap?"On":"Off"}`;statusNote=`Grid snapping ${snap?"enabled":"disabled"}.`;refresh();}
    else if(action==="zoom-out")setZoom(zoom/1.2);
    else if(action==="zoom-in")setZoom(zoom*1.2);
    else if(action==="zoom-fit")fitLevel();
    else if(action==="playtest"){const result=validate();if(result.valid&&playtestCallback)playtestCallback(clone(data));}
    else if(action==="close")close();
  });
  importInput.addEventListener("change",()=>{importFile(importInput.files[0]);importInput.value="";});
  musicImportInput.addEventListener("change",()=>{importMusicFile(musicImportInput.files[0]);musicImportInput.value="";});
  window.addEventListener("keydown",(event)=>{
    if(host.hidden)return;if(["INPUT","SELECT"].includes(document.activeElement.tagName))return;
    if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==="z"){event.preventDefault();event.shiftKey?redo():undo();return;}
    if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==="y"){event.preventDefault();redo();return;}
    if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==="c"){event.preventDefault();copySelection();return;}
    if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==="v"){event.preventDefault();pasteSelection();return;}
    if(event.key==="Delete"||event.key==="Backspace"){event.preventDefault();deleteSelected();return;}
    if(event.key.startsWith("Arrow")){
      event.preventDefault();viewFitted=false;const amount=120/zoom;
      if(event.key==="ArrowLeft")cameraX-=amount;else if(event.key==="ArrowRight")cameraX+=amount;else if(event.key==="ArrowUp")cameraY-=amount;else if(event.key==="ArrowDown")cameraY+=amount;
      clampCamera();draw();
    }
  });
  draftPicker.addEventListener("change", () => activateDraft(draftPicker.value));
  new ResizeObserver(resizeCanvas).observe(viewport);

  function open() { document.querySelector("#mainMenu").hidden=true;host.hidden=false;document.querySelector(".touch-controls").hidden=true;document.querySelector(".instructions").hidden=true;requestAnimationFrame(()=>{resizeCanvas();if(!openedOnce){fitLevel();openedOnce=true;}refresh();}); }
  function close() { host.hidden=true;document.querySelector("#mainMenu").hidden=false;document.querySelector(".touch-controls").hidden=false;document.querySelector(".instructions").hidden=false;document.querySelector("#levelEditorButton")?.focus(); }
  function showAfterPlaytest(note="Returned from playtest.") { host.hidden=false;document.querySelector(".touch-controls").hidden=true;document.querySelector(".instructions").hidden=true;statusNote=note;requestAnimationFrame(()=>{resizeCanvas();refresh();}); }

  restore(); setTool("select");
  window.PlatformsEditor=Object.freeze({
    open, close, showAfterPlaytest, redraw:draw,
    getDraft:()=>clone(data),
    getDrafts:()=>drafts.map((draft)=>({key:draft.key,active:draft.key===activeDraftKey,level:clone(draft.level)})),
    setPlaytestCallback:(callback)=>{playtestCallback=callback;}
  });
})();
