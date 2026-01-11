import { View, Text, Pressable, Image } from "react-native";
import { usePlayerStore } from "@/lib/store/player";
import { MaterialIcons } from "@expo/vector-icons";
import { useColors } from "@/hooks/use-colors";

interface MiniPlayerProps {
  onPress?: () => void;
}

export function MiniPlayer({ onPress }: MiniPlayerProps) {
  const colors = useColors();
  const { currentTrack, isPlaying, play, pause, playNext } = usePlayerStore();

  if (!currentTrack) {
    return null;
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <View className="bg-surface border-t border-border px-4 py-3 flex-row items-center gap-3">
        {/* Album Art */}
        {currentTrack.image && (
          <Image
            source={{ uri: currentTrack.image }}
            className="w-12 h-12 rounded-lg bg-border"
          />
        )}

        {/* Track Info */}
        <View className="flex-1">
          <Text className="text-sm font-semibold text-foreground" numberOfLines={1}>
            {currentTrack.name}
          </Text>
          <Text className="text-xs text-muted" numberOfLines={1}>
            {currentTrack.artist}
          </Text>
        </View>

        {/* Play/Pause Button */}
        <Pressable
          onPress={() => (isPlaying ? pause() : play())}
          style={({ pressed }) => [
            {
              opacity: pressed ? 0.6 : 1,
            },
          ]}
        >
          <MaterialIcons
            name={isPlaying ? "pause" : "play-arrow"}
            size={24}
            color={colors.primary}
          />
        </Pressable>

        {/* Next Button */}
        <Pressable
          onPress={playNext}
          style={({ pressed }) => [
            {
              opacity: pressed ? 0.6 : 1,
            },
          ]}
        >
          <MaterialIcons name="skip-next" size={24} color={colors.primary} />
        </Pressable>
      </View>
    </Pressable>
  );
}
