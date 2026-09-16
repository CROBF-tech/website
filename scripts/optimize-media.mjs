#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const publicDir = path.join(root, 'public');

const { path: ffmpeg } = await import('@ffmpeg-installer/ffmpeg');

const videos = [
    'video_1.mp4',
    'hexadevs.mp4',
    'video_3.mp4',
    'olympo.mp4',
    'video_4.mp4',
    'TodoApp.mp4',
    'video_5.mp4',
    'Bunny_Js.mp4',
    'flashcards.mp4',
    'video_card1.mp4',
    'carddesarrollo.mp4',
    'video_formulario.mp4',
];

function run(args) {
    execFileSync(ffmpeg, args, { stdio: 'inherit' });
}

for (const name of videos) {
    const input = path.join(publicDir, name);
    if (!existsSync(input)) {
        console.log(`Skipping ${name}: file not found`);
        continue;
    }

    const base = path.basename(name, path.extname(name));
    const webmOutput = path.join(publicDir, `${base}.webm`);
    const posterOutput = path.join(publicDir, `${base}-poster.jpg`);

    console.log(`\nProcessing ${name}...`);

    // Generate poster at 25% duration or 1s if too short
    if (!existsSync(posterOutput)) {
        console.log(`  → poster: ${base}-poster.jpg`);
        run([
            '-y',
            '-i', input,
            '-ss', '00:00:01.000',
            '-vframes', '1',
            '-q:v', '2',
            '-vf', 'scale=480:-1',
            posterOutput,
        ]);
    } else {
        console.log(`  ✓ poster exists: ${base}-poster.jpg`);
    }

    // Convert to WebM/VP9 with reasonable quality for autoplay background videos
    if (!existsSync(webmOutput)) {
        console.log(`  → webm: ${base}.webm`);
        run([
            '-y',
            '-i', input,
            '-c:v', 'libvpx-vp9',
            '-crf', '32',
            '-b:v', '0',
            '-deadline', 'good',
            '-cpu-used', '5',
            '-row-mt', '1',
            '-c:a', 'libopus',
            '-an', // videos are autoplay muted, no audio needed
            '-vf', 'scale=720:-1',
            webmOutput,
        ]);
    } else {
        console.log(`  ✓ webm exists: ${base}.webm`);
    }
}

console.log('\nDone.');
