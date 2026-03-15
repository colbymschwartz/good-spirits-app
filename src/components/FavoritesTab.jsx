import React, { useState, useMemo } from 'react';
import { SPIRIT_ICONS, STYLE_LABELS } from '../data/constants';

export default function FavoritesTab({ favorites, madeIt, ratings, toggleFavorite, toggleMadeIt, setRating, onSelect, cocktails }) {
  const [subTab, setSubTab] = useState("favorites");

  // favorites is now an array of { cocktailId, variationIndex, variationName }
  const favItems = useMemo(() => {
    return favorites.map(fav => {
      const cocktail = cocktails.find(c => c.id === fav.cocktailId);
      if (!cocktail) return null;
      const variation = cocktail.variations[fav.variationIndex] || cocktail.variations[0];
      return { cocktail, variation, variationIndex: fav.variationIndex, fav };
    }).filter(Boolean);
  }, [favorites, cocktails]);

  const madeCocktails = useMemo(() => cocktails.filter(c => madeIt.includes(c.id)), [madeIt, cocktails]);
  const ratedCocktails = useMemo(() => cocktails.filter(c => ratings[c.id] > 0).sort((a, b) => (ratings[b.id] || 0) - (ratings[a.id] || 0)), [ratings, cocktails]);

  const renderFavList = () => {
    if (favItems.length === 0) return (
      <div className="empty-state">
        <div className="empty-state-icon">{"\u2764\uFE0F"}</div>
        <div className="empty-state-text">No favorites yet.{"\n"}Tap the heart on any cocktail variation to save it here.</div>
      </div>
    );
    return favItems.map((item, idx) => (
      <div key={idx} className="card" onClick={() => onSelect(item.cocktail, item.variationIndex)}>
        <div className="cocktail-card">
          <div className="spirit-icon">{SPIRIT_ICONS[item.cocktail.spirit] || "\u{2728}"}</div>
          <div className="cocktail-info">
            <div className="cocktail-name">{item.variation.name}</div>
            <div className="cocktail-meta">
              <span className="tag" style={{ background: "var(--border-light)", fontSize: "10px" }}>{item.cocktail.name}</span>
              <span className="tag tag-style">{STYLE_LABELS[item.cocktail.style] || item.cocktail.style}</span>
              {ratings[item.cocktail.id] > 0 && (
                <span style={{ color: "var(--accent-gold)", fontSize: "12px" }}>{"\u2605".repeat(ratings[item.cocktail.id])}</span>
              )}
            </div>
          </div>
          <button className="fav-btn" onClick={e => { e.stopPropagation(); toggleFavorite(item.cocktail.id, item.variationIndex, item.variation.name); }}>
            {"\u2764\uFE0F"}
          </button>
        </div>
      </div>
    ));
  };

  const renderList = (items, emptyIcon, emptyText) => {
    if (items.length === 0) return (
      <div className="empty-state">
        <div className="empty-state-icon">{emptyIcon}</div>
        <div className="empty-state-text">{emptyText}</div>
      </div>
    );
    return items.map(c => (
      <div key={c.id} className="card" onClick={() => onSelect(c)}>
        <div className="cocktail-card">
          <div className="spirit-icon">{SPIRIT_ICONS[c.spirit] || "\u{2728}"}</div>
          <div className="cocktail-info">
            <div className="cocktail-name">{c.name}</div>
            <div className="cocktail-meta">
              <span className="tag tag-style">{STYLE_LABELS[c.style] || c.style}</span>
              {ratings[c.id] > 0 && (
                <span style={{ color: "var(--accent-gold)", fontSize: "12px" }}>{"\u2605".repeat(ratings[c.id])}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="view active">
      <div className="sub-tabs">
        <button className={"sub-tab" + (subTab === "favorites" ? " active" : "")} onClick={() => setSubTab("favorites")}>
          {"\u2764\uFE0F"} Favorites
          {favItems.length > 0 && <span className="counter-badge">{favItems.length}</span>}
        </button>
        <button className={"sub-tab" + (subTab === "madeit" ? " active" : "")} onClick={() => setSubTab("madeit")}>
          {"\u2705"} Made It
          {madeCocktails.length > 0 && <span className="counter-badge">{madeCocktails.length}</span>}
        </button>
        <button className={"sub-tab" + (subTab === "rated" ? " active" : "")} onClick={() => setSubTab("rated")}>
          {"\u2B50"} Top Rated
          {ratedCocktails.length > 0 && <span className="counter-badge">{ratedCocktails.length}</span>}
        </button>
      </div>
      {subTab === "favorites" && renderFavList()}
      {subTab === "madeit" && renderList(madeCocktails, "\u2705", "Nothing made yet.\nStart mixing and track your builds here.")}
      {subTab === "rated" && renderList(ratedCocktails, "\u2B50", "No ratings yet.\nRate cocktails to build your personal top list.")}
    </div>
  );
}
