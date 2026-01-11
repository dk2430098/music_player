import { create } from "zustand";
import type { QueueItem, PlayerState } from "@/lib/types";

// Initialize MMKV storage
let storage: any;
try {
  const { MMKV } = require("react-native-mmkv");
  storage = new MMKV();
} catch (e) {
  // Fallback for web or if MMKV is not available
  storage = {
    getString: () => null,
    set: () => {},
  };
}

interface PlayerStore extends PlayerState {
  // Playback actions
  play: () => void;
  pause: () => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  
  // Queue actions
  addToQueue: (item: QueueItem) => void;
  removeFromQueue: (id: string) => void;
  clearQueue: () => void;
  reorderQueue: (fromIndex: number, toIndex: number) => void;
  setQueue: (queue: QueueItem[]) => void;
  
  // Track navigation
  playNext: () => void;
  playPrevious: () => void;
  playTrack: (item: QueueItem) => void;
  
  // Modes
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  setVolume: (volume: number) => void;
  
  // Persistence
  loadQueue: () => void;
  saveQueue: () => void;
}

const QUEUE_STORAGE_KEY = "music_player_queue";
const PLAYER_STATE_KEY = "music_player_state";

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentTrack: null,
  queue: [],
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  shuffle: false,
  repeat: "off",
  volume: 1,

  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  
  setCurrentTime: (time: number) => set({ currentTime: time }),
  setDuration: (duration: number) => set({ duration }),

  addToQueue: (item: QueueItem) => {
    set((state) => {
      const newQueue = [...state.queue, item];
      if (!state.currentTrack) {
        return {
          queue: newQueue,
          currentTrack: item,
          isPlaying: true,
        };
      }
      return { queue: newQueue };
    });
  },

  removeFromQueue: (id: string) => {
    set((state) => {
      const newQueue = state.queue.filter((item) => item.id !== id);
      let currentTrack = state.currentTrack;
      
      if (currentTrack?.id === id) {
        currentTrack = newQueue[0] || null;
      }
      
      return {
        queue: newQueue,
        currentTrack,
        isPlaying: currentTrack ? state.isPlaying : false,
      };
    });
  },

  clearQueue: () => {
    set({
      queue: [],
      currentTrack: null,
      isPlaying: false,
      currentTime: 0,
    });
  },

  reorderQueue: (fromIndex: number, toIndex: number) => {
    set((state) => {
      const newQueue = [...state.queue];
      const [item] = newQueue.splice(fromIndex, 1);
      newQueue.splice(toIndex, 0, item);
      return { queue: newQueue };
    });
  },

  setQueue: (queue: QueueItem[]) => set({ queue }),

  playNext: () => {
    set((state) => {
      if (!state.currentTrack || state.queue.length === 0) return state;

      const currentIndex = state.queue.findIndex(
        (item) => item.id === state.currentTrack?.id
      );

      if (currentIndex === -1) return state;

      let nextIndex = currentIndex + 1;
      
      if (state.shuffle) {
        nextIndex = Math.floor(Math.random() * state.queue.length);
      } else if (nextIndex >= state.queue.length) {
        if (state.repeat === "all") {
          nextIndex = 0;
        } else {
          return state;
        }
      }

      return {
        currentTrack: state.queue[nextIndex],
        currentTime: 0,
      };
    });
  },

  playPrevious: () => {
    set((state) => {
      if (!state.currentTrack || state.queue.length === 0) return state;

      const currentIndex = state.queue.findIndex(
        (item) => item.id === state.currentTrack?.id
      );

      if (currentIndex === -1) return state;

      let prevIndex = currentIndex - 1;
      
      if (prevIndex < 0) {
        if (state.repeat === "all") {
          prevIndex = state.queue.length - 1;
        } else {
          return state;
        }
      }

      return {
        currentTrack: state.queue[prevIndex],
        currentTime: 0,
      };
    });
  },

  playTrack: (item: QueueItem) => {
    set((state) => {
      const isInQueue = state.queue.some((q) => q.id === item.id);
      if (!isInQueue) {
        return {
          queue: [...state.queue, item],
          currentTrack: item,
          currentTime: 0,
          isPlaying: true,
        };
      }
      return {
        currentTrack: item,
        currentTime: 0,
        isPlaying: true,
      };
    });
  },

  toggleShuffle: () => set((state) => ({ shuffle: !state.shuffle })),

  cycleRepeat: () => {
    set((state) => {
      const modes: Array<"off" | "one" | "all"> = ["off", "one", "all"];
      const currentIndex = modes.indexOf(state.repeat);
      const nextIndex = (currentIndex + 1) % modes.length;
      return { repeat: modes[nextIndex] };
    });
  },

  setVolume: (volume: number) => {
    set({ volume: Math.max(0, Math.min(1, volume)) });
  },

  loadQueue: () => {
    try {
      const queueJson = storage.getString(QUEUE_STORAGE_KEY);
      const stateJson = storage.getString(PLAYER_STATE_KEY);
      
      if (queueJson) {
        const queue = JSON.parse(queueJson) as QueueItem[];
        set({ queue });
      }
      
      if (stateJson) {
        const state = JSON.parse(stateJson);
        set({
          shuffle: state.shuffle ?? false,
          repeat: state.repeat ?? "off",
          volume: state.volume ?? 1,
        });
      }
    } catch (error) {
      console.error("Failed to load queue:", error);
    }
  },

  saveQueue: () => {
    try {
      const state = get();
      storage.set(QUEUE_STORAGE_KEY, JSON.stringify(state.queue));
      storage.set(
        PLAYER_STATE_KEY,
        JSON.stringify({
          shuffle: state.shuffle,
          repeat: state.repeat,
          volume: state.volume,
        })
      );
    } catch (error) {
      console.error("Failed to save queue:", error);
    }
  },
}));
