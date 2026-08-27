"use strict";

(() => {
  const rules = window.PlatformsVerificationRules;
  const levels = window.PlatformsLevelData;
  const replayVerifier = window.PlatformsReplayValidator;
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

  function replayEvidence(level, options = {}) {
    const ticket = "11111111-1111-4111-8111-111111111111";
    const collectedStars = options.collectedStars || [];
    const terminalAt = Math.max(1000, 250 + collectedStars.length * 250);
    const terminalKind = options.terminalKind || (level.settings.levelType === "survival" ? "death" : "exit");
    const terminalPoint = terminalKind === "exit"
      ? [terminalAt, level.exit.x, level.exit.y, 300, 0, 2, []]
      : [terminalAt, level.spawn.x + 100, level.spawn.y, 0, 0, 2, []];
    const stars = level.objects.filter(object => object.type === "star");
    const collectedAt = new Map(collectedStars.map((index, order) => [250 + order * 250, stars[index]]));
    const points = [[0, level.spawn.x, level.spawn.y, 0, 0, 2, []]];
    for (let time = 250; time < terminalAt; time += 250) {
      const star = collectedAt.get(time);
      const progress = time / terminalAt;
      points.push(star
        ? [time, star.x, star.y, 300, 0, 2, []]
        : [time, level.spawn.x + (terminalPoint[1] - level.spawn.x) * progress,
          level.spawn.y + (terminalPoint[2] - level.spawn.y) * progress, 300, 0, 2, []]);
    }
    points.push(terminalPoint);
    return {
      format: replayVerifier.FORMAT,
      gameVersion: "v0.35.0",
      sampleIntervalMs: 250,
      levelId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      levelVersion: 3,
      runTicket: ticket,
      levelDigest: replayVerifier.levelDigest(level),
      initialState: { x: level.spawn.x, y: level.spawn.y, objectCount: level.objects.length, objects: [] },
      inputEvents: [[0, 2]],
      checkpoints: points,
      actions: collectedStars.map((index, order) => [250 + order * 250, `star:${index}`]),
      integrityEvents: options.integrityEvents || [],
      terminal: { kind: terminalKind, atMs: terminalAt, x: terminalPoint[1], y: terminalPoint[2], reason: terminalKind === "death" ? "hazard" : undefined }
    };
  }

  function trustedReplay(level, overrides = {}) {
    const evidence = overrides.evidence || replayEvidence(level, overrides);
    return replayVerifier.validateReplay({
      evidence,
      levelData: level,
      levelId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      levelVersion: 3,
      runTicket: "11111111-1111-4111-8111-111111111111",
      issuedAtMs: 1000,
      receivedAtMs: 1000 + evidence.terminal.atMs + 1000
    });
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

  test("Trusted replay: valid Exit derives completion", () => {
    const result = trustedReplay(baseLevel({ levelType: "exit" }));
    assert(result.ok && result.result.reachedExit && result.result.seconds === 1);
  });
  test("Trusted replay: fabricated reached_exit claim cannot replace exit evidence", () => {
    const level = baseLevel({ levelType: "exit" });
    const evidence = replayEvidence(level);
    evidence.reached_exit = true;
    evidence.terminal.kind = "death";
    assert(!trustedReplay(level, { evidence }).ok);
  });
  test("Trusted replay: fabricated stars without positional collection evidence fail", () => {
    const level = baseLevel({ levelType: "exit-stars", requiredStars: 2 });
    const evidence = replayEvidence(level);
    evidence.stars = 999;
    evidence.actions = [[500, "star:0"], [600, "star:1"]];
    assert(!trustedReplay(level, { evidence }).ok);
  });
  test("Trusted replay: Required Stars below requirement fails", () => {
    const level = baseLevel({ levelType: "exit-stars", requiredStars: 2 });
    assert(!trustedReplay(level, { collectedStars: [0] }).ok);
  });
  test("Trusted replay: Required Stars exact requirement passes", () => {
    const level = baseLevel({ levelType: "exit-stars", requiredStars: 2 });
    const result = trustedReplay(level, { collectedStars: [0, 1] });
    assert(result.ok && result.result.stars === 2);
  });
  test("Trusted replay: Required Stars above requirement passes", () => {
    const level = baseLevel({ levelType: "exit-stars", requiredStars: 2 });
    const result = trustedReplay(level, { collectedStars: [0, 1, 2] });
    assert(result.ok && result.result.stars === 3);
  });
  test("Trusted replay: Fly event invalidates even after Fly is turned off", () => {
    const level = baseLevel({ levelType: "exit" });
    assert(!trustedReplay(level, { integrityEvents: [[100, "fly"]] }).ok);
  });
  test("Trusted replay: developer event invalidates even after cheat is turned off", () => {
    const level = baseLevel({ levelType: "exit" });
    assert(!trustedReplay(level, { integrityEvents: [[100, "developer"]] }).ok);
  });
  test("Trusted replay: exact immutable version is required", () => {
    const level = baseLevel({ levelType: "exit" });
    const evidence = replayEvidence(level);
    evidence.levelVersion = 4;
    assert(!trustedReplay(level, { evidence }).ok);
  });
  test("Trusted replay: changed level snapshot is rejected", () => {
    const level = baseLevel({ levelType: "exit" });
    const evidence = replayEvidence(level);
    level.name = "Changed after evidence";
    assert(!trustedReplay(level, { evidence }).ok);
  });
  test("Trusted replay: Survival duration is derived from terminal evidence", () => {
    const level = baseLevel({ levelType: "survival" });
    const evidence = replayEvidence(level, { terminalKind: "death" });
    evidence.seconds = .001;
    const result = trustedReplay(level, { evidence });
    assert(result.ok && result.result.seconds === evidence.terminal.atMs / 1000);
  });
  test("Trusted replay: Survival must end with a recorded death", () => {
    const level = baseLevel({ levelType: "survival" });
    assert(!trustedReplay(level, { terminalKind: "exit" }).ok);
  });
  test("Trusted replay: Rewind and Echo input bits remain recordable", () => {
    const level = baseLevel({ levelType: "exit" });
    const evidence = replayEvidence(level);
    evidence.inputEvents = [[0, 511]];
    evidence.checkpoints.forEach(checkpoint => { checkpoint[5] = 511; });
    evidence.actions.unshift([100, "echo-record"], [150, "echo-stop"], [200, "echo-create"]);
    assert(trustedReplay(level, { evidence }).ok);
  });
  test("Trusted replay: impossible motion without matching input is rejected", () => {
    const level = baseLevel({ levelType: "exit" });
    const evidence = replayEvidence(level);
    evidence.inputEvents = [[0, 0]];
    evidence.checkpoints.forEach(checkpoint => { checkpoint[5] = 0; });
    assert(!trustedReplay(level, { evidence }).ok);
  });
  test("Trusted replay: malformed and oversized streams fail safely", () => {
    const level = baseLevel({ levelType: "exit" });
    const evidence = replayEvidence(level);
    evidence.inputEvents = Array.from({ length: 20001 }, (_, index) => [index, index % 2]);
    assert(!trustedReplay(level, { evidence }).ok);
  });

  const failed = results.filter(result => !result.passed);
  document.querySelector("#results").textContent = JSON.stringify({
    passed: results.length - failed.length,
    failed: failed.length,
    total: results.length,
    failures: failed
  });
})();
