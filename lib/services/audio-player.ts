import { useAudioPlayer, setAudioModeAsync, type AudioPlayer } from "expo-audio";

import type { QueueItem } from "@/lib/types";

let currentPlayer: AudioPlayer | null = null;


export const AudioPlayerService = {
  /**
   * Initialize audio player with proper settings
   */
  async initialize() {
    try {
      // Enable playback in iOS silent mode
      await setAudioModeAsync({
        playsInSilentMode: true,
      });
    } catch (error) {
      console.error("Failed to initialize audio mode:", error);
    }
  },

  /**
   * Load and play a song
   */
  async play(track: QueueItem) {
    try {
      // Release previous player if exists
      if (currentPlayer) {
        try {
          await currentPlayer.pause();
          currentPlayer.release();
        } catch (e) {
          console.error("Error releasing previous player:", e);
        }
      }

      // Create new player instance
      const player = useAudioPlayer(track.downloadUrl);
      currentPlayer = player;

      // Start playback
      await player.play();

      return player;
    } catch (error) {
      console.error("Failed to play track:", error);
      throw error;
    }
  },

  /**
   * Pause current playback
   */
  async pause() {
    try {
      if (currentPlayer) {
        await currentPlayer.pause();
      }
    } catch (error) {
      console.error("Failed to pause:", error);
    }
  },

  /**
   * Resume playback
   */
  async resume() {
    try {
      if (currentPlayer) {
        await currentPlayer.play();
      }
    } catch (error) {
      console.error("Failed to resume:", error);
    }
  },

  /**
   * Seek to a specific time
   */
  async seek(time: number) {
    try {
      if (currentPlayer) {
        await currentPlayer.seekTo(time);
      }
    } catch (error) {
      console.error("Failed to seek:", error);
    }
  },

  /**
   * Set volume
   */
  async setVolume(volume: number) {
    try {
      if (currentPlayer) {
        currentPlayer.volume = Math.max(0, Math.min(1, volume));
      }
    } catch (error) {
      console.error("Failed to set volume:", error);
    }
  },

  /**
   * Get current playback status
   */
  getStatus() {
    if (!currentPlayer) {
      return {
        isPlaying: false,
        currentTime: 0,
        duration: 0,
      };
    }

    return {
      isPlaying: currentPlayer.playing,
      currentTime: currentPlayer.currentTime,
      duration: currentPlayer.duration,
    };
  },

  /**
   * Subscribe to playback status updates
   */
  onStatusUpdate(callback: (status: any) => void) {
    if (!currentPlayer) return;

    // Create a listener that polls the status
    const interval = setInterval(() => {
      if (currentPlayer) {
        callback({
          isPlaying: currentPlayer.playing,
          currentTime: currentPlayer.currentTime,
          duration: currentPlayer.duration,
        });
      }
    }, 500);

    return () => clearInterval(interval);
  },

  /**
   * Release player resources
   */
  async release() {
    try {
      if (currentPlayer) {
        await currentPlayer.pause();
        currentPlayer.release();
        currentPlayer = null;
      }
    } catch (error) {
      console.error("Failed to release player:", error);
    }
  },

  /**
   * Get current player instance
   */
  getCurrentPlayer() {
    return currentPlayer;
  },
};
