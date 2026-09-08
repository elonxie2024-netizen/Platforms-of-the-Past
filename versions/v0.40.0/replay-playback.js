"use strict";

(() => {
  function createTimeline(replayData, expected = {}) {
    const replayTools = window.PlatformsReplayValidator;
    if (!replayTools?.decodeReplay) throw new Error("Replay playback is unavailable.");
    const evidence = replayTools.decodeReplay(replayData);
    if (!Array.isArray(evidence.inputEvents) || !Array.isArray(evidence.checkpoints) ||
        !Array.isArray(evidence.actions) || !evidence.terminal) {
      throw new Error("Replay data is incomplete.");
    }
    if (expected.levelId && evidence.levelId !== expected.levelId) throw new Error("Replay belongs to another level.");
    if (expected.levelVersion != null && Number(evidence.levelVersion) !== Number(expected.levelVersion)) {
      throw new Error("Replay belongs to another published version.");
    }
    if (expected.levelDigest && evidence.levelDigest !== expected.levelDigest) {
      throw new Error("Replay does not match this immutable level version.");
    }
    const durationMs = Number(evidence.terminal.atMs);
    if (!Number.isFinite(durationMs) || durationMs <= 0 || !evidence.checkpoints.length) {
      throw new Error("Replay duration is invalid.");
    }

    function inputMaskAt(atMs) {
      let mask = 0;
      for (const event of evidence.inputEvents) {
        if (Number(event[0]) > atMs) break;
        mask = Number(event[1]) || 0;
      }
      return mask;
    }

    function actionsBetween(afterMs, throughMs) {
      return evidence.actions.filter(action => Number(action[0]) > afterMs && Number(action[0]) <= throughMs);
    }

    function samplePlayer(atMs) {
      const time = Math.max(0, Math.min(durationMs, Number(atMs) || 0));
      const checkpoints = evidence.checkpoints;
      let before = checkpoints[0];
      let after = checkpoints[checkpoints.length - 1];
      for (let index = 0; index < checkpoints.length; index++) {
        const checkpoint = checkpoints[index];
        if (Number(checkpoint[0]) <= time) before = checkpoint;
        if (Number(checkpoint[0]) >= time) { after = checkpoint; break; }
      }
      const span = Math.max(1, Number(after[0]) - Number(before[0]));
      const progress = before === after ? 0 : (time - Number(before[0])) / span;
      const interpolate = (start, end) => Number(start) + (Number(end) - Number(start)) * progress;
      return {
        x: interpolate(before[1], after[1]), y: interpolate(before[2], after[2]),
        vx: interpolate(before[3], after[3]), vy: interpolate(before[4], after[4]),
        grounded: Math.abs(interpolate(before[4], after[4])) < 35,
        facing: interpolate(before[3], after[3]) < -1 ? -1 : 1
      };
    }

    return Object.freeze({ evidence, durationMs, inputMaskAt, actionsBetween, samplePlayer });
  }

  window.PlatformsReplayPlayback = Object.freeze({ createTimeline });
})();
