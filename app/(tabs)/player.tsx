import { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  ScrollView,
} from "react-native";
import Slider from "@react-native-community/slider";
import { ScreenContainer } from "@/components/screen-container";
import { usePlayerStore } from "@/lib/store/player";
import { MaterialIcons } from "@expo/vector-icons";
import { useColors } from "@/hooks/use-colors";
import { useRouter } from "expo-router";

export default function PlayerScreen() {
  const colors = useColors();
  const router = useRouter();
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    shuffle,
    repeat,
    play,
    pause,
    setCurrentTime,
    playNext,
    playPrevious,
    toggleShuffle,
    cycleRepeat,
  } = usePlayerStore();

  const [displayTime, setDisplayTime] = useState(currentTime);

  useEffect(() => {
    setDisplayTime(currentTime);
  }, [currentTime]);

  if (!currentTrack) {
    return (
      <ScreenContainer className="flex-1 items-center justify-center">
        <Text className="text-muted">No track selected</Text>
      </ScreenContainer>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSeek = (value: number) => {
    setDisplayTime(value);
    setCurrentTime(value);
  };

  return (
    <ScreenContainer className="flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 justify-between py-6">
          {/* Header */}
          <View className="flex-row items-center justify-between px-4 mb-6">
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
            >
              <MaterialIcons name="expand-more" size={28} color={colors.foreground} />
            </Pressable>
            <Text className="text-lg font-semibold text-foreground">Now Playing</Text>
            <Pressable
              onPress={() => router.push("/(tabs)")}
              style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
            >
              <MaterialIcons name="queue-music" size={28} color={colors.foreground} />
            </Pressable>
          </View>

          {/* Album Art */}
          <View className="flex-1 items-center justify-center px-4 mb-8">
            {currentTrack.image && (
              <Image
                source={{ uri: currentTrack.image }}
                className="w-64 h-64 rounded-2xl bg-border"
              />
            )}
          </View>

          {/* Track Info */}
          <View className="px-4 mb-8">
            <Text className="text-2xl font-bold text-foreground mb-2" numberOfLines={2}>
              {currentTrack.name}
            </Text>
            <Text className="text-lg text-muted mb-1">{currentTrack.artist}</Text>
            <Text className="text-sm text-muted">{currentTrack.album}</Text>
          </View>

          {/* Progress Bar */}
          <View className="px-4 mb-6">
            <Slider
              style={{ height: 40 }}
              minimumValue={0}
              maximumValue={duration || 100}
              value={displayTime}
              onValueChange={handleSeek}
              minimumTrackTintColor={colors.primary}
              maximumTrackTintColor={colors.border}
              thumbTintColor={colors.primary}
            />
            <View className="flex-row justify-between">
              <Text className="text-xs text-muted">{formatTime(displayTime)}</Text>
              <Text className="text-xs text-muted">{formatTime(duration)}</Text>
            </View>
          </View>

          {/* Playback Controls */}
          <View className="px-4 mb-8">
            <View className="flex-row items-center justify-between mb-6">
              {/* Shuffle Button */}
              <Pressable
                onPress={toggleShuffle}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.6 : 1,
                  },
                ]}
              >
                <MaterialIcons
                  name="shuffle"
                  size={28}
                  color={shuffle ? colors.primary : colors.muted}
                />
              </Pressable>

              {/* Previous Button */}
              <Pressable
                onPress={playPrevious}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.6 : 1,
                  },
                ]}
              >
                <MaterialIcons name="skip-previous" size={36} color={colors.foreground} />
              </Pressable>

              {/* Play/Pause Button */}
              <Pressable
                onPress={() => (isPlaying ? pause() : play())}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.8 : 1,
                    transform: [{ scale: pressed ? 0.95 : 1 }],
                  },
                ]}
              >
                <View className="w-16 h-16 rounded-full bg-primary items-center justify-center">
                  <MaterialIcons
                    name={isPlaying ? "pause" : "play-arrow"}
                    size={40}
                    color="white"
                  />
                </View>
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
                <MaterialIcons name="skip-next" size={36} color={colors.foreground} />
              </Pressable>

              {/* Repeat Button */}
              <Pressable
                onPress={cycleRepeat}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.6 : 1,
                  },
                ]}
              >
                <View>
                  <MaterialIcons
                    name={repeat === "one" ? "repeat-one" : "repeat"}
                    size={28}
                    color={repeat !== "off" ? colors.primary : colors.muted}
                  />
                </View>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
