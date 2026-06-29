import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { playlist } from "../data/tracks";

type PlayerState = {
  tracks: typeof playlist;
  currentIndex: number;
  isPlaying: boolean;
  volume: number;
  autoplay: boolean;
};

const initialState: PlayerState = {
  tracks: playlist,
  currentIndex: 0,
  isPlaying: false,
  volume: 0.72,
  autoplay: true,
};

const clampVolume = (value: number) => Math.min(1, Math.max(0, value));

export const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    play(state) {
      state.isPlaying = true;
    },
    pause(state) {
      state.isPlaying = false;
    },
    togglePlayback(state) {
      state.isPlaying = !state.isPlaying;
    },
    selectTrack(state, action: PayloadAction<number>) {
      const nextIndex = action.payload;
      if (nextIndex >= 0 && nextIndex < state.tracks.length) {
        state.currentIndex = nextIndex;
      }
    },
    nextTrack(state) {
      state.currentIndex = (state.currentIndex + 1) % state.tracks.length;
    },
    previousTrack(state) {
      state.currentIndex =
        (state.currentIndex - 1 + state.tracks.length) % state.tracks.length;
    },
    setVolume(state, action: PayloadAction<number>) {
      state.volume = clampVolume(action.payload);
    },
    toggleAutoplay(state) {
      state.autoplay = !state.autoplay;
    },
  },
});

export const {
  play,
  pause,
  togglePlayback,
  selectTrack,
  nextTrack,
  previousTrack,
  setVolume,
  toggleAutoplay,
} = playerSlice.actions;

export default playerSlice.reducer;
