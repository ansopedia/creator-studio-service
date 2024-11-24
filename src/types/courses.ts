export interface Course {
  id: number;
  title: string;
  description: string;
  instructor: string;
  rating: number;
  students: number;
  duration: string;
  price: number;
  level: string;
  category: string;
  image?: string;
}

export interface FilterState {
  categories: string[];
  levels: string[];
  priceRange: [number, number];
  duration: string[];
  searchQuery: string;
  sortBy: string;
  viewMode: "grid" | "list";
}

export type FilterAction =
  | { type: "TOGGLE_CATEGORY"; payload: string }
  | { type: "TOGGLE_LEVEL"; payload: string }
  | { type: "SET_PRICE_RANGE"; payload: [number, number] }
  | { type: "TOGGLE_DURATION"; payload: string }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "SET_SORT_BY"; payload: string }
  | { type: "SET_VIEW_MODE"; payload: "grid" | "list" }
  | { type: "RESET_FILTERS" };
