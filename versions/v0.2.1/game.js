"use strict";

const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
const levelLabel = document.querySelector("#levelLabel");
const starLabel = document.querySelector("#starLabel");
const message = document.querySelector("#message");
const scoreSummary = document.querySelector("#scoreSummary");
const gameShell = document.querySelector(".game-shell");
const fullscreenButton = document.querySelector("#fullscreenButton");
const restartButton = document.querySelector("#restartButton");
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
const COYOTE_TIME = 0.1;
const JUMP_BUFFER = 0.12;
const DEATH_DURATION = 0.42;

const R = (x, y, w, h, kind = "grass") => ({ x, y, w, h, kind });
const levels = [
  {
    name: "Meadow Run", width: 1680, start: [75, 430],
    platforms: [R(0,490,390,80), R(470,445,190,125), R(730,390,165,180), R(980,455,210,115), R(1280,405,180,165), R(1530,480,150,90), R(245,390,95,30,"crate")],
    hazards: [R(390,472,80,18), R(660,472,70,18), R(1190,472,90,18), R(1460,472,70,18)],
    stars: [[290,345],[565,400],[810,345],[1085,410],[1365,360]], finish: R(1595,390,34,90)
  },
  {
    name: "Canyon Climb", width: 1900, start: [55, 430],
    platforms: [R(0,490,260,80,"stone"), R(330,430,160,140,"stone"), R(555,355,135,215,"stone"), R(760,455,170,115,"stone"), R(1010,375,155,195,"stone"), R(1235,300,145,270,"stone"), R(1460,410,170,160,"stone"), R(1700,475,200,95,"stone"), R(835,325,64,64,"crate")],
    hazards: [R(260,472,70,18), R(490,472,65,18), R(690,472,70,18), R(930,472,80,18), R(1165,472,70,18), R(1380,472,80,18), R(1630,472,70,18)],
    stars: [[410,385],[620,310],[845,280],[1085,330],[1305,255],[1545,365]], finish: R(1800,385,34,90)
  },
  {
    name: "Cloudtop Keep", width: 2100, start: [45, 430],
    platforms: [R(0,490,220,80), R(295,420,135,150), R(500,330,145,240), R(715,430,145,140), R(930,345,150,225), R(1160,445,140,125), R(1380,350,150,220), R(1610,275,145,295), R(1835,420,265,150), R(750,345,58,58,"crate"), R(1200,365,58,80,"crate")],
    hazards: [R(220,472,75,18), R(430,472,70,18), R(645,472,70,18), R(860,472,70,18), R(1080,472,80,18), R(1300,472,80,18), R(1530,472,80,18), R(1755,472,80,18)],
    stars: [[355,375],[570,285],[785,300],[1005,300],[1230,320],[1455,305],[1680,230]], finish: R(1990,330,34,90)
  },
  {
    name: "Ruined Causeway", width: 2350, start: [45, 430], music: "level2",
    platforms: [R(0,490,260,80,"stone"), R(330,430,200,140,"stone"), R(600,350,160,220,"stone"), R(830,420,200,150,"stone"), R(1100,310,160,260,"stone"), R(1330,390,180,180,"stone"), R(1590,285,160,285,"stone"), R(1830,400,220,170,"stone"), R(2140,475,210,95,"stone"), R(930,355,64,65,"crate"), R(1420,330,60,60,"crate")],
    hazards: [R(260,472,70,18), R(530,472,70,18), R(760,472,70,18), R(1030,472,70,18), R(1260,472,70,18), R(1510,472,80,18), R(1750,472,80,18), R(2050,472,90,18)],
    stars: [[430,375],[680,285],[955,305],[1180,245],[1420,285],[1670,220],[1940,335],[2205,420]], finish: R(2260,385,34,90)
  },
  {
    name: "Magma Galleries", width: 2600, start: [45, 430], music: "level2", theme: "lava",
    platforms: [R(0,490,240,80,"stone"), R(330,440,170,130,"stone"), R(580,360,160,210,"stone"), R(820,430,210,140,"stone"), R(1120,330,170,240,"stone"), R(1370,410,170,160,"stone"), R(1630,300,180,270,"stone"), R(1900,390,200,180,"stone"), R(2190,310,180,260,"stone"), R(2450,470,150,100,"stone"), R(900,370,60,60,"crate")],
    hazards: [R(240,490,90,80,"lava"), R(500,490,80,80,"lava"), R(740,490,80,80,"lava"), R(1030,490,90,80,"lava"), R(1290,490,80,80,"lava"), R(1540,490,90,80,"lava"), R(1810,490,90,80,"lava"), R(2100,490,90,80,"lava"), R(2370,490,80,80,"lava")],
    stars: [[415,385],[660,300],[925,325],[1205,265],[1455,345],[1720,235],[2000,325],[2280,245],[2505,415]], finish: R(2520,380,34,90)
  },
  {
    name: "Ember Ascent", width: 2800, start: [45, 430], music: "level3", theme: "lava",
    platforms: [R(0,490,220,80,"stone"), R(290,410,160,160,"stone"), R(530,320,140,250,"stone"), R(750,400,180,170,"stone"), R(1010,290,140,280,"stone"), R(1230,370,200,200,"stone"), R(1510,260,150,310,"stone"), R(1740,350,200,220,"stone"), R(2020,245,160,325,"stone"), R(2260,335,190,235,"stone"), R(2530,455,270,115,"stone"), R(835,340,60,60,"crate"), R(1825,290,60,60,"crate")],
    hazards: [R(220,490,70,80,"lava"), R(450,490,80,80,"lava"), R(670,490,80,80,"lava"), R(930,490,80,80,"lava"), R(1150,490,80,80,"lava"), R(1430,490,80,80,"lava"), R(1660,490,80,80,"lava"), R(1940,490,80,80,"lava"), R(2180,490,80,80,"lava"), R(2450,490,80,80,"lava")],
    stars: [[370,345],[600,250],[855,290],[1080,220],[1335,300],[1585,190],[1840,285],[2100,175],[2355,265],[2660,390]], finish: R(2690,365,34,90)
  },
  {
    name: "Clockwork Cliffs", width: 3000, start: [45, 430], music: "level2",
    platforms: [R(0,490,280,80,"stone"), R(360,420,190,150,"stone"), R(620,340,170,230,"stone"), R(870,440,200,130,"stone"), R(1150,335,170,235,"stone"), R(1400,415,200,155,"stone"), R(1680,315,160,255,"stone"), R(1920,390,220,180,"stone"), R(2220,285,180,285,"stone"), R(2490,380,180,190,"stone"), R(2750,470,250,100,"stone"), R(950,376,64,64,"crate"), R(2010,330,60,60,"crate")],
    hazards: [R(280,472,80,18), R(550,472,70,18), R(790,472,80,18), R(1070,472,80,18), R(1320,472,80,18), R(1600,472,80,18), R(1840,472,80,18), R(2140,472,80,18), R(2400,472,90,18), R(2670,472,80,18)],
    stars: [[455,355],[705,275],[980,330],[1235,270],[1500,350],[1760,250],[2030,325],[2310,215],[2580,315],[2840,415]], finish: R(2900,380,34,90)
  },
  {
    name: "Ashen Crossing", width: 3200, start: [45, 430], music: "level2", theme: "lava",
    platforms: [R(0,490,220,80,"stone"), R(300,390,180,180,"stone"), R(560,300,160,270,"stone"), R(800,400,220,170,"stone"), R(1100,290,170,280,"stone"), R(1350,370,210,200,"stone"), R(1640,265,160,305,"stone"), R(1880,350,220,220,"stone"), R(2180,245,180,325,"stone"), R(2440,335,200,235,"stone"), R(2720,235,170,335,"stone"), R(2970,455,230,115,"stone"), R(880,340,60,60,"crate"), R(2510,275,60,60,"crate")],
    hazards: [R(220,490,80,80,"lava"), R(480,490,80,80,"lava"), R(720,490,80,80,"lava"), R(1020,490,80,80,"lava"), R(1270,490,80,80,"lava"), R(1560,490,80,80,"lava"), R(1800,490,80,80,"lava"), R(2100,490,80,80,"lava"), R(2360,490,80,80,"lava"), R(2640,490,80,80,"lava"), R(2890,490,80,80,"lava")],
    stars: [[390,325],[640,230],[910,285],[1185,220],[1450,300],[1720,195],[1990,280],[2270,175],[2535,240],[2805,165],[3065,390]], finish: R(3100,365,34,90)
  },
  {
    name: "Skyforge Gauntlet", width: 3400, start: [45, 430], music: "level3", theme: "lava",
    platforms: [R(0,490,240,80,"stone"), R(310,430,160,140,"stone"), R(540,350,150,220,"stone"), R(760,450,190,120,"stone"), R(1020,340,150,230,"stone"), R(1240,260,180,310,"stone"), R(1490,370,200,200,"stone"), R(1760,270,140,300,"stone"), R(1970,390,220,180,"stone"), R(2260,285,160,285,"stone"), R(2490,365,200,205,"stone"), R(2760,255,160,315,"stone"), R(2990,345,180,225,"stone"), R(3240,455,160,115,"stone"), R(1300,200,60,60,"crate"), R(2050,330,60,60,"crate")],
    hazards: [R(240,490,70,80,"lava"), R(470,472,70,18), R(690,490,70,80,"lava"), R(950,472,70,18), R(1170,490,70,80,"lava"), R(1420,472,70,18), R(1690,490,70,80,"lava"), R(1900,472,70,18), R(2190,490,70,80,"lava"), R(2420,472,70,18), R(2690,490,70,80,"lava"), R(2920,472,70,18), R(3170,490,70,80,"lava")],
    stars: [[390,375],[615,285],[855,395],[1095,275],[1330,155],[1585,305],[1830,205],[2075,280],[2340,220],[2585,300],[2840,185],[3080,280],[3295,400]], finish: R(3310,365,34,90)
  },
  {
    name: "Edge of Tomorrow", width: 3650, start: [45, 430], music: "level3", theme: "lava",
    platforms: [R(0,490,220,80,"stone"), R(290,400,150,170,"stone"), R(510,300,150,270,"stone"), R(730,390,170,180,"stone"), R(970,280,150,290,"stone"), R(1190,380,200,190,"stone"), R(1460,270,150,300,"stone"), R(1680,360,200,210,"stone"), R(1950,250,160,320,"stone"), R(2180,350,200,220,"stone"), R(2450,240,160,330,"stone"), R(2680,340,190,230,"stone"), R(2940,230,170,340,"stone"), R(3180,330,190,240,"stone"), R(3440,450,210,120,"stone"), R(790,330,60,60,"crate"), R(2250,290,60,60,"crate"), R(3010,170,60,60,"crate")],
    hazards: [R(220,490,70,80,"lava"), R(440,472,70,18), R(660,490,70,80,"lava"), R(900,472,70,18), R(1120,490,70,80,"lava"), R(1390,472,70,18), R(1610,490,70,80,"lava"), R(1880,472,70,18), R(2110,490,70,80,"lava"), R(2380,472,70,18), R(2610,490,70,80,"lava"), R(2870,472,70,18), R(3110,490,70,80,"lava"), R(3370,472,70,18)],
    stars: [[365,335],[585,225],[815,275],[1045,210],[1290,315],[1535,200],[1780,295],[2030,180],[2280,235],[2530,170],[2775,275],[3035,125],[3275,265],[3525,395]], finish: R(3540,360,34,90)
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
const player = { x: 0, y: 0, vx: 0, vy: 0, grounded: false, facing: 1, coyote: 0, jumpBuffer: 0 };
let levelIndex = 0;
let collected = [];
let totalStars = 0;
let deaths = 0;
let cameraX = 0;
let accumulator = 0;
let lastTime = performance.now();
let won = false;
let levelTransition = 0;
let deathTimer = 0;
let deathParticles = [];
let gameStarted = false;
let masterVolume = 1;
let audioContext = null;
let masterGain = null;
let musicGain = null;
let sfxGain = null;
let musicTimer = null;
let currentTrack = "menu";
let musicStep = 0;
let nextMusicNoteTime = 0;
const activeMusicVoices = new Set();

const spriteSheet = new Image();
let spritesReady = false;
spriteSheet.addEventListener("load", () => { spritesReady = true; });
spriteSheet.src = "../assets/platformer-assets.png";

function currentLevel() { return levels[levelIndex]; }
function overlaps(a, b) { return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y; }
function playerBox() { return { x: player.x, y: player.y, w: PLAYER_W, h: PLAYER_H }; }

function resetPlayer(countDeath = false) {
  if (countDeath) deaths++;
  deathTimer = 0;
  deathParticles = [];
  const [x, y] = currentLevel().start;
  Object.assign(player, { x, y, vx: 0, vy: 0, grounded: false, coyote: 0, jumpBuffer: 0 });
  cameraX = Math.max(0, x - VIEW_W * .3);
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

function loadLevel(index, keepScore = true) {
  levelIndex = index;
  collected = currentLevel().stars.map(() => false);
  if (!keepScore) { totalStars = 0; deaths = 0; }
  levelTransition = 0;
  won = false;
  message.hidden = true;
  resetPlayer(false);
  updateHud();
  if (gameStarted) startMusic(currentLevel().music || `level${index + 1}`);
}

function restartLevel() {
  const gained = collected.filter(Boolean).length;
  totalStars = Math.max(0, totalStars - gained);
  collected.fill(false);
  resetPlayer(true);
  updateHud();
}

function updateHud() {
  levelLabel.textContent = `Level ${levelIndex + 1} / ${levels.length} — ${currentLevel().name}`;
  starLabel.textContent = `Stars ${collected.filter(Boolean).length} / ${collected.length}`;
}

function setKey(code, down) {
  if (["ArrowLeft", "KeyA"].includes(code)) input.left = down;
  if (["ArrowRight", "KeyD"].includes(code)) input.right = down;
  if (["ArrowUp", "KeyW", "Space"].includes(code)) {
    if (down && !input.jump) pressed.jump = true;
    input.jump = down;
  }
}

addEventListener("keydown", (event) => {
  if (!gameStarted) return;
  if (["ArrowLeft", "ArrowRight", "ArrowUp", "Space"].includes(event.code)) event.preventDefault();
  if (event.code === "KeyR") restartLevel();
  if (event.code === "Enter" && won) startOver();
  setKey(event.code, true);
});
addEventListener("keyup", (event) => { if (gameStarted) setKey(event.code, false); });
addEventListener("blur", () => Object.assign(input, { left: false, right: false, jump: false }));
restartButton.addEventListener("click", restartLevel);
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

playButton.addEventListener("click", () => {
  gameStarted = true;
  startMusic("level1");
  ensureAudio();
  mainMenu.hidden = true;
  settingsPanel.hidden = true;
  restartButton.disabled = false;
  quitButton.disabled = false;
  canvas.focus();
});

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
    if (control === "jump" && down && !input.jump) pressed.jump = true;
    input[control] = down;
  };
  button.addEventListener("pointerdown", (event) => { event.preventDefault(); button.setPointerCapture(event.pointerId); set(true); });
  button.addEventListener("pointerup", () => set(false));
  button.addEventListener("pointercancel", () => set(false));
  button.addEventListener("lostpointercapture", () => set(false));
});

