const playfield = document.querySelector('#playfield');
const gameWorld = document.querySelector('#game-world');
const player = document.querySelector('#player');
const cloudLayer = document.querySelector('.clouds');
const foregroundCloudLayer = document.querySelector('.clouds-foreground');
const shipSprite = document.querySelector('#ship-sprite');
const projectileLayer = document.querySelector('#projectile-layer');
const powerupParticleLayer = document.querySelector('#powerup-particle-layer');
const enemyLayer = document.querySelector('#enemy-layer');
const powerupLayer = document.querySelector('#powerup-layer');
const startCard = document.querySelector('#start-card');
const gameOverCard = document.querySelector('#game-over-card');
const scoreNode = document.querySelector('#score');
const highScoreNode = document.querySelector('#high-score');
const finalScoreNode = document.querySelector('#final-score');
const waveLabel = document.querySelector('#wave-label');
const waveProgressNode = document.querySelector('#wave-progress');
const shieldStatus = document.querySelector('#shield-status');
const growthStatus = document.querySelector('#growth-status');
const ammoStatus = document.querySelector('#ammo-status');
const ammoHud = document.querySelector('#ammo-hud');
const ammoPips = [...document.querySelectorAll('.ammo-pip')];
const heartHud = document.querySelector('#heart-hud');
const heartNodes = [...heartHud.querySelectorAll('.heart')];

const IDLE_GIF = './public/assets/ship-idle.gif';
const SHIELD_IDLE_GIF = './public/assets/ship-idle-shield.gif';
const SHOOTING_GIF = './public/assets/ship-shoot.gif';
const SHIELD_GIF = './public/assets/ship-shield.gif';
const DEATH_GIF = './public/assets/ship-death.gif';
const DEATH_FRAMES = Array.from({ length: 8 }, (_, index) => `./public/assets/death-frames/frame-${String(index + 1).padStart(2, '0')}.png`);
const PROJECTILE_FRAMES = Array.from({ length: 6 }, (_, index) => `./public/assets/projectile${index + 1}.png`);
const SHIELD_POWERUP_IMAGE = './public/assets/durexnijunjun.png';
const GROWTH_POWERUP_IMAGE = './public/assets/viagranijunjun.png';
const AMMO_PACK_IMAGE = './public/assets/ammopack.png';
const ENEMY_ASSETS = [
  { name: 'knife', behavior: 'knife', src: './public/assets/kutsily.png', alphaBounds: [21, 13, 28, 41] },
  { name: 'arrow', behavior: 'arrow', src: './public/assets/arrow.png', alphaBounds: [21, 14, 27, 32] },
  { name: 'scissor', behavior: 'scissor', src: './public/assets/scissor.png', alphaBounds: [20, 12, 28, 35] },
  { name: 'cannonball', behavior: 'cannonball', src: './public/assets/cannonball.png', alphaBounds: [20, 21, 27, 28] },
  { name: 'axe', behavior: 'axe', src: './public/assets/axe.png', alphaBounds: [20, 15, 28, 31] },
  { name: 'sickle', behavior: 'sickle', src: './public/assets/sickle.png', alphaBounds: [16, 15, 28, 31] },
];
const SHIP_SIZE = 100;
const POWERUP_SIZE = 100;
const GROWTH_SCALE = 1.2;
const PLAYER_PIXEL_HALF_WIDTH = 20;
const PLAYER_PIXEL_HALF_HEIGHT = 40;
const MAX_AMMO = 15;
const FIRE_RATE_MS = 220;
const AMMO_RECHARGE_DELAY_MS = 4000;
const AMMO_RECHARGE_INTERVAL_MS = 900;
const EMPTY_AMMO_RECHARGE_DELAY_MS = 5000;
const AMMO_REARM_THRESHOLD = Math.ceil(MAX_AMMO / 2);
const EMPTY_AMMO_BYPASS_LIMIT = 3;
const SHOOT_ANIMATION_MS = 500;
const PROJECTILE_DELAY_MS = 70;
const PROJECTILE_FRAME_MS = 70;
const PROJECTILE_SIZE = 20;
const GROWN_PROJECTILE_SIZE = 28;
const SHIELD_DURATION_MS = 7000;
const GROWTH_DURATION_MS = 7000;
const AMMO_PACK_DURATION_MS = 7000;
const MAX_HEARTS = 3;
const INVULNERABILITY_MS = 900;
const POWERUP_WARNING_MS = 2500;
const FATAL_PAUSE_MS = 700;
const FATAL_CAMERA_PAN_MS = 2400;
const FATAL_RISE_MS = 1300;
const FATAL_EXTRA_PAUSE_MS = 180;
const FATAL_EXTRA_RISE_MS = 140;
const FATAL_TOP_HOLD_MS = 500;
const FATAL_DASH_MS = 85;
const FATAL_PRE_IMPACT_GAP_PX = 8;
const FATAL_RISE_PX = 96;
const FATAL_EXTRA_RISE_PX = 14;
const WAVE_KILL_TARGET = 5;
const ENTRY_WAIT_MS = 600;
const ENTRY_ROCKET_MS = 360;
const ENTRY_OVERSHOOT_HOLD_MS = 450;
const ENTRY_DRIFT_MS = 700;
const ENTRY_LOW_PAUSE_MS = 160;
const ENTRY_CORRECTION_UP_MS = 330;
const ENTRY_TINY_PAUSE_MS = 140;
const ENTRY_CORRECTION_DOWN_MS = 220;
const ENTRY_SETTLE_MS = 250;
const ENTRY_SETTLE_HOLD_MS = 300;
const CLOUD_WIDTH = 180;
const CLOUD_HEIGHT = 90;
const ENEMY_BEHAVIORS = {
  scissor: { name: 'scissor', size: 92, baseSpeed: 178, speedScale: 1.05, health: 1, canStrike: false },
  knife: { name: 'knife', size: 78, baseSpeed: 98, speedScale: 1, health: 1, canStrike: true, attackDistance: 190, telegraphScale: .9, strikeScale: .76, recoveryScale: .84 },
  axe: { name: 'axe', size: 126, baseSpeed: 130, speedScale: .88, wallSpeed: 220, health: 1, canStrike: false, trailEnabled: false },
  arrow: { name: 'arrow', size: 108, baseSpeed: 280, speedScale: 1.02, health: 1, canStrike: false },
  cannonball: { name: 'cannonball', size: 116, baseSpeed: 450, speedScale: .92, health: 1, canStrike: false },
  sickle: { name: 'sickle', size: 104, baseSpeed: 88, speedScale: .96, health: 1, canStrike: false, trailEnabled: false },
};
const CLOUD_TYPES = [
  { src: './public/assets/cloud1.png', width: CLOUD_WIDTH, height: CLOUD_HEIGHT, minSpeed: 82, maxSpeed: 112, maxDrift: 18 },
  { src: './public/assets/cloud2.png', width: CLOUD_WIDTH, height: CLOUD_HEIGHT, minSpeed: 58, maxSpeed: 78, maxDrift: 11 },
  { src: './public/assets/cloud3.png', width: CLOUD_WIDTH, height: CLOUD_HEIGHT, minSpeed: 48, maxSpeed: 68, maxDrift: 8 },
  { src: './public/assets/cloud4.png', width: CLOUD_WIDTH, height: CLOUD_HEIGHT, minSpeed: 72, maxSpeed: 98, maxDrift: 15 },
  { src: './public/assets/cloud5.png', width: CLOUD_WIDTH, height: CLOUD_HEIGHT, minSpeed: 88, maxSpeed: 118, maxDrift: 20 },
  { src: './public/assets/cloud6.png', width: CLOUD_WIDTH, height: CLOUD_HEIGHT, minSpeed: 76, maxSpeed: 104, maxDrift: 17 },
  { src: './public/assets/cloud7.png', width: CLOUD_WIDTH, height: CLOUD_HEIGHT, minSpeed: 52, maxSpeed: 72, maxDrift: 9 },
];
const keys = new Set();

let animationFrame = 0;
let lastTime = 0;
let nextAutoShotAt = 0;
let ammoRechargeAt = 0;
let reloadUntil = 0;
let emptyAmmoLockArmed = true;
let emptyAmmoBypassCount = 0;
let shootingUntil = 0;
let shotSerial = 0;
let idleSerial = 0;
let shieldSerial = 0;
let deathSerial = 0;
let deathSequenceActive = false;
let fatalSequenceActive = false;
let fatalSequence = null;
let entryCutsceneActive = false;
let entryCutscene = null;
let shieldedUntil = 0;
let grownUntil = 0;
let ammoBoostUntil = 0;
let nextPowerupAt = 2500;
let score = 0;
let hearts = MAX_HEARTS;
let ammo = MAX_AMMO;
let wave = 1;
let waveKills = 0;
let waveTransitionUntil = 0;
let running = false;
let playerPosition = { x: 0, y: 0 };
let enemies = [];
let projectiles = [];
let powerups = [];
let powerupParticles = [];
let invulnerableUntil = 0;
let hurtSerial = 0;
let powerupTransitionSerial = 0;
let nextPowerupParticleAt = 0;
let nextShotAllowedAt = 0;
let clouds = [];
let enemySpawnSerial = 0;

function padScore(value) { return String(value).padStart(6, '0'); }
function randomBetween(min, max) { return min + Math.random() * (max - min); }

