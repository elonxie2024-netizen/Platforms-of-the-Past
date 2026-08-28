"use strict";

(() => {
  const FORMAT = "POTP-RUN-3";
  const LEGACY_FORMAT = "POTP-RUN-2";
  const VERIFIER_VERSION = "potp-replay-v3";
  const MAX_BYTES = 1500000;
  const MAX_COMPACT_BYTES = 650000;
  const MAX_DURATION_MS = 3600000;
  const MAX_INPUT_EVENTS = 20000;
  const MAX_CHECKPOINTS = 14450;
  const MAX_ACTIONS = 10000;
  const MAX_INTEGRITY_EVENTS = 64;
  const PLAYER_W = 30;
  const PLAYER_H = 42;

  function finite(value) {
    return typeof value === "number" && Number.isFinite(value);
  }

  function timestamp(value) {
    return Number.isInteger(value) && value >= 0 && value <= MAX_DURATION_MS;
  }

  function serializedBytes(value) {
    const json = JSON.stringify(value);
    return typeof TextEncoder === "function" ? new TextEncoder().encode(json).byteLength : unescape(encodeURIComponent(json)).length;
  }

  function encodeTimedPairs(events) {
    const encoded = [];
    let previousTime = 0;
    for (const event of events || []) {
      encoded.push(event[0] - previousTime, event[1]);
      previousTime = event[0];
    }
    return encoded;
  }

  function decodeTimedPairs(encoded) {
    if (!Array.isArray(encoded) || encoded.length % 2 !== 0) throw new Error("Malformed compact event stream");
    const events = [];
    let time = 0;
    for (let index = 0; index < encoded.length; index += 2) {
      if (!timestamp(encoded[index])) throw new Error("Malformed compact event time");
      time += encoded[index];
      if (!timestamp(time)) throw new Error("Compact event time exceeds the run limit");
      events.push([time, encoded[index + 1]]);
    }
    return events;
  }

  function encodeReplay(evidence) {
    if (!evidence || evidence.format !== LEGACY_FORMAT) throw new Error("Only expanded replay evidence can be compacted");
    const checkpoints = [];
    const world = [];
    let previousTime = 0;
    (evidence.checkpoints || []).forEach((checkpoint, index) => {
      checkpoints.push(checkpoint[0] - previousTime, checkpoint[1], checkpoint[2], checkpoint[3], checkpoint[4], checkpoint[5]);
      previousTime = checkpoint[0];
      if (Array.isArray(checkpoint[6]) && checkpoint[6].length) world.push([index, checkpoint[6]]);
    });
    return {
      format: FORMAT,
      v: evidence.gameVersion,
      l: [evidence.levelId, evidence.levelVersion, evidence.runTicket, evidence.levelDigest],
      n: evidence.sampleIntervalMs,
      s: [evidence.initialState?.x, evidence.initialState?.y, evidence.initialState?.objectCount, evidence.initialState?.objects || []],
      i: encodeTimedPairs(evidence.inputEvents),
      c: checkpoints,
      w: world,
      a: encodeTimedPairs(evidence.actions),
      g: encodeTimedPairs(evidence.integrityEvents),
      z: [evidence.terminal?.kind, evidence.terminal?.atMs, evidence.terminal?.x, evidence.terminal?.y, evidence.terminal?.reason ?? null],
      q: evidence.truncated === true
    };
  }

  function decodeReplay(evidence) {
    if (evidence?.format === LEGACY_FORMAT) return evidence;
    const compactKeys = new Set(["format", "v", "l", "n", "s", "i", "c", "w", "a", "g", "z", "q"]);
    if (evidence && Object.keys(evidence).some(key => !compactKeys.has(key))) throw new Error("Unsupported compact replay property");
    if (evidence?.format !== FORMAT || !Array.isArray(evidence.l) || evidence.l.length !== 4 ||
        !Array.isArray(evidence.s) || evidence.s.length !== 4 || !Array.isArray(evidence.c) || evidence.c.length % 6 !== 0 ||
        !Array.isArray(evidence.w) || !Array.isArray(evidence.z) || evidence.z.length !== 5) throw new Error("Malformed compact replay evidence");
    const checkpoints = [];
    let time = 0;
    for (let index = 0; index < evidence.c.length; index += 6) {
      const delta = evidence.c[index];
      if (!timestamp(delta)) throw new Error("Malformed compact checkpoint time");
      time += delta;
      if (!timestamp(time)) throw new Error("Compact checkpoint time exceeds the run limit");
      checkpoints.push([time, evidence.c[index + 1], evidence.c[index + 2], evidence.c[index + 3], evidence.c[index + 4], evidence.c[index + 5], []]);
    }
    let previousWorldIndex = -1;
    for (const frame of evidence.w) {
      if (!Array.isArray(frame) || frame.length !== 2 || !Number.isInteger(frame[0]) || frame[0] <= previousWorldIndex ||
          frame[0] < 0 || frame[0] >= checkpoints.length || !Array.isArray(frame[1]) || !frame[1].length) {
        throw new Error("Malformed compact world-state stream");
      }
      checkpoints[frame[0]][6] = frame[1];
      previousWorldIndex = frame[0];
    }
    return {
      format: LEGACY_FORMAT,
      gameVersion: evidence.v,
      sampleIntervalMs: evidence.n,
      levelId: evidence.l[0], levelVersion: evidence.l[1], runTicket: evidence.l[2], levelDigest: evidence.l[3],
      initialState: { x: evidence.s[0], y: evidence.s[1], objectCount: evidence.s[2], objects: evidence.s[3] },
      inputEvents: decodeTimedPairs(evidence.i), checkpoints,
      actions: decodeTimedPairs(evidence.a), integrityEvents: decodeTimedPairs(evidence.g),
      terminal: { kind: evidence.z[0], atMs: evidence.z[1], x: evidence.z[2], y: evidence.z[3], reason: evidence.z[4] },
      truncated: evidence.q === true
    };
  }

  function stableStringify(value) {
    if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
    if (value && typeof value === "object") {
      return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
    }
    return JSON.stringify(value);
  }

  function levelDigest(levelData) {
    const text = stableStringify(levelData);
    let hash = 2166136261;
    for (let index = 0; index < text.length; index++) {
      hash ^= text.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(16).padStart(8, "0");
  }

  function fail(reason) {
    return { ok: false, reason };
  }

  function nearestCheckpoint(checkpoints, atMs) {
    let nearest = null;
    let distance = Infinity;
    for (const checkpoint of checkpoints) {
      const nextDistance = Math.abs(checkpoint[0] - atMs);
      if (nextDistance < distance) {
        nearest = checkpoint;
        distance = nextDistance;
      }
    }
    return distance <= 400 ? nearest : null;
  }

  function overlapsPlayer(checkpoint, target, padding = 8) {
    const x = checkpoint[1];
    const y = checkpoint[2];
    const width = Number(target.width ?? target.w ?? 30);
    const height = Number(target.height ?? target.h ?? 30);
    return x < Number(target.x) + width + padding && x + PLAYER_W > Number(target.x) - padding &&
      y < Number(target.y) + height + padding && y + PLAYER_H > Number(target.y) - padding;
  }

  function validateObjectStates(states, levelData) {
    if (!Array.isArray(states) || states.length > 80) return false;
    const seen = new Set();
    const platformCount = (levelData.objects || []).filter(object => [
      "platform", "floatingPlatform", "crate", "breakableBlock",
      "movingPlatform", "controlledPlatform", "rewindPlatform", "movingObstacle"
    ].includes(object.type)).length;
    const enemyCount = (levelData.objects || []).filter(object => object.type === "enemy").length;
    const switchCount = (levelData.objects || []).filter(object => object.type === "switch").length;
    const plateCount = (levelData.objects || []).filter(object => object.type === "pressurePlate").length;
    for (const state of states) {
      if (!Array.isArray(state) || state.length !== 4 || !finite(state[1]) || !finite(state[2]) ||
          !Number.isInteger(state[3]) || state[3] < 0 || state[3] > 2) return false;
      const id = state[0];
      const validId = Number.isInteger(id) ? id >= 0 && id < platformCount
        : id === "echo" || (/^e\d+$/.test(id) && Number(id.slice(1)) < enemyCount) ||
          (/^s\d+$/.test(id) && Number(id.slice(1)) < switchCount) ||
          (/^p\d+$/.test(id) && Number(id.slice(1)) < plateCount);
      if (!validId || seen.has(String(id))) return false;
      seen.add(String(id));
    }
    return true;
  }

  function validateReplay({ evidence, levelData, levelId, levelVersion, runTicket, issuedAtMs, receivedAtMs }) {
    try {
      if (!evidence || typeof evidence !== "object" || Array.isArray(evidence)) return fail("Invalid replay evidence");
      const byteLimit = evidence.format === FORMAT ? MAX_COMPACT_BYTES : MAX_BYTES;
      if (serializedBytes(evidence) > byteLimit) return fail("Replay evidence is oversized");
      evidence = decodeReplay(evidence);
      if (evidence.format !== LEGACY_FORMAT) return fail("Unsupported replay format");
      if (evidence.sampleIntervalMs !== 250) return fail("Unsupported replay checkpoint interval");
      if (evidence.levelId !== levelId || Number(evidence.levelVersion) !== Number(levelVersion) || evidence.runTicket !== runTicket) {
        return fail("Replay belongs to another ticket or published version");
      }
      if (!levelData || typeof levelData !== "object" || levelDigest(levelData) !== evidence.levelDigest) {
        return fail("Replay initial state does not match the immutable level version");
      }

      const levelType = levelData?.settings?.levelType || (Number(levelData?.settings?.requiredStars) > 0 ? "exit-stars" : "exit");
      if (!["exit", "exit-stars", "survival"].includes(levelType)) return fail("Unsupported published level type");
      const requiredStars = levelType === "exit-stars" ? Math.max(1, Number(levelData?.settings?.requiredStars) || 0) : 0;
      const spawn = levelData.spawn || {};
      const initial = evidence.initialState;
      if (!initial || !finite(initial.x) || !finite(initial.y) || Math.abs(initial.x - Number(spawn.x)) > .2 || Math.abs(initial.y - Number(spawn.y)) > .2) {
        return fail("Replay does not begin at the published spawn");
      }
      const expectedObjectCount = (levelData.objects || []).filter(object => [
        "platform", "floatingPlatform", "crate", "breakableBlock", "movingPlatform",
        "controlledPlatform", "rewindPlatform", "movingObstacle", "enemy"
      ].includes(object.type)).length;
      if (!Number.isInteger(initial.objectCount) || initial.objectCount !== expectedObjectCount) {
        return fail("Replay initial object count does not match the immutable level");
      }
      if (!validateObjectStates(initial.objects, levelData)) return fail("Replay initial object state is invalid");

      const inputs = evidence.inputEvents;
      const checkpoints = evidence.checkpoints;
      const actions = evidence.actions;
      const integrityEvents = evidence.integrityEvents;
      const terminal = evidence.terminal;
      if (!Array.isArray(inputs) || !Array.isArray(checkpoints) || !Array.isArray(actions) || !Array.isArray(integrityEvents)) {
        return fail("Replay streams are incomplete");
      }
      if (!inputs.length || inputs.length > MAX_INPUT_EVENTS || !checkpoints.length || checkpoints.length > MAX_CHECKPOINTS ||
          actions.length > MAX_ACTIONS || integrityEvents.length > MAX_INTEGRITY_EVENTS) return fail("Replay stream length is invalid");
      if (evidence.truncated === true) return fail("Truncated replay evidence is not rankable");
      if (!terminal || !timestamp(terminal.atMs) || terminal.atMs <= 0) return fail("Replay end state is invalid");
      if (!issuedAtMs || !receivedAtMs || terminal.atMs > receivedAtMs - issuedAtMs + 2500) return fail("Replay duration exceeds its server session");

      let previousTime = -1;
      let previousMask = -1;
      for (const event of inputs) {
        if (!Array.isArray(event) || event.length !== 2 || !timestamp(event[0]) || !Number.isInteger(event[1]) || event[1] < 0 || event[1] > 63) {
          return fail("Timestamped input is malformed");
        }
        if (event[0] < previousTime || event[0] > terminal.atMs || event[1] === previousMask) return fail("Timestamped input sequence is inconsistent");
        previousTime = event[0];
        previousMask = event[1];
      }
      if (inputs[0][0] !== 0) return fail("Replay input stream must begin at zero");

      const rewindEnabled = levelData?.settings?.rewind?.enabled === true;
      const echoEnabled = levelData?.settings?.echo?.enabled === true;
      for (const event of inputs) {
        if ((event[1] & 32) && !(event[1] & 16)) return fail("Forward-time input requires an active rewind preview");
        if ((event[1] & 16) && !rewindEnabled) return fail("Replay uses Rewind where it is disabled");
      }

      previousTime = -1;
      let previous = null;
      let inputIndex = 0;
      let expectedMask = inputs[0][1];
      let lastJumpPressAt = expectedMask & 4 ? 0 : -Infinity;
      const movingSupportsExist = (levelData.objects || []).some(object => ["movingPlatform", "controlledPlatform", "rewindPlatform"].includes(object.type));
      for (const checkpoint of checkpoints) {
        if (!Array.isArray(checkpoint) || checkpoint.length !== 7 || !checkpoint.slice(0, 6).every(finite) ||
            !timestamp(checkpoint[0]) || !validateObjectStates(checkpoint[6], levelData)) return fail("Replay checkpoint is malformed");
        const [time, x, y, vx, vy, mask] = checkpoint;
        if (time <= previousTime || time > terminal.atMs || !Number.isInteger(mask) || mask < 0 || mask > 63) return fail("Replay checkpoint timing is invalid");
        while (inputIndex + 1 < inputs.length && inputs[inputIndex + 1][0] <= time) {
          const nextInput = inputs[++inputIndex];
          if ((nextInput[1] & 4) && !(expectedMask & 4)) lastJumpPressAt = nextInput[0];
          expectedMask = nextInput[1];
        }
        if (mask !== expectedMask) return fail("Replay checkpoints disagree with timestamped inputs");
        if (x < -10 || x > Number(levelData.width) + 10 || y < -5000 || y > 10000 || Math.abs(vx) > 350 || Math.abs(vy) > 1250) {
          return fail("Replay checkpoint is outside physical bounds");
        }
        const jumpPadExists = (levelData.objects || []).some(object => object.type === "jumpPad");
        if (vy < (jumpPadExists ? -1160 : -780)) return fail("Replay contains an impossible upward velocity");
        if (previous) {
          const dt = (time - previous[0]) / 1000;
          if (dt > .45 || Math.abs(x - previous[1]) > 18 + 650 * dt || Math.abs(y - previous[2]) > 24 + 1250 * dt) {
            return fail("Replay motion is physically inconsistent");
          }
          if (vy < previous[4] - 500 && lastJumpPressAt < previous[0] && !jumpPadExists) return fail("Replay contains an unsupported jump impulse");
          const dx = x - previous[1];
          const previousMask = previous[5];
          if (!movingSupportsExist && Math.abs(dx) > 8 && !(previousMask & 3) && !(mask & 3)) {
            return fail("Replay movement has no corresponding directional input");
          }
          if (!movingSupportsExist && dx > 40 && !(previousMask & 2) && !(mask & 2)) return fail("Replay moved right without right input");
          if (!movingSupportsExist && dx < -40 && !(previousMask & 1) && !(mask & 1)) return fail("Replay moved left without left input");
        } else if (time > 350 || Math.abs(x - initial.x) > 1 || Math.abs(y - initial.y) > 1) {
          return fail("Replay checkpoints do not begin at the initial state");
        }
        previousTime = time;
        previous = checkpoint;
      }
      if (checkpoints[checkpoints.length - 1][0] !== terminal.atMs) return fail("Replay end state is not anchored to its final checkpoint");

      const integrityKinds = new Set();
      previousTime = -1;
      for (const event of integrityEvents) {
        if (!Array.isArray(event) || event.length !== 2 || !timestamp(event[0]) || !["fly", "collision", "invincibility", "developer", "tempo"].includes(event[1]) ||
            event[0] < previousTime || event[0] > terminal.atMs) return fail("Replay integrity event is malformed");
        previousTime = event[0];
        integrityKinds.add(event[1]);
      }

      const stars = (levelData.objects || []).filter(object => object.type === "star");
      const enemies = (levelData.objects || []).filter(object => object.type === "enemy");
      const collected = new Set();
      const deathActions = [];
      let echoState = "idle";
      previousTime = -1;
      for (const action of actions) {
        if (!Array.isArray(action) || action.length !== 2 || !timestamp(action[0]) || typeof action[1] !== "string" || action[1].length > 160 ||
            action[0] < previousTime || action[0] > terminal.atMs) return fail("Replay action is malformed");
        previousTime = action[0];
        if (action[1].startsWith("echo-")) {
          if (!echoEnabled) return fail("Replay uses Echo where it is disabled");
          if (action[1] === "echo-record" && ["idle", "active"].includes(echoState)) echoState = "recording";
          else if (action[1] === "echo-stop" && echoState === "recording") echoState = "preview";
          else if (action[1] === "echo-create" && echoState === "preview") echoState = "active";
          else if (action[1] === "echo-destroy" && echoState === "active") echoState = "idle";
          else return fail("Replay Echo actions are out of sequence");
        }
        if (action[1].startsWith("death:")) deathActions.push(action[0]);
        const starMatch = /^star:(\d+)$/.exec(action[1]);
        const enemyMatch = /^enemy-star:(\d+)$/.exec(action[1]);
        if (!starMatch && !enemyMatch) continue;
        const index = Number((starMatch || enemyMatch)[1]);
        const checkpoint = nearestCheckpoint(checkpoints, action[0]);
        let target = starMatch ? stars[index] : enemies[index];
        if (enemyMatch && checkpoint && Array.isArray(checkpoint[6])) {
          const enemyState = checkpoint[6].find(state => Array.isArray(state) && state[0] === `e${index}`);
          if (enemyState && enemyState[3] === 0) target = { x: enemyState[1], y: enemyState[2], width: 30, height: 42 };
        }
        if (!target || !checkpoint || !overlapsPlayer(checkpoint, target, starMatch ? 12 : 70)) return fail("Star collection is not supported by replay position");
        collected.add(`${starMatch ? "star" : "enemy"}:${index}`);
      }

      const terminalCheckpoint = checkpoints[checkpoints.length - 1];
      if (!finite(terminal.x) || !finite(terminal.y) || Math.abs(terminal.x - terminalCheckpoint[1]) > .2 || Math.abs(terminal.y - terminalCheckpoint[2]) > .2) {
        return fail("Replay terminal claim disagrees with its final checkpoint");
      }
      const reachedExit = levelType !== "survival" && terminal.kind === "exit" && levelData.exit && overlapsPlayer(terminalCheckpoint, levelData.exit, 2);
      if (levelType !== "survival" && deathActions.length) return fail("Replay crosses an in-level death boundary");
      if (levelType === "survival" && (deathActions.length !== 1 || deathActions[0] !== terminal.atMs)) {
        return fail("Survival death is not anchored to the replay end");
      }
      if (levelType === "survival" && terminal.kind !== "death") return fail("Survival replay must end in a recorded death");
      if (levelType !== "survival" && !reachedExit) return fail("Replay did not legitimately reach the exit");
      const flyEver = integrityKinds.has("fly");
      const cheatEver = [...integrityKinds].some(kind => kind !== "fly") || flyEver;
      const completion = levelType === "survival" || (reachedExit && (levelType !== "exit-stars" || collected.size >= requiredStars));
      if (!completion) return fail("Replay did not satisfy the published completion rules");
      if (flyEver || cheatEver) return fail("Replay contains developer integrity events");

      return {
        ok: true,
        result: {
          seconds: Math.round(terminal.atMs) / 1000,
          stars: collected.size,
          reachedExit,
          flyEver,
          cheatEver,
          completed: completion,
          levelType,
          requiredStars,
          verifierVersion: VERIFIER_VERSION
        }
      };
    } catch {
      return fail("Malformed replay evidence");
    }
  }

  globalThis.PlatformsReplayValidator = Object.freeze({
    FORMAT, LEGACY_FORMAT, VERIFIER_VERSION, MAX_BYTES, MAX_COMPACT_BYTES, MAX_DURATION_MS,
    MAX_INPUT_EVENTS, MAX_CHECKPOINTS, MAX_ACTIONS, MAX_INTEGRITY_EVENTS,
    serializedBytes, levelDigest, encodeReplay, decodeReplay, validateReplay
  });
})();
