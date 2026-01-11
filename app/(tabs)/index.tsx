import { useState, useEffect, useCallback } from "react";
import {
  ScrollView,
  Text,
  View,
  TextInput,
  FlatList,
  Pressable,
  ActivityIndicator,
  Image,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useSearchStore } from "@/lib/store/search";
import { usePlayerStore } from "@/lib/store/player";
import { searchSongs, getAlbumArt, getDownloadUrl } from "@/lib/api/jiosaavn";
import type { SearchResult, QueueItem } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function HomeScreen() {
  const [localQuery, setLocalQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const {
    query,
    results,
    isLoading,
    error,
    page,
    total,
    setQuery,
    setResults,
    setLoading,
    setError,
    setPage,
    setTotal,
    appendResults,
  } = useSearchStore();

  const { addToQueue, playTrack } = usePlayerStore();

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localQuery.trim() && localQuery !== query) {
        performSearch(localQuery);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localQuery]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setQuery(searchQuery);
      setPage(1);

      const { results: songs, total } = await searchSongs(searchQuery, 1);
      setResults(songs);
      setTotal(total);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to search songs"
      );
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (isLoading || results.length >= total || !query) return;

    try {
      setLoading(true);
      const nextPage = page + 1;
      const { results: songs } = await searchSongs(query, nextPage);
      appendResults(songs);
      setPage(nextPage);
    } catch (err) {
      console.error("Failed to load more results:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaySong = useCallback(
    (song: SearchResult) => {
      const queueItem: QueueItem = {
        id: song.id,
        name: song.name,
        artist: song.primaryArtists || "Unknown Artist",
        album: song.album?.name || "Unknown Album",
        duration: parseInt(song.duration as string, 10) || 0,
        image: getAlbumArt(song, "500x500"),
        downloadUrl: getDownloadUrl(song, "320kbps"),
        url: song.url,
      };

      playTrack(queueItem);
    },
    [playTrack]
  );

  const renderSongItem = ({ item }: { item: SearchResult }) => {
    const albumArt = getAlbumArt(item, "150x150");
    const duration = Math.floor(parseInt(item.duration as string, 10) / 60);

    return (
      <Pressable
        onPress={() => handlePlaySong(item)}
        style={({ pressed }) => [
          {
            opacity: pressed ? 0.7 : 1,
          },
        ]}
      >
        <View className="flex-row items-center gap-3 p-3 border-b border-border">
          {albumArt && (
            <Image
              source={{ uri: albumArt }}
              className="w-12 h-12 rounded-lg bg-surface"
            />
          )}
          <View className="flex-1">
            <Text className="text-sm font-semibold text-foreground" numberOfLines={1}>
              {item.name}
            </Text>
            <Text className="text-xs text-muted" numberOfLines={1}>
              {item.primaryArtists}
            </Text>
            <Text className="text-xs text-muted mt-1">
              {duration}m {parseInt(item.duration as string, 10) % 60}s
            </Text>
          </View>
          <Text className="text-xs text-muted">
            {item.playCount ? `${Math.floor(parseInt(item.playCount) / 1000000)}M` : ""}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <ScreenContainer className="flex-1 p-0">
      <View className="flex-1">
        {/* Search Bar */}
        <View className="p-4 border-b border-border">
          <TextInput
            placeholder="Search songs, artists..."
            placeholderTextColor="#9BA1A6"
            value={localQuery}
            onChangeText={setLocalQuery}
            className="bg-surface text-foreground px-4 py-3 rounded-lg"
          />
        </View>

        {/* Results */}
        {isLoading && results.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#0a7ea4" />
            <Text className="text-muted mt-2">Searching...</Text>
          </View>
        ) : error ? (
          <View className="flex-1 items-center justify-center p-4">
            <Text className="text-error text-center">{error}</Text>
          </View>
        ) : results.length === 0 && localQuery ? (
          <View className="flex-1 items-center justify-center p-4">
            <Text className="text-muted text-center">
              No results found for "{localQuery}"
            </Text>
          </View>
        ) : (
          <FlatList
            data={results}
            renderItem={renderSongItem}
            keyExtractor={(item) => item.id}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              isLoading && results.length > 0 ? (
                <View className="py-4 items-center">
                  <ActivityIndicator size="small" color="#0a7ea4" />
                </View>
              ) : null
            }
          />
        )}
      </View>
    </ScreenContainer>
  );
}
