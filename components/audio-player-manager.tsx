import { useEffect, useRef } from "react";
import { Audio } from "expo-av";
import { usePlayerStore } from "@/lib/store/player";

export function AudioPlayerManager() {
    const currentTrack = usePlayerStore((state) => state.currentTrack);
    const isPlaying = usePlayerStore((state) => state.isPlaying);
    const volume = usePlayerStore((state) => state.volume);
    const setCurrentTime = usePlayerStore((state) => state.setCurrentTime);
    const setDuration = usePlayerStore((state) => state.setDuration);
    const playNext = usePlayerStore((state) => state.playNext);
    const pause = usePlayerStore((state) => state.pause);
    const play = usePlayerStore((state) => state.play);

    const soundRef = useRef<Audio.Sound | null>(null);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (soundRef.current) {
                soundRef.current.unloadAsync();
            }
        };
    }, []);

    // Handle Track Loading
    useEffect(() => {
        const loadSound = async () => {
            try {
                // Unload existing sound
                if (soundRef.current) {
                    await soundRef.current.unloadAsync();
                    soundRef.current = null;
                }

                if (currentTrack?.downloadUrl) {
                    console.log("AudioPlayerManager: Loading sound from URL:", currentTrack.downloadUrl);

                    const { sound, status } = await Audio.Sound.createAsync(
                        { uri: currentTrack.downloadUrl },
                        {
                            shouldPlay: isPlaying,
                            volume: volume,
                        },
                        (status) => {
                            if (status.isLoaded) {
                                setCurrentTime(status.positionMillis / 1000);
                                setDuration(status.durationMillis ? status.durationMillis / 1000 : 0);

                                if (status.didJustFinish) {
                                    console.log("AudioPlayerManager: Track finished");
                                    playNext();
                                }
                            } else if (status.error) {
                                console.error("AudioPlayerManager: Status Error", status.error);
                            }
                        }
                    );

                    console.log("AudioPlayerManager: Sound created successfully", status);
                    soundRef.current = sound;
                }
            } catch (error) {
                console.error("AudioPlayerManager: Error loading sound:", error);
                pause(); // Stop playing state if load fails
            }
        };

        loadSound();
    }, [currentTrack?.id]); // Only reload if track ID changes

    // Handle Play/Pause
    useEffect(() => {
        const updatePlaybackStatus = async () => {
            if (!soundRef.current) return;

            try {
                const status = await soundRef.current.getStatusAsync();
                if (!status.isLoaded) return;

                if (isPlaying && !status.isPlaying) {
                    await soundRef.current.playAsync();
                } else if (!isPlaying && status.isPlaying) {
                    await soundRef.current.pauseAsync();
                }
            } catch (error) {
                console.error("Error updating playback status:", error);
            }
        };

        updatePlaybackStatus();
    }, [isPlaying]);

    // Handle Volume
    useEffect(() => {
        const updateVolume = async () => {
            if (soundRef.current) {
                try {
                    await soundRef.current.setVolumeAsync(volume);
                } catch (error) {
                    console.error("Error setting volume:", error);
                }
            }
        };
        updateVolume();
    }, [volume]);

    return null;
}
