"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import { generateMapStyle, radiusToZoom } from "@/app/lib/mapStyle";
import { getThemeById, getPrimaryRoadColor } from "@/app/lib/themes";

interface MapPreviewProps {
  lat: number;
  lng: number;
  theme: string;
  radius: number;
  city: string;
  country: string;
  showLabels: boolean;
  mapRef?: React.MutableRefObject<maplibregl.Map | null>;
}

export function MapPreview({
  lat,
  lng,
  theme,
  radius,
  city,
  country,
  showLabels,
  mapRef,
}: MapPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const internalMapRef = useRef<maplibregl.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const currentTheme = getThemeById(theme);
  const labelColor = currentTheme.labels || getPrimaryRoadColor(currentTheme);
  const zoom = radiusToZoom(radius);

  // Format coordinates
  const formatCoord = (coord: number, isLat: boolean) => {
    const direction = isLat ? (coord >= 0 ? "N" : "S") : coord >= 0 ? "E" : "W";
    return `${Math.abs(coord).toFixed(4)}° ${direction}`;
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: generateMapStyle(currentTheme),
      center: [lng, lat],
      zoom: zoom,
      attributionControl: false,
      interactive: true,
      preserveDrawingBuffer: true, // Required for canvas export
    });

    map.on("load", () => {
      setIsLoaded(true);
    });

    map.on("error", (e) => {
      console.error("Map error:", e);
    });

    // Resize map when container dimensions are available
    const resizeObserver = new ResizeObserver(() => {
      map.resize();
    });
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    internalMapRef.current = map;
    if (mapRef) {
      mapRef.current = map;
    }

    return () => {
      resizeObserver.disconnect();
      map.remove();
      internalMapRef.current = null;
      if (mapRef) {
        mapRef.current = null;
      }
    };
    // Only initialize once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update style when theme changes
  useEffect(() => {
    if (internalMapRef.current && isLoaded) {
      internalMapRef.current.setStyle(generateMapStyle(currentTheme));
    }
  }, [theme, currentTheme, isLoaded]);

  // Update center and zoom when location/radius changes
  useEffect(() => {
    if (internalMapRef.current && isLoaded) {
      internalMapRef.current.flyTo({
        center: [lng, lat],
        zoom: zoom,
        duration: 1000,
      });
    }
  }, [lat, lng, zoom, isLoaded]);

  return (
    <div
      id="poster-container"
      className="relative w-full h-full overflow-hidden"
      style={{ backgroundColor: currentTheme.background, minHeight: "400px" }}
    >
      {/* Map container */}
      <div
        ref={containerRef}
        className="absolute inset-0"
        style={{ width: "100%", height: "100%" }}
      />

      {/* Gradient fade at top */}
      <div
        className="absolute top-0 left-0 right-0 h-24 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, ${currentTheme.background} 0%, transparent 100%)`,
        }}
      />

      {/* Gradient fade at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: `linear-gradient(to top, ${currentTheme.background} 0%, transparent 100%)`,
        }}
      />

      {/* Labels overlay */}
      {showLabels && (
        <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
          <h1
            className="text-3xl md:text-4xl font-bold tracking-[0.3em] uppercase mb-1"
            style={{ color: labelColor }}
          >
            {city}
          </h1>
          <p
            className="text-sm tracking-[0.2em] uppercase opacity-70 mb-2"
            style={{ color: labelColor }}
          >
            {country}
          </p>
          <p
            className="text-xs font-mono opacity-50"
            style={{ color: labelColor }}
          >
            {formatCoord(lat, true)} / {formatCoord(lng, false)}
          </p>
        </div>
      )}

      {/* Loading state */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/80 z-10">
          <div className="w-8 h-8 border-2 border-neutral-500 border-t-white rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
