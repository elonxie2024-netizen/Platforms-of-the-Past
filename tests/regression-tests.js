"use strict";

(() => {
  const rules = window.PlatformsVerificationRules;
  const levels = window.PlatformsLevelData;
  const results = [];

  function test(name, callback) {
    try {
      callback();
      results.push({ name, passed: true });
    } catch (error) {
      results.push({ name, passed: false, error: error?.message || String(error) });
    }
  }

  function assert(condition, message = "Assertion failed") {
    if (!condition) throw new Error(message);
  }

  function equal(actual, expected, message = "Values differ") {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      throw new Error(`${message}: expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`);
    }
  }

  function throws(callback, message = "Expected an exception") {
    let threw = false;
    try { callback(); } catch { threw = true; }
    assert(threw, message);
  }

  function baseLevel(settings = {}) {
    return {
      schemaVersion: 1,
      id: "regression-level",
      name: "Regression Level",
      width: 960,
      spawn: { x: 40, y: 430 },
      exit: { id: "level-exit", x: 880, y: 400, width: 34, height: 90 },
      settings: { music: "level1", ...settings },
      objects: [
        { id: "ground", type: "platform", x: 0, y: 490, width: 960, height: 80, material: "grass" },
        { id: "star-1", type: "star", x: 200, y: 430 },
        { id: "star-2", type: "star", x: 500, y: 430 },
        { id: "star-3", type: "star", x: 760, y: 430 }
      ]
    };
  }

  function verify(run) {
    return rules.evaluateCompletion({ stars: 0, reachedExit: true, flyEver: false, cheatEver: false, ...run });
  }

  test("Level type: Exit", () => equal(rules.resolveLevelType({ levelType: "exit" }), "exit"));
  test("Level type: Exit + Required Stars", () => equal(rules.resolveLevelType({ levelType: "exit-stars", requiredStars: 2 }), "exit-stars"));
  test("Level type: Survival", () => equal(rules.resolveLevelType({ levelType: "survival" }), "survival"));
  test("Level type: unknown type rejected", () => throws(() => rules.resolveLevelType({ levelType: "mystery" })));
  test("Level type: legacy required-stars level migrates", () => equal(rules.resolveLevelType({ requiredStars: 2 }), "exit-stars"));
  test("Level type: legacy level defaults to Exit", () => equal(rules.resolveLevelType({}), "exit"));
  test("Level type: legacy required-stars runtime loads as Exit + Required Stars", () => {
    const loaded = levels.loadLevel(baseLevel({ requiredStars: 2 }), {
      exit: value => ({ ...value }), platform: value => ({ ...value }), star: value => [value.x, value.y]
    });
    assert(loaded.ok, loaded.errors?.join("; "));
    equal(loaded.level.levelType, "exit-stars");
  });
  test("Level type: legacy runtime without a type loads as Exit", () => {
    const loaded = levels.loadLevel(baseLevel(), {
      exit: value => ({ ...value }), platform: value => ({ ...value }), star: value => [value.x, value.y]
    });
    assert(loaded.ok, loaded.errors?.join("; "));
    equal(loaded.level.levelType, "exit");
  });

  test("Exit verification: valid completion", () => assert(verify({ levelType: "exit" }).verifies));
  test("Exit verification: exit not reached", () => assert(!verify({ levelType: "exit", reachedExit: false }).valid));
  test("Exit verification: Fly used", () => assert(!verify({ levelType: "exit", flyEver: true }).valid));
  test("Exit verification: developer cheat used", () => assert(!verify({ levelType: "exit", cheatEver: true }).valid));
  test("Exit verification: Fly remains invalid after being toggled off", () => {
    const runState = { flyEver: false, flyEnabled: false };
    runState.flyEnabled = true; runState.flyEver ||= runState.flyEnabled; runState.flyEnabled = false;
    assert(!verify({ levelType: "exit", flyEver: runState.flyEver }).valid);
  });
  test("Exit verification: cheat remains invalid after being toggled off", () => {
    const runState = { cheatEver: false, cheatEnabled: false };
    runState.cheatEnabled = true; runState.cheatEver ||= runState.cheatEnabled; runState.cheatEnabled = false;
    assert(!verify({ levelType: "exit", cheatEver: runState.cheatEver }).valid);
  });

  test("Required Stars: below requirement", () => assert(!verify({ levelType: "exit-stars", requiredStars: 2, stars: 1 }).valid));
  test("Required Stars: exact requirement", () => assert(verify({ levelType: "exit-stars", requiredStars: 2, stars: 2 }).verifies));
  test("Required Stars: above requirement", () => assert(verify({ levelType: "exit-stars", requiredStars: 2, stars: 3 }).verifies));
  test("Required Stars: Fly invalidates a sufficient run", () => assert(!verify({ levelType: "exit-stars", requiredStars: 2, stars: 3, flyEver: true }).valid));
  test("Required Stars: cheat invalidates a sufficient run", () => assert(!verify({ levelType: "exit-stars", requiredStars: 2, stars: 3, cheatEver: true }).valid));
  test("Survival completion: valid death produces a ranked run, not verification", () => {
    const result = verify({ levelType: "survival", reachedExit: false });
    assert(result.valid && !result.verifies && result.rankingStatus === "valid");
  });

  test("Publishing: every publish creates a new version", () => {
    const first = rules.publishSnapshot([], baseLevel({ levelType: "exit" }));
    const second = rules.publishSnapshot(first.history, baseLevel({ levelType: "exit" }));
    equal([first.current.version, second.current.version], [1, 2]);
  });
  test("Publishing: snapshots are immutable copies", () => {
    const draft = baseLevel({ levelType: "exit" });
    const first = rules.publishSnapshot([], draft);
    draft.name = "Changed later";
    equal(first.current.levelData.name, "Regression Level");
  });
  test("Publishing: verification is version-specific", () => {
    const first = rules.publishSnapshot([], baseLevel({ levelType: "exit" }));
    first.current.verificationStatus = "verified";
    first.current.verifiedRunId = "run-v1";
    const second = rules.publishSnapshot(first.history, baseLevel({ levelType: "exit" }));
    equal([first.current.verificationStatus, second.current.verificationStatus], ["verified", "unverified"]);
    equal(second.current.verifiedRunId, null);
  });
  test("Publishing: old runs stay attached to old versions", () => {
    const runs = [{ id: "old-run", levelVersion: 1 }];
    const first = rules.publishSnapshot([], baseLevel({ levelType: "exit" }));
    rules.publishSnapshot(first.history, baseLevel({ levelType: "exit" }));
    equal(runs, [{ id: "old-run", levelVersion: 1 }]);
  });

  const survivalRuns = () => [
    { id: "valid-90", seconds: 90, rankingStatus: "valid", strategyFingerprint: "safe" },
    { id: "disputed-120", seconds: 120, rankingStatus: "disputed", strategyFingerprint: "loop" },
    { id: "invalid-100", seconds: 100, rankingStatus: "invalidated", strategyFingerprint: "ledge" },
    { id: "valid-80", seconds: 80, rankingStatus: "valid", strategyFingerprint: "route" }
  ];
  test("Survival leaderboard: longest time displays first", () => equal(rules.rankSurvivalRuns(survivalRuns()).map(run => run.id), ["disputed-120", "invalid-100", "valid-90", "valid-80"]));
  test("Survival leaderboard: invalid and disputed runs receive no rank", () => equal(rules.rankSurvivalRuns(survivalRuns()).slice(0, 2).map(run => run.displayRank), [null, null]));
  test("Survival leaderboard: affected rows remain in score order", () => equal(rules.rankSurvivalRuns(survivalRuns()).map(run => run.seconds), [120, 100, 90, 80]));
  test("Survival leaderboard: affected rows do not consume ranks", () => equal(rules.rankSurvivalRuns(survivalRuns()).map(run => run.displayRank), [null, null, 1, 2]));
  test("Survival leaderboard: restoration recalculates ranking", () => {
    const restored = rules.applyStrategyDecision(survivalRuns(), "loop", "restored", "report-1");
    equal(rules.rankSurvivalRuns(restored).map(run => run.displayRank), [1, null, 2, 3]);
  });

  test("Survival review: report creation starts disputed", () => equal(rules.createReviewReport({ id: "r", runId: "run", strategyFingerprint: "loop", description: "Evidence" }).decisionStatus, "disputed"));
  test("Survival review: votes are stored by voter", () => {
    const report = rules.createReviewReport({ id: "r", runId: "run", strategyFingerprint: "loop", description: "Evidence" });
    equal(rules.castReviewVote(report, "u1", "valid").votes, { u1: "valid" });
  });
  test("Survival review: fewer than three votes stays disputed", () => {
    let report = rules.createReviewReport({ id: "r", runId: "run", strategyFingerprint: "loop", description: "Evidence" });
    report = rules.castReviewVote(report, "u1", "invalidated");
    report = rules.castReviewVote(report, "u2", "invalidated");
    equal(report.decisionStatus, "disputed");
  });
  test("Survival review: disputed to invalidated at threshold", () => equal(rules.resolveReviewDecision({ invalidVotes: 2, validVotes: 1 }), "invalidated"));
  test("Survival review: disputed to valid at threshold", () => equal(rules.resolveReviewDecision({ invalidVotes: 1, validVotes: 2 }), "valid"));
  test("Survival review: invalidated to restored", () => {
    let report = rules.createReviewReport({ id: "r", runId: "run", strategyFingerprint: "loop", description: "Evidence" });
    report = rules.castReviewVote(report, "u1", "invalidated");
    report = rules.castReviewVote(report, "u2", "invalidated");
    report = rules.castReviewVote(report, "u3", "valid");
    equal(report.decisionStatus, "invalidated");
    report = rules.castReviewVote(report, "u1", "valid");
    equal(report.decisionStatus, "restored");
  });
  test("Survival review: rulings never delete runs", () => {
    const runs = survivalRuns();
    equal(rules.applyStrategyDecision(runs, "loop", "invalidated", "report-1").length, runs.length);
  });

  for (const [levelType, requiredStars] of [["exit", undefined], ["exit-stars", 2], ["survival", undefined]]) {
    test(`Serialization: ${levelType} JSON and save-code round trip`, () => {
      const level = baseLevel({ levelType, ...(requiredStars === undefined ? {} : { requiredStars }) });
      const exported = levels.exportLevel(level);
      assert(exported.ok, exported.errors?.join("; "));
      const imported = levels.importLevel(exported.json);
      assert(imported.ok, imported.errors?.join("; "));
      equal(imported.level.settings.levelType, levelType);
      equal(imported.level.settings.requiredStars, requiredStars);
      const code = levels.exportSaveCode(level);
      assert(code.ok, code.errors?.join("; "));
      const decoded = levels.importSaveCode(code.code);
      assert(decoded.ok, decoded.errors?.join("; "));
      equal(decoded.level, level);
    });
  }
  test("Serialization: Required Stars rejected on explicit Exit", () => assert(!levels.validateLevel(baseLevel({ levelType: "exit", requiredStars: 1 })).valid));
  test("Serialization: Required Stars rejected on Survival", () => assert(!levels.validateLevel(baseLevel({ levelType: "survival", requiredStars: 1 })).valid));
  test("Serialization: unknown level type rejected", () => assert(!levels.validateLevel(baseLevel({ levelType: "unknown" })).valid));
  test("Serialization: legacy Required Stars remains supported", () => assert(levels.validateLevel(baseLevel({ requiredStars: 2 })).valid));
  test("Serialization: malformed JSON rejected safely", () => assert(!levels.importLevel('{"broken":').ok));
  test("Serialization: unsupported properties rejected safely", () => assert(!levels.validateLevel({ ...baseLevel(), executable: "alert(1)" }).valid));

  const failed = results.filter(result => !result.passed);
  document.querySelector("#results").textContent = JSON.stringify({
    passed: results.length - failed.length,
    failed: failed.length,
    total: results.length,
    failures: failed
  });
})();
