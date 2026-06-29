const fs = require("node:fs");
const path = require("node:path");
const zlib = require("node:zlib");

const root = path.resolve(__dirname, "..");
const audioDir = path.join(root, "public", "audio");
const coverDir = path.join(root, "public", "covers");

const tracks = [
  {
    id: "electric-bloom",
    duration: 38,
    tempo: 112,
    seed: 101,
    base: 220,
    chords: [
      [0, 4, 7, 11],
      [5, 9, 12, 16],
      [-3, 0, 4, 7],
      [7, 11, 14, 18],
    ],
    melody: [12, 16, 19, 23, 19, 16, 14, 11],
    palette: ["#ff6b57", "#20c997", "#f4d35e", "#16201c"],
  },
  {
    id: "midnight-relay",
    duration: 34,
    tempo: 124,
    seed: 211,
    base: 196,
    chords: [
      [0, 3, 7, 10],
      [7, 10, 14, 17],
      [5, 8, 12, 15],
      [-2, 2, 5, 9],
    ],
    melody: [12, 15, 19, 22, 24, 22, 19, 15],
    palette: ["#51d6ff", "#f4d35e", "#ff8fb3", "#111827"],
  },
  {
    id: "golden-hour-loop",
    duration: 42,
    tempo: 96,
    seed: 307,
    base: 174.61,
    chords: [
      [0, 4, 7, 12],
      [9, 12, 16, 19],
      [5, 9, 12, 16],
      [7, 11, 14, 18],
    ],
    melody: [12, 14, 16, 19, 21, 19, 16, 14],
    palette: ["#f4d35e", "#7bd88f", "#ff6b57", "#1b1a12"],
  },
  {
    id: "static-hearts",
    duration: 36,
    tempo: 118,
    seed: 419,
    base: 207.65,
    chords: [
      [0, 4, 7, 11],
      [2, 5, 9, 12],
      [-5, -1, 2, 7],
      [7, 11, 14, 19],
    ],
    melody: [12, 19, 16, 23, 21, 16, 14, 11],
    palette: ["#ff8fb3", "#65e4d3", "#f4d35e", "#17131a"],
  },
];

fs.mkdirSync(audioDir, { recursive: true });
fs.mkdirSync(coverDir, { recursive: true });

for (const track of tracks) {
  fs.writeFileSync(path.join(audioDir, `${track.id}.wav`), synthesizeWav(track));
  fs.writeFileSync(path.join(coverDir, `${track.id}.png`), createCoverPng(track));
}

console.log(`Generated ${tracks.length} WAV files in ${path.relative(root, audioDir)}`);
console.log(`Generated ${tracks.length} PNG covers in ${path.relative(root, coverDir)}`);

function synthesizeWav(track) {
  const sampleRate = 22050;
  const channels = 1;
  const bytesPerSample = 2;
  const totalSamples = Math.floor(track.duration * sampleRate);
  const dataSize = totalSamples * channels * bytesPerSample;
  const buffer = Buffer.alloc(44 + dataSize);
  let offset = 0;
  let noiseState = track.seed >>> 0;

  offset = writeString(buffer, offset, "RIFF");
  offset = writeUInt32(buffer, offset, 36 + dataSize);
  offset = writeString(buffer, offset, "WAVE");
  offset = writeString(buffer, offset, "fmt ");
  offset = writeUInt32(buffer, offset, 16);
  offset = writeUInt16(buffer, offset, 1);
  offset = writeUInt16(buffer, offset, channels);
  offset = writeUInt32(buffer, offset, sampleRate);
  offset = writeUInt32(buffer, offset, sampleRate * channels * bytesPerSample);
  offset = writeUInt16(buffer, offset, channels * bytesPerSample);
  offset = writeUInt16(buffer, offset, bytesPerSample * 8);
  offset = writeString(buffer, offset, "data");
  offset = writeUInt32(buffer, offset, dataSize);

  const beatLength = 60 / track.tempo;
  const barLength = beatLength * 4;

  for (let i = 0; i < totalSamples; i += 1) {
    const time = i / sampleRate;
    const beatPhase = (time % beatLength) / beatLength;
    const barIndex = Math.floor(time / barLength) % track.chords.length;
    const chord = track.chords[barIndex];
    const root = semitone(track.base, chord[0]);
    const melodyIndex = Math.floor(time / (beatLength / 2)) % track.melody.length;
    const melodyPhase = (time % (beatLength / 2)) / (beatLength / 2);
    const melodyFreq = semitone(track.base * 2, track.melody[melodyIndex]);
    const fade = Math.min(1, time / 1.2, (track.duration - time) / 1.4);
    const pulse = 0.52 + 0.48 * Math.exp(-beatPhase * 6);
    let sample = 0;

    for (const interval of chord) {
      const freq = semitone(track.base, interval);
      sample += 0.036 * Math.sin(Math.PI * 2 * freq * time) * pulse;
      sample += 0.012 * Math.sin(Math.PI * 4 * freq * time + 0.6);
    }

    sample += 0.11 * Math.sin(Math.PI * 2 * (root / 2) * time) * (0.7 + 0.3 * pulse);
    sample +=
      0.075 *
      Math.sin(Math.PI * 2 * melodyFreq * time + 0.25) *
      Math.exp(-melodyPhase * 3.8);

    if (beatPhase < 0.16) {
      sample +=
        0.18 *
        Math.sin(Math.PI * 2 * (72 - beatPhase * 42) * time) *
        Math.exp(-beatPhase * 34);
    }

    const snarePosition = (time + beatLength * 0.02) % barLength;
    if (Math.abs(snarePosition - beatLength * 2) < beatLength * 0.08) {
      sample += randomNoise() * 0.055 * Math.exp(-Math.abs(snarePosition - beatLength * 2) * 55);
    }

    const hatPhase = ((time + beatLength * 0.5) % beatLength) / beatLength;
    if (hatPhase < 0.08) {
      sample += randomNoise() * 0.032 * Math.exp(-hatPhase * 60);
    }

    const softened = Math.tanh(sample * 1.55) * fade * 0.82;
    buffer.writeInt16LE(Math.round(softened * 32767), offset);
    offset += 2;
  }

  return buffer;

  function randomNoise() {
    noiseState = (noiseState * 1664525 + 1013904223) >>> 0;
    return (noiseState / 0xffffffff) * 2 - 1;
  }
}

