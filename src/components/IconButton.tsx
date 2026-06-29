import type { ButtonHTMLAttributes, ReactNode } from "react";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  active?: boolean;
  children: ReactNode;
};

export function IconButton({
  label,
  active = false,
  children,
  className = "",
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={[
        "inline-flex h-11 w-11 items-center justify-center rounded-[8px] border transition",
        active
          ? "border-citron/70 bg-citron text-ink shadow-lg shadow-citron/20"
          : "border-white/10 bg-white/7 text-stone-100 hover:border-white/25 hover:bg-white/12",
        "disabled:cursor-not-allowed disabled:opacity-45",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