function startOver() { totalStars = 0; deaths = 0; loadLevel(0, false); }

function quitRun() {
  gameStarted = false;
  Object.assign(input, { left: false, right: false, jump: false });
  pressed.jump = false;
  restartButton.disabled = true;
  quitButton.disabled = true;
  settingsPanel.hidden = true;
  settingsButton.setAttribute("aria-expanded", "false");
  loadLevel(0, false);
  mainMenu.hidden = false;
  startMusic("menu");
  playButton.focus();
}

function moveAndCollideX(dt) {
  player.x += player.vx * dt;
  const box = playerBox();
  for (const solid of currentLevel().platforms) {
    if (!overlaps(box, solid)) continue;
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
    if (!overlaps(box, solid)) continue;
    if (player.vy > 0) {
      landedOn = { kind: solid.kind, intensity: Math.max(.45, Math.min(1, player.vy / 700)) };
      player.y = solid.y - PLAYER_H;
      player.grounded = true;
    }
    else if (player.vy < 0) player.y = solid.y + solid.h;
    player.vy = 0;
    box.y = player.y;
  }
  return landedOn;
}

function update(dt) {
  if (!gameStarted) return;

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
  if (!input.jump && player.vy < -220) player.vy += GRAVITY * 1.55 * dt;
  player.vy = Math.min(player.vy + GRAVITY * dt, 900);

  moveAndCollideX(dt);
  const landedOn = moveAndCollideY(dt);
  if (!wasGrounded && landedOn) playSfx(`land-${landedOn.kind}`, landedOn.intensity);
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
    if (levelIndex === levels.length - 1) {
      won = true;
      scoreSummary.textContent = `${totalStars} stars collected · ${deaths} ${deaths === 1 ? "restart" : "restarts"}`;
      message.hidden = false;
      document.querySelector("#playAgainButton").focus();
    } else levelTransition = .65;
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

function seededNoise(seed) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

function drawPlatformBase(p, x, top) {
  const height = p.y + p.h - top;
  if (height <= 0) return;
  const stone = p.kind === "stone";
  ctx.save();
  ctx.beginPath(); ctx.rect(x, top, p.w, height); ctx.clip();

  const baseGradient = ctx.createLinearGradient(0, top, 0, top + Math.max(120, height));
  if (stone) {
    baseGradient.addColorStop(0, "#77828d");
    baseGradient.addColorStop(.22, "#66717d");
    baseGradient.addColorStop(1, "#4c5662");
  } else {
    baseGradient.addColorStop(0, "#925b35");
    baseGradient.addColorStop(.22, "#7c4b2e");
    baseGradient.addColorStop(1, "#583522");
  }
  ctx.fillStyle = baseGradient;
  ctx.fillRect(x, top, p.w, height);

  if (stone) {
    ctx.lineWidth = 2;
    for (let row = 0, y = top + 25; y < top + height; row++, y += 34) {
      ctx.strokeStyle = row % 2 ? "#3f495566" : "#414c586f";
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + p.w, y); ctx.stroke();
      const offset = row % 2 ? 22 : 0;
      for (let joint = offset; joint < p.w; joint += 46) {
        ctx.beginPath(); ctx.moveTo(x + joint, y - 34); ctx.lineTo(x + joint, y); ctx.stroke();
      }
      ctx.strokeStyle = "#aab3bb28";
      ctx.beginPath(); ctx.moveTo(x, y + 2); ctx.lineTo(x + p.w, y + 2); ctx.stroke();
    }
    for (let py = top + 12; py < top + height; py += 26) {
      for (let px = 12; px < p.w; px += 31) {
        const noise = seededNoise(p.x + px * 3 + py * 7);
        ctx.fillStyle = noise > .5 ? "#aeb6bd24" : "#3039442d";
        ctx.beginPath(); ctx.ellipse(x + px + noise * 8, py, 3 + noise * 3, 1.5 + noise * 2, noise, 0, Math.PI * 2); ctx.fill();
      }
    }
  } else {
    ctx.lineWidth = 2;
    for (let y = top + 25; y < top + height; y += 30) {
      ctx.strokeStyle = "#47291955";
      ctx.beginPath();
      for (let px = 0; px <= p.w; px += 14) {
        const waveY = y + Math.sin((p.x + px) * .075 + y) * 2.5;
        if (px === 0) ctx.moveTo(x + px, waveY); else ctx.lineTo(x + px, waveY);
      }
      ctx.stroke();
    }
    for (let py = top + 14; py < top + height; py += 27) {
      for (let px = 15; px < p.w; px += 34) {
        const noise = seededNoise(p.x * 5 + px * 11 + py * 3);
        ctx.fillStyle = noise > .48 ? "#b982522d" : "#39221635";
        ctx.beginPath(); ctx.ellipse(x + px + noise * 9, py, 2.5 + noise * 3, 1.5 + noise * 2, noise * 2, 0, Math.PI * 2); ctx.fill();
      }
    }
    ctx.strokeStyle = "#4b2a1d70";
    ctx.lineWidth = 2;
    for (let root = 18; root < p.w; root += 52) {
      const length = 18 + seededNoise(p.x + root) * 22;
      ctx.beginPath(); ctx.moveTo(x + root, top); ctx.quadraticCurveTo(x + root + 8, top + length * .5, x + root - 2, top + length); ctx.stroke();
    }
  }
  ctx.restore();
}

