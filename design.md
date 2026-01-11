# JioSaavn Music Player - Mobile App Design

## Overview
A music streaming app built with React Native (Expo) that integrates with the JioSaavn API. The app focuses on search, playback, queue management, and persistent playback across navigation.

## Screen List

1. **Home Screen** - Search and discover music
2. **Player Screen** - Full-screen player with controls
3. **Queue Screen** - View and manage the current queue
4. **Settings Screen** - App preferences and quality settings

## Primary Content and Functionality

### Home Screen
- **Search Bar** - Input field to search songs, albums, artists, playlists
- **Search Results** - Paginated list of songs with album art, title, artist, duration
- **Quick Actions** - Tap song to add to queue and play
- **Pagination** - Load more results as user scrolls

### Mini Player (Persistent Bar)
- **Album Art** - Thumbnail of current track
- **Track Info** - Song title and artist name
- **Play/Pause Button** - Quick playback control
- **Next Button** - Skip to next track
- **Tap to Expand** - Tap anywhere to open full player

### Full Player Screen
- **Album Art** - Large, high-quality image (500x500)
- **Track Info** - Song title, artist, album, duration
- **Progress Bar** - Seek bar with current time and total duration
- **Playback Controls** - Play, pause, next, previous buttons
- **Queue Button** - Access queue management
- **Shuffle/Repeat** - Toggle shuffle and repeat modes
- **Download** - Download song for offline listening (bonus feature)

### Queue Screen
- **Queue List** - Draggable list of upcoming songs
- **Current Track Indicator** - Highlight currently playing song
- **Reorder** - Drag to reorder songs
- **Remove** - Swipe or tap to remove songs from queue
- **Clear Queue** - Button to clear all songs

### Settings Screen
- **Audio Quality** - Select download/playback quality (96kbps, 160kbps, 320kbps)
- **Theme** - Light/dark mode toggle
- **About** - App version and information

## Key User Flows

### Flow 1: Search and Play
1. User opens Home screen
2. User taps search bar and types song/artist name
3. API returns results in paginated list
4. User taps a song to add to queue and play
5. Mini player appears at bottom with playback controls
6. User can tap mini player to expand to full player

### Flow 2: Full Playback Control
1. User taps mini player to open full player screen
2. User sees large album art and full track details
3. User can seek using progress bar
4. User can play/pause, skip forward/backward
5. User can toggle shuffle and repeat modes
6. User can tap queue button to view/manage queue

### Flow 3: Queue Management
1. User taps queue button in full player
2. Queue screen shows all upcoming songs
3. User can drag to reorder songs
4. User can swipe to remove songs
5. User can clear entire queue
6. User returns to player (queue persists)

### Flow 4: Background Playback
1. User is playing music in the app
2. User presses home button or minimizes app
3. Music continues playing in background
4. User can control playback from lock screen or notification
5. User reopens app and playback state is synchronized

## Color Choices

- **Primary** - `#0a7ea4` (Teal blue) - Used for buttons, active states, highlights
- **Background** - `#ffffff` (Light) / `#151718` (Dark) - Screen background
- **Surface** - `#f5f5f5` (Light) / `#1e2022` (Dark) - Cards, elevated surfaces
- **Foreground** - `#11181C` (Light) / `#ECEDEE` (Dark) - Primary text
- **Muted** - `#687076` (Light) / `#9BA1A6` (Dark) - Secondary text
- **Border** - `#E5E7EB` (Light) / `#334155` (Dark) - Dividers, borders
- **Accent** - `#FF6B6B` (Red) - Used for delete/remove actions

## Layout Principles

- **Portrait Orientation** - All screens optimized for 9:16 aspect ratio
- **One-Handed Usage** - Primary controls within thumb reach
- **Safe Area** - Content respects notch and home indicator
- **Tab Bar** - Persistent navigation at bottom (Home, Player, Queue, Settings)
- **Mini Player** - Always visible above tab bar when playing
- **Responsive** - Adapts to different screen sizes

## Technical Considerations

- **State Management** - Zustand for global playback state
- **Local Storage** - MMKV for queue persistence
- **API Integration** - JioSaavn API for search and song data
- **Audio Playback** - expo-audio for playback and background playback
- **Navigation** - React Navigation v6+ for tab and stack navigation
- **Styling** - NativeWind (Tailwind CSS) for consistent design
