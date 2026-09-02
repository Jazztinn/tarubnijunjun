import { existsSync, statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const gif = new URL('../public/assets/ship-shoot.gif', import.meta.url).pathname;
const deathGif = new URL('../public/assets/ship-death.gif', import.meta.url).pathname;
const deathFramesDir = new URL('../public/assets/death-frames/', import.meta.url).pathname;
const idle = new URL('../public/assets/ship-idle.png', import.meta.url).pathname;
const powerupSource = new URL('../public/assets/durexnijunjun.tiff', import.meta.url).pathname;
const powerup = new URL('../public/assets/durexnijunjun.png', import.meta.url).pathname;
const growthSource = new URL('../public/assets/viagranijunjun.tiff', import.meta.url).pathname;
const growthPowerup = new URL('../public/assets/viagranijunjun.png', import.meta.url).pathname;
const aliveHeart = new URL('../public/assets/alive-heart.png', import.meta.url).pathname;
const brokenHeart = new URL('../public/assets/brokenhearted.png', import.meta.url).pathname;
const enabledShield = new URL('../public/assets/enabled-shield.png', import.meta.url).pathname;
const enabledGrowth = new URL('../public/assets/enabled-growth.png', import.meta.url).pathname;
const ammoPack = new URL('../public/assets/ammopack.png', import.meta.url).pathname;
const enabledAmmoPack = new URL('../public/assets/ammopackenabled.png', import.meta.url).pathname;
const hudAmmoPack = new URL('../public/assets/hud-ammopack.png', import.meta.url).pathname;
const enemySources = [
  ['kutsily.tiff', 'kutsily.png'],
  ['scissor.tiff', 'scissor.png'],
];

if (!existsSync(gif)) throw new Error(`Missing authoritative ship GIF: ${gif}`);
if (!existsSync(deathGif)) throw new Error(`Missing authoritative death GIF: ${deathGif}`);

const hudSprites = [
  [aliveHeart, new URL('../public/assets/hud-heart-alive.png', import.meta.url).pathname, 'crop=9:9:20:20', 'alive heart'],
  [brokenHeart, new URL('../public/assets/hud-heart-broken.png', import.meta.url).pathname, 'crop=9:9:20:20', 'broken heart'],
  [enabledShield, new URL('../public/assets/hud-shield.png', import.meta.url).pathname, 'crop=9:13:20:18', 'shield icon'],
  [enabledGrowth, new URL('../public/assets/hud-growth.png', import.meta.url).pathname, 'crop=9:13:20:18', 'growth icon'],
  [enabledAmmoPack, hudAmmoPack, 'crop=11:7:19:20', 'ammo pack enabled icon'],
];
for (const [source, output, crop, label] of hudSprites) {
  if (!existsSync(source)) throw new Error(`Missing HUD source image: ${source}`);
  if (!existsSync(output) || statSync(output).mtimeMs < statSync(source).mtimeMs) {
    const result = spawnSync('ffmpeg', ['-y', '-i', source, '-vf', crop, '-frames:v', '1', output], { stdio: 'inherit' });
    if (result.status !== 0) throw new Error(`ffmpeg could not normalize ${label}`);
    console.log(`Normalized ${label} bounds`);
  } else {
    console.log(`${label} bounds current`);
  }
}
if (!existsSync(deathFramesDir)) {
  const result = spawnSync('mkdir', ['-p', deathFramesDir], { stdio: 'inherit' });
  if (result.status !== 0) throw new Error('Could not create death frames directory');
}
const deathFrame = `${deathFramesDir}frame-%02d.png`;
const deathFrameCheck = `${deathFramesDir}frame-08.png`;
if (!existsSync(deathFrameCheck) || statSync(deathFrameCheck).mtimeMs < statSync(deathGif).mtimeMs) {
  const result = spawnSync('ffmpeg', ['-y', '-i', deathGif, '-vsync', '0', deathFrame], { stdio: 'inherit' });
  if (result.status !== 0) throw new Error('ffmpeg could not extract death animation frames');
  console.log('Extracted death animation frames');
} else {
  console.log('Death animation frames current');
}
if (!existsSync(idle) || statSync(idle).mtimeMs < statSync(gif).mtimeMs) {
  const result = spawnSync('ffmpeg', ['-y', '-i', gif, '-frames:v', '1', idle], { stdio: 'inherit' });
  if (result.status !== 0) throw new Error('ffmpeg could not extract ship idle frame');
  console.log('Extracted first GIF frame → public/assets/ship-idle.png');
} else {
  console.log('Idle frame current → public/assets/ship-idle.png');
}

if (!existsSync(powerupSource)) throw new Error(`Missing powerup source image: ${powerupSource}`);
if (!existsSync(powerup) || statSync(powerup).mtimeMs < statSync(powerupSource).mtimeMs) {
  const result = spawnSync('sips', ['-s', 'format', 'png', powerupSource, '--out', powerup], { stdio: 'inherit' });
  if (result.status !== 0) throw new Error('sips could not convert durexnijunjun.tiff to PNG');
  console.log('Converted powerup source → public/assets/durexnijunjun.png');
} else {
  console.log('Powerup image current → public/assets/durexnijunjun.png');
}

if (!existsSync(growthSource)) throw new Error(`Missing growth source image: ${growthSource}`);
if (!existsSync(growthPowerup) || statSync(growthPowerup).mtimeMs < statSync(growthSource).mtimeMs) {
  const result = spawnSync('sips', ['-s', 'format', 'png', growthSource, '--out', growthPowerup], { stdio: 'inherit' });
  if (result.status !== 0) throw new Error('sips could not convert viagranijunjun.tiff to PNG');
  console.log('Converted growth source → public/assets/viagranijunjun.png');
} else {
  console.log('Growth image current → public/assets/viagranijunjun.png');
}

for (const [sourceName, outputName] of enemySources) {
  const source = new URL(`../public/assets/${sourceName}`, import.meta.url).pathname;
  const output = new URL(`../public/assets/${outputName}`, import.meta.url).pathname;
  if (!existsSync(source)) throw new Error(`Missing enemy source image: ${source}`);
  if (!existsSync(output) || statSync(output).mtimeMs < statSync(source).mtimeMs) {
    const result = spawnSync('sips', ['-s', 'format', 'png', source, '--out', output], { stdio: 'inherit' });
    if (result.status !== 0) throw new Error(`sips could not convert ${sourceName} to PNG`);
    console.log(`Converted enemy source → public/assets/${outputName}`);
  } else {
    console.log(`Enemy image current → public/assets/${outputName}`);
  }
}
