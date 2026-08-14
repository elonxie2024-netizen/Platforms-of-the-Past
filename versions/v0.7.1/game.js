"use strict";

const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
const levelLabel = document.querySelector("#levelLabel");
const timerLabel = document.querySelector("#timerLabel");
const levelTimerLabel = document.querySelector("#levelTimerLabel");
const starLabel = document.querySelector("#starLabel");
const message = document.querySelector("#message");
const scoreSummary = document.querySelector("#scoreSummary");
const gameShell = document.querySelector(".game-shell");
const fullscreenButton = document.querySelector("#fullscreenButton");
const pauseButton = document.querySelector("#pauseButton");
const restartButton = document.querySelector("#restartButton");
const restartRunButton = document.querySelector("#restartRunButton");
const quitButton = document.querySelector("#quitButton");
const victoryQuitButton = document.querySelector("#victoryQuitButton");
const mainMenu = document.querySelector("#mainMenu");
const playButton = document.querySelector("#playButton");
const settingsButton = document.querySelector("#settingsButton");
const settingsPanel = document.querySelector("#settingsPanel");
const volumeInput = document.querySelector("#volumeInput");
const volumeValue = document.querySelector("#volumeValue");
const menuStage = document.querySelector(".menu-stage");
const menuSlime = document.querySelector(".menu-slime");
const mainLeaderboardButton = document.querySelector("#mainLeaderboardButton");
const pauseMenu = document.querySelector("#pauseMenu");
const resumeButton = document.querySelector("#resumeButton");
const pauseRestartLevelButton = document.querySelector("#pauseRestartLevelButton");
const pauseRestartRunButton = document.querySelector("#pauseRestartRunButton");
const pauseLeaderboardButton = document.querySelector("#pauseLeaderboardButton");
const pauseQuitButton = document.querySelector("#pauseQuitButton");
const leaderboardMenu = document.querySelector("#leaderboardMenu");
const leaderboardList = document.querySelector("#leaderboardList");
const closeLeaderboardButton = document.querySelector("#closeLeaderboardButton");
const runNameInput = document.querySelector("#runNameInput");
const publishRunButton = document.querySelector("#publishRunButton");
const publishStatus = document.querySelector("#publishStatus");
const splitList = document.querySelector("#splitList");
const mainChangelogButton = document.querySelector("#mainChangelogButton");
const pauseChangelogButton = document.querySelector("#pauseChangelogButton");
const changelogMenu = document.querySelector("#changelogMenu");
const changelogList = document.querySelector("#changelogList");
const closeChangelogButton = document.querySelector("#closeChangelogButton");
const roadmapMenu = document.querySelector("#roadmapMenu");
const levelRoadmap = document.querySelector("#levelRoadmap");
const closeRoadmapButton = document.querySelector("#closeRoadmapButton");

const CHANGELOG_ENTRIES = [
  { version: "v0.7.1", commit: "Pending commit", date: "2026-08-12", message: "Complete rewind origin cutscene", description: "Completed the cinematic after all seven introductory levels. The slime automatically crosses a short platforming route, enters a time machine instead of a flag, is struck by temporal static, and awakens the power of rewind before the existing results screen appears." },
  { version: "v0.7.0", commit: "232ee51", date: "2026-08-12", message: "Added rewind cutscene", description: "Established the rewind-origin update and its initial ending-cutscene structure." },
  { version: "v0.6.2", commit: "094b908", date: "2026-08-12", message: "Added clickable switches", description: "Turned the nearby E - FLIP prompt into a clickable in-game control while retaining keyboard interaction. The prompt's visible bounds and pointer hit area now stay aligned as it gently bobs above the switch." },
  { version: "v0.6.1", commit: "acfadd2", date: "2026-08-12", message: "Added 2 way switches", description: "Changed switches into two-way controls. A nearby lever can be flipped in either direction, causing its linked platform to move smoothly between its raised destination and submerged starting position." },
  { version: "v0.6.0", commit: "8f4c9a0", date: "2026-08-12", message: "Added 7th level with switches", description: "Added the seventh and final introductory level. Nearby levers display an E interaction prompt and move their linked platforms into place when flipped, creating a route that must be assembled before it can be crossed." },
  { version: "v0.5.2", commit: "0ab1735", date: "2026-08-12", message: "Added roadmap for levels", description: "Changed Play to open a connected level roadmap instead of immediately starting level 1. Completed levels and the next challenge are blue and selectable, future levels are gray and locked, and progression persists in the browser." },
  { version: "v0.5.1", commit: "d5edda3", date: "2026-08-11", message: "Revamped cracked block texture", description: "Replaced the colored symbol blocks with nine-sliced rectangles made from the original grass, stone, and crate assets. Breakable variants now share an unmistakable cracked appearance and burst into material-specific dirt, pebble, or woodchip debris." },
  { version: "v0.5.0", commit: "ce40cef", date: "2026-08-11", message: "Breakable blocks added in 6th level", description: "Added a sixth level introducing three floating block types: delayed crumble blocks that break after being stood on, impact blocks that break after a jump landing, and permanent floating blocks that never break. Breakable blocks warn the player before disappearing and reset after death or restart." },
  { version: "v0.4.6", commit: "ccf56e7", date: "2026-08-11", message: "Fixed terrain 2", description: "Rebuilt the lower grass and stone layers as left-side, tiled-middle, and right-side columns. The pillar sides now line up with the top layer instead of allowing the center texture to extend past its edges." },
  { version: "v0.4.5", commit: "cf4936d", date: "2026-08-11", message: "Connected obstacle textures", description: "Changed grass and stone platforms to use outer edge slices only at the ends of each obstacle. Their center texture now fills the space between those edges without repeating rounded block borders or leaving tiny gaps." },
  { version: "v0.4.4", commit: "753c74a", date: "2026-08-11", message: "Fixed pushable crates level", description: "Raised both walls in level 5 and moved their crates farther away. An untouched crate can no longer launch the player across either wall, while pushing each crate into place creates a reliable route upward." },
  { version: "v0.4.3", commit: "270a3f4", date: "2026-08-11", message: "Added pushable crates in 5th level", description: "Added a fifth compact level built around two pushable crates. Crates move when the slime presses into either side, stop against solid terrain or other crates, support the player's weight, and reset with the level; pulling is not available." },
  { version: "v0.4.2", commit: "0bfb27c", date: "2026-08-11", message: "Buffed jump pad strength", description: "Increased the level 3 jump pad's launch force and prevented manual short-hop gravity from cutting pad launches short. The first springboard now comfortably clears the elevated platform without a perfectly timed manual jump." },
  { version: "v0.4.1", commit: "e2c2041", date: "2026-08-11", message: "Modified restart level", description: "Changed Restart so it begins the current level timer again from zero while preserving the full run timer. Completed splits now represent only the successful attempt after the most recent level restart." },
  { version: "v0.4.0", commit: "fd83beb", date: "2026-08-11", message: "Added first mechanics", description: "Replaced the ten long stages with four compact levels that introduce grass, dirt, stone, crates, lava, and mechanical surfaces. Added a powerful jump pad in level 3 and automatically cycling horizontal and vertical moving platforms in level 4." },
  { version: "v0.3.2", commit: "6756a1a", date: "2026-08-10", message: "Added changelog", description: "Added a complete, scrollable development history based on every Git commit. The changelog can be opened from both the main menu and pause menu." },
  { version: "v0.3.1", commit: "ee5ba4d", date: "2026-08-10", message: "Added level splits", description: "Added separate run and level timers. Level times persist through level restarts, pause with the run, and appear as a ten-level split summary after victory." },
  { version: "v0.3.0", commit: "5854624", date: "2026-08-10", message: "Pause + leaderboard overhaul", description: "Added a pause menu with resume, restart, quit, and leaderboard actions while freezing the timer. Added named run publishing and a score-sorted local leaderboard stored in the browser." },
  { version: "v0.2.4", commit: "c53fa4b", date: "2026-08-10", message: "Added second restart button", description: "Added Restart run beside the level restart control. The new T shortcut returns to level 1 and resets the timer, stars, and deaths." },
  { version: "v0.2.3", commit: "dbd5ffc", date: "2026-08-10", message: "Added timer+score", description: "Introduced a speedrun timer that starts on the first movement or jump and persists across all levels. Added the final score formula of 300 minus elapsed seconds plus two points per star." },
  { version: "v0.2.2", commit: "6c9e210", date: "2026-08-10", message: "Updated t extures again", description: "Replaced mismatched generated pillar fills with center crops tiled directly from the original dirt and stone assets. This made pillar colors and texture style continuous with their tops." },
  { version: "v0.2.1", commit: "86cd4dd", date: "2026-08-10", message: "Updated textures", description: "Added the first textured extensions beneath grass and stone platforms, including shaded dirt and masonry detail instead of completely flat pillar colors." },
  { version: "v0.2.0", commit: "bd5df68", date: "2026-08-10", message: "Overhauled content", description: "Expanded the adventure from three levels to ten with seven longer and harder stages. Introduced animated lava, volcanic scenery, tougher elevation changes, and more demanding star routes." },
  { version: "v0.1.4", commit: "ab1bee1", date: "2026-08-10", message: "Add quit button", description: "Added controls for abandoning an active run and returning to the main menu. The victory screen also gained a quit option alongside playing again." },
  { version: "v0.1.3", commit: "5425772", date: "2026-08-10", message: "Revamped audio", description: "Reworked movement audio so landings, rather than jumps, produce feedback. Grass received a soft landing sound while stone uses a harder clack." },
  { version: "v0.1.2", commit: "292ed94", date: "2026-08-10", message: "Added audio", description: "Added procedural music for the main menu and levels, plus sound effects for jumping, dying, collecting stars, and reaching flags. Connected the volume setting to the new audio system." },
  { version: "v0.1.1", commit: "67286c2", date: "2026-08-10", message: "Updated animation", description: "Rebuilt the main-menu slime animation to follow a physics-like jumping arc between the two platforms, with landing squash and airborne stretch matching gameplay more closely." },
  { version: "v0.1.0", commit: "38f5931", date: "2026-08-10", message: "Add main menu", description: "Introduced the main menu with horizontal Play and Settings controls, a volume setting, version display, and an endlessly bouncing slime scene between two platforms." },
  { version: "v0.0.13", commit: "09d767c", date: "2026-08-10", message: "Added spike animation", description: "Added a brief, understated spike-death sequence that freezes the player and breaks the green slime into small pieces before restarting." },
  { version: "v0.0.12", commit: "84da34a", date: "2026-08-10", message: "Changed fullscreen icon", description: "Replaced the fullscreen text control with the classic four-corner expand and collapse icons. Repositioned the level name so it no longer overlaps the corner control." },
  { version: "v0.0.11", commit: "ef9755b", date: "2026-08-10", message: "Changed player asset", description: "Changed the player from a tall, ghost-like shape into a squat rounded-square slime while retaining its simple green face and squash animation." },
  { version: "v0.0.10", commit: "8864938", date: "2026-08-10", message: "Added full screen mode", description: "Added a fullscreen control for expanding the game shell and responsive fullscreen layout styling for a larger play area." },
  { version: "Early development", commit: "a5acbda", date: "2026-08-10", message: "Remove standalone version display", description: "Removed the temporary in-game v0.0.5 badge and returned the script cache key to a simple revision number while the versioning policy was being settled." },
  { version: "Early development", commit: "66d7d3a", date: "2026-08-10", message: "Remove standalone version display", description: "Temporarily restored the v0.0.5 badge, README version, and matching script cache version during the back-and-forth over where versions should appear." },
  { version: "Early development", commit: "9599d67", date: "2026-08-10", message: "Changed version number policy", description: "Removed the standalone v0.0.5 badge and README version entry, and changed the script cache key while the project adopted a commit-based versioning policy." },
  { version: "v0.0.5", commit: "07afbba", date: "2026-08-10", message: "Update README with game link", description: "Added the public GitHub Pages play link to the README so the browser game could be launched directly from the project page." },
  { version: "v0.0.5", commit: "4f30474", date: "2026-08-10", message: "Created version numbers starting at 0.0.5", description: "Established semantic-style vX.Y.Z numbering at v0.0.5 and displayed that version in the README, game interface, and cache-busted script URL." },
  { version: "Prototype", commit: "6de6735", date: "2026-08-10", message: "Make opening jump easier and refresh slime player", description: "Adjusted the opening layout so the first jump was reachable and refined the green slime player presentation after the initial character pass." },
  { version: "Prototype", commit: "6024a78", date: "2026-08-10", message: "Balanced jump height + changed player asset + renamed website name", description: "Raised jump strength slightly, changed the player into a cute generic green slime, and renamed the game heading from Skybound Steps to Platforms of the Past." },
  { version: "Prototype", commit: "9b62c40", date: "2026-08-10", message: "Created README.md", description: "Created the project README with the game concept, controls, current prototype features, planned time-travel mechanic, and credits." },
  { version: "Initial commit", commit: "d914b1e", date: "2026-08-09", message: "Made base platformer", description: "Created the original browser platformer, including HTML and styling, movement and jumping physics, platforms, hazards, stars, flags, three levels, and the first sprite atlas." }
];

