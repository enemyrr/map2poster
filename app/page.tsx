"use client";

import { useState, useRef, Suspense } from "react";
import type maplibregl from "maplibre-gl";
import { MapPreview } from "./components/MapPreview";
import { OptionsForm } from "./components/OptionsForm";
import { useMapState } from "./lib/hooks";

function MapPosterContent() {
  const {
    city,
    country,
    lat,
    lng,
    theme,
    radius,
    showLabels,
    format,
    aspectRatio,
    setTheme,
    setRadius,
    setShowLabels,
    setFormat,
    setAspectRatio,
    setLocation,
  } = useMapState();

  const [isFormOpen, setIsFormOpen] = useState(true);
  const mapRef = useRef<maplibregl.Map | null>(null);

  return (
    <div className="h-screen w-screen overflow-hidden bg-zinc-950 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div
        className={`
          order-2 md:order-1
          w-full md:w-[360px] md:min-w-[360px]
          bg-zinc-900 border-t md:border-t-0 md:border-r border-zinc-800
          overflow-hidden
          transition-all duration-300
          ${isFormOpen ? "h-[50vh] md:h-auto" : "h-12 md:h-auto"}
        `}
      >
        {/* Mobile toggle */}
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="md:hidden w-full flex items-center justify-between px-5 py-3 border-b border-zinc-800"
        >
          <span className="text-sm font-medium text-white">
            {isFormOpen ? "Hide Options" : "Show Options"}
          </span>
          <svg
            className={`w-4 h-4 text-zinc-400 transition-transform ${isFormOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>

        <div
          className={`
            h-[calc(100%-48px)] md:h-full
            transition-all duration-300
            ${isFormOpen ? "opacity-100" : "opacity-0 md:opacity-100 h-0 md:h-full overflow-hidden md:overflow-visible"}
          `}
        >
          <OptionsForm
            city={city}
            country={country}
            lat={lat}
            lng={lng}
            theme={theme}
            radius={radius}
            showLabels={showLabels}
            format={format}
            aspectRatio={aspectRatio}
            mapRef={mapRef}
            onLocationChange={setLocation}
            onThemeChange={setTheme}
            onRadiusChange={setRadius}
            onShowLabelsChange={setShowLabels}
            onFormatChange={setFormat}
            onAspectRatioChange={setAspectRatio}
          />
        </div>
      </div>

      {/* Map */}
      <div className="order-1 md:order-2 flex-1 min-h-[50vh] md:min-h-0 relative">
        <MapPreview
          lat={lat}
          lng={lng}
          theme={theme}
          radius={radius}
          city={city}
          country={country}
          showLabels={showLabels}
          mapRef={mapRef}
        />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen flex items-center justify-center bg-zinc-950">
          <div className="w-6 h-6 border-2 border-zinc-700 border-t-zinc-400 rounded-full animate-spin" />
        </div>
      }
    >
      <MapPosterContent />
    </Suspense>
  );
}
