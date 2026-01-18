"use client";

interface RadiusSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function RadiusSlider({
  value,
  onChange,
  min = 4000,
  max = 20000,
}: RadiusSliderProps) {
  const formatDistance = (meters: number) => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(meters % 1000 === 0 ? 0 : 1)} km`;
    }
    return `${meters} m`;
  };

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-zinc-400">Radius</span>
        <span className="text-sm font-mono text-zinc-300">
          {formatDistance(value)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={500}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="w-full h-1 bg-zinc-700 rounded-full appearance-none cursor-pointer slider"
        style={{
          background: `linear-gradient(to right, #fff 0%, #fff ${percentage}%, #3f3f46 ${percentage}%, #3f3f46 100%)`,
        }}
      />
      <div className="flex justify-between text-[10px] text-zinc-600 mt-1">
        <span>{formatDistance(min)}</span>
        <span>{formatDistance(max)}</span>
      </div>
    </div>
  );
}
