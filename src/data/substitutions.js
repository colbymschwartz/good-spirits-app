// Ingredient Substitution Map
// Each key is an ingredient ID used in recipes.
// Values are arrays of substitutes, ordered by closest match first.
// Each substitute has: id (matching ingredient IDs or custom), name (display),
// and notes explaining the trade-off.
//
// Only covers modifiers, liqueurs, vermouths, bitters, syrups — not base spirits.
// The philosophy: suggest swaps that preserve the cocktail's character,
// not just "anything sweet."

export const SUBSTITUTIONS = {
  // === VERMOUTHS & FORTIFIED WINES ===
  "sweet-vermouth": [
    { id: "sweet-vermouth-alt", name: "Punt e Mes", notes: "More bitter, more complex — dial back by 1/4 oz" },
    { id: "sweet-vermouth-alt2", name: "Cocchi Vermouth di Torino", notes: "Richer, more vanilla — gold standard swap" },
    { id: "sweet-vermouth-alt3", name: "Carpano Antica Formula", notes: "Bolder and more intense — use same amount" },
  ],
  "dry-vermouth": [
    { id: "blanc-vermouth", name: "Blanc/Bianco Vermouth", notes: "Slightly sweeter — works well in Martinis if you like them softer" },
    { id: "lillet-blanc", name: "Lillet Blanc", notes: "Fruitier and lighter — great in a Vesper-style swap" },
    { id: "dry-vermouth-alt", name: "Noilly Prat Extra Dry", notes: "The French benchmark — herbal and crisp" },
  ],
  "blanc-vermouth": [
    { id: "dry-vermouth", name: "Dry Vermouth", notes: "Drier and more herbal — classic alternative" },
    { id: "lillet-blanc", name: "Lillet Blanc", notes: "Lighter and more citrusy" },
    { id: "bianco-vermouth", name: "Bianco Vermouth", notes: "Same category, different brand expression" },
  ],
  "bianco-vermouth": [
    { id: "blanc-vermouth", name: "Blanc Vermouth (Dolin)", notes: "Essentially the same style" },
    { id: "lillet-blanc", name: "Lillet Blanc", notes: "Lighter, more citrus-forward" },
  ],
  "lillet-blanc": [
    { id: "blanc-vermouth", name: "Blanc Vermouth", notes: "A bit more herbal, less fruity" },
    { id: "cocchi-americano", name: "Cocchi Americano", notes: "The historically accurate Corpse Reviver #2 sub — slightly more bitter" },
  ],

  // === AMARI & BITTER LIQUEURS ===
  "campari": [
    { id: "campari-alt", name: "Bruto Americano", notes: "Less artificial color, similar bitter profile — excellent 1:1 swap" },
    { id: "campari-alt2", name: "Cappelletti Aperitivo", notes: "Wine-based, lighter body — slightly less bitter" },
    { id: "campari-alt3", name: "Contratto Bitter", notes: "Italian craft alternative — a touch more complex" },
    { id: "aperol", name: "Aperol", notes: "Much less bitter, sweeter — makes a gentler drink" },
  ],
  "aperol": [
    { id: "aperol-alt", name: "Select Aperitivo", notes: "The Venetian original — slightly more bitter than Aperol" },
    { id: "campari", name: "Campari (half amount)", notes: "Much more bitter — use half and add 1/4 oz simple syrup" },
    { id: "aperol-alt2", name: "Cappelletti Aperitivo", notes: "Splits the difference between Aperol and Campari" },
  ],
  "fernet-branca": [
    { id: "fernet-alt", name: "Fernet-Vallet", notes: "Mexican fernet — mintier and slightly sweeter" },
    { id: "fernet-alt2", name: "Branca Menta", notes: "Same family, more mint-forward" },
  ],
  "amaro-nonino": [
    { id: "amaro-nonino-alt", name: "Amaro Montenegro", notes: "Lighter and more floral — close enough for most recipes" },
    { id: "amaro-nonino-alt2", name: "Amaro dell'Etna", notes: "Citrusy Sicilian amaro — similar sweetness level" },
    { id: "amaro-nonino-alt3", name: "Cardamaro", notes: "Wine-based, more herbal — different but interesting" },
  ],
  "benedictine": [
    { id: "benedictine-alt", name: "Yellow Chartreuse", notes: "Herbal and sweet but different flavor profile — worth trying" },
    { id: "benedictine-alt2", name: "Strega", notes: "Italian herbal liqueur — saffron-forward" },
  ],

  // === CHARTREUSE ===
  "green-chartreuse": [
    { id: "green-chartreuse-alt", name: "Genépy", notes: "Lighter and less complex but same alpine herbal DNA" },
    { id: "yellow-chartreuse", name: "Yellow Chartreuse", notes: "Same family, sweeter and milder — use a touch more" },
    { id: "green-chartreuse-alt2", name: "Dolin Génépy des Alpes", notes: "Affordable alpine herbal — won't be identical but respectable" },
  ],
  "yellow-chartreuse": [
    { id: "green-chartreuse", name: "Green Chartreuse (3/4 amount)", notes: "Stronger and more herbal — use less" },
    { id: "benedictine", name: "Bénédictine", notes: "Herbal and sweet — different but fills the same role" },
    { id: "yellow-chartreuse-alt", name: "Strega", notes: "Italian herbal — saffron notes instead of alpine" },
  ],

  // === ORANGE LIQUEURS ===
  "triple-sec": [
    { id: "cointreau", name: "Cointreau", notes: "Premium triple sec — cleaner and more balanced" },
    { id: "curacao", name: "Dry Curaçao (Pierre Ferrand)", notes: "More complex, brandy-based — the bartender's choice" },
    { id: "grand-marnier", name: "Grand Marnier", notes: "Richer and cognac-based — makes the drink heavier" },
  ],
  "cointreau": [
    { id: "triple-sec", name: "Quality Triple Sec", notes: "More straightforward orange — works fine" },
    { id: "curacao", name: "Dry Curaçao (Pierre Ferrand)", notes: "Bartender favorite — more depth" },
    { id: "grand-marnier", name: "Grand Marnier", notes: "Richer body from the cognac base" },
  ],
  "curacao": [
    { id: "cointreau", name: "Cointreau", notes: "Cleaner and brighter — most common swap" },
    { id: "triple-sec", name: "Triple Sec", notes: "Simpler but gets the job done" },
    { id: "grand-marnier", name: "Grand Marnier", notes: "Heavier but similar orange character" },
  ],
  "grand-marnier": [
    { id: "cointreau", name: "Cointreau", notes: "Lighter and crisper — the drink will be less rich" },
    { id: "curacao", name: "Dry Curaçao", notes: "Better complexity than plain triple sec" },
  ],

  // === CHERRY & BERRY LIQUEURS ===
  "maraschino-liqueur": [
    { id: "maraschino-alt", name: "Luxardo Maraschino", notes: "The standard — funky, dry cherry. If you see this, you probably already have it" },
    { id: "maraschino-alt2", name: "Maraska Maraschino", notes: "Croatian original — slightly drier" },
    { id: "cherry-heering", name: "Cherry Heering (half amount)", notes: "Much sweeter and darker — reduce amount and cut simple syrup" },
  ],
  "chambord": [
    { id: "chambord-alt", name: "Crème de Framboise", notes: "Any raspberry liqueur works here — Chambord just has more complexity" },
    { id: "creme-de-cassis", name: "Crème de Cassis", notes: "Blackcurrant instead of raspberry — darker fruit profile" },
  ],
  "creme-de-cassis": [
    { id: "chambord", name: "Chambord", notes: "Raspberry instead of blackcurrant — brighter" },
    { id: "creme-de-cassis-alt", name: "Crème de Mûre (blackberry)", notes: "Similar dark fruit character" },
  ],

  // === CREAM & NUT LIQUEURS ===
  "kahlua": [
    { id: "coffee-liqueur", name: "Mr Black Coffee Liqueur", notes: "Less sweet, more coffee-forward — arguably better" },
    { id: "kahlua-alt", name: "Any coffee liqueur", notes: "They all work — Mr Black, Patrón XO Cafe, or even DIY" },
  ],
  "coffee-liqueur": [
    { id: "kahlua", name: "Kahlúa", notes: "The classic — sweeter than craft alternatives" },
  ],
  "amaretto": [
    { id: "amaretto-alt", name: "Disaronno", notes: "The standard — if you see amaretto, this is what they mean" },
    { id: "amaretto-alt2", name: "Lazzaroni Amaretto", notes: "Slightly drier — nice upgrade" },
    { id: "orgeat", name: "Orgeat (different but related)", notes: "Almond syrup, non-alcoholic — different texture but similar flavor note" },
  ],
  "creme-de-menthe": [
    { id: "creme-de-menthe-alt", name: "Tempus Fugit Crème de Menthe", notes: "Craft version — more natural mint flavor" },
    { id: "fernet-branca", name: "Fernet-Branca (tiny amount)", notes: "Has menthol notes but much more bitter — only in a pinch" },
  ],
  "creme-de-cacao": [
    { id: "creme-de-cacao-alt", name: "Tempus Fugit Crème de Cacao", notes: "Craft version — deeper chocolate" },
    { id: "creme-de-cacao-alt2", name: "Mozart Dark Chocolate Liqueur", notes: "Richer and more dessert-like" },
  ],
  "st-germain": [
    { id: "st-germain-alt", name: "Any elderflower liqueur", notes: "Several brands now — all work similarly" },
    { id: "st-germain-alt2", name: "Elderflower cordial + vodka", notes: "DIY option — 1 oz cordial + 1/2 oz vodka replaces 1 oz St-Germain" },
  ],

  // === BITTERS ===
  "angostura-bitters": [
    { id: "angostura-alt", name: "Peychaud's Bitters", notes: "Lighter, more anise/floral — different character but works" },
    { id: "angostura-alt2", name: "Any aromatic bitters", notes: "Fee Brothers Old Fashion, Bittermens, etc. — all serviceable" },
  ],
  "peychauds-bitters": [
    { id: "peychauds-alt", name: "Angostura Bitters", notes: "Heavier and more cinnamon-forward — different but usable" },
    { id: "peychauds-alt2", name: "Bitter Truth Creole Bitters", notes: "Closest match to Peychaud's profile" },
  ],
  "orange-bitters": [
    { id: "orange-bitters-alt", name: "Regans' Orange Bitters No. 6", notes: "The bartender standard" },
    { id: "orange-bitters-alt2", name: "Fee Brothers West Indian Orange", notes: "More orange-forward, less spice" },
    { id: "orange-bitters-alt3", name: "Angostura Orange", notes: "More complex, less purely orange" },
  ],

  // === SYRUPS & SWEETENERS ===
  "simple-syrup": [
    { id: "rich-simple-syrup", name: "Rich Simple Syrup (2:1)", notes: "Use 3/4 the amount — thicker, less dilution" },
    { id: "demerara-syrup", name: "Demerara Syrup", notes: "Adds caramel depth — great in whiskey drinks" },
    { id: "agave-syrup", name: "Agave Nectar", notes: "Use 3/4 amount — pairs naturally with tequila/mezcal" },
    { id: "honey-syrup", name: "Honey Syrup", notes: "Adds floral complexity — thin with water 1:1 first" },
    { id: "maple-syrup", name: "Maple Syrup", notes: "Use 1/2 amount — very strong flavor, best in whiskey drinks" },
  ],
  "rich-simple-syrup": [
    { id: "simple-syrup", name: "Simple Syrup (1:1)", notes: "Use 1.5x the amount to compensate for lower concentration" },
    { id: "demerara-syrup", name: "Demerara Syrup", notes: "Same richness, more caramel notes" },
  ],
  "demerara-syrup": [
    { id: "rich-simple-syrup", name: "Rich Simple Syrup", notes: "Same thickness, less caramel character" },
    { id: "simple-syrup", name: "Simple Syrup", notes: "Lighter — use a bit more" },
  ],
  "honey-syrup": [
    { id: "simple-syrup", name: "Simple Syrup", notes: "Loses the floral honey notes but works structurally" },
    { id: "agave-syrup", name: "Agave Nectar", notes: "Similar viscosity, different flavor" },
  ],
  "agave-syrup": [
    { id: "simple-syrup", name: "Simple Syrup", notes: "More neutral — fine in most recipes" },
    { id: "honey-syrup", name: "Honey Syrup", notes: "Different flavor but similar body" },
  ],
  "maple-syrup": [
    { id: "demerara-syrup", name: "Demerara Syrup", notes: "Closest in richness — less distinctive flavor" },
    { id: "rich-simple-syrup", name: "Rich Simple Syrup", notes: "Neutral substitute — loses the maple character" },
  ],
  "grenadine": [
    { id: "grenadine-alt", name: "Homemade Grenadine", notes: "Pomegranate juice + sugar 1:1 — vastly better than store-bought" },
    { id: "raspberry-syrup", name: "Raspberry Syrup", notes: "Different fruit but similar sweet-tart role" },
    { id: "creme-de-cassis", name: "Crème de Cassis (half amount)", notes: "Alcoholic — darker fruit, use less" },
  ],
  "orgeat": [
    { id: "orgeat-alt", name: "Small Hand Foods Orgeat", notes: "Craft version — much better than generic" },
    { id: "amaretto", name: "Amaretto (half amount)", notes: "Alcoholic almond — use half since it's boozy and sweet" },
    { id: "orgeat-alt2", name: "Almond milk + simple syrup", notes: "DIY option — 1/2 oz each to replace 3/4 oz orgeat" },
  ],
  "falernum": [
    { id: "falernum-alt", name: "John D. Taylor's Velvet Falernum", notes: "The standard — lime, almond, clove, ginger" },
    { id: "falernum-alt2", name: "Orgeat + lime + allspice dram", notes: "DIY approximation — 1/2 oz orgeat + squeeze of lime + dash allspice" },
  ],
  "passion-fruit-syrup": [
    { id: "passion-fruit-syrup-alt", name: "Liber & Co Passion Fruit", notes: "Excellent craft option" },
    { id: "passion-fruit-syrup-alt2", name: "Funkin Passion Fruit Purée + simple syrup", notes: "Mix 1:1 — good substitute" },
  ],

  // === MISC LIQUEURS ===
  "absinthe": [
    { id: "absinthe-alt", name: "Pernod", notes: "Anise-forward — the classic substitute, less complex" },
    { id: "absinthe-alt2", name: "Herbsaint", notes: "New Orleans standard — slightly less intense" },
    { id: "absinthe-alt3", name: "Pastis", notes: "Sweeter and more licorice — use a touch less" },
  ],
  "drambuie": [
    { id: "drambuie-alt", name: "Bénédictine + honey syrup", notes: "Not identical but hits similar herbal-honey notes" },
  ],
  "galliano": [
    { id: "galliano-alt", name: "Strega", notes: "Italian herbal — similar vanilla/anise profile" },
    { id: "yellow-chartreuse", name: "Yellow Chartreuse", notes: "More herbal, less vanilla — different but interesting" },
  ],
  "suze": [
    { id: "salers", name: "Salers Gentiane", notes: "Same gentian family — slightly more bitter and drier" },
    { id: "suze-alt", name: "Avèze", notes: "Another gentian liqueur — earthier" },
  ],
  "salers": [
    { id: "suze", name: "Suze", notes: "More floral and refined — the most common gentian" },
  ],
};

// Build a reverse lookup: given an ingredient in your bar,
// what recipe ingredients can it substitute for?
// e.g., if you have "aperol" in your bar, it can sub for "campari"
export function buildReverseSubs() {
  const reverse = {};
  for (const [recipeIng, subs] of Object.entries(SUBSTITUTIONS)) {
    for (const sub of subs) {
      // Only map subs whose IDs match real ingredient IDs (not alt suffixed ones)
      if (!sub.id.includes('-alt') && !sub.id.includes('-alt2') && !sub.id.includes('-alt3')) {
        if (!reverse[sub.id]) reverse[sub.id] = [];
        reverse[sub.id].push(recipeIng);
      }
    }
  }
  return reverse;
}

// Get display-friendly name for an ingredient ID
export function subIngredientName(id) {
  return id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}
