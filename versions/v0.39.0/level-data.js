"use strict";

(() => {
  const verificationRules = window.PlatformsVerificationRules;
  if (!verificationRules) throw new Error("Verification rules are unavailable.");
  const SCHEMA_VERSION = 1;
  const SAVE_CODE_PREFIX = "POTP1-";
  const MAX_JSON_LENGTH = 8_000_000;
  const MAX_OBJECTS = 600;
  const MATERIALS = new Set(["grass", "stone", "crate"]);
  const OBJECT_TYPES = new Set([
    "platform", "floatingPlatform", "crate", "breakableBlock", "jumpPad",
    "hazard", "star", "movingPlatform", "controlledPlatform", "rewindPlatform",
    "switch", "pressurePlate", "enemy", "movingObstacle"
  ]);
  const ROOT_KEYS = new Set(["schemaVersion", "id", "name", "width", "spawn", "exit", "settings", "objects"]);
  const SPAWN_KEYS = new Set(["x", "y"]);
  const EXIT_KEYS = new Set(["id", "x", "y", "width", "height", "control"]);
  const SETTINGS_KEYS = new Set([
    "music", "customMusic", "theme", "postRun", "levelType", "requiredStars", "requiredLevelStars",
    "rewind", "echo", "gauntlet"
  ]);
  const REWIND_KEYS = new Set(["enabled", "tutorial", "showHintOnPlate", "field"]);
  const REWIND_FIELD_KEYS = new Set(["enabled", "radius", "offset"]);
  const ECHO_KEYS = new Set(["enabled", "tutorial", "canPushCrates"]);
  const GAUNTLET_KEYS = new Set(["id", "chapter"]);
  const CUSTOM_MUSIC_KEYS = new Set(["name", "dataUrl", "loop", "volume"]);
  const POINT_KEYS = new Set(["x", "y"]);
  const MOTION_KEYS = new Set(["axis", "range", "speed", "phase"]);
  const CONTROL_KEYS = new Set(["controllerIds", "target", "releaseDelay", "moveDuration", "initialProgress"]);
  const COMMON_OBJECT_KEYS = ["id", "type", "groupId"];
  const OBJECT_KEYS = {
    platform: ["x", "y", "width", "height", "material"],
    floatingPlatform: ["x", "y", "width", "height", "material"],
    crate: ["x", "y", "width", "height", "rewindable"],
    breakableBlock: ["x", "y", "width", "height", "material", "trigger", "rewindable", "rewindSpeed"],
    jumpPad: ["x", "y", "width", "height"],
    hazard: ["hazard", "x", "y", "width", "height", "attachedTo", "offsetX", "offsetY"],
    star: ["x", "y"],
    movingPlatform: ["x", "y", "width", "height", "material", "motion"],
    controlledPlatform: [
      "x", "y", "width", "height", "material", "target", "controllerIds",
      "requiresActive", "releaseDelay", "moveDuration", "initialProgress"
    ],
    rewindPlatform: [
      "x", "y", "width", "height", "material", "target", "controllerId", "speed",
      "releaseDelay", "motionPath", "pathIndex", "autoStart", "autoWhenRidden",
      "carryDuringRewind", "resumeAfterRewind", "loopPath", "carryPlayer"
    ],
    switch: ["x", "y", "momentary", "pulseDuration", "initialFlipped"],
    pressurePlate: ["x", "y", "width", "filter"],
    enemy: ["x", "surfaceY", "patrolMinX", "patrolMaxX", "direction", "speed", "stopAtBoundary", "rewindable"],
    movingObstacle: ["x", "y", "size", "speed", "motionPath", "pathIndex", "loopPath", "resumeAfterRewind"]
  };

  const CAMPAIGN_LEVELS = Object.freeze({
    "dirtbound-trail": {
      schemaVersion: 1,
      id: "dirtbound-trail",
      name: "Dirtbound Trail",
      width: 1260,
      spawn: { x: 70, y: 430 },
      exit: { id: "level-exit", x: 1190, y: 390, width: 34, height: 90 },
      settings: { music: "level1" },
      objects: [
        { id: "start-ground", type: "platform", x: 0, y: 490, width: 330, height: 80, material: "grass" },
        { id: "low-ledge", type: "platform", x: 400, y: 445, width: 190, height: 125, material: "grass" },
        { id: "middle-ledge", type: "platform", x: 660, y: 390, width: 170, height: 180, material: "grass" },
        { id: "far-ledge", type: "platform", x: 900, y: 450, width: 180, height: 120, material: "grass" },
        { id: "exit-ground", type: "platform", x: 1150, y: 480, width: 110, height: 90, material: "grass" },
        { id: "opening-crate-texture", type: "platform", x: 185, y: 400, width: 70, height: 40, material: "crate" },
        { id: "spikes-1", type: "hazard", hazard: "spikes", x: 330, y: 472, width: 70, height: 18 },
        { id: "spikes-2", type: "hazard", hazard: "spikes", x: 590, y: 472, width: 70, height: 18 },
        { id: "spikes-3", type: "hazard", hazard: "spikes", x: 830, y: 472, width: 70, height: 18 },
        { id: "spikes-4", type: "hazard", hazard: "spikes", x: 1080, y: 472, width: 70, height: 18 },
        { id: "star-1", type: "star", x: 220, y: 365 },
        { id: "star-2", type: "star", x: 495, y: 400 },
        { id: "star-3", type: "star", x: 745, y: 345 },
        { id: "star-4", type: "star", x: 990, y: 405 }
      ]
    },
    "crateyard-climb": {
      schemaVersion: 1,
      id: "crateyard-climb",
      name: "Crateyard Climb",
      width: 1500,
      spawn: { x: 55, y: 430 },
      exit: { id: "level-exit", x: 1415, y: 300, width: 34, height: 90 },
      settings: { music: "level1" },
      objects: [
        { id: "start-ground", type: "platform", x: 0, y: 490, width: 720, height: 80, material: "grass" },
        { id: "first-wall", type: "platform", x: 720, y: 310, width: 90, height: 260, material: "stone" },
        { id: "middle-ground", type: "platform", x: 880, y: 430, width: 190, height: 140, material: "grass" },
        { id: "second-wall", type: "platform", x: 1130, y: 250, width: 180, height: 320, material: "stone" },
        { id: "exit-ground", type: "platform", x: 1370, y: 390, width: 130, height: 180, material: "grass" },
        { id: "first-crate", type: "crate", x: 450, y: 430, width: 60, height: 60, rewindable: false },
        { id: "second-crate", type: "crate", x: 900, y: 370, width: 60, height: 60, rewindable: false },
        { id: "spikes-1", type: "hazard", hazard: "spikes", x: 810, y: 472, width: 70, height: 18 },
        { id: "spikes-2", type: "hazard", hazard: "spikes", x: 1070, y: 472, width: 60, height: 18 },
        { id: "spikes-3", type: "hazard", hazard: "spikes", x: 1310, y: 472, width: 60, height: 18 },
        { id: "star-1", type: "star", x: 505, y: 385 },
        { id: "star-2", type: "star", x: 765, y: 265 },
        { id: "star-3", type: "star", x: 970, y: 325 },
        { id: "star-4", type: "star", x: 1215, y: 205 }
      ]
    },
    "switchback-summit": {
      schemaVersion: 1,
      id: "switchback-summit",
      name: "Switchback Summit",
      width: 1500,
      spawn: { x: 55, y: 430 },
      exit: { id: "level-exit", x: 1415, y: 360, width: 34, height: 90 },
      settings: { music: "level2" },
      objects: [
        { id: "start-ground", type: "platform", x: 0, y: 490, width: 320, height: 80, material: "stone" },
        { id: "bridge-a", type: "controlledPlatform", x: 410, y: 520, width: 140, height: 40, material: "stone", target: { x: 440, y: 380 }, controllerIds: ["switch-a"], requiresActive: false, releaseDelay: 0 },
        { id: "middle-ground", type: "platform", x: 640, y: 420, width: 180, height: 150, material: "stone" },
        { id: "bridge-b", type: "controlledPlatform", x: 900, y: 520, width: 145, height: 40, material: "grass", target: { x: 920, y: 345 }, controllerIds: ["switch-b"], requiresActive: false, releaseDelay: 0 },
        { id: "high-ground", type: "platform", x: 1160, y: 390, width: 170, height: 180, material: "stone" },
        { id: "exit-ground", type: "platform", x: 1380, y: 450, width: 120, height: 120, material: "stone" },
        { id: "switch-a", type: "switch", x: 250, y: 446, momentary: false },
        { id: "switch-b", type: "switch", x: 740, y: 376, momentary: false },
        { id: "lava-1", type: "hazard", hazard: "lava", x: 320, y: 490, width: 320, height: 80 },
        { id: "lava-2", type: "hazard", hazard: "lava", x: 820, y: 490, width: 340, height: 80 },
        { id: "lava-3", type: "hazard", hazard: "lava", x: 1330, y: 490, width: 50, height: 80 },
        { id: "star-1", type: "star", x: 285, y: 400 },
        { id: "star-2", type: "star", x: 510, y: 330 },
        { id: "star-3", type: "star", x: 735, y: 330 },
        { id: "star-4", type: "star", x: 1035, y: 285 },
        { id: "star-5", type: "star", x: 1245, y: 345 }
      ]
    },
    "shared-history": {
      schemaVersion: 1,
      id: "shared-history",
      name: "Shared History",
      width: 1700,
      spawn: { x: 55, y: 448 },
      exit: { id: "level-exit", x: 1620, y: 360, width: 34, height: 90 },
      settings: {
        music: "level2", theme: "rewind", postRun: true,
        rewind: { enabled: true, tutorial: true, field: { enabled: true, radius: 430, offset: 140 } },
        echo: { enabled: true, tutorial: false, canPushCrates: false }
      },
      objects: [
        { id: "start-ground", type: "platform", x: 0, y: 490, width: 500, height: 80, material: "stone" },
        { id: "shared-entry", type: "controlledPlatform", x: 520, y: 535, width: 210, height: 40, material: "stone", target: { x: 520, y: 430 }, controllerIds: ["entry-plate"], requiresActive: true, releaseDelay: 0.15 },
        { id: "middle-ground", type: "platform", x: 770, y: 490, width: 210, height: 80, material: "stone" },
        { id: "history-platform", type: "rewindPlatform", x: 1010, y: 430, width: 170, height: 40, material: "stone", target: { x: 1280, y: 430 }, speed: 210, releaseDelay: 3, motionPath: [{ x: 1010, y: 430 }, { x: 1280, y: 430 }], pathIndex: 1, autoStart: true, resumeAfterRewind: false },
        { id: "exit-ground", type: "platform", x: 1430, y: 450, width: 270, height: 120, material: "stone" },
        { id: "entry-plate", type: "pressurePlate", x: 205, y: 478, width: 145, filter: "any" },
        { id: "lava-1", type: "hazard", hazard: "lava", x: 500, y: 500, width: 270, height: 70 },
        { id: "lava-2", type: "hazard", hazard: "lava", x: 980, y: 500, width: 450, height: 70 },
        { id: "star-1", type: "star", x: 1095, y: 380 }
      ]
    }
  });

  function isPlainObject(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return false;
    const prototype = Object.getPrototypeOf(value);
    return prototype === Object.prototype || prototype === null;
  }

  function rejectUnknownKeys(value, allowed, path, errors) {
    if (!isPlainObject(value)) {
      errors.push(`${path} must be an object.`);
      return false;
    }
    for (const key of Object.keys(value)) {
      if (!allowed.has(key)) errors.push(`${path}.${key} is not supported.`);
    }
    return true;
  }

  function validateJsonValue(value, path, errors, seen = new Set()) {
    if (value === null || typeof value === "string" || typeof value === "boolean") return;
    if (typeof value === "number") {
      if (!Number.isFinite(value)) errors.push(`${path} must use a finite number.`);
      return;
    }
    if (typeof value !== "object") {
      errors.push(`${path} contains a non-JSON value.`);
      return;
    }
    if (seen.has(value)) {
      errors.push(`${path} contains a circular reference.`);
      return;
    }
    if (!Array.isArray(value) && !isPlainObject(value)) {
      errors.push(`${path} must contain only plain JSON objects.`);
      return;
    }
    seen.add(value);
    for (const key of Object.keys(value)) {
      if (["__proto__", "prototype", "constructor"].includes(key)) {
        errors.push(`${path}.${key} is forbidden.`);
        continue;
      }
      validateJsonValue(value[key], `${path}.${key}`, errors, seen);
    }
    seen.delete(value);
  }

  function requireString(value, path, errors, maxLength = 80) {
    if (typeof value !== "string" || value.trim().length === 0 || value.length > maxLength) {
      errors.push(`${path} must be a non-empty string no longer than ${maxLength} characters.`);
      return false;
    }
    return true;
  }

  function requireId(value, path, errors) {
    if (typeof value !== "string" || value.trim().length === 0) {
      errors.push(`${path} must be a non-empty ID.`);
      return false;
    }
    return true;
  }

  function requireNumber(value, path, errors, min = -1000, max = 100000) {
    if (typeof value !== "number" || !Number.isFinite(value) || value < min || value > max) {
      errors.push(`${path} must be a finite number from ${min} to ${max}.`);
      return false;
    }
    return true;
  }

  function requireInteger(value, path, errors, min = 0, max = 100) {
    if (!Number.isInteger(value) || value < min || value > max) {
      errors.push(`${path} must be a whole number from ${min} to ${max}.`);
      return false;
    }
    return true;
  }

  function optionalBoolean(value, path, errors) {
    if (value !== undefined && typeof value !== "boolean") errors.push(`${path} must be true or false.`);
  }

  function validatePoint(value, path, errors) {
    if (!rejectUnknownKeys(value, POINT_KEYS, path, errors)) return;
    requireNumber(value.x, `${path}.x`, errors);
    requireNumber(value.y, `${path}.y`, errors);
  }

  function validateRect(object, path, errors) {
    requireNumber(object.x, `${path}.x`, errors);
    requireNumber(object.y, `${path}.y`, errors);
    requireNumber(object.width, `${path}.width`, errors, 1, 10000);
    requireNumber(object.height, `${path}.height`, errors, 1, 10000);
  }

  function validateMaterial(value, path, errors) {
    if (!MATERIALS.has(value)) errors.push(`${path} must be grass, stone, or crate.`);
  }

  function validateSettings(settings, errors) {
    if (settings === undefined) return;
    if (!rejectUnknownKeys(settings, SETTINGS_KEYS, "level.settings", errors)) return;
    if (settings.music !== undefined && !["level1", "level2", "level3", "custom"].includes(settings.music)) errors.push("level.settings.music is unsupported.");
    if (settings.customMusic !== undefined && rejectUnknownKeys(settings.customMusic, CUSTOM_MUSIC_KEYS, "level.settings.customMusic", errors)) {
      requireString(settings.customMusic.name, "level.settings.customMusic.name", errors, 160);
      if (typeof settings.customMusic.dataUrl !== "string" || !/^data:audio\/[a-z0-9.+-]+;base64,/i.test(settings.customMusic.dataUrl) || settings.customMusic.dataUrl.length > 6_500_000) {
        errors.push("level.settings.customMusic.dataUrl must be a base64 audio data URL no larger than 6.5 MB.");
      }
      optionalBoolean(settings.customMusic.loop, "level.settings.customMusic.loop", errors);
      if (settings.customMusic.volume !== undefined) requireNumber(settings.customMusic.volume, "level.settings.customMusic.volume", errors, 0, 1);
    }
    if (settings.music === "custom" && settings.customMusic === undefined) errors.push("level.settings.customMusic is required when music is custom.");
    if (settings.theme !== undefined && !["default", "lava", "rewind"].includes(settings.theme)) errors.push("level.settings.theme is unsupported.");
    optionalBoolean(settings.postRun, "level.settings.postRun", errors);
    if (settings.levelType !== undefined && !verificationRules.LEVEL_TYPES.includes(settings.levelType)) {
      errors.push("level.settings.levelType must be exit, exit-stars, or survival.");
    }
    if (settings.requiredStars !== undefined) requireInteger(settings.requiredStars, "level.settings.requiredStars", errors, 0, 600);
    if (settings.levelType !== undefined && settings.levelType !== "exit-stars" && settings.requiredStars !== undefined) {
      errors.push("level.settings.requiredStars is only supported for Exit + Required Stars levels.");
    }
    if (settings.requiredLevelStars !== undefined) requireInteger(settings.requiredLevelStars, "level.settings.requiredLevelStars", errors);
    if (settings.rewind !== undefined) {
      if (rejectUnknownKeys(settings.rewind, REWIND_KEYS, "level.settings.rewind", errors)) {
        optionalBoolean(settings.rewind.enabled, "level.settings.rewind.enabled", errors);
        optionalBoolean(settings.rewind.tutorial, "level.settings.rewind.tutorial", errors);
        optionalBoolean(settings.rewind.showHintOnPlate, "level.settings.rewind.showHintOnPlate", errors);
        if (settings.rewind.field !== undefined && rejectUnknownKeys(settings.rewind.field, REWIND_FIELD_KEYS, "level.settings.rewind.field", errors)) {
          optionalBoolean(settings.rewind.field.enabled, "level.settings.rewind.field.enabled", errors);
          if (settings.rewind.field.radius !== undefined) requireNumber(settings.rewind.field.radius, "level.settings.rewind.field.radius", errors, 50, 2000);
          if (settings.rewind.field.offset !== undefined) requireNumber(settings.rewind.field.offset, "level.settings.rewind.field.offset", errors, -1000, 1000);
        }
      }
    }
    if (settings.echo !== undefined && rejectUnknownKeys(settings.echo, ECHO_KEYS, "level.settings.echo", errors)) {
      optionalBoolean(settings.echo.enabled, "level.settings.echo.enabled", errors);
      optionalBoolean(settings.echo.tutorial, "level.settings.echo.tutorial", errors);
      optionalBoolean(settings.echo.canPushCrates, "level.settings.echo.canPushCrates", errors);
    }
    if (settings.gauntlet !== undefined && rejectUnknownKeys(settings.gauntlet, GAUNTLET_KEYS, "level.settings.gauntlet", errors)) {
      if (!/^G[1-4]$/.test(settings.gauntlet.id || "")) errors.push("level.settings.gauntlet.id must be G1 through G4.");
      requireInteger(settings.gauntlet.chapter, "level.settings.gauntlet.chapter", errors, 0, 3);
    }
  }

  function validateControl(control, path, errors, references) {
    if (!rejectUnknownKeys(control, CONTROL_KEYS, path, errors)) return;
    validatePoint(control.target, `${path}.target`, errors);
    if (!Array.isArray(control.controllerIds) || control.controllerIds.length < 1 || control.controllerIds.length > 8) {
      errors.push(`${path}.controllerIds must contain one to eight switch or pressure-plate IDs.`);
    } else {
      control.controllerIds.forEach((id, index) => requireId(id, `${path}.controllerIds[${index}]`, errors));
      references.push({ path: `${path}.controllerIds`, ids: control.controllerIds, types: new Set(["switch", "pressurePlate"]) });
    }
    if (control.releaseDelay !== undefined) requireNumber(control.releaseDelay, `${path}.releaseDelay`, errors, 0, 60);
    if (control.moveDuration !== undefined) requireNumber(control.moveDuration, `${path}.moveDuration`, errors, 0.05, 60);
    if (control.initialProgress !== undefined) requireNumber(control.initialProgress, `${path}.initialProgress`, errors, 0, 1);
  }

  function validateObject(object, index, errors, ids, references) {
    const path = `level.objects[${index}]`;
    if (!isPlainObject(object)) {
      errors.push(`${path} must be an object.`);
      return;
    }
    requireId(object.id, `${path}.id`, errors);
    if (object.groupId !== undefined) requireId(object.groupId, `${path}.groupId`, errors);
    if (ids.has(object.id)) errors.push(`${path}.id duplicates ${object.id}.`);
    else ids.set(object.id, object.type);
    if (!OBJECT_TYPES.has(object.type)) {
      errors.push(`${path}.type is unsupported.`);
      return;
    }
    const allowed = new Set([...COMMON_OBJECT_KEYS, ...OBJECT_KEYS[object.type], "control"]);
    rejectUnknownKeys(object, allowed, path, errors);

    if (["platform", "floatingPlatform", "crate", "breakableBlock", "jumpPad", "movingPlatform", "controlledPlatform", "rewindPlatform"].includes(object.type)) {
      validateRect(object, path, errors);
    }
    if (["platform", "floatingPlatform", "breakableBlock", "movingPlatform", "controlledPlatform", "rewindPlatform"].includes(object.type)) {
      validateMaterial(object.material, `${path}.material`, errors);
    }
    if (object.type === "crate") optionalBoolean(object.rewindable, `${path}.rewindable`, errors);
    if (object.type === "breakableBlock") {
      if (!["stand", "impact"].includes(object.trigger)) errors.push(`${path}.trigger must be stand or impact.`);
      optionalBoolean(object.rewindable, `${path}.rewindable`, errors);
      if (object.rewindSpeed !== undefined) requireNumber(object.rewindSpeed, `${path}.rewindSpeed`, errors, 1, 2000);
    }
    if (object.type === "hazard") {
      if (!["spikes", "lava"].includes(object.hazard)) errors.push(`${path}.hazard must be spikes or lava.`);
      if (object.attachedTo !== undefined) {
        if (object.groupId !== undefined) errors.push(`${path} cannot be both attached and grouped; use a standalone grouped hazard.`);
        requireId(object.attachedTo, `${path}.attachedTo`, errors);
        requireNumber(object.offsetX ?? 0, `${path}.offsetX`, errors);
        requireNumber(object.offsetY ?? 0, `${path}.offsetY`, errors);
        requireNumber(object.width, `${path}.width`, errors, 1, 10000);
        requireNumber(object.height, `${path}.height`, errors, 1, 10000);
        references.push({ path: `${path}.attachedTo`, ids: [object.attachedTo], types: null });
      } else validateRect(object, path, errors);
    }
    if (object.type === "star") {
      requireNumber(object.x, `${path}.x`, errors);
      requireNumber(object.y, `${path}.y`, errors);
    }
    if (object.type === "movingPlatform") {
      if (rejectUnknownKeys(object.motion, MOTION_KEYS, `${path}.motion`, errors)) {
        if (!["x", "y"].includes(object.motion.axis)) errors.push(`${path}.motion.axis must be x or y.`);
        requireNumber(object.motion.range, `${path}.motion.range`, errors, 1, 5000);
        requireNumber(object.motion.speed, `${path}.motion.speed`, errors, 0.01, 20);
        if (object.motion.phase !== undefined) requireNumber(object.motion.phase, `${path}.motion.phase`, errors, -100, 100);
      }
    }
    if (object.type === "controlledPlatform") {
      validatePoint(object.target, `${path}.target`, errors);
      if (!Array.isArray(object.controllerIds) || object.controllerIds.length < 1 || object.controllerIds.length > 8) {
        errors.push(`${path}.controllerIds must contain one to eight controller IDs.`);
      } else {
        object.controllerIds.forEach((id, refIndex) => requireId(id, `${path}.controllerIds[${refIndex}]`, errors));
        references.push({
          path: `${path}.controllerIds`, ids: object.controllerIds,
          types: object.controllerIds.length > 1 ? new Set(["pressurePlate"]) : new Set(["switch", "pressurePlate"])
        });
      }
      optionalBoolean(object.requiresActive, `${path}.requiresActive`, errors);
      if (object.releaseDelay !== undefined) requireNumber(object.releaseDelay, `${path}.releaseDelay`, errors, 0, 60);
      if (object.moveDuration !== undefined) requireNumber(object.moveDuration, `${path}.moveDuration`, errors, 0.05, 60);
      if (object.initialProgress !== undefined) requireNumber(object.initialProgress, `${path}.initialProgress`, errors, 0, 1);
    }
    if (object.type === "rewindPlatform") {
      if (object.target === undefined && object.motionPath === undefined) errors.push(`${path} requires target or motionPath.`);
      if (object.target !== undefined) validatePoint(object.target, `${path}.target`, errors);
      if (object.controllerId !== undefined && object.controllerId !== null) {
        requireId(object.controllerId, `${path}.controllerId`, errors);
        references.push({ path: `${path}.controllerId`, ids: [object.controllerId], types: new Set(["pressurePlate"]) });
      }
      requireNumber(object.speed, `${path}.speed`, errors, 1, 2000);
      if (object.releaseDelay !== undefined) requireNumber(object.releaseDelay, `${path}.releaseDelay`, errors, 0, 60);
      if (object.pathIndex !== undefined) requireInteger(object.pathIndex, `${path}.pathIndex`, errors, 0, 100);
      for (const key of ["autoStart", "autoWhenRidden", "carryDuringRewind", "resumeAfterRewind", "loopPath", "carryPlayer"]) optionalBoolean(object[key], `${path}.${key}`, errors);
      validateMotionPath(object.motionPath, `${path}.motionPath`, errors);
    }
    if (object.type === "switch") {
      requireNumber(object.x, `${path}.x`, errors);
      requireNumber(object.y, `${path}.y`, errors);
      optionalBoolean(object.momentary, `${path}.momentary`, errors);
      optionalBoolean(object.initialFlipped, `${path}.initialFlipped`, errors);
      if (object.pulseDuration !== undefined) requireNumber(object.pulseDuration, `${path}.pulseDuration`, errors, 0.05, 60);
    }
    if (object.type === "pressurePlate") {
      requireNumber(object.x, `${path}.x`, errors);
      requireNumber(object.y, `${path}.y`, errors);
      requireNumber(object.width, `${path}.width`, errors, 8, 2000);
      if (!["any", "crate", "enemy"].includes(object.filter)) errors.push(`${path}.filter must be any, crate, or enemy.`);
    }
    if (object.type === "enemy") {
      requireNumber(object.x, `${path}.x`, errors);
      requireNumber(object.surfaceY, `${path}.surfaceY`, errors);
      requireNumber(object.patrolMinX, `${path}.patrolMinX`, errors);
      requireNumber(object.patrolMaxX, `${path}.patrolMaxX`, errors);
      if (object.patrolMaxX <= object.patrolMinX) errors.push(`${path}.patrolMaxX must exceed patrolMinX.`);
      if (![1, -1].includes(object.direction)) errors.push(`${path}.direction must be 1 or -1.`);
      requireNumber(object.speed, `${path}.speed`, errors, 1, 1000);
      optionalBoolean(object.stopAtBoundary, `${path}.stopAtBoundary`, errors);
      optionalBoolean(object.rewindable, `${path}.rewindable`, errors);
    }
    if (object.type === "movingObstacle") {
      requireNumber(object.x, `${path}.x`, errors);
      requireNumber(object.y, `${path}.y`, errors);
      requireNumber(object.size, `${path}.size`, errors, 8, 500);
      requireNumber(object.speed, `${path}.speed`, errors, 1, 2000);
      validateMotionPath(object.motionPath, `${path}.motionPath`, errors, true);
      if (object.pathIndex !== undefined) requireInteger(object.pathIndex, `${path}.pathIndex`, errors, 0, 99);
      optionalBoolean(object.loopPath, `${path}.loopPath`, errors);
      optionalBoolean(object.resumeAfterRewind, `${path}.resumeAfterRewind`, errors);
    }
    if (object.control !== undefined) {
      if (object.type === "controlledPlatform") errors.push(`${path} already has built-in controlled movement and cannot add a second control.`);
      if (object.type === "hazard" && object.attachedTo !== undefined) errors.push(`${path} cannot be attached and directly controlled at the same time.`);
      validateControl(object.control, `${path}.control`, errors, references);
    }
  }

  function validateMotionPath(path, label, errors, required = false) {
    if (path === undefined && !required) return;
    if (!Array.isArray(path) || path.length < 2 || path.length > 100) {
      errors.push(`${label} must contain two to 100 points.`);
      return;
    }
    path.forEach((point, index) => validatePoint(point, `${label}[${index}]`, errors));
  }

  function validateLevel(level) {
    const errors = [];
    try {
      validateJsonValue(level, "level", errors);
      if (!isPlainObject(level)) return { valid: false, errors: errors.length ? errors : ["Level data must be a JSON object."] };
      rejectUnknownKeys(level, ROOT_KEYS, "level", errors);
      if (level.schemaVersion !== SCHEMA_VERSION) errors.push(`level.schemaVersion must be ${SCHEMA_VERSION}.`);
      requireId(level.id, "level.id", errors);
      requireString(level.name, "level.name", errors, 80);
      requireNumber(level.width, "level.width", errors, 320, 20000);
      if (rejectUnknownKeys(level.spawn, SPAWN_KEYS, "level.spawn", errors)) validatePoint(level.spawn, "level.spawn", errors);
      if (rejectUnknownKeys(level.exit, EXIT_KEYS, "level.exit", errors)) {
        requireId(level.exit.id, "level.exit.id", errors);
        validateRect(level.exit, "level.exit", errors);
      }
      validateSettings(level.settings, errors);
      if (!Array.isArray(level.objects)) errors.push("level.objects must be an array.");
      else if (level.objects.length > MAX_OBJECTS) errors.push(`level.objects cannot contain more than ${MAX_OBJECTS} objects.`);
      else {
        const ids = new Map([[level.exit?.id, "exit"]]);
        const references = [];
        level.objects.forEach((object, index) => validateObject(object, index, errors, ids, references));
        if (level.exit?.control !== undefined) validateControl(level.exit.control, "level.exit.control", errors, references);
        for (const reference of references) {
          for (const id of reference.ids) {
            const targetType = ids.get(id);
            if (!targetType) errors.push(`${reference.path} references missing object ${id}.`);
            else if (reference.types && !reference.types.has(targetType)) errors.push(`${reference.path} cannot reference an object of type ${targetType}.`);
          }
        }
        if (typeof level.width === "number" && Number.isFinite(level.width)) {
          if (level.spawn?.x < 0 || level.spawn?.x > level.width) errors.push("level.spawn.x must be inside the level width.");
          if (level.exit?.x < 0 || level.exit?.x + level.exit?.width > level.width) errors.push("level.exit must fit inside the level width.");
          level.objects.forEach((object, index) => {
            const path = `level.objects[${index}]`;
            if (object.attachedTo === undefined && typeof object.x === "number" && (object.x < 0 || object.x > level.width)) errors.push(`${path}.x must be inside the level width.`);
            if (typeof object.width === "number" && object.attachedTo === undefined && typeof object.x === "number" && object.x + object.width > level.width) errors.push(`${path} must fit inside the level width.`);
            for (const [pointIndex, point] of (object.motionPath || []).entries()) {
              if (typeof point.x === "number" && (point.x < 0 || point.x > level.width)) errors.push(`${path}.motionPath[${pointIndex}].x must be inside the level width.`);
            }
            if (object.target && typeof object.target.x === "number" && (object.target.x < 0 || object.target.x > level.width)) errors.push(`${path}.target.x must be inside the level width.`);
            if (object.control?.target && typeof object.control.target.x === "number" && (object.control.target.x < 0 || object.control.target.x > level.width)) errors.push(`${path}.control.target.x must be inside the level width.`);
          });
          if (level.exit?.control?.target && (level.exit.control.target.x < 0 || level.exit.control.target.x > level.width)) errors.push("level.exit.control.target.x must be inside the level width.");
        }
        const obtainableStars = level.objects.filter((object) => object.type === "star" || object.type === "enemy").length;
        const levelType = verificationRules.resolveLevelType(level.settings || {});
        if (levelType === "exit-stars" && !(level.settings?.requiredStars > 0)) {
          errors.push("level.settings.requiredStars must be at least 1 for Exit + Required Stars levels.");
        }
        if (level.settings?.requiredStars > obtainableStars) errors.push("level.settings.requiredStars exceeds the stars available from objects and enemies.");
        if (level.settings?.requiredLevelStars > obtainableStars) errors.push("level.settings.requiredLevelStars exceeds the stars available from objects and enemies.");
        level.objects.forEach((object, index) => {
          if (object.pathIndex !== undefined && object.motionPath && object.pathIndex >= object.motionPath.length) {
            errors.push(`level.objects[${index}].pathIndex must refer to a point in motionPath.`);
          }
        });
      }
    } catch {
      errors.push("Level validation failed safely because the supplied value could not be inspected.");
    }
    return { valid: errors.length === 0, errors };
  }

  function cloneLevel(level) {
    const validation = validateLevel(level);
    if (!validation.valid) return { ok: false, errors: validation.errors, level: null };
    return { ok: true, errors: [], level: JSON.parse(JSON.stringify(level)) };
  }

  function importLevel(jsonText) {
    if (typeof jsonText !== "string") return { ok: false, errors: ["Imported level data must be JSON text."], level: null };
    if (jsonText.length > MAX_JSON_LENGTH) return { ok: false, errors: [`Level JSON cannot exceed ${MAX_JSON_LENGTH} characters.`], level: null };
    let parsed;
    try { parsed = JSON.parse(jsonText); }
    catch { return { ok: false, errors: ["Level JSON could not be parsed."], level: null }; }
    return cloneLevel(parsed);
  }

  function exportLevel(level, spacing = 2) {
    const cloned = cloneLevel(level);
    if (!cloned.ok) return { ok: false, errors: cloned.errors, json: "" };
    return { ok: true, errors: [], json: JSON.stringify(cloned.level, null, spacing === 0 ? 0 : 2) };
  }

  function encodeBase64Url(text) {
    const bytes = new TextEncoder().encode(text);
    let binary = "";
    for (let offset = 0; offset < bytes.length; offset += 0x8000) {
      binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
    }
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/u, "");
  }

  function decodeBase64Url(value) {
    if (!/^[A-Za-z0-9_-]+$/u.test(value)) throw new Error("invalid save-code characters");
    const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - value.length % 4) % 4);
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, character => character.charCodeAt(0));
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  }

  function exportSaveCode(level) {
    const exported = exportLevel(level, 0);
    if (!exported.ok) return { ok: false, errors: exported.errors, code: "" };
    try {
      return { ok: true, errors: [], code: SAVE_CODE_PREFIX + encodeBase64Url(exported.json) };
    } catch {
      return { ok: false, errors: ["The level could not be encoded as a save code."], code: "" };
    }
  }

  function importSaveCode(code) {
    if (typeof code !== "string") return { ok: false, errors: ["Save code must be text."], level: null };
    const trimmed = code.trim();
    if (!trimmed.startsWith(SAVE_CODE_PREFIX)) {
      return { ok: false, errors: [`Save code must start with ${SAVE_CODE_PREFIX}.`], level: null };
    }
    if (trimmed.length > SAVE_CODE_PREFIX.length + Math.ceil(MAX_JSON_LENGTH * 4 / 3) + 8) {
      return { ok: false, errors: ["Save code is too large."], level: null };
    }
    try {
      return importLevel(decodeBase64Url(trimmed.slice(SAVE_CODE_PREFIX.length)));
    } catch {
      return { ok: false, errors: ["Save code could not be decoded."], level: null };
    }
  }

  function loadLevel(levelOrJson, adapters) {
    const prepared = typeof levelOrJson === "string" ? importLevel(levelOrJson) : cloneLevel(levelOrJson);
    if (!prepared.ok) return { ok: false, errors: prepared.errors, level: null, source: null };
    const source = prepared.level;
    if (!isPlainObject(adapters)) return { ok: false, errors: ["Runtime level adapters are unavailable."], level: null, source };
    const runtime = {
      name: source.name,
      width: source.width,
      start: [source.spawn.x, source.spawn.y],
      music: source.settings?.music || "level1",
      platforms: [], hazards: [], stars: [], jumpPads: [], switches: [], pressurePlates: [], enemies: []
    };
    const settings = source.settings || {};
    runtime.levelType = verificationRules.resolveLevelType(settings);
    if (settings.customMusic) runtime.customMusic = { ...settings.customMusic };
    if (settings.theme && settings.theme !== "default") runtime.theme = settings.theme;
    if (settings.postRun) runtime.postRun = true;
    if (settings.requiredStars !== undefined) runtime.requiredStars = settings.requiredStars;
    if (settings.requiredLevelStars !== undefined) runtime.requiredLevelStars = settings.requiredLevelStars;
    if (settings.rewind?.enabled) {
      runtime.rewindChapter = true;
      runtime.rewindField = true;
    }
    if (settings.rewind?.tutorial) {
      runtime.rewindTutorial = true;
      runtime.rewindHintUnlocked = false;
    }
    if (settings.rewind?.showHintOnPlate) runtime.showRewindHintOnPlate = true;
    if (settings.rewind?.field?.radius !== undefined) runtime.rewindFieldRadius = settings.rewind.field.radius;
    if (settings.rewind?.field?.offset !== undefined) runtime.rewindFieldOffset = settings.rewind.field.offset;
    if (settings.echo?.enabled) runtime.echoChapter = true;
    if (settings.echo?.tutorial) runtime.echoTutorial = true;
    if (settings.echo?.canPushCrates) runtime.echoCanPushCrates = true;
    if (settings.gauntlet) {
      runtime.gauntletId = settings.gauntlet.id;
      runtime.gauntletChapter = settings.gauntlet.chapter;
    }
    try {
      runtime.finish = adapters.exit(source.exit);
      for (const object of source.objects) {
        const adapter = adapters[object.type];
        if (typeof adapter !== "function") return { ok: false, errors: [`No runtime adapter supports ${object.type}.`], level: null, source };
        const runtimeObject = adapter(object);
        if (["platform", "floatingPlatform", "crate", "breakableBlock", "movingPlatform", "controlledPlatform", "rewindPlatform", "movingObstacle"].includes(object.type)) runtime.platforms.push(runtimeObject);
        else if (object.type === "hazard") runtime.hazards.push(runtimeObject);
        else if (object.type === "star") runtime.stars.push(runtimeObject);
        else if (object.type === "jumpPad") runtime.jumpPads.push(runtimeObject);
        else if (object.type === "switch") runtime.switches.push(runtimeObject);
        else if (object.type === "pressurePlate") runtime.pressurePlates.push(runtimeObject);
        else if (object.type === "enemy") runtime.enemies.push(runtimeObject);
      }
    } catch {
      return { ok: false, errors: ["Validated level data could not be converted into runtime objects."], level: null, source };
    }
    return { ok: true, errors: [], level: runtime, source };
  }

  window.PlatformsLevelData = Object.freeze({
    SCHEMA_VERSION,
    SAVE_CODE_PREFIX,
    OBJECT_TYPES: Object.freeze([...OBJECT_TYPES]),
    CAMPAIGN_LEVELS,
    validateLevel,
    cloneLevel,
    importLevel,
    exportLevel,
    importSaveCode,
    exportSaveCode,
    loadLevel
  });
})();
