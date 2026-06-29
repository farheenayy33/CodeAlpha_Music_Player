import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Pause,
  Play,
  Repeat2,
  SkipBack,
  SkipForward,
  Volume1,
  Volume2,
  VolumeX,
} from "lucide-react";
import { AlbumArt } from "./AlbumArt";
import { IconButton } from "./IconButton";
import { Playlist } from "./Playlist";
import { ProgressBar } from "./ProgressBar";
import {
  nextTrack,
  pause,
  play,
  previousTrack,
  selectTrack,
  setVolume,
  toggleAutoplay,
} from "../store/playerSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";

export function MusicPlayer() {
  const dispatch = useAppDispatch();
  const audioRef = useRef<HTMLAudioElement>(null);
  const { tracks, currentIndex, isPlaying, volume, autoplay } = useAppSelector(
    (state) => state.player,
  );
  const currentTrack = tracks[currentIndex];
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(currentTrack.duration);
  const [lastAudibleVolume, setLastAudibleVolume] = useState(volume);

  const progressAccent = useMemo(
    () => currentTrack.accent,
    [currentTrack.accent],
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio.load();
    audio.currentTime = 0;
    setCurrentTime(0);
    setDuration(currentTrack.duration);
  }, [currentTrack.id, currentTrack.duration]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (isPlaying) {
      void audio.play().catch(() => {
        dispatch(pause());
      });
      return;
    }

    audio.pause();
  }, [currentTrack.id, dispatch, isPlaying]);

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    setDuration(Number.isFinite(audio.duration) ? audio.duration : currentTrack.duration);
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio) {
      setCurrentTime(audio.currentTime);
    }
  };

  const handleEnded = () => {
    if (autoplay) {
      dispatch(nextTrack());
      dispatch(play());
      return;
    }

    dispatch(pause());
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      dispatch(pause());
      return;
    }

    dispatch(play());
  };

  const handlePrevious = () => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 4) {
      audio.currentTime = 0;
      setCurrentTime(0);
      return;
    }

    dispatch(previousTrack());
  };

  const handleNext = () => {
    dispatch(nextTrack());
  };

  const handleSelectTrack = (index: number) => {
    dispatch(selectTrack(index));
    dispatch(play());
  };

  const handleSeek = (time: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = time;
    }
    setCurrentTime(time);
  };

  const handleVolumeChange = (value: number) => {
    if (value > 0) {
      setLastAudibleVolume(value);
    }
    dispatch(setVolume(value));
  };

  const handleMuteToggle = () => {
    if (volume > 0) {
      setLastAudibleVolume(volume);
      dispatch(setVolume(0));
      return;
    }

    dispatch(setVolume(lastAudibleVolume || 0.72));
  };

  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <main className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-7xl gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">
        <Playlist
          tracks={tracks}
          currentIndex={currentIndex}
          isPlaying={isPlaying}
          onSelect={handleSelectTrack}
        />

        <section className="grid gap-5 xl:grid-cols-[minmax(320px,0.92fr)_minmax(360px,1fr)]">
          <AlbumArt track={currentTrack} isPlaying={isPlaying} />

          <div className="rounded-[8px] border border-white/10 bg-[#171b19]/88 p-5 shadow-panel backdrop-blur sm:p-6">
            <audio
              ref={audioRef}
              src={currentTrack.src}
              preload="metadata"
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleEnded}
            />

            <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-citron">
                  CodeAlpha Task 4
                </p>
                <h2 className="mt-2 truncate text-3xl font-black text-white sm:text-4xl">
                  Music Player
                </h2>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={autoplay}
                onClick={() => dispatch(toggleAutoplay())}
                className={[
                  "inline-flex min-h-11 items-center gap-2 rounded-[8px] border px-3 py-2 text-sm font-black transition",
                  autoplay
                    ? "border-citron/70 bg-citron text-ink"
                    : "border-white/10 bg-white/7 text-stone-100 hover:bg-white/12",
                ].join(" ")}
              >
                <Repeat2 className="h-4 w-4" aria-hidden="true" />
                Autoplay
              </button>
            </div>

            <div className="mb-8 border-l-4 pl-4" style={{ borderColor: currentTrack.accent }}>
              <p className="text-sm font-semibold text-stone-300">Now playing</p>
              <h3 className="mt-2 text-3xl font-black leading-tight text-white">
                {currentTrack.title}
              </h3>
              <p className="mt-2 text-lg font-semibold text-stone-300">
                {currentTrack.artist}
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-black uppercase tracking-[0.16em] text-stone-950">
                <span
                  className="rounded-[8px] px-2.5 py-1"
                  style={{ backgroundColor: currentTrack.accent }}
                >
                  {currentTrack.bpm} BPM
                </span>
                <span
                  className="rounded-[8px] px-2.5 py-1"
                  style={{ backgroundColor: currentTrack.secondary }}
                >
                  {currentTrack.album}
                </span>
              </div>
            </div>

            <ProgressBar
              currentTime={currentTime}
              duration={duration}
              accent={progressAccent}
              onSeek={handleSeek}
            />

            <div className="mt-8 flex items-center justify-center gap-3">
              <IconButton label="Previous track" onClick={handlePrevious}>
                <SkipBack className="h-5 w-5" aria-hidden="true" />
              </IconButton>
              <IconButton
                label={isPlaying ? "Pause" : "Play"}
                active={isPlaying}
                onClick={handlePlayPause}
                className="h-14 w-14"
              >
                {isPlaying ? (
                  <Pause className="h-7 w-7" aria-hidden="true" />
                ) : (
                  <Play className="h-7 w-7 translate-x-0.5" aria-hidden="true" />
                )}
              </IconButton>
              <IconButton label="Next track" onClick={handleNext}>
                <SkipForward className="h-5 w-5" aria-hidden="true" />
              </IconButton>
            </div>

            <div className="mt-8 rounded-[8px] border border-white/10 bg-black/18 p-4">
              <div className="grid gap-3 sm:grid-cols-[auto_minmax(0,1fr)_56px] sm:items-center">
                <IconButton label={volume === 0 ? "Unmute" : "Mute"} onClick={handleMuteToggle}>
                  <VolumeIcon className="h-5 w-5" aria-hidden="true" />
                </IconButton>
                <input
                  className="range-slider"
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  aria-label="Volume"
                  onChange={(event) => handleVolumeChange(Number(event.target.value))}
                  style={
                    {
                      "--progress": `${volume * 100}%`,
                      "--accent": currentTrack.secondary,
                    } as CSSProperties
                  }
                />
                <span className="text-right text-sm font-black text-stone-200">
                  {Math.round(volume * 100)}%
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
