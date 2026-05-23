export const SEARCH_STORAGE_KEY = "inai_search_pending";

export interface SearchFilters {
  displayId?: string;
  country?: string;
  minAge?: number;
  maxAge?: number;
  religion?: string;
  maritalStatus?: string;
}
