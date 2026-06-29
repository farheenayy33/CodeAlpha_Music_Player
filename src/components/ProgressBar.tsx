import type { CSSProperties } from "react";
import { formatTime } from "../lib/format";

type ProgressBarProps = {
  currentTime: number;
  duration: number;
  accent: string;
  onSeek: (time: number) => void;
};

export function ProgressBar({
  currentTime,
  duration,
  accent,
  onSeek,
}: ProgressBarProps) {
  const safeDuration = Math.max(duration || 0, 0.01);
  const progress = Math.min(100, Math.max(0, (currentTime / safeDuration) * 100));

  return (
    <div className="space-y-3">
      <input
        className="range-slider"
        type="range"
        min={0}
        max={safeDuration}
        step={0.01}
        value={Math.min(currentTime, safeDuration)}
        aria-label="Track progress"
        onChange={(event) => onSeek(Number(event.target.value))}
        style={
          {
            "--progress": `${progress}%`,
            "--accent": accent,
          } as CSSProperties
        }
      />
      <div className="flex items-center justify-between text-sm font-semibold text-stone-300">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}