const VIEW_W = canvas.width;
const VIEW_H = canvas.height;
const PLAYER_W = 30;
const PLAYER_H = 42;
const STEP = 1 / 120;
const GRAVITY = 1900;
const RUN_SPEED = 285;
const GROUND_ACCEL = 2400;
const AIR_ACCEL = 1450;
const FRICTION = 2600;
const JUMP_SPEED = 720;
const JUMP_PAD_SPEED = 1120;
const COYOTE_TIME = 0.1;
const JUMP_BUFFER = 0.12;
const DEATH_DURATION = 0.42;
const CUTSCENE_DURATION = 10.4;

const R = (x, y, w, h, kind = "grass") => ({ x, y, w, h, kind });
const P = (x, y, w = 60, h = 60) => ({ x, y, w, h, kind: "crate", pushable: true, baseX: x, baseY: y });
const B = (x, y, trigger, material = "stone", w = 110, h = 54) => ({
  x, y, w, h, kind: "breakable-block", material,
  breakable: true, breakTrigger: trigger, broken: false, breakTimer: null
});
const F = (x, y, material = "stone", w = 110, h = 54) => ({ x, y, w, h, kind: "floating-block", material });
const M = (x, y, w, h, axis, range, speed, phase = 0, kind = "stone") => ({
  x, y, w, h, kind, moving: true, axis, range, speed, phase, baseX: x, baseY: y
});
const C = (x, y, targetX, targetY, switchId, w = 140, h = 40, kind = "stone") => ({
  x, y, w, h, kind, controlled: true, switchId, targetX, targetY, baseX: x, baseY: y, moveProgress: 0
});
const S = (x, y, id) => ({ x, y, w: 42, h: 44, id, flipped: false });
const levels = [
  {
    name: "Dirtbound Trail", width: 1260, start: [70, 430], music: "level1",
    platforms: [R(0,490,330,80), R(400,445,190,125), R(660,390,170,180), R(900,450,180,120), R(1150,480,110,90), R(185,410,70,40,"crate")],
    hazards: [R(330,472,70,18), R(590,472,70,18), R(830,472,70,18), R(1080,472,70,18)],
    stars: [[220,365],[495,400],[745,345],[990,405]], finish: R(1190,390,34,90)
  },
  {
    name: "Stonework Steps", width: 1320, start: [55, 430], music: "level2",
    platforms: [R(0,490,260,80,"stone"), R(330,430,180,140,"stone"), R(580,360,160,210,"stone"), R(820,440,190,130,"stone"), R(1090,390,230,180,"stone"), R(905,376,64,64,"crate")],
    hazards: [R(260,472,70,18), R(510,472,70,18), R(740,472,80,18), R(1010,472,80,18)],
    stars: [[420,385],[655,315],[910,330],[1180,345]], finish: R(1235,300,34,90)
  },
  {
    name: "Springboard Rise", width: 1380, start: [55, 430], music: "level3",
    platforms: [R(0,490,450,80), R(525,300,180,270,"stone"), R(760,390,180,180), R(1020,330,180,240,"stone"), R(1260,460,120,110), R(610,242,62,58,"crate")],
    jumpPads: [R(360,470,60,20,"jump-pad")],
    hazards: [R(450,472,75,18), R(705,472,55,18), R(940,472,80,18), R(1200,472,60,18)],
    stars: [[390,410],[610,235],[850,345],[1110,285],[1310,415]], finish: R(1300,370,34,90)
  },
  {
    name: "Clockwork Crossing", width: 1500, start: [55, 430], music: "level2", theme: "lava",
    platforms: [R(0,490,300,80,"stone"), M(350,430,150,40,"x",65,1.15,0,"stone"), R(570,380,170,190,"stone"), M(790,420,150,40,"y",70,1.3,-Math.PI / 2,"stone"), R(1000,330,170,240,"stone"), M(1210,410,140,40,"x",45,1.45,Math.PI,"stone"), R(1380,450,120,120,"stone")],
    hazards: [R(300,490,270,80,"lava"), R(740,490,260,80,"lava"), R(1170,490,210,80,"lava")],
    stars: [[420,365],[655,325],[855,335],[1085,285],[1275,345]], finish: R(1415,360,34,90)
  },
  {
    name: "Crateyard Climb", width: 1500, start: [55, 430], music: "level1",
    platforms: [R(0,490,720,80), R(720,310,90,260,"stone"), R(880,430,190,140), R(1130,250,180,320,"stone"), R(1370,390,130,180), P(450,430), P(900,370)],
    hazards: [R(810,472,70,18), R(1070,472,60,18), R(1310,472,60,18)],
    stars: [[505,385],[765,265],[970,325],[1215,205],[1425,345]], finish: R(1415,300,34,90)
  },
  {
    name: "Fracture Falls", width: 1500, start: [55, 430], music: "level3", theme: "lava",
    platforms: [R(0,490,260,80,"stone"), F(320,430,"grass"), B(500,390,"stand","grass"), F(680,350,"stone"), B(860,420,"impact","stone"), F(1040,360,"crate"), B(1220,420,"stand","crate"), R(1380,450,120,120,"stone")],
    hazards: [R(260,490,1120,80,"lava")],
    stars: [[375,385],[555,345],[735,305],[915,375],[1095,315],[1275,375],[1435,405]], finish: R(1415,360,34,90)
  },
  {
    name: "Switchback Summit", width: 1500, start: [55,430], music: "level2",
    platforms: [R(0,490,320,80,"stone"), C(410,520,440,380,"bridge-a",140,40,"stone"), R(640,420,180,150,"stone"), C(900,520,920,345,"bridge-b",145,40,"grass"), R(1160,390,170,180,"stone"), R(1380,450,120,120,"stone")],
    switches: [S(250,446,"bridge-a"), S(740,376,"bridge-b")],
    hazards: [R(320,490,320,80,"lava"), R(820,490,340,80,"lava"), R(1330,490,50,80,"lava")],
    stars: [[285,400],[510,330],[735,330],[1035,285],[1245,345],[1435,405]], finish: R(1415,360,34,90)
  }
];

const MUSIC_TRACKS = {
  menu: {
    tempo: 92, wave: "triangle", gain: .11,
    melody: [72, null, 76, null, 79, null, 76, null, 74, null, 77, null, 81, null, 77, null],
    bass: [48, null, null, null, 55, null, null, null, 50, null, null, null, 55, null, null, null]
  },
  level1: {
    tempo: 112, wave: "triangle", gain: .1,
    melody: [64, 67, 71, 72, 71, 67, 64, null, 67, 71, 74, 76, 74, 71, 67, null],
    bass: [48, null, 55, null, 52, null, 55, null, 48, null, 55, null, 52, null, 55, null]
  },
  level2: {
    tempo: 94, wave: "sawtooth", gain: .065,
    melody: [57, null, 60, 64, 62, null, 60, null, 55, null, 59, 62, 60, null, 57, null],
    bass: [45, null, null, null, 40, null, null, null, 43, null, null, null, 40, null, null, null]
  },
  level3: {
    tempo: 124, wave: "sine", gain: .12,
    melody: [76, 79, 83, 86, 83, 79, 78, 81, 84, 88, 84, 81, 79, 83, 86, 91],
    bass: [52, null, 59, null, 55, null, 59, null, 52, null, 59, null, 55, null, 59, null]
  }
};

const input = { left: false, right: false, jump: false };
const pressed = { jump: false };
const player = { x: 0, y: 0, vx: 0, vy: 0, grounded: false, facing: 1, coyote: 0, jumpBuffer: 0, padLaunched: false };
let levelIndex = 0;
let collected = [];
let totalStars = 0;
let deaths = 0;
let cameraX = 0;
let accumulator = 0;
let lastTime = performance.now();
let won = false;
let levelTransition = 0;
let levelMotionTime = 0;
let deathTimer = 0;
let deathParticles = [];
let blockDebris = [];
let gameStarted = false;
let cutsceneActive = false;
let cutsceneTime = 0;
let cutsceneZapPlayed = false;
let cutscenePowerPlayed = false;
let runStartedAt = 0;
let runElapsed = 0;
let timerRunning = false;
let levelStartedAt = 0;
let levelElapsed = 0;
let levelTimerRunning = false;
let levelSplits = [];
let runStartLevel = 0;
let paused = false;
let timerWasRunningBeforePause = false;
let levelTimerWasRunningBeforePause = false;
let leaderboardReturn = "main";
let changelogReturn = "main";
let finishedRun = null;
let runPublished = false;
const LEADERBOARD_STORAGE_KEY = "platforms-past-leaderboard-v1";
const PROGRESS_STORAGE_KEY = "platforms-past-progress-v1";
let highestUnlockedLevel = loadUnlockedLevel();
let leaderboardEntries = loadLeaderboardEntries();
let masterVolume = 1;
let audioContext = null;
let masterGain = null;
let musicGain = null;
let sfxGain = null;
let musicTimer = null;
let currentTrack = "menu";
let musicStep = 0;
let nextMusicNoteTime = 0;
let developmentSequencePosition = 0;
const activeMusicVoices = new Set();

const spriteSheet = new Image();
let spritesReady = false;
spriteSheet.addEventListener("load", () => { spritesReady = true; });
spriteSheet.src = "../../assets/platformer-assets.png";

function currentLevel() { return levels[levelIndex]; }
function overlaps(a, b) { return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y; }
function playerBox() { return { x: player.x, y: player.y, w: PLAYER_W, h: PLAYER_H }; }

function resetPlayer(countDeath = false) {
  if (countDeath) deaths++;
  resetBreakablePlatforms();
  deathTimer = 0;
  deathParticles = [];
  const [x, y] = currentLevel().start;
  Object.assign(player, { x, y, vx: 0, vy: 0, grounded: false, coyote: 0, jumpBuffer: 0, padLaunched: false });
  cameraX = Math.max(0, x - VIEW_W * .3);
}

function resetBreakablePlatforms() {
  blockDebris = [];
  for (const platform of currentLevel().platforms) {
    if (!platform.breakable) continue;
    platform.broken = false;
    platform.breakTimer = null;
  }
}

function startSpikeDeath() {
  deaths++;
  playSfx("death");
  deathTimer = DEATH_DURATION;
  pressed.jump = false;
  const x = player.x + PLAYER_W / 2;
  const y = player.y + PLAYER_H / 2;
  deathParticles = Array.from({ length: 7 }, (_, index) => {
    const angle = index / 7 * Math.PI * 2;
    const speed = 65 + index % 3 * 18;
    return {
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 75,
      size: 4 + index % 2 * 2,
      rotation: index * .7,
      spin: (index % 2 ? -1 : 1) * (3 + index * .3)
    };
  });
}

function resetLevelMotion() {
  levelMotionTime = 0;
  for (const levelSwitch of currentLevel().switches || []) levelSwitch.flipped = false;
  for (const platform of currentLevel().platforms) {
    if (platform.pushable) {
      platform.x = platform.baseX;
      platform.y = platform.baseY;
    }
    if (platform.controlled) {
      platform.x = platform.baseX;
      platform.y = platform.baseY;
      platform.moveProgress = 0;
    }
    if (!platform.moving) continue;
    const offset = Math.sin(platform.phase) * platform.range;
    platform.x = platform.baseX + (platform.axis === "x" ? offset : 0);
    platform.y = platform.baseY + (platform.axis === "y" ? offset : 0);
  }
}

function movePlatformWithPlayer(platform, nextX, nextY) {
  const oldX = platform.x;
  const oldY = platform.y;
  const wasStanding = player.grounded &&
    Math.abs(player.y + PLAYER_H - oldY) < 3 &&
    player.x + PLAYER_W > oldX && player.x < oldX + platform.w;
  platform.x = nextX;
  platform.y = nextY;
  if (wasStanding) {
    player.x += platform.x - oldX;
    player.y += platform.y - oldY;
  }
}

function updateMovingPlatforms(dt) {
  levelMotionTime += dt;
  for (const platform of currentLevel().platforms) {
    if (platform.controlled) {
      const linkedSwitch = currentLevel().switches?.find((candidate) => candidate.id === platform.switchId);
      const targetProgress = linkedSwitch?.flipped ? 1 : 0;
      if (platform.moveProgress === targetProgress) continue;
      platform.moveProgress = Math.max(0, Math.min(1,
        platform.moveProgress + Math.sign(targetProgress - platform.moveProgress) * dt / 1.15
      ));
      const eased = platform.moveProgress * platform.moveProgress * (3 - 2 * platform.moveProgress);
      movePlatformWithPlayer(
        platform,
        platform.baseX + (platform.targetX - platform.baseX) * eased,
        platform.baseY + (platform.targetY - platform.baseY) * eased
      );
      continue;
    }
    if (!platform.moving) continue;
    const offset = Math.sin(levelMotionTime * platform.speed + platform.phase) * platform.range;
    movePlatformWithPlayer(
      platform,
      platform.baseX + (platform.axis === "x" ? offset : 0),
      platform.baseY + (platform.axis === "y" ? offset : 0)
    );
  }
}

