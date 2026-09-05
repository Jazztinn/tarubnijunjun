const playfield = document.querySelector('#playfield');
const playfieldWrap = document.querySelector('.playfield-wrap');
const gameWorld = document.querySelector('#game-world');
const player = document.querySelector('#player');
const entryScene = document.querySelector('#entry-scene');
const entryChair = document.querySelector('#entry-chair');
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
const spreadStatus = document.querySelector('#spread-status');
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
const ENTRY_PREINTRO_GIF = './public/assets/nagalulusijunjun.gif';
const ENTRY_TRANSITION_FRAME = './public/assets/nagalulusijunjun-transition.gif';
const SHIELD_POWERUP_IMAGE = './public/assets/durexnijunjun.png';
const GROWTH_POWERUP_IMAGE = './public/assets/viagranijunjun.png';
const AMMO_PACK_IMAGE = './public/assets/ammopack.png';
const SPREAD_POWERUP_IMAGE = './public/assets/magazine.png';
const SPREAD_ENABLED_IMAGE = './public/assets/magazineenabled.png';
const BOMB_EXPLOSION_FRAME_MS = 65;
const BOMB_EXPLOSION_SIZE = 148;
const BOMB_EXPLOSION_FRAMES = [
  [1, [17, 14, 31, 34]], [2, [9, 9, 35, 39]], [3, [3, 4, 36, 44]],
  [4, [5, 4, 40, 44]], [5, [7, 8, 38, 41]], [6, [8, 8, 36, 41]], [7, null],
].map(([number, alphaBounds]) => ({
  src: `./public/assets/explosion-1-g/frame${number}.png`, alphaBounds,
}));
const ENEMY_DEFINITIONS = [
  {
    name: 'arrow', src: './public/assets/arrow.png', alphaBounds: [21, 14, 27, 32], size: 108,
    baseSpeed: 280, waveSpeedStep: .055, maxSpeedMultiplier: 1.45, health: 1, threat: 1,
    unlockWave: 1, entryWarningMs: 150,
    trail: { lifespan: 230, sampleMs: 28, width: 2, opacity: .48 },
  },
  {
    name: 'knife', src: './public/assets/kutsily.png', alphaBounds: [21, 13, 28, 41], size: 78,
    baseSpeed: 98, waveSpeedStep: .085, maxSpeedMultiplier: 1.75, health: 1, threat: 1.3,
    unlockWave: 1, attackDistance: 190, telegraphScale: .9, strikeScale: .76, recoveryScale: .84,
    trail: { lifespan: 190, sampleMs: 20, width: 2.2, opacity: .52, activeState: 'strike' },
  },
  {
    name: 'scissor', src: './public/assets/scissor.png', alphaBounds: [20, 12, 28, 35], size: 92,
    baseSpeed: 178, waveSpeedStep: .07, maxSpeedMultiplier: 1.6, health: 1, threat: 1.3,
    unlockWave: 2,
    trail: { lifespan: 180, sampleMs: 34, width: 1.2, opacity: .18 },
  },
  {
    name: 'cannonball', src: './public/assets/cannonball.png', alphaBounds: [20, 21, 27, 28], size: 116,
    baseSpeed: 450, waveSpeedStep: .035, maxSpeedMultiplier: 1.28, health: 1, threat: 1.6,
    unlockWave: 3, entryWarningMs: 300, spawnGroup: 'lane-burst',
    trail: { lifespan: 330, sampleMs: 18, width: 5, opacity: .58 },
  },
  {
    name: 'fork', src: './public/assets/forkenemy.png', alphaBounds: [21, 14, 26, 28], size: 148,
    collisionBoxes: [[22, 14, 25, 24], [21, 24, 26, 25], [21, 25, 22, 28], [23, 25, 24, 28], [25, 25, 26, 28]],
    baseSpeed: 92, waveSpeedStep: .06, maxSpeedMultiplier: 1.45, health: 1, threat: 1.4,
    unlockWave: 3, spawnGroup: 'space-control', trail: null,
  },
  {
    name: 'axe', src: './public/assets/axe.png', alphaBounds: [20, 15, 28, 31], size: 126,
    baseSpeed: 128, waveSpeedStep: .055, maxSpeedMultiplier: 1.45, health: 1, threat: 1.6,
    unlockWave: 4, wallSpeed: 188, maxBounces: 3, spawnGroup: 'rebound',
    trail: { lifespan: 280, sampleMs: 26, width: 2.4, opacity: .28 },
    rotationOrigin: [24, 23],
  },
  {
    name: 'sawblade', src: './public/assets/sawbladeenemy.png', alphaBounds: [15, 16, 32, 33], size: 112,
    baseSpeed: 82, waveSpeedStep: .05, maxSpeedMultiplier: 1.4, health: 1, threat: 1.7,
    unlockWave: 4, wallSpeed: 225, maxBounces: 4, spawnGroup: 'rebound',
    trail: { lifespan: 240, sampleMs: 24, width: 3, opacity: .3 },
  },
  {
    name: 'sickle', src: './public/assets/sickleenemy.png', alphaBounds: [16, 15, 29, 29], size: 104,
    baseSpeed: 105, waveSpeedStep: .05, maxSpeedMultiplier: 1.45, health: 1, threat: 1.7,
    unlockWave: 5, spawnGroup: 'sweep',
    trail: { lifespan: 430, sampleMs: 20, width: 5.2, opacity: .5, activeState: 'sweep' },
    rotationOrigin: [22.5, 22], rotationOffset: 45,
  },
  {
    name: 'bomb', src: './public/assets/bombenemy.png', alphaBounds: [19, 15, 31, 29], size: 124,
    baseSpeed: 68, waveSpeedStep: .035, maxSpeedMultiplier: 1.25, health: 1, threat: 1.8,
    unlockWave: 5, fuseMs: 5200, spawnGroup: 'priority', trail: null,
  },
  {
    name: 'hammer', src: './public/assets/hammerenemy.png', alphaBounds: [21, 16, 29, 29], size: 138,
    baseSpeed: 110, waveSpeedStep: .04, maxSpeedMultiplier: 1.35, health: 1, threat: 1.8,
    unlockWave: 5, spawnGroup: 'lane-burst',
    trail: { lifespan: 300, sampleMs: 18, width: 5.4, opacity: .5, activeState: 'slam' },
    rotationOrigin: [25, 22.5], rotationOffset: 90,
  },
];
const ENEMY_BY_NAME = Object.fromEntries(ENEMY_DEFINITIONS.map((enemy) => [enemy.name, enemy]));
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
const SPREAD_SHOT_DURATION_MS = 7000;
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
const ENTRY_WAIT_MS = 340;
const ENTRY_PREINTRO_MS = 5000;
const ENTRY_PRELAUNCH_PUSH_MS = 760;
const ENTRY_PRELAUNCH_ZOOM = 1.12;
const ENTRY_CAMERA_REACTION_DELAY_MS = 150;
const ENTRY_BRACE_OFFSET_PX = 6;
const GAMEPLAY_JUNJUN_CANVAS_SIZE = 50;
const GAMEPLAY_JUNJUN_VISIBLE_BOUNDS = { x: 13, y: 8, width: 22, height: 34 };
const PREINTRO_SCENE_CANVAS_SIZE = 200;
// Measured around the small Junjun inside the pre-intro frame, excluding Tarub.
const PREINTRO_JUNJUN_VISIBLE_BOUNDS = { x: 88, y: 119, width: 22, height: 34 };
const PREINTRO_TARUB_VISIBLE_BOUNDS = { y: 45, height: 155 };
const ENTRY_PREINTRO_SIZE = Math.round(Math.max(
  SHIP_SIZE * (GAMEPLAY_JUNJUN_VISIBLE_BOUNDS.width / GAMEPLAY_JUNJUN_CANVAS_SIZE)
    / (PREINTRO_JUNJUN_VISIBLE_BOUNDS.width / PREINTRO_SCENE_CANVAS_SIZE),
  SHIP_SIZE * (GAMEPLAY_JUNJUN_VISIBLE_BOUNDS.height / GAMEPLAY_JUNJUN_CANVAS_SIZE)
    / (PREINTRO_JUNJUN_VISIBLE_BOUNDS.height / PREINTRO_SCENE_CANVAS_SIZE),
));
const ENTRY_PREINTRO_JUNJUN_CENTER_OFFSET_Y = Math.round(
  (PREINTRO_JUNJUN_VISIBLE_BOUNDS.y + PREINTRO_JUNJUN_VISIBLE_BOUNDS.height / 2 - PREINTRO_SCENE_CANVAS_SIZE / 2)
    * (ENTRY_PREINTRO_SIZE / PREINTRO_SCENE_CANVAS_SIZE)
  - (GAMEPLAY_JUNJUN_VISIBLE_BOUNDS.y + GAMEPLAY_JUNJUN_VISIBLE_BOUNDS.height / 2 - GAMEPLAY_JUNJUN_CANVAS_SIZE / 2)
    * (SHIP_SIZE / GAMEPLAY_JUNJUN_CANVAS_SIZE),
);
const ENTRY_PREINTRO_CAMERA_START_Y = 40;
const ENTRY_PREINTRO_CAMERA_REVEAL_DELAY_MS = 220;
const ENTRY_PREINTRO_CAMERA_INITIAL_REVEAL_MS = 320;
// The reference composition keeps Tarub's visible top below the viewport center.
const PREINTRO_TARUB_TARGET_TOP_RATIO = .56;
const ENTRY_ROCKET_MS = 520;
const ENTRY_OVERSHOOT_HOLD_MS = 450;
const ENTRY_DRIFT_MS = 700;
const ENTRY_LOW_PAUSE_MS = 160;
const ENTRY_CORRECTION_UP_MS = 330;
const ENTRY_TINY_PAUSE_MS = 140;
const ENTRY_CORRECTION_DOWN_MS = 220;
const ENTRY_SETTLE_MS = 250;
const ENTRY_SETTLE_HOLD_MS = 300;
const ENTRY_FREEDOM_MS = 1800;
const ENTRY_FREEDOM_CONTROL_DELAY_MS = 320;
const ENTRY_FREEDOM_HUD_DELAY_MS = 900;
const CLOUD_WIDTH = 180;
const CLOUD_HEIGHT = 90;
const WAVE_ONE_SPAWN_DELAYS_MS = [0, 1150, 1350, 1550, 1750];
const WAVE_ONE_ENEMIES = ['arrow', 'arrow', 'knife', 'arrow', 'knife'];
const TRAIL_SEGMENT_LIMIT = 18;
const POWERUP_VISUALS = {
  growth: { src: GROWTH_POWERUP_IMAGE, renderSize: 100 },
  shield: { src: SHIELD_POWERUP_IMAGE, renderSize: 100 },
  ammo: { src: AMMO_PACK_IMAGE, renderSize: 100 },
  // Visible art is 19x26 inside a padded 75x100 canvas. Keep collection bounds
  // at 100x100 while increasing only rendered art to match other powerups.
  spread: { src: SPREAD_POWERUP_IMAGE, renderSize: 132 },
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
let spreadShotUntil = 0;
let nextPowerupAt = 2500;
let nextEnemyAt = 0;
let waveOnePowerupSpawned = false;
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
let lastEnemyType = '';

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

function clearClouds() {
  cloudLayer.replaceChildren();
  foregroundCloudLayer.replaceChildren();
  clouds = [];
}

function renderCloud(cloud) {
  cloud.node.style.transform = `translate(${Math.round(cloud.x)}px, ${Math.round(cloud.y)}px) scaleX(${cloud.flipped ? -1 : 1})`;
}

function createClouds(introSceneY) {
  clearClouds();
  const cloudSlots = [
    [0.04, 0.08], [0.37, 0.04], [0.71, 0.1],
    [0.15, 0.28], [0.52, 0.23], [0.86, 0.32],
    [0.02, 0.48], [0.38, 0.44], [0.7, 0.52],
    [0.2, 0.68], [0.55, 0.74], [0.88, 0.66],
    [0.43, 0.91],
  ];
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
    const [slotX] = cloudSlots[index];
    const maxX = Math.max(0, playfield.clientWidth - cloud.width);
    cloud.x = Math.max(0, Math.min(maxX, maxX * slotX + randomBetween(-14, 14)));
    const verticalProgress = index / (cloudSlots.length - 1);
    cloud.y = introSceneY + 120 - verticalProgress * 1080 + randomBetween(-22, 22);
    (foreground ? foregroundCloudLayer : cloudLayer).append(cloud.node);
    renderCloud(cloud);
    return cloud;
  });
}

