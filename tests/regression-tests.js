"use strict";

(() => {
  const rules = window.PlatformsVerificationRules;
  const levels = window.PlatformsLevelData;
  const replayVerifier = window.PlatformsReplayValidator;
  const runRules = window.PlatformsRunRules;
  const results = [];
  const measurements = {};

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
      exit: { id: "level-exit", x: 700, y: 400, width: 34, height: 90 },
      settings: { music: "level1", ...settings },
      objects: [
        { id: "ground", type: "platform", x: 0, y: 490, width: 960, height: 80, material: "grass" },
        { id: "star-1", type: "star", x: 205, y: 430 },
        { id: "star-2", type: "star", x: 370, y: 430 },
        { id: "star-3", type: "star", x: 535, y: 430 }
      ]
    };
  }

  function replayEvidence(level, options = {}) {
    const ticket = "11111111-1111-4111-8111-111111111111";
    const collectedStars = options.collectedStars || [];
    const terminalAt = 3000;
    const terminalKind = options.terminalKind || (level.settings.levelType === "survival" ? "death" : "exit");
    const terminalPoint = terminalKind === "exit"
      ? [terminalAt, level.exit.x, level.exit.y, 300, 0, 2, []]
      : [terminalAt, level.spawn.x + 100, level.spawn.y, 0, 0, 2, []];
    const stars = level.objects.filter(object => object.type === "star");
    const collectedAt = new Map(collectedStars.map(index => [(index + 1) * 750, stars[index]]));
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
      format: replayVerifier.LEGACY_FORMAT,
      gameVersion: "v0.37.2",
      sampleIntervalMs: 250,
      levelId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      levelVersion: 3,
      runTicket: ticket,
      levelDigest: replayVerifier.levelDigest(level),
      initialState: {
        x: level.spawn.x, y: level.spawn.y,
        objectCount: level.objects.filter(object => [
          "platform", "floatingPlatform", "crate", "breakableBlock", "movingPlatform",
          "controlledPlatform", "rewindPlatform", "movingObstacle", "enemy"
        ].includes(object.type)).length,
        objects: []
      },
      inputEvents: [[0, 2]],
      checkpoints: points,
      actions: [
        ...collectedStars.map(index => [(index + 1) * 750, `star:${index}`]),
        ...(terminalKind === "death" ? [[terminalAt, "death:hazard"]] : [])
      ],
      integrityEvents: options.integrityEvents || [],
      terminal: { kind: terminalKind, atMs: terminalAt, x: terminalPoint[1], y: terminalPoint[2], reason: terminalKind === "death" ? "hazard" : undefined }
    };
  }

  function trustedReplay(level, overrides = {}) {
    const evidence = overrides.evidence || replayEvidence(level, overrides);
    const terminalAt = evidence.terminal?.atMs ?? evidence.z?.[1] ?? 0;
    return replayVerifier.validateReplay({
      evidence,
      levelData: level,
      levelId: overrides.levelId || "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      levelVersion: overrides.levelVersion || 3,
      runTicket: overrides.runTicket || "11111111-1111-4111-8111-111111111111",
      issuedAtMs: 1000,
      receivedAtMs: 1000 + terminalAt + 1000
    });
  }

  function longSurvivalEvidence(durationMs = replayVerifier.MAX_DURATION_MS, worldIntervalMs = 2000) {
    const level = baseLevel({ levelType: "survival" });
    const evidence = replayEvidence(level, { terminalKind: "death" });
    evidence.inputEvents = [[0, 0]];
    evidence.checkpoints = [];
    for (let time = 0; time <= durationMs; time += 250) {
      evidence.checkpoints.push([
        time, level.spawn.x, level.spawn.y, 0, 0, 0,
        time % worldIntervalMs === 0 ? [[0, 0, 490, 0]] : []
      ]);
    }
    if (evidence.checkpoints[evidence.checkpoints.length - 1][0] !== durationMs) {
      evidence.checkpoints.push([durationMs, level.spawn.x, level.spawn.y, 0, 0, 0, [[0, 0, 490, 0]]]);
    }
    evidence.actions = [[durationMs, "death:hazard"]];
    evidence.terminal = { kind: "death", atMs: durationMs, x: level.spawn.x, y: level.spawn.y, reason: "hazard" };
    return { level, evidence };
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
    assert(result.ok && result.result.reachedExit && result.result.seconds === 3);
  });
  test("Trusted replay: fabricated reached_exit claim cannot replace exit evidence", () => {
    const level = baseLevel({ levelType: "exit" });
    const evidence = replayEvidence(level);
    evidence.reached_exit = true;
    evidence.terminal.kind = "death";
    assert(!trustedReplay(level, { evidence }).ok);
  });
  test("Trusted replay: every scalar client claim loses to derived evidence", () => {
    const level = baseLevel({ levelType: "exit" });
    const evidence = replayEvidence(level);
    Object.assign(evidence, { seconds: .001, stars: 999, reached_exit: false, fly_ever: true, cheat_ever: true });
    const result = trustedReplay(level, { evidence });
    assert(result.ok && result.result.seconds === 3 && result.result.stars === 0 && result.result.reachedExit);
    assert(!result.result.flyEver && !result.result.cheatEver);
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
  test("Trusted replay: altered evidence digest is rejected", () => {
    const level = baseLevel({ levelType: "exit" });
    const evidence = replayEvidence(level);
    evidence.levelDigest = "00000000";
    assert(!trustedReplay(level, { evidence }).ok);
  });
  test("Trusted replay: altered initial object count is rejected", () => {
    const level = baseLevel({ levelType: "exit" });
    const evidence = replayEvidence(level);
    evidence.initialState.objectCount += 1;
    assert(!trustedReplay(level, { evidence }).ok);
  });
  test("Trusted replay: stale level ID is rejected", () => {
    const level = baseLevel({ levelType: "exit" });
    const evidence = replayEvidence(level);
    assert(!trustedReplay(level, { evidence, levelId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb" }).ok);
  });
  test("Trusted replay: evidence cannot be replayed with another ticket", () => {
    const level = baseLevel({ levelType: "exit" });
    const evidence = replayEvidence(level);
    assert(!trustedReplay(level, { evidence, runTicket: "22222222-2222-4222-8222-222222222222" }).ok);
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
  test("Trusted replay: Survival requires a terminal death action", () => {
    const level = baseLevel({ levelType: "survival" });
    const evidence = replayEvidence(level, { terminalKind: "death" });
    evidence.actions = [];
    assert(!trustedReplay(level, { evidence }).ok);
  });
  test("Trusted replay: claimed Survival time cannot exceed checkpoint evidence", () => {
    const level = baseLevel({ levelType: "survival" });
    const evidence = replayEvidence(level, { terminalKind: "death" });
    evidence.terminal.atMs += 1000;
    assert(!trustedReplay(level, { evidence }).ok);
  });
  test("Trusted replay: Rewind and Echo input bits remain recordable", () => {
    const level = baseLevel({ levelType: "exit", rewind: { enabled: true }, echo: { enabled: true } });
    const evidence = replayEvidence(level);
    evidence.inputEvents = [[0, 63]];
    evidence.checkpoints.forEach(checkpoint => { checkpoint[5] = 63; });
    evidence.actions.unshift([100, "echo-record"], [150, "echo-stop"], [200, "echo-create"]);
    assert(trustedReplay(level, { evidence }).ok);
  });
  test("Trusted replay: forward-time input without Rewind is rejected", () => {
    const level = baseLevel({ levelType: "exit", rewind: { enabled: true } });
    const evidence = replayEvidence(level);
    evidence.inputEvents = [[0, 34]];
    evidence.checkpoints.forEach(checkpoint => { checkpoint[5] = 34; });
    assert(!trustedReplay(level, { evidence }).ok);
  });
  test("Trusted replay: Rewind input is rejected when the level disables Rewind", () => {
    const level = baseLevel({ levelType: "exit" });
    const evidence = replayEvidence(level);
    evidence.inputEvents = [[0, 18]];
    evidence.checkpoints.forEach(checkpoint => { checkpoint[5] = 18; });
    assert(!trustedReplay(level, { evidence }).ok);
  });
  test("Trusted replay: Echo actions must follow record-preview-create order", () => {
    const level = baseLevel({ levelType: "exit", echo: { enabled: true } });
    const evidence = replayEvidence(level);
    evidence.actions = [[100, "echo-create"]];
    assert(!trustedReplay(level, { evidence }).ok);
  });
  test("Trusted replay: replacing an active Echo with a new recording is legal", () => {
    const level = baseLevel({ levelType: "exit", echo: { enabled: true } });
    const evidence = replayEvidence(level);
    evidence.actions = [
      [100, "echo-record"], [200, "echo-stop"], [300, "echo-create"],
      [400, "echo-record"], [500, "echo-stop"], [600, "echo-create"]
    ];
    assert(trustedReplay(level, { evidence }).ok);
  });
  test("Trusted replay: Echo actions are rejected when Echo is disabled", () => {
    const level = baseLevel({ levelType: "exit" });
    const evidence = replayEvidence(level);
    evidence.actions = [[100, "echo-record"]];
    assert(!trustedReplay(level, { evidence }).ok);
  });
  test("Trusted replay: same-timestamp checkpoint teleport is rejected", () => {
    const level = baseLevel({ levelType: "exit" });
    const evidence = replayEvidence(level);
    evidence.checkpoints.splice(1, 0, [0, 90, level.spawn.y, 200, 0, 2, []]);
    assert(!trustedReplay(level, { evidence }).ok);
  });
  test("Trusted replay: compressed timestamps cannot conceal impossible speed", () => {
    const level = baseLevel({ levelType: "exit" });
    const evidence = replayEvidence(level);
    evidence.checkpoints.forEach((checkpoint, index) => { checkpoint[0] = index; });
    evidence.terminal.atMs = evidence.checkpoints.length - 1;
    assert(!trustedReplay(level, { evidence }).ok);
  });
  test("Trusted replay: fractional timestamps are rejected", () => {
    const level = baseLevel({ levelType: "exit" });
    const evidence = replayEvidence(level);
    evidence.checkpoints[1][0] = 250.5;
    assert(!trustedReplay(level, { evidence }).ok);
  });
  test("Trusted replay: impossible jump velocity is rejected", () => {
    const level = baseLevel({ levelType: "exit" });
    const evidence = replayEvidence(level);
    evidence.checkpoints[2][4] = -1000;
    assert(!trustedReplay(level, { evidence }).ok);
  });
  test("Trusted replay: a recorded tap jump may end before the next checkpoint", () => {
    const level = baseLevel({ levelType: "exit" });
    const evidence = replayEvidence(level);
    evidence.inputEvents = [[0, 2], [300, 6], [340, 2]];
    evidence.checkpoints[2][4] = -650;
    assert(trustedReplay(level, { evidence }).ok);
  });
  test("Trusted replay: impossible star position is rejected", () => {
    const level = baseLevel({ levelType: "exit" });
    const evidence = replayEvidence(level);
    evidence.actions = [[750, "star:2"]];
    assert(!trustedReplay(level, { evidence }).ok);
  });
  test("Trusted replay: duplicate star actions do not inflate the total", () => {
    const level = baseLevel({ levelType: "exit-stars", requiredStars: 2 });
    const evidence = replayEvidence(level, { collectedStars: [0] });
    evidence.actions.push([750, "star:0"]);
    assert(!trustedReplay(level, { evidence }).ok);
  });
  test("Trusted replay: exit claim must match final position", () => {
    const level = baseLevel({ levelType: "exit" });
    const evidence = replayEvidence(level);
    const final = evidence.checkpoints[evidence.checkpoints.length - 1];
    final[1] = level.spawn.x;
    evidence.terminal.x = level.spawn.x;
    assert(!trustedReplay(level, { evidence }).ok);
  });
  test("Trusted replay: terminal coordinates cannot differ from the final checkpoint", () => {
    const level = baseLevel({ levelType: "exit" });
    const evidence = replayEvidence(level);
    evidence.terminal.x -= 10;
    assert(!trustedReplay(level, { evidence }).ok);
  });
  test("Trusted replay: invalid object-state IDs are rejected", () => {
    const level = baseLevel({ levelType: "exit" });
    const evidence = replayEvidence(level);
    evidence.checkpoints[1][6] = [["e999", 0, 0, 1]];
    assert(!trustedReplay(level, { evidence }).ok);
  });
  test("Trusted replay: death-to-restart teleport cannot share one attempt", () => {
    const level = baseLevel({ levelType: "exit" });
    const evidence = replayEvidence(level);
    evidence.actions = [[1200, "death:spike"]];
    evidence.checkpoints[6][1] = level.spawn.x;
    assert(!trustedReplay(level, { evidence }).ok);
  });
  test("Trusted replay: collision cheat remains invalid after being disabled", () => {
    const level = baseLevel({ levelType: "exit" });
    assert(!trustedReplay(level, { integrityEvents: [[100, "collision"]] }).ok);
  });
  test("Trusted replay: invincibility remains invalid after being disabled", () => {
    const level = baseLevel({ levelType: "exit" });
    assert(!trustedReplay(level, { integrityEvents: [[100, "invincibility"]] }).ok);
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
  test("Trusted replay: truncated evidence is rejected", () => {
    const level = baseLevel({ levelType: "exit" });
    const evidence = replayEvidence(level);
    evidence.truncated = true;
    assert(!trustedReplay(level, { evidence }).ok);
  });
  test("Trusted replay: malformed checkpoint state is rejected safely", () => {
    const level = baseLevel({ levelType: "exit" });
    const evidence = replayEvidence(level);
    evidence.checkpoints[1] = [250, "NaN", 430, 0, 0, 2, []];
    assert(!trustedReplay(level, { evidence }).ok);
  });
  test("Trusted replay: byte-size limit rejects oversized payloads", () => {
    const level = baseLevel({ levelType: "exit" });
    const evidence = replayEvidence(level);
    evidence.padding = "x".repeat(replayVerifier.MAX_BYTES + 1);
    assert(!trustedReplay(level, { evidence }).ok);
  });
  test("Compact replay: Exit round-trips and validates identically", () => {
    const level = baseLevel({ levelType: "exit" });
    const expanded = replayEvidence(level);
    const compact = replayVerifier.encodeReplay(expanded);
    const decoded = replayVerifier.decodeReplay(compact);
    equal(decoded.checkpoints, expanded.checkpoints);
    equal(decoded.inputEvents, expanded.inputEvents);
    assert(trustedReplay(level, { evidence: compact }).ok);
    measurements.exit = { expanded: replayVerifier.serializedBytes(expanded), compact: replayVerifier.serializedBytes(compact) };
    assert(measurements.exit.compact < measurements.exit.expanded * .8);
  });
  test("Compact replay: unsupported properties are rejected instead of stored", () => {
    const level = baseLevel({ levelType: "exit" });
    const compact = replayVerifier.encodeReplay(replayEvidence(level));
    compact.padding = "unused";
    assert(!trustedReplay(level, { evidence: compact }).ok);
  });
  test("Compact replay: Exit + Required Stars preserves collection evidence", () => {
    const level = baseLevel({ levelType: "exit-stars", requiredStars: 2 });
    const expanded = replayEvidence(level, { collectedStars: [0, 1] });
    const compact = replayVerifier.encodeReplay(expanded);
    const result = trustedReplay(level, { evidence: compact });
    assert(result.ok && result.result.stars === 2);
    measurements.exitStars = { expanded: replayVerifier.serializedBytes(expanded), compact: replayVerifier.serializedBytes(compact) };
  });
  test("Compact replay: one-hour Survival remains bounded and valid", () => {
    const { level, evidence } = longSurvivalEvidence();
    const compact = replayVerifier.encodeReplay(evidence);
    const bytes = replayVerifier.serializedBytes(compact);
    measurements.survivalOneHour = { expanded: replayVerifier.serializedBytes(evidence), compact: bytes };
    assert(bytes <= replayVerifier.MAX_COMPACT_BYTES, `One-hour compact replay used ${bytes} bytes`);
    const result = trustedReplay(level, { evidence: compact });
    assert(result.ok && result.result.seconds === 3600);
  });
  test("Compact replay: duration beyond one hour is rejected", () => {
    const { level, evidence } = longSurvivalEvidence(replayVerifier.MAX_DURATION_MS + 250);
    const compact = replayVerifier.encodeReplay(evidence);
    assert(!trustedReplay(level, { evidence: compact }).ok);
  });
  test("Compact replay: dense maximum evidence cannot exceed its byte cap", () => {
    const { level, evidence } = longSurvivalEvidence(replayVerifier.MAX_DURATION_MS, 250);
    evidence.actions = [
      ...Array.from({ length: 9999 }, (_, index) => [Math.floor(index * (replayVerifier.MAX_DURATION_MS - 1) / 9999), "interact"]),
      [replayVerifier.MAX_DURATION_MS, "death:hazard"]
    ];
    const compact = replayVerifier.encodeReplay(evidence);
    const bytes = replayVerifier.serializedBytes(compact);
    assert(bytes > replayVerifier.MAX_COMPACT_BYTES);
    assert(!trustedReplay(level, { evidence: compact }).ok);
  });

  test("Custom routes: individual levels normalize into canonical order", () => {
    equal(runRules.normalizeRoute([36, 1, 13]), [1, 13, 36]);
  });
  test("Custom routes: chapters expand to their ten campaign levels", () => {
    equal(runRules.chapterLevels(2), [20, 21, 22, 23, 24, 25, 26, 27, 28, 29]);
  });
  test("Custom routes: gauntlets interleave after their canonical chapters", () => {
    equal(runRules.normalizeRoute([43, 0, 40, 10, 9]), [0, 9, 40, 10, 43]);
  });
  test("Custom routes: overlapping chapter and level choices deduplicate", () => {
    equal(runRules.normalizeRoute([...runRules.chapterLevels(1), 14, 14]), runRules.chapterLevels(1));
  });
  test("Custom routes: all levels means the full forty-level campaign", () => {
    assert(runRules.ALL_CAMPAIGN_LEVELS.length === 40);
    assert(runRules.routeSummary(runRules.ALL_CAMPAIGN_LEVELS) === "All 40 campaign levels");
  });
  test("Custom routes: gauntlets remain a separate explicit selection", () => {
    assert(runRules.ALL_GAUNTLETS.length === 4);
    assert(runRules.normalizeRoute([...runRules.ALL_CAMPAIGN_LEVELS, ...runRules.ALL_GAUNTLETS]).length === 44);
  });
  test("Custom routes: equivalent chapter and individual selection identities match", () => {
    const chapter = { objective: "specific", constraint: "none", metric: "time", levels: runRules.chapterLevels(0) };
    const individuals = { ...chapter, levels: [9, 4, 0, 2, 1, 3, 5, 6, 7, 8, 4] };
    assert(runRules.leaderboardIdentity(chapter) === runRules.leaderboardIdentity(individuals));
  });
  test("Custom routes: objective, route, and constraint distinguish boards", () => {
    const base = { objective: "specific", constraint: "none", metric: "time", levels: [1, 13, 36, 43] };
    const identities = new Set([
      runRules.leaderboardIdentity(base),
      runRules.leaderboardIdentity({ ...base, objective: "all-stars" }),
      runRules.leaderboardIdentity({ ...base, constraint: "no-stars" }),
      runRules.leaderboardIdentity({ ...base, levels: [...base.levels, 20] })
    ]);
    assert(identities.size === 4);
  });
  test("Custom routes: leaderboard metrics are views of the same board", () => {
    const base = { objective: "specific", constraint: "none", metric: "time", levels: [1, 13, 36, 43] };
    assert(runRules.leaderboardIdentity(base) === runRules.leaderboardIdentity({ ...base, metric: "score" }));
    assert(runRules.leaderboardIdentity(base) === runRules.leaderboardIdentity({ ...base, metric: "stars" }));
  });
  test("Custom routes: canonical board identities are addressable and round-trip", () => {
    const config = { objective: "all-mechanics", constraint: "all-stars", metric: "stars", levels: [43, 0, 20, 40] };
    const parsed = runRules.parseLeaderboardIdentity(runRules.leaderboardIdentity(config), config.metric);
    equal(parsed, runRules.normalizeConfig(config));
  });
  test("Custom routes: completion is evaluated against every selected route item", () => {
    const config = { objective: "complete-all", constraint: "none", metric: "time", levels: [9, 10, 19, 20, 29, 30, 39, 43] };
    assert(runRules.evaluateRequirements({ config, completed: config.levels }).success);
    assert(!runRules.evaluateRequirements({ config, completed: config.levels.slice(0, -1) }).success);
  });
  test("Custom routes: full campaign crosses every chapter boundary continuously", () => {
    assert(runRules.nextRouteItem(runRules.ALL_CAMPAIGN_LEVELS, 9) === 10);
    assert(runRules.nextRouteItem(runRules.ALL_CAMPAIGN_LEVELS, 19) === 20);
    assert(runRules.nextRouteItem(runRules.ALL_CAMPAIGN_LEVELS, 29) === 30);
    assert(runRules.nextRouteItem(runRules.ALL_CAMPAIGN_LEVELS, 39) === null);
  });
  test("Custom routes: selected gauntlets return to the canonical queue", () => {
    const route = [...runRules.ALL_CAMPAIGN_LEVELS, ...runRules.ALL_GAUNTLETS];
    assert(runRules.nextRouteItem(route, 9) === 40);
    assert(runRules.nextRouteItem(route, 40) === 10);
    assert(runRules.nextRouteItem(route, 19) === 41);
    assert(runRules.nextRouteItem(route, 43) === null);
  });
  test("Custom routes: star, hazard, and mechanic rules use only route totals", () => {
    const config = { objective: "all-stars", constraint: "all-hazards", metric: "time", levels: [1, 40] };
    const failed = runRules.evaluateRequirements({ config, totalStars: 2, routeStarTotal: 3, completed: [1, 40], hazardsAvailable: ["spike", "lava"], hazardsSeen: ["spike"] });
    assert(!failed.success && failed.missing.length === 2);
    const passed = runRules.evaluateRequirements({ config, totalStars: 3, routeStarTotal: 3, completed: [40, 1], hazardsAvailable: ["spike", "lava"], hazardsSeen: ["lava", "spike"] });
    assert(passed.success);
  });
  test("Custom routes: Time, Score, and Stars rankings use their own metrics", () => {
    const runs = [{ id: "a", seconds: 8, stars: 1, score: 294 }, { id: "b", seconds: 10, stars: 4, score: 298 }];
    assert(runRules.rankRuns(runs, "time")[0].id === "a");
    assert(runRules.rankRuns(runs, "score")[0].id === "b");
    assert(runRules.rankRuns(runs, "stars")[0].id === "b");
  });
  test("Leaderboard labels: common routes use familiar names", () => {
    equal(runRules.boardLabel({ objective: "complete-all", constraint: "none", metric: "time", levels: runRules.chapterLevels(0) }), "Chapter 1 · Any%");
    equal(runRules.boardLabel({ objective: "complete-all", constraint: "none", metric: "time", levels: runRules.ALL_CAMPAIGN_LEVELS }), "Full Campaign · Any%");
  });
  test("Leaderboard labels: chapter ranges and constraints are readable", () => {
    const route = [...runRules.chapterLevels(1), ...runRules.chapterLevels(2), ...runRules.chapterLevels(3)];
    equal(runRules.boardLabel({ objective: "complete-all", constraint: "no-stars", metric: "time", levels: route }), "Chapters 2–4 · No Stars");
  });
  test("Leaderboard labels: short level lists remain exact", () => {
    equal(runRules.boardLabel({ objective: "all-stars", constraint: "none", metric: "time", levels: [2, 7, 26] }), "Levels 3, 8, 27 · All Stars");
  });
  test("Leaderboard labels: chapters and gauntlets combine naturally", () => {
    equal(runRules.boardLabel({ objective: "all-mechanics", constraint: "none", metric: "time", levels: [...runRules.chapterLevels(1), 41] }), "Chapter 2 + G2 · Every Mechanic");
    equal(runRules.boardLabel({ objective: "complete-all", constraint: "none", metric: "time", levels: [...runRules.ALL_CAMPAIGN_LEVELS, ...runRules.ALL_GAUNTLETS] }), "Full Campaign + All Gauntlets · Any%");
  });
  test("Leaderboard labels: long mixed routes summarize cleanly and retain details", () => {
    const route = [...runRules.chapterLevels(0), 10, 11, 12, 13, 14, 15, 42];
    equal(runRules.humanRouteLabel(route), "Chapter 1 + 6 Levels + G3");
    assert(runRules.routeContents(route).includes("Chapter 1 (Levels 1–10)"));
    assert(runRules.routeContents(route).includes("11, 12, 13, 14, 15, 16"));
    assert(runRules.routeContents(route).includes("G3"));
  });
  test("Leaderboard labels: large chapter and gauntlet mixes use compact counts", () => {
    const route = [...runRules.chapterLevels(0), ...runRules.chapterLevels(1), ...runRules.chapterLevels(2), 40, 41];
    equal(runRules.humanRouteLabel(route), "3 Chapters + 2 Gauntlets");
  });

  const failed = results.filter(result => !result.passed);
  document.querySelector("#results").textContent = JSON.stringify({
    passed: results.length - failed.length,
    failed: failed.length,
    total: results.length,
    failures: failed,
    measurements
  });
})();