function loadLevel(index, keepScore = true) {
  levelIndex = index;
  collected = currentLevel().stars.map(() => false);
  if (!keepScore) { totalStars = 0; deaths = 0; }
  levelTransition = 0;
  won = false;
  message.hidden = true;
  resetLevelMotion();
  resetPlayer(false);
  if (timerRunning && gameStarted) beginLevelTimer();
  else resetLevelTimer();
  updateHud();
  if (gameStarted) startMusic(currentLevel().music || `level${index + 1}`);
}

function restartLevel() {
  const gained = collected.filter(Boolean).length;
  totalStars = Math.max(0, totalStars - gained);
  collected.fill(false);
  resetLevelMotion();
  resetPlayer(true);
  beginLevelTimer();
  updateHud();
}

function updateHud() {
  levelLabel.textContent = `Level ${levelIndex + 1} / ${levels.length} — ${currentLevel().name}`;
  starLabel.textContent = `Stars ${collected.filter(Boolean).length} / ${collected.length}`;
}

function currentRunTime() {
  return timerRunning ? (performance.now() - runStartedAt) / 1000 : runElapsed;
}

function currentLevelTime() {
  return levelTimerRunning ? (performance.now() - levelStartedAt) / 1000 : levelElapsed;
}

function formatRunTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainder = (seconds % 60).toFixed(1).padStart(4, "0");
  return `${minutes}:${remainder}`;
}

function updateTimerHud() {
  timerLabel.textContent = `Run ${formatRunTime(currentRunTime())}`;
  levelTimerLabel.textContent = `Level ${formatRunTime(currentLevelTime())}`;
}

function startRunTimer() {
  if (timerRunning || paused || won || !gameStarted) return;
  runStartedAt = performance.now() - runElapsed * 1000;
  timerRunning = true;
  if (!levelTimerRunning) {
    levelStartedAt = performance.now() - levelElapsed * 1000;
    levelTimerRunning = true;
  }
}

function finishRunTimer() {
  runElapsed = currentRunTime();
  timerRunning = false;
  updateTimerHud();
}

function finishLevelTimer() {
  levelElapsed = currentLevelTime();
  levelTimerRunning = false;
  updateTimerHud();
}

function beginLevelTimer() {
  levelElapsed = 0;
  levelStartedAt = performance.now();
  levelTimerRunning = timerRunning && !paused;
  updateTimerHud();
}

function resetLevelTimer() {
  levelStartedAt = 0;
  levelElapsed = 0;
  levelTimerRunning = false;
}

function resetRunTimer() {
  runStartedAt = 0;
  runElapsed = 0;
  timerRunning = false;
  resetLevelTimer();
  updateTimerHud();
}

function completeLevelSplit() {
  finishLevelTimer();
  levelSplits[levelIndex] = Math.round(levelElapsed * 10) / 10;
}

function renderSplitSummary() {
  splitList.replaceChildren();
  levels.forEach((level, index) => {
    const item = document.createElement("li");
    const name = document.createElement("span");
    name.textContent = `${index + 1}. ${level.name}`;
    const time = document.createElement("strong");
    time.textContent = formatRunTime(levelSplits[index] || 0);
    item.append(name, time);
    splitList.append(item);
  });
}

function loadLeaderboardEntries() {
  try {
    const saved = JSON.parse(localStorage.getItem(LEADERBOARD_STORAGE_KEY) || "[]");
    if (!Array.isArray(saved)) return [];
    return saved.filter((entry) =>
      entry && typeof entry.name === "string" &&
      Number.isFinite(entry.score) && Number.isFinite(entry.seconds) && Number.isFinite(entry.stars)
    );
  } catch {
    return [];
  }
}

function saveLeaderboardEntries() {
  try {
    localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(leaderboardEntries));
    return true;
  } catch {
    return false;
  }
}

function loadUnlockedLevel() {
  try {
    const rawProgress = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (rawProgress === null) {
      const oldRuns = JSON.parse(localStorage.getItem(LEADERBOARD_STORAGE_KEY) || "[]");
      if (Array.isArray(oldRuns) && oldRuns.length > 0) return levels.length - 1;
    }
    const saved = Number(rawProgress);
    return Number.isInteger(saved) ? Math.max(0, Math.min(levels.length - 1, saved)) : 0;
  } catch {
    return 0;
  }
}

function unlockThrough(index) {
  const unlocked = Math.max(0, Math.min(levels.length - 1, index));
  if (unlocked <= highestUnlockedLevel) return;
  highestUnlockedLevel = unlocked;
  try { localStorage.setItem(PROGRESS_STORAGE_KEY, String(highestUnlockedLevel)); } catch { /* Progress remains available for this session. */ }
}

const ROADMAP_POINTS = [
  [8, 70], [22, 35], [36, 68], [50, 30], [64, 66], [78, 34], [92, 65]
];

function renderRoadmap() {
  levelRoadmap.replaceChildren();
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("roadmap-lines");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("preserveAspectRatio", "none");
  svg.setAttribute("aria-hidden", "true");
  for (let index = 0; index < levels.length - 1; index++) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    line.setAttribute("points", `${ROADMAP_POINTS[index].join(",")} ${ROADMAP_POINTS[index + 1].join(",")}`);
    if (index < highestUnlockedLevel) line.classList.add("unlocked");
    svg.append(line);
  }
  levelRoadmap.append(svg);

  levels.forEach((level, index) => {
    const node = document.createElement("div");
    const locked = index > highestUnlockedLevel;
    node.className = `roadmap-level${locked ? " locked" : ""}`;
    node.style.left = `${ROADMAP_POINTS[index][0]}%`;
    node.style.top = `${ROADMAP_POINTS[index][1]}%`;
    const button = document.createElement("button");
    button.type = "button";
    button.disabled = locked;
    button.setAttribute("aria-label", locked ? `Level ${index + 1}, locked` : `Play level ${index + 1}: ${level.name}`);
    if (locked) {
      button.innerHTML = '<svg class="roadmap-lock" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10V7a5 5 0 0 1 10 0v3h1.5A1.5 1.5 0 0 1 20 11.5v8A1.5 1.5 0 0 1 18.5 21h-13A1.5 1.5 0 0 1 4 19.5v-8A1.5 1.5 0 0 1 5.5 10H7Zm3 0h4V7a2 2 0 1 0-4 0v3Z"/></svg>';
    } else {
      button.textContent = String(index + 1);
      button.addEventListener("click", () => startRoadmapRun(index));
    }
    const name = document.createElement("span");
    name.className = "level-name";
    name.textContent = locked ? `Level ${index + 1}` : level.name;
    node.append(button, name);
    levelRoadmap.append(node);
  });
}

function openRoadmap() {
  gameStarted = false;
  settingsPanel.hidden = true;
  settingsButton.setAttribute("aria-expanded", "false");
  mainMenu.hidden = true;
  renderRoadmap();
  roadmapMenu.hidden = false;
  levelRoadmap.querySelector("button:not(:disabled)")?.focus();
}

function closeRoadmap() {
  roadmapMenu.hidden = true;
  mainMenu.hidden = false;
  playButton.focus();
}

function startRoadmapRun(index) {
  resetCutscene();
  runStartLevel = index;
  gameStarted = true;
  paused = false;
  timerWasRunningBeforePause = false;
  levelTimerWasRunningBeforePause = false;
  levelSplits = [];
  resetRunTimer();
  resetFinishedRun();
  loadLevel(index, false);
  ensureAudio();
  roadmapMenu.hidden = true;
  leaderboardMenu.hidden = true;
  changelogMenu.hidden = true;
  pauseButton.disabled = false;
  restartButton.disabled = false;
  restartRunButton.disabled = false;
  quitButton.disabled = false;
  canvas.focus();
}

function renderLeaderboard() {
  leaderboardList.replaceChildren();
  if (leaderboardEntries.length === 0) {
    const empty = document.createElement("li");
    empty.className = "leaderboard-empty";
    empty.textContent = "No published runs yet.";
    leaderboardList.append(empty);
    return;
  }

  leaderboardEntries.forEach((entry, index) => {
    const item = document.createElement("li");
    item.className = "leaderboard-entry";
    const rank = document.createElement("span");
    rank.className = "leaderboard-rank";
    rank.textContent = `#${index + 1}`;
    const name = document.createElement("span");
    name.className = "leaderboard-name";
    name.textContent = entry.name;
    const details = document.createElement("small");
    details.className = "leaderboard-details";
    details.textContent = `${formatRunTime(entry.seconds)} · ${entry.stars} ${entry.stars === 1 ? "star" : "stars"}`;
    name.append(details);
    const score = document.createElement("span");
    score.className = "leaderboard-result";
    score.textContent = String(entry.score);
    item.append(rank, name, score);
    leaderboardList.append(item);
  });
}

function openLeaderboard(source) {
  leaderboardReturn = source;
  renderLeaderboard();
  if (source === "pause") pauseMenu.hidden = true;
  else {
    settingsPanel.hidden = true;
    settingsButton.setAttribute("aria-expanded", "false");
    mainMenu.hidden = true;
  }
  leaderboardMenu.hidden = false;
  closeLeaderboardButton.focus();
}

function closeLeaderboard() {
  leaderboardMenu.hidden = true;
  if (leaderboardReturn === "pause") {
    pauseMenu.hidden = false;
    pauseLeaderboardButton.focus();
  } else {
    mainMenu.hidden = false;
    mainLeaderboardButton.focus();
  }
}

function renderChangelog() {
  changelogList.replaceChildren();
  CHANGELOG_ENTRIES.forEach((entry) => {
    const article = document.createElement("article");
    article.className = "changelog-entry";
    const heading = document.createElement("div");
    heading.className = "changelog-heading";
    const version = document.createElement("span");
    version.className = "changelog-version";
    version.textContent = entry.version;
    const commit = document.createElement("code");
    commit.textContent = entry.commit;
    heading.append(version, commit);
    const title = document.createElement("h3");
    title.textContent = entry.message;
    const description = document.createElement("p");
    description.textContent = entry.description;
    const date = document.createElement("time");
    date.dateTime = entry.date;
    date.textContent = entry.date;
    article.append(heading, title, description, date);
    changelogList.append(article);
  });
}

function openChangelog(source) {
  changelogReturn = source;
  renderChangelog();
  if (source === "pause") pauseMenu.hidden = true;
  else {
    settingsPanel.hidden = true;
    settingsButton.setAttribute("aria-expanded", "false");
    mainMenu.hidden = true;
  }
  changelogMenu.hidden = false;
  closeChangelogButton.focus();
}

function closeChangelog() {
  changelogMenu.hidden = true;
  if (changelogReturn === "pause") {
    pauseMenu.hidden = false;
    pauseChangelogButton.focus();
  } else {
    mainMenu.hidden = false;
    mainChangelogButton.focus();
  }
}

function updatePauseButton() {
  pauseButton.childNodes[0].textContent = paused ? "Resume " : "Pause ";
  pauseButton.setAttribute("aria-label", paused ? "Resume the game" : "Pause the game");
}

function setPaused(shouldPause) {
  if (!gameStarted || won || cutsceneActive || paused === shouldPause) return;
  if (shouldPause) {
    timerWasRunningBeforePause = timerRunning;
    levelTimerWasRunningBeforePause = levelTimerRunning;
    if (timerRunning) {
      finishRunTimer();
      if (levelTimerRunning) finishLevelTimer();
    }
    paused = true;
    Object.assign(input, { left: false, right: false, jump: false });
    pressed.jump = false;
    pauseMenu.hidden = false;
    restartButton.disabled = true;
    restartRunButton.disabled = true;
    quitButton.disabled = true;
    resumeButton.focus();
  } else {
    paused = false;
    pauseMenu.hidden = true;
    leaderboardMenu.hidden = true;
    changelogMenu.hidden = true;
    restartButton.disabled = false;
    restartRunButton.disabled = false;
    quitButton.disabled = false;
    if (timerWasRunningBeforePause) {
      runStartedAt = performance.now() - runElapsed * 1000;
      timerRunning = true;
    }
    if (levelTimerWasRunningBeforePause) {
      levelStartedAt = performance.now() - levelElapsed * 1000;
      levelTimerRunning = true;
    }
    timerWasRunningBeforePause = false;
    levelTimerWasRunningBeforePause = false;
    updateTimerHud();
    canvas.focus();
  }
  updatePauseButton();
}

function publishFinishedRun() {
  if (!finishedRun || runPublished) return;
  const name = runNameInput.value.trim().slice(0, 24);
  if (!name) {
    publishStatus.textContent = "Enter a run name first.";
    runNameInput.focus();
    return;
  }
  leaderboardEntries.push({ name, ...finishedRun, publishedAt: Date.now() });
  leaderboardEntries.sort((a, b) => b.score - a.score || a.seconds - b.seconds);
  leaderboardEntries = leaderboardEntries.slice(0, 50);
  const saved = saveLeaderboardEntries();
  runPublished = true;
  publishRunButton.disabled = true;
  runNameInput.disabled = true;
  publishStatus.textContent = saved ? "Run published to the local leaderboard." : "Run published for this session.";
}

function resetFinishedRun() {
  finishedRun = null;
  runPublished = false;
  runNameInput.value = "";
  runNameInput.disabled = false;
  publishRunButton.disabled = false;
  publishStatus.textContent = "";
  splitList.replaceChildren();
}

