"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useSearch } from "@/hooks/useSearch";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { fetchCities, City } from "@/lib/cities";

export interface SearchBarProps {
  placeholder?: string;
  storageKey?: string;
  onSelect?: (city: City) => void;
}

export function SearchBar({
  placeholder = "Şehir ara...",
  storageKey = "selectedCity",
  onSelect,
}: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [selectedCity, setSelectedCity] = useLocalStorage<City | null>(
    storageKey,
    null
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { query, setQuery, results, isLoading } = useSearch<City>({
    fetcher: fetchCities,
    debounceMs: 300,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  const handleSelectCity = useCallback(
    (city: City) => {
      setSelectedCity(city);
      setQuery(city.name);
      setIsOpen(false);
      setHighlightedIndex(-1);
      onSelect?.(city);
    },
    [setSelectedCity, setQuery, onSelect]
  );

  const handleSearchButtonClick = () => {
    if (query.trim()) {
      setIsOpen(true);
      // If there's a single result or an exact match, select it
      const exactMatch = results.find(
        (city) => city.name.toLowerCase() === query.toLowerCase().trim()
      );
      if (exactMatch) {
        handleSelectCity(exactMatch);
      } else if (results.length === 1) {
        handleSelectCity(results[0]);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setHighlightedIndex(0);
        } else {
          setHighlightedIndex((prev) =>
            prev < results.length - 1 ? prev + 1 : prev
          );
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < results.length) {
          handleSelectCity(results[highlightedIndex]);
        } else if (query.trim()) {
          handleSearchButtonClick();
        }
        break;
      case "Escape":
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset highlighted index when results change
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [results]);

  const hasNoResults = !isLoading && query.trim() && results.length === 0;

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full px-4 py-3 pr-12 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--neon-cyan)] focus:ring-1 focus:ring-[var(--neon-cyan)] transition-colors"
          aria-label="Şehir ara"
          aria-autocomplete="list"
          aria-controls={isOpen ? "city-dropdown" : undefined}
          aria-activedescendant={
            highlightedIndex >= 0 ? `city-option-${highlightedIndex}` : undefined
          }
          aria-expanded={isOpen}
          role="combobox"
        />
        <button
          type="button"
          onClick={handleSearchButtonClick}
          className="absolute right-2 p-2 text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] transition-colors rounded-md hover:bg-[var(--bg-panel)]"
          aria-label="Ara"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </button>
      </div>

      {/* Selected city indicator */}
      {selectedCity && !isOpen && (
        <div className="mt-2 text-sm text-[var(--neon-cyan)]">
          Seçili şehir: {selectedCity.name} ({selectedCity.plateNumber})
        </div>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div
          id="city-dropdown"
          className="absolute z-50 w-full mt-2 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-lg shadow-lg max-h-64 overflow-auto"
          role="listbox"
        >
          {isLoading && (
            <div className="px-4 py-3 text-[var(--text-secondary)] text-sm">
              Yükleniyor...
            </div>
          )}

          {hasNoResults && (
            <div className="px-4 py-3 text-[var(--text-secondary)] text-sm">
              Şehir bulunamadı
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <ul className="py-1">
              {results.map((city, index) => (
                <li
                  key={city.id}
                  id={`city-option-${index}`}
                  role="option"
                  aria-selected={index === highlightedIndex}
                  onClick={() => handleSelectCity(city)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`px-4 py-2 cursor-pointer text-sm transition-colors ${
                    index === highlightedIndex
                      ? "bg-[var(--neon-cyan)]/20 text-[var(--neon-cyan)]"
                      : "text-[var(--text-primary)] hover:bg-[var(--bg-panel)]"
                  }`}
                >
                  <span className="font-medium">{city.name}</span>
                  <span className="ml-2 text-[var(--text-muted)]">
                    ({city.plateNumber})
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