function applyCloudDepth(cloud) {
  cloud.depth = randomBetween(.2, 1);
  cloud.scale = (.65 + cloud.depth * .65) * (cloud.oversized ? 2 : 1);
  cloud.width = Math.round(cloud.type.width * cloud.scale);
  cloud.height = Math.round(cloud.type.height * cloud.scale);
  const depthSpeed = .25 + cloud.depth * .35;
  cloud.direction = Math.random() < 0.5 ? -1 : 1;
  cloud.speed = randomBetween(cloud.type.minSpeed, cloud.type.maxSpeed) * depthSpeed;
  cloud.vx = cloud.direction * randomBetween(3, cloud.type.maxDrift) * depthSpeed;
  const opacity = cloud.foreground ? .12 + cloud.depth * .18 : .18 + cloud.depth * .34;
  cloud.node.style.opacity = String(opacity);
  cloud.node.style.width = `${cloud.width}px`;
  cloud.node.style.height = `${cloud.height}px`;
}

function createClouds() {
  cloudLayer.replaceChildren();
  foregroundCloudLayer.replaceChildren();
  clouds = Array.from({ length: 13 }, (_, index) => {
    const type = CLOUD_TYPES[index % CLOUD_TYPES.length];
    const foreground = index % 5 === 0;
    const oversized = index % 7 === 0;
    const cloud = { type, x: 0, y: 0, speed: 0, vx: 0, direction: 1, depth: 0, scale: 1, width: type.width, height: type.height, foreground, oversized, flipped: Math.random() < 0.5, node: document.createElement('img') };
    cloud.node.className = 'cloud';
    cloud.node.src = type.src;
    cloud.node.alt = '';
    cloud.node.width = type.width;
    cloud.node.height = type.height;
    applyCloudDepth(cloud);
    cloud.x = randomBetween(0, Math.max(0, playfield.clientWidth - cloud.width));
    cloud.y = randomBetween(-cloud.height, playfield.clientHeight);
    (foreground ? foregroundCloudLayer : cloudLayer).append(cloud.node);
    return cloud;
  });
}

function updateClouds(delta) {
  const height = playfield.clientHeight;
  clouds.forEach((cloud) => {
    cloud.y += cloud.speed * delta;
    cloud.x += cloud.vx * delta;
    if (cloud.y > height + cloud.height) {
      applyCloudDepth(cloud);
      cloud.x = randomBetween(0, Math.max(0, playfield.clientWidth - cloud.width));
      cloud.y = -cloud.height - randomBetween(0, 80);
    }
    if (cloud.x < -cloud.width) cloud.x = playfield.clientWidth + randomBetween(2, 20);
    if (cloud.x > playfield.clientWidth + 2) cloud.x = -cloud.width - randomBetween(2, 20);
    cloud.node.style.transform = `translate(${Math.round(cloud.x)}px, ${Math.round(cloud.y)}px) scaleX(${cloud.flipped ? -1 : 1})`;
  });
}

function setPlayerPosition(x, y) {
  playerPosition = { x, y };
  player.style.left = `${x}px`;
  player.style.top = `${y}px`;
}

function getPlayerSize(now = performance.now()) {
  return grownUntil > now ? SHIP_SIZE * GROWTH_SCALE : SHIP_SIZE;
}

function getPlayerPixelBounds(now = performance.now()) {
  const scale = getPlayerSize(now) / SHIP_SIZE;
  return {
    halfWidth: PLAYER_PIXEL_HALF_WIDTH * scale,
    halfHeight: PLAYER_PIXEL_HALF_HEIGHT * scale,
  };
}

function clampPlayerToBounds(now = performance.now()) {
  const { halfWidth, halfHeight } = getPlayerPixelBounds(now);
  setPlayerPosition(
    Math.max(halfWidth, Math.min(playfield.clientWidth - halfWidth, playerPosition.x)),
    Math.max(halfHeight, Math.min(playfield.clientHeight - halfHeight, playerPosition.y)),
  );
}

function resetPlayer() {
  setPlayerPosition(playfield.clientWidth / 2, playfield.clientHeight - 70);
  player.style.opacity = '1';
  player.classList.remove('is-shielded');
  player.classList.remove('is-grown');
  player.classList.remove('is-hurt', 'is-powerup-activating', 'is-powerup-switching', 'is-powerup-expiring');
  player.style.removeProperty('--flicker-speed');
  player.style.display = 'block';
  player.classList.remove('is-death-flash', 'is-bam');
  deathSequenceActive = false;
  clearPowerupParticles();
}

function setIdle() {
  if (shootingUntil > performance.now()) return;
  if (shieldedUntil > performance.now()) {
    player.classList.add('is-shielded');
    shipSprite.src = `${SHIELD_IDLE_GIF}?shield-idle=${shieldSerial}`;
    shipSprite.dataset.state = 'shielded';
    return;
  }
  player.classList.remove('is-shielded');
  idleSerial += 1;
  shipSprite.src = `${IDLE_GIF}?idle=${idleSerial}`;
  shipSprite.dataset.state = 'idle';
}

function activateShield(now) {
  triggerPowerupTransition('shield', now);
  shieldedUntil = now + SHIELD_DURATION_MS;
  shieldSerial += 1;
  player.classList.add('is-shielded');
  shipSprite.src = `${SHIELD_IDLE_GIF}?shield-idle=${shieldSerial}`;
  shipSprite.dataset.state = 'shielded';
  window.setTimeout(() => {
    if (performance.now() >= shieldedUntil && performance.now() >= shootingUntil) setIdle();
  }, SHIELD_DURATION_MS);
}

function activateGrowth(now) {
  triggerPowerupTransition('growth', now);
  grownUntil = now + GROWTH_DURATION_MS;
  player.classList.add('is-grown');
  clampPlayerToBounds(now);
  window.setTimeout(() => {
    if (performance.now() >= grownUntil) player.classList.remove('is-grown');
  }, GROWTH_DURATION_MS);
}

function activateAmmoPack(now) {
  triggerPowerupTransition('ammo', now);
  ammoBoostUntil = Math.max(ammoBoostUntil, now) + AMMO_PACK_DURATION_MS;
  if (ammo > 0 && ammo < MAX_AMMO) {
    const boostedDelay = now + Math.round(AMMO_RECHARGE_DELAY_MS / 3);
    ammoRechargeAt = ammoRechargeAt === 0 ? boostedDelay : Math.min(ammoRechargeAt, boostedDelay);
  }
}

function getAmmoRechargeMultiplier(now) {
  return ammoBoostUntil > now ? 3 : 1;
}

function triggerPowerupTransition(type, now) {
  const replacingActivePowerup = shieldedUntil > now || grownUntil > now;
  powerupTransitionSerial += 1;
  const transition = powerupTransitionSerial;
  player.classList.remove('is-powerup-activating', 'is-powerup-switching');
  void player.offsetWidth;
  player.dataset.powerup = type;
  player.classList.add(replacingActivePowerup ? 'is-powerup-switching' : 'is-powerup-activating');
  emitPowerupParticles(now, 8);
  nextPowerupParticleAt = now + 260;
  window.setTimeout(() => {
    if (transition === powerupTransitionSerial) player.classList.remove('is-powerup-activating', 'is-powerup-switching');
  }, 360);
}

function clearPowerupParticles() {
  powerupParticles.forEach((particle) => particle.node.remove());
  powerupParticles = [];
}

function emitPowerupParticles(now, count = 1) {
  const expiring = [shieldedUntil, grownUntil].some((until) => until > now && until - now <= POWERUP_WARNING_MS);
  for (let index = 0; index < count; index += 1) {
    const angle = randomBetween(0, Math.PI * 2);
    const speed = randomBetween(34, 74);
    const particle = {
      x: randomBetween(34, 66),
      y: randomBetween(34, 66),
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      age: 0,
      life: randomBetween(260, expiring ? 430 : 560),
      node: document.createElement('i'),
    };
    particle.node.className = 'powerup-particle';
    particle.node.style.width = `${Math.random() < 0.5 ? 3 : 5}px`;
    particle.node.style.height = `${Math.random() < 0.5 ? 2 : 3}px`;
    powerupParticleLayer.append(particle.node);
    powerupParticles.push(particle);
  }
}

function updatePowerupParticles(delta, now) {
  const active = shieldedUntil > now || grownUntil > now;
  if (active && now >= nextPowerupParticleAt) {
    const expiring = [shieldedUntil, grownUntil].some((until) => until > now && until - now <= POWERUP_WARNING_MS);
    if (!expiring || Math.random() > 0.35) emitPowerupParticles(now, expiring ? 1 : 2);
    nextPowerupParticleAt = now + (expiring ? randomBetween(360, 620) : randomBetween(500, 820));
  }
  powerupParticles = powerupParticles.filter((particle) => {
    particle.age += delta * 1000;
    particle.x += particle.vx * delta;
    particle.y += particle.vy * delta;
    const progress = particle.age / particle.life;
    const intermittent = active && [shieldedUntil, grownUntil]
      .some((until) => until > now && until - now <= POWERUP_WARNING_MS)
      && Math.floor(now / 100) % 2 === 0;
    particle.node.style.transform = `translate(${Math.round(particle.x)}px, ${Math.round(particle.y)}px)`;
    particle.node.style.opacity = intermittent ? '0.25' : String(Math.max(0, 1 - progress));
    if (particle.age >= particle.life || !active && particle.age > 160) {
      particle.node.remove();
      return false;
    }
    return true;
  });
}

function updateShootingAnimation(now) {
  if (shootingUntil <= now) {
    if (shipSprite.dataset.state === 'shooting' || shipSprite.dataset.state === 'shielded-shooting') setIdle();
    return;
  }
  const shieldActive = shieldedUntil > now;
  const shootingState = shieldActive ? 'shielded-shooting' : 'shooting';
  if (shipSprite.dataset.state !== shootingState) {
    shotSerial += 1;
    shipSprite.dataset.state = shootingState;
    shipSprite.src = `${shieldActive ? SHIELD_GIF : SHOOTING_GIF}?shot=${shotSerial}`;
  }
}

