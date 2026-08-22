"use strict";

(() => {
  const api = window.PlatformsLevelData;
  const host = document.querySelector("#levelEditor");
  document.querySelector(".game-shell").append(host);
  const STORAGE_KEY = "platforms-past-level-editor-draft-v1";
  const GRID = 20;
  const WORLD_H = 570;
  const HISTORY_LIMIT = 80;
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
    player: "assets/player-slime.svg", enemy: "assets/enemy-slime.svg", switch: "assets/switch.svg",
    pressurePlate: "assets/pressure-plate.svg", jumpPad: "assets/jump-pad.svg", blade: "assets/moving-blade.svg"
  })) {
    const image = new Image(); image.src = src; image.onload = () => draw(); images[key] = image;
  }

  let data = freshLevel();
  let selected = "@spawn";
  let tool = "select";
  let cameraX = 0;
  let snap = true;
  let drag = null;
  let undoStack = [];
  let redoStack = [];
  let statusNote = "Ready.";
  let playtestCallback = null;

  host.innerHTML = `
    <div class="editor-toolbar">
      <strong>Level Editor · v0.26.1</strong>
      <button data-action="new">New</button><button data-action="clear">Clear</button>
      <button data-action="undo">Undo</button><button data-action="redo">Redo</button>
      <button data-action="import">Import</button><button data-action="export">Export</button>
      <button data-action="snap">Snap: On</button>
      <button class="editor-playtest" data-action="playtest">Playtest</button>
      <button class="editor-close" data-action="close">Main Menu</button>
      <input data-role="import" type="file" accept="application/json,.json" hidden>
    </div>
    <div class="editor-workspace">
      <aside class="editor-sidebar"><h3>Place</h3><div class="editor-palette"></div></aside>
      <div class="editor-viewport"><canvas class="editor-canvas" width="960" height="570"></canvas><p class="editor-camera-note">Wheel / arrows: pan · Delete: remove · drag gold path handles</p></div>
      <aside class="editor-inspector"><h3>Properties</h3><div class="editor-fields"></div></aside>
    </div>
    <div class="editor-status" role="status" aria-live="polite"></div>`;

  const canvas = host.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  const palette = host.querySelector(".editor-palette");
  const fields = host.querySelector(".editor-fields");
  const status = host.querySelector(".editor-status");
  const importInput = host.querySelector('[data-role="import"]');

  Object.keys(LABELS).forEach((name) => {
    const button = document.createElement("button");
    button.type = "button"; button.dataset.tool = name; button.textContent = LABELS[name];
    button.addEventListener("click", () => setTool(name)); palette.append(button);
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
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch { statusNote = "Draft changed, but browser storage is unavailable."; }
  }
  function restore() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY); if (!saved) return;
      const result = api.importLevel(saved);
      if (result.ok) { data = result.level; statusNote = "Restored the local editor draft."; }
      else statusNote = `Saved draft was invalid: ${result.errors[0]}`;
    } catch { statusNote = "Saved draft could not be read safely."; }
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
    redoStack.push(serialize()); data = JSON.parse(undoStack.pop()); selected = selectionObject() ? selected : "@spawn";
    statusNote = "Undid the last editor action."; persist(); refresh();
  }
  function redo() {
    if (!redoStack.length) return;
    undoStack.push(serialize()); data = JSON.parse(redoStack.pop()); selected = selectionObject() ? selected : "@spawn";
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

  function worldPoint(event) {
    const rect = canvas.getBoundingClientRect();
    return { x: cameraX + event.clientX / rect.width * canvas.width, y: event.clientY / rect.height * canvas.height };
  }
  function objectRect(object) {
    if (object.type === "hazard" && object.attachedTo) {
      const parent = findObject(object.attachedTo);
      if (parent) return { x: parent.x + (object.offsetX || 0), y: parent.y + (object.offsetY || 0), width: object.width, height: object.height };
    }
    if (object.type === "spawn") return { x: object.x, y: object.y, width: 46, height: 42 };
    if (object.type === "movingPlatform") {
      const offset = Math.sin(object.motion.phase || 0) * object.motion.range;
      return { x: object.x + (object.motion.axis === "x" ? offset : 0), y: object.y + (object.motion.axis === "y" ? offset : 0), width: object.width, height: object.height };
    }
    if (object.type === "controlledPlatform" && object.initialProgress) {
      const progress = object.initialProgress, eased = progress * progress * (3 - 2 * progress);
      return { x: object.x + (object.target.x - object.x) * eased, y: object.y + (object.target.y - object.y) * eased, width: object.width, height: object.height };
    }
    if (object.type === "exit") return object;
    if (object.type === "star") return { x: object.x - 16, y: object.y - 16, width: 32, height: 32 };
    if (object.type === "switch") return { x: object.x, y: object.y, width: 42, height: 44 };
    if (object.type === "pressurePlate") return { x: object.x, y: object.y, width: object.width, height: 12 };
    if (object.type === "enemy") return { x: object.x, y: object.surfaceY - 42, width: 46, height: 42 };
    if (object.type === "movingObstacle") return { x: object.x, y: object.y, width: object.size, height: object.size };
    return { x: object.x, y: object.y, width: object.width, height: object.height };
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
    if (type === "controlledPlatform") return rect(140, 40, { material: "stone", target: { x: snapValue(x + 180), y: snapValue(y) }, controllerIds: [controller?.id || "missing-controller"], requiresActive: true, releaseDelay: 0, moveDuration: 1.15, initialProgress: 0 });
    if (type === "rewindPlatform") return rect(160, 40, { material: "stone", target: { x: snapValue(x + 240), y: snapValue(y) }, speed: 260, releaseDelay: 2, motionPath: [{ x: snapValue(x), y: snapValue(y) }, { x: snapValue(x + 240), y: snapValue(y) }], pathIndex: 1, autoStart: true, carryDuringRewind: true, resumeAfterRewind: true, loopPath: false, carryPlayer: true });
    if (type === "switch") return { ...base, momentary: false, pulseDuration: 1, initialFlipped: false };
    if (type === "pressurePlate") return { ...base, width: 100, filter: "any" };
    if (type === "enemy") return { ...base, surfaceY: snapValue(y + 42), patrolMinX: snapValue(x - 100), patrolMaxX: snapValue(x + 160), direction: 1, speed: 62, stopAtBoundary: false, rewindable: true };
    if (type === "movingObstacle") return { ...base, size: 58, speed: 170, motionPath: [{ x: snapValue(x), y: snapValue(y) }, { x: snapValue(x + 220), y: snapValue(y) }], pathIndex: 1, loopPath: true, resumeAfterRewind: true };
    return base;
  }

  function place(point) {
    if (tool === "spawn") return commit(() => { data.spawn.x = snapValue(point.x); data.spawn.y = snapValue(point.y); selected = "@spawn"; }, "Moved the player spawn.");
    if (tool === "exit") return commit(() => { data.exit.x = snapValue(point.x); data.exit.y = snapValue(point.y); selected = "@exit"; }, "Moved the level exit.");
    const object = defaultObject(tool, point.x, point.y);
    commit(() => { data.objects.push(object); selected = object.id; tool = "select"; }, `Placed ${LABELS[PLACE_TO_TYPE[tool] || tool] || tool}.`);
    setTool("select");
  }

  function waypointHit(point, object) {
    if (!object?.motionPath) return -1;
    return object.motionPath.findIndex((waypoint) => Math.hypot(waypoint.x - point.x, waypoint.y - point.y) < 12);
  }
  function specialHandleHit(point, object) {
    if (object?.target && Math.hypot(object.target.x - point.x, object.target.y - point.y) < 12) return "target";
    if (object?.type === "enemy") {
      if (Math.abs(object.patrolMinX - point.x) < 12 && Math.abs(object.surfaceY - point.y) < 35) return "min";
      if (Math.abs(object.patrolMaxX - point.x) < 12 && Math.abs(object.surfaceY - point.y) < 35) return "max";
    }
    return null;
  }

  canvas.addEventListener("pointerdown", (event) => {
    const point = worldPoint(event);
    if (tool !== "select") return place(point);
    const current = selectionObject(); const wp = waypointHit(point, current); const special = specialHandleHit(point, current);
    if (wp >= 0 || special) {
      drag = { kind: wp >= 0 ? "waypoint" : special, index: wp, before: serialize() };
    } else {
      const hit = hitTest(point);
      if (!hit) { selected = null; drag = { kind: "pan", clientX: event.clientX, camera: cameraX }; refresh(); }
      else {
        selected = hit.token; const rect = objectRect(hit.object);
        const resize = RESIZABLE.has(hit.object.type) && Math.abs(point.x - (rect.x + rect.width)) < 14 && Math.abs(point.y - (rect.y + rect.height)) < 14;
        drag = { kind: resize ? "resize" : "move", before: serialize(), offsetX: point.x - rect.x, offsetY: point.y - rect.y };
        refresh();
      }
    }
    canvas.setPointerCapture(event.pointerId); canvas.classList.add("dragging");
  });
  canvas.addEventListener("pointermove", (event) => {
    if (!drag) return; const point = worldPoint(event); const object = selectionObject();
    if (drag.kind === "pan") {
      const canvasRect = canvas.getBoundingClientRect();
      const delta = (event.clientX - drag.clientX) / canvasRect.width * canvas.width;
      cameraX = Math.max(0, Math.min(Math.max(0, data.width - canvas.width), drag.camera - delta));
    }
    else if (drag.kind === "waypoint") { object.motionPath[drag.index].x = snapValue(point.x); object.motionPath[drag.index].y = snapValue(point.y); }
    else if (drag.kind === "target") { object.target.x = snapValue(point.x); object.target.y = snapValue(point.y); }
    else if (drag.kind === "min") object.patrolMinX = Math.min(snapValue(point.x), object.patrolMaxX - GRID);
    else if (drag.kind === "max") object.patrolMaxX = Math.max(snapValue(point.x), object.patrolMinX + GRID);
    else if (drag.kind === "move") {
      const x = snapValue(point.x - drag.offsetX), y = snapValue(point.y - drag.offsetY);
      if (selected === "@spawn") Object.assign(data.spawn, { x, y });
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
  function endPointer() { if (!drag) return; const before = drag.before; const changed = drag.kind !== "pan"; drag = null; canvas.classList.remove("dragging"); if (changed) finishDrag(before, "Moved the selected editor item."); else draw(); }
  canvas.addEventListener("pointerup", endPointer); canvas.addEventListener("pointercancel", endPointer);
  canvas.addEventListener("wheel", (event) => { event.preventDefault(); cameraX = Math.max(0, Math.min(Math.max(0, data.width - 960), cameraX + (event.deltaY || event.deltaX))); draw(); }, { passive: false });

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
    const object = selectionObject(); const next = input.value.trim(); const old = object.id;
    if (!/^[a-z][a-z0-9-]{0,63}$/.test(next) || (next !== old && allIds().has(next))) { statusNote = "IDs must be unique lowercase words, numbers, and hyphens."; return refresh(); }
    commit(() => {
      if (selected === "@exit") data.exit.id = next;
      else { object.id = next; selected = next; }
      data.objects.forEach((item) => {
        if (item.controllerId === old) item.controllerId = next;
        if (item.attachedTo === old) item.attachedTo = next;
        if (item.controllerIds) item.controllerIds = item.controllerIds.map((id) => id === old ? next : id);
      });
    }, `Renamed ${old} and updated its links.`);
  }

  function controllerLinks(object) {
    heading("Controllers");
    const eligible = data.objects.filter((item) => ["switch", "pressurePlate"].includes(item.type));
    const list = document.createElement("div"); list.className = "editor-link-list";
    eligible.forEach((item) => {
      const label = document.createElement("label"), input = document.createElement("input"); input.type = "checkbox"; input.checked = object.controllerIds.includes(item.id);
      input.addEventListener("change", () => commit(() => {
        object.controllerIds = input.checked ? [...object.controllerIds, item.id] : object.controllerIds.filter((id) => id !== item.id);
      }, `Updated links for ${object.id}.`)); label.append(input, document.createTextNode(`${item.id} (${item.type})`)); list.append(label);
    });
    if (!eligible.length) list.textContent = "Place a switch or pressure plate first."; fields.append(list);
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
    if (!object) { fields.textContent = "Select an object or choose something from the placement palette."; return; }
    if (object.type === "spawn") { field("X", "x", data.spawn.x); field("Y", "y", data.spawn.y); return; }
    if (object.type === "exit") {
      field("ID", "id", data.exit.id, { type: "text", change: renameId }); field("X", "x", data.exit.x); field("Y", "y", data.exit.y); field("Width", "width", data.exit.width); field("Height", "height", data.exit.height); return;
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
    const remove = document.createElement("button"); remove.type = "button"; remove.className = "editor-danger"; remove.textContent = "Delete object"; remove.addEventListener("click", deleteSelected); fields.append(remove);
  }

  function deleteSelected() {
    const object = selectionObject(); if (!object || selected?.startsWith("@")) return;
    const refs = data.objects.filter((item) => item !== object && (item.controllerId === object.id || item.attachedTo === object.id || item.controllerIds?.includes(object.id)));
    if (refs.length && !confirm(`${object.id} is linked to ${refs.map((item) => item.id).join(", ")}. Delete it and clean those references?`)) return;
    commit(() => {
      data.objects = data.objects.filter((item) => item !== object && item.attachedTo !== object.id);
      data.objects.forEach((item) => { if (item.controllerId === object.id) delete item.controllerId; if (item.controllerIds) item.controllerIds = item.controllerIds.filter((id) => id !== object.id); }); selected = null;
    }, `Deleted ${object.id}. Relink any controller left without an input.`);
  }

  function renderSettings() {
    fields.replaceChildren();
    data.settings ||= {};
    data.settings.rewind ||= {};
    data.settings.rewind.field ||= {};
    data.settings.echo ||= {};
    field("Level ID", "id", data.id, { type: "text", change: (input) => commit(() => data.id = input.value.trim(), "Changed the level ID.") });
    field("Name", "name", data.name, { type: "text", change: (input) => commit(() => data.name = input.value, "Changed the level name.") });
    field("World width", "width", data.width, { change: (input) => commit(() => data.width = Number(input.value), "Changed world width; out-of-bounds objects are reported below.") });
    field("Music", "settings.music", data.settings.music, { values: [["level1","Trail"],["level2","Rewind"],["level3","Lava"]], change: (input) => commit(() => data.settings.music = input.value, "Changed music.") });
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
    ctx.fillStyle = data.settings?.theme === "lava" ? "#382538" : data.settings?.theme === "rewind" ? "#b7d8e9" : "#bce8f5"; ctx.fillRect(0,0,canvas.width,WORLD_H);
    ctx.strokeStyle = "rgba(32,72,100,.17)"; ctx.lineWidth = 1;
    const start = -(cameraX % GRID); for (let x = start; x < canvas.width; x += GRID) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,WORLD_H); ctx.stroke(); }
    for (let y = 0; y < WORLD_H; y += GRID) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(canvas.width,y); ctx.stroke(); }
  }
  function materialColor(material) { return material === "grass" ? "#76512e" : material === "crate" ? "#a86c34" : "#65707f"; }
  function drawArrowLine(a, b, color = "#f4c95d") {
    const ax = a.x-cameraX, bx=b.x-cameraX; ctx.strokeStyle=color; ctx.fillStyle=color; ctx.lineWidth=3; ctx.setLineDash([8,6]); ctx.beginPath();ctx.moveTo(ax,a.y);ctx.lineTo(bx,b.y);ctx.stroke();ctx.setLineDash([]);
    const angle=Math.atan2(b.y-a.y,b.x-a.x), size=9;ctx.beginPath();ctx.moveTo(bx,b.y);ctx.lineTo(bx-Math.cos(angle-.6)*size,b.y-Math.sin(angle-.6)*size);ctx.lineTo(bx-Math.cos(angle+.6)*size,b.y-Math.sin(angle+.6)*size);ctx.fill();
  }
  function drawObject(object) {
    const rect = objectRect(object), x=rect.x-cameraX, y=rect.y;
    if (x+rect.width < 0 || x > canvas.width) return;
    ctx.save();
    if (object.type === "platform" || object.type === "floatingPlatform" || ["movingPlatform","controlledPlatform","rewindPlatform"].includes(object.type)) {
      if (window.PlatformsGamePreview) window.PlatformsGamePreview.drawAssetRectangle(object.material,x,y,rect.width,rect.height,ctx);
      else { ctx.fillStyle=materialColor(object.material);ctx.fillRect(x,y,rect.width,rect.height);ctx.fillStyle=object.material==="grass"?"#67b84c":"rgba(255,255,255,.18)";ctx.fillRect(x,y,rect.width,Math.min(12,rect.height)); }
    } else if (object.type === "crate") { if(window.PlatformsGamePreview)window.PlatformsGamePreview.drawAssetRectangle("crate",x,y,rect.width,rect.height,ctx);else{ctx.fillStyle="#a96d34";ctx.fillRect(x,y,rect.width,rect.height);}ctx.strokeStyle="#6f401e";ctx.lineWidth=4;ctx.strokeRect(x+3,y+3,rect.width-6,rect.height-6); }
    else if (object.type === "breakableBlock") { ctx.fillStyle=materialColor(object.material);ctx.fillRect(x,y,rect.width,rect.height);ctx.strokeStyle="#34291f";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+rect.width*.35,y);ctx.lineTo(x+rect.width*.5,y+rect.height*.45);ctx.lineTo(x+rect.width*.3,y+rect.height);ctx.moveTo(x+rect.width*.5,y+rect.height*.45);ctx.lineTo(x+rect.width*.75,y+rect.height*.7);ctx.stroke(); }
    else if (object.type === "hazard") { if(object.hazard==="lava"){ctx.fillStyle="#f04b2f";ctx.fillRect(x,y,rect.width,rect.height);ctx.fillStyle="#ffbd3d";ctx.fillRect(x,y,rect.width,7);}else{ctx.fillStyle="#b9c0c7";for(let i=0;i<rect.width;i+=16){ctx.beginPath();ctx.moveTo(x+i,y+rect.height);ctx.lineTo(x+i+8,y);ctx.lineTo(x+i+16,y+rect.height);ctx.fill();}} }
    else if (object.type === "star") { ctx.fillStyle="#ffd83d";ctx.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?7:16;ctx.lineTo(object.x-cameraX+Math.cos(a)*r,object.y+Math.sin(a)*r);}ctx.fill(); }
    else if (object.type === "spawn" && images.player.complete) ctx.drawImage(images.player,x,y,rect.width,rect.height);
    else if (object.type === "exit") { ctx.fillStyle="#5b4635";ctx.fillRect(x,y,5,rect.height);ctx.fillStyle="#53d58e";ctx.beginPath();ctx.moveTo(x+5,y);ctx.lineTo(x+rect.width,y+12);ctx.lineTo(x+5,y+28);ctx.fill(); }
    else if (object.type === "enemy" && images.enemy.complete) ctx.drawImage(images.enemy,x,y,rect.width,rect.height);
    else if (object.type === "switch" && images.switch.complete) ctx.drawImage(images.switch,x,y,rect.width,rect.height);
    else if (object.type === "pressurePlate" && images.pressurePlate.complete) ctx.drawImage(images.pressurePlate,x,y,rect.width,rect.height);
    else if (object.type === "jumpPad" && images.jumpPad.complete) ctx.drawImage(images.jumpPad,x,y,rect.width,rect.height);
    else if (object.type === "movingObstacle" && images.blade.complete) ctx.drawImage(images.blade,x,y,rect.width,rect.height);
    else { ctx.fillStyle="#5f8daf";ctx.fillRect(x,y,rect.width,rect.height); }
    ctx.fillStyle="rgba(8,18,31,.82)";ctx.font="10px system-ui";ctx.fillText(object.type==="spawn"?"SPAWN":object.type==="exit"?"EXIT":object.id,x+3,Math.max(11,y-4)); ctx.restore();
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
    if (object.motionPath) {
      object.motionPath.slice(0, -1).forEach((point, index) => drawArrowLine(point, object.motionPath[index + 1]));
      object.motionPath.forEach((point, index) => {
        ctx.fillStyle = index === (object.pathIndex || 0) ? "#fff" : "#f4c95d";
        ctx.beginPath(); ctx.arc(point.x - cameraX, point.y, 7, 0, Math.PI * 2); ctx.fill();
      });
    }
    if (object.target) {
      drawArrowLine({ x: object.x + object.width / 2, y: object.y + object.height / 2 }, object.target);
      ctx.fillStyle = "#f4c95d"; ctx.fillRect(object.target.x - cameraX - 6, object.target.y - 6, 12, 12);
    }
    if (object.type === "movingPlatform") {
      const horizontal = object.motion.axis === "x";
      const a = { x: object.x + (horizontal ? -object.motion.range : object.width / 2), y: object.y + (horizontal ? object.height / 2 : -object.motion.range) };
      const b = { x: object.x + (horizontal ? object.motion.range + object.width : object.width / 2), y: object.y + (horizontal ? object.height / 2 : object.motion.range + object.height) };
      drawArrowLine(a, b);
      const sign = Math.cos(object.motion.phase || 0) >= 0 ? 1 : -1;
      const center = { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
      drawArrowLine(center, { x: center.x + (horizontal ? sign * 38 : 0), y: center.y + (horizontal ? 0 : sign * 38) }, "#ffffff");
    }
    if (object.type === "enemy") drawArrowLine({ x: object.patrolMinX, y: object.surfaceY }, { x: object.patrolMaxX, y: object.surfaceY }, "#e85757");
  }
  function drawSelection() {
    const object=selectionObject();if(!object)return;const r=objectRect(object);ctx.strokeStyle="#f4c95d";ctx.lineWidth=3;ctx.strokeRect(r.x-cameraX-3,r.y-3,r.width+6,r.height+6);
    if(RESIZABLE.has(object.type)){ctx.fillStyle="#f4c95d";ctx.fillRect(r.x-cameraX+r.width-6,r.y+r.height-6,12,12);}
  }
  function draw() { if(host.hidden)return; drawGrid(); drawLinks(); data.objects.forEach(drawObject); drawObject({type:"exit",...data.exit});drawObject({type:"spawn",...data.spawn});drawSelection(); }
  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.height = WORLD_H;
    canvas.width = Math.max(640, Math.min(1600, Math.round(WORLD_H * rect.width / Math.max(1, rect.height))));
    cameraX = Math.min(cameraX, Math.max(0, data.width - canvas.width));
    draw();
  }
  function refresh() { host.querySelector('[data-action="undo"]').disabled=!undoStack.length;host.querySelector('[data-action="redo"]').disabled=!redoStack.length; renderInspector();validate();draw(); }

  function newLevel(clearOnly = false) {
    const promptText=clearOnly?"Clear all placed objects? Spawn, exit, and level settings will remain.":"Create a new level and replace this local draft?";
    if(!confirm(promptText))return;
    commit(()=>{ if(clearOnly)data.objects=[];else{data=freshLevel();selected="@spawn";cameraX=0;} },clearOnly?"Cleared all placed objects.":"Created a new local level draft.");
  }
  function exportData() { const result=api.exportLevel(data);if(!result.ok){statusNote=result.errors[0];return refresh();}const blob=new Blob([result.json],{type:"application/json"}),link=document.createElement("a");link.href=URL.createObjectURL(blob);link.download=`${data.id}.json`;link.click();URL.revokeObjectURL(link.href);statusNote="Exported validated level JSON.";refresh(); }
  async function importFile(file) { if(!file)return;const result=api.importLevel(await file.text());if(!result.ok){statusNote=`Import rejected: ${result.errors.join(" · ")}`;return refresh();}commit(()=>{data=result.level;selected="@spawn";cameraX=0;},"Imported validated level JSON."); }

  host.addEventListener("click", (event) => {
    const action=event.target.closest("[data-action]")?.dataset.action;if(!action)return;
    if(action==="new")newLevel(false);else if(action==="clear")newLevel(true);else if(action==="undo")undo();else if(action==="redo")redo();else if(action==="import")importInput.click();else if(action==="export")exportData();
    else if(action==="snap"){snap=!snap;event.target.textContent=`Snap: ${snap?"On":"Off"}`;statusNote=`Grid snapping ${snap?"enabled":"disabled"}.`;refresh();}
    else if(action==="playtest"){const result=validate();if(result.valid&&playtestCallback){document.body.classList.remove("editor-open");playtestCallback(clone(data));}}
    else if(action==="close")close();
  });
  importInput.addEventListener("change",()=>{importFile(importInput.files[0]);importInput.value="";});
  window.addEventListener("keydown",(event)=>{
    if(host.hidden)return;if(["INPUT","SELECT"].includes(document.activeElement.tagName))return;
    if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==="z"){event.preventDefault();event.shiftKey?redo():undo();return;}
    if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==="y"){event.preventDefault();redo();return;}
    if(event.key==="Delete"||event.key==="Backspace"){event.preventDefault();deleteSelected();return;}
    if(event.key==="ArrowLeft"||event.key==="ArrowRight"){event.preventDefault();cameraX=Math.max(0,Math.min(Math.max(0,data.width-canvas.width),cameraX+(event.key==="ArrowRight"?120:-120)));draw();}
  });
  new ResizeObserver(resizeCanvas).observe(canvas);

  function open() { document.body.classList.add("editor-open");document.querySelector("#mainMenu").hidden=true;host.hidden=false;document.querySelector(".touch-controls").hidden=true;document.querySelector(".instructions").hidden=true;requestAnimationFrame(()=>{resizeCanvas();refresh();}); }
  function close() { document.body.classList.remove("editor-open");host.hidden=true;document.querySelector("#mainMenu").hidden=false;document.querySelector(".touch-controls").hidden=false;document.querySelector(".instructions").hidden=false;document.querySelector("#levelEditorButton")?.focus(); }
  function showAfterPlaytest(note="Returned from playtest.") { document.body.classList.add("editor-open");host.hidden=false;document.querySelector(".touch-controls").hidden=true;document.querySelector(".instructions").hidden=true;statusNote=note;requestAnimationFrame(()=>{resizeCanvas();refresh();}); }

  restore(); setTool("select");
  window.PlatformsEditor=Object.freeze({ open, close, showAfterPlaytest, getDraft:()=>clone(data), setPlaytestCallback:(callback)=>{playtestCallback=callback;} });
})();