function resetCutscene() {
  gameShell.classList.remove("cutscene-playing");
  cutsceneActive = false;
  cutsceneTime = 0;
  cutsceneZapPlayed = false;
  cutscenePowerPlayed = false;
}

function prepareAdventureResults() {
  const seconds = Math.round(runElapsed * 10) / 10;
  const timeScore = Math.round((300 - seconds) * 10) / 10;
  const starBonus = totalStars * 2;
  const finalScore = Math.round((timeScore + starBonus) * 10) / 10;
  scoreSummary.textContent = `Time ${formatRunTime(seconds)} · ${totalStars} stars (+${starBonus}) · Final score ${finalScore}`;
  finishedRun = { seconds, stars: totalStars, score: finalScore, splits: [...levelSplits] };
  runPublished = false;
  runNameInput.value = "";
  runNameInput.disabled = false;
  publishRunButton.disabled = false;
  publishStatus.textContent = "";
  renderSplitSummary();
}

function showAdventureComplete() {
  gameShell.classList.remove("cutscene-playing");
  cutsceneActive = false;
  won = true;
  message.hidden = false;
  runNameInput.focus();
}

function startRewindCutscene() {
  finishRunTimer();
  prepareAdventureResults();
  resetCutscene();
  cutsceneActive = true;
  gameShell.classList.add("cutscene-playing");
  message.hidden = true;
  pauseButton.disabled = true;
  restartButton.disabled = true;
  restartRunButton.disabled = true;
  quitButton.disabled = true;
  Object.assign(input, { left: false, right: false, jump: false });
  pressed.jump = false;
}

function updateCutscene(dt) {
  cutsceneTime = Math.min(CUTSCENE_DURATION, cutsceneTime + dt);
  if (!cutsceneZapPlayed && cutsceneTime >= 6.65) {
    cutsceneZapPlayed = true;
    playSfx("time-zap");
  }
  if (!cutscenePowerPlayed && cutsceneTime >= 7.45) {
    cutscenePowerPlayed = true;
    playSfx("rewind-awaken");
  }
  if (cutsceneTime >= CUTSCENE_DURATION) showAdventureComplete();
}

function setKey(code, down) {
  if (down && ["ArrowLeft", "KeyA", "ArrowRight", "KeyD", "ArrowUp", "KeyW", "Space"].includes(code)) startRunTimer();
  if (["ArrowLeft", "KeyA"].includes(code)) input.left = down;
  if (["ArrowRight", "KeyD"].includes(code)) input.right = down;
  if (["ArrowUp", "KeyW", "Space"].includes(code)) {
    if (down && !input.jump) pressed.jump = true;
    input.jump = down;
  }
}

function nearbySwitch() {
  if (!player.grounded) return null;
  const playerCenter = player.x + PLAYER_W / 2;
  const playerFeet = player.y + PLAYER_H;
  return (currentLevel().switches || []).find((levelSwitch) =>
    Math.abs(playerCenter - (levelSwitch.x + levelSwitch.w / 2)) <= 72 &&
    Math.abs(playerFeet - (levelSwitch.y + levelSwitch.h)) <= 8
  ) || null;
}

function activateNearbySwitch() {
  const levelSwitch = nearbySwitch();
  if (!levelSwitch) return false;
  levelSwitch.flipped = !levelSwitch.flipped;
  playSfx("switch");
  return true;
}

function switchPromptBounds(levelSwitch, time) {
  const centerX = levelSwitch.x - cameraX + levelSwitch.w / 2;
  return {
    x: centerX - 44,
    y: levelSwitch.y - 38 + Math.sin(time * .006) * 2,
    w: 88,
    h: 29
  };
}

canvas.addEventListener("pointerdown", (event) => {
  if (!gameStarted || paused || won || cutsceneActive) return;
  const levelSwitch = nearbySwitch();
  if (!levelSwitch) return;
  const canvasRect = canvas.getBoundingClientRect();
  const pointerX = (event.clientX - canvasRect.left) * VIEW_W / canvasRect.width;
  const pointerY = (event.clientY - canvasRect.top) * VIEW_H / canvasRect.height;
  const prompt = switchPromptBounds(levelSwitch, performance.now());
  if (pointerX < prompt.x || pointerX > prompt.x + prompt.w || pointerY < prompt.y || pointerY > prompt.y + prompt.h) return;
  event.preventDefault();
  activateNearbySwitch();
  canvas.focus();
});

function trackDevelopmentSequence(event) {
  if (event.repeat || event.key.length !== 1) return;
  const sequence = [99, 104, 101, 101, 115, 101, 98, 117, 114, 103, 101, 114];
  const key = event.key.toLowerCase().charCodeAt(0);
  developmentSequencePosition = key === sequence[developmentSequencePosition]
    ? developmentSequencePosition + 1
    : key === sequence[0] ? 1 : 0;
  if (developmentSequencePosition !== sequence.length) return;
  developmentSequencePosition = 0;
  unlockThrough(levels.length - 1);
  if (!roadmapMenu.hidden) renderRoadmap();
}

addEventListener("keydown", (event) => {
  if (event.target instanceof Element && event.target.matches("input, textarea, select")) return;
  trackDevelopmentSequence(event);
  if (!gameStarted) return;
  if (cutsceneActive) return;
  if (["ArrowLeft", "ArrowRight", "ArrowUp", "Space", "KeyP", "KeyE"].includes(event.code)) event.preventDefault();
  if (event.code === "KeyP" && !won) {
    if (!leaderboardMenu.hidden && leaderboardReturn === "pause") closeLeaderboard();
    else if (!changelogMenu.hidden && changelogReturn === "pause") closeChangelog();
    else setPaused(!paused);
    return;
  }
  if (paused) return;
  if (event.code === "KeyE") activateNearbySwitch();
  if (event.code === "KeyR") restartLevel();
  if (event.code === "KeyT") startOver();
  if (event.code === "Enter" && won) startOver();
  setKey(event.code, true);
});
addEventListener("keyup", (event) => { if (gameStarted) setKey(event.code, false); });
addEventListener("blur", () => Object.assign(input, { left: false, right: false, jump: false }));
restartButton.addEventListener("click", restartLevel);
restartRunButton.addEventListener("click", startOver);
pauseButton.addEventListener("click", () => setPaused(!paused));
resumeButton.addEventListener("click", () => setPaused(false));
pauseRestartLevelButton.addEventListener("click", () => { restartLevel(); setPaused(false); });
pauseRestartRunButton.addEventListener("click", startOver);
pauseQuitButton.addEventListener("click", quitRun);
mainLeaderboardButton.addEventListener("click", () => openLeaderboard("main"));
pauseLeaderboardButton.addEventListener("click", () => openLeaderboard("pause"));
closeLeaderboardButton.addEventListener("click", closeLeaderboard);
mainChangelogButton.addEventListener("click", () => openChangelog("main"));
pauseChangelogButton.addEventListener("click", () => openChangelog("pause"));
closeChangelogButton.addEventListener("click", closeChangelog);
publishRunButton.addEventListener("click", publishFinishedRun);
runNameInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    publishFinishedRun();
  }
});
document.querySelector("#playAgainButton").addEventListener("click", startOver);
quitButton.addEventListener("click", quitRun);
victoryQuitButton.addEventListener("click", quitRun);

function midiToFrequency(note) {
  return 440 * 2 ** ((note - 69) / 12);
}

function scheduleTone(frequency, start, duration, wave, gain, destination, musicVoice = false) {
  if (!audioContext || !destination) return;
  const oscillator = audioContext.createOscillator();
  const envelope = audioContext.createGain();
  oscillator.type = wave;
  oscillator.frequency.setValueAtTime(frequency, start);
  envelope.gain.setValueAtTime(.0001, start);
  envelope.gain.exponentialRampToValueAtTime(Math.max(.0001, gain), start + .018);
  envelope.gain.exponentialRampToValueAtTime(.0001, start + duration);
  oscillator.connect(envelope).connect(destination);
  oscillator.start(start);
  oscillator.stop(start + duration + .025);
  if (musicVoice) {
    activeMusicVoices.add(oscillator);
    oscillator.addEventListener("ended", () => activeMusicVoices.delete(oscillator), { once: true });
  }
}

function stopMusicVoices() {
  if (!audioContext) return;
  for (const voice of activeMusicVoices) {
    try { voice.stop(audioContext.currentTime + .015); } catch { /* Voice already ended. */ }
  }
  activeMusicVoices.clear();
}

function scheduleMusic() {
  if (!audioContext || audioContext.state !== "running" || !currentTrack) return;
  const track = MUSIC_TRACKS[currentTrack];
  if (!track) return;
  const stepDuration = 60 / track.tempo / 2;
  while (nextMusicNoteTime < audioContext.currentTime + .16) {
    const melody = track.melody[musicStep % track.melody.length];
    const bass = track.bass[musicStep % track.bass.length];
    if (melody !== null) {
      scheduleTone(midiToFrequency(melody), nextMusicNoteTime, stepDuration * .78, track.wave, track.gain, musicGain, true);
    }
    if (bass !== null) {
      scheduleTone(midiToFrequency(bass), nextMusicNoteTime, stepDuration * 1.7, "sine", .095, musicGain, true);
    }
    musicStep++;
    nextMusicNoteTime += stepDuration;
  }
}

function startMusic(trackName) {
  if (!MUSIC_TRACKS[trackName] || currentTrack === trackName && musicStep > 0) return;
  currentTrack = trackName;
  musicStep = 0;
  stopMusicVoices();
  if (audioContext) {
    nextMusicNoteTime = audioContext.currentTime + .04;
    scheduleMusic();
  }
}

async function ensureAudio() {
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return false;
    audioContext = new AudioContextClass();
    masterGain = audioContext.createGain();
    musicGain = audioContext.createGain();
    sfxGain = audioContext.createGain();
    masterGain.gain.value = masterVolume;
    musicGain.gain.value = .42;
    sfxGain.gain.value = .55;
    musicGain.connect(masterGain);
    sfxGain.connect(masterGain);
    masterGain.connect(audioContext.destination);
    nextMusicNoteTime = audioContext.currentTime + .04;
    musicTimer = setInterval(scheduleMusic, 50);
  }
  if (audioContext.state === "suspended") await audioContext.resume();
  scheduleMusic();
  return true;
}

function playNoise(duration, gain, cutoff = 900) {
  if (!audioContext || !sfxGain) return;
  const frameCount = Math.max(1, Math.floor(audioContext.sampleRate * duration));
  const buffer = audioContext.createBuffer(1, frameCount, audioContext.sampleRate);
  const data = buffer.getChannelData(0);
  for (let index = 0; index < frameCount; index++) data[index] = Math.random() * 2 - 1;
  const source = audioContext.createBufferSource();
  const filter = audioContext.createBiquadFilter();
  const envelope = audioContext.createGain();
  filter.type = "lowpass";
  filter.frequency.value = cutoff;
  envelope.gain.setValueAtTime(gain, audioContext.currentTime);
  envelope.gain.exponentialRampToValueAtTime(.0001, audioContext.currentTime + duration);
  source.buffer = buffer;
  source.connect(filter).connect(envelope).connect(sfxGain);
  source.start();
}

function playSfx(name, intensity = 1) {
  if (!audioContext || audioContext.state !== "running" || !sfxGain || masterVolume === 0) return;
  const now = audioContext.currentTime;
  if (name === "land-grass") {
    playNoise(.085, .035 * intensity, 520);
    scheduleTone(95, now, .07, "sine", .045 * intensity, sfxGain);
  } else if (name === "land-stone") {
    playNoise(.045, .08 * intensity, 3200);
    scheduleTone(175, now, .055, "square", .085 * intensity, sfxGain);
    scheduleTone(115, now + .018, .05, "triangle", .065 * intensity, sfxGain);
  } else if (name === "land-crate") {
    playNoise(.06, .05 * intensity, 1400);
    scheduleTone(145, now, .065, "triangle", .075 * intensity, sfxGain);
    scheduleTone(105, now + .025, .055, "sine", .055 * intensity, sfxGain);
  } else if (name === "jump-pad") {
    [55, 62, 67].forEach((note, index) => scheduleTone(midiToFrequency(note), now + index * .035, .13, "square", .09, sfxGain));
    playNoise(.07, .035, 1800);
  } else if (name === "switch") {
    scheduleTone(160, now, .08, "square", .07, sfxGain);
    scheduleTone(245, now + .06, .13, "triangle", .09, sfxGain);
  } else if (name === "time-zap") {
    playNoise(.28, .13, 5200);
    scheduleTone(520, now, .1, "sawtooth", .12, sfxGain);
    scheduleTone(1160, now + .07, .18, "square", .1, sfxGain);
    scheduleTone(185, now + .16, .22, "sawtooth", .11, sfxGain);
  } else if (name === "rewind-awaken") {
    [60, 67, 72, 79, 84].forEach((note, index) => scheduleTone(midiToFrequency(note), now + index * .09, .3, "sine", .13, sfxGain));
    scheduleTone(110, now, .65, "triangle", .08, sfxGain);
  } else if (name === "block-break") {
    playNoise(.12, .075, 1250);
    scheduleTone(125, now, .09, "square", .07, sfxGain);
    scheduleTone(82, now + .045, .11, "triangle", .06, sfxGain);
  } else if (name === "death") {
    const oscillator = audioContext.createOscillator();
    const envelope = audioContext.createGain();
    oscillator.type = "sawtooth";
    oscillator.frequency.setValueAtTime(180, now);
    oscillator.frequency.exponentialRampToValueAtTime(65, now + .2);
    envelope.gain.setValueAtTime(.12, now);
    envelope.gain.exponentialRampToValueAtTime(.0001, now + .22);
    oscillator.connect(envelope).connect(sfxGain);
    oscillator.start(now);
    oscillator.stop(now + .23);
    playNoise(.11, .06);
  } else if (name === "star") {
    [79, 83, 86].forEach((note, index) => scheduleTone(midiToFrequency(note), now + index * .045, .12, "sine", .14, sfxGain));
  } else if (name === "flag") {
    [72, 76, 79, 84].forEach((note, index) => scheduleTone(midiToFrequency(note), now + index * .07, .18, "triangle", .15, sfxGain));
  }
}

