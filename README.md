# CodeAlpha Music Player

A responsive and interactive music player interface built using React, TypeScript, Redux Toolkit, Tailwind CSS, and JavaScript audio controls.

## Live Demo

Add your deployed GitHub Pages link here after deployment:

```text
https://your-username.github.io/your-repository-name/
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
git clone https://github.com/your-username/your-repository-name.git
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

## Deploy to GitHub Pages

### 1. Push the project to GitHub

```bash
git init
git add .
git commit -m "Initial music player project"
git branch -M main
git remote add origin https://github.com/your-username/your-repository-name.git
git push -u origin main
```

### 2. Configure Vite for GitHub Pages

If you deploy to a repository page, update `vite.config.ts` and set `base` to your repository name:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/your-repository-name/",
  plugins: [react()],
});
```

For a user or organization site such as `your-username.github.io`, use:

```ts
export default defineConfig({
  base: "/",
  plugins: [react()],
});
```

### 3. Add GitHub Pages workflow

Create this file:

```text
.github/workflows/deploy.yml
```

Add the following workflow:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

If this app is inside the `CodeAlpha_Music_player` subfolder of your repository, adjust the workflow commands:

```yaml
- name: Install dependencies
  run: npm ci
  working-directory: CodeAlpha_Music_player

- name: Build
  run: npm run build
  working-directory: CodeAlpha_Music_player

- name: Upload artifact
  uses: actions/upload-pages-artifact@v3
  with:
    path: ./CodeAlpha_Music_player/dist
```

### 4. Enable GitHub Pages

1. Open your GitHub repository.
2. Go to `Settings`.
3. Open `Pages`.
4. Under `Build and deployment`, choose `GitHub Actions`.
5. Push your code to the `main` branch.
6. Wait for the deploy workflow to finish.

Your app will be available at:

```text
https://your-username.github.io/your-repository-name/
```

## Notes

- Do not commit `node_modules`.
- Commit `package.json` and `package-lock.json` so GitHub Actions can install exact dependencies.
- Commit the `public/audio` and `public/covers` folders if you want the demo tracks and covers to work immediately after deployment.
- If audio does not autoplay immediately, that is normal browser behavior. Users usually need to press play once before autoplay can continue.

## Author

Created as part of the CodeAlpha Frontend Development tasks.
