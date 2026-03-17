import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import { STYLE_LABELS } from '../data/constants';
import { getAllSpirits, generateId, addCustomSpirit } from '../utils/helpers';
import { parseSpecLine } from '../utils/parseSpec';

export default function ImportModal({ onClose, onSave }) {
  const [rawText, setRawText] = useState("");
  const [parsed, setParsed] = useState(null);
  const [customSpiritText, setCustomSpiritText] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanPreview, setScanPreview] = useState(null);
  const [scanProgress, setScanProgress] = useState(0);

  React.useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const parseRecipe = (text) => {
    const input = text || rawText;
    const lines = input.split("\n").map(l => l.trim()).filter(l => l);
    if (lines.length === 0) return;
    let name = lines[0].replace(/^#+\s*/, "").replace(/recipe$/i, "").trim();
    const ingredients = [];
    const steps = [];
    let inSteps = false;
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (/^(step|direction|instruction|method|preparation)/i.test(line)) { inSteps = true; continue; }
      if (/^(ingredient|what you|you.ll need)/i.test(line)) { inSteps = false; continue; }
      if (inSteps || /^\d+[\.\)]\s/.test(line)) { steps.push(line.replace(/^\d+[\.\)]\s*/, "")); inSteps = true; }
      else if (/^\d|^[\u00BC-\u00BE\u215B-\u215E]|^[-\u2022\*]\s*\d/.test(line)) { ingredients.push(line.replace(/^[-\u2022\*]\s*/, "")); }
      else if (line.length < 60 && i === 1 && !name) { name = line; }
      else {
        if (line.includes("oz") || line.includes("tbsp") || line.includes("tsp") || line.includes("cup") || line.includes("dash")) { ingredients.push(line.replace(/^[-\u2022\*]\s*/, "")); }
        else if (line.length > 20) { steps.push(line); }
      }
    }
    setParsed({ name, spec: ingredients, steps: steps.join(" "), spirit: "other", style: "spirit-forward", glass: "rocks", method: "Stir", garnish: "" });
  };

  const handlePhoto = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // Show preview
      const reader = new FileReader();
      reader.onload = (ev) => setScanPreview(ev.target.result);
      reader.readAsDataURL(file);

      setScanning(true);
      setScanProgress(0);

      try {
        const result = await Tesseract.recognize(file, 'eng', {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              setScanProgress(Math.round(m.progress * 100));
            }
          }
        });

        const extractedText = result.data.text;
        setRawText(extractedText);
        setScanning(false);
        setScanProgress(100);

        // User reviews and edits extracted text before clicking Parse
      } catch (err) {
        console.error("OCR failed:", err);
        setScanning(false);
        setScanPreview(null);
        alert("Couldn't read the image. Try a clearer photo or type the recipe manually.");
      }
    };
    input.click();
  };

  const handleSave = () => {
    if (!parsed || !parsed.name) return;
    const finalSpirit = parsed.spirit === "other" && customSpiritText.trim() ? customSpiritText.trim().toLowerCase() : parsed.spirit;
    if (parsed.spirit === "other" && customSpiritText.trim()) addCustomSpirit(customSpiritText.trim());
    const cocktail = {
      id: generateId(), name: parsed.name, style: parsed.style, spirit: finalSpirit, era: "modern", history: "", tags: [], isCustom: true,
      variations: [{
        name: "Imported Recipe", canon: true, isCustom: true, spec: parsed.spec,
        ingredients: parsed.spec.map(s => { const p = parseSpecLine(s); return p ? p.ingredient.toLowerCase().replace(/\s+/g, "-") : s.toLowerCase().replace(/\s+/g, "-"); }),
        glass: parsed.glass, method: parsed.method, garnish: parsed.garnish, steps: parsed.steps, ratioNotes: "", brandRecs: ""
      }]
    };
    onSave(cocktail);
  };

  return (
    <div className="modal active" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content">
        <div className="modal-header">
          <span>{"\u{1F4CB}"} Import Recipe</span>
          <button className="modal-close" onClick={onClose}>{"\u2715"}</button>
        </div>
        <div className="modal-body">
          {!parsed ? (
            <>
              {scanning && (
                <div style={{ marginBottom: "16px" }}>
                  {scanPreview && (
                    <img src={scanPreview} alt="Scanning..." style={{ width: "100%", maxHeight: "200px", objectFit: "cover", borderRadius: "var(--radius-sm)", marginBottom: "10px", opacity: 0.7 }} />
                  )}
                  <div style={{ background: "var(--bg-surface)", borderRadius: "var(--radius-sm)", padding: "16px", textAlign: "center" }}>
                    <div style={{ fontSize: "14px", color: "var(--accent-gold)", marginBottom: "8px", fontWeight: 600 }}>
                      {scanProgress < 100 ? "\u{1F50D} Reading recipe..." : "\u2705 Done!"}
                    </div>
                    <div style={{ background: "var(--border)", borderRadius: "10px", height: "8px", overflow: "hidden" }}>
                      <div style={{
                        background: "var(--accent-gold)",
                        height: "100%",
                        width: scanProgress + "%",
                        borderRadius: "10px",
                        transition: "width 0.3s ease"
                      }} />
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--text-dim)", marginTop: "6px" }}>{scanProgress}%</div>
                  </div>
                </div>
              )}

              {scanPreview && !scanning && (
                <div style={{ marginBottom: "12px" }}>
                  <img src={scanPreview} alt="Recipe photo" style={{ width: "100%", maxHeight: "150px", objectFit: "cover", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)" }} />
                  <div style={{ fontSize: "11px", color: "var(--success)", marginTop: "4px" }}>{"\u2705"} Text extracted — review and edit below, then hit Parse Recipe</div>
                </div>
              )}

              {!scanning && (
                <div style={{ textAlign: "center", padding: scanPreview ? "0" : "20px 0 12px", marginBottom: "12px" }}>
                  {!scanPreview && (
                    <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "16px" }}>
                      Take a photo of a cocktail menu or recipe, or paste the text below.
                    </div>
                  )}
                  <button className="btn btn-outline" onClick={handlePhoto} style={{ marginBottom: scanPreview ? "0" : "12px" }}>
                    {scanPreview ? "\u{1F4F7} Retake Photo" : "\u{1F4F7} Scan a Recipe Photo"}
                  </button>
                </div>
              )}

              <textarea className="import-textarea" value={rawText} onChange={e => setRawText(e.target.value)} placeholder={"Paste recipe text here...\n\nHandy Panky\n1.5 oz gin\n1.5 oz sweet vermouth\n2 dashes Fernet-Branca\n\nStir with ice, strain into coupe.\nGarnish with orange peel."} />
              <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => parseRecipe()} disabled={!rawText.trim() || scanning}>Parse Recipe</button>
                <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
              </div>
            </>
          ) : (
            <>
              <div className="form-section">
                <label>Name</label>
                <input type="text" value={parsed.name} onChange={e => setParsed({ ...parsed, name: e.target.value })} />
              </div>
              <div className="form-section">
                <label>Ingredients ({parsed.spec.length} found)</label>
                {parsed.spec.map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "4px 0" }}>
                    <span style={{ fontSize: "13px", color: "var(--text-primary)", flex: 1 }}>{"\u2022"} {s}</span>
                    <button
                      style={{ background: "none", border: "none", color: "var(--error)", fontSize: "14px", cursor: "pointer", padding: "2px 6px" }}
                      onClick={() => setParsed({ ...parsed, spec: parsed.spec.filter((_, idx) => idx !== i) })}
                    >{"\u2715"}</button>
                  </div>
                ))}
                <div style={{ display: "flex", gap: "6px", marginTop: "6px" }}>
                  <input
                    type="text"
                    id="add-ingredient-input"
                    placeholder="Add ingredient (e.g. 1 oz lime juice)"
                    style={{ flex: 1, padding: "6px 10px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--bg-dark)", color: "var(--text-primary)", fontSize: "12px", fontFamily: "inherit" }}
                    onKeyDown={e => {
                      if (e.key === "Enter" && e.target.value.trim()) {
                        setParsed({ ...parsed, spec: [...parsed.spec, e.target.value.trim()] });
                        e.target.value = "";
                      }
                    }}
                  />
                  <button className="btn btn-small btn-outline" onClick={() => {
                    const inp = document.getElementById("add-ingredient-input");
                    if (inp && inp.value.trim()) {
                      setParsed({ ...parsed, spec: [...parsed.spec, inp.value.trim()] });
                      inp.value = "";
                    }
                  }}>+</button>
                </div>
              </div>
              {parsed.steps && (
                <div className="form-section">
                  <label>Steps</label>
                  <textarea
                    value={parsed.steps}
                    onChange={e => setParsed({ ...parsed, steps: e.target.value })}
                    style={{ width: "100%", minHeight: "80px", padding: "10px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--bg-dark)", color: "var(--text-primary)", fontSize: "13px", fontFamily: "inherit", resize: "vertical" }}
                  />
                </div>
              )}
              <div className="form-section">
                <label>Garnish</label>
                <input type="text" value={parsed.garnish} onChange={e => setParsed({ ...parsed, garnish: e.target.value })} placeholder="e.g. Orange twist, lime wheel..." />
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <div className="form-section" style={{ flex: 1 }}>
                  <label>Spirit</label>
                  <select value={parsed.spirit} onChange={e => { setParsed({ ...parsed, spirit: e.target.value }); if (e.target.value !== "other") setCustomSpiritText(""); }}>
                    {getAllSpirits().map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                  </select>
                  {parsed.spirit === "other" && <input type="text" value={customSpiritText} onChange={e => setCustomSpiritText(e.target.value)} placeholder="e.g. Pisco, Absinthe..." style={{ marginTop: "6px" }} />}
                </div>
                <div className="form-section" style={{ flex: 1 }}>
                  <label>Style</label>
                  <select value={parsed.style} onChange={e => setParsed({ ...parsed, style: e.target.value })}>
                    {Object.entries(STYLE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <div className="form-section" style={{ flex: 1 }}>
                  <label>Glass</label>
                  <select value={parsed.glass} onChange={e => setParsed({ ...parsed, glass: e.target.value })}>
                    {["rocks", "coupe", "highball", "flute", "martini", "copper mug", "tiki", "hurricane", "wine"].map(g => (
                      <option key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div className="form-section" style={{ flex: 1 }}>
                  <label>Method</label>
                  <select value={parsed.method} onChange={e => setParsed({ ...parsed, method: e.target.value })}>
                    {["Stir", "Shake", "Build", "Muddle", "Blend", "Layer"].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSave}>Import Cocktail</button>
                <button className="btn btn-secondary" onClick={() => { setParsed(null); setScanPreview(null); }}>Back</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