function setVolume(value) {
  masterVolume = Math.max(0, Math.min(1, Number(value) / 100));
  const percent = Math.round(masterVolume * 100);
  volumeInput.value = String(percent);
  volumeValue.textContent = `${percent}%`;
  if (masterGain && audioContext) masterGain.gain.setTargetAtTime(masterVolume, audioContext.currentTime, .02);
  try { localStorage.setItem("platforms-volume", String(percent)); } catch { /* Storage may be unavailable. */ }
}

try {
  const savedVolume = localStorage.getItem("platforms-volume");
  if (savedVolume !== null) volumeInput.value = savedVolume;
} catch { /* Use the default volume. */ }
setVolume(volumeInput.value);

playButton.addEventListener("click", openRoadmap);
closeRoadmapButton.addEventListener("click", closeRoadmap);

settingsButton.addEventListener("click", () => {
  const opening = settingsPanel.hidden;
  settingsPanel.hidden = !opening;
  settingsButton.setAttribute("aria-expanded", String(opening));
  if (opening) volumeInput.focus();
});

volumeInput.addEventListener("input", () => setVolume(volumeInput.value));
document.addEventListener("pointerdown", () => ensureAudio(), { once: true });
document.addEventListener("keydown", () => ensureAudio(), { once: true });

function updateMenuAnimation(time) {
  if (mainMenu.hidden) return;

  const stageWidth = menuStage.clientWidth;
  const stageHeight = menuStage.clientHeight;
  const slimeWidth = menuSlime.offsetWidth || 44;
  const leftPlatform = stageWidth * .23;
  const rightPlatform = stageWidth * .77;
  const baseBottom = 48;

  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    menuSlime.style.left = `${leftPlatform - slimeWidth / 2}px`;
    menuSlime.style.bottom = `${baseBottom}px`;
    menuSlime.style.transform = "none";
    return;
  }

  const legDuration = 900;
  const landingPause = 110;
  const leg = Math.floor(time / legDuration);
  const legTime = time % legDuration;
  const movingRight = leg % 2 === 0;
  const from = movingRight ? leftPlatform : rightPlatform;
  const to = movingRight ? rightPlatform : leftPlatform;

  let x = from;
  let height = 0;
  let scaleX = 1;
  let scaleY = 1;
  let rotation = 0;

  if (legTime < landingPause) {
    const settle = 1 - legTime / landingPause;
    scaleX = 1 + settle * .08;
    scaleY = 1 - settle * .08;
  } else {
    const progress = (legTime - landingPause) / (legDuration - landingPause);
    const peakHeight = Math.max(38, Math.min(70, stageHeight - 95));
    x = from + (to - from) * progress;
    height = 4 * peakHeight * progress * (1 - progress);
    const stretch = Math.sin(Math.PI * progress);
    scaleX = 1 - stretch * .04;
    scaleY = 1 + stretch * .04;
    rotation = (movingRight ? 1 : -1) * stretch * 4;
  }

  menuSlime.style.left = `${x - slimeWidth / 2}px`;
  menuSlime.style.bottom = `${baseBottom + height}px`;
  menuSlime.style.transform = `rotate(${rotation}deg) scale(${scaleX}, ${scaleY})`;
}

const requestFullscreen = gameShell.requestFullscreen?.bind(gameShell)
  || gameShell.webkitRequestFullscreen?.bind(gameShell);
const exitFullscreen = document.exitFullscreen?.bind(document)
  || document.webkitExitFullscreen?.bind(document);

function fullscreenElement() {
  return document.fullscreenElement || document.webkitFullscreenElement;
}

async function toggleFullscreen() {
  try {
    if (fullscreenElement()) await exitFullscreen?.();
    else await requestFullscreen?.();
  } catch (error) {
    console.warn("Unable to change full-screen mode.", error);
  }
}

function updateFullscreenButton() {
  const active = fullscreenElement() === gameShell;
  const label = active ? "Exit full screen" : "Enter full screen";
  fullscreenButton.setAttribute("aria-label", label);
  fullscreenButton.title = label;
  fullscreenButton.setAttribute("aria-pressed", String(active));
}

if (requestFullscreen && exitFullscreen) {
  fullscreenButton.addEventListener("click", toggleFullscreen);
  document.addEventListener("fullscreenchange", updateFullscreenButton);
  document.addEventListener("webkitfullscreenchange", updateFullscreenButton);
} else {
  fullscreenButton.hidden = true;
}

document.querySelectorAll("[data-control]").forEach((button) => {
  const control = button.dataset.control;
  const set = (down) => {
    if (down) startRunTimer();
    if (control === "jump" && down && !input.jump) pressed.jump = true;
    input[control] = down;
  };
  button.addEventListener("pointerdown", (event) => { event.preventDefault(); button.setPointerCapture(event.pointerId); set(true); });
  button.addEventListener("pointerup", () => set(false));
  button.addEventListener("pointercancel", () => set(false));
  button.addEventListener("lostpointercapture", () => set(false));
});

function startOver() {
  resetCutscene();
  paused = false;
  timerWasRunningBeforePause = false;
  levelTimerWasRunningBeforePause = false;
  pauseMenu.hidden = true;
  roadmapMenu.hidden = true;
  leaderboardMenu.hidden = true;
  changelogMenu.hidden = true;
  levelSplits = [];
  resetFinishedRun();
  resetRunTimer();
  loadLevel(runStartLevel, false);
  pauseButton.disabled = false;
  restartButton.disabled = false;
  restartRunButton.disabled = false;
  quitButton.disabled = false;
  updatePauseButton();
  canvas.focus();
}

function quitRun() {
  resetCutscene();
  gameStarted = false;
  paused = false;
  timerWasRunningBeforePause = false;
  levelTimerWasRunningBeforePause = false;
  Object.assign(input, { left: false, right: false, jump: false });
  pressed.jump = false;
  pauseButton.disabled = true;
  restartButton.disabled = true;
  restartRunButton.disabled = true;
  quitButton.disabled = true;
  settingsPanel.hidden = true;
  pauseMenu.hidden = true;
  roadmapMenu.hidden = true;
  leaderboardMenu.hidden = true;
  changelogMenu.hidden = true;
  settingsButton.setAttribute("aria-expanded", "false");
  levelSplits = [];
  resetRunTimer();
  resetFinishedRun();
  loadLevel(0, false);
  mainMenu.hidden = false;
  startMusic("menu");
  playButton.focus();
  updatePauseButton();
}

function tryPushCrate(crate, distance) {
  const candidate = { x: crate.x + distance, y: crate.y, w: crate.w, h: crate.h };
  if (candidate.x < 0 || candidate.x + candidate.w > currentLevel().width) return false;
  for (const solid of currentLevel().platforms) {
    if (solid === crate) continue;
    if (solid.broken) continue;
    if (overlaps(candidate, solid)) return false;
  }
  crate.x = candidate.x;
  return true;
}

function moveAndCollideX(dt) {
  const distance = player.vx * dt;
  player.x += distance;
  const box = playerBox();
  for (const solid of currentLevel().platforms) {
    if (solid.broken) continue;
    if (!overlaps(box, solid)) continue;
    if (solid.pushable) {
      if (distance > 0 && player.x < solid.x) {
        const pushDistance = player.x + PLAYER_W - solid.x;
        if (tryPushCrate(solid, pushDistance)) { box.x = player.x; continue; }
      } else if (distance < 0 && player.x + PLAYER_W > solid.x + solid.w) {
        const pushDistance = player.x - (solid.x + solid.w);
        if (tryPushCrate(solid, pushDistance)) { box.x = player.x; continue; }
      }
    }
    if (player.vx > 0) player.x = solid.x - PLAYER_W;
    else if (player.vx < 0) player.x = solid.x + solid.w;
    player.vx = 0;
    box.x = player.x;
  }
}

function moveAndCollideY(dt) {
  player.y += player.vy * dt;
  player.grounded = false;
  let landedOn = null;
  const box = playerBox();
  for (const solid of currentLevel().platforms) {
    if (solid.broken) continue;
    if (!overlaps(box, solid)) continue;
    if (player.vy > 0) {
      const impactSpeed = player.vy;
      const surface = solid.material || solid.kind;
      const landingKind = surface === "crate" ? "crate" : surface === "grass" ? "grass" : "stone";
      landedOn = { platform: solid, kind: landingKind, impactSpeed, intensity: Math.max(.45, Math.min(1, impactSpeed / 700)) };
      player.y = solid.y - PLAYER_H;
      player.grounded = true;
    }
    else if (player.vy < 0) player.y = solid.y + solid.h;
    player.vy = 0;
    box.y = player.y;
  }
  return landedOn;
}

function createBlockDebris(platform) {
  const material = platform.material || "stone";
  const colors = material === "grass"
    ? ["#6f3f24", "#92552b", "#bd7133"]
    : material === "crate"
      ? ["#7b421f", "#b86b2b", "#e0a04a"]
      : ["#59616a", "#7d8790", "#aeb5bb"];
  for (let index = 0; index < 13; index++) {
    const angle = Math.PI * (1.08 + Math.random() * .84);
    const speed = 95 + Math.random() * 155;
    blockDebris.push({
      material,
      x: platform.x + platform.w * (.12 + Math.random() * .76),
      y: platform.y + platform.h * (.25 + Math.random() * .5),
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 75,
      size: 4 + Math.random() * 6,
      rotation: Math.random() * Math.PI,
      spin: (Math.random() - .5) * 12,
      color: colors[index % colors.length],
      life: .72 + Math.random() * .28
    });
  }
}

function updateBlockDebris(dt) {
  for (const piece of blockDebris) {
    piece.x += piece.vx * dt;
    piece.y += piece.vy * dt;
    piece.vy += 620 * dt;
    piece.rotation += piece.spin * dt;
    piece.life -= dt;
  }
  blockDebris = blockDebris.filter((piece) => piece.life > 0);
}

function updateBreakablePlatforms(dt, landedOn) {
  const platform = landedOn?.platform;
  if (platform?.breakable && platform.breakTimer === null) {
    if (platform.breakTrigger === "stand") platform.breakTimer = .75;
    else if (platform.breakTrigger === "impact" && landedOn.impactSpeed >= 180) platform.breakTimer = .24;
  }

  for (const candidate of currentLevel().platforms) {
    if (!candidate.breakable || candidate.broken || candidate.breakTimer === null) continue;
    candidate.breakTimer -= dt;
    if (candidate.breakTimer > 0) continue;
    candidate.broken = true;
    candidate.breakTimer = 0;
    const standingOnBlock = player.x + PLAYER_W > candidate.x && player.x < candidate.x + candidate.w &&
      Math.abs(player.y + PLAYER_H - candidate.y) < 2;
    if (standingOnBlock) player.grounded = false;
    createBlockDebris(candidate);
    playSfx("block-break");
  }
}

function activateJumpPad() {
  if (player.vy < 0) return false;
  const pad = currentLevel().jumpPads?.find((candidate) => overlaps(playerBox(), candidate));
  if (!pad) return false;
  player.y = pad.y - PLAYER_H;
  player.vy = -JUMP_PAD_SPEED;
  player.grounded = false;
  player.coyote = 0;
  player.jumpBuffer = 0;
  player.padLaunched = true;
  playSfx("jump-pad");
  return true;
}