function updateClouds(delta, motion = {}) {
  const {
    verticalScale = 1,
    horizontalScale = 1,
    launchParallax = 0,
    recycle = true,
  } = motion;
  const height = playfield.clientHeight;
  clouds.forEach((cloud) => {
    const depthFactor = .12 + cloud.depth * .72 + (cloud.foreground ? .2 : 0);
    cloud.y += (cloud.speed * verticalScale + launchParallax * depthFactor) * delta;
    cloud.x += cloud.vx * horizontalScale * delta;
    if (recycle && cloud.y > height + cloud.height) {
      applyCloudDepth(cloud);
      cloud.x = randomBetween(0, Math.max(0, playfield.clientWidth - cloud.width));
      cloud.y = -cloud.height - randomBetween(0, 80);
    }
    if (recycle && cloud.x < -cloud.width) cloud.x = playfield.clientWidth + randomBetween(2, 20);
    if (recycle && cloud.x > playfield.clientWidth + 2) cloud.x = -cloud.width - randomBetween(2, 20);
    renderCloud(cloud);
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
  entryScene.hidden = true;
  entryScene.dataset.state = 'hidden';
  entryChair.hidden = true;
  entryChair.dataset.state = 'hidden';
  player.style.opacity = '1';
  player.classList.remove('is-entry-preintro', 'is-entry-anticipating', 'is-entry-bracing', 'is-entry-relieved');
  player.style.removeProperty('--entry-preintro-size');
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
  if (deathSequenceActive || fatalSequenceActive || entryCutsceneActive) return;
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

function activateSpreadShot(now) {
  triggerPowerupTransition('spread', now);
  spreadShotUntil = Math.max(spreadShotUntil, now) + SPREAD_SHOT_DURATION_MS;
}

function getAmmoRechargeMultiplier(now) {
  return ammoBoostUntil > now ? 3 : 1;
}

function triggerPowerupTransition(type, now) {
  const replacingActivePowerup = shieldedUntil > now || grownUntil > now || ammoBoostUntil > now || spreadShotUntil > now;
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
  const expiring = [shieldedUntil, grownUntil, spreadShotUntil].some((until) => until > now && until - now <= POWERUP_WARNING_MS);
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
  const active = shieldedUntil > now || grownUntil > now || spreadShotUntil > now;
  if (active && now >= nextPowerupParticleAt) {
    const expiring = [shieldedUntil, grownUntil, spreadShotUntil].some((until) => until > now && until - now <= POWERUP_WARNING_MS);
    if (!expiring || Math.random() > 0.35) emitPowerupParticles(now, expiring ? 1 : 2);
    nextPowerupParticleAt = now + (expiring ? randomBetween(360, 620) : randomBetween(500, 820));
  }
  powerupParticles = powerupParticles.filter((particle) => {
    particle.age += delta * 1000;
    particle.x += particle.vx * delta;
    particle.y += particle.vy * delta;
    const progress = particle.age / particle.life;
    const intermittent = active && [shieldedUntil, grownUntil, spreadShotUntil]
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
    if (running && !fatalSequenceActive && !deathSequenceActive) {
      const spreadActive = spreadShotUntil > performance.now();
      if (spreadActive) {
        spawnProjectile(-22);
        spawnProjectile(0);
        spawnProjectile(22);
      } else {
        spawnProjectile(0);
      }
    }
  }, PROJECTILE_DELAY_MS);
  return true;
}

function restartShootingAnimation(shieldActive) {
  shotSerial += 1;
  shipSprite.dataset.state = shieldActive ? 'shielded-shooting' : 'shooting';
  shipSprite.src = `${shieldActive ? SHIELD_GIF : SHOOTING_GIF}?shot=${shotSerial}`;
}

function spawnProjectile(angleDegrees = 0) {
  const { halfHeight } = getPlayerPixelBounds();
  const grown = grownUntil > performance.now();
  const size = grown ? GROWN_PROJECTILE_SIZE : PROJECTILE_SIZE;
  const angle = angleDegrees * Math.PI / 180;
  const projectileSpeed = 480;
  const projectile = {
    x: playerPosition.x - size / 2,
    y: playerPosition.y - halfHeight - size,
    vx: Math.sin(angle) * projectileSpeed,
    vy: Math.cos(angle) * projectileSpeed,
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
    threatBudget: Math.min(7.6, 2.7 + level * .56),
    attackDelay: Math.max(260, 1100 - level * 80),
    telegraphMs: Math.max(280, 700 - level * 45),
    recoveryMs: Math.max(380, 1000 - level * 75),
    strikeMs: Math.max(90, 170 - level * 8),
    strikeDistance: 170 + Math.min(120, level * 12),
  };
}

function getEnemySpeedMultiplier(definition) {
  return Math.min(definition.maxSpeedMultiplier, 1 + Math.max(0, wave - definition.unlockWave) * definition.waveSpeedStep);
}

function getEnemySpawnInterval() {
  if (wave <= 2) return randomBetween(650, 900);
  if (wave <= 4) return randomBetween(500, 700);
  if (wave <= 7) return randomBetween(420, 590);
  return randomBetween(350, 520);
}

function getActiveThreat() {
  return enemies.reduce((total, enemy) => total + (!enemy.retreating && !enemy.isDying && !enemy.exploded ? enemy.definition.threat : 0), 0);
}

function canAddEnemy(definition, tuning) {
  if (getActiveThreat() + definition.threat > tuning.threatBudget + .01) return false;
  const active = enemies.filter((enemy) => !enemy.retreating && !enemy.isDying && !enemy.exploded);
  if (definition.name === 'bomb' && active.some((enemy) => enemy.definition.name === 'bomb')) return false;
  if (definition.name === 'hammer' && active.some((enemy) => enemy.definition.name === 'hammer')) return false;
  if (definition.spawnGroup === 'lane-burst' && active.some((enemy) => enemy.definition.spawnGroup === 'lane-burst')) return false;
  if (definition.spawnGroup === 'rebound' && active.filter((enemy) => enemy.definition.spawnGroup === 'rebound').length >= 2) return false;
  if (definition.spawnGroup === 'space-control' && active.filter((enemy) => enemy.definition.spawnGroup === 'space-control').length >= 2) return false;
  if (wave < 7 && definition.spawnGroup === 'priority' && active.some((enemy) => enemy.definition.spawnGroup === 'lane-burst')) return false;
  if (wave < 7 && definition.spawnGroup === 'lane-burst' && active.some((enemy) => enemy.definition.spawnGroup === 'priority')) return false;
  return true;
}

function chooseEnemyDefinition() {
  const tuning = getWaveTuning();
  let choices = ENEMY_DEFINITIONS.filter((definition) => definition.unlockWave <= wave && canAddEnemy(definition, tuning));
  if (choices.length > 1) {
    const freshChoices = choices.filter((definition) => definition.name !== lastEnemyType);
    if (freshChoices.length > 0) choices = freshChoices;
  }
  if (choices.length === 0) return null;
  const totalWeight = choices.reduce((total, definition) => total + 1 / definition.threat, 0);
  let roll = Math.random() * totalWeight;
  return choices.find((definition) => {
    roll -= 1 / definition.threat;
    return roll <= 0;
  }) || choices[choices.length - 1];
}

function createScaledBounds(bounds, scale) {
  const [left, top, right, bottom] = bounds;
  return {
    left: left * scale,
    top: top * scale,
    right: right * scale,
    bottom: bottom * scale,
    width: (right - left) * scale,
    height: (bottom - top) * scale,
    centerX: (left + right) * scale / 2,
    centerY: (top + bottom) * scale / 2,
  };
}

function createEnemyTrail(enemy) {
  const trail = enemy.definition.trail;
  if (!trail) return;
  const namespace = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(namespace, 'svg');
  svg.classList.add('enemy-motion-trail', `enemy-motion-trail-${enemy.definition.name}`);
  svg.setAttribute('aria-hidden', 'true');
  const lines = Array.from({ length: TRAIL_SEGMENT_LIMIT }, () => {
    const line = document.createElementNS(namespace, 'line');
    line.setAttribute('vector-effect', 'non-scaling-stroke');
    svg.append(line);
    return line;
  });
  enemy.trail = { ...trail, node: svg, lines, points: [], lastSampleAt: 0 };
  enemyLayer.append(svg);
}

function createEnemyWarning(enemy) {
  if (!enemy.definition.entryWarningMs || enemy.definition.name === 'arrow') return;
  const warning = document.createElement('i');
  warning.className = `enemy-entry-warning enemy-entry-warning-${enemy.definition.name}`;
  enemy.warningNode = warning;
  enemyLayer.append(warning);
}

function spawnEnemy(forcedName = '') {
  const waveOneIndex = Math.min(WAVE_KILL_TARGET - 1, waveKills);
  const definition = forcedName
    ? ENEMY_BY_NAME[forcedName]
    : wave === 1
      ? ENEMY_BY_NAME[WAVE_ONE_ENEMIES[waveOneIndex]]
      : chooseEnemyDefinition();
  if (!definition) return false;
  enemySpawnSerial += 1;
  const tuning = getWaveTuning();
  const now = performance.now();
  const width = playfield.clientWidth;
  const size = definition.size;
  const scale = size / 50;
  const visualBounds = createScaledBounds(definition.alphaBounds, scale);
  const visualCenterX = randomBetween(visualBounds.width / 2 + 10, width - visualBounds.width / 2 - 10);
  const entryReveal = definition.name === 'arrow' ? 3 : 0;
  const initialY = definition.name === 'hammer' ? 18 - visualBounds.top : -visualBounds.bottom + entryReveal;
  const enemy = {
    definition,
    type: definition,
    size,
    visualBounds,
    collisionBoxes: (definition.collisionBoxes || [definition.alphaBounds]).map((bounds) => createScaledBounds(bounds, scale)),
    x: visualCenterX - visualBounds.centerX,
    y: initialY,
    speed: definition.baseSpeed * getEnemySpeedMultiplier(definition)
      * (wave === 1 ? [.72, .78, .86, .94, 1.02][waveOneIndex] : 1),
    vx: 0,
    vy: 0,
    angle: 0,
    health: definition.health,
    hitAt: 0,
    spawnedAt: now,
    entryReadyAt: now + (definition.entryWarningMs || 0),
    entryPending: true,
    attackReadyAt: now + tuning.attackDelay + (wave === 1 ? [700, 420, 260, 120, 0][waveOneIndex] : randomBetween(-120, 160)),
    phase: randomBetween(0, Math.PI * 2),
    weaveCenterX: visualCenterX,
    weaveAmplitude: randomBetween(82, 110),
    weaveRate: randomBetween(.00235, .00285),
    wallVx: ['axe', 'sawblade'].includes(definition.name)
      ? (Math.random() < .5 ? -1 : 1) * definition.wallSpeed * getEnemySpeedMultiplier(definition)
      : 0,
    lockOn: Math.random() < .45,
    canStrike: definition.name === 'knife' && (wave === 1 ? waveOneIndex === 4 : true),
    passedPlayer: false,
    bounceCount: 0,
    maxBounces: definition.name === 'axe' ? 2 + enemySpawnSerial % 2 : definition.name === 'sawblade' ? 2 + enemySpawnSerial % 3 : 0,
    sweepDirection: visualCenterX < width / 2 ? 1 : -1,
    attackState: 'approach',
    specialState: definition.name === 'sickle' ? 'entry' : definition.name === 'bomb' ? 'fuse' : definition.name === 'hammer' ? 'tracking' : '',
    stateStartedAt: now,
    fuseEndsAt: definition.name === 'bomb' ? now + definition.fuseMs : 0,
    attackStartedAt: 0,
    recoveryUntil: 0,
    strikeContactPending: false,
    retreating: false,
    harmless: false,
    node: document.createElement('i'),
  };
  enemy.node.className = 'enemy';
  enemy.node.classList.add(`enemy-${definition.name}`);
  enemy.node.style.setProperty('--enemy-size', `${size}px`);
  enemy.node.style.setProperty('--enemy-visual-center-x', `${visualBounds.centerX}px`);
  enemy.node.style.setProperty('--enemy-visual-center-y', `${visualBounds.centerY}px`);
  enemy.node.style.setProperty('--enemy-visual-top', `${visualBounds.top}px`);
  if (definition.rotationOrigin) {
    enemy.node.style.setProperty('--enemy-origin-x', `${definition.rotationOrigin[0] * 2}%`);
    enemy.node.style.setProperty('--enemy-origin-y', `${definition.rotationOrigin[1] * 2}%`);
  }
  const image = document.createElement('img');
  image.src = definition.src;
  image.alt = '';
  image.width = size;
  image.height = size;
  enemy.image = image;
  enemy.node.append(image);
  createEnemyTrail(enemy);
  createEnemyWarning(enemy);
  enemyLayer.append(enemy.node);
  enemies.push(enemy);
  lastEnemyType = definition.name;
  renderEnemy(enemy, now);
  return true;
}

function rotateEnemyBox(enemy, box) {
  if (!enemy.angle) {
    return { left: enemy.x + box.left, top: enemy.y + box.top, right: enemy.x + box.right, bottom: enemy.y + box.bottom };
  }
  const angle = enemy.angle * Math.PI / 180;
  const cosine = Math.cos(angle);
  const sine = Math.sin(angle);
  const originX = enemy.definition.rotationOrigin ? enemy.definition.rotationOrigin[0] * enemy.size / 50 : enemy.size / 2;
  const originY = enemy.definition.rotationOrigin ? enemy.definition.rotationOrigin[1] * enemy.size / 50 : enemy.size / 2;
  const points = [[box.left, box.top], [box.right, box.top], [box.right, box.bottom], [box.left, box.bottom]].map(([x, y]) => ({
    x: enemy.x + originX + (x - originX) * cosine - (y - originY) * sine,
    y: enemy.y + originY + (x - originX) * sine + (y - originY) * cosine,
  }));
  return {
    left: Math.min(...points.map((point) => point.x)),
    top: Math.min(...points.map((point) => point.y)),
    right: Math.max(...points.map((point) => point.x)),
    bottom: Math.max(...points.map((point) => point.y)),
  };
}

function getEnemySpriteBounds(enemy) {
  return rotateEnemyBox(enemy, enemy.visualBounds);
}

function getEnemyCollisionBoxes(enemy) {
  return enemy.collisionBoxes.map((box) => rotateEnemyBox(enemy, box));
}

function getEnemyVisualCenter(enemy) {
  const bounds = getEnemySpriteBounds(enemy);
  return { x: (bounds.left + bounds.right) / 2, y: (bounds.top + bounds.bottom) / 2 };
}

function setEnemyVisualCenter(enemy, x, y) {
  enemy.x = x - enemy.visualBounds.centerX;
  enemy.y = y - enemy.visualBounds.centerY;
  const actualCenter = getEnemyVisualCenter(enemy);
  enemy.x += x - actualCenter.x;
  enemy.y += y - actualCenter.y;
}

function setEnemyAngle(enemy, angle) {
  const center = enemy.image ? getEnemyVisualCenter(enemy) : null;
  enemy.angle = angle;
  enemy.image.style.setProperty('--enemy-angle', `${Math.round(angle)}deg`);
  if (center) setEnemyVisualCenter(enemy, center.x, center.y);
}

function easeEnemyAngle(enemy, targetAngle, response, delta) {
  const difference = ((targetAngle - enemy.angle + 540) % 360) - 180;
  setEnemyAngle(enemy, enemy.angle + difference * Math.min(1, response * delta));
}

function getTrailAnchor(enemy) {
  const bounds = getEnemySpriteBounds(enemy);
  const center = { x: (bounds.left + bounds.right) / 2, y: (bounds.top + bounds.bottom) / 2 };
  const velocity = Math.hypot(enemy.vx, enemy.vy);
  if (velocity < 1) return center;
  const rearX = -enemy.vx / velocity;
  const rearY = -enemy.vy / velocity;
  const halfWidth = (bounds.right - bounds.left) / 2;
  const halfHeight = (bounds.bottom - bounds.top) / 2;
  const edgeDistance = Math.min(
    Math.abs(rearX) > .001 ? halfWidth / Math.abs(rearX) : Infinity,
    Math.abs(rearY) > .001 ? halfHeight / Math.abs(rearY) : Infinity,
  );
  return { x: center.x + rearX * edgeDistance, y: center.y + rearY * edgeDistance };
}

function updateEnemyTrail(enemy, now = performance.now()) {
  if (!enemy.trail) return;
  const trail = enemy.trail;
  const activeState = trail.activeState;
  const state = enemy.specialState || enemy.attackState;
  const active = !enemy.retreating && (!activeState || state === activeState);
  trail.points = trail.points.filter((point) => now - point.at <= trail.lifespan);
  if (active && Math.hypot(enemy.vx, enemy.vy) > 8 && now - trail.lastSampleAt >= trail.sampleMs) {
    trail.points.push({ ...getTrailAnchor(enemy), at: now });
    if (trail.points.length > TRAIL_SEGMENT_LIMIT + 1) trail.points.shift();
    trail.lastSampleAt = now;
  }
  trail.node.setAttribute('viewBox', `0 0 ${playfield.clientWidth} ${playfield.clientHeight}`);
  trail.lines.forEach((line, index) => {
    const from = trail.points[index];
    const to = trail.points[index + 1];
    if (!from || !to) {
      line.style.display = 'none';
      return;
    }
    const age = now - to.at;
    const life = Math.max(0, 1 - age / trail.lifespan);
    const taper = (index + 1) / Math.max(1, trail.points.length - 1);
    line.style.display = 'block';
    line.setAttribute('x1', from.x.toFixed(1));
    line.setAttribute('y1', from.y.toFixed(1));
    line.setAttribute('x2', to.x.toFixed(1));
    line.setAttribute('y2', to.y.toFixed(1));
    line.setAttribute('stroke-width', Math.max(.5, trail.width * taper).toFixed(2));
    line.setAttribute('opacity', (trail.opacity * life * taper).toFixed(3));
  });
}

function renderEnemy(enemy, now = performance.now()) {
  enemy.node.style.transform = `translate(${Math.round(enemy.x)}px, ${Math.round(enemy.y)}px)`;
  if (enemy.warningNode) {
    const center = getEnemyVisualCenter(enemy);
    enemy.warningNode.style.left = `${Math.round(center.x)}px`;
  }
  updateEnemyTrail(enemy, now);
}

function removeEnemyVisual(enemy) {
  enemy.node.remove();
  if (enemy.explosionNode) enemy.explosionNode.remove();
  if (enemy.warningNode) enemy.warningNode.remove();
  if (enemy.trail) enemy.trail.node.remove();
}

function emitEnemyImpact(x, y, type = 'spark') {
  const impact = document.createElement('i');
  impact.className = `enemy-impact enemy-impact-${type}`;
  impact.style.left = `${Math.round(x)}px`;
  impact.style.top = `${Math.round(y)}px`;
  enemyLayer.append(impact);
  window.setTimeout(() => impact.remove(), 260);
}

function spawnPowerup() {
  const roll = Math.random();
  const type = roll < .25 ? 'growth' : roll < .5 ? 'shield' : roll < .75 ? 'ammo' : 'spread';
  const visual = POWERUP_VISUALS[type];
  const powerup = { type, x: randomBetween(POWERUP_SIZE / 2, playfield.clientWidth - POWERUP_SIZE / 2), y: -POWERUP_SIZE, speed: randomBetween(35, 55), node: document.createElement('div') };
  powerup.node.className = 'powerup';
  powerup.node.style.setProperty('--powerup-render-size', `${visual.renderSize}px`);
  powerup.node.setAttribute('aria-label', type === 'growth' ? 'Growth powerup' : type === 'shield' ? 'Shield powerup' : type === 'ammo' ? 'Ammo pack' : 'Spread shot powerup');
  const image = document.createElement('img');
  image.src = visual.src;
  image.alt = '';
  image.width = POWERUP_SIZE;
  image.height = POWERUP_SIZE;
  powerup.node.append(image);
  powerupLayer.append(powerup.node);
  powerups.push(powerup);
  if (wave === 1) waveOnePowerupSpawned = true;
}

function beginEnemyStrike(enemy, now) {
  if (enemy.definition.name !== 'knife' || enemy.attackState !== 'approach' || now < enemy.attackReadyAt || !enemy.canStrike) return false;
  const tuning = getWaveTuning();
  const bounds = getEnemySpriteBounds(enemy);
  const centerX = (bounds.left + bounds.right) / 2;
  const centerY = (bounds.top + bounds.bottom) / 2;
  const { halfHeight } = getPlayerPixelBounds(now);
  enemy.attackState = 'telegraph';
  enemy.attackStartedAt = now;
  enemy.telegraphMs = Math.round(tuning.telegraphMs * enemy.definition.telegraphScale);
  enemy.recoveryMs = Math.round(tuning.recoveryMs * enemy.definition.recoveryScale);
  enemy.strikeMs = Math.round(tuning.strikeMs * enemy.definition.strikeScale);
  enemy.telegraphOriginX = enemy.x;
  enemy.telegraphOriginY = enemy.y;
  enemy.telegraphPullbackX = -Math.sign(playerPosition.x - centerX || 1) * 12;
  enemy.lockedTargetX = playerPosition.x;
  enemy.lockedTargetY = playerPosition.y - halfHeight;
  enemy.strikeTargetX = enemy.lockedTargetX - enemy.visualBounds.centerX;
  enemy.strikeTargetY = Math.max(enemy.y, enemy.lockedTargetY - enemy.visualBounds.bottom + 2);
  enemy.lockedAimAngle = Math.max(-58, Math.min(58, Math.atan2(enemy.lockedTargetX - centerX, enemy.lockedTargetY - centerY) * 180 / Math.PI));
  enemy.node.classList.add('is-telegraph');
  return true;
}

function updateEnemyStrike(enemy, delta, now) {
  const tuning = getWaveTuning();
  if (enemy.attackState === 'telegraph') {
    const progress = Math.min(1, (now - enemy.attackStartedAt) / enemy.telegraphMs);
    const pullback = easeEntry(Math.min(1, progress * 2.4));
    enemy.vx = 0;
    enemy.vy = 0;
    enemy.x = Math.round(enemy.telegraphOriginX + enemy.telegraphPullbackX * pullback);
    enemy.y = enemy.telegraphOriginY;
    setEnemyAngle(enemy, enemy.lockedAimAngle);
    if (progress >= 1) {
      enemy.strikeStartX = enemy.x;
      enemy.strikeStartY = enemy.y;
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
    enemy.x = Math.round(enemy.strikeStartX + (enemy.strikeTargetX - enemy.strikeStartX) * progress);
    const strikeY = enemy.strikeStartY + (enemy.strikeTargetY - enemy.strikeStartY) * progress;
    enemy.y = Math.max(enemy.strikeStartY, Math.round(strikeY));
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
  enemy.vx = 0;
  enemy.vy = enemy.speed * .2;
  enemy.y += enemy.vy * delta;
  if (enemy.attackState === 'recover' && now >= enemy.recoveryUntil) {
    enemy.attackState = 'approach';
    enemy.attackReadyAt = now + tuning.attackDelay;
    enemy.node.classList.remove('is-recovering');
    setEnemyAngle(enemy, 0);
  }
}

function finishEnemyEntry(enemy, now) {
  if (now < enemy.entryReadyAt) {
    enemy.vx = 0;
    enemy.vy = 0;
    return false;
  }
  if (enemy.entryPending) {
    enemy.entryPending = false;
    if (enemy.warningNode) {
      enemy.warningNode.remove();
      enemy.warningNode = null;
    }
  }
  return true;
}

function updateArrow(enemy, delta, now) {
  if (!finishEnemyEntry(enemy, now)) return;
  enemy.vx = 0;
  enemy.vy = enemy.speed;
  enemy.y += enemy.vy * delta;
}

function updateKnife(enemy, delta, now) {
  if (!finishEnemyEntry(enemy, now)) return;
  if (enemy.attackState !== 'approach') {
    updateEnemyStrike(enemy, delta, now);
    return;
  }
  const center = getEnemyVisualCenter(enemy);
  const deltaX = Math.max(-160, Math.min(160, playerPosition.x - center.x));
  enemy.vx = enemy.lockOn && center.y > playerPosition.y - 280
    ? deltaX * .62
    : Math.sin((now - enemy.spawnedAt) * .0017 + enemy.phase) * 22;
  enemy.vy = enemy.speed * .96;
  enemy.x += enemy.vx * delta;
  enemy.y += enemy.vy * delta;
  setEnemyAngle(enemy, 0);
  const distanceToPlayer = Math.hypot(playerPosition.x - center.x, playerPosition.y - center.y);
  if (enemy.canStrike && now >= enemy.attackReadyAt && distanceToPlayer <= enemy.definition.attackDistance + getWaveTuning().strikeDistance * .35) {
    beginEnemyStrike(enemy, now);
  }
}

function updateScissor(enemy, delta, now) {
  if (!finishEnemyEntry(enemy, now)) return;
  const center = getEnemyVisualCenter(enemy);
  const elapsed = now - enemy.entryReadyAt;
  const desiredX = Math.max(enemy.visualBounds.width / 2, Math.min(
    playfield.clientWidth - enemy.visualBounds.width / 2,
    enemy.weaveCenterX + Math.sin(elapsed * enemy.weaveRate) * enemy.weaveAmplitude,
  ));
  enemy.vx = delta > 0 ? (desiredX - center.x) / delta : 0;
  enemy.vy = enemy.speed;
  setEnemyVisualCenter(enemy, desiredX, center.y + enemy.vy * delta);
  setEnemyAngle(enemy, Math.max(-9, Math.min(9, enemy.vx * .045)));
}

function updateCannonball(enemy, delta, now) {
  if (!finishEnemyEntry(enemy, now)) return;
  enemy.vx = 0;
  enemy.vy = enemy.speed;
  enemy.y += enemy.vy * delta;
}

function updateFork(enemy, delta, now) {
  if (!finishEnemyEntry(enemy, now)) return;
  const center = getEnemyVisualCenter(enemy);
  const elapsed = now - enemy.spawnedAt;
  const desiredX = Math.max(enemy.visualBounds.width / 2, Math.min(
    playfield.clientWidth - enemy.visualBounds.width / 2,
    enemy.weaveCenterX + (Math.sin(elapsed * .00115 + enemy.phase) - Math.sin(enemy.phase)) * 38,
  ));
  enemy.vx = delta > 0 ? (desiredX - center.x) / delta : 0;
  enemy.vy = enemy.speed;
  setEnemyVisualCenter(enemy, desiredX, center.y + enemy.vy * delta);
  setEnemyAngle(enemy, Math.sin(elapsed * .00115 + enemy.phase) * 8);
}

function updateReboundEnemy(enemy, delta, now, mobile = false) {
  if (!finishEnemyEntry(enemy, now)) return;
  const speedScale = enemy.reboundSpeedScale || 1;
  enemy.vx = enemy.wallVx * speedScale;
  enemy.vy = enemy.speed * (mobile ? .72 : 1.18) * speedScale;
  enemy.x += enemy.vx * delta;
  enemy.y += enemy.vy * delta;
  setEnemyAngle(enemy, enemy.angle + (mobile ? 680 : 390) * delta * Math.sign(enemy.vx || 1));
  const bounds = getEnemySpriteBounds(enemy);
  const hitLeft = bounds.left <= 0 && enemy.vx < 0;
  const hitRight = bounds.right >= playfield.clientWidth && enemy.vx > 0;
  if (!hitLeft && !hitRight) return;
  if (enemy.bounceCount >= enemy.maxBounces) {
    enemy.exitingSide = true;
    return;
  }
  enemy.x += hitLeft ? -bounds.left : playfield.clientWidth - bounds.right;
  enemy.wallVx = hitLeft ? Math.abs(enemy.wallVx) : -Math.abs(enemy.wallVx);
  enemy.vx = enemy.wallVx * speedScale;
  enemy.bounceCount += 1;
  if (mobile) enemy.reboundSpeedScale = Math.min(1.28, speedScale * 1.08);
  emitEnemyImpact(hitLeft ? 2 : playfield.clientWidth - 2, (bounds.top + bounds.bottom) / 2);
}

function updateAxe(enemy, delta, now) {
  updateReboundEnemy(enemy, delta, now, false);
}

function updateSawblade(enemy, delta, now) {
  updateReboundEnemy(enemy, delta, now, true);
}

function cubicPoint(path, progress) {
  const inverse = 1 - progress;
  return {
    x: inverse ** 3 * path[0].x + 3 * inverse ** 2 * progress * path[1].x + 3 * inverse * progress ** 2 * path[2].x + progress ** 3 * path[3].x,
    y: inverse ** 3 * path[0].y + 3 * inverse ** 2 * progress * path[1].y + 3 * inverse * progress ** 2 * path[2].y + progress ** 3 * path[3].y,
  };
}

function beginSickleWindup(enemy, now) {
  const center = getEnemyVisualCenter(enemy);
  const direction = enemy.sweepDirection;
  const targetX = Math.max(95, Math.min(playfield.clientWidth - 95, playerPosition.x));
  const targetY = Math.max(center.y + 150, Math.min(playfield.clientHeight - 110, playerPosition.y - 18));
  const start = { x: center.x - direction * 22, y: center.y - 10 };
  enemy.specialState = 'windup';
  enemy.stateStartedAt = now;
  enemy.windupStart = center;
  enemy.sweepPath = [
    start,
    { x: start.x + direction * 80, y: start.y + 18 },
    { x: targetX + direction * 165, y: targetY - 120 },
    { x: targetX - direction * 145, y: targetY + 105 },
  ];
  enemy.node.classList.add('is-sickle-windup');
}

function updateSickle(enemy, delta, now) {
  if (!finishEnemyEntry(enemy, now)) return;
  const center = getEnemyVisualCenter(enemy);
  if (enemy.specialState === 'entry') {
    enemy.vx = enemy.sweepDirection * 54;
    enemy.vy = enemy.speed;
    setEnemyVisualCenter(enemy, center.x + enemy.vx * delta, center.y + enemy.vy * delta);
    easeEnemyAngle(enemy, Math.atan2(enemy.vy, enemy.vx) * 180 / Math.PI + enemy.definition.rotationOffset, 10, delta);
    if (center.y >= Math.max(135, playerPosition.y - 300)) beginSickleWindup(enemy, now);
    return;
  }
  if (enemy.specialState === 'windup') {
    const progress = Math.min(1, (now - enemy.stateStartedAt) / 360);
    const eased = easeEntry(progress);
    const start = enemy.windupStart;
    const end = enemy.sweepPath[0];
    enemy.vx = (end.x - start.x) / .36;
    enemy.vy = (end.y - start.y) / .36;
    setEnemyVisualCenter(enemy, start.x + (end.x - start.x) * eased, start.y + (end.y - start.y) * eased);
    const pathStart = cubicPoint(enemy.sweepPath, 0);
    const pathNext = cubicPoint(enemy.sweepPath, .012);
    const tangentAngle = Math.atan2(pathNext.y - pathStart.y, pathNext.x - pathStart.x) * 180 / Math.PI;
    easeEnemyAngle(enemy, tangentAngle + enemy.definition.rotationOffset, 12, delta);
    if (progress >= 1) {
      enemy.specialState = 'sweep';
      enemy.stateStartedAt = now;
      enemy.node.classList.remove('is-sickle-windup');
      enemy.node.classList.add('is-sickle-sweeping');
    }
    return;
  }
  if (enemy.specialState === 'sweep') {
    const duration = 900;
    const progress = Math.min(1, (now - enemy.stateStartedAt) / duration);
    const position = cubicPoint(enemy.sweepPath, progress);
    const tangentProgress = Math.min(.988, progress);
    const tangentPosition = cubicPoint(enemy.sweepPath, tangentProgress);
    const nextPosition = cubicPoint(enemy.sweepPath, tangentProgress + .012);
    const directionX = nextPosition.x - tangentPosition.x;
    const directionY = nextPosition.y - tangentPosition.y;
    enemy.vx = directionX / (.012 * duration / 1000);
    enemy.vy = directionY / (.012 * duration / 1000);
    setEnemyVisualCenter(enemy, position.x, position.y);
    easeEnemyAngle(enemy, Math.atan2(directionY, directionX) * 180 / Math.PI + enemy.definition.rotationOffset, 18, delta);
    if (progress >= 1) {
      const magnitude = Math.hypot(enemy.vx, enemy.vy) || 1;
      enemy.exitVx = enemy.vx / magnitude * 240;
      enemy.exitVy = Math.max(150, enemy.vy / magnitude * 240);
      enemy.specialState = 'exit';
      enemy.node.classList.remove('is-sickle-sweeping');
    }
    return;
  }
  enemy.vx = enemy.exitVx;
  enemy.vy = enemy.exitVy;
  enemy.x += enemy.vx * delta;
  enemy.y += enemy.vy * delta;
}

function positionBombExplosionFrame(enemy, frame) {
  const scale = BOMB_EXPLOSION_SIZE / 48;
  const bounds = frame.alphaBounds;
  const centerX = bounds ? (bounds[0] + bounds[2]) / 2 : 24;
  const centerY = bounds ? (bounds[1] + bounds[3]) / 2 : 24;
  enemy.explosionNode.style.left = `${enemy.detonationX - centerX * scale}px`;
  enemy.explosionNode.style.top = `${enemy.detonationY - centerY * scale}px`;
  enemy.explosionNode.src = frame.src;
}

function beginBombExplosion(enemy, now) {
  const center = getEnemyVisualCenter(enemy);
  enemy.specialState = 'explosion';
  enemy.exploded = true;
  enemy.detonationX = center.x;
  enemy.detonationY = center.y;
  enemy.explosionStartedAt = now;
  enemy.explosionFrame = 0;
  enemy.node.classList.remove('is-bomb-warning', 'is-bomb-critical');
  enemy.node.classList.add('is-bomb-exploding');
  enemy.explosionNode = document.createElement('img');
  enemy.explosionNode.className = 'enemy-explosion';
  enemy.explosionNode.alt = '';
  enemy.explosionNode.width = BOMB_EXPLOSION_SIZE;
  enemy.explosionNode.height = BOMB_EXPLOSION_SIZE;
  positionBombExplosionFrame(enemy, BOMB_EXPLOSION_FRAMES[0]);
  enemyLayer.append(enemy.explosionNode);
  triggerFatalImpactShake();
}

function updateBomb(enemy, delta, now) {
  if (!finishEnemyEntry(enemy, now)) return;
  if (enemy.specialState === 'explosion') {
    enemy.vx = 0;
    enemy.vy = 0;
    if (!enemy.explosionChecked) {
      enemy.explosionChecked = true;
      const { halfWidth, halfHeight } = getPlayerPixelBounds(now);
      const distance = Math.hypot(playerPosition.x - enemy.detonationX, playerPosition.y - enemy.detonationY);
      if (distance <= 74 + Math.max(halfWidth, halfHeight)) {
        if (hearts === 1 && shieldedUntil <= now && invulnerableUntil <= now) beginFatalSequence(enemy, now);
        else damagePlayer(now);
      }
    }
    const frameIndex = Math.floor((now - enemy.explosionStartedAt) / BOMB_EXPLOSION_FRAME_MS);
    if (frameIndex >= BOMB_EXPLOSION_FRAMES.length) {
      enemy.explosionNode.remove();
      enemy.explosionNode = null;
      enemy.expired = true;
    } else if (frameIndex !== enemy.explosionFrame) {
      enemy.explosionFrame = frameIndex;
      positionBombExplosionFrame(enemy, BOMB_EXPLOSION_FRAMES[frameIndex]);
    }
    return;
  }
  const fuseProgress = 1 - Math.max(0, enemy.fuseEndsAt - now) / enemy.definition.fuseMs;
  enemy.node.classList.toggle('is-bomb-warning', fuseProgress >= .55);
  enemy.node.classList.toggle('is-bomb-critical', fuseProgress >= .8);
  enemy.vx = Math.sin((now - enemy.spawnedAt) * .0014 + enemy.phase) * 18;
  enemy.vy = enemy.speed;
  enemy.x += enemy.vx * delta;
  enemy.y += enemy.vy * delta;
  if (now >= enemy.fuseEndsAt) beginBombExplosion(enemy, now);
}

function updateHammer(enemy, delta, now) {
  if (!finishEnemyEntry(enemy, now)) return;
  const center = getEnemyVisualCenter(enemy);
  if (enemy.specialState === 'tracking') {
    const dx = playerPosition.x - center.x;
    enemy.vx = Math.max(-145, Math.min(145, dx * 2.2));
    enemy.vy = 0;
    setEnemyVisualCenter(enemy, center.x + enemy.vx * delta, 50 + Math.sin((now - enemy.spawnedAt) * .006) * 3);
    const trackedCenter = getEnemyVisualCenter(enemy);
    const trackingAngle = Math.atan2(playerPosition.y - trackedCenter.y, playerPosition.x - trackedCenter.x) * 180 / Math.PI;
    easeEnemyAngle(enemy, trackingAngle + enemy.definition.rotationOffset, 9, delta);
    if (now - enemy.stateStartedAt >= 1100) {
      enemy.specialState = 'lock';
      enemy.stateStartedAt = now;
      enemy.lockedLaneX = playerPosition.x;
      enemy.lockedTargetX = playerPosition.x;
      enemy.lockedTargetY = playerPosition.y;
      enemy.lockedSlamAngle = Math.atan2(enemy.lockedTargetY - 38, enemy.lockedTargetX - enemy.lockedLaneX) * 180 / Math.PI
        + enemy.definition.rotationOffset;
      const warning = document.createElement('i');
      warning.className = 'enemy-entry-warning enemy-entry-warning-hammer';
      warning.style.left = `${Math.round(enemy.lockedLaneX)}px`;
      enemy.warningNode = warning;
      enemyLayer.append(warning);
      enemy.node.classList.add('is-hammer-locked');
    }
    return;
  }
  if (enemy.specialState === 'lock') {
    const progress = Math.min(1, (now - enemy.stateStartedAt) / 330);
    enemy.vx = 0;
    enemy.vy = 0;
    setEnemyVisualCenter(enemy, enemy.lockedLaneX, 50 - easeEntry(progress) * 12);
    easeEnemyAngle(enemy, enemy.lockedSlamAngle, 14, delta);
    if (progress >= 1) {
      enemy.specialState = 'slam';
      enemy.stateStartedAt = now;
      enemy.node.classList.remove('is-hammer-locked');
      enemy.node.classList.add('is-hammer-slamming');
      if (enemy.warningNode) {
        enemy.warningNode.remove();
        enemy.warningNode = null;
      }
    }
    return;
  }
  if (enemy.specialState === 'slam') {
    enemy.vx = 0;
    enemy.vy = 680 * getEnemySpeedMultiplier(enemy.definition);
    setEnemyAngle(enemy, enemy.lockedSlamAngle);
    enemy.y += enemy.vy * delta;
    const bounds = getEnemySpriteBounds(enemy);
    if (bounds.bottom >= playfield.clientHeight - 5) {
      enemy.y -= bounds.bottom - (playfield.clientHeight - 5);
      enemy.specialState = 'impact';
      enemy.stateStartedAt = now;
      enemy.harmless = true;
      enemy.node.classList.remove('is-hammer-slamming');
      enemy.node.classList.add('is-hammer-impact');
      emitEnemyImpact(enemy.lockedLaneX, playfield.clientHeight - 6, 'heavy');
      triggerFatalImpactShake();
    }
    return;
  }
  if (enemy.specialState === 'impact') {
    enemy.vx = 0;
    enemy.vy = 0;
    if (now - enemy.stateStartedAt >= 340) {
      enemy.specialState = 'retreat';
      enemy.node.classList.remove('is-hammer-impact');
    }
    return;
  }
  enemy.vx = 0;
  enemy.vy = -250;
  enemy.y += enemy.vy * delta;
  if (getEnemySpriteBounds(enemy).bottom < -8) enemy.expired = true;
}

const ENEMY_UPDATERS = {
  arrow: updateArrow,
  knife: updateKnife,
  scissor: updateScissor,
  cannonball: updateCannonball,
  fork: updateFork,
  axe: updateAxe,
  sawblade: updateSawblade,
  sickle: updateSickle,
  bomb: updateBomb,
  hammer: updateHammer,
};

function updateRetreatingEnemy(enemy, delta) {
  enemy.vx = enemy.retreatVx;
  enemy.vy = enemy.retreatVy;
  enemy.x += enemy.vx * delta;
  enemy.y += enemy.vy * delta;
}

function updateEnemyMovement(enemy, delta, now) {
  if (enemy.retreating) {
    updateRetreatingEnemy(enemy, delta);
    return;
  }
  ENEMY_UPDATERS[enemy.definition.name](enemy, delta, now);
}

function rectanglesOverlap(first, second) {
  return first.left < second.right && first.right > second.left && first.top < second.bottom && first.bottom > second.top;
}

function hitTest(projectile, enemy) {
  if (enemy.retreating || enemy.exploded || enemy.expired) return false;
  const projectileBounds = {
    left: projectile.x,
    top: projectile.y,
    right: projectile.x + projectile.width,
    bottom: projectile.y + projectile.height,
  };
  return getEnemyCollisionBoxes(enemy).some((bounds) => rectanglesOverlap(projectileBounds, bounds));
}

function playerHitTest(enemy, now) {
  if (enemy.retreating || enemy.harmless || enemy.exploded || enemy.expired) return false;
  const { halfWidth, halfHeight } = getPlayerPixelBounds(now);
  const bounds = getEnemySpriteBounds(enemy);
  if (enemy.definition.name === 'knife') {
    if (enemy.passedPlayer) return false;
    if (bounds.top > playerPosition.y) {
      enemy.passedPlayer = true;
      return false;
    }
  }
  const playerBounds = {
    left: playerPosition.x - halfWidth,
    top: playerPosition.y - halfHeight,
    right: playerPosition.x + halfWidth,
    bottom: playerPosition.y + halfHeight,
  };
  return getEnemyCollisionBoxes(enemy).some((box) => rectanglesOverlap(playerBounds, box));
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
  nextEnemyAt = Infinity;
  waveLabel.textContent = 'WAVE COMPLETE';
  waveProgressNode.textContent = `${WAVE_KILL_TARGET}/${WAVE_KILL_TARGET}`;
  waveProgressNode.setAttribute('aria-label', 'Wave complete');
  playfield.classList.add('is-wave-complete');
  enemies.forEach((enemy) => {
    if (enemy.isDying) return;
    const center = getEnemyVisualCenter(enemy);
    enemy.retreating = true;
    enemy.harmless = true;
    enemy.exploded = false;
    enemy.expired = false;
    enemy.retreatVx = center.x < playfield.clientWidth / 2 ? -230 : 230;
    enemy.retreatVy = -100;
    enemy.node.classList.remove(
      'is-telegraph', 'is-striking', 'is-recovering', 'is-sickle-windup', 'is-sickle-sweeping',
      'is-bomb-warning', 'is-bomb-critical', 'is-bomb-exploding', 'is-hammer-locked', 'is-hammer-slamming', 'is-hammer-impact',
    );
    enemy.node.classList.add('is-wave-retreating');
    if (enemy.warningNode) {
      enemy.warningNode.remove();
      enemy.warningNode = null;
    }
    if (enemy.explosionNode) {
      enemy.explosionNode.remove();
      enemy.explosionNode = null;
    }
  });
}

function confirmEnemyKill(now) {
  if (waveTransitionUntil > now || waveKills >= WAVE_KILL_TARGET) return;
  waveKills += 1;
  updateWaveHud();
  if (wave === 1 && waveKills < WAVE_KILL_TARGET) {
    nextEnemyAt = now + WAVE_ONE_SPAWN_DELAYS_MS[waveKills];
    if (waveKills === 3) nextPowerupAt = now + 500;
  }
  if (waveKills === WAVE_KILL_TARGET) completeWave(now);
}

function advanceWave(now) {
  if (!waveTransitionUntil || now < waveTransitionUntil) return;
  enemies.forEach(removeEnemyVisual);
  enemies = [];
  wave += 1;
  waveKills = 0;
  waveTransitionUntil = 0;
  nextEnemyAt = now + 500;
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
  renderEnemy(enemy);
}

function setCameraOffset(x, y) {
  gameWorld.style.setProperty('--camera-x', `${Math.round(x)}px`);
  gameWorld.style.setProperty('--camera-y', `${Math.round(y)}px`);
}

function setCameraZoom(scale = 1, originX = playfield.clientWidth / 2, originY = playfield.clientHeight / 2) {
  gameWorld.style.setProperty('--camera-scale', String(Math.round(scale * 1000) / 1000));
  gameWorld.style.setProperty('--camera-origin-x', `${Math.round(originX)}px`);
  gameWorld.style.setProperty('--camera-origin-y', `${Math.round(originY)}px`);
}

function resetCamera() {
  setCameraOffset(0, ENTRY_PREINTRO_CAMERA_START_Y);
  setCameraZoom(1);
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
  setEnemyAngle(enemy, 0);
  const spriteCenterX = enemy.visualBounds.centerX;
  const spriteBottom = enemy.visualBounds.bottom;
  const preImpactY = playerPosition.y - halfHeight - spriteBottom - FATAL_PRE_IMPACT_GAP_PX;
  enemy.exploded = false;
  enemy.harmless = false;
  enemy.retreating = false;
  if (enemy.explosionNode) {
    enemy.explosionNode.remove();
    enemy.explosionNode = null;
  }
  enemy.node.classList.remove(
    'is-bomb-warning', 'is-bomb-critical', 'is-bomb-exploding', 'is-hammer-locked', 'is-hammer-slamming', 'is-hammer-impact',
    'is-sickle-windup', 'is-sickle-sweeping',
  );
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
    const candidateCenterX = getEnemyVisualCenter(candidate).x;
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
  if (enemy.warningNode) {
    enemy.warningNode.remove();
    enemy.warningNode = null;
  }
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
      fatalSequence.retreatingEnemies.forEach(({ enemy: retreatingEnemy }) => removeEnemyVisual(retreatingEnemy));
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
      const spriteBottom = enemy.visualBounds.bottom;
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
    removeEnemyVisual(enemy);
    enemies = [];
    damagePlayer(now);
  }
}

function updateEntities(delta, now) {
  const height = playfield.clientHeight;
  projectiles = projectiles.filter((projectile) => {
    projectile.x += delta * projectile.vx;
    projectile.y -= delta * projectile.vy;
    const frameIndex = Math.floor((now - projectile.spawnedAt) / PROJECTILE_FRAME_MS) % PROJECTILE_FRAMES.length;
    if (frameIndex !== projectile.frameIndex) {
      projectile.frameIndex = frameIndex;
      projectile.node.src = PROJECTILE_FRAMES[frameIndex];
    }
    projectile.node.style.transform = `translate(${projectile.x}px, ${projectile.y}px)`;
    if (projectile.y < -40 || projectile.x < -40 || projectile.x > playfield.clientWidth + 40) {
      projectile.node.remove();
      return false;
    }
    return true;
  });

  enemies = enemies.filter((enemy) => {
    if (enemy.hitAt > 0) {
      updateEnemyTrail(enemy, now);
      if (now - enemy.hitAt < 160) return true;
      enemy.node.classList.remove('is-hit');
      enemy.hitAt = 0;
      if (enemy.isDying) {
        removeEnemyVisual(enemy);
        return false;
      }
    }
    updateEnemyMovement(enemy, delta, now);
    renderEnemy(enemy, now);
    if (enemy.expired) {
      removeEnemyVisual(enemy);
      return false;
    }
    if (enemy.retreating) {
      const retreatBounds = getEnemySpriteBounds(enemy);
      if (retreatBounds.right < -10 || retreatBounds.left > playfield.clientWidth + 10 || retreatBounds.bottom < -10) {
        removeEnemyVisual(enemy);
        return false;
      }
      return true;
    }
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
      if (shieldedUntil > now) {
        const center = getEnemyVisualCenter(enemy);
        emitEnemyImpact(center.x, center.y, 'shield');
        removeEnemyVisual(enemy);
        return false;
      }
      if (invulnerableUntil > now) {
        enemy.y += Math.max(8, Math.abs(enemy.vy) * delta);
        return true;
      }
      if (hearts === 1) {
        enemy.strikeContactPending = false;
        beginFatalSequence(enemy, now);
        return true;
      }
      if (enemy.strikeContactPending || enemy.attackState === 'strike') {
        enemy.strikeContactPending = false;
        removeEnemyVisual(enemy);
        damagePlayer(now);
        return false;
      }
      if (enemy.attackState === 'approach') {
        if (enemy.canStrike) {
          enemy.attackReadyAt = now;
          beginEnemyStrike(enemy, now);
        } else {
          removeEnemyVisual(enemy);
          damagePlayer(now);
          return false;
        }
      }
      return true;
    }
    enemy.strikeContactPending = false;
    const bounds = getEnemySpriteBounds(enemy);
    if (bounds.top > height + 30 || bounds.right < -enemy.size * .5 || bounds.left > playfield.clientWidth + enemy.size * .5) {
      removeEnemyVisual(enemy);
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
      else if (powerup.type === 'ammo') activateAmmoPack(now);
      else activateSpreadShot(now);
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

function updateSpreadStatus(now) {
  if (spreadShotUntil <= now) {
    spreadStatus.classList.add('is-hidden');
    spreadStatus.classList.remove('is-expiring');
    return;
  }
  spreadStatus.classList.remove('is-hidden');
  spreadStatus.classList.toggle('is-expiring', spreadShotUntil - now <= POWERUP_WARNING_MS);
}

function updatePowerupFlicker(now) {
  const activeExpirations = [shieldedUntil, grownUntil]
    .concat(ammoBoostUntil, spreadShotUntil)
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

function getPreintroCameraTargetY(sceneY) {
  const tarubTopOffset = PREINTRO_TARUB_VISIBLE_BOUNDS.y * (ENTRY_PREINTRO_SIZE / PREINTRO_SCENE_CANVAS_SIZE)
    - ENTRY_PREINTRO_SIZE / 2;
  return Math.round(playfield.clientHeight * PREINTRO_TARUB_TARGET_TOP_RATIO - (sceneY + tarubTopOffset));
}

function getEntryCloudMotion(phase, elapsed, launchSpeed) {
  if (phase === 'rocket') {
    const intensity = Math.min(1, Math.max(0, launchSpeed / 1800));
    return {
      verticalScale: .25,
      horizontalScale: .2,
      launchParallax: 180 + intensity * 720,
      recycle: false,
    };
  }
  if (phase === 'overshoot-hold') {
    const progress = Math.min(1, elapsed / ENTRY_OVERSHOOT_HOLD_MS);
    return { verticalScale: .45, horizontalScale: .35, launchParallax: 190 * (1 - easeEntry(progress)), recycle: false };
  }
  if (phase === 'drift-down') return { verticalScale: .68, horizontalScale: .55, recycle: false };
  if (['low-pause', 'correction-up', 'tiny-pause', 'correction-down', 'settle', 'settled'].includes(phase)) {
    return { verticalScale: .82, horizontalScale: .78, recycle: false };
  }
  return { verticalScale: .3, horizontalScale: .28, recycle: false };
}

function retireEntrySceneWhenClear(phase) {
  if (entryScene.hidden || ['preintro', 'wait'].includes(phase)) return;
  const sceneRect = entryScene.getBoundingClientRect();
  const playfieldRect = playfield.getBoundingClientRect();
  if (sceneRect.top > playfieldRect.bottom + 24 || sceneRect.bottom < playfieldRect.top - 24) {
    entryScene.hidden = true;
    entryScene.removeAttribute('src');
    entryScene.dataset.state = 'retired';
    entryChair.hidden = true;
    entryChair.removeAttribute('src');
    entryChair.dataset.state = 'retired';
    player.classList.remove('is-entry-transitioning');
  }
}

function setEntryPhase(phase, now) {
  entryCutscene.phase = phase;
  entryCutscene.phaseStartedAt = now;
  if (phase === 'wait') {
    player.classList.remove('is-entry-preintro');
    player.classList.add('is-entry-transitioning');
    player.style.removeProperty('--entry-preintro-size');
    entryScene.src = `${ENTRY_TRANSITION_FRAME}?entry-transition=${Math.round(now)}`;
    entryScene.dataset.state = 'transition';
    idleSerial += 1;
    shipSprite.src = `${IDLE_GIF}?entry-idle=${idleSerial}`;
    shipSprite.dataset.state = 'idle';
    player.classList.add('is-entry-bracing');
  }
  if (phase === 'rocket') player.classList.remove('is-entry-bracing');
  if (phase === 'overshoot-hold') triggerEntryLaunchShake();
}

function beginEntryCutscene(now) {
  const finalX = playfield.clientWidth / 2;
  const finalY = playfield.clientHeight - 70;
  const sceneY = playfield.clientHeight + SHIP_SIZE;
  entryCutsceneActive = true;
  entryCutscene = {
    phase: 'preintro',
    phaseStartedAt: now,
    finalX,
    finalY,
    sceneY,
    startY: sceneY + ENTRY_PREINTRO_JUNJUN_CENTER_OFFSET_Y,
    overshootY: Math.max(18, SHIP_SIZE * .24),
    tooFarDownY: finalY + 64,
    correctionHighY: finalY - 22,
    correctionLowY: finalY + 10,
    cameraX: 0,
    cameraY: 0,
    previousY: sceneY + ENTRY_PREINTRO_JUNJUN_CENTER_OFFSET_Y,
  };
  keys.clear();
  createClouds(sceneY);
  setPlayerPosition(finalX, entryCutscene.startY);
  setCameraOffset(0, ENTRY_PREINTRO_CAMERA_START_Y);
  setCameraZoom(1, finalX, entryCutscene.startY);
  player.classList.add('is-entry-preintro');
  player.style.setProperty('--entry-preintro-size', `${ENTRY_PREINTRO_SIZE}px`);
  entryScene.style.setProperty('--entry-preintro-size', `${ENTRY_PREINTRO_SIZE}px`);
  entryScene.style.left = `${finalX}px`;
  entryScene.style.top = `${entryCutscene.sceneY}px`;
  entryChair.style.setProperty('--entry-preintro-size', `${ENTRY_PREINTRO_SIZE}px`);
  entryChair.style.left = `${finalX}px`;
  entryChair.style.top = `${entryCutscene.sceneY}px`;
  entryChair.src = './public/assets/chairbehindtarub.png';
  entryChair.dataset.state = 'active';
  entryChair.hidden = false;
  entryScene.src = `${ENTRY_PREINTRO_GIF}?entry=${Math.round(now)}`;
  entryScene.dataset.state = 'preintro';
  entryScene.hidden = false;
}

function updateEntryCutscene(now, delta) {
  if (!entryCutsceneActive || !entryCutscene) return;
  const cutscene = entryCutscene;
  const phaseAtFrameStart = cutscene.phase;
  const elapsed = now - cutscene.phaseStartedAt;
  let y = cutscene.finalY;
  switch (cutscene.phase) {
    case 'preintro':
      y = cutscene.startY;
      if (elapsed >= ENTRY_PREINTRO_MS) setEntryPhase('wait', now);
      break;
    case 'wait': {
      const braceProgress = easeEntry(Math.min(1, elapsed / ENTRY_WAIT_MS));
      y = cutscene.startY + ENTRY_BRACE_OFFSET_PX * braceProgress;
      if (elapsed >= ENTRY_WAIT_MS) setEntryPhase('rocket', now);
      break;
    }
    case 'rocket': {
      const progress = Math.min(1, elapsed / ENTRY_ROCKET_MS);
      const launch = 1 - ((1 - progress) ** 6);
      const launchStartY = cutscene.startY + ENTRY_BRACE_OFFSET_PX;
      y = launchStartY + (cutscene.overshootY - launchStartY) * launch;
      if (progress >= 1) setEntryPhase('overshoot-hold', now);
      break;
    }
    case 'overshoot-hold':
      y = cutscene.overshootY;
      if (elapsed >= ENTRY_OVERSHOOT_HOLD_MS) setEntryPhase('drift-down', now);
      break;
    case 'drift-down': {
      const progress = Math.min(1, elapsed / ENTRY_DRIFT_MS);
      y = cutscene.overshootY + (cutscene.tooFarDownY - cutscene.overshootY) * easeEntry(progress);
      if (progress >= 1) setEntryPhase('low-pause', now);
      break;
    }
    case 'low-pause':
      y = cutscene.tooFarDownY;
      if (elapsed >= ENTRY_LOW_PAUSE_MS) setEntryPhase('correction-up', now);
      break;
    case 'correction-up': {
      const progress = Math.min(1, elapsed / ENTRY_CORRECTION_UP_MS);
      y = cutscene.tooFarDownY + (cutscene.correctionHighY - cutscene.tooFarDownY) * easeEntry(progress);
      if (progress >= 1) setEntryPhase('tiny-pause', now);
      break;
    }
    case 'tiny-pause':
      y = cutscene.correctionHighY;
      if (elapsed >= ENTRY_TINY_PAUSE_MS) setEntryPhase('correction-down', now);
      break;
    case 'correction-down': {
      const progress = Math.min(1, elapsed / ENTRY_CORRECTION_DOWN_MS);
      y = cutscene.correctionHighY + (cutscene.correctionLowY - cutscene.correctionHighY) * easeEntry(progress);
      if (progress >= 1) setEntryPhase('settle', now);
      break;
    }
    case 'settle': {
      const progress = Math.min(1, elapsed / ENTRY_SETTLE_MS);
      y = cutscene.correctionLowY + (cutscene.finalY - cutscene.correctionLowY) * easeEntry(progress);
      if (progress >= 1) setEntryPhase('settled', now);
      break;
    }
    case 'settled':
      y = cutscene.finalY;
      if (elapsed >= ENTRY_SETTLE_HOLD_MS) {
        keys.clear();
        setPlayerPosition(cutscene.finalX, cutscene.finalY);
        setCameraOffset(0, 0);
        setCameraZoom(1);
        entryScene.hidden = true;
        entryScene.removeAttribute('src');
        entryScene.dataset.state = 'hidden';
        entryChair.hidden = true;
        entryChair.removeAttribute('src');
        entryChair.dataset.state = 'hidden';
        player.classList.remove('is-entry-transitioning');
        player.classList.add('is-entry-relieved');
        setEntryPhase('freedom', now);
        return;
      }
      break;
    case 'freedom':
      y = cutscene.finalY;
      setCameraOffset(0, 0);
      setCameraZoom(1);
      updateClouds(delta);
      if (elapsed >= ENTRY_FREEDOM_CONTROL_DELAY_MS) movePlayer(delta);
      if (elapsed >= ENTRY_FREEDOM_HUD_DELAY_MS) {
        playfield.classList.add('is-gameplay-ui-visible');
        playfieldWrap.classList.add('is-gameplay-ui-visible');
      }
      if (elapsed >= ENTRY_FREEDOM_MS) {
        player.classList.remove('is-entry-relieved');
        entryCutsceneActive = false;
        entryCutscene = null;
        nextEnemyAt = now;
        spawnEnemy();
      }
      return;
    default:
      entryCutsceneActive = false;
      entryCutscene = null;
      return;
  }
  setPlayerPosition(cutscene.finalX, Math.round(y));
  const launchSpeed = delta > 0 ? Math.max(0, (cutscene.previousY - y) / delta) : 0;
  cutscene.previousY = y;
  const gameplayCameraY = cutscene.finalY - y;
  const centerCameraY = playfield.clientHeight / 2 - y;
  const sceneCenterCameraY = playfield.clientHeight / 2 - cutscene.sceneY;
  const preintroCameraTargetY = getPreintroCameraTargetY(cutscene.sceneY);
  let cameraTargetY = gameplayCameraY;
  let cameraEase = 4;
  if (phaseAtFrameStart === 'preintro') {
    // Move through the fixed world composition. A short low-camera beat leaves
    // the sky empty, then the scene enters immediately and settles into framing.
    const initialRevealProgress = Math.min(1, Math.max(0, (elapsed - ENTRY_PREINTRO_CAMERA_REVEAL_DELAY_MS) / ENTRY_PREINTRO_CAMERA_INITIAL_REVEAL_MS));
    const slowRevealProgress = easeEntry(Math.min(1, Math.max(0, (elapsed - ENTRY_PREINTRO_CAMERA_REVEAL_DELAY_MS - ENTRY_PREINTRO_CAMERA_INITIAL_REVEAL_MS)
      / (ENTRY_PREINTRO_MS - ENTRY_PREINTRO_CAMERA_REVEAL_DELAY_MS - ENTRY_PREINTRO_CAMERA_INITIAL_REVEAL_MS))));
    if (elapsed < ENTRY_PREINTRO_CAMERA_REVEAL_DELAY_MS) {
      cutscene.cameraY = ENTRY_PREINTRO_CAMERA_START_Y;
    } else if (elapsed < ENTRY_PREINTRO_CAMERA_REVEAL_DELAY_MS + ENTRY_PREINTRO_CAMERA_INITIAL_REVEAL_MS) {
      cutscene.cameraY = ENTRY_PREINTRO_CAMERA_START_Y * (1 - easeEntry(initialRevealProgress));
    } else {
      cutscene.cameraY = preintroCameraTargetY * slowRevealProgress;
    }
    const pushProgress = easeEntry(Math.min(1, Math.max(0, (elapsed - (ENTRY_PREINTRO_MS - ENTRY_PRELAUNCH_PUSH_MS)) / ENTRY_PRELAUNCH_PUSH_MS)));
    const pushScale = 1 + (ENTRY_PRELAUNCH_ZOOM - 1) * pushProgress;
    setCameraOffset(cutscene.cameraX, cutscene.cameraY);
    setCameraZoom(pushScale, cutscene.finalX, cutscene.startY);
    updateClouds(delta, getEntryCloudMotion(phaseAtFrameStart, elapsed, launchSpeed));
    return;
  } else if (phaseAtFrameStart === 'wait') {
    // Hold the reveal framing during the handoff instead of snapping back
    // before the existing launch begins.
    cameraTargetY = preintroCameraTargetY;
    cameraEase = 2.4;
    setCameraZoom(ENTRY_PRELAUNCH_ZOOM, cutscene.finalX, cutscene.startY);
  } else if (phaseAtFrameStart === 'rocket') {
    const launchProgress = Math.min(1, elapsed / ENTRY_ROCKET_MS);
    const zoomRecovery = 1 - ((1 - launchProgress) ** 3);
    setCameraZoom(ENTRY_PRELAUNCH_ZOOM + (1 - ENTRY_PRELAUNCH_ZOOM) * zoomRecovery, cutscene.finalX, cutscene.startY);
    if (elapsed < ENTRY_CAMERA_REACTION_DELAY_MS) {
      cameraTargetY = preintroCameraTargetY;
      cameraEase = 1.7;
    } else {
      const recoveryProgress = Math.min(1, (elapsed - ENTRY_CAMERA_REACTION_DELAY_MS) / (ENTRY_ROCKET_MS - ENTRY_CAMERA_REACTION_DELAY_MS));
      const recoveryEase = 1 - ((1 - recoveryProgress) ** 3);
      const recoveryTarget = gameplayCameraY + (centerCameraY - gameplayCameraY) * .78;
      cameraTargetY = preintroCameraTargetY + (recoveryTarget - preintroCameraTargetY) * recoveryEase;
      cameraEase = 8;
    }
  } else if (cutscene.phase === 'overshoot-hold') {
    setCameraZoom(1, cutscene.finalX, cutscene.startY);
    const holdProgress = Math.min(1, elapsed / ENTRY_OVERSHOOT_HOLD_MS);
    const cameraOverrun = (1 - easeEntry(holdProgress)) * 22;
    cameraTargetY = centerCameraY + cameraOverrun;
    cameraEase = 7;
  } else if (cutscene.phase === 'drift-down') {
    setCameraZoom(1, cutscene.finalX, cutscene.startY);
    const driftProgress = Math.min(1, elapsed / ENTRY_DRIFT_MS);
    const centerBlend = .72 * (1 - easeEntry(driftProgress));
    cameraTargetY = gameplayCameraY + (centerCameraY - gameplayCameraY) * centerBlend;
    cameraEase = 3;
  } else if (cutscene.phase === 'low-pause' || cutscene.phase === 'correction-up' || cutscene.phase === 'tiny-pause' || cutscene.phase === 'correction-down') {
    // The joke has landed; keep the corrections readable while the camera quietly returns home.
    cameraTargetY = gameplayCameraY * .12;
    cameraEase = 2.5;
    setCameraZoom(1, cutscene.finalX, cutscene.startY);
  } else if (cutscene.phase === 'settle' || cutscene.phase === 'settled') {
    const residual = cutscene.phase === 'settle'
      ? 4 * (1 - easeEntry(Math.min(1, elapsed / ENTRY_SETTLE_MS)))
      : 0;
    cameraTargetY = gameplayCameraY + residual;
    cameraEase = 4.5;
    setCameraZoom(1, cutscene.finalX, cutscene.startY);
  }
  cutscene.cameraY += (cameraTargetY - cutscene.cameraY) * Math.min(1, delta * cameraEase);
  setCameraOffset(cutscene.cameraX, cutscene.cameraY);
  retireEntrySceneWhenClear(phaseAtFrameStart);
  updateClouds(delta, getEntryCloudMotion(phaseAtFrameStart, elapsed, launchSpeed));
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
  updateSpreadStatus(now);
  updatePowerupFlicker(now);
  advanceWave(now);
  const activeEnemyCount = enemies.filter((enemy) => !enemy.retreating && !enemy.isDying && !enemy.exploded).length;
  const maxEnemies = wave === 1 ? 1 : Math.min(7, 2 + Math.floor(wave / 2));
  if (!waveTransitionUntil && now >= nextEnemyAt && activeEnemyCount < maxEnemies) {
    const spawned = spawnEnemy();
    if (wave !== 1) nextEnemyAt = now + (spawned ? getEnemySpawnInterval() : 140);
  }
  if (now >= nextPowerupAt && (wave !== 1 || !waveOnePowerupSpawned)) {
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
  player.classList.remove('is-entry-transitioning');
  score = 0;
  hearts = MAX_HEARTS;
  ammo = MAX_AMMO;
  wave = 1;
  waveKills = 0;
  waveTransitionUntil = 0;
  playfield.classList.remove('is-gameplay-ui-visible');
  playfieldWrap.classList.remove('is-gameplay-ui-visible');
  enemySpawnSerial = 0;
  lastEnemyType = '';
  nextEnemyAt = Infinity;
  waveOnePowerupSpawned = false;
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
  spreadShotUntil = 0;
  shieldSerial = 0;
  nextPowerupAt = Infinity;
  scoreNode.textContent = padScore(score);
  updateWaveHud();
  updateHearts();
  updateAmmo();
  enemies.forEach(removeEnemyVisual);
  projectiles.forEach((projectile) => projectile.node.remove());
  powerups.forEach((powerup) => powerup.node.remove());
  enemies = [];
  projectiles = [];
  powerups = [];
  clearPowerupParticles();
  resetPlayer();
  clearClouds();
  resetCamera();
  shieldStatus.classList.add('is-hidden');
  growthStatus.classList.add('is-hidden');
  ammoStatus.classList.add('is-hidden');
  spreadStatus.classList.add('is-hidden');
  shieldStatus.classList.remove('is-expiring');
  growthStatus.classList.remove('is-expiring');
  ammoStatus.classList.remove('is-expiring');
  spreadStatus.classList.remove('is-expiring');
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
  spreadShotUntil = 0;
  clearPowerupParticles();
  enemies.forEach(removeEnemyVisual);
  enemies = [];
  player.classList.remove('is-shielded');
  player.classList.remove('is-grown');
  player.classList.remove('is-hurt', 'is-powerup-expiring');
  ammoStatus.classList.add('is-hidden');
  ammoStatus.classList.remove('is-expiring');
  spreadStatus.classList.add('is-hidden');
  spreadStatus.classList.remove('is-expiring');
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
resetPlayer();