function fire(now) {
  if (!running || ammo <= 0 || now < nextShotAllowedAt || now < reloadUntil) return false;
  ammo -= 1;
  nextShotAllowedAt = now + FIRE_RATE_MS;
  if (ammo === 0) {
    emptyAmmoBypassCount += 1;
    if (emptyAmmoLockArmed || emptyAmmoBypassCount >= EMPTY_AMMO_BYPASS_LIMIT) {
      // Lock on the first empty magazine, then force another lock after three bypasses.
      reloadUntil = now + EMPTY_AMMO_RECHARGE_DELAY_MS;
      ammoRechargeAt = reloadUntil;
      emptyAmmoLockArmed = false;
      emptyAmmoBypassCount = 0;
    } else {
      // Keep returning rounds available if the player spends them before reaching half capacity.
      reloadUntil = 0;
      ammoRechargeAt = now + Math.round(AMMO_RECHARGE_INTERVAL_MS / getAmmoRechargeMultiplier(now));
    }
  } else if (ammoRechargeAt === 0) {
    ammoRechargeAt = now + Math.round(AMMO_RECHARGE_DELAY_MS / getAmmoRechargeMultiplier(now));
  }
  updateAmmo(now);
  shootingUntil = now + SHOOT_ANIMATION_MS;
  const shieldActive = shieldedUntil > now;
  if (shieldActive) player.classList.add('is-shielded');
  else player.classList.remove('is-shielded');
  restartShootingAnimation(shieldActive);
  window.setTimeout(() => {
    if (performance.now() >= shootingUntil) setIdle();
  }, SHOOT_ANIMATION_MS);

  window.setTimeout(() => {
    if (running && !fatalSequenceActive && !deathSequenceActive) spawnProjectile();
  }, PROJECTILE_DELAY_MS);
  return true;
}

function restartShootingAnimation(shieldActive) {
  shotSerial += 1;
  shipSprite.dataset.state = shieldActive ? 'shielded-shooting' : 'shooting';
  shipSprite.src = `${shieldActive ? SHIELD_GIF : SHOOTING_GIF}?shot=${shotSerial}`;
}

function spawnProjectile() {
  const { halfHeight } = getPlayerPixelBounds();
  const grown = grownUntil > performance.now();
  const size = grown ? GROWN_PROJECTILE_SIZE : PROJECTILE_SIZE;
  const projectile = {
    x: playerPosition.x - size / 2,
    y: playerPosition.y - halfHeight - size,
    width: size,
    height: size,
    spawnedAt: performance.now(),
    frameIndex: 0,
    node: document.createElement('img'),
  };
  projectile.node.className = 'projectile';
  if (grown) projectile.node.classList.add('is-grown');
  projectile.node.src = PROJECTILE_FRAMES[0];
  projectile.node.alt = '';
  projectile.node.width = size;
  projectile.node.height = size;
  projectileLayer.append(projectile.node);
  projectiles.push(projectile);
}

function getWaveTuning() {
  const level = Math.max(0, wave - 1);
  return {
    speedMultiplier: 1 + Math.min(1.15, level * .11),
    spawnRate: .65 + level * .09,
    attackDelay: Math.max(260, 1100 - level * 80),
    telegraphMs: Math.max(280, 700 - level * 45),
    recoveryMs: Math.max(380, 1000 - level * 75),
    strikeMs: Math.max(90, 170 - level * 8),
    strikeDistance: 170 + Math.min(120, level * 12),
  };
}

function spawnEnemy() {
  const availableCount = Math.min(ENEMY_ASSETS.length, wave + 1);
  const type = ENEMY_ASSETS[enemySpawnSerial % availableCount];
  const behavior = ENEMY_BEHAVIORS[type.behavior];
  enemySpawnSerial += 1;
  const tuning = getWaveTuning();
  const now = performance.now();
  const width = playfield.clientWidth;
  const size = behavior.size;
  const enemy = {
    type,
    behavior,
    entry: 'top',
    size,
    x: randomBetween(size / 2, width - size / 2),
    y: -size,
    speed: behavior.baseSpeed * behavior.speedScale * tuning.speedMultiplier,
    vx: randomBetween(-18, 18),
    vy: 0,
    health: behavior.health,
    hitAt: 0,
    attackReadyAt: now + tuning.attackDelay + randomBetween(-120, 160),
    phase: randomBetween(0, Math.PI * 2),
    driftVx: 0,
    wallVx: behavior.name === 'axe'
      ? (Math.random() < .5 ? -1 : 1) * behavior.wallSpeed * randomBetween(.82, 1.12) * tuning.speedMultiplier
      : 0,
    lockOn: Math.random() < .45,
    downwardScale: behavior.name === 'axe' ? randomBetween(.88, 1.22) : 1,
    canStrike: behavior.canStrike && (behavior.name !== 'knife' || Math.random() < .55),
    passedPlayer: false,
    spinAngle: randomBetween(0, 360),
    sweepDirection: Math.random() < .5 ? -1 : 1,
    attackState: 'approach',
    attackStartedAt: 0,
    recoveryUntil: 0,
    strikeContactPending: false,
    node: document.createElement('i'),
  };
  enemy.node.className = 'enemy';
  enemy.node.classList.add(`enemy-${type.name}`);
  enemy.node.classList.add(`enemy-behavior-${behavior.name}`);
  enemy.node.style.setProperty('--enemy-size', `${size}px`);
  const trail = behavior.trailEnabled === false ? null : document.createElement('span');
  if (trail) {
    trail.className = `enemy-trail enemy-trail-${behavior.name}`;
    enemy.trailCount = behavior.name === 'arrow' ? 1 : behavior.name === 'cannonball' ? 2 : 3;
    enemy.trailNodes = [0, 1, 2].map((index) => {
      const pixel = document.createElement('i');
      pixel.className = `enemy-trail-segment enemy-trail-segment-${index + 1}`;
      trail.append(pixel);
      return pixel;
    });
  }
  enemy.trail = trail;
  const image = document.createElement('img');
  image.src = type.src;
  image.alt = '';
  image.width = size;
  image.height = size;
  enemy.image = image;
  if (trail) enemy.node.append(trail);
  enemy.node.append(image);
  enemy.node.style.transform = `translate(${Math.round(enemy.x)}px, ${Math.round(enemy.y)}px)`;
  updateEnemyTrail(enemy);
  enemyLayer.append(enemy.node);
  enemies.push(enemy);
}

function getEnemySpriteBounds(enemy) {
  const scale = enemy.size / 50;
  const [left, top, right, bottom] = enemy.type.alphaBounds.map((value) => value * scale);
  return { left: enemy.x + left, top: enemy.y + top, right: enemy.x + right, bottom: enemy.y + bottom };
}

function updateEnemyTrail(enemy) {
  if (!enemy.trail) return;
  const velocity = Math.hypot(enemy.vx, enemy.vy) || 1;
  const behaviorName = enemy.behavior.name;
  const attacking = enemy.attackState === 'telegraph' || enemy.attackState === 'strike';
  const trailProfiles = {
    scissor: { base: 5, velocityScale: .045, threshold: 145, normalOpacity: .2, attackOpacity: .58, normalCount: 0 },
    knife: { base: 8, velocityScale: .07, threshold: 150, normalOpacity: .18, attackOpacity: .7, normalCount: 0 },
  axe: { base: 14, velocityScale: .06, threshold: 0, normalOpacity: 0, attackOpacity: 0, normalCount: 0, trailEnabled: false },
    arrow: { base: 10, velocityScale: .04, threshold: 0, normalOpacity: .5, attackOpacity: .58, normalCount: 1 },
    cannonball: { base: 8, velocityScale: .035, threshold: 0, normalOpacity: .42, attackOpacity: .62, normalCount: 2 },
  };
  const profile = trailProfiles[behaviorName] || trailProfiles.knife;
  const visible = profile.normalCount > 0 || attacking || velocity >= profile.threshold;
  const opacity = attacking ? profile.attackOpacity : profile.normalOpacity;
  let rearX = -enemy.vx / velocity;
  let rearY = -enemy.vy / velocity;
  if (behaviorName === 'axe') {
    const spin = (enemy.spinAngle || 0) * Math.PI / 180;
    // The streak follows the rotating lower blade end, rather than the old travel vector.
    rearX = -Math.sin(spin);
    rearY = Math.cos(spin);
  }
  const bounds = getEnemySpriteBounds(enemy);
  const localLeft = bounds.left - enemy.x;
  const localTop = bounds.top - enemy.y;
  const localRight = bounds.right - enemy.x;
  const localBottom = bounds.bottom - enemy.y;
  const centerX = (localLeft + localRight) / 2;
  const centerY = (localTop + localBottom) / 2;
  const halfWidth = (localRight - localLeft) / 2;
  const halfHeight = (localBottom - localTop) / 2;
  const trailLength = Math.max(4, Math.min(34, Math.round(profile.base + velocity * profile.velocityScale * (attacking ? 1.2 : .7))));
  let attachX;
  let attachY;
  if (behaviorName === 'axe') {
    // Axe rotation is anchored at its visible center, so the long blade end is a fixed radius.
    const spin = (enemy.spinAngle || 0) * Math.PI / 180;
    attachX = centerX - Math.sin(spin) * halfHeight;
    attachY = centerY + Math.cos(spin) * halfHeight;
  } else {
    const edgeDistance = Math.min(
      Math.abs(rearX) > 0 ? halfWidth / Math.abs(rearX) : Infinity,
      Math.abs(rearY) > 0 ? halfHeight / Math.abs(rearY) : Infinity,
    );
    attachX = centerX + rearX * edgeDistance;
    attachY = centerY + rearY * edgeDistance;
  }
  const angle = Math.atan2(attachY - centerY, attachX - centerX) - Math.PI;
  enemy.trail.style.width = `${trailLength}px`;
  enemy.trail.style.left = `${Math.round(attachX - trailLength)}px`;
  enemy.trail.style.top = `${Math.round(attachY - 4)}px`;
  enemy.trail.style.transform = `rotate(${angle}rad)`;
  enemy.trail.style.opacity = profile.trailEnabled === false ? '0' : visible ? opacity : '0';
  const lengthsByType = {
    scissor: [trailLength, Math.round(trailLength * .42), Math.round(trailLength * .22)],
    knife: [trailLength, Math.round(trailLength * .52), Math.round(trailLength * .3)],
    axe: [trailLength, Math.round(trailLength * .66), Math.round(trailLength * .38)],
    arrow: [trailLength, 0, 0],
    cannonball: [trailLength, Math.round(trailLength * .48), 0],
  };
  const lengths = lengthsByType[behaviorName] || lengthsByType.knife;
  const rights = behaviorName === 'arrow' ? [0, 0, 0] : behaviorName === 'cannonball' ? [0, 4, 0] : [0, 3, 6];
  const tops = behaviorName === 'axe' ? [3, 0, 7] : [3, 0, 7];
  const activeCount = attacking ? 3 : profile.normalCount;
  enemy.trailNodes.forEach((trailNode, index) => {
    trailNode.style.display = visible && index < activeCount ? 'block' : 'none';
    trailNode.style.width = `${lengths[index]}px`;
    trailNode.style.right = `${rights[index]}px`;
    trailNode.style.top = `${tops[index]}px`;
  });
}

