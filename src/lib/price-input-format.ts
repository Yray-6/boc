/** Remove thousands separators before sending `price` to the API. */
export function stripPriceSeparators(s: string): string {
  return s.replace(/,/g, "").trim();
}

/**
 * Format price while typing: comma groups on the integer part; optional
 * decimal (first segment only, up to 2 digits).
 */
export function formatPriceInputForDisplay(raw: string): string {
  const normalized = raw.replace(/,/g, "").replace(/[^\d.]/g, "");
  if (!normalized.trim()) return "";

  const parts = normalized.split(".");
  let intPart = (parts[0] ?? "").replace(/\D/g, "");
  let fracPart = (parts[1] ?? "").replace(/\D/g, "").slice(0, 2);
  intPart = intPart.replace(/^0+(?=\d)/, "");
  if (!intPart && fracPart) intPart = "0";

  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const hasDecimal = parts.length > 1;
  if (!hasDecimal) return grouped;

  const endsWithBareDot = normalized.endsWith(".") && fracPart === "";
  if (endsWithBareDot) return `${grouped || "0"}.`;
  if (fracPart.length > 0) return `${grouped || "0"}.${fracPart}`;
  return grouped;
}
