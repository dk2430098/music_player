import axios from "axios";
import type { SearchResponse, SongResponse, SearchResult } from "@/lib/types";

const API_BASE_URL = "https://saavn.sumit.co";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

/**
 * Search for songs
 */
export async function searchSongs(
  query: string,
  page: number = 1
): Promise<{ results: SearchResult[]; total: number }> {
  try {
    const response = await apiClient.get<SearchResponse>("/api/search/songs", {
      params: {
        query,
        page,
        limit: 20,
      },
    });

    if (response.data.success) {
      return {
        results: response.data.data.results,
        total: response.data.data.total,
      };
    }

    throw new Error("Search failed");
  } catch (error) {
    console.error("Search error:", error);
    throw error;
  }
}

/**
 * Search for albums
 */
export async function searchAlbums(
  query: string,
  page: number = 1
): Promise<{ results: SearchResult[]; total: number }> {
  try {
    const response = await apiClient.get<SearchResponse>("/api/search/albums", {
      params: {
        query,
        page,
        limit: 20,
      },
    });

    if (response.data.success) {
      return {
        results: response.data.data.results,
        total: response.data.data.total,
      };
    }

    throw new Error("Search failed");
  } catch (error) {
    console.error("Album search error:", error);
    throw error;
  }
}

/**
 * Search for artists
 */
export async function searchArtists(
  query: string,
  page: number = 1
): Promise<{ results: SearchResult[]; total: number }> {
  try {
    const response = await apiClient.get<SearchResponse>("/api/search/artists", {
      params: {
        query,
        page,
        limit: 20,
      },
    });

    if (response.data.success) {
      return {
        results: response.data.data.results,
        total: response.data.data.total,
      };
    }

    throw new Error("Search failed");
  } catch (error) {
    console.error("Artist search error:", error);
    throw error;
  }
}

/**
 * Get song details by ID
 */
export async function getSongDetails(id: string): Promise<SearchResult> {
  try {
    const response = await apiClient.get<SongResponse>(`/api/songs/${id}`);

    if (response.data.success && response.data.data.length > 0) {
      return response.data.data[0];
    }

    throw new Error("Song not found");
  } catch (error) {
    console.error("Get song details error:", error);
    throw error;
  }
}

/**
 * Get song suggestions
 */
export async function getSongSuggestions(id: string): Promise<SearchResult[]> {
  try {
    const response = await apiClient.get<SongResponse>(
      `/api/songs/${id}/suggestions`
    );

    if (response.data.success) {
      return response.data.data;
    }

    return [];
  } catch (error) {
    console.error("Get suggestions error:", error);
    return [];
  }
}

/**
 * Get artist details
 */
export async function getArtistDetails(id: string): Promise<SearchResult> {
  try {
    const response = await apiClient.get<any>(`/api/artists/${id}`);
    return response.data;
  } catch (error) {
    console.error("Get artist details error:", error);
    throw error;
  }
}

/**
 * Get artist songs
 */
export async function getArtistSongs(
  id: string,
  page: number = 1
): Promise<SearchResult[]> {
  try {
    const response = await apiClient.get<any>(`/api/artists/${id}/songs`, {
      params: {
        page,
        limit: 20,
      },
    });

    return response.data.data || [];
  } catch (error) {
    console.error("Get artist songs error:", error);
    return [];
  }
}

/**
 * Extract download URL for a specific quality
 */
export function getDownloadUrl(
  song: SearchResult,
  quality: "96kbps" | "160kbps" | "320kbps" = "320kbps"
): string {
  if (!song.downloadUrl || song.downloadUrl.length === 0) {
    return "";
  }

  // Try to find the requested quality
  const urlObj = song.downloadUrl.find((item) => item.quality === quality);
  if (urlObj) {
    return urlObj.url;
  }

  // Fallback to highest available quality
  return song.downloadUrl[song.downloadUrl.length - 1]?.url || "";
}

/**
 * Extract album art URL
 */
export function getAlbumArt(
  song: SearchResult,
  quality: "50x50" | "150x150" | "500x500" = "500x500"
): string {
  if (!song.image || song.image.length === 0) {
    return "";
  }

  const imageObj = song.image.find((item) => item.quality === quality);
  if (imageObj) {
    return imageObj.url;
  }

  // Fallback to largest available
  return song.image[song.image.length - 1]?.url || "";
}
