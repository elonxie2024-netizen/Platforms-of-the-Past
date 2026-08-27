"use strict";

(() => {
  const FORMAT = "POTP-RUN-2";
  const VERIFIER_VERSION = "potp-replay-v1";
  const MAX_BYTES = 1500000;
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

  function validateReplay({ evidence, levelData, levelId, levelVersion, runTicket, issuedAtMs, receivedAtMs }) {
    try {
      if (!evidence || typeof evidence !== "object" || Array.isArray(evidence)) return fail("Invalid replay evidence");
      if (JSON.stringify(evidence).length > MAX_BYTES) return fail("Replay evidence is oversized");
      if (evidence.format !== FORMAT) return fail("Unsupported replay format");
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
      if (!Array.isArray(initial.objects) || initial.objects.length > 80) return fail("Replay initial object state is invalid");

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
      if (!terminal || !finite(terminal.atMs) || terminal.atMs <= 0 || terminal.atMs > MAX_DURATION_MS) return fail("Replay end state is invalid");
      if (!issuedAtMs || !receivedAtMs || terminal.atMs > receivedAtMs - issuedAtMs + 2500) return fail("Replay duration exceeds its server session");

      let previousTime = -1;
      let previousMask = -1;
      for (const event of inputs) {
        if (!Array.isArray(event) || event.length !== 2 || !finite(event[0]) || !Number.isInteger(event[1]) || event[1] < 0 || event[1] > 511) {
          return fail("Timestamped input is malformed");
        }
        if (event[0] < previousTime || event[0] > terminal.atMs || event[1] === previousMask) return fail("Timestamped input sequence is inconsistent");
        previousTime = event[0];
        previousMask = event[1];
      }
      if (inputs[0][0] !== 0) return fail("Replay input stream must begin at zero");

      previousTime = -1;
      let previous = null;
      let inputIndex = 0;
      let expectedMask = inputs[0][1];
      const movingSupportsExist = (levelData.objects || []).some(object => ["movingPlatform", "controlledPlatform", "rewindPlatform"].includes(object.type));
      for (const checkpoint of checkpoints) {
        if (!Array.isArray(checkpoint) || checkpoint.length < 6 || !checkpoint.slice(0, 6).every(finite)) return fail("Replay checkpoint is malformed");
        const [time, x, y, vx, vy, mask] = checkpoint;
        if (time < previousTime || time > terminal.atMs + 400 || !Number.isInteger(mask) || mask < 0 || mask > 511) return fail("Replay checkpoint timing is invalid");
        while (inputIndex + 1 < inputs.length && inputs[inputIndex + 1][0] <= time) expectedMask = inputs[++inputIndex][1];
        if (mask !== expectedMask) return fail("Replay checkpoints disagree with timestamped inputs");
        if (x < -10 || x > Number(levelData.width) + 10 || y < -5000 || y > 10000 || Math.abs(vx) > 350 || Math.abs(vy) > 1250) {
          return fail("Replay checkpoint is outside physical bounds");
        }
        if (previous) {
          const dt = (time - previous[0]) / 1000;
          if (dt > .45 || Math.abs(x - previous[1]) > 90 + 900 * dt || Math.abs(y - previous[2]) > 120 + 1400 * dt) {
            return fail("Replay motion is physically inconsistent");
          }
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
      if (!nearestCheckpoint(checkpoints, terminal.atMs)) return fail("Replay has no checkpoint for its end state");

      const integrityKinds = new Set();
      previousTime = -1;
      for (const event of integrityEvents) {
        if (!Array.isArray(event) || event.length !== 2 || !finite(event[0]) || !["fly", "collision", "invincibility", "developer", "tempo"].includes(event[1]) ||
            event[0] < previousTime || event[0] > terminal.atMs) return fail("Replay integrity event is malformed");
        previousTime = event[0];
        integrityKinds.add(event[1]);
      }

      const stars = (levelData.objects || []).filter(object => object.type === "star");
      const enemies = (levelData.objects || []).filter(object => object.type === "enemy");
      const collected = new Set();
      previousTime = -1;
      for (const action of actions) {
        if (!Array.isArray(action) || action.length !== 2 || !finite(action[0]) || typeof action[1] !== "string" ||
            action[0] < previousTime || action[0] > terminal.atMs) return fail("Replay action is malformed");
        previousTime = action[0];
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

      const terminalCheckpoint = nearestCheckpoint(checkpoints, terminal.atMs);
      const reachedExit = levelType !== "survival" && terminal.kind === "exit" && levelData.exit && overlapsPlayer(terminalCheckpoint, levelData.exit, 2);
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

  globalThis.PlatformsReplayValidator = Object.freeze({ FORMAT, VERIFIER_VERSION, MAX_BYTES, levelDigest, validateReplay });
})();
