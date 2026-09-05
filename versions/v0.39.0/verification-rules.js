"use strict";

(() => {
  const LEVEL_TYPES = Object.freeze(["exit", "exit-stars", "survival"]);
  const RANKED_RUN_STATES = Object.freeze(["valid", "restored"]);
  const REVIEW_STATES = Object.freeze(["valid", "disputed", "invalidated", "restored"]);

  function finiteNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function resolveLevelType(settings = {}) {
    const explicit = settings?.levelType;
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
    if (levelType === "survival") {
      if (run.reachedExit) return { valid: false, verifies: false, rankingStatus: "invalidated", reason: "Incomplete run" };
      return { valid: true, verifies: false, rankingStatus: "valid", reason: null };
    }
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
      verificationStatus: levelType === "survival" ? "ranked" : "unverified",
      verifiedRunId: null,
      publishedAt
    };
    return { current: row, history: [...previous, row] };
  }

  function rankSurvivalRuns(runs) {
    let nextRank = 0;
    return (Array.isArray(runs) ? runs : []).map((run, sourceIndex) => ({ ...run, sourceIndex }))
      .sort((a, b) => finiteNumber(b.seconds) - finiteNumber(a.seconds) || a.sourceIndex - b.sourceIndex)
      .map(run => {
        const ranked = RANKED_RUN_STATES.includes(run.rankingStatus);
        if (ranked) nextRank += 1;
        const { sourceIndex, ...copy } = run;
        return { ...copy, displayRank: ranked ? nextRank : null };
      });
  }

  function resolveReviewDecision({ invalidVotes = 0, validVotes = 0, previousStatus = "disputed", everInvalidated = false } = {}) {
    if (!REVIEW_STATES.includes(previousStatus)) throw new Error("Unknown review state.");
    const invalidate = Math.max(0, Math.floor(finiteNumber(invalidVotes)));
    const allow = Math.max(0, Math.floor(finiteNumber(validVotes)));
    const total = invalidate + allow;
    if (total < 3) return "disputed";
    if (invalidate * 3 >= total * 2) return "invalidated";
    if (allow * 3 >= total * 2) {
      return everInvalidated || previousStatus === "invalidated" || previousStatus === "restored" ? "restored" : "valid";
    }
    return "disputed";
  }

  function createReviewReport({ id, runId, strategyFingerprint, description }) {
    return {
      id, runId, strategyFingerprint, description,
      decisionStatus: "disputed", everInvalidated: false, votes: {}
    };
  }

  function castReviewVote(report, userId, vote) {
    if (!report || !userId || !["valid", "invalidated"].includes(vote)) throw new Error("Invalid review vote.");
    const votes = { ...(report.votes || {}), [userId]: vote };
    const values = Object.values(votes);
    const invalidVotes = values.filter(value => value === "invalidated").length;
    const validVotes = values.filter(value => value === "valid").length;
    const decisionStatus = resolveReviewDecision({
      invalidVotes, validVotes,
      previousStatus: report.decisionStatus,
      everInvalidated: Boolean(report.everInvalidated)
    });
    return {
      ...report, votes, decisionStatus,
      everInvalidated: Boolean(report.everInvalidated) || decisionStatus === "invalidated"
    };
  }

  function applyStrategyDecision(runs, strategyFingerprint, decisionStatus, reportId = null) {
    if (!REVIEW_STATES.includes(decisionStatus)) throw new Error("Unknown review state.");
    return (Array.isArray(runs) ? runs : []).map(run => {
      if (run.strategyFingerprint !== strategyFingerprint) return { ...run };
      if (decisionStatus === "invalidated") return { ...run, rankingStatus: "invalidated", statusReason: "Invalid strategy", invalidatedByReport: reportId };
      if (decisionStatus === "disputed") return { ...run, rankingStatus: "disputed", statusReason: "Disputed motion", invalidatedByReport: null };
      return { ...run, rankingStatus: decisionStatus === "restored" ? "restored" : "valid", statusReason: null, invalidatedByReport: null };
    });
  }

  window.PlatformsVerificationRules = Object.freeze({
    LEVEL_TYPES, RANKED_RUN_STATES, REVIEW_STATES,
    resolveLevelType, requiredStarsFor, evaluateCompletion, publishSnapshot,
    rankSurvivalRuns, resolveReviewDecision, createReviewReport, castReviewVote,
    applyStrategyDecision
  });
})();
