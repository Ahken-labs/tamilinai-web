// For typeable dropdowns: if query is already an exact match, show all so the list doesn't collapse.
export function filterItems(items: string[], query: string): string[] {
  if (!query || items.includes(query)) return items;
  return items.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase())
  );
}

// For search inputs: always filter regardless of exact match.
export function filterSearch(items: string[], query: string): string[] {
  if (!query) return items;
  return items.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase())
  );
}