function spawnPowerup() {
  const roll = Math.random();
  const type = roll < 1 / 3 ? 'growth' : roll < 2 / 3 ? 'shield' : 'ammo';
  const powerup = { type, x: randomBetween(POWERUP_SIZE / 2, playfield.clientWidth - POWERUP_SIZE / 2), y: -POWERUP_SIZE, speed: randomBetween(35, 55), node: document.createElement('div') };
  powerup.node.className = 'powerup';
  powerup.node.setAttribute('aria-label', type === 'growth' ? 'Growth powerup' : type === 'shield' ? 'Shield powerup' : 'Ammo pack');
  const image = document.createElement('img');
  image.src = type === 'growth' ? GROWTH_POWERUP_IMAGE : type === 'shield' ? SHIELD_POWERUP_IMAGE : AMMO_PACK_IMAGE;
  image.alt = '';
  image.width = POWERUP_SIZE;
  image.height = POWERUP_SIZE;
  powerup.node.append(image);
  powerupLayer.append(powerup.node);
  powerups.push(powerup);
}

function beginEnemyStrike(enemy, now) {
  if (enemy.attackState !== 'approach' || now < enemy.attackReadyAt || !enemy.canStrike) return false;
  const tuning = getWaveTuning();
  const behavior = enemy.behavior;
  const bounds = getEnemySpriteBounds(enemy);
  const localCenterX = (bounds.left + bounds.right) / 2 - enemy.x;
  const localBottom = bounds.bottom - enemy.y;
  const { halfHeight } = getPlayerPixelBounds(now);
  enemy.attackState = 'telegraph';
  enemy.attackStartedAt = now;
  enemy.telegraphMs = Math.round(tuning.telegraphMs * behavior.telegraphScale);
  enemy.recoveryMs = Math.round(tuning.recoveryMs * behavior.recoveryScale);
  enemy.strikeMs = Math.round(tuning.strikeMs * behavior.strikeScale);
  enemy.strikeStartX = enemy.x;
  enemy.strikeStartY = enemy.y;
  enemy.strikeTargetX = playerPosition.x - localCenterX;
  const strikeTargetY = playerPosition.y - halfHeight - localBottom + 2;
  // The knife is a one-way top-down threat: its wind-up and lunge never reverse upward.
  enemy.strikeTargetY = behavior.name === 'knife' ? Math.max(enemy.y, strikeTargetY) : strikeTargetY;
  enemy.strikeOvershoot = behavior.name === 'sickle' ? 36 : 0;
  enemy.node.classList.add('is-telegraph');
  return true;
}

function updateEnemyStrike(enemy, delta, now) {
  const tuning = getWaveTuning();
  if (enemy.attackState === 'telegraph') {
    const progress = Math.min(1, (now - enemy.attackStartedAt) / enemy.telegraphMs);
    const telegraphOffsets = {
      knife: [-12, 0],
      sickle: [0, -9],
    };
    const [offsetX, offsetY] = telegraphOffsets[enemy.behavior.name] || [0, -6];
    enemy.vx = 0;
    enemy.vy = 0;
    enemy.x = Math.round(enemy.strikeStartX + offsetX * Math.min(1, progress * 3));
    const telegraphY = enemy.strikeStartY + offsetY * Math.min(1, progress * 3);
    enemy.y = enemy.behavior.name === 'knife'
      ? Math.max(enemy.strikeStartY, Math.round(telegraphY))
      : Math.round(telegraphY);
    if (enemy.behavior.name === 'scissor') {
      enemy.image.style.setProperty('--enemy-scale-x', `${1.12 + Math.min(.2, progress * .2)}`);
    } else if (enemy.behavior.name === 'knife') {
      const boundsCenterX = (getEnemySpriteBounds(enemy).left + getEnemySpriteBounds(enemy).right) / 2;
      const boundsCenterY = (getEnemySpriteBounds(enemy).top + getEnemySpriteBounds(enemy).bottom) / 2;
      const aimAngle = Math.max(-58, Math.min(58, Math.atan2(playerPosition.x - boundsCenterX, playerPosition.y - boundsCenterY) * 180 / Math.PI));
      enemy.image.style.setProperty('--enemy-angle', `${Math.round(aimAngle)}deg`);
    }
    if (enemy.behavior.name === 'sickle') {
      enemy.image.style.setProperty('--enemy-angle', `${Math.round(-42 - progress * 18)}deg`);
    }
    if (progress >= 1) {
      const bounds = getEnemySpriteBounds(enemy);
      const localCenterX = (bounds.left + bounds.right) / 2 - enemy.x;
      const localBottom = bounds.bottom - enemy.y;
      const { halfHeight } = getPlayerPixelBounds(now);
      enemy.strikeStartX = enemy.x;
      enemy.strikeStartY = enemy.y;
      const aimX = enemy.behavior.name === 'sickle'
        ? enemy.sweepDirection
        : Math.sign(playerPosition.x - (bounds.left + bounds.right) / 2) || 1;
      enemy.strikeTargetX = playerPosition.x - localCenterX + aimX * enemy.strikeOvershoot;
      const strikeTargetY = playerPosition.y - halfHeight - localBottom + 2;
      enemy.strikeTargetY = enemy.behavior.name === 'knife'
        ? Math.max(enemy.strikeStartY, strikeTargetY)
        : strikeTargetY;
      enemy.attackState = 'strike';
      enemy.attackStartedAt = now;
      enemy.node.classList.remove('is-telegraph');
      enemy.node.classList.add('is-striking');
    }
    return;
  }
  if (enemy.attackState === 'strike') {
    const strikeMs = enemy.strikeMs || tuning.strikeMs;
    const progress = Math.min(1, (now - enemy.attackStartedAt) / strikeMs);
    enemy.vx = (enemy.strikeTargetX - enemy.strikeStartX) / (strikeMs / 1000);
    enemy.vy = (enemy.strikeTargetY - enemy.strikeStartY) / (strikeMs / 1000);
    const sweepOffset = enemy.behavior.name === 'sickle'
      ? Math.sin(progress * Math.PI) * 42 * enemy.sweepDirection
      : 0;
    enemy.x = Math.round(enemy.strikeStartX + (enemy.strikeTargetX - enemy.strikeStartX) * progress + sweepOffset);
    const strikeY = enemy.strikeStartY + (enemy.strikeTargetY - enemy.strikeStartY) * progress;
    enemy.y = enemy.behavior.name === 'knife'
      ? Math.max(enemy.strikeStartY, Math.round(strikeY))
      : Math.round(strikeY);
    if (enemy.behavior.name === 'sickle') {
      enemy.image.style.setProperty('--enemy-angle', `${Math.round(-60 + progress * 150)}deg`);
    }
    if (progress >= 1) {
      enemy.attackState = 'recover';
      enemy.strikeContactPending = true;
      enemy.recoveryUntil = now + enemy.recoveryMs;
      enemy.attackReadyAt = enemy.recoveryUntil;
    enemy.node.classList.remove('is-striking');
    enemy.node.classList.add('is-recovering');
      enemy.image.style.setProperty('--enemy-scale-x', '1');
    }
    return;
  }
  enemy.vx = enemy.behavior.name === 'axe' ? enemy.wallVx : 0;
  enemy.vy = enemy.speed * .2;
  if (enemy.behavior.name === 'axe') {
    enemy.x += enemy.vx * delta;
    const spriteScale = enemy.size / 50;
    const leftWall = -enemy.type.alphaBounds[0] * spriteScale;
    const rightWall = playfield.clientWidth - enemy.type.alphaBounds[2] * spriteScale;
    if (enemy.x <= leftWall && enemy.wallVx < 0) {
      enemy.x = Math.round(leftWall);
      enemy.wallVx = Math.abs(enemy.wallVx);
      enemy.vx = enemy.wallVx;
    } else if (enemy.x >= rightWall && enemy.wallVx > 0) {
      enemy.x = Math.round(rightWall);
      enemy.wallVx = -Math.abs(enemy.wallVx);
      enemy.vx = enemy.wallVx;
    }
  }
  enemy.y += enemy.vy * delta;
  if (enemy.attackState === 'recover' && now >= enemy.recoveryUntil) {
    enemy.attackState = 'approach';
    enemy.attackReadyAt = now + tuning.attackDelay;
    enemy.node.classList.remove('is-recovering');
  }
}

