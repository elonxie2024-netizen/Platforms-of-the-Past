"use strict";

(() => {
  const LEVEL_TYPES = Object.freeze(["exit", "exit-stars"]);
  const RANKED_RUN_STATES = Object.freeze(["valid"]);

  function finiteNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function resolveLevelType(settings = {}) {
    const explicit = settings?.levelType;
    if (explicit === "survival") return "exit";
    if (explicit !== undefined && explicit !== null && explicit !== "") {
      if (!LEVEL_TYPES.includes(explicit)) throw new Error("Unknown custom-level type.");
      return explicit;
    }
    return finiteNumber(settings?.requiredStars) > 0 ? "exit-stars" : "exit";
  }

  function requiredStarsFor(settings = {}) {
    return resolveLevelType(settings) === "exit-stars"
      ? Math.max(1, Math.floor(finiteNumber(settings.requiredStars)))
      : 0;
  }

  function evaluateCompletion(run = {}) {
    let levelType;
    try { levelType = resolveLevelType({ levelType: run.levelType, requiredStars: run.requiredStars }); }
    catch { return { valid: false, verifies: false, rankingStatus: "invalidated", reason: "Unknown level type" }; }
    if (run.evidenceError) return { valid: false, verifies: false, rankingStatus: "invalidated", reason: String(run.evidenceError) };
    if (run.flyEver || run.cheatEver) return { valid: false, verifies: false, rankingStatus: "invalidated", reason: "Cheats used" };
    if (!run.reachedExit) return { valid: false, verifies: false, rankingStatus: "invalidated", reason: "Incomplete run" };
    if (levelType === "exit-stars" && finiteNumber(run.stars) < requiredStarsFor(run)) {
      return { valid: false, verifies: false, rankingStatus: "invalidated", reason: "Incomplete run" };
    }
    return { valid: true, verifies: true, rankingStatus: "valid", reason: null };
  }

  function cloneJson(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function publishSnapshot(history, levelData, publishedAt = "test-time") {
    const previous = Array.isArray(history) ? history : [];
    const version = previous.reduce((highest, row) => Math.max(highest, finiteNumber(row?.version)), 0) + 1;
    const snapshot = cloneJson(levelData);
    const levelType = resolveLevelType(snapshot.settings || {});
    const row = {
      version,
      levelData: snapshot,
      levelType,
      requiredStars: requiredStarsFor(snapshot.settings || {}),
      verificationStatus: "unverified",
      verifiedRunId: null,
      publishedAt
    };
    return { current: row, history: [...previous, row] };
  }

  window.PlatformsVerificationRules = Object.freeze({
    LEVEL_TYPES, RANKED_RUN_STATES,
    resolveLevelType, requiredStarsFor, evaluateCompletion, publishSnapshot
  });
})();
