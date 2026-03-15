export function parseSpecLine(line) {
  const match = line.match(/^([\d\/\.]+(?:\s*-\s*[\d\/\.]+)?)\s*(oz|dash|dashes|barspoon|barspoons|drop|drops|slice|slices|sprig|sprigs|cube|cubes|whole|piece|pieces|pinch|pinches|wedge|wedges|wheel|wheels)\s+(.+)$/i);
  if (!match) return null;
  let amount = match[1];
  const unit = match[2].toLowerCase();
  const ingredient = match[3];
  let numericAmount = 0;
  if (amount.includes("/")) {
    const parts = amount.split("/");
    numericAmount = parseFloat(parts[0]) / parseFloat(parts[1]);
  } else if (amount.includes("-")) {
    const parts = amount.split("-").map(s => s.trim());
    numericAmount = (parseFloat(parts[0]) + parseFloat(parts[1])) / 2;
  } else {
    numericAmount = parseFloat(amount);
  }
  if (isNaN(numericAmount)) return null;
  return { amount: numericAmount, unit, ingredient, original: line };
}
