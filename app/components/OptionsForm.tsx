"use client";

import type maplibregl from "maplibre-gl";
import { CitySearch } from "./CitySearch";
import { ThemeSelector } from "./ThemeSelector";
import { RadiusSlider } from "./RadiusSlider";
import { ExportButton } from "./ExportButton";
import { FormatSelector, type ExportFormat } from "./FormatSelector";
import { AspectRatioSelector, type AspectRatio } from "./AspectRatioSelector";
import { ShareButton } from "./ShareButton";

interface OptionsFormProps {
  city: string;
  country: string;
  lat: number;
  lng: number;
  theme: string;
  radius: number;
  showLabels: boolean;
  format: ExportFormat;
  aspectRatio: AspectRatio;
  mapRef: React.RefObject<maplibregl.Map | null>;
  onLocationChange: (city: string, country: string, lat: number, lng: number) => void;
  onThemeChange: (theme: string) => void;
  onRadiusChange: (radius: number) => void;
  onShowLabelsChange: (show: boolean) => void;
  onFormatChange: (format: ExportFormat) => void;
  onAspectRatioChange: (ratio: AspectRatio) => void;
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-3">
        {label}
      </div>
      {children}
    </div>
  );
}

export function OptionsForm({
  city,
  country,
  lat,
  lng,
  theme,
  radius,
  showLabels,
  format,
  aspectRatio,
  mapRef,
  onLocationChange,
  onThemeChange,
  onRadiusChange,
  onShowLabelsChange,
  onFormatChange,
  onAspectRatioChange,
}: OptionsFormProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Header */}
        <div className="pb-2">
          <h1 className="text-lg font-semibold text-white">Map to Poster</h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Create beautiful map posters
          </p>
        </div>

        <Section label="Location">
          <CitySearch value={city} onSelect={onLocationChange} />
        </Section>

        <Section label="Theme">
          <ThemeSelector value={theme} onChange={onThemeChange} />
        </Section>

        <Section label="Settings">
          <div className="space-y-4">
            <RadiusSlider value={radius} onChange={onRadiusChange} />

            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">Show labels</span>
              <button
                onClick={() => onShowLabelsChange(!showLabels)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  showLabels ? "bg-white" : "bg-zinc-700"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full transition-transform ${
                    showLabels ? "translate-x-5 bg-zinc-900" : "translate-x-0 bg-zinc-400"
                  }`}
                />
              </button>
            </div>
          </div>
        </Section>

        <Section label="Export">
          <div className="space-y-4">
            <div>
              <div className="text-xs text-zinc-500 mb-2">Aspect Ratio</div>
              <AspectRatioSelector value={aspectRatio} onChange={onAspectRatioChange} />
            </div>
            <div>
              <div className="text-xs text-zinc-500 mb-2">File Format</div>
              <FormatSelector value={format} onChange={onFormatChange} />
            </div>
          </div>
        </Section>
      </div>

      {/* Actions */}
      <div className="p-5 border-t border-zinc-800 space-y-2">
        <ExportButton
          city={city}
          country={country}
          lat={lat}
          lng={lng}
          theme={theme}
          showLabels={showLabels}
          format={format}
          aspectRatio={aspectRatio}
          mapRef={mapRef}
        />
        <ShareButton city={city} />
      </div>
    </div>
  );
}