function createCoverPng(track) {
  const width = 640;
  const height = 640;
  const rgba = Buffer.alloc(width * height * 4);
  const colors = track.palette.map(hexToRgb);
  const [primary, secondary, highlight, background] = colors;
  const seedShift = (track.seed % 97) / 97;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const nx = (x / width) * 2 - 1;
      const ny = (y / height) * 2 - 1;
      const distance = Math.sqrt(nx * nx + ny * ny);
      const angle = Math.atan2(ny, nx);
      const grain = pseudoNoise(x, y, track.seed) * 0.08;
      const wave = Math.sin((ny + seedShift) * 11 + Math.sin(nx * 4) * 2) * 0.5 + 0.5;
      const rings = Math.sin(distance * 76 + seedShift * 12) * 0.5 + 0.5;
      let color = mix(background, primary, 0.2 + wave * 0.22 + grain);

      if (distance < 0.78) {
        color = mix(color, secondary, 0.18 + rings * 0.2);
      }

      if (distance > 0.2 && distance < 0.68) {
        color = mix(color, highlight, rings * 0.22);
      }

      const ray = Math.abs(Math.sin(angle * 5 + seedShift * 8));
      if (ray > 0.92 && distance < 0.9) {
        color = mix(color, primary, 0.3);
      }

      const center = Math.abs(distance - 0.18);
      if (center < 0.025) {
        color = mix(color, [248, 244, 234], 0.55);
      }

      if ((x + y + track.seed) % 37 === 0) {
        color = mix(color, [255, 255, 255], 0.14);
      }

      const vignette = Math.min(0.58, distance * 0.42);
      color = mix(color, [7, 10, 9], vignette);
      setPixel(rgba, width, x, y, color);
    }
  }

  return encodePng(width, height, rgba);
}

function semitone(base, steps) {
  return base * 2 ** (steps / 12);
}

function writeString(buffer, offset, value) {
  buffer.write(value, offset, value.length, "ascii");
  return offset + value.length;
}

function writeUInt16(buffer, offset, value) {
  buffer.writeUInt16LE(value, offset);
  return offset + 2;
}

function writeUInt32(buffer, offset, value) {
  buffer.writeUInt32LE(value, offset);
  return offset + 4;
}

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  return [
    Number.parseInt(clean.slice(0, 2), 16),
    Number.parseInt(clean.slice(2, 4), 16),
    Number.parseInt(clean.slice(4, 6), 16),
  ];
}

function mix(a, b, amount) {
  const t = Math.max(0, Math.min(1, amount));
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

function setPixel(buffer, width, x, y, color) {
  const offset = (y * width + x) * 4;
  buffer[offset] = color[0];
  buffer[offset + 1] = color[1];
  buffer[offset + 2] = color[2];
  buffer[offset + 3] = 255;
}

function pseudoNoise(x, y, seed) {
  const value = Math.sin(x * 12.9898 + y * 78.233 + seed * 37.719) * 43758.5453;
  return value - Math.floor(value);
}

function encodePng(width, height, rgba) {
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);

  for (let y = 0; y < height; y += 1) {
    raw[y * (stride + 1)] = 0;
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride);
  }

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return Buffer.concat([
    signature,
    createChunk("IHDR", ihdr),
    createChunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
    createChunk("IEND", Buffer.alloc(0)),
  ]);
}

function createChunk(type, data) {
  const typeBuffer = Buffer.from(type, "ascii");
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0);
  return Buffer.concat([length, typeBuffer, data, crc]);
}

function crc32(buffer) {
  let crc = 0xffffffff;
  for (let i = 0; i < buffer.length; i += 1) {
    crc ^= buffer[i];
    for (let j = 0; j < 8; j += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}
