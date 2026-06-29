export type Track = {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  bpm: number;
  src: string;
  cover: string;
  accent: string;
  secondary: string;
  waveform: number[];
};

export const playlist: Track[] = [
  {
    id: "electric-bloom",
    title: "Electric Bloom",
    artist: "Mira Vale",
    album: "Signal Garden",
    duration: 38,
    bpm: 112,
    src: "/audio/electric-bloom.wav",
    cover: "/covers/electric-bloom.png",
    accent: "#ff6b57",
    secondary: "#20c997",
    waveform: [34, 58, 45, 70, 52, 84, 61, 76, 47, 68, 88, 55, 72, 41, 63, 91, 57, 79, 66, 48, 75, 59, 86, 44],
  },
  {
    id: "midnight-relay",
    title: "Midnight Relay",
    artist: "Theo Park",
    album: "Afterimage Radio",
    duration: 34,
    bpm: 124,
    src: "/audio/midnight-relay.wav",
    cover: "/covers/midnight-relay.png",
    accent: "#51d6ff",
    secondary: "#f4d35e",
    waveform: [50, 74, 62, 86, 43, 91, 68, 57, 80, 49, 96, 71, 58, 83, 45, 77, 64, 89, 52, 72, 94, 60, 69, 54],
  },
  {
    id: "golden-hour-loop",
    title: "Golden Hour Loop",
    artist: "Reina Moss",
    album: "Low Sun Study",
    duration: 42,
    bpm: 96,
    src: "/audio/golden-hour-loop.wav",
    cover: "/covers/golden-hour-loop.png",
    accent: "#f4d35e",
    secondary: "#7bd88f",
    waveform: [28, 42, 60, 48, 67, 54, 75, 44, 59, 36, 72, 53, 64, 47, 70, 39, 58, 78, 51, 63, 46, 69, 55, 40],
  },
  {
    id: "static-hearts",
    title: "Static Hearts",
    artist: "Nia Frost",
    album: "Pulse Notes",
    duration: 36,
    bpm: 118,
    src: "/audio/static-hearts.wav",
    cover: "/covers/static-hearts.png",
    accent: "#ff8fb3",
    secondary: "#65e4d3",
    waveform: [46, 68, 39, 81, 55, 73, 91, 58, 70, 44, 83, 62, 78, 49, 94, 57, 66, 88, 52, 76, 43, 85, 61, 71],
  },
];
