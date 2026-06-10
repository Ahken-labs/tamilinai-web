// For typeable dropdowns: if query is already an exact match, show all so the list doesn't collapse.
export function filterItems(items: string[], query: string): string[] {
  if (!query || items.includes(query)) return items;
  return items.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase())
  );
}

// For search inputs: always filter regardless of exact match.
// Items starting with the query appear before items that just contain it.
export function filterSearch(items: string[], query: string): string[] {
  if (!query) return items;
  const q = query.toLowerCase();
  const starts: string[] = [];
  const contains: string[] = [];
  for (const item of items) {
    const lower = item.toLowerCase();
    if (lower.startsWith(q)) starts.push(item);
    else if (lower.includes(q)) contains.push(item);
  }
  return [...starts, ...contains];
}
