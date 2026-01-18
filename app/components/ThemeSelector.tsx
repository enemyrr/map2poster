"use client";

import { themes, Theme, getPrimaryRoadColor } from "@/app/lib/themes";

interface ThemeSelectorProps {
  value: string;
  onChange: (themeId: string) => void;
}

function ThemePreview({ theme, isSelected }: { theme: Theme; isSelected: boolean }) {
  const roadColor = getPrimaryRoadColor(theme);

  return (
    <div
      className={`relative w-full aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
        isSelected ? "border-white" : "border-zinc-700 hover:border-zinc-500"
      }`}
      style={{ backgroundColor: theme.background }}
    >
      <svg
        viewBox="0 0 40 40"
        className="absolute inset-0 w-full h-full opacity-80"
      >
        <line x1="0" y1="12" x2="40" y2="12" stroke={roadColor} strokeWidth="1.5" />
        <line x1="0" y1="28" x2="40" y2="28" stroke={roadColor} strokeWidth="1" />
        <line x1="10" y1="0" x2="10" y2="40" stroke={roadColor} strokeWidth="1" />
        <line x1="30" y1="0" x2="30" y2="40" stroke={roadColor} strokeWidth="2" />
        <line x1="0" y1="40" x2="40" y2="0" stroke={roadColor} strokeWidth="0.75" />
        <rect x="15" y="18" width="12" height="8" fill={theme.water} rx="1" />
      </svg>
    </div>
  );
}

export function ThemeSelector({ value, onChange }: ThemeSelectorProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {themes.map((theme) => (
        <button
          key={theme.id}
          onClick={() => onChange(theme.id)}
          className="flex flex-col items-center gap-1"
        >
          <ThemePreview theme={theme} isSelected={value === theme.id} />
          <span
            className={`text-[10px] transition-colors ${
              value === theme.id ? "text-white" : "text-zinc-500"
            }`}
          >
            {theme.name}
          </span>
        </button>
      ))}
    </div>
  );
}
