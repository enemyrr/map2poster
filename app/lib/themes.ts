export interface Theme {
  id: string;
  name: string;
  background: string;
  roads: string | string[];
  water: string;
  parks?: string;
  buildings?: string;
  labels?: string;
}

export const themes: Theme[] = [
  {
    id: "noir",
    name: "Noir",
    background: "#000000",
    roads: "#ffffff",
    water: "#1a1a2e",
    parks: "#0d1a0d",
    buildings: "#1a1a1a",
    labels: "#ffffff",
  },
  {
    id: "midnight_blue",
    name: "Midnight Blue",
    background: "#0a1628",
    roads: "#d4af37",
    water: "#1a3a5c",
    parks: "#1a2f1a",
    buildings: "#0f1f38",
    labels: "#d4af37",
  },
  {
    id: "blueprint",
    name: "Blueprint",
    background: "#1e3a5f",
    roads: "#87ceeb",
    water: "#2a4a6f",
    parks: "#2a5a4f",
    buildings: "#1a3050",
    labels: "#87ceeb",
  },
  {
    id: "neon_cyberpunk",
    name: "Neon Cyberpunk",
    background: "#0d0221",
    roads: ["#ff00ff", "#00ffff"],
    water: "#1a0a2e",
    parks: "#0a1f0a",
    buildings: "#150530",
    labels: "#ff00ff",
  },
  {
    id: "japanese_ink",
    name: "Japanese Ink",
    background: "#f5f5dc",
    roads: "#2c2c2c",
    water: "#4a6741",
    parks: "#8fbc8f",
    buildings: "#e8e8c8",
    labels: "#2c2c2c",
  },
  {
    id: "sunset",
    name: "Sunset",
    background: "#1a0a0a",
    roads: ["#ff6b35", "#ff8c42"],
    water: "#2d1f3d",
    parks: "#2d1f1f",
    buildings: "#251515",
    labels: "#ff6b35",
  },
  {
    id: "forest",
    name: "Forest",
    background: "#1a2f1a",
    roads: "#8fbc8f",
    water: "#2d4a3a",
    parks: "#3d5a3d",
    buildings: "#152515",
    labels: "#8fbc8f",
  },
  {
    id: "ocean",
    name: "Ocean",
    background: "#0a2a3a",
    roads: "#4ecdc4",
    water: "#1a4a5a",
    parks: "#1a3a3a",
    buildings: "#082030",
    labels: "#4ecdc4",
  },
  {
    id: "vintage",
    name: "Vintage",
    background: "#f4e9d9",
    roads: "#8b4513",
    water: "#6b8e8e",
    parks: "#9cb89c",
    buildings: "#e8dcc8",
    labels: "#8b4513",
  },
  {
    id: "arctic",
    name: "Arctic",
    background: "#e8f4f8",
    roads: "#2c3e50",
    water: "#5dade2",
    parks: "#a8d8dc",
    buildings: "#d8e8ec",
    labels: "#2c3e50",
  },
  {
    id: "copper",
    name: "Copper",
    background: "#1a1210",
    roads: "#b87333",
    water: "#2a3a3a",
    parks: "#2a3020",
    buildings: "#201815",
    labels: "#b87333",
  },
  {
    id: "lavender",
    name: "Lavender",
    background: "#2d1f3d",
    roads: "#dda0dd",
    water: "#3d2f4d",
    parks: "#3d3f4d",
    buildings: "#251530",
    labels: "#dda0dd",
  },
  {
    id: "emerald",
    name: "Emerald",
    background: "#0a1f0a",
    roads: "#50c878",
    water: "#1a3a2a",
    parks: "#2a4a2a",
    buildings: "#081808",
    labels: "#50c878",
  },
  {
    id: "rose_gold",
    name: "Rose Gold",
    background: "#1a1015",
    roads: "#e8b4b8",
    water: "#2a2025",
    parks: "#2a2520",
    buildings: "#201520",
    labels: "#e8b4b8",
  },
  {
    id: "monochrome",
    name: "Monochrome",
    background: "#1a1a1a",
    roads: "#cccccc",
    water: "#333333",
    parks: "#2a2a2a",
    buildings: "#252525",
    labels: "#cccccc",
  },
  {
    id: "coral",
    name: "Coral",
    background: "#1a1520",
    roads: "#ff7f50",
    water: "#2a3040",
    parks: "#2a3530",
    buildings: "#201a25",
    labels: "#ff7f50",
  },
  {
    id: "mint",
    name: "Mint",
    background: "#0f2520",
    roads: "#98fb98",
    water: "#1a4040",
    parks: "#2a5045",
    buildings: "#0a201a",
    labels: "#98fb98",
  },
];

export function getThemeById(id: string): Theme {
  return themes.find((t) => t.id === id) || themes[0];
}

export function getPrimaryRoadColor(theme: Theme): string {
  return Array.isArray(theme.roads) ? theme.roads[0] : theme.roads;
}

export function getSecondaryRoadColor(theme: Theme): string {
  return Array.isArray(theme.roads) ? theme.roads[1] || theme.roads[0] : theme.roads;
}
