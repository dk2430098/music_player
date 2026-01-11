/**
 * JioSaavn API Response Types
 */

export interface SearchResult {
  id: string;
  name: string;
  type?: string;
  album?: {
    id: string;
    name: string;
    url?: string;
  };
  year?: string;
  releaseDate?: string | null;
  duration: string | number;
  label?: string;
  primaryArtists: string;
  primaryArtistsId?: string;
  featuredArtists?: string;
  featuredArtistsId?: string;
  explicitContent?: number;
  playCount?: string;
  language?: string;
  hasLyrics?: string | boolean;
  url?: string;
  copyright?: string;
  image?: Array<{
    quality: string;
    url: string;
  }>;
  downloadUrl?: Array<{
    quality: string;
    url: string;
  }>;
}

export interface SongDetail extends SearchResult {
  artists?: {
    primary: Array<{
      id: string;
      name: string;
    }>;
  };
}

export interface SearchResponse {
  success: boolean;
  data: {
    results: SearchResult[];
    total: number;
    start: number;
  };
}

export interface SongResponse {
  success: boolean;
  data: SongDetail[];
}

/**
 * App State Types
 */

export interface QueueItem {
  id: string;
  name: string;
  artist: string;
  album: string;
  duration: number;
  image: string;
  downloadUrl: string; // 320kbps quality
  url?: string;
}

export interface PlayerState {
  currentTrack: QueueItem | null;
  queue: QueueItem[];
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  shuffle: boolean;
  repeat: "off" | "one" | "all";
  volume: number;
}

export interface SearchState {
  query: string;
  results: SearchResult[];
  isLoading: boolean;
  error: string | null;
  page: number;
  total: number;
}