function updateEnemyMovement(enemy, delta, now) {
  if (enemy.attackState !== 'approach') {
    updateEnemyStrike(enemy, delta, now);
    return;
  }
  const tuning = getWaveTuning();
  const bounds = getEnemySpriteBounds(enemy);
  const centerX = (bounds.left + bounds.right) / 2;
  const deltaX = Math.max(-160, Math.min(160, playerPosition.x - centerX));
  enemy.image.style.setProperty('--enemy-scale-x', '1');
  switch (enemy.behavior.name) {
    case 'scissor':
      enemy.vx = Math.sin(now * .007 + enemy.phase) * (76 + wave * 4);
      enemy.vy = enemy.speed * 1.08;
      break;
    case 'knife':
      enemy.vx = enemy.lockOn && enemy.y > playerPosition.y - 280
        ? deltaX * .62
        : Math.sin(now * .0017 + enemy.phase) * 22;
      enemy.vy = enemy.speed * .96;
      enemy.image.style.setProperty('--enemy-angle', '0deg');
      break;
    case 'axe':
      enemy.vx = enemy.wallVx;
      enemy.vy = enemy.speed * 2.35 * enemy.downwardScale;
      enemy.spinAngle = (now * 1.89 + enemy.phase * 30) % 360;
      enemy.image.style.setProperty('--enemy-angle', `${Math.round(enemy.spinAngle)}deg`);
      break;
    case 'arrow':
      enemy.vx = 0;
      enemy.vy = enemy.speed * 1.08;
      break;
    case 'cannonball':
      enemy.vx = 0;
      enemy.vy = enemy.speed;
      break;
    case 'sickle':
      enemy.vx = Math.sin(now * .0022 + enemy.phase) * (66 + wave * 2);
      enemy.vy = enemy.speed * .82;
      // The handle endpoint is the pivot, so the blade continuously sweeps left and right.
      enemy.image.style.setProperty('--enemy-angle', `${Math.round(Math.sin(now * .0056 + enemy.phase) * 82)}deg`);
      break;
    default:
      enemy.vx = 0;
      enemy.vy = enemy.speed;
  }
  enemy.x += enemy.vx * delta;
  const nextY = enemy.y + enemy.vy * delta;
  enemy.y = enemy.behavior.name === 'knife' ? Math.max(enemy.y, nextY) : nextY;
  if (enemy.behavior.name === 'axe') {
    const spriteScale = enemy.size / 50;
    const leftWall = -enemy.type.alphaBounds[0] * spriteScale;
    const rightWall = playfield.clientWidth - enemy.type.alphaBounds[2] * spriteScale;
    if (enemy.x <= leftWall && enemy.wallVx < 0) {
      enemy.x = Math.round(leftWall);
      enemy.wallVx = Math.abs(enemy.wallVx);
      enemy.vx = enemy.wallVx;
    } else if (enemy.x >= rightWall && enemy.wallVx > 0) {
      enemy.x = Math.round(rightWall);
      enemy.wallVx = -Math.abs(enemy.wallVx);
      enemy.vx = enemy.wallVx;
    }
  }
  const boundsAfterMove = getEnemySpriteBounds(enemy);
  const centerAfterMove = (boundsAfterMove.left + boundsAfterMove.right) / 2;
  const distanceToPlayer = Math.hypot(playerPosition.x - centerAfterMove, playerPosition.y - (boundsAfterMove.top + boundsAfterMove.bottom) / 2);
  if (enemy.canStrike && now >= enemy.attackReadyAt && distanceToPlayer <= enemy.behavior.attackDistance + tuning.strikeDistance * .35) {
    beginEnemyStrike(enemy, now);
  }
  if (enemy.x < -enemy.size * 1.5) enemy.x = -enemy.size * 1.5;
  if (enemy.x > playfield.clientWidth + enemy.size * .5) enemy.x = playfield.clientWidth + enemy.size * .5;
}

function hitTest(projectile, enemy) {
  const projectileHeight = projectile.height;
  const bounds = getEnemySpriteBounds(enemy);
  const enemyLeft = bounds.left;
  const enemyRight = bounds.right;
  const enemyTop = bounds.top;
  const enemyBottom = bounds.bottom;
  return projectile.x < enemyRight && projectile.x + projectile.width > enemyLeft
    && projectile.y < enemyBottom && projectile.y + projectileHeight > enemyTop;
}

function playerHitTest(enemy, now) {
  const { halfWidth, halfHeight } = getPlayerPixelBounds(now);
  const bounds = getEnemySpriteBounds(enemy);
  if (enemy.behavior.name === 'knife') {
    if (enemy.passedPlayer) return false;
    // A downward knife only threatens Junjun while its leading edge is above him.
    if (bounds.top > playerPosition.y) {
      enemy.passedPlayer = true;
      return false;
    }
  }
  const enemyLeft = bounds.left;
  const enemyRight = bounds.right;
  const enemyTop = bounds.top;
  const enemyBottom = bounds.bottom;
  return playerPosition.x - halfWidth < enemyRight && playerPosition.x + halfWidth > enemyLeft
    && playerPosition.y - halfHeight < enemyBottom && playerPosition.y + halfHeight > enemyTop;
}

function updateHearts() {
  heartNodes.forEach((heart, index) => {
    const full = index < hearts;
    heart.classList.toggle('is-full', full);
    heart.classList.toggle('is-empty', !full);
    heart.src = full ? './public/assets/hud-heart-alive.png' : './public/assets/hud-heart-broken.png';
  });
  heartHud.setAttribute('aria-label', `Junjun health: ${hearts} of ${MAX_HEARTS} hearts`);
}

function updateWaveHud() {
  waveLabel.textContent = `WAVE ${String(wave).padStart(2, '0')}`;
  waveProgressNode.textContent = `${waveKills}/${WAVE_KILL_TARGET}`;
  waveProgressNode.setAttribute('aria-label', `${waveKills} of ${WAVE_KILL_TARGET} enemies defeated`);
}

function completeWave(now) {
  if (waveTransitionUntil > now || waveKills < WAVE_KILL_TARGET) return;
  waveTransitionUntil = now + 900;
  waveLabel.textContent = 'WAVE COMPLETE';
  waveProgressNode.textContent = `${WAVE_KILL_TARGET}/${WAVE_KILL_TARGET}`;
  waveProgressNode.setAttribute('aria-label', 'Wave complete');
  playfield.classList.add('is-wave-complete');
}

function confirmEnemyKill(now) {
  if (waveTransitionUntil > now || waveKills >= WAVE_KILL_TARGET) return;
  waveKills += 1;
  updateWaveHud();
  if (waveKills === WAVE_KILL_TARGET) completeWave(now);
}

function advanceWave(now) {
  if (!waveTransitionUntil || now < waveTransitionUntil) return;
  wave += 1;
  waveKills = 0;
  waveTransitionUntil = 0;
  playfield.classList.remove('is-wave-complete');
  updateWaveHud();
}

function damagePlayer(now) {
  if (shieldedUntil > now || invulnerableUntil > now) return false;
  hearts = Math.max(0, hearts - 1);
  invulnerableUntil = now + INVULNERABILITY_MS;
  hurtSerial += 1;
  const hurt = hurtSerial;
  player.classList.remove('is-hurt');
  void player.offsetWidth;
  player.classList.add('is-hurt');
  window.setTimeout(() => {
    if (hurt === hurtSerial) player.classList.remove('is-hurt');
  }, 320);
  updateHearts();
  if (hearts === 0) endGame();
  return true;
}

function renderFatalEnemy(enemy) {
  enemy.node.style.transform = `translate(${Math.round(enemy.x)}px, ${Math.round(enemy.y)}px)`;
  updateEnemyTrail(enemy);
}

function setCameraOffset(x, y) {
  gameWorld.style.setProperty('--camera-x', `${Math.round(x)}px`);
  gameWorld.style.setProperty('--camera-y', `${Math.round(y)}px`);
}

function resetCamera() {
  setCameraOffset(0, 0);
}

function triggerFatalImpactShake() {
  gameWorld.classList.remove('is-impact-shake');
  void gameWorld.offsetWidth;
  gameWorld.classList.add('is-impact-shake');
  window.setTimeout(() => gameWorld.classList.remove('is-impact-shake'), 140);
}

function triggerEntryLaunchShake() {
  gameWorld.classList.remove('is-entry-launch-shake');
  void gameWorld.offsetWidth;
  gameWorld.classList.add('is-entry-launch-shake');
  window.setTimeout(() => gameWorld.classList.remove('is-entry-launch-shake'), 150);
}

