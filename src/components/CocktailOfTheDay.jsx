import React, { useMemo } from 'react';
import { SPIRIT_ICONS, STYLE_LABELS } from '../data/constants';

// Deterministic "random" pick based on date — same cocktail for all users on any given day
function getDailyPick(cocktails, dateStr) {
  if (!cocktails.length) return null;
  // Simple hash from date string
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
    hash |= 0;
  }
  const idx = Math.abs(hash) % cocktails.length;
  return cocktails[idx];
}

// Curated seasonal/mood pairings for different times of year
function getSeasonalTag() {
  const month = new Date().getMonth(); // 0-11
  if (month >= 5 && month <= 8) return "summer";
  if (month >= 11 || month <= 1) return "winter";
  if (month >= 2 && month <= 4) return "refreshing";
  return "classic";
}

function getDayGreeting() {
  const hour = new Date().getHours();
  const day = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  if (hour < 12) return `Good morning — here's your ${day} pick`;
  if (hour < 17) return `${day} afternoon pick`;
  return `Tonight's featured cocktail`;
}

export default function CocktailOfTheDay({ cocktails, onSelect }) {
  const pick = useMemo(() => {
    if (!cocktails || !cocktails.length) return null;

    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const seasonTag = getSeasonalTag();

    // Prefer cocktails that match the season, but fall back to all
    const seasonal = cocktails.filter(c => c.tags && c.tags.includes(seasonTag));
    const pool = seasonal.length >= 10 ? seasonal : cocktails;

    const cocktail = getDailyPick(pool, today);
    if (!cocktail) return null;

    // Get the canon variation (or first)
    const canonVar = cocktail.variations.find(v => v.canon) || cocktail.variations[0];

    return { cocktail, variation: canonVar };
  }, [cocktails]);

  if (!pick) return null;

  const { cocktail, variation } = pick;
  const greeting = getDayGreeting();

  return (
    <div className="cotd-card" onClick={() => onSelect(cocktail)}>
      <div className="cotd-label">{greeting}</div>
      <div className="cotd-content">
        <div className="cotd-icon">{SPIRIT_ICONS[cocktail.spirit] || "\u2728"}</div>
        <div className="cotd-details">
          <div className="cotd-name">{cocktail.name}</div>
          <div className="cotd-variation">{variation.name}</div>
          <div className="cotd-meta">
            <span className="tag tag-style">{STYLE_LABELS[cocktail.style] || cocktail.style}</span>
            <span className="tag tag-spirit">{cocktail.spirit}</span>
            {cocktail.difficulty && (
              <span className={"difficulty-badge " + cocktail.difficulty.toLowerCase().replace(/ /g, "-")}>
                {cocktail.difficulty === "Dive Bar" ? "\u{1F37A}" : cocktail.difficulty === "Hotel Bar" ? "\u{1F378}" : "\u{1F9EA}"} {cocktail.difficulty}
              </span>
            )}
          </div>
          {cocktail.history && (
            <div className="cotd-history">
              {cocktail.history.length > 120 ? cocktail.history.slice(0, 120) + "..." : cocktail.history}
            </div>
          )}
          <div className="cotd-spec">
            {variation.spec && variation.spec.slice(0, 4).map((s, i) => (
              <span key={i} className="cotd-spec-item">{s}</span>
            ))}
            {variation.spec && variation.spec.length > 4 && (
              <span className="cotd-spec-item">+{variation.spec.length - 4} more</span>
            )}
          </div>
        </div>
      </div>
      <div className="cotd-cta">View Recipe →</div>
    </div>
  );
}
