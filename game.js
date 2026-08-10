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
const mainMenu = document.querySelector("#mainMenu");
const playButton = document.querySelector("#playButton");
const settingsButton = document.querySelector("#settingsButton");
const settingsPanel = document.querySelector("#settingsPanel");
const volumeInput = document.querySelector("#volumeInput");
const volumeValue = document.querySelector("#volumeValue");

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
  }
];

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

const spriteSheet = new Image();
let spritesReady = false;
spriteSheet.addEventListener("load", () => { spritesReady = true; });
spriteSheet.src = "assets/platformer-assets.png";

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

function setVolume(value) {
  masterVolume = Math.max(0, Math.min(1, Number(value) / 100));
  const percent = Math.round(masterVolume * 100);
  volumeInput.value = String(percent);
  volumeValue.textContent = `${percent}%`;
  try { localStorage.setItem("platforms-volume", String(percent)); } catch { /* Storage may be unavailable. */ }
}

try {
  const savedVolume = localStorage.getItem("platforms-volume");
  if (savedVolume !== null) volumeInput.value = savedVolume;
} catch { /* Use the default volume. */ }
setVolume(volumeInput.value);

playButton.addEventListener("click", () => {
  gameStarted = true;
  mainMenu.hidden = true;
  settingsPanel.hidden = true;
  restartButton.disabled = false;
  canvas.focus();
});

settingsButton.addEventListener("click", () => {
  const opening = settingsPanel.hidden;
  settingsPanel.hidden = !opening;
  settingsButton.setAttribute("aria-expanded", String(opening));
  if (opening) volumeInput.focus();
});

volumeInput.addEventListener("input", () => setVolume(volumeInput.value));

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
  const box = playerBox();
  for (const solid of currentLevel().platforms) {
    if (!overlaps(box, solid)) continue;
    if (player.vy > 0) { player.y = solid.y - PLAYER_H; player.grounded = true; }
    else if (player.vy < 0) player.y = solid.y + solid.h;
    player.vy = 0;
    box.y = player.y;
  }
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
  moveAndCollideY(dt);
  player.x = Math.max(0, Math.min(currentLevel().width - PLAYER_W, player.x));

  const box = playerBox();
  if (player.y > VIEW_H + 100) {
    resetPlayer(true);
    return;
  }
  if (currentLevel().hazards.some((hazard) => overlaps(box, hazard))) {
    startSpikeDeath();
    return;
  }

  currentLevel().stars.forEach(([x, y], i) => {
    const star = { x: x - 15, y: y - 15, w: 30, h: 30 };
    if (!collected[i] && overlaps(box, star)) { collected[i] = true; totalStars++; updateHud(); }
  });

  if (overlaps(box, currentLevel().finish)) {
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
  const gradient = ctx.createLinearGradient(0, 0, 0, VIEW_H);
  gradient.addColorStop(0, "#5ac8fa"); gradient.addColorStop(.62, "#b9edff"); gradient.addColorStop(1, "#edfaff");
  ctx.fillStyle = gradient; ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  ctx.fillStyle = "#ffffff7a";
  for (let i = -1; i < 7; i++) {
    const x = ((i * 230 - cameraX * .14) % 1500) - 80;
    ctx.beginPath(); ctx.ellipse(x, 125 + (i % 3) * 54, 60, 20, 0, 0, Math.PI * 2); ctx.ellipse(x + 42, 118 + (i % 3) * 54, 38, 27, 0, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = "#6798a966";
  ctx.beginPath(); ctx.moveTo(0, 420);
  for (let x = 0; x <= VIEW_W; x += 100) ctx.lineTo(x, 330 + Math.sin((x + cameraX * .09) * .009) * 45);
  ctx.lineTo(VIEW_W, VIEW_H); ctx.lineTo(0, VIEW_H); ctx.fill();
}

function drawPlatform(p) {
  const x = p.x - cameraX;
  if (x + p.w < -80 || x > VIEW_W + 80) return;
  if (p.kind === "crate" && p.w <= 100 && drawSprite(2, x, p.y, p.w, p.h)) return;
  const tile = p.kind === "stone" ? 1 : 0;
  if (spritesReady) {
    for (let tx = 0; tx < p.w; tx += 64) {
      const w = Math.min(64, p.w - tx);
      drawSprite(tile, x + tx, p.y, w, Math.min(82, p.h));
    }
    if (p.h > 80) { ctx.fillStyle = p.kind === "stone" ? "#606b78" : "#85502c"; ctx.fillRect(x, p.y + 78, p.w, p.h - 78); }
    return;
  }
  ctx.fillStyle = p.kind === "stone" ? "#657383" : p.kind === "crate" ? "#a76728" : "#8b542e";
  roundedRect(x, p.y, p.w, p.h, 6);
  ctx.fillStyle = p.kind === "stone" ? "#9aa9b5" : p.kind === "crate" ? "#d7963c" : "#61bb3c";
  ctx.fillRect(x, p.y, p.w, Math.min(13, p.h));
  ctx.strokeStyle = "#ffffff22"; ctx.lineWidth = 2;
  for (let tx = 0; tx < p.w; tx += 44) ctx.strokeRect(x + tx, p.y + 14, Math.min(44, p.w - tx), Math.min(42, p.h - 14));
}

function drawHazard(h) {
  const x = h.x - cameraX;
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
  for (const h of currentLevel().hazards) drawHazard(h);
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
  render(time);
  requestAnimationFrame(frame);
}

loadLevel(0, false);
requestAnimationFrame(frame);
