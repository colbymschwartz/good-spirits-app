import React, { useState, useMemo } from 'react';
import { INGREDIENT_INDEX } from '../data/ingredients';
import { SUBSTITUTIONS, buildReverseSubs } from '../data/substitutions';

// Build reverse lookup once: what bar items can substitute for recipe ingredients
const REVERSE_SUBS = buildReverseSubs();

export default function MyBarTab({ myBar, barBrands, toggleBarItem, setBarBrands, onSelect, cocktails, customBottles, addCustomBottle, removeCustomBottle }) {
  const [subTab, setSubTab] = useState("inventory");
  const [expandedCats, setExpandedCats] = useState({});
  const [newBottleName, setNewBottleName] = useState("");
  const [newBottleCategory, setNewBottleCategory] = useState("Spirits");

  const toggleCat = cat => setExpandedCats(prev => ({ ...prev, [cat]: !prev[cat] }));

  // Check if user has an ingredient OR a valid substitute for it
  const hasIngredientOrSub = (ingredient, allBarItems) => {
    // Direct match
    if (allBarItems.includes(ingredient)) return { has: true, via: null };
    // Check if any bar item is a known substitute for this recipe ingredient
    const subs = SUBSTITUTIONS[ingredient];
    if (subs) {
      for (const sub of subs) {
        if (allBarItems.includes(sub.id)) return { has: true, via: sub };
      }
    }
    // Check reverse: does the bar item appear as a sub target for this ingredient?
    for (const barItem of allBarItems) {
      if (REVERSE_SUBS[barItem] && REVERSE_SUBS[barItem].includes(ingredient)) {
        return { has: true, via: { id: barItem, name: barItem.replace(/-/g, ' '), notes: 'Can substitute' } };
      }
    }
    return { has: false, via: null };
  };

  const matches = useMemo(() => {
    if (myBar.length === 0 && (!customBottles || customBottles.length === 0)) return { perfect: [], close: [], buyNext: [] };
    const allBarItems = [...myBar, ...(customBottles || []).map(b => b.id)];
    const perfect = [];
    const close = [];
    cocktails.forEach(cocktail => {
      cocktail.variations.forEach(v => {
        if (!v.ingredients) return;
        const needed = v.ingredients.filter(i => !["sugar", "sugar-cube", "simple-syrup", "ice"].includes(i));
        const have = [];
        const missing = [];
        const usedSubs = [];
        needed.forEach(i => {
          const result = hasIngredientOrSub(i, allBarItems);
          if (result.has) {
            have.push(i);
            if (result.via) usedSubs.push({ original: i, sub: result.via });
          } else {
            missing.push(i);
          }
        });
        const pct = needed.length > 0 ? Math.round((have.length / needed.length) * 100) : 0;
        if (pct === 100) perfect.push({ cocktail, variation: v, pct, missing, usedSubs });
        else if (pct >= 60 && missing.length <= 2) close.push({ cocktail, variation: v, pct, missing, usedSubs });
      });
    });
    const dedup = arr => {
      const seen = {};
      return arr.filter(m => { if (seen[m.cocktail.id]) return false; seen[m.cocktail.id] = true; return true; });
    };
    const missingCounts = {};
    close.forEach(m => m.missing.forEach(ing => { missingCounts[ing] = (missingCounts[ing] || 0) + 1; }));
    const buyNext = Object.entries(missingCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([ing, count]) => ({ ingredient: ing, unlocks: count }));
    return { perfect: dedup(perfect), close: dedup(close).sort((a, b) => b.pct - a.pct), buyNext };
  }, [myBar, customBottles, cocktails]);

  const handleAddBottle = () => {
    if (!newBottleName.trim()) return;
    addCustomBottle({ id: newBottleName.trim().toLowerCase().replace(/\s+/g, "-"), name: newBottleName.trim(), category: newBottleCategory });
    setNewBottleName("");
  };

  return (
    <div className="view active">
      <div className="sub-tabs">
        <button className={"sub-tab" + (subTab === "inventory" ? " active" : "")} onClick={() => setSubTab("inventory")}>My Inventory</button>
        <button className={"sub-tab" + (subTab === "canmake" ? " active" : "")} onClick={() => setSubTab("canmake")}>
          What Can I Make?
          {matches.perfect.length > 0 && <span className="counter-badge">{matches.perfect.length}</span>}
        </button>
      </div>

      {subTab === "inventory" && (
        <div style={{ paddingBottom: "20px" }}>
          {/* Custom bottle input */}
          <div style={{ padding: "12px 16px", background: "var(--bg-card)", borderRadius: "var(--radius-sm)", margin: "0 16px 16px" }}>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--accent-gold)", marginBottom: "8px" }}>Add Custom Bottle</div>
            <div style={{ display: "flex", gap: "8px" }}>
              <input type="text" placeholder="e.g. Fernet Branca, Local Gin..." value={newBottleName} onChange={e => setNewBottleName(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAddBottle()} style={{ flex: 1, padding: "8px 10px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--bg-dark)", color: "var(--text-primary)", fontSize: "13px", fontFamily: "inherit" }} />
              <select value={newBottleCategory} onChange={e => setNewBottleCategory(e.target.value)} style={{ padding: "8px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--bg-dark)", color: "var(--text-primary)", fontSize: "12px" }}>
                {["Spirits", "Liqueurs", "Bitters", "Mixers", "Other"].map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <button className="btn btn-small btn-primary" onClick={handleAddBottle} disabled={!newBottleName.trim()}>Add</button>
            </div>
          </div>

          {/* Custom bottles section */}
          {customBottles && customBottles.length > 0 && (
            <div className="bar-category">
              <div className="bar-category-header" onClick={() => toggleCat("__custom__")}>
                <div className="bar-category-title">
                  <span>{"\u2728"}</span>
                  <span>My Custom Bottles</span>
                </div>
                <div className="bar-category-count">{customBottles.length} {expandedCats["__custom__"] ? "\u25B2" : "\u25BC"}</div>
              </div>
              {expandedCats["__custom__"] && (
                <div className="bar-items">
                  {customBottles.map(bottle => (
                    <div key={bottle.id} className="bar-item">
                      <div>
                        <span className="bar-item-name">{bottle.name}</span>
                        <span style={{ fontSize: "10px", color: "var(--text-secondary)", marginLeft: "8px" }}>{bottle.category}</span>
                      </div>
                      <button className="btn btn-small" style={{ background: "var(--error)", color: "white", padding: "2px 8px", fontSize: "11px" }} onClick={() => removeCustomBottle(bottle.id)}>Remove</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="section-header">{myBar.length} Ingredient{myBar.length !== 1 ? "s" : ""} in Your Bar</div>
          {INGREDIENT_INDEX.map(cat => (
            <div key={cat.category} className="bar-category">
              <div className="bar-category-header" onClick={() => toggleCat(cat.category)}>
                <div className="bar-category-title">
                  <span>{cat.icon}</span>
                  <span>{cat.category}</span>
                </div>
                <div className="bar-category-count">
                  {cat.items.filter(i => myBar.includes(i.id)).length}/{cat.items.length} {expandedCats[cat.category] ? "\u25B2" : "\u25BC"}
                </div>
              </div>
              {expandedCats[cat.category] && (
                <div className="bar-items">
                  {cat.items.map(item => (
                    <div key={item.id} className="bar-item" onClick={() => toggleBarItem(item.id)}>
                      <div>
                        <span className="bar-item-name">{item.name}</span>
                        {item.essential && <span className="bar-item-essential">Essential</span>}
                      </div>
                      <button className={"bar-toggle" + (myBar.includes(item.id) ? " on" : "")} onClick={e => { e.stopPropagation(); toggleBarItem(item.id); }} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {subTab === "canmake" && (
        <div style={{ paddingBottom: "20px" }}>
          {myBar.length === 0 && (!customBottles || customBottles.length === 0) ? (
            <div className="empty-state">
              <div className="empty-state-icon">{"\u{1F943}"}</div>
              <div className="empty-state-text">Add spirits and ingredients to your bar<br />to see what you can make!</div>
            </div>
          ) : (
            <>
              {matches.buyNext.length > 0 && (
                <div className="buy-next">
                  <div className="buy-next-header">{"\u{1F6D2}"} Buy Next to Unlock More</div>
                  {matches.buyNext.map(b => (
                    <div key={b.ingredient} className="buy-next-item">
                      <strong>{b.ingredient.replace(/-/g, " ")}</strong>
                      <span className="buy-next-unlock"> {"\u2014"} unlocks {b.unlocks} more cocktail{b.unlocks > 1 ? "s" : ""}</span>
                    </div>
                  ))}
                </div>
              )}
              {matches.perfect.length > 0 && (
                <div className="match-section">
                  <div className="match-header">{"\u2705"} Ready to Make ({matches.perfect.length})</div>
                  {matches.perfect.map(m => (
                    <div key={m.cocktail.id + m.variation.name} className="match-card" onClick={() => onSelect(m.cocktail)}>
                      <div className="match-pct">100%</div>
                      <div className="match-info">
                        <div className="match-name">{m.cocktail.name}</div>
                        <div className="match-missing">{m.variation.name}</div>
                        {m.usedSubs && m.usedSubs.length > 0 && (
                          <div className="match-subs">{"\u{1F504}"} Using: {m.usedSubs.map(s => s.sub.name || s.sub.id.replace(/-/g, ' ')).join(', ')}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {matches.close.length > 0 && (
                <div className="match-section">
                  <div className="match-header">{"\u{1F4AB}"} Almost There ({matches.close.length})</div>
                  {matches.close.map(m => (
                    <div key={m.cocktail.id + m.variation.name} className="match-card" onClick={() => onSelect(m.cocktail)}>
                      <div className="match-pct partial">{m.pct}%</div>
                      <div className="match-info">
                        <div className="match-name">{m.cocktail.name}</div>
                        <div className="match-missing">Need: {m.missing.map(i => i.replace(/-/g, " ")).join(", ")}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {matches.perfect.length === 0 && matches.close.length === 0 && (
                <div className="empty-state">
                  <div className="empty-state-icon">{"\u{1F914}"}</div>
                  <div className="empty-state-text">Add more ingredients to your bar<br />to discover what you can make!</div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