function beginFatalSequence(enemy, now) {
  if (fatalSequenceActive || hearts !== 1 || shieldedUntil > now || invulnerableUntil > now) return false;
  const { halfHeight } = getPlayerPixelBounds(now);
  const scale = enemy.size / 50;
  const [spriteLeft, , spriteRight] = enemy.type.alphaBounds;
  const spriteCenterX = ((spriteLeft + spriteRight) / 2) * scale;
  const spriteBottom = enemy.type.alphaBounds[3] * scale;
  const preImpactY = playerPosition.y - halfHeight - spriteBottom - FATAL_PRE_IMPACT_GAP_PX;
  fatalSequenceActive = true;
  fatalSequence = {
    enemy,
    phase: 'camera-pan',
    phaseStartedAt: now,
    anchorY: preImpactY,
    cameraStartX: Number.parseFloat(gameWorld.style.getPropertyValue('--camera-x')) || 0,
    cameraStartY: Number.parseFloat(gameWorld.style.getPropertyValue('--camera-y')) || 0,
    cameraTargetX: playfield.clientWidth / 2 - playerPosition.x,
    cameraTargetY: playfield.clientHeight / 2 - playerPosition.y,
    enemyStartX: enemy.x,
    enemyTargetX: playerPosition.x - spriteCenterX,
    retreatingEnemies: [],
  };
  enemies.forEach((candidate) => {
    if (candidate === enemy) return;
    const candidateCenterX = candidate.x + candidate.size / 2;
    const retreatDirection = candidateCenterX < playerPosition.x ? -1 : 1;
    fatalSequence.retreatingEnemies.push({
      enemy: candidate,
      startX: candidate.x,
      startY: candidate.y,
      targetX: retreatDirection < 0 ? -candidate.size : playfield.clientWidth + candidate.size,
      targetY: candidate.y - 12,
    });
  });
  projectiles.forEach((projectile) => projectile.node.remove());
  powerups.forEach((powerup) => powerup.node.remove());
  projectiles = [];
  powerups = [];
  keys.clear();
  enemy.vx = 0;
  enemy.vy = 0;
  enemy.y = fatalSequence.anchorY;
  enemy.node.classList.add('is-fatal-telegraph');
  renderFatalEnemy(enemy);
  return true;
}

function updateFatalSequence(now) {
  if (!fatalSequenceActive || !fatalSequence) return;
  const { enemy } = fatalSequence;
  if (!enemy || !enemy.node.isConnected) {
    fatalSequenceActive = false;
    fatalSequence = null;
    return;
  }
  const elapsed = now - fatalSequence.phaseStartedAt;
  if (fatalSequence.phase === 'camera-pan') {
    const progress = Math.min(1, elapsed / FATAL_CAMERA_PAN_MS);
    const eased = 1 - ((1 - progress) ** 3);
    setCameraOffset(
      fatalSequence.cameraStartX + (fatalSequence.cameraTargetX - fatalSequence.cameraStartX) * eased,
      fatalSequence.cameraStartY + (fatalSequence.cameraTargetY - fatalSequence.cameraStartY) * eased,
    );
    enemy.vx = (fatalSequence.enemyTargetX - fatalSequence.enemyStartX) / (FATAL_CAMERA_PAN_MS / 1000);
    enemy.vy = 0;
    enemy.x = Math.round(fatalSequence.enemyStartX + (fatalSequence.enemyTargetX - fatalSequence.enemyStartX) * eased);
    enemy.y = fatalSequence.anchorY;
    renderFatalEnemy(enemy);
    fatalSequence.retreatingEnemies.forEach(({ enemy: retreatingEnemy, startX, startY, targetX, targetY }) => {
      retreatingEnemy.vx = (targetX - startX) / (FATAL_CAMERA_PAN_MS / 1000);
      retreatingEnemy.vy = (targetY - startY) / (FATAL_CAMERA_PAN_MS / 1000);
      retreatingEnemy.x = Math.round(startX + (targetX - startX) * eased);
      retreatingEnemy.y = Math.round(startY + (targetY - startY) * eased);
      renderFatalEnemy(retreatingEnemy);
    });
    if (elapsed >= FATAL_CAMERA_PAN_MS) {
      setCameraOffset(fatalSequence.cameraTargetX, fatalSequence.cameraTargetY);
      fatalSequence.retreatingEnemies.forEach(({ enemy: retreatingEnemy }) => retreatingEnemy.node.remove());
      fatalSequence.retreatingEnemies = [];
      enemies = [enemy];
      fatalSequence.phase = 'pause';
      fatalSequence.phaseStartedAt = now;
    }
    return;
  }
  if (fatalSequence.phase === 'pause') {
    enemy.vx = 0;
    enemy.vy = 0;
    enemy.x = Math.round(fatalSequence.enemyTargetX);
    enemy.y = fatalSequence.anchorY;
    renderFatalEnemy(enemy);
    if (elapsed >= FATAL_PAUSE_MS) {
      fatalSequence.phase = 'rise';
      fatalSequence.phaseStartedAt = now;
      enemy.node.classList.remove('is-fatal-telegraph');
      enemy.node.classList.add('is-fatal-rising');
    }
    return;
  }
  if (fatalSequence.phase === 'rise') {
    const progress = Math.min(1, elapsed / FATAL_RISE_MS);
    const eased = 1 - ((1 - progress) ** 3);
    enemy.vx = 0;
    enemy.vy = -FATAL_RISE_PX / (FATAL_RISE_MS / 1000);
    enemy.x = Math.round(fatalSequence.enemyTargetX);
    enemy.y = Math.round(fatalSequence.anchorY - FATAL_RISE_PX * eased);
    renderFatalEnemy(enemy);
    if (elapsed >= FATAL_RISE_MS) {
      fatalSequence.phase = 'extra-pause';
      fatalSequence.phaseStartedAt = now;
      fatalSequence.topY = enemy.y;
      enemy.vy = 0;
      enemy.node.classList.remove('is-fatal-rising');
      enemy.node.classList.add('is-fatal-extra-pause');
    }
    return;
  }
  if (fatalSequence.phase === 'extra-pause') {
    enemy.vx = 0;
    enemy.vy = 0;
    enemy.x = Math.round(fatalSequence.enemyTargetX);
    enemy.y = fatalSequence.topY;
    renderFatalEnemy(enemy);
    if (elapsed >= FATAL_EXTRA_PAUSE_MS) {
      fatalSequence.phase = 'extra-rise';
      fatalSequence.phaseStartedAt = now;
      enemy.node.classList.remove('is-fatal-extra-pause');
      enemy.node.classList.add('is-fatal-rising');
    }
    return;
  }
  if (fatalSequence.phase === 'extra-rise') {
    const progress = Math.min(1, elapsed / FATAL_EXTRA_RISE_MS);
    const eased = 1 - ((1 - progress) ** 3);
    enemy.vx = 0;
    enemy.vy = -FATAL_EXTRA_RISE_PX / (FATAL_EXTRA_RISE_MS / 1000);
    enemy.x = Math.round(fatalSequence.enemyTargetX);
    enemy.y = Math.round(fatalSequence.topY - FATAL_EXTRA_RISE_PX * eased);
    renderFatalEnemy(enemy);
    if (elapsed >= FATAL_EXTRA_RISE_MS) {
      fatalSequence.phase = 'top-hold';
      fatalSequence.phaseStartedAt = now;
      fatalSequence.topY = enemy.y;
      enemy.vy = 0;
      enemy.node.classList.remove('is-fatal-rising');
      enemy.node.classList.add('is-fatal-top-hold');
    }
    return;
  }
  if (fatalSequence.phase === 'top-hold') {
    enemy.vx = 0;
    enemy.vy = 0;
    enemy.x = Math.round(fatalSequence.enemyTargetX);
    enemy.y = fatalSequence.topY;
    renderFatalEnemy(enemy);
    if (elapsed >= FATAL_TOP_HOLD_MS) {
      const { halfHeight } = getPlayerPixelBounds(now);
      const spriteBottom = enemy.type.alphaBounds[3] * (enemy.size / 50);
      fatalSequence.phase = 'dash';
      fatalSequence.phaseStartedAt = now;
      fatalSequence.dashStartY = enemy.y;
      fatalSequence.dashTargetY = playerPosition.y - halfHeight - spriteBottom + 2;
      enemy.node.classList.remove('is-fatal-top-hold');
      enemy.node.classList.add('is-fatal-dash');
    }
    return;
  }
  const progress = Math.min(1, elapsed / FATAL_DASH_MS);
  enemy.vx = 0;
  enemy.vy = (fatalSequence.dashTargetY - fatalSequence.dashStartY) / (FATAL_DASH_MS / 1000);
  enemy.y = Math.round(fatalSequence.dashStartY + (fatalSequence.dashTargetY - fatalSequence.dashStartY) * progress);
  renderFatalEnemy(enemy);
  if (progress >= 1) {
    fatalSequenceActive = false;
    fatalSequence = null;
    triggerFatalImpactShake();
    enemy.node.remove();
    enemies = [];
    damagePlayer(now);
  }
}

