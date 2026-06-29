import type { Track } from "../data/tracks";

type AlbumArtProps = {
  track: Track;
  isPlaying: boolean;
};

export function AlbumArt({ track, isPlaying }: AlbumArtProps) {
  return (
    <section
      className={[
        "relative min-h-[320px] overflow-hidden rounded-[8px] border bg-stone-950 shadow-panel",
        isPlaying ? "is-playing" : "",
      ].join(" ")}
      style={{ borderColor: `${track.accent}55` }}
    >
      <img
        src={track.cover}
        alt={`${track.album} cover`}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/18 to-black/8" />
      <div className="absolute left-5 right-5 top-5 flex items-center justify-between gap-3">
        <div className="rounded-[8px] border border-white/15 bg-black/35 px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-stone-100 backdrop-blur">
          {isPlaying ? "Playing" : "Ready"}
        </div>
        <div className="flex h-10 items-end gap-1 rounded-[8px] border border-white/15 bg-black/35 px-3 py-2 backdrop-blur">
          {track.waveform.slice(0, 9).map((height, index) => (
            <span
              key={`${track.id}-${index}`}
              className="wave-bar block w-1.5 rounded-full"
              style={{
                height: `${Math.max(18, height * 0.32)}px`,
                backgroundColor: index % 2 ? track.secondary : track.accent,
                animationDelay: `${index * 80}ms`,
              }}
            />
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
        <p className="mb-2 text-sm font-medium text-stone-200/85">{track.album}</p>
        <h1 className="max-w-[14ch] text-4xl font-black leading-none text-white sm:text-5xl">
          {track.title}
        </h1>
        <p className="mt-3 text-base font-semibold text-stone-100/90">
          {track.artist}
        </p>
      </div>
    </section>
  );
}
