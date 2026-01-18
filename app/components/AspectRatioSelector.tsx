"use client";

export type AspectRatio = "1:1" | "4:3" | "3:4" | "16:9" | "9:16";

interface AspectRatioSelectorProps {
  value: AspectRatio;
  onChange: (ratio: AspectRatio) => void;
}

const ratios: { value: AspectRatio; label: string; width: number; height: number }[] = [
  { value: "1:1", label: "1:1", width: 1, height: 1 },
  { value: "4:3", label: "4:3", width: 4, height: 3 },
  { value: "3:4", label: "3:4", width: 3, height: 4 },
  { value: "16:9", label: "16:9", width: 16, height: 9 },
  { value: "9:16", label: "9:16", width: 9, height: 16 },
];

export function AspectRatioSelector({ value, onChange }: AspectRatioSelectorProps) {
  return (
    <div className="flex gap-2">
      {ratios.map((ratio) => {
        const isSelected = value === ratio.value;
        const scale = 20;
        const w = (ratio.width / Math.max(ratio.width, ratio.height)) * scale;
        const h = (ratio.height / Math.max(ratio.width, ratio.height)) * scale;

        return (
          <button
            key={ratio.value}
            onClick={() => onChange(ratio.value)}
            className={`flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors ${
              isSelected
                ? "bg-zinc-800 text-white"
                : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
            }`}
          >
            <div
              className={`border-2 rounded-sm ${
                isSelected ? "border-zinc-400" : "border-zinc-600"
              }`}
              style={{ width: w, height: h }}
            />
            <span className="text-[10px] font-medium">{ratio.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function getAspectRatioDimensions(ratio: AspectRatio, baseSize: number = 1200): { width: number; height: number } {
  switch (ratio) {
    case "1:1":
      return { width: baseSize, height: baseSize };
    case "4:3":
      return { width: baseSize, height: baseSize * (3 / 4) };
    case "3:4":
      return { width: baseSize * (3 / 4), height: baseSize };
    case "16:9":
      return { width: baseSize, height: baseSize * (9 / 16) };
    case "9:16":
      return { width: baseSize * (9 / 16), height: baseSize };
  }
}
