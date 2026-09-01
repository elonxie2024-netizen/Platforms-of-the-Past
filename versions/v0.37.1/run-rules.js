"use strict";

(() => {
  const CAMPAIGN_LEVEL_COUNT = 40;
  const CHAPTER_SIZE = 10;
  const CHAPTER_COUNT = 4;
  const GAUNTLET_COUNT = 4;
  const MAX_ROUTE_INDEX = CAMPAIGN_LEVEL_COUNT + GAUNTLET_COUNT - 1;
  const OBJECTIVES = Object.freeze(["complete-all", "specific", "all-stars", "all-hazards", "all-mechanics"]);
  const CONSTRAINTS = Object.freeze(["none", "no-stars", "all-stars", "all-hazards", "all-mechanics"]);
  const METRICS = Object.freeze(["time", "score", "stars"]);
  const ALL_CAMPAIGN_LEVELS = Object.freeze(Array.from({ length: CAMPAIGN_LEVEL_COUNT }, (_, index) => index));
  const ALL_GAUNTLETS = Object.freeze(Array.from({ length: GAUNTLET_COUNT }, (_, index) => CAMPAIGN_LEVEL_COUNT + index));

  function chapterLevels(chapterIndex) {
    const chapter = Number(chapterIndex);
    if (!Number.isInteger(chapter) || chapter < 0 || chapter >= CHAPTER_COUNT) return [];
    return Array.from({ length: CHAPTER_SIZE }, (_, offset) => chapter * CHAPTER_SIZE + offset);
  }

  function canonicalOrder(index) {
    return index < CAMPAIGN_LEVEL_COUNT
      ? Math.floor(index / CHAPTER_SIZE) * (CHAPTER_SIZE + 1) + index % CHAPTER_SIZE
      : (index - CAMPAIGN_LEVEL_COUNT) * (CHAPTER_SIZE + 1) + CHAPTER_SIZE;
  }

  function normalizeRoute(route) {
    return [...new Set((Array.isArray(route) ? route : []).map(Number).filter(index =>
      Number.isInteger(index) && index >= 0 && index <= MAX_ROUTE_INDEX
    ))].sort((a, b) => canonicalOrder(a) - canonicalOrder(b));
  }

  function routeToken(index) {
    return index < CAMPAIGN_LEVEL_COUNT ? String(index + 1) : `G${index - CAMPAIGN_LEVEL_COUNT + 1}`;
  }

  function routeIndex(token) {
    const value = String(token || "").toUpperCase();
    if (/^G[1-4]$/.test(value)) return CAMPAIGN_LEVEL_COUNT + Number(value.slice(1)) - 1;
    if (/^(?:[1-9]|[1-3][0-9]|40)$/.test(value)) return Number(value) - 1;
    return null;
  }

  function routeKey(route) {
    const normalized = normalizeRoute(route);
    if (!normalized.length) throw new Error("A run route must contain at least one level or gauntlet.");
    return normalized.map(routeToken).join("-");
  }

  function routeSummary(route) {
    const normalized = normalizeRoute(route);
    const selected = new Set(normalized);
    const allCampaign = ALL_CAMPAIGN_LEVELS.every(index => selected.has(index));
    const allGauntlets = ALL_GAUNTLETS.every(index => selected.has(index));
    if (allCampaign && allGauntlets && normalized.length === 44) return "All campaign levels + all gauntlets";
    if (allCampaign && normalized.length === 40) return "All 40 campaign levels";
    if (allGauntlets && normalized.length === 4) return "All gauntlets";
    const parts = [];
    for (let chapter = 0; chapter < CHAPTER_COUNT; chapter++) {
      const chapterRoute = chapterLevels(chapter);
      if (chapterRoute.every(index => selected.has(index))) parts.push(`Chapter ${chapter + 1}`);
      else chapterRoute.filter(index => selected.has(index)).forEach(index => parts.push(routeToken(index)));
      const gauntlet = CAMPAIGN_LEVEL_COUNT + chapter;
      if (selected.has(gauntlet)) parts.push(routeToken(gauntlet));
    }
    return parts.join(", ") || "No route selected";
  }

  function nextRouteItem(route, currentIndex) {
    const normalized = normalizeRoute(route);
    const position = normalized.indexOf(Number(currentIndex));
    return position >= 0 && position + 1 < normalized.length ? normalized[position + 1] : null;
  }

  function normalizeConfig(config = {}) {
    const objective = OBJECTIVES.includes(config.objective) ? config.objective : "specific";
    const constraint = CONSTRAINTS.includes(config.constraint) ? config.constraint : "none";
    const metric = METRICS.includes(config.metric) ? config.metric : "time";
    const levels = normalizeRoute(config.levels);
    if (!levels.length) throw new Error("A run route must contain at least one level or gauntlet.");
    return { objective, constraint, metric, levels };
  }

  function runTypeId(config) {
    const normalized = normalizeConfig(config);
    return `${normalized.objective}:${routeKey(normalized.levels)}:${normalized.constraint}`;
  }

  function leaderboardIdentity(config) {
    return runTypeId(config);
  }

  function parseRunTypeId(value) {
    if (value === "classic") return { classic: true, id: "classic" };
    const parts = String(value || "").split(":");
    if (parts.length !== 3 || !OBJECTIVES.includes(parts[0]) || !CONSTRAINTS.includes(parts[2])) {
      throw new Error("Unknown custom run identity.");
    }
    const levels = normalizeRoute(parts[1].split("-").map(routeIndex));
    if (!levels.length || parts[1].split("-").some(token => routeIndex(token) === null)) {
      throw new Error("Custom run identity contains an invalid route.");
    }
    return normalizeConfig({ objective: parts[0], constraint: parts[2], metric: "time", levels });
  }

  function parseLeaderboardIdentity(value, fallbackMetric = "time") {
    const text = String(value || "").trim();
    const separator = text.lastIndexOf("@");
    const metric = separator >= 0 ? text.slice(separator + 1) : fallbackMetric;
    if (!METRICS.includes(metric)) throw new Error("Leaderboard identity contains an invalid metric.");
    const routeId = separator >= 0 ? text.slice(0, separator) : text;
    if (routeId === "classic") return { classic: true, id: "classic", metric };
    return { ...parseRunTypeId(routeId), metric };
  }

  function evaluateRequirements({ config, totalStars = 0, routeStarTotal = 0, completed = [], hazardsAvailable = [], hazardsSeen = [], mechanicsAvailable = [], mechanicsUsed = [] } = {}) {
    const normalized = normalizeConfig(config);
    const missing = [];
    const completedSet = new Set(normalizeRoute(completed));
    const seenHazards = new Set(hazardsSeen);
    const usedMechanics = new Set(mechanicsUsed);
    const requiresStars = normalized.objective === "all-stars" || normalized.constraint === "all-stars";
    const requiresHazards = normalized.objective === "all-hazards" || normalized.constraint === "all-hazards";
    const requiresMechanics = normalized.objective === "all-mechanics" || normalized.constraint === "all-mechanics";
    if (normalized.constraint === "no-stars" && Number(totalStars) > 0) missing.push("the no-stars constraint was broken");
    if (requiresStars && Number(totalStars) < Number(routeStarTotal)) missing.push("not every star was collected");
    if (requiresHazards) {
      const unseen = [...hazardsAvailable].filter(hazard => !seenHazards.has(hazard));
      if (unseen.length) missing.push(`${unseen.length} placed ${unseen.length === 1 ? "hazard has" : "hazards have"} not defeated you`);
    }
    if (requiresMechanics) {
      const unused = [...mechanicsAvailable].filter(mechanic => !usedMechanics.has(mechanic));
      if (unused.length) missing.push(`unused mechanics: ${unused.join(", ")}`);
    }
    const incomplete = normalized.levels.filter(index => !completedSet.has(index));
    if (incomplete.length) missing.push(`unfinished route: ${incomplete.map(routeToken).join(", ")}`);
    return { success: missing.length === 0, missing };
  }

  function rankRuns(runs, metric = "time") {
    if (!METRICS.includes(metric)) throw new Error("Unknown leaderboard metric.");
    return (Array.isArray(runs) ? runs : []).map((run, index) => ({ ...run, index })).sort((a, b) => {
      if (metric === "stars") return Number(b.stars) - Number(a.stars) || Number(a.seconds) - Number(b.seconds) || a.index - b.index;
      if (metric === "score") return Number(b.score) - Number(a.score) || Number(a.seconds) - Number(b.seconds) || a.index - b.index;
      return Number(a.seconds) - Number(b.seconds) || Number(b.stars) - Number(a.stars) || a.index - b.index;
    }).map(({ index, ...run }) => run);
  }

  window.PlatformsRunRules = Object.freeze({
    CAMPAIGN_LEVEL_COUNT, CHAPTER_SIZE, CHAPTER_COUNT, GAUNTLET_COUNT,
    OBJECTIVES, CONSTRAINTS, METRICS, ALL_CAMPAIGN_LEVELS, ALL_GAUNTLETS,
    chapterLevels, normalizeRoute, routeToken, routeIndex, routeKey, routeSummary, nextRouteItem,
    normalizeConfig, runTypeId, leaderboardIdentity, parseRunTypeId,
    parseLeaderboardIdentity, evaluateRequirements, rankRuns
  });
})();
