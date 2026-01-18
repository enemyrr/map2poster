"use client";

import { useState } from "react";
import type maplibregl from "maplibre-gl";
import { getThemeById, getPrimaryRoadColor } from "@/app/lib/themes";
import type { ExportFormat } from "./FormatSelector";
import type { AspectRatio } from "./AspectRatioSelector";

interface ExportButtonProps {
  city: string;
  country: string;
  lat: number;
  lng: number;
  theme: string;
  showLabels: boolean;
  format: ExportFormat;
  aspectRatio: AspectRatio;
  mapRef: React.RefObject<maplibregl.Map | null>;
}

const formatConfig: Record<ExportFormat, { mimeType: string; quality: number; extension: string }> = {
  png: { mimeType: "image/png", quality: 1.0, extension: "png" },
  jpeg: { mimeType: "image/jpeg", quality: 0.95, extension: "jpg" },
  webp: { mimeType: "image/webp", quality: 0.95, extension: "webp" },
};

// 4K base resolution (3840 on the longest side)
function getExportDimensions(ratio: AspectRatio): { width: number; height: number } {
  const baseSize = 3840;
  switch (ratio) {
    case "1:1":
      return { width: baseSize, height: baseSize };
    case "4:3":
      return { width: baseSize, height: Math.round(baseSize * (3 / 4)) };
    case "3:4":
      return { width: Math.round(baseSize * (3 / 4)), height: baseSize };
    case "16:9":
      return { width: baseSize, height: Math.round(baseSize * (9 / 16)) };
    case "9:16":
      return { width: Math.round(baseSize * (9 / 16)), height: baseSize };
  }
}

export function ExportButton({
  city,
  country,
  lat,
  lng,
  theme,
  showLabels,
  format,
  aspectRatio,
  mapRef,
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const formatCoord = (coord: number, isLat: boolean) => {
    const direction = isLat ? (coord >= 0 ? "N" : "S") : coord >= 0 ? "E" : "W";
    return `${Math.abs(coord).toFixed(4)}° ${direction}`;
  };

  const captureMap = (map: maplibregl.Map): Promise<string> => {
    return new Promise((resolve) => {
      const onRender = () => {
        map.off('render', onRender);
        const canvas = map.getCanvas();
        const dataUrl = canvas.toDataURL('image/png');
        resolve(dataUrl);
      };
      map.on('render', onRender);
      map.triggerRepaint();
    });
  };

  const handleExport = async () => {
    const map = mapRef.current;
    if (!map) {
      alert("Map is not ready. Please wait and try again.");
      return;
    }

    setIsExporting(true);

    try {
      const currentTheme = getThemeById(theme);
      const labelColor = currentTheme.labels || getPrimaryRoadColor(currentTheme);
      const { mimeType, quality, extension } = formatConfig[format];
      const { width, height } = getExportDimensions(aspectRatio);

      if (!map.isStyleLoaded()) {
        await new Promise<void>((resolve) => {
          map.once('idle', () => resolve());
        });
      }

      const mapDataUrl = await captureMap(map);
      const mapCanvas = map.getCanvas();

      // Create high-resolution export canvas
      const exportCanvas = document.createElement("canvas");
      exportCanvas.width = width;
      exportCanvas.height = height;
      const ctx = exportCanvas.getContext("2d");

      if (!ctx) {
        throw new Error("Could not get canvas context");
      }

      // Fill background
      ctx.fillStyle = currentTheme.background;
      ctx.fillRect(0, 0, width, height);

      // Draw the map image scaled to fit
      const mapImage = new Image();
      await new Promise<void>((resolve, reject) => {
        mapImage.onload = () => {
          // Calculate scaling to cover the canvas while maintaining aspect ratio
          const mapAspect = mapCanvas.width / mapCanvas.height;
          const exportAspect = width / height;

          let drawWidth, drawHeight, offsetX, offsetY;

          if (mapAspect > exportAspect) {
            // Map is wider - fit by height
            drawHeight = height;
            drawWidth = height * mapAspect;
            offsetX = (width - drawWidth) / 2;
            offsetY = 0;
          } else {
            // Map is taller - fit by width
            drawWidth = width;
            drawHeight = width / mapAspect;
            offsetX = 0;
            offsetY = (height - drawHeight) / 2;
          }

          ctx.drawImage(mapImage, offsetX, offsetY, drawWidth, drawHeight);
          resolve();
        };
        mapImage.onerror = reject;
        mapImage.src = mapDataUrl;
      });

      // Draw gradient fade at top
      const topGradient = ctx.createLinearGradient(0, 0, 0, height * 0.12);
      topGradient.addColorStop(0, currentTheme.background);
      topGradient.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = topGradient;
      ctx.fillRect(0, 0, width, height * 0.12);

      // Draw gradient fade at bottom
      const bottomGradient = ctx.createLinearGradient(0, height * 0.78, 0, height);
      bottomGradient.addColorStop(0, "rgba(0,0,0,0)");
      bottomGradient.addColorStop(1, currentTheme.background);
      ctx.fillStyle = bottomGradient;
      ctx.fillRect(0, height * 0.78, width, height * 0.22);

      // Draw labels if enabled
      if (showLabels) {
        const scale = width / 1200; // Scale based on width for consistent text size
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = labelColor;

        // City name
        ctx.font = `bold ${Math.round(72 * scale)}px system-ui, -apple-system, sans-serif`;
        ctx.fillText(city.toUpperCase(), width / 2, height - 150 * scale);

        // Country
        ctx.globalAlpha = 0.7;
        ctx.font = `${Math.round(28 * scale)}px system-ui, -apple-system, sans-serif`;
        ctx.fillText(country.toUpperCase(), width / 2, height - 90 * scale);

        // Coordinates
        ctx.globalAlpha = 0.5;
        ctx.font = `${Math.round(20 * scale)}px monospace`;
        ctx.fillText(
          `${formatCoord(lat, true)} / ${formatCoord(lng, false)}`,
          width / 2,
          height - 45 * scale
        );

        ctx.globalAlpha = 1;
      }

      // Download
      exportCanvas.toBlob(
        (blob) => {
          if (!blob) {
            throw new Error("Failed to create blob");
          }
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.download = `${city.toLowerCase().replace(/\s+/g, "-")}-${width}x${height}.${extension}`;
          link.href = url;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          setIsExporting(false);
        },
        mimeType,
        quality
      );
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export poster. Please try again.");
      setIsExporting(false);
    }
  };

  const { width, height } = getExportDimensions(aspectRatio);

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="w-full py-3 bg-white hover:bg-zinc-100 disabled:bg-zinc-300 text-zinc-900 font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
    >
      {isExporting ? (
        <>
          <div className="w-4 h-4 border-2 border-zinc-400 border-t-zinc-700 rounded-full animate-spin" />
          Exporting...
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export {format.toUpperCase()} ({width}x{height})
        </>
      )}
    </button>
  );
}
