import { ListMusic } from "lucide-react";
import type { Track } from "../data/tracks";
import { formatTime } from "../lib/format";

type PlaylistProps = {
  tracks: Track[];
  currentIndex: number;
  isPlaying: boolean;
  onSelect: (index: number) => void;
};

export function Playlist({
  tracks,
  currentIndex,
  isPlaying,
  onSelect,
}: PlaylistProps) {
  return (
    <aside className="rounded-[8px] border border-white/10 bg-white/[0.055] p-4 shadow-panel backdrop-blur">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ListMusic className="h-5 w-5 text-citron" aria-hidden="true" />
          <h2 className="text-lg font-black text-white">Playlist</h2>
        </div>
        <span className="rounded-[8px] border border-white/10 px-2.5 py-1 text-xs font-bold text-stone-300">
          {tracks.length} songs
        </span>
      </div>

      <div className="grid gap-3">
        {tracks.map((track, index) => {
          const isActive = index === currentIndex;

          return (
            <button
              type="button"
              key={track.id}
              aria-current={isActive ? "true" : undefined}
              onClick={() => onSelect(index)}
              className={[
                "grid min-h-[76px] grid-cols-[56px_minmax(0,1fr)_auto] items-center gap-3 rounded-[8px] border p-2 text-left transition",
                isActive
                  ? "border-white/25 bg-white/14"
                  : "border-white/8 bg-black/15 hover:border-white/18 hover:bg-white/8",
              ].join(" ")}
            >
              <img
                src={track.cover}
                alt=""
                className="h-14 w-14 rounded-[6px] object-cover"
              />
              <span className="min-w-0">
                <span className="block truncate text-sm font-black text-white">
                  {track.title}
                </span>
                <span className="mt-1 block truncate text-xs font-semibold text-stone-300">
                  {track.artist}
                </span>
                <span
                  className={[
                    "mt-2 flex h-3 items-end gap-0.5",
                    isActive && isPlaying ? "is-playing" : "",
                  ].join(" ")}
                  aria-hidden="true"
                >
                  {track.waveform.slice(0, 14).map((height, waveIndex) => (
                    <span
                      key={`${track.id}-wave-${waveIndex}`}
                      className="wave-bar w-1 rounded-full bg-stone-300/60"
                      style={{
                        height: `${Math.max(4, height * 0.11)}px`,
                        animationDelay: `${waveIndex * 60}ms`,
                      }}
                    />
                  ))}
                </span>
              </span>
              <span
                className="rounded-[8px] px-2 py-1 text-xs font-bold"
                style={{
                  color: isActive ? track.accent : "#d8d0bf",
                  backgroundColor: isActive ? `${track.accent}18` : "transparent",
                }}
              >
                {formatTime(track.duration)}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
