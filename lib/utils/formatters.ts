// Format angka ke format Indonesia
export function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}k`;
  return num.toString();
}

// Format rating ke 1 desimal
export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

// Monochrome color scale for charts
export function getScoreColor(score: number): string {
  if (score >= 4.5) return "#171717"; // Almost black
  if (score >= 3.5) return "#404040";
  if (score >= 2.5) return "#737373";
  return "#a3a3a3"; // Light gray
}

// Monochrome category badges
export function getCategoryColor(category: string): string {
  return "bg-neutral-100 text-neutral-800 border border-neutral-200";
}