function update(dt) {
  if (!gameStarted) return;
  if (paused) return;

  if (cutsceneActive) {
    updateCutscene(dt);
    return;
  }

  updateBlockDebris(dt);

  if (deathTimer > 0) {
    deathTimer = Math.max(0, deathTimer - dt);
    for (const particle of deathParticles) {
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.vy += 500 * dt;
      particle.rotation += particle.spin * dt;
    }
    if (deathTimer === 0) resetPlayer(false);
    return;
  }

  if (won || levelTransition > 0) {
    if (levelTransition > 0) {
      levelTransition -= dt;
      if (levelTransition <= 0) loadLevel(levelIndex + 1);
    }
    return;
  }

  updateMovingPlatforms(dt);

  const wasGrounded = player.grounded;
  const direction = Number(input.right) - Number(input.left);
  const acceleration = player.grounded ? GROUND_ACCEL : AIR_ACCEL;
  if (direction) {
    player.vx += direction * acceleration * dt;
    player.vx = Math.max(-RUN_SPEED, Math.min(RUN_SPEED, player.vx));
    player.facing = direction;
  } else {
    const drag = FRICTION * dt;
    player.vx = Math.abs(player.vx) <= drag ? 0 : player.vx - Math.sign(player.vx) * drag;
  }

  if (pressed.jump) { player.jumpBuffer = JUMP_BUFFER; pressed.jump = false; }
  else player.jumpBuffer = Math.max(0, player.jumpBuffer - dt);
  player.coyote = player.grounded ? COYOTE_TIME : Math.max(0, player.coyote - dt);

  if (player.jumpBuffer > 0 && player.coyote > 0) {
    player.vy = -JUMP_SPEED;
    player.grounded = false;
    player.coyote = 0;
    player.jumpBuffer = 0;
  }
  if (!input.jump && player.vy < -220 && !player.padLaunched) player.vy += GRAVITY * 1.55 * dt;
  player.vy = Math.min(player.vy + GRAVITY * dt, 900);

  moveAndCollideX(dt);
  const landedOn = moveAndCollideY(dt);
  updateBreakablePlatforms(dt, landedOn);
  if (!wasGrounded && landedOn) playSfx(`land-${landedOn.kind}`, landedOn.intensity);
  const padActivated = activateJumpPad();
  if (landedOn && !padActivated) player.padLaunched = false;
  player.x = Math.max(0, Math.min(currentLevel().width - PLAYER_W, player.x));

  const box = playerBox();
  if (player.y > VIEW_H + 100) {
    playSfx("death");
    resetPlayer(true);
    return;
  }
  if (currentLevel().hazards.some((hazard) => overlaps(box, hazard))) {
    startSpikeDeath();
    return;
  }

  currentLevel().stars.forEach(([x, y], i) => {
    const star = { x: x - 15, y: y - 15, w: 30, h: 30 };
    if (!collected[i] && overlaps(box, star)) {
      collected[i] = true;
      totalStars++;
      playSfx("star");
      updateHud();
    }
  });

  if (overlaps(box, currentLevel().finish)) {
    playSfx("flag");
    completeLevelSplit();
    unlockThrough(levelIndex + 1);
    if (levelIndex === levels.length - 1) startRewindCutscene();
    else levelTransition = .65;
  }

  const target = Math.max(0, Math.min(currentLevel().width - VIEW_W, player.x - VIEW_W * .38));
  cameraX += (target - cameraX) * Math.min(1, dt * 6);
}

function roundedRect(x, y, w, h, r) {
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fill();
}

const spriteCuts = [
  [63, 239, 337, 331], [460, 239, 327, 330], [862, 237, 333, 339],
  [60, 774, 330, 244], [462, 691, 331, 324], [879, 637, 303, 399]
];

function drawSprite(index, x, y, w, h) {
  if (!spritesReady) return false;
  // Crop the transparent padding around each of the six generated atlas objects.
  const scale = spriteSheet.naturalWidth / 1254;
  const [sx, sy, sw, sh] = spriteCuts[index].map((value) => value * scale);
  ctx.drawImage(spriteSheet, sx, sy, sw, sh, x, y, w, h);
  return true;
}

