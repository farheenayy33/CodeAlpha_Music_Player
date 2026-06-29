# CodeAlpha Music Player

A responsive and interactive music player interface built using React, TypeScript, Redux Toolkit, Tailwind CSS, and JavaScript audio controls.

## Live Demo

Add your deployed GitHub Pages link here after deployment:

```text
https://github.com/farheenayy33/CodeAlpha_Music_Player.git
```

## Tech Stack

- React
- TypeScript
- Redux Toolkit
- React Redux
- Tailwind CSS
- Vite
- Lucide React icons

## Project Structure

```text
CodeAlpha_Music_player/
├── public/
│   ├── audio/              # Local generated WAV demo tracks
│   └── covers/             # Local generated PNG cover art
├── scripts/
│   ├── generate-assets.cjs # Generates demo audio and cover assets
│   └── start-dev.cjs       # Helper for starting the local dev server
├── src/
│   ├── components/         # Player UI components
│   ├── data/               # Playlist track data
│   ├── lib/                # Utility functions
│   ├── store/              # Redux store and player slice
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/farheenayy33/CodeAlpha_Music_Player.git
cd your-repository-name
```

### 2. Install dependencies

```bash
npm install
```

Windows PowerShell note: if `npm` is blocked by script execution policy, use:

```bash
npm.cmd install
```

### 3. Generate local demo assets

The project already includes generated audio and cover files. Run this command only if you want to recreate them:

```bash
npm run generate:assets
```

### 4. Start the development server

```bash
npm run dev
```

Open the local URL shown in the terminal, usually:

```text
http://127.0.0.1:5173/
```

## Available Scripts

```bash
npm run dev
```

Starts the Vite development server.

```bash
npm run build
```

Runs TypeScript checks and creates the production build in the `dist` folder.

```bash
npm run preview
```

Serves the production build locally for testing.

```bash
npm run typecheck
```

Runs TypeScript type checking.

```bash
npm run generate:assets
```

Regenerates the local WAV audio files and PNG cover images.

## Build for Production

```bash
npm run build
```

After a successful build, the production files will be available in:

```text
dist/
```

## Deploy to GitHub 

### 1. Push the project to GitHub

```bash
git init
git add .
git commit -m "Initial music player project"
git branch -M main
git remote add origin https://github.com/user_name/CodeAlpha_Music_Player.git
git push -u origin main
```


## Author

<p align="center">
  Created with ❤️ by <strong>Farheen Laraib</strong>
</p>
