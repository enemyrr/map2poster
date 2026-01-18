import type { StyleSpecification } from "maplibre-gl";
import { Theme, getPrimaryRoadColor, getSecondaryRoadColor } from "./themes";

export function generateMapStyle(theme: Theme): StyleSpecification {
  const primaryRoad = getPrimaryRoadColor(theme);
  const secondaryRoad = getSecondaryRoadColor(theme);

  return {
    version: 8,
    name: `map2poster-${theme.id}`,
    sources: {
      openmaptiles: {
        type: "vector",
        url: "https://tiles.openfreemap.org/planet",
      },
    },
    glyphs: "https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf",
    layers: [
      // Background
      {
        id: "background",
        type: "background",
        paint: {
          "background-color": theme.background,
        },
      },
      // Water
      {
        id: "water",
        type: "fill",
        source: "openmaptiles",
        "source-layer": "water",
        paint: {
          "fill-color": theme.water,
        },
      },
      // Parks/Landuse
      {
        id: "landuse-park",
        type: "fill",
        source: "openmaptiles",
        "source-layer": "landuse",
        filter: ["in", "class", "park", "grass", "cemetery", "wood", "forest"],
        paint: {
          "fill-color": theme.parks || theme.water,
          "fill-opacity": 0.6,
        },
      },
      // Landcover (natural areas)
      {
        id: "landcover",
        type: "fill",
        source: "openmaptiles",
        "source-layer": "landcover",
        filter: ["in", "class", "grass", "wood", "forest"],
        paint: {
          "fill-color": theme.parks || theme.water,
          "fill-opacity": 0.4,
        },
      },
      // Buildings
      {
        id: "buildings",
        type: "fill",
        source: "openmaptiles",
        "source-layer": "building",
        minzoom: 13,
        paint: {
          "fill-color": theme.buildings || theme.background,
          "fill-opacity": 0.8,
        },
      },
      // Roads - Service/Path (thinnest)
      {
        id: "road-service",
        type: "line",
        source: "openmaptiles",
        "source-layer": "transportation",
        filter: ["in", "class", "service", "path", "track"],
        layout: {
          "line-cap": "round",
          "line-join": "round",
        },
        paint: {
          "line-color": primaryRoad,
          "line-width": [
            "interpolate",
            ["linear"],
            ["zoom"],
            12, 0.3,
            16, 1,
            20, 2,
          ],
          "line-opacity": 0.5,
        },
      },
      // Roads - Residential/Minor
      {
        id: "road-minor",
        type: "line",
        source: "openmaptiles",
        "source-layer": "transportation",
        filter: ["in", "class", "minor", "residential", "living_street"],
        layout: {
          "line-cap": "round",
          "line-join": "round",
        },
        paint: {
          "line-color": primaryRoad,
          "line-width": [
            "interpolate",
            ["linear"],
            ["zoom"],
            10, 0.3,
            14, 1,
            18, 3,
          ],
          "line-opacity": 0.7,
        },
      },
      // Roads - Tertiary
      {
        id: "road-tertiary",
        type: "line",
        source: "openmaptiles",
        "source-layer": "transportation",
        filter: ["==", "class", "tertiary"],
        layout: {
          "line-cap": "round",
          "line-join": "round",
        },
        paint: {
          "line-color": primaryRoad,
          "line-width": [
            "interpolate",
            ["linear"],
            ["zoom"],
            10, 0.5,
            14, 2,
            18, 5,
          ],
          "line-opacity": 0.8,
        },
      },
      // Roads - Secondary
      {
        id: "road-secondary",
        type: "line",
        source: "openmaptiles",
        "source-layer": "transportation",
        filter: ["==", "class", "secondary"],
        layout: {
          "line-cap": "round",
          "line-join": "round",
        },
        paint: {
          "line-color": secondaryRoad,
          "line-width": [
            "interpolate",
            ["linear"],
            ["zoom"],
            8, 0.5,
            12, 2,
            16, 6,
          ],
          "line-opacity": 0.9,
        },
      },
      // Roads - Primary
      {
        id: "road-primary",
        type: "line",
        source: "openmaptiles",
        "source-layer": "transportation",
        filter: ["==", "class", "primary"],
        layout: {
          "line-cap": "round",
          "line-join": "round",
        },
        paint: {
          "line-color": primaryRoad,
          "line-width": [
            "interpolate",
            ["linear"],
            ["zoom"],
            6, 0.5,
            10, 2,
            14, 5,
            18, 8,
          ],
        },
      },
      // Roads - Trunk
      {
        id: "road-trunk",
        type: "line",
        source: "openmaptiles",
        "source-layer": "transportation",
        filter: ["==", "class", "trunk"],
        layout: {
          "line-cap": "round",
          "line-join": "round",
        },
        paint: {
          "line-color": primaryRoad,
          "line-width": [
            "interpolate",
            ["linear"],
            ["zoom"],
            6, 0.8,
            10, 2.5,
            14, 6,
            18, 10,
          ],
        },
      },
      // Roads - Motorway (thickest)
      {
        id: "road-motorway",
        type: "line",
        source: "openmaptiles",
        "source-layer": "transportation",
        filter: ["==", "class", "motorway"],
        layout: {
          "line-cap": "round",
          "line-join": "round",
        },
        paint: {
          "line-color": primaryRoad,
          "line-width": [
            "interpolate",
            ["linear"],
            ["zoom"],
            5, 1,
            10, 3,
            14, 7,
            18, 12,
          ],
        },
      },
      // Rail
      {
        id: "rail",
        type: "line",
        source: "openmaptiles",
        "source-layer": "transportation",
        filter: ["==", "class", "rail"],
        paint: {
          "line-color": primaryRoad,
          "line-width": [
            "interpolate",
            ["linear"],
            ["zoom"],
            10, 0.5,
            14, 1.5,
            18, 3,
          ],
          "line-opacity": 0.6,
          "line-dasharray": [3, 3],
        },
      },
    ],
  };
}

// Calculate zoom level from radius (in meters)
export function radiusToZoom(radiusMeters: number): number {
  // Approximate formula: zoom = log2(40075016.686 / (radius * 2)) - 8
  // Adjusted for typical poster view
  const earthCircumference = 40075016.686;
  const zoom = Math.log2(earthCircumference / (radiusMeters * 4)) - 1;
  return Math.min(Math.max(zoom, 8), 18);
}