function drawPlatform(p) {
  const x = p.x - cameraX;
  if (x + p.w < -80 || x > VIEW_W + 80) return;
  if (p.kind === "crate") {
    if (p.w <= 100 && drawSprite(2, x, p.y, p.w, p.h)) return;
    ctx.fillStyle = "#a76728"; roundedRect(x, p.y, p.w, p.h, 6);
    ctx.fillStyle = "#d7963c"; ctx.fillRect(x, p.y, p.w, Math.min(13, p.h));
    return;
  }

  const tile = p.kind === "stone" ? 1 : 0;
  const topDepth = Math.min(82, p.h);
  drawPlatformBase(p, x, p.y + Math.min(70, topDepth));
  if (spritesReady) {
    for (let tx = 0; tx < p.w; tx += 64) {
      const w = Math.min(64, p.w - tx);
      drawSprite(tile, x + tx, p.y, w, topDepth);
    }
    return;
  }
  ctx.fillStyle = p.kind === "stone" ? "#77828d" : "#925b35";
  ctx.fillRect(x, p.y, p.w, topDepth);
  ctx.fillStyle = p.kind === "stone" ? "#aab3bb" : "#61bb3c";
  ctx.fillRect(x, p.y, p.w, Math.min(13, p.h));
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

function render(time) {
  ctx.clearRect(0, 0, VIEW_W, VIEW_H);
  drawBackground();
  for (const p of currentLevel().platforms) drawPlatform(p);
  for (const h of currentLevel().hazards) drawHazard(h, time);
  currentLevel().stars.forEach(([x, y], i) => drawStar(x, y, i, time));
  drawFlag(currentLevel().finish);
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
  render(time);
  requestAnimationFrame(frame);
}

loadLevel(0, false);
requestAnimationFrame(frame);
