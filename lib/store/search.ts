import { create } from "zustand";
import type { SearchResult, SearchState } from "@/lib/types";

interface SearchStore extends SearchState {
  setQuery: (query: string) => void;
  setResults: (results: SearchResult[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setPage: (page: number) => void;
  setTotal: (total: number) => void;
  appendResults: (results: SearchResult[]) => void;
  reset: () => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  query: "",
  results: [],
  isLoading: false,
  error: null,
  page: 1,
  total: 0,

  setQuery: (query: string) => set({ query }),
  setResults: (results: SearchResult[]) => set({ results }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setError: (error: string | null) => set({ error }),
  setPage: (page: number) => set({ page }),
  setTotal: (total: number) => set({ total }),
  
  appendResults: (results: SearchResult[]) => {
    set((state) => ({
      results: [...state.results, ...results],
    }));
  },

  reset: () => {
    set({
      query: "",
      results: [],
      isLoading: false,
      error: null,
      page: 1,
      total: 0,
    });
  },
}));
