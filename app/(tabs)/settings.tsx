import { View, Text, Pressable, ScrollView, Switch } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialIcons } from "@expo/vector-icons";
import { usePlayerStore } from "@/lib/store/player";
import { useState } from "react";

export default function SettingsScreen() {
  const colors = useColors();
  const colorScheme = useColorScheme();
  const { saveQueue } = usePlayerStore();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === "dark");

  const handleToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Theme switching would be handled by the theme provider
  };

  const handleSaveQueue = () => {
    saveQueue();
  };

  return (
    <ScreenContainer className="flex-1 p-0">
      <ScrollView>
        {/* Header */}
        <View className="p-4 border-b border-border">
          <Text className="text-2xl font-bold text-foreground">Settings</Text>
        </View>

        {/* Audio Quality Section */}
        <View className="border-b border-border">
          <View className="p-4">
            <Text className="text-lg font-semibold text-foreground mb-4">
              Audio Quality
            </Text>
            
            {["96kbps", "160kbps", "320kbps"].map((quality) => (
              <Pressable
                key={quality}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <View className="flex-row items-center justify-between py-3 border-b border-border last:border-b-0">
                  <Text className="text-foreground">{quality}</Text>
                  {quality === "320kbps" && (
                    <MaterialIcons name="check" size={20} color={colors.primary} />
                  )}
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Theme Section */}
        <View className="border-b border-border">
          <View className="p-4">
            <Text className="text-lg font-semibold text-foreground mb-4">
              Appearance
            </Text>
            
            <View className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center gap-3">
                <MaterialIcons
                  name={isDarkMode ? "dark-mode" : "light-mode"}
                  size={24}
                  color={colors.primary}
                />
                <Text className="text-foreground">Dark Mode</Text>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={handleToggleDarkMode}
              />
            </View>
          </View>
        </View>

        {/* About Section */}
        <View className="border-b border-border">
          <View className="p-4">
            <Text className="text-lg font-semibold text-foreground mb-4">
              About
            </Text>
            
            <View className="py-3 border-b border-border">
              <Text className="text-xs text-muted mb-1">App Version</Text>
              <Text className="text-foreground">1.0.0</Text>
            </View>

            <View className="py-3">
              <Text className="text-xs text-muted mb-1">Built with</Text>
              <Text className="text-foreground">React Native • Expo • JioSaavn API</Text>
            </View>
          </View>
        </View>

        {/* Data Management Section */}
        <View className="p-4">
          <Text className="text-lg font-semibold text-foreground mb-4">
            Data
          </Text>
          
          <Pressable
            onPress={handleSaveQueue}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <View className="bg-primary/10 p-4 rounded-lg flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <MaterialIcons name="save" size={24} color={colors.primary} />
                <Text className="text-foreground font-semibold">Save Queue</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={colors.muted} />
            </View>
          </Pressable>

          <Text className="text-xs text-muted mt-3">
            Your queue and playback settings are automatically saved to your device.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
