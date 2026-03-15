import { SPIRIT_ICONS, BASE_SPIRITS } from '../data/constants';

// Storage wrapper with prefix
export const storage = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem("good-spirits-" + key);
      return v ? JSON.parse(v) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem("good-spirits-" + key, JSON.stringify(value));
    } catch (e) {
      if (e.name === 'QuotaExceededError' || e.code === 22) {
        console.warn('Good Spirits: localStorage full. Some data may not be saved.');
      }
    }
  }
};

export function generateId() {
  return "custom-" + Date.now().toString(36) + Math.random().toString(36).substr(2, 4);
}

export function getCustomSpirits() {
  return storage.get("customSpirits", []);
}

export function addCustomSpirit(name) {
  if (!name || !name.trim()) return;
  const n = name.trim().toLowerCase();
  if (BASE_SPIRITS.includes(n) || n === "other") return;
  const existing = getCustomSpirits();
  if (!existing.includes(n)) {
    existing.push(n);
    storage.set("customSpirits", existing);
  }
}

export function getAllSpirits() {
  return [...BASE_SPIRITS, ...getCustomSpirits(), "other"];
}

export function spiritLabel(s) {
  return s === "all" ? "All Spirits" : (SPIRIT_ICONS[s] || "\u2728") + " " + s.charAt(0).toUpperCase() + s.slice(1);
}

export async function handleShare(cocktail, variation, photoDataUrl) {
  const text = `${cocktail.name} — ${variation.name}\n\n` +
    variation.spec.join("\n") +
    `\n\nGlass: ${variation.glass || "Any"}\nMethod: ${variation.method || "Stir"}\nGarnish: ${variation.garnish || "None"}` +
    (variation.ratioNotes ? `\n\nRatio Notes: ${variation.ratioNotes}` : "") +
    `\n\nShared from Good Spirits`;
  if (navigator.share) {
    const shareData = { title: cocktail.name + " — " + variation.name, text };
    if (photoDataUrl) {
      try {
        const response = await fetch(photoDataUrl);
        const blob = await response.blob();
        const file = new File([blob], "cocktail.jpg", { type: "image/jpeg" });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          shareData.files = [file];
        }
      } catch {}
    }
    try { await navigator.share(shareData); } catch {}
  } else {
    try {
      await navigator.clipboard.writeText(text);
      alert("Recipe copied to clipboard!");
    } catch {}
  }
}
