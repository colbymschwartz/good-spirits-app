import React, { useState, useEffect, useMemo } from 'react';
import { SPIRIT_ICONS, STYLE_LABELS, MOOD_LABELS } from '../data/constants';
import { parseSpecLine } from '../utils/parseSpec';
import { formatAmount } from '../utils/formatAmount';
import { SUBSTITUTIONS, subIngredientName } from '../data/substitutions';

export default function CocktailDetail({
  cocktail, initialVariation, onClose,
  isFavorite, toggleFavorite,
  isMadeIt, toggleMadeIt,
  rating, setRating,
  onBatch, saveCustomVariation, deleteCustomVariation,
  onRemix, getNote, saveNote, getPhoto, savePhoto,
  isCustom, onDelete, onShare
}) {
  const [activeVariation, setActiveVariation] = useState(initialVariation || 0);
  const [adjustedSpecs, setAdjustedSpecs] = useState(null);
  const [saveName, setSaveName] = useState("");
  const [editingNote, setEditingNote] = useState(false);
  const [noteText, setNoteText] = useState("");
  const variation = cocktail.variations[activeVariation];
  const isModified = adjustedSpecs !== null;

  const handleStepperChange = (idx, delta) => {
    const current = adjustedSpecs || variation.spec.map(s => {
      const parsed = parseSpecLine(s);
      return parsed ? parsed.amount : null;
    });
    const newSpecs = [...current];
    if (newSpecs[idx] === null) return;
    const parsed = parseSpecLine(variation.spec[idx]);
    if (!parsed) return;
    const step = parsed.unit === "oz" ? 0.25 : (parsed.unit === "dash" || parsed.unit === "dashes") ? 1 : 0.125;
    newSpecs[idx] = Math.max(0, (newSpecs[idx] !== null ? newSpecs[idx] : parsed.amount) + delta * step);
    setAdjustedSpecs(newSpecs);
  };

  const handleSaveVariation = () => {
    if (!saveName.trim() || !adjustedSpecs) return;
    const newSpec = variation.spec.map((s, i) => {
      if (adjustedSpecs[i] === null) return s;
      const parsed = parseSpecLine(s);
      if (!parsed) return s;
      return formatAmount(adjustedSpecs[i]) + " " + parsed.unit + " " + parsed.ingredient;
    });
    const newVar = { ...variation, name: saveName.trim(), canon: false, isCustom: true, spec: newSpec };
    saveCustomVariation(newVar);
    setAdjustedSpecs(null);
    setSaveName("");
  };

  const currentNote = getNote(variation ? variation.name : "");
  const currentPhoto = getPhoto(variation ? variation.name : "");

  const handlePhotoCapture = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const maxW = 600;
          const scale = maxW / img.width;
          canvas.width = maxW;
          canvas.height = img.height * scale;
          canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
          savePhoto(variation.name, canvas.toDataURL("image/jpeg", 0.85));
        };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  useEffect(() => {
    setAdjustedSpecs(null);
    setSaveName("");
    setEditingNote(false);
  }, [activeVariation]);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div className="modal active" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content">
        <div className="cocktail-hero">
          <div className="cocktail-hero-icon">{SPIRIT_ICONS[cocktail.spirit] || "\u{2728}"}</div>
          <div className="cocktail-hero-name">{cocktail.name}</div>
          <div className="cocktail-hero-meta">
            <span className="tag tag-style">{STYLE_LABELS[cocktail.style] || cocktail.style}</span>
            <span className="tag tag-era">{cocktail.era}</span>
            {cocktail.difficulty && <span className={"difficulty-badge " + cocktail.difficulty.toLowerCase().replace(/ /g, "-")}>{cocktail.difficulty === "Dive Bar" ? "\u{1F37A}" : cocktail.difficulty === "Hotel Bar" ? "\u{1F378}" : "\u{1F9EA}"} {cocktail.difficulty}</span>}
            {cocktail.tags && cocktail.tags.slice(0, 3).map(t => (
              <span key={t} className="tag tag-mood">{MOOD_LABELS[t] || t}</span>
            ))}
          </div>
          {cocktail.history && <div className="cocktail-hero-history">{cocktail.history}</div>}
          <div className="cocktail-hero-actions">
            <button className="fav-btn" onClick={e => { e.stopPropagation(); toggleFavorite(); }}>
              {isFavorite ? "\u2764\uFE0F" : "\u{1F90D}"}
            </button>
            <button className="btn btn-small btn-outline" onClick={e => { e.stopPropagation(); toggleMadeIt(); }}>
              {isMadeIt ? "\u2705 Made It" : "Mark Made It"}
            </button>
            <button className="btn btn-small btn-outline" onClick={e => { e.stopPropagation(); onBatch(); }}>
              {"\u{1F4CA}"} Batch
            </button>
            {variation && (
              <button className="btn btn-small btn-outline" onClick={e => { e.stopPropagation(); onShare(variation); }}>
                {"\u{1F4E4}"} Share
              </button>
            )}
            {isCustom && onDelete && (
              <button className="btn btn-small" style={{ background: "var(--error)", color: "white" }} onClick={e => { e.stopPropagation(); if (confirm("Delete this custom cocktail?")) onDelete(); }}>
                Delete
              </button>
            )}
          </div>
          <div className="star-rating" style={{ justifyContent: "center", marginTop: "10px" }}>
            {[1, 2, 3, 4, 5].map(s => (
              <span key={s} className={"star" + (s <= rating ? " filled" : "")} onClick={() => setRating(s)}>{"\u2605"}</span>
            ))}
          </div>
        </div>

        {cocktail.variations.length > 1 && (
          <div className="pill-row" style={{ paddingTop: "12px" }}>
            {cocktail.variations.map((v, i) => (
              <button key={i} className={"pill" + (activeVariation === i ? " active" : "")} onClick={() => setActiveVariation(i)}>
                {v.canon ? "\u{1F451} " : v.isCustom ? "\u2728 " : ""}{v.name}
              </button>
            ))}
          </div>
        )}

        {variation && (
          <div className="modal-body">
            {currentPhoto && <img src={currentPhoto} className="photo-preview" alt="Cocktail photo" />}
            <div className={"variation-card" + (variation.canon ? " canon" : "")}>
              <div className="variation-name">
                {variation.name}
                {variation.canon && <span className="canon-badge">Canon</span>}
                {variation.isCustom && <span className="custom-badge">Custom</span>}
                {isModified && <span className="modified-badge">Modified</span>}
              </div>

              <div style={{ padding: "10px 0" }}>
                {variation.spec.map((s, i) => {
                  const parsed = parseSpecLine(s);
                  if (!parsed) return (
                    <div key={i} className="stepper-row">
                      <span className="stepper-ingredient">{s}</span>
                    </div>
                  );
                  const currentAmount = adjustedSpecs && adjustedSpecs[i] !== null ? adjustedSpecs[i] : parsed.amount;
                  return (
                    <div key={i} className="stepper-row">
                      <span className="stepper-ingredient">{parsed.ingredient}</span>
                      <div className="stepper-controls">
                        <button className="stepper-btn" onClick={() => handleStepperChange(i, -1)}>{"\u2212"}</button>
                        <span className="stepper-amount">{formatAmount(currentAmount)}</span>
                        <span className="stepper-unit">{parsed.unit}</span>
                        <button className="stepper-btn" onClick={() => handleStepperChange(i, 1)}>+</button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {isModified && (
                <div style={{ background: "rgba(201,169,110,0.08)", borderRadius: "var(--radius-sm)", padding: "10px", marginBottom: "10px" }}>
                  <div style={{ fontSize: "12px", color: "var(--accent-gold)", marginBottom: "6px", fontWeight: 600 }}>Save as custom variation:</div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input type="text" placeholder="My Negroni Twist..." value={saveName} onChange={e => setSaveName(e.target.value)} style={{ flex: 1, padding: "8px 10px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--bg-dark)", color: "var(--text-primary)", fontSize: "13px", fontFamily: "inherit" }} />
                    <button className="btn btn-small btn-primary" onClick={handleSaveVariation} disabled={!saveName.trim()}>Save</button>
                  </div>
                </div>
              )}

              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "8px" }}>
                {variation.glass && <span className="tag tag-style">{"\u{1F37A}"} {variation.glass}</span>}
                {variation.method && <span className="tag tag-spirit">{variation.method}</span>}
              </div>

              {variation.garnish && (
                <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "8px" }}>
                  <strong style={{ color: "var(--accent-gold-dim)" }}>Garnish:</strong> {variation.garnish}
                </div>
              )}

              {variation.steps && (
                <div className="detail-section">
                  <div className="detail-label">How to Make It</div>
                  <div className="detail-text">{variation.steps}</div>
                </div>
              )}

              {variation.ratioNotes && (
                <div className="detail-section">
                  <div className="detail-label">Ratio Philosophy</div>
                  <div className="ratio-notes">{variation.ratioNotes}</div>
                </div>
              )}

              {variation.brandRecs && (
                <div className="detail-section">
                  <div className="detail-label">Recommended Bottles</div>
                  <div className="detail-text">{variation.brandRecs}</div>
                </div>
              )}

              {variation.ingredients && variation.ingredients.some(ing => SUBSTITUTIONS[ing]) && (
                <div className="detail-section subs-section">
                  <div className="detail-label">Substitutions</div>
                  <div className="subs-list">
                    {variation.ingredients.filter(ing => SUBSTITUTIONS[ing]).map(ing => (
                      <div key={ing} className="subs-ingredient">
                        <div className="subs-ingredient-name">{subIngredientName(ing)}</div>
                        <div className="subs-options">
                          {SUBSTITUTIONS[ing].map(sub => (
                            <div key={sub.id} className="subs-option">
                              <span className="subs-option-name">{sub.name}</span>
                              {sub.notes && <span className="subs-option-notes">{sub.notes}</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="notes-section">
                <div className="detail-label" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>My Notes</span>
                  {!editingNote && (
                    <button className="btn btn-small btn-outline" style={{ padding: "2px 8px", fontSize: "11px" }} onClick={() => { setNoteText(currentNote); setEditingNote(true); }}>
                      {currentNote ? "Edit" : "Add Note"}
                    </button>
                  )}
                </div>
                {editingNote ? (
                  <div>
                    <textarea className="notes-textarea" value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Tried with Roku gin — too floral, stick with Tanqueray..." />
                    <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
                      <button className="btn btn-small btn-primary" onClick={() => { saveNote(variation.name, noteText); setEditingNote(false); }}>Save</button>
                      <button className="btn btn-small btn-secondary" onClick={() => setEditingNote(false)}>Cancel</button>
                    </div>
                  </div>
                ) : currentNote ? (
                  <div className="notes-display">{currentNote}</div>
                ) : null}
              </div>

              <div style={{ display: "flex", gap: "8px", marginTop: "12px", flexWrap: "wrap" }}>
                <button className="btn btn-small btn-outline" onClick={() => onRemix(variation)}>{"\u{1F504}"} Remix This</button>
                <button className="btn btn-small btn-outline" onClick={handlePhotoCapture}>{"\u{1F4F7}"} {currentPhoto ? "Update Photo" : "Add Photo"}</button>
                {variation.isCustom && (
                  <button className="btn btn-small" style={{ background: "var(--error)", color: "white" }} onClick={() => { if (confirm("Delete this custom variation?")) deleteCustomVariation(variation.name); }}>
                    Delete Variation
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <div style={{ padding: "12px 20px 24px", textAlign: "center" }}>
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