function drawBackground() {
  const isLavaLevel = currentLevel().theme === "lava";
  const gradient = ctx.createLinearGradient(0, 0, 0, VIEW_H);
  gradient.addColorStop(0, isLavaLevel ? "#382337" : "#5ac8fa");
  gradient.addColorStop(.62, isLavaLevel ? "#9d493c" : "#b9edff");
  gradient.addColorStop(1, isLavaLevel ? "#ef9b47" : "#edfaff");
  ctx.fillStyle = gradient; ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  ctx.fillStyle = isLavaLevel ? "#d7b3a34a" : "#ffffff7a";
  for (let i = -1; i < 7; i++) {
    const x = ((i * 230 - cameraX * .14) % 1500) - 80;
    ctx.beginPath(); ctx.ellipse(x, 125 + (i % 3) * 54, 60, 20, 0, 0, Math.PI * 2); ctx.ellipse(x + 42, 118 + (i % 3) * 54, 38, 27, 0, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = isLavaLevel ? "#352b386e" : "#6798a966";
  ctx.beginPath(); ctx.moveTo(0, 420);
  for (let x = 0; x <= VIEW_W; x += 100) ctx.lineTo(x, 330 + Math.sin((x + cameraX * .09) * .009) * 45);
  ctx.lineTo(VIEW_W, VIEW_H); ctx.lineTo(0, VIEW_H); ctx.fill();
}

function drawPillarTexture(spriteIndex, x, y, width, height) {
  if (!spritesReady || height <= 0) return false;
  const scale = spriteSheet.naturalWidth / 1254;
  const [cutX, cutY, cutW, cutH] = spriteCuts[spriteIndex];
  const middleCrop = spriteIndex === 1
    ? [.18, .20, .64, .62]
    : [.22, .38, .56, .48];
  const sourceEdge = cutW * (spriteIndex === 1 ? .16 : .14);
  const destinationEdge = Math.min(18, width / 2);
  const middleWidth = Math.max(0, width - destinationEdge * 2);
  const sourceY = (cutY + cutH * middleCrop[1]) * scale;
  const sourceH = cutH * middleCrop[3] * scale;
  const middleSourceX = (cutX + cutW * middleCrop[0]) * scale;
  const middleSourceW = cutW * middleCrop[2] * scale;
  const tileW = 58;
  const tileH = 58;

  ctx.save();
  ctx.beginPath(); ctx.rect(x, y, width, height); ctx.clip();
  for (let ty = 0; ty < height; ty += tileH) {
    const drawH = Math.min(tileH, height - ty);
    for (let tx = 0; tx < middleWidth; tx += tileW) {
      const drawW = Math.min(tileW, middleWidth - tx);
      ctx.drawImage(
        spriteSheet,
        middleSourceX, sourceY, middleSourceW * drawW / tileW, sourceH * drawH / tileH,
        x + destinationEdge + tx, y + ty, drawW + .5, drawH + .5
      );
    }
    ctx.drawImage(
      spriteSheet,
      cutX * scale, sourceY, sourceEdge * scale, sourceH * drawH / tileH,
      x, y + ty, destinationEdge, drawH + .5
    );
    ctx.drawImage(
      spriteSheet,
      (cutX + cutW - sourceEdge) * scale, sourceY, sourceEdge * scale, sourceH * drawH / tileH,
      x + width - destinationEdge, y + ty, destinationEdge, drawH + .5
    );
  }
  ctx.restore();
  return true;
}

function drawConnectedPlatformCap(spriteIndex, x, y, width, height) {
  const scale = spriteSheet.naturalWidth / 1254;
  const [cutX, cutY, cutW, cutH] = spriteCuts[spriteIndex];
  const sourceEdge = cutW * (spriteIndex === 1 ? .16 : .14);
  const destinationEdge = Math.min(18, width / 2);
  const middleWidth = Math.max(0, width - destinationEdge * 2);
  const sourceY = cutY * scale;
  const sourceHeight = cutH * scale;
  const tileWidth = 64;

  ctx.drawImage(
    spriteSheet,
    cutX * scale, sourceY, sourceEdge * scale, sourceHeight,
    x, y, destinationEdge, height
  );

  for (let offset = 0; offset < middleWidth; offset += tileWidth) {
    const drawWidth = Math.min(tileWidth, middleWidth - offset);
    ctx.drawImage(
      spriteSheet,
      (cutX + sourceEdge) * scale, sourceY,
      (cutW - sourceEdge * 2) * scale * drawWidth / tileWidth, sourceHeight,
      x + destinationEdge + offset, y, drawWidth + .5, height
    );
  }

  ctx.drawImage(
    spriteSheet,
    (cutX + cutW - sourceEdge) * scale, sourceY, sourceEdge * scale, sourceHeight,
    x + width - destinationEdge, y, destinationEdge, height
  );
}

function drawAssetRectangle(material, x, y, width, height) {
  const spriteIndex = material === "grass" ? 0 : material === "crate" ? 2 : 1;
  if (!spritesReady) {
    ctx.fillStyle = material === "grass" ? "#925b35" : material === "crate" ? "#a76728" : "#77828d";
    ctx.fillRect(x, y, width, height);
    return;
  }

  const scale = spriteSheet.naturalWidth / 1254;
  const [cutX, cutY, cutW, cutH] = spriteCuts[spriteIndex];
  const inset = material === "grass"
    ? { left: .14, right: .14, top: .36, bottom: .10, dx: 15, dyTop: 20, dyBottom: 10 }
    : material === "crate"
      ? { left: .17, right: .17, top: .17, bottom: .17, dx: 16, dyTop: 14, dyBottom: 14 }
      : { left: .15, right: .15, top: .15, bottom: .15, dx: 15, dyTop: 14, dyBottom: 14 };
  const sourceLeft = cutW * inset.left;
  const sourceRight = cutW * inset.right;
  const sourceTop = cutH * inset.top;
  const sourceBottom = cutH * inset.bottom;
  const destinationLeft = Math.min(inset.dx, width / 2);
  const destinationRight = Math.min(inset.dx, width - destinationLeft);
  const destinationTop = Math.min(inset.dyTop, height / 2);
  const destinationBottom = Math.min(inset.dyBottom, height - destinationTop);
  const sourceColumns = [0, sourceLeft, cutW - sourceRight, cutW];
  const sourceRows = [0, sourceTop, cutH - sourceBottom, cutH];
  const destinationColumns = [0, destinationLeft, width - destinationRight, width];
  const destinationRows = [0, destinationTop, height - destinationBottom, height];

  for (let row = 0; row < 3; row++) {
    for (let column = 0; column < 3; column++) {
      const sourceW = sourceColumns[column + 1] - sourceColumns[column];
      const sourceH = sourceRows[row + 1] - sourceRows[row];
      const destinationW = destinationColumns[column + 1] - destinationColumns[column];
      const destinationH = destinationRows[row + 1] - destinationRows[row];
      if (sourceW <= 0 || sourceH <= 0 || destinationW <= 0 || destinationH <= 0) continue;
      ctx.drawImage(
        spriteSheet,
        (cutX + sourceColumns[column]) * scale, (cutY + sourceRows[row]) * scale,
        sourceW * scale, sourceH * scale,
        x + destinationColumns[column], y + destinationRows[row], destinationW + .25, destinationH + .25
      );
    }
  }
}

function traceBlockCracks(x, y, width, height) {
  ctx.beginPath();
  ctx.moveTo(x + width * .48, y + 1);
  ctx.lineTo(x + width * .43, y + height * .24);
  ctx.lineTo(x + width * .55, y + height * .43);
  ctx.lineTo(x + width * .46, y + height * .68);
  ctx.lineTo(x + width * .53, y + height - 1);
  ctx.moveTo(x + width * .43, y + height * .24);
  ctx.lineTo(x + width * .27, y + height * .34);
  ctx.lineTo(x + width * .19, y + height * .58);
  ctx.moveTo(x + width * .55, y + height * .43);
  ctx.lineTo(x + width * .72, y + height * .31);
  ctx.lineTo(x + width * .84, y + height * .46);
  ctx.moveTo(x + width * .46, y + height * .68);
  ctx.lineTo(x + width * .31, y + height * .82);
  ctx.moveTo(x + width * .53, y + height * .79);
  ctx.lineTo(x + width * .71, y + height * .9);
}

function drawMechanicBlock(block, x, time) {
  const activeDuration = block.breakTrigger === "stand" ? .75 : .24;
  const breakProgress = block.breakTimer === null ? 0 : Math.min(1, 1 - block.breakTimer / activeDuration);
  const shake = breakProgress > .35 ? Math.sin(time * .09) * breakProgress * 2.2 : 0;
  const drawX = x + shake;

  ctx.save();
  ctx.globalAlpha = 1 - breakProgress * .2;
  ctx.shadowColor = "#10182590";
  ctx.shadowBlur = 5;
  ctx.shadowOffsetY = 4;
  drawAssetRectangle(block.material, drawX, block.y, block.w, block.h);
  ctx.shadowColor = "transparent";

  if (block.breakable) {
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#241b18e8";
    ctx.lineWidth = 5;
    traceBlockCracks(drawX, block.y, block.w, block.h);
    ctx.stroke();
    ctx.strokeStyle = "#f4ddbd99";
    ctx.lineWidth = 1.25;
    traceBlockCracks(drawX - 1, block.y, block.w, block.h);
    ctx.stroke();
    if (breakProgress > .3) {
      ctx.strokeStyle = "#241b18c9";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(drawX + block.w * .08, block.y + block.h * .22);
      ctx.lineTo(drawX + block.w * .2, block.y + block.h * .43);
      ctx.moveTo(drawX + block.w * .91, block.y + block.h * .66);
      ctx.lineTo(drawX + block.w * .78, block.y + block.h * .78);
      ctx.stroke();
    }
  }
  ctx.restore();
}

function drawPlatform(p, time) {
  if (p.broken) return;
  const x = p.x - cameraX;
  if (x + p.w < -80 || x > VIEW_W + 80) return;
  if (p.kind === "breakable-block" || p.kind === "floating-block") {
    drawMechanicBlock(p, x, time);
    return;
  }
  if (p.kind === "crate") {
    const drewSprite = p.w <= 100 && drawSprite(2, x, p.y, p.w, p.h);
    if (!drewSprite) {
      ctx.fillStyle = "#a76728"; roundedRect(x, p.y, p.w, p.h, 6);
      ctx.fillStyle = "#d7963c"; ctx.fillRect(x, p.y, p.w, Math.min(13, p.h));
    }
    if (p.pushable) drawPushableCrateMarker(p, x);
    return;
  }

  const tile = p.kind === "stone" ? 1 : 0;
  if (spritesReady) {
    const capDepth = Math.min(p.h, p.kind === "stone" ? 52 : 50);
    drawPillarTexture(tile, x, p.y + capDepth - 2, p.w, p.h - capDepth + 2);
    ctx.save();
    ctx.beginPath(); ctx.rect(x, p.y, p.w, capDepth); ctx.clip();
    drawConnectedPlatformCap(tile, x, p.y, p.w, 82);
    ctx.restore();
    if (p.moving) drawMovingPlatformMarker(p, x);
    return;
  }
  const topDepth = Math.min(82, p.h);
  ctx.fillStyle = p.kind === "stone" ? "#77828d" : "#925b35";
  ctx.fillRect(x, p.y, p.w, topDepth);
  ctx.fillStyle = p.kind === "stone" ? "#aab3bb" : "#61bb3c";
  ctx.fillRect(x, p.y, p.w, Math.min(13, p.h));
  if (p.moving) drawMovingPlatformMarker(p, x);
}

function drawPushableCrateMarker(crate, x) {
  const centerX = x + crate.w / 2;
  const centerY = crate.y + crate.h / 2;
  ctx.save();
  ctx.fillStyle = "#0b3957d9";
  ctx.strokeStyle = "#8de4ff";
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.beginPath(); ctx.roundRect(centerX - 20, centerY - 8, 40, 16, 8); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(centerX - 13, centerY); ctx.lineTo(centerX + 13, centerY);
  ctx.moveTo(centerX - 13, centerY); ctx.lineTo(centerX - 7, centerY - 5);
  ctx.moveTo(centerX - 13, centerY); ctx.lineTo(centerX - 7, centerY + 5);
  ctx.moveTo(centerX + 13, centerY); ctx.lineTo(centerX + 7, centerY - 5);
  ctx.moveTo(centerX + 13, centerY); ctx.lineTo(centerX + 7, centerY + 5);
  ctx.stroke();
  ctx.restore();
}

function drawMovingPlatformMarker(platform, x) {
  const y = platform.y + 7;
  ctx.save();
  ctx.strokeStyle = "#8de4ff";
  ctx.fillStyle = "#0b3957cc";
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.beginPath(); ctx.roundRect(x + platform.w / 2 - 24, y - 5, 48, 15, 7); ctx.fill();
  ctx.beginPath();
  if (platform.axis === "x") {
    ctx.moveTo(x + platform.w / 2 - 15, y + 2); ctx.lineTo(x + platform.w / 2 + 15, y + 2);
    ctx.moveTo(x + platform.w / 2 - 15, y + 2); ctx.lineTo(x + platform.w / 2 - 9, y - 3);
    ctx.moveTo(x + platform.w / 2 - 15, y + 2); ctx.lineTo(x + platform.w / 2 - 9, y + 7);
    ctx.moveTo(x + platform.w / 2 + 15, y + 2); ctx.lineTo(x + platform.w / 2 + 9, y - 3);
    ctx.moveTo(x + platform.w / 2 + 15, y + 2); ctx.lineTo(x + platform.w / 2 + 9, y + 7);
  } else {
    ctx.moveTo(x + platform.w / 2, y - 3); ctx.lineTo(x + platform.w / 2, y + 7);
    ctx.moveTo(x + platform.w / 2, y - 3); ctx.lineTo(x + platform.w / 2 - 5, y + 1);
    ctx.moveTo(x + platform.w / 2, y - 3); ctx.lineTo(x + platform.w / 2 + 5, y + 1);
    ctx.moveTo(x + platform.w / 2, y + 7); ctx.lineTo(x + platform.w / 2 - 5, y + 3);
    ctx.moveTo(x + platform.w / 2, y + 7); ctx.lineTo(x + platform.w / 2 + 5, y + 3);
  }
  ctx.stroke();
  ctx.restore();
}

function drawSwitch(levelSwitch, time) {
  const x = levelSwitch.x - cameraX;
  if (x + levelSwitch.w < -30 || x > VIEW_W + 30) return;
  const centerX = x + levelSwitch.w / 2;
  const baseY = levelSwitch.y + levelSwitch.h;
  const leverDirection = levelSwitch.flipped ? 1 : -1;

  ctx.save();
  ctx.shadowColor = "#0a102288";
  ctx.shadowBlur = 5;
  ctx.shadowOffsetY = 3;
  ctx.fillStyle = "#38485a";
  ctx.strokeStyle = "#172434";
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(x + 3, baseY - 14, levelSwitch.w - 6, 14, 5); ctx.fill(); ctx.stroke();
  ctx.shadowColor = "transparent";
  ctx.strokeStyle = "#d4dbe1";
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(centerX, baseY - 13);
  ctx.lineTo(centerX + leverDirection * 13, levelSwitch.y + 7);
  ctx.stroke();
  ctx.fillStyle = levelSwitch.flipped ? "#74dc88" : "#efb746";
  ctx.strokeStyle = "#183a2a";
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(centerX + leverDirection * 13, levelSwitch.y + 7, 7, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

  if (nearbySwitch() === levelSwitch) {
    const prompt = switchPromptBounds(levelSwitch, time);
    ctx.fillStyle = "#07162de8";
    ctx.strokeStyle = "#8de4ff";
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(prompt.x, prompt.y, prompt.w, prompt.h, 9); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#ffe05d";
    ctx.beginPath(); ctx.roundRect(prompt.x + 7, prompt.y + 5, 20, 19, 5); ctx.fill();
    ctx.fillStyle = "#152039";
    ctx.font = "900 13px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("E", prompt.x + 17, prompt.y + 15);
    ctx.fillStyle = "#e9f7ff";
    ctx.font = "800 11px Inter, sans-serif";
    ctx.fillText("- FLIP", prompt.x + 57, prompt.y + 15);
  }
  ctx.restore();
}

function drawJumpPad(pad, time) {
  const x = pad.x - cameraX;
  if (x + pad.w < -20 || x > VIEW_W + 20) return;
  const pulse = (Math.sin(time * .008) + 1) * .5;
  ctx.save();
  ctx.shadowColor = "#ffe05d";
  ctx.shadowBlur = 6 + pulse * 7;
  ctx.fillStyle = "#243958";
  ctx.beginPath(); ctx.roundRect(x, pad.y + 7, pad.w, pad.h - 7, 5); ctx.fill();
  ctx.fillStyle = "#ffe05d";
  ctx.beginPath(); ctx.roundRect(x + 3, pad.y + 2 - pulse * 2, pad.w - 6, 10, 5); ctx.fill();
  ctx.fillStyle = "#ef8f2f";
  for (let offset = 10; offset < pad.w - 5; offset += 16) {
    ctx.beginPath();
    ctx.moveTo(x + offset - 5, pad.y + 9 - pulse * 2);
    ctx.lineTo(x + offset, pad.y + 4 - pulse * 2);
    ctx.lineTo(x + offset + 5, pad.y + 9 - pulse * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawHazard(h, time) {
  const x = h.x - cameraX;
  if (x + h.w < -40 || x > VIEW_W + 40) return;
  if (h.kind === "lava") {
    ctx.save();
    ctx.fillStyle = "#d43a25";
    ctx.fillRect(x, h.y, h.w, h.h);
    ctx.fillStyle = "#ff8128";
    ctx.beginPath();
    ctx.moveTo(x, h.y + 5);
    for (let px = 0; px <= h.w; px += 10) {
      ctx.lineTo(x + px, h.y + 5 + Math.sin(time * .006 + (h.x + px) * .05) * 4);
    }
    ctx.lineTo(x + h.w, h.y + h.h);
    ctx.lineTo(x, h.y + h.h);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#ffd65a";
    const bubbleCount = Math.max(1, Math.floor(h.w / 45));
    for (let i = 0; i < bubbleCount; i++) {
      const bx = x + ((i * 53 + time * .018) % h.w);
      const by = h.y + 13 + Math.sin(time * .004 + i * 2.1) * 5;
      ctx.beginPath(); ctx.arc(bx, by, 2.5, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
    return;
  }
  if (drawSprite(3, x, h.y - 29, h.w, 48)) return;
  ctx.fillStyle = "#e9f5ff"; ctx.strokeStyle = "#526478"; ctx.lineWidth = 2;
  const count = Math.max(1, Math.round(h.w / 24));
  for (let i = 0; i < count; i++) { const sx = x + i * h.w / count; ctx.beginPath(); ctx.moveTo(sx, h.y + h.h); ctx.lineTo(sx + h.w / count / 2, h.y - 18); ctx.lineTo(sx + h.w / count, h.y + h.h); ctx.closePath(); ctx.fill(); ctx.stroke(); }
}

function drawStar(x, y, index, time) {
  if (collected[index]) return;
  const bob = Math.sin(time * .004 + index) * 4;
  if (drawSprite(4, x - cameraX - 20, y + bob - 20, 40, 40)) return;
  ctx.save(); ctx.translate(x - cameraX, y + bob); ctx.rotate(time * .001);
  ctx.fillStyle = "#ffd83d"; ctx.strokeStyle = "#d68b13"; ctx.lineWidth = 3; ctx.beginPath();
  for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5; const r = i % 2 ? 8 : 18; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
  ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
}

function drawFlag(flag) {
  const x = flag.x - cameraX;
  if (drawSprite(5, x - 25, flag.y - 18, 82, flag.h + 25)) return;
  ctx.fillStyle = "#f5c54e"; ctx.fillRect(x + 4, flag.y, 6, flag.h);
  ctx.fillStyle = "#f0445a"; ctx.beginPath(); ctx.moveTo(x + 10, flag.y + 5); ctx.lineTo(x + 55, flag.y + 18); ctx.lineTo(x + 10, flag.y + 34); ctx.fill();
}

function drawPlayer(time) {
  const x = player.x - cameraX, y = player.y;
  ctx.save(); ctx.translate(x + PLAYER_W / 2, y + PLAYER_H / 2);
  if (!player.grounded) ctx.rotate(player.vx * .00025);
  ctx.scale(player.facing, 1);
  const moving = player.grounded && Math.abs(player.vx) > 20;
  const bounce = moving ? Math.sin(time * .018) * 1.6 : Math.sin(time * .004) * .6;
  const squash = player.grounded ? bounce : -1.4;

  // A squat rounded-square slime body that gently squashes as it moves.
  ctx.fillStyle = "#55c96b";
  ctx.strokeStyle = "#207a43";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.roundRect(
    -17 - squash * .45,
    -11 + Math.abs(squash) * .1,
    34 + squash * .9,
    31 - squash * .35,
    9
  );
  ctx.fill();
  ctx.stroke();

  // Gloss, simple eyes, and a tiny smile keep the character readable at game size.
  ctx.fillStyle = "#9af0a2";
  ctx.beginPath(); ctx.ellipse(-8, -5, 3.5, 4.5, .55, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#173d2c";
  ctx.beginPath();
  ctx.ellipse(-5, 0, 2.5, 3.8, 0, 0, Math.PI * 2);
  ctx.ellipse(6, 0, 2.5, 3.8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(-5.7, -1.2, .8, 0, Math.PI * 2);
  ctx.arc(5.3, -1.2, .8, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#173d2c";
  ctx.lineWidth = 1.7;
  ctx.lineCap = "round";
  ctx.beginPath(); ctx.arc(.5, 7, 4.5, .15, Math.PI - .15); ctx.stroke();
  ctx.restore();
}

function drawDeathParticles() {
  const opacity = Math.min(1, deathTimer / .14);
  ctx.fillStyle = `rgba(85, 201, 107, ${opacity})`;
  ctx.strokeStyle = `rgba(32, 122, 67, ${opacity * .75})`;
  ctx.lineWidth = 1;
  for (const particle of deathParticles) {
    ctx.save();
    ctx.translate(particle.x - cameraX, particle.y);
    ctx.rotate(particle.rotation);
    ctx.beginPath();
    ctx.roundRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size, 1.5);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}

function drawBlockDebris() {
  for (const piece of blockDebris) {
    const opacity = Math.min(1, piece.life * 2.5);
    ctx.save();
    ctx.translate(piece.x - cameraX, piece.y);
    ctx.rotate(piece.rotation);
    ctx.globalAlpha = opacity;
    ctx.fillStyle = piece.color;
    ctx.strokeStyle = "#34251da8";
    ctx.lineWidth = 1;
    ctx.beginPath();
    if (piece.material === "stone") {
      ctx.roundRect(-piece.size / 2, -piece.size * .4, piece.size, piece.size * .8, piece.size * .25);
    } else if (piece.material === "crate") {
      ctx.roundRect(-piece.size, -piece.size * .22, piece.size * 2, piece.size * .44, 1.5);
    } else {
      ctx.roundRect(-piece.size * .55, -piece.size * .45, piece.size * 1.1, piece.size * .9, 2);
    }
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}

function cutsceneEase(value) {
  const clamped = Math.max(0, Math.min(1, value));
  return clamped * clamped * (3 - 2 * clamped);
}

function cutsceneJump(time, startTime, endTime, startX, startY, endX, endY, height) {
  const progress = Math.max(0, Math.min(1, (time - startTime) / (endTime - startTime)));
  return {
    x: startX + (endX - startX) * progress,
    y: startY + (endY - startY) * progress - Math.sin(progress * Math.PI) * height,
    airborne: progress > 0 && progress < 1
  };
}

function cutsceneSlimePose(time) {
  if (time < .8) return { x: 55, y: 418, airborne: false };
  if (time < 1.45) return { x: 55 + cutsceneEase((time - .8) / .65) * 110, y: 418, airborne: false };
  if (time < 2.35) return cutsceneJump(time, 1.45, 2.35, 165, 418, 305, 368, 78);
  if (time < 2.95) return { x: 305 + cutsceneEase((time - 2.35) / .6) * 85, y: 368, airborne: false };
  if (time < 3.85) return cutsceneJump(time, 2.95, 3.85, 390, 368, 525, 408, 72);
  if (time < 4.4) return { x: 525 + cutsceneEase((time - 3.85) / .55) * 95, y: 408, airborne: false };
  if (time < 5.35) return cutsceneJump(time, 4.4, 5.35, 620, 408, 750, 348, 82);
  if (time < 6.35) return { x: 750 + cutsceneEase((time - 5.35) / 1) * 112, y: 348, airborne: false };
  if (time < 7.45) return { x: 862, y: 348, airborne: false, inside: true };
  return { x: 862 - cutsceneEase((time - 7.45) / .9) * 72, y: 348, airborne: false, powered: true };
}

function drawCutsceneSlime(pose, time, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(pose.x + PLAYER_W / 2, pose.y + PLAYER_H / 2);
  if (pose.airborne) ctx.rotate(.08);
  const running = !pose.airborne && time > .8 && time < 6.35;
  const bounce = running ? Math.sin(time * 18) * 1.6 : Math.sin(time * 4) * .6;

  if (pose.powered) {
    const pulse = .7 + Math.sin(time * 9) * .12;
    ctx.shadowColor = "#79f5ff";
    ctx.shadowBlur = 24;
    ctx.strokeStyle = `rgba(121,245,255,${pulse})`;
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, 0, 27 + Math.sin(time * 7) * 3, 0, Math.PI * 2); ctx.stroke();
  }

  ctx.fillStyle = "#55c96b";
  ctx.strokeStyle = pose.powered ? "#64ecdf" : "#207a43";
  ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.roundRect(-17 - bounce * .4, -11, 34 + bounce * .8, 31 - bounce * .3, 9); ctx.fill(); ctx.stroke();
  ctx.fillStyle = "#9af0a2";
  ctx.beginPath(); ctx.ellipse(-8, -5, 3.5, 4.5, .55, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#173d2c";
  ctx.beginPath(); ctx.ellipse(-5, 0, 2.5, 3.8, 0, 0, Math.PI * 2); ctx.ellipse(6, 0, 2.5, 3.8, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.beginPath(); ctx.arc(-5.7, -1.2, .8, 0, Math.PI * 2); ctx.arc(5.3, -1.2, .8, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = "#173d2c";
  ctx.lineWidth = 1.7;
  ctx.beginPath(); ctx.arc(.5, 7, 4.5, .15, Math.PI - .15); ctx.stroke();
  ctx.restore();
}

function drawTimeMachine(time, staticIntensity) {
  const x = 825;
  const y = 252;
  const width = 120;
  const height = 138;
  const glow = .55 + Math.sin(time * 7) * .15 + staticIntensity * .25;

  ctx.save();
  ctx.shadowColor = `rgba(91,232,255,${glow})`;
  ctx.shadowBlur = 18 + staticIntensity * 18;
  const frameGradient = ctx.createLinearGradient(x, y, x + width, y + height);
  frameGradient.addColorStop(0, "#d3dae4");
  frameGradient.addColorStop(.42, "#53687a");
  frameGradient.addColorStop(1, "#253546");
  ctx.fillStyle = frameGradient;
  ctx.strokeStyle = "#142233";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.roundRect(x, y + 24, width, height - 24, 42);
  ctx.fill(); ctx.stroke();

  const portalGradient = ctx.createRadialGradient(x + 60, y + 83, 5, x + 60, y + 83, 42);
  portalGradient.addColorStop(0, `rgba(228,255,255,${.72 + staticIntensity * .2})`);
  portalGradient.addColorStop(.36, "#47dce8");
  portalGradient.addColorStop(.72, "#5367cf");
  portalGradient.addColorStop(1, "#111c45");
  ctx.fillStyle = portalGradient;
  ctx.beginPath(); ctx.ellipse(x + 60, y + 84, 39, 50, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = "#aafaff";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#24364b";
  ctx.strokeStyle = "#101d2c";
  ctx.lineWidth = 4;
  ctx.beginPath(); ctx.roundRect(x - 8, y + height - 16, width + 16, 22, 7); ctx.fill(); ctx.stroke();

  ctx.fillStyle = "#e8f5f7";
  ctx.strokeStyle = "#26384d";
  ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(x + 60, y + 18, 21, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = "#3b63a0";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + 60, y + 18); ctx.lineTo(x + 60 - Math.sin(time * 2.2) * 11, y + 18 - Math.cos(time * 2.2) * 11);
  ctx.moveTo(x + 60, y + 18); ctx.lineTo(x + 60 + Math.sin(time * 4.4) * 7, y + 18 + Math.cos(time * 4.4) * 7);
  ctx.stroke();
  ctx.fillStyle = "#3b63a0";
  ctx.beginPath(); ctx.arc(x + 60, y + 18, 3, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function drawTemporalStatic(time, intensity) {
  if (intensity <= 0) return;
  const centerX = 885;
  const centerY = 333;
  ctx.save();
  ctx.lineCap = "round";
  for (let index = 0; index < 18; index++) {
    const angle = index / 18 * Math.PI * 2 + time * (index % 2 ? -.9 : 1.2);
    const radius = 45 + (index % 4) * 13 + Math.sin(time * 13 + index) * 7;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius * .75;
    const length = 5 + index % 3 * 3;
    ctx.strokeStyle = index % 3 === 0 ? `rgba(255,255,255,${intensity})` : `rgba(86,235,255,${intensity * .9})`;
    ctx.lineWidth = 1.5 + index % 2;
    ctx.beginPath();
    ctx.moveTo(x - Math.cos(angle) * length, y - Math.sin(angle) * length);
    ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
    ctx.stroke();
  }

  ctx.strokeStyle = `rgba(215,252,255,${intensity})`;
  ctx.lineWidth = 2.5;
  for (let arc = 0; arc < 4; arc++) {
    const startY = 275 + arc * 32 + Math.sin(time * 19 + arc) * 8;
    ctx.beginPath();
    ctx.moveTo(822, startY);
    for (let step = 1; step <= 6; step++) {
      ctx.lineTo(822 + step * 21, startY + Math.sin(time * 31 + arc * 4 + step * 2) * 12);
    }
    ctx.stroke();
  }
  ctx.restore();
}

function drawRewindPower(time, pose) {
  if (time < 7.45) return;
  const progress = cutsceneEase((time - 7.45) / 1.25);
  const centerX = pose.x + PLAYER_W / 2;
  const centerY = pose.y + PLAYER_H / 2;

  ctx.save();
  for (let echo = 1; echo <= 4; echo++) {
    drawCutsceneSlime({ ...pose, x: pose.x + echo * 19, powered: false }, time - echo * .08, progress * (.2 - echo * .03));
  }
  ctx.translate(centerX, centerY);
  ctx.strokeStyle = `rgba(126,241,255,${progress})`;
  ctx.fillStyle = `rgba(126,241,255,${progress})`;
  ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(0, 0, 46, .35, Math.PI * 1.75); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-43, -15); ctx.lineTo(-52, -4); ctx.lineTo(-36, -2); ctx.closePath(); ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = progress;
  ctx.textAlign = "center";
  ctx.fillStyle = "#9df8ff";
  ctx.shadowColor = "#51dff4";
  ctx.shadowBlur = 18;
  ctx.font = "900 15px Inter, sans-serif";
  ctx.fillText("POWER AWAKENED", VIEW_W / 2, 82);
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 44px Inter, sans-serif";
  ctx.fillText("REWIND", VIEW_W / 2, 126);
  ctx.restore();
}

function drawCutscene(time) {
  const sceneTime = cutsceneTime;
  const gradient = ctx.createLinearGradient(0, 0, 0, VIEW_H);
  gradient.addColorStop(0, "#10183f");
  gradient.addColorStop(.58, "#435887");
  gradient.addColorStop(1, "#d28b72");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);

  ctx.fillStyle = "#ffffffba";
  for (let index = 0; index < 34; index++) {
    const x = (index * 83 + 31) % VIEW_W;
    const y = 48 + (index * 47) % 235;
    const radius = 1 + (index % 3) * .45;
    ctx.globalAlpha = .45 + Math.sin(time * .003 + index) * .25;
    ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#1c2947aa";
  ctx.beginPath(); ctx.moveTo(0, 390);
  for (let x = 0; x <= VIEW_W; x += 80) ctx.lineTo(x, 300 + Math.sin(x * .013) * 55);
  ctx.lineTo(VIEW_W, VIEW_H); ctx.lineTo(0, VIEW_H); ctx.fill();

  const cutscenePlatforms = [
    [0, 460, 220, 90], [280, 410, 165, 140], [500, 450, 160, 100], [720, 390, 240, 160]
  ];
  for (const [x, y, width, height] of cutscenePlatforms) drawAssetRectangle("grass", x, y, width, height);

  const pose = cutsceneSlimePose(sceneTime);
  if (pose.powered) drawRewindPower(sceneTime, pose);
  const staticStart = Math.max(0, Math.min(1, (sceneTime - 5.85) / .65));
  const staticEnd = sceneTime > 7.45 ? Math.max(0, 1 - (sceneTime - 7.45) / 1.2) : 1;
  const staticIntensity = staticStart * staticEnd;
  const insideAlpha = pose.inside ? .72 + Math.sin(sceneTime * 35) * .25 : 1;
  if (!pose.powered) drawCutsceneSlime(pose, sceneTime, insideAlpha);
  drawTimeMachine(sceneTime, staticIntensity);
  drawTemporalStatic(sceneTime, staticIntensity);
  if (pose.powered) drawCutsceneSlime(pose, sceneTime);

  if (sceneTime < 1.4) {
    ctx.save();
    ctx.globalAlpha = Math.min(1, sceneTime / .5) * Math.max(0, 1 - (sceneTime - 1) / .4);
    ctx.fillStyle = "#eaf9ff";
    ctx.textAlign = "center";
    ctx.font = "800 18px Inter, sans-serif";
    ctx.fillText("BEYOND THE LAST SUMMIT...", VIEW_W / 2, 64);
    ctx.restore();
  }

  const zapDistance = Math.abs(sceneTime - 6.72);
  if (zapDistance < .24) {
    ctx.fillStyle = `rgba(230,253,255,${(1 - zapDistance / .24) * .9})`;
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  }

  const fadeIn = Math.max(0, 1 - sceneTime / .45);
  const fadeOut = Math.max(0, (sceneTime - (CUTSCENE_DURATION - .75)) / .75);
  ctx.fillStyle = `rgba(4,8,22,${Math.max(fadeIn, fadeOut)})`;
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  ctx.fillStyle = "#02040b";
  ctx.fillRect(0, 0, VIEW_W, 24);
  ctx.fillRect(0, VIEW_H - 24, VIEW_W, 24);
}

function render(time) {
  ctx.clearRect(0, 0, VIEW_W, VIEW_H);
  if (cutsceneActive) {
    drawCutscene(time);
    return;
  }
  drawBackground();
  for (const p of currentLevel().platforms) drawPlatform(p, time);
  for (const levelSwitch of currentLevel().switches || []) drawSwitch(levelSwitch, time);
  for (const pad of currentLevel().jumpPads || []) drawJumpPad(pad, time);
  for (const h of currentLevel().hazards) drawHazard(h, time);
  currentLevel().stars.forEach(([x, y], i) => drawStar(x, y, i, time));
  drawFlag(currentLevel().finish);
  drawBlockDebris();
  if (deathTimer > 0) drawDeathParticles();
  else drawPlayer(time);
  if (levelTransition > 0) {
    ctx.fillStyle = `rgba(255,255,255,${Math.sin((.65 - levelTransition) / .65 * Math.PI) * .65})`;
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  }
}

function frame(time) {
  accumulator += Math.min(.05, (time - lastTime) / 1000);
  lastTime = time;
  while (accumulator >= STEP) { update(STEP); accumulator -= STEP; }
  updateMenuAnimation(time);
  updateTimerHud();
  render(time);
  requestAnimationFrame(frame);
}

loadLevel(0, false);
requestAnimationFrame(frame);
