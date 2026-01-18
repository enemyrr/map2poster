"use client";

import {
  parseAsString,
  parseAsFloat,
  parseAsInteger,
  parseAsBoolean,
  parseAsStringLiteral,
  useQueryState,
} from "nuqs";
import type { ExportFormat } from "../components/FormatSelector";
import type { AspectRatio } from "../components/AspectRatioSelector";

// Default values
const DEFAULT_CITY = "Stockholm";
const DEFAULT_COUNTRY = "Sweden";
const DEFAULT_LAT = 59.329;
const DEFAULT_LNG = 18.068;
const DEFAULT_THEME = "noir";
const DEFAULT_RADIUS = 10000;
const DEFAULT_LABELS = true;
const DEFAULT_FORMAT: ExportFormat = "png";
const DEFAULT_ASPECT_RATIO: AspectRatio = "3:4";

const formatParser = parseAsStringLiteral(["png", "jpeg", "webp"] as const);
const aspectRatioParser = parseAsStringLiteral(["1:1", "4:3", "3:4", "16:9", "9:16"] as const);

export function useMapState() {
  const [city, setCity] = useQueryState(
    "city",
    parseAsString.withDefault(DEFAULT_CITY)
  );
  const [country, setCountry] = useQueryState(
    "country",
    parseAsString.withDefault(DEFAULT_COUNTRY)
  );
  const [lat, setLat] = useQueryState(
    "lat",
    parseAsFloat.withDefault(DEFAULT_LAT)
  );
  const [lng, setLng] = useQueryState(
    "lng",
    parseAsFloat.withDefault(DEFAULT_LNG)
  );
  const [theme, setTheme] = useQueryState(
    "theme",
    parseAsString.withDefault(DEFAULT_THEME)
  );
  const [radius, setRadius] = useQueryState(
    "radius",
    parseAsInteger.withDefault(DEFAULT_RADIUS)
  );
  const [showLabels, setShowLabels] = useQueryState(
    "labels",
    parseAsBoolean.withDefault(DEFAULT_LABELS)
  );
  const [format, setFormat] = useQueryState(
    "format",
    formatParser.withDefault(DEFAULT_FORMAT)
  );
  const [aspectRatio, setAspectRatio] = useQueryState(
    "ratio",
    aspectRatioParser.withDefault(DEFAULT_ASPECT_RATIO)
  );

  const setLocation = (
    newCity: string,
    newCountry: string,
    newLat: number,
    newLng: number
  ) => {
    setCity(newCity);
    setCountry(newCountry);
    setLat(newLat);
    setLng(newLng);
  };

  return {
    city,
    setCity,
    country,
    setCountry,
    lat,
    setLat,
    lng,
    setLng,
    theme,
    setTheme,
    radius,
    setRadius,
    showLabels,
    setShowLabels,
    format,
    setFormat,
    aspectRatio,
    setAspectRatio,
    setLocation,
  };
}

export type MapState = ReturnType<typeof useMapState>;
