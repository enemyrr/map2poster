"use client";

export type ExportFormat = "png" | "jpeg" | "webp";

interface FormatSelectorProps {
  value: ExportFormat;
  onChange: (format: ExportFormat) => void;
}

const formats: { value: ExportFormat; label: string }[] = [
  { value: "png", label: "PNG" },
  { value: "jpeg", label: "JPEG" },
  { value: "webp", label: "WebP" },
];

export function FormatSelector({ value, onChange }: FormatSelectorProps) {
  return (
    <div className="flex gap-1 p-1 bg-zinc-800 rounded-lg">
      {formats.map((format) => (
        <button
          key={format.value}
          onClick={() => onChange(format.value)}
          className={`flex-1 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
            value === format.value
              ? "bg-zinc-700 text-white"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          {format.label}
        </button>
      ))}
    </div>
  );
}
