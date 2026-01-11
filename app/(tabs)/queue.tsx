import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { usePlayerStore } from "@/lib/store/player";
import { MaterialIcons } from "@expo/vector-icons";
import { useColors } from "@/hooks/use-colors";
import type { QueueItem } from "@/lib/types";

export default function QueueScreen() {
  const colors = useColors();
  const {
    queue,
    currentTrack,
    removeFromQueue,
    clearQueue,
    reorderQueue,
    playTrack,
  } = usePlayerStore();

  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const handleRemove = (id: string) => {
    removeFromQueue(id);
  };

  const handleClearQueue = () => {
    Alert.alert(
      "Clear Queue",
      "Are you sure you want to remove all songs from the queue?",
      [
        { text: "Cancel", onPress: () => {} },
        {
          text: "Clear",
          onPress: () => clearQueue(),
          style: "destructive",
        },
      ]
    );
  };

  const handlePlayTrack = (item: QueueItem) => {
    playTrack(item);
  };

  const renderQueueItem = ({
    item,
    index,
  }: {
    item: QueueItem;
    index: number;
  }) => {
    const isCurrentTrack = currentTrack?.id === item.id;
    const duration = Math.floor(item.duration / 60);

    return (
      <Pressable
        onPress={() => handlePlayTrack(item)}
        style={({ pressed }) => [
          {
            opacity: pressed ? 0.7 : 1,
          },
        ]}
      >
        <View
          className={`flex-row items-center gap-3 p-3 border-b border-border ${
            isCurrentTrack ? "bg-primary/10" : ""
          }`}
        >
          {/* Drag Handle */}
          <View className="w-6 items-center">
            <MaterialIcons name="drag-handle" size={20} color={colors.muted} />
          </View>

          {/* Album Art */}
          {item.image && (
            <Image
              source={{ uri: item.image }}
              className="w-10 h-10 rounded-lg bg-surface"
            />
          )}

          {/* Track Info */}
          <View className="flex-1">
            <Text
              className={`text-sm font-semibold ${
                isCurrentTrack ? "text-primary" : "text-foreground"
              }`}
              numberOfLines={1}
            >
              {index + 1}. {item.name}
            </Text>
            <Text className="text-xs text-muted" numberOfLines={1}>
              {item.artist}
            </Text>
          </View>

          {/* Duration */}
          <Text className="text-xs text-muted w-10 text-right">
            {duration}m {item.duration % 60}s
          </Text>

          {/* Remove Button */}
          <Pressable
            onPress={() => handleRemove(item.id)}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.6 : 1,
              },
            ]}
          >
            <MaterialIcons name="close" size={20} color={colors.error} />
          </Pressable>
        </View>
      </Pressable>
    );
  };

  return (
    <ScreenContainer className="flex-1 p-0">
      <View className="flex-1">
        {/* Header */}
        <View className="p-4 border-b border-border flex-row items-center justify-between">
          <View>
            <Text className="text-lg font-semibold text-foreground">Queue</Text>
            <Text className="text-xs text-muted">{queue.length} songs</Text>
          </View>
          {queue.length > 0 && (
            <Pressable
              onPress={handleClearQueue}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.6 : 1,
                },
              ]}
            >
              <MaterialIcons name="delete-outline" size={24} color={colors.error} />
            </Pressable>
          )}
        </View>

        {/* Queue List */}
        {queue.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <MaterialIcons name="queue-music" size={48} color={colors.muted} />
            <Text className="text-muted mt-4">Queue is empty</Text>
            <Text className="text-xs text-muted mt-2">
              Search and play songs to add them to the queue
            </Text>
          </View>
        ) : (
          <FlatList
            data={queue}
            renderItem={renderQueueItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={true}
          />
        )}
      </View>
    </ScreenContainer>
  );
}