function updateEntities(delta, now) {
  const height = playfield.clientHeight;
  projectiles = projectiles.filter((projectile) => {
    projectile.y -= delta * 480;
    const frameIndex = Math.floor((now - projectile.spawnedAt) / PROJECTILE_FRAME_MS) % PROJECTILE_FRAMES.length;
    if (frameIndex !== projectile.frameIndex) {
      projectile.frameIndex = frameIndex;
      projectile.node.src = PROJECTILE_FRAMES[frameIndex];
    }
    projectile.node.style.transform = `translate(${projectile.x}px, ${projectile.y}px)`;
    if (projectile.y < -40) { projectile.node.remove(); return false; }
    return true;
  });

  enemies = enemies.filter((enemy) => {
    if (enemy.hitAt > 0) {
      if (now - enemy.hitAt < 160) return true;
      enemy.node.classList.remove('is-hit');
      enemy.hitAt = 0;
      if (enemy.isDying) {
        enemy.node.remove();
        return false;
      }
    }
    updateEnemyMovement(enemy, delta, now);
    enemy.node.style.transform = `translate(${enemy.x}px, ${enemy.y}px)`;
    updateEnemyTrail(enemy);
    const hitIndex = projectiles.findIndex((projectile) => hitTest(projectile, enemy));
    if (hitIndex > -1) {
      projectiles[hitIndex].node.remove();
      projectiles.splice(hitIndex, 1);
      enemy.health -= 1;
      enemy.hitAt = now;
      enemy.node.classList.add('is-hit');
      score += 100;
      scoreNode.textContent = padScore(score);
      if (enemy.health <= 0 && !enemy.isDying) {
        enemy.isDying = true;
        confirmEnemyKill(now);
      }
      return true;
    }
    if (playerHitTest(enemy, now)) {
      if (hearts === 1 && shieldedUntil <= now && invulnerableUntil <= now) {
        enemy.strikeContactPending = false;
        beginFatalSequence(enemy, now);
        return true;
      }
      if (enemy.strikeContactPending || enemy.attackState === 'strike') {
        enemy.strikeContactPending = false;
        enemy.node.remove();
        damagePlayer(now);
        return false;
      }
      if (enemy.attackState === 'approach') {
        if (enemy.canStrike) {
          enemy.attackReadyAt = now;
          beginEnemyStrike(enemy, now);
        } else {
          enemy.node.remove();
          damagePlayer(now);
          return false;
        }
      }
      return true;
    }
    enemy.strikeContactPending = false;
    if (enemy.y > height + enemy.size || enemy.x < -enemy.size * 1.5 || enemy.x > playfield.clientWidth + enemy.size * .5) {
      enemy.node.remove();
      return false;
    }
    return true;
  });

  powerups = powerups.filter((powerup) => {
    powerup.y += delta * powerup.speed;
    powerup.node.style.transform = `translate(${powerup.x - POWERUP_SIZE / 2}px, ${powerup.y}px)`;
    const { halfWidth, halfHeight } = getPlayerPixelBounds(now);
    const consumed = Math.abs(powerup.x - playerPosition.x) < halfWidth + POWERUP_SIZE / 2 - 8
      && Math.abs(powerup.y + POWERUP_SIZE / 2 - playerPosition.y) < halfHeight + POWERUP_SIZE / 2 - 8;
    if (consumed) {
      powerup.node.remove();
      if (powerup.type === 'growth') activateGrowth(now);
      else if (powerup.type === 'shield') activateShield(now);
      else activateAmmoPack(now);
      return false;
    }
    if (powerup.y > height + POWERUP_SIZE) { powerup.node.remove(); return false; }
    return true;
  });
}

function updateShieldStatus(now) {
  if (shieldedUntil <= now) {
    shieldStatus.classList.add('is-hidden');
    shieldStatus.classList.remove('is-expiring');
    return;
  }
  shieldStatus.classList.remove('is-hidden');
  const remaining = shieldedUntil - now;
  shieldStatus.classList.toggle('is-expiring', remaining <= POWERUP_WARNING_MS);
}

function updateGrowthStatus(now) {
  if (grownUntil <= now) {
    growthStatus.classList.add('is-hidden');
    growthStatus.classList.remove('is-expiring');
    player.classList.remove('is-grown');
    return;
  }
  growthStatus.classList.remove('is-hidden');
  const remaining = grownUntil - now;
  growthStatus.classList.toggle('is-expiring', remaining <= POWERUP_WARNING_MS);
}

function updateAmmoStatus(now) {
  if (ammoBoostUntil <= now) {
    ammoStatus.classList.add('is-hidden');
    ammoStatus.classList.remove('is-expiring');
    return;
  }
  ammoStatus.classList.remove('is-hidden');
  ammoStatus.classList.toggle('is-expiring', ammoBoostUntil - now <= POWERUP_WARNING_MS);
}

function updatePowerupFlicker(now) {
  const activeExpirations = [shieldedUntil, grownUntil]
    .concat(ammoBoostUntil)
    .filter((until) => until > now && until - now <= POWERUP_WARNING_MS);
  if (activeExpirations.length === 0) {
    player.classList.remove('is-powerup-expiring');
    player.style.removeProperty('--flicker-speed');
    return;
  }
  const remaining = Math.min(...activeExpirations) - now;
  const progress = 1 - (remaining / POWERUP_WARNING_MS);
  player.classList.add('is-powerup-expiring');
  player.style.setProperty('--flicker-speed', `${Math.max(0.08, 0.34 - progress * 0.26)}s`);
}

function updateAmmo(now = performance.now()) {
  const recharging = ammo < MAX_AMMO && ammoRechargeAt > now;
  ammoHud.setAttribute('aria-label', `Ammunition: ${ammo} of ${MAX_AMMO}${recharging ? ', recharging' : ''}`);
  ammoHud.classList.toggle('is-reloading', now < reloadUntil);
  ammoPips.forEach((pip, index) => pip.classList.toggle('is-spent', index >= ammo));
}

function replenishAmmo(now) {
  if (ammo >= MAX_AMMO) {
    ammoRechargeAt = 0;
    reloadUntil = 0;
    emptyAmmoLockArmed = true;
    emptyAmmoBypassCount = 0;
    return;
  }
  if (ammoRechargeAt === 0) ammoRechargeAt = now + Math.round(AMMO_RECHARGE_DELAY_MS / getAmmoRechargeMultiplier(now));
  if (now >= reloadUntil && now >= ammoRechargeAt) {
    ammo += 1;
    if (ammo >= AMMO_REARM_THRESHOLD) {
      emptyAmmoLockArmed = true;
      emptyAmmoBypassCount = 0;
    }
    ammoRechargeAt = ammo < MAX_AMMO
      ? now + Math.round(AMMO_RECHARGE_INTERVAL_MS / getAmmoRechargeMultiplier(now))
      : 0;
    updateAmmo(now);
  }
}

function movePlayer(delta) {
  const speed = 250;
  let dx = 0;
  let dy = 0;
  if (keys.has('ArrowLeft') || keys.has('a')) dx -= 1;
  if (keys.has('ArrowRight') || keys.has('d')) dx += 1;
  if (keys.has('ArrowUp') || keys.has('w')) dy -= 1;
  if (keys.has('ArrowDown') || keys.has('s')) dy += 1;
  const { halfWidth, halfHeight } = getPlayerPixelBounds();
  setPlayerPosition(
    Math.max(halfWidth, Math.min(playfield.clientWidth - halfWidth, playerPosition.x + dx * speed * delta)),
    Math.max(halfHeight, Math.min(playfield.clientHeight - halfHeight, playerPosition.y + dy * speed * delta)),
  );
}

function easeEntry(progress) {
  const clamped = Math.max(0, Math.min(1, progress));
  return clamped * clamped * (3 - 2 * clamped);
}

function setEntryPhase(phase, now) {
  entryCutscene.phase = phase;
  entryCutscene.phaseStartedAt = now;
  if (phase === 'overshoot-hold') triggerEntryLaunchShake();
}

function beginEntryCutscene(now) {
  const finalX = playfield.clientWidth / 2;
  const finalY = playfield.clientHeight - 70;
  entryCutsceneActive = true;
  entryCutscene = {
    phase: 'wait',
    phaseStartedAt: now,
    finalX,
    finalY,
    startY: playfield.clientHeight + SHIP_SIZE,
    overshootY: Math.max(18, SHIP_SIZE * .24),
    tooFarDownY: finalY + 64,
    correctionHighY: finalY - 22,
    correctionLowY: finalY + 10,
    cameraX: 0,
    cameraY: 0,
  };
  keys.clear();
  setPlayerPosition(finalX, entryCutscene.startY);
  setCameraOffset(0, 0);
}

