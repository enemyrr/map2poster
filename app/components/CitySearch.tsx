"use client";

import { useState, useCallback, useRef, useEffect } from "react";

interface SearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    county?: string;
    state?: string;
    country?: string;
  };
}

interface CitySearchProps {
  value: string;
  onSelect: (city: string, country: string, lat: number, lng: number) => void;
}

export function CitySearch({ value, onSelect }: CitySearchProps) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchCities = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
          new URLSearchParams({
            q: searchQuery,
            format: "json",
            addressdetails: "1",
            limit: "5",
            featuretype: "city",
          }),
        {
          headers: {
            "User-Agent": "Map2Poster/1.0",
          },
        }
      );
      const data: SearchResult[] = await response.json();
      setResults(data);
      setIsOpen(data.length > 0);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      searchCities(newQuery);
    }, 300);
  };

  const handleSelect = (result: SearchResult) => {
    const cityName =
      result.address?.city ||
      result.address?.town ||
      result.address?.village ||
      result.address?.municipality ||
      result.display_name.split(",")[0];
    const countryName = result.address?.country || "";

    setQuery(cityName);
    setIsOpen(false);
    onSelect(cityName, countryName, parseFloat(result.lat), parseFloat(result.lon));
  };

  const getCityDisplay = (result: SearchResult) => {
    const city =
      result.address?.city ||
      result.address?.town ||
      result.address?.village ||
      result.address?.municipality ||
      result.display_name.split(",")[0];
    const region =
      result.address?.state || result.address?.county || "";
    const country = result.address?.country || "";

    return { city, region, country };
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="Search for a city..."
          className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-zinc-600 border-t-zinc-300 rounded-full animate-spin" />
          </div>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-lg overflow-hidden animate-fade-in">
          {results.map((result) => {
            const { city, region, country } = getCityDisplay(result);
            return (
              <button
                key={result.place_id}
                onClick={() => handleSelect(result)}
                className="w-full px-3 py-2.5 text-left hover:bg-zinc-700 transition-colors border-b border-zinc-700/50 last:border-b-0"
              >
                <div className="text-sm text-white">{city}</div>
                <div className="text-xs text-zinc-500">
                  {[region, country].filter(Boolean).join(", ")}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