function updateEntryCutscene(now, delta) {
  if (!entryCutsceneActive || !entryCutscene) return;
  const cutscene = entryCutscene;
  const elapsed = now - cutscene.phaseStartedAt;
  let y = cutscene.finalY;
  let environmentSpeed = .35;
  switch (cutscene.phase) {
    case 'wait':
      y = cutscene.startY;
      environmentSpeed = .35;
      if (elapsed >= ENTRY_WAIT_MS) setEntryPhase('rocket', now);
      break;
    case 'rocket': {
      const progress = Math.min(1, elapsed / ENTRY_ROCKET_MS);
      const launch = 1 - ((1 - progress) ** 5);
      y = cutscene.startY + (cutscene.overshootY - cutscene.startY) * launch;
      environmentSpeed = 4.25;
      if (progress >= 1) setEntryPhase('overshoot-hold', now);
      break;
    }
    case 'overshoot-hold':
      y = cutscene.overshootY;
      environmentSpeed = .55;
      if (elapsed >= ENTRY_OVERSHOOT_HOLD_MS) setEntryPhase('drift-down', now);
      break;
    case 'drift-down': {
      const progress = Math.min(1, elapsed / ENTRY_DRIFT_MS);
      y = cutscene.overshootY + (cutscene.tooFarDownY - cutscene.overshootY) * easeEntry(progress);
      environmentSpeed = .8;
      if (progress >= 1) setEntryPhase('low-pause', now);
      break;
    }
    case 'low-pause':
      y = cutscene.tooFarDownY;
      environmentSpeed = .45;
      if (elapsed >= ENTRY_LOW_PAUSE_MS) setEntryPhase('correction-up', now);
      break;
    case 'correction-up': {
      const progress = Math.min(1, elapsed / ENTRY_CORRECTION_UP_MS);
      y = cutscene.tooFarDownY + (cutscene.correctionHighY - cutscene.tooFarDownY) * easeEntry(progress);
      environmentSpeed = .65;
      if (progress >= 1) setEntryPhase('tiny-pause', now);
      break;
    }
    case 'tiny-pause':
      y = cutscene.correctionHighY;
      environmentSpeed = .4;
      if (elapsed >= ENTRY_TINY_PAUSE_MS) setEntryPhase('correction-down', now);
      break;
    case 'correction-down': {
      const progress = Math.min(1, elapsed / ENTRY_CORRECTION_DOWN_MS);
      y = cutscene.correctionHighY + (cutscene.correctionLowY - cutscene.correctionHighY) * easeEntry(progress);
      environmentSpeed = .55;
      if (progress >= 1) setEntryPhase('settle', now);
      break;
    }
    case 'settle': {
      const progress = Math.min(1, elapsed / ENTRY_SETTLE_MS);
      y = cutscene.correctionLowY + (cutscene.finalY - cutscene.correctionLowY) * easeEntry(progress);
      environmentSpeed = .45;
      if (progress >= 1) setEntryPhase('settled', now);
      break;
    }
    case 'settled':
      y = cutscene.finalY;
      environmentSpeed = .35;
      if (elapsed >= ENTRY_SETTLE_HOLD_MS) {
        entryCutsceneActive = false;
        entryCutscene = null;
        keys.clear();
        setPlayerPosition(cutscene.finalX, cutscene.finalY);
        setCameraOffset(0, 0);
        spawnEnemy();
        return;
      }
      break;
    default:
      entryCutsceneActive = false;
      entryCutscene = null;
      return;
  }
  setPlayerPosition(cutscene.finalX, Math.round(y));
  const gameplayCameraY = cutscene.finalY - y;
  const centerCameraY = playfield.clientHeight / 2 - y;
  let cameraTargetY = gameplayCameraY;
  let cameraEase = 4;
  if (cutscene.phase === 'rocket') {
    // Follow the rocket toward the viewport center while deliberately lagging behind it.
    cameraTargetY = gameplayCameraY + (centerCameraY - gameplayCameraY) * .72;
    cameraEase = 4.5;
  } else if (cutscene.phase === 'overshoot-hold') {
    const holdProgress = Math.min(1, elapsed / ENTRY_OVERSHOOT_HOLD_MS);
    const cameraOverrun = (1 - easeEntry(holdProgress)) * 22;
    cameraTargetY = centerCameraY + cameraOverrun;
    cameraEase = 7;
  } else if (cutscene.phase === 'drift-down') {
    const driftProgress = Math.min(1, elapsed / ENTRY_DRIFT_MS);
    const centerBlend = .72 * (1 - easeEntry(driftProgress));
    cameraTargetY = gameplayCameraY + (centerCameraY - gameplayCameraY) * centerBlend;
    cameraEase = 3;
  } else if (cutscene.phase === 'low-pause' || cutscene.phase === 'correction-up' || cutscene.phase === 'tiny-pause' || cutscene.phase === 'correction-down') {
    // The joke has landed; keep the corrections readable while the camera quietly returns home.
    cameraTargetY = gameplayCameraY * .2;
    cameraEase = 2.8;
  } else if (cutscene.phase === 'settle' || cutscene.phase === 'settled') {
    cameraTargetY = gameplayCameraY;
    cameraEase = 4;
  }
  cutscene.cameraY += (cameraTargetY - cutscene.cameraY) * Math.min(1, delta * cameraEase);
  setCameraOffset(cutscene.cameraX, cutscene.cameraY);
  updateClouds(delta * environmentSpeed);
}

function loop(now) {
  if (!running) return;
  const delta = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;
  if (fatalSequenceActive) {
    updateFatalSequence(now);
    animationFrame = requestAnimationFrame(loop);
    return;
  }
  if (entryCutsceneActive) {
    updateEntryCutscene(now, delta);
    animationFrame = requestAnimationFrame(loop);
    return;
  }
  movePlayer(delta);
  updateClouds(delta);
  replenishAmmo(now);
  updateAmmo();
  if ((keys.has(' ') || keys.has('Spacebar')) && now >= nextAutoShotAt) {
    fire(now);
    nextAutoShotAt = now + FIRE_RATE_MS;
  }
  updateEntities(delta, now);
  updatePowerupParticles(delta, now);
  updateShootingAnimation(now);
  updateShieldStatus(now);
  updateGrowthStatus(now);
  updateAmmoStatus(now);
  updatePowerupFlicker(now);
  advanceWave(now);
  const maxEnemies = Math.min(7, 2 + Math.floor(wave / 2));
  if (!waveTransitionUntil && enemies.length < maxEnemies && Math.random() < delta * getWaveTuning().spawnRate) spawnEnemy();
  if (now >= nextPowerupAt) {
    spawnPowerup();
    nextPowerupAt = now + randomBetween(7000, 10500);
  }
  animationFrame = requestAnimationFrame(loop);
}

function startGame() {
  running = true;
  fatalSequenceActive = false;
  fatalSequence = null;
  entryCutsceneActive = false;
  entryCutscene = null;
  score = 0;
  hearts = MAX_HEARTS;
  ammo = MAX_AMMO;
  wave = 1;
  waveKills = 0;
  waveTransitionUntil = 0;
  enemySpawnSerial = 0;
  nextAutoShotAt = 0;
  ammoRechargeAt = 0;
  reloadUntil = 0;
  emptyAmmoLockArmed = true;
  emptyAmmoBypassCount = 0;
  shootingUntil = 0;
  nextShotAllowedAt = 0;
  shieldedUntil = 0;
  grownUntil = 0;
  ammoBoostUntil = 0;
  shieldSerial = 0;
  nextPowerupAt = performance.now() + 2500;
  scoreNode.textContent = padScore(score);
  updateWaveHud();
  updateHearts();
  updateAmmo();
  enemies.forEach((enemy) => enemy.node.remove());
  projectiles.forEach((projectile) => projectile.node.remove());
  powerups.forEach((powerup) => powerup.node.remove());
  enemies = [];
  projectiles = [];
  powerups = [];
  clearPowerupParticles();
  resetPlayer();
  resetCamera();
  shieldStatus.classList.add('is-hidden');
  growthStatus.classList.add('is-hidden');
  ammoStatus.classList.add('is-hidden');
  shieldStatus.classList.remove('is-expiring');
  growthStatus.classList.remove('is-expiring');
  ammoStatus.classList.remove('is-expiring');
  invulnerableUntil = 0;
  player.classList.remove('is-powerup-expiring');
  player.style.removeProperty('--flicker-speed');
  setIdle();
  beginEntryCutscene(performance.now());
  startCard.classList.add('is-hidden');
  gameOverCard.classList.add('is-hidden');
  playfield.classList.add('is-running');
  playfield.focus();
  cancelAnimationFrame(animationFrame);
  lastTime = performance.now();
  animationFrame = requestAnimationFrame(loop);
}

function endGame() {
  if (deathSequenceActive) return;
  deathSequenceActive = true;
  fatalSequenceActive = false;
  fatalSequence = null;
  running = false;
  shieldedUntil = 0;
  grownUntil = 0;
  ammoBoostUntil = 0;
  clearPowerupParticles();
  enemies.forEach((enemy) => enemy.node.remove());
  enemies = [];
  player.classList.remove('is-shielded');
  player.classList.remove('is-grown');
  player.classList.remove('is-hurt', 'is-powerup-expiring');
  ammoStatus.classList.add('is-hidden');
  ammoStatus.classList.remove('is-expiring');
  keys.clear();
  deathSerial += 1;
  shipSprite.src = `${DEATH_FRAMES[0]}?death=${deathSerial}`;
  shipSprite.dataset.state = 'death';
  finalScoreNode.textContent = padScore(score);
  const highScore = Math.max(score, Number(localStorage.getItem('tarubnijunjun-high-score') || 0));
  localStorage.setItem('tarubnijunjun-high-score', String(highScore));
  highScoreNode.textContent = padScore(highScore);
  gameOverCard.classList.add('is-hidden');
  const frameDuration = 160;
  DEATH_FRAMES.forEach((frame, index) => {
    window.setTimeout(() => {
      if (!deathSequenceActive) return;
      shipSprite.src = `${frame}?death=${deathSerial}`;
    }, index * frameDuration);
  });
  const deathEnd = DEATH_FRAMES.length * frameDuration;
  window.setTimeout(() => {
    if (!deathSequenceActive) return;
    player.classList.add('is-death-flash');
  }, deathEnd);
  window.setTimeout(() => {
    if (!deathSequenceActive) return;
    player.classList.remove('is-death-flash');
    player.classList.add('is-bam');
  }, deathEnd + 140);
  window.setTimeout(() => {
    if (!deathSequenceActive) return;
    player.style.display = 'none';
    player.classList.remove('is-bam');
  }, deathEnd + 220);
  window.setTimeout(() => {
    if (!deathSequenceActive) return;
    resetCamera();
    gameOverCard.classList.remove('is-hidden');
  }, deathEnd + 1220);
}

document.querySelector('#start-button').addEventListener('click', startGame);
document.querySelector('#restart-button').addEventListener('click', startGame);
window.addEventListener('keydown', (event) => {
  if (deathSequenceActive || fatalSequenceActive) return;
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'Spacebar'].includes(event.key)) event.preventDefault();
  keys.add(event.key);
  if (event.key === 'Enter' && !running) startGame();
  if ((event.key === ' ' || event.key === 'Spacebar') && !event.repeat) {
    const now = performance.now();
    fire(now);
    nextAutoShotAt = now + FIRE_RATE_MS;
  }
});
window.addEventListener('keyup', (event) => keys.delete(event.key));
window.addEventListener('resize', () => {
  if (running) clampPlayerToBounds();
});

highScoreNode.textContent = padScore(Number(localStorage.getItem('tarubnijunjun-high-score') || 0));
createClouds();
resetPlayer();
