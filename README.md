
# AudioTool Headless

A modern, lightweight TypeScript audio player library that provides universal HLS support, built-in equalizer, queue management, and media session integration across all browsers.

## Audio Format Support

### Native Browser Support
- **MP3** (.mp3) → Supported in all major browsers
- **AAC** (.aac, .m4a, .mp4) → Supported in all major browsers  
- **WAV** (.wav) → Supported everywhere, but large file sizes
- **OGG Vorbis** (.ogg) → Supported by Chrome/Firefox/Edge, not always Safari
- **Opus** (.opus) → Supported in Chrome/Firefox/Edge; Safari has partial support

### HLS Streaming Support
- **Safari** (macOS + iOS) → Native HLS support in audio object
- **Chrome/Firefox/Edge** → No native HLS support, uses hls.js wrapper

## Features

- 🎵 **Universal HLS Support** - Seamless streaming across all browsers using hls.js
- 🎛️ **Built-in Equalizer** - 10-band EQ with presets and bass boost controls
- 📱 **Media Session API** - Native OS-level media controls and notifications  
- 🔄 **Advanced Queue Management** - Smart playlist handling with shuffle, loop modes, and navigation
- ⚡ **Variable Playback Rates** - Smooth speed control from 1x to 3x
- 📊 **Reactive State Management** - Observable state system with custom event emission
- 🎯 **Modern Architecture** - Clean, modular design with absolute imports
- ✨ **TypeScript First** - Complete type safety with intelligent IntelliSense
- 📦 **Universal Package** - Works seamlessly with ESM and CommonJS
- 🔧 **Zero Config** - Smart defaults with extensive customization options
- 🧪 **Production Ready** - Comprehensive error handling and edge case coverage

## Installation

```bash
npm install audiotoolheadless
# or
pnpm add audiotoolheadless
# or
yarn add audiotoolheadless
```

## Usage

### ES Modules

```typescript
import { AudioHeadless, type MediaTrack, type PlayerConfiguration } from 'audiotoolheadless';

// Create audio player instance
const player = new AudioHeadless();

// Initialize with configuration
const config: PlayerConfiguration = {
  mode: 'VANILLA',
  useDefaultEventListeners: true,
  enableHls: true,           // Enable HLS streaming support
  enableEqualizer: true,     // Enable 10-band equalizer
  showNotificationActions: true, // OS-level media controls
  autoPlay: false,
  preloadStrategy: 'auto',
  crossOrigin: 'anonymous'
};

await player.initialize(config);

// Create a media track
const track: MediaTrack = {
  id: '1',
  title: 'My Song',
  source: 'https://example.com/audio.mp3',
  artist: 'Artist Name',
  album: 'Album Name',
  artwork: [{ src: 'https://example.com/artwork.jpg' }]
};

// Load and play audio
await player.loadTrack(track);
await player.play();

// HLS streaming (works on all browsers)
const hlsTrack: MediaTrack = {
  id: '2',
  title: 'Live Stream',
  source: 'https://example.com/stream.m3u8',
  artist: 'Live Artist',
  artwork: null
};

await player.loadAndPlay(hlsTrack);

// State management
player.onStateChange((state) => {
  console.log('Player state:', state.playbackState);
  console.log('Current track:', state.currentTrack?.title);
});

// Playback controls
player.pause();
player.setVolume(75);        // 0-100
player.seekToTime(30);       // Seek to 30 seconds
player.setPlaybackRate(1.5); // 1.5x speed

// Queue management
const playlist = [track, hlsTrack];
player.setQueue(playlist);
player.playNext();
player.enableShuffle(true);
player.setLoopMode('QUEUE');

// Equalizer controls
player.setEqualizerPreset('ROCK');
player.setCustomEqualizer([1, 2, 0, -1, 3, 0, 2, 1, 0, -1]);
```

### CommonJS

```javascript
const { AudioHeadless } = require('audiotoolheadless');

const player = new AudioHeadless();

// Initialize and play
player.initialize({
  mode: 'VANILLA',
  useDefaultEventListeners: true,
  enableHls: true,
  enableEqualizer: true
}).then(() => {
  const track = {
    id: '1',
    title: 'My Song',
    source: 'https://example.com/audio.mp3',
    artist: 'Artist Name',
    artwork: null
  };
  
  return player.loadAndPlay(track);
}).then(() => {
  console.log('Audio playing successfully');
});
```

## API Reference

### Classes

#### `AudioHeadless`

The main audio player class that provides universal audio format support with HLS streaming capabilities, queue management, equalizer, and media session integration.

```typescript
class AudioHeadless {
  constructor();
  
  // Core lifecycle methods
  initialize(config: PlayerConfiguration): Promise<void>;
  destroy(): Promise<void>;
  reset(): Promise<void>;
  
  // Media loading and playback
  loadTrack(track: MediaTrack, fetchFn?: (track: MediaTrack) => Promise<void>): Promise<void>;
  loadAndPlay(track: MediaTrack, fetchFn?: (track: MediaTrack) => Promise<void>): Promise<void>;
  play(): Promise<void>;
  pause(): void;
  stop(): void;
  
  // Playback controls
  setVolume(volume: number): void; // 0-100
  getVolume(): number;
  setPlaybackRate(rate: PlaybackRate): void;
  getPlaybackRate(): PlaybackRate;
  seekToTime(seconds: number): void;
  seekByTime(seconds: number): void;
  mute(): void;
  unmute(): void;
  isMuted(): boolean;
  
  // Queue management
  setQueue(tracks: MediaTrack[], playbackType?: QueuePlaybackType): void;
  addToQueue(tracks: MediaTrack | MediaTrack[]): void;
  removeFromQueue(trackId: string): void;
  clearQueue(): void;
  getQueue(): MediaTrack[];
  getCurrentTrackIndex(): number;
  playNext(): void;
  playPrevious(): void;
  playTrackAt(index: number): void;
  
  // Shuffle and Loop controls
  enableShuffle(enabled: boolean): void;
  isShuffleEnabled(): boolean;
  setLoopMode(mode: LoopMode): void;
  getLoopMode(): LoopMode;
  
  // Equalizer controls
  initializeEqualizer(): void;
  getEqualizerPresets(): EqualizerPresets;
  setEqualizerPreset(presetName: keyof EqualizerPresets): void;
  setCustomEqualizer(gains: number[]): void;
  enableBassBoost(enabled: boolean, boost?: number): void;
  getEqualizerState(): EqualizerStatus;
  
  // State and event handling
  onStateChange(callback: (state: PlayerState) => void): () => void;
  getCurrentState(): PlayerState;
  addEventListener(event: keyof HTMLMediaElementEventMap, callback: EventListener): void;
  removeEventListener(event: keyof HTMLMediaElementEventMap, callback: EventListener): void;
  
  // Static utilities
  static getInstance(): AudioHeadless;
  static getAudioElement(): HTMLAudioElement;
}
```

### Types

#### `PlayerConfiguration`

Configuration object for initializing the AudioHeadless player.

```typescript
interface PlayerConfiguration {
  mode: InitMode; // 'REACT' | 'VANILLA'
  useDefaultEventListeners: boolean;
  showNotificationActions?: boolean;
  preloadStrategy?: PreloadStrategy; // 'none' | 'metadata' | 'auto'
  playbackRate?: PlaybackRate;
  customEventListeners?: EventCallbackMap | null;
  autoPlay?: boolean;
  enablePlayLog?: boolean;
  enableHls?: boolean;        // Enable HLS streaming support
  enableEqualizer?: boolean;  // Enable 10-band equalizer
  crossOrigin?: CrossOriginValue; // 'anonymous' | 'use-credentials' | null
  hlsConfig?: HlsConfig;      // HLS.js configuration options
}
```

#### `MediaTrack`

Represents an audio track with metadata.

```typescript
interface MediaTrack {
  id: string;
  title: string;
  source: string; // URL to audio file or HLS stream (.m3u8)
  artwork: MediaArtwork[] | null;
  duration?: number;
  genre?: string;
  album?: string;
  comment?: string;
  year?: number | string;
  artist?: string;
}
```

#### `MediaArtwork`

```typescript
interface MediaArtwork {
  src: string;
  name?: string;
  sizes?: string;
}
```

### Core Methods

#### `init(initProps: PlayerConfiguration): Promise<void>`

Initialize the AudioHeadless instance with configuration options.

**Required before any playback operations.**

#### `addMedia(mediaTrack: MediaTrack): Promise<void>`

Load a media track. Automatically detects HLS streams (.m3u8) and uses hls.js for browsers without native HLS support.

#### `addMediaAndPlay(mediaTrack: MediaTrack): Promise<void>`

Convenience method that loads and immediately plays a media track.

#### `play(): Promise<void>`

Start audio playback. Media must be loaded first.

#### `setVolume(volume: number): void`

Set playback volume.

**Parameters:**
- `volume` - Volume level between 0 (muted) and 100 (full volume)

#### `setPlaybackRate(playbackRate: PlaybackRate): void`

Set playback speed.

**Parameters:**
- `playbackRate` - Speed multiplier: `1.0 | 1.25 | 1.5 | 1.75 | 2.0 | 2.5 | 3.0`

### Queue Management

#### `addQueue(queue: MediaTrack[], playbackType: QueuePlaybackType): void`

Set the playback queue.

**Parameters:**
- `queue` - Array of media tracks
- `playbackType` - `'DEFAULT' | 'REVERSE' | 'SHUFFLE'`

#### `playNext(): void` / `playPrevious(): void`

Navigate through the queue.

### Equalizer Methods

#### `setPreset(id: keyof EqualizerPresets): void`

Apply a preset equalizer setting.

#### `setCustomEQ(gains: number[]): void`

Apply custom equalizer gains.

### Events

Subscribe to events using the `subscribe()` method:

```typescript
const unsubscribe = audioPlayer.subscribe('AUDIO_STATE', (state) => {
  console.log('State changed:', state.playbackState);
});

// Unsubscribe when done
unsubscribe();
```

**Available Events:**
- `AUDIO_STATE` - Audio state changes (play, pause, track change, etc.)
- Standard HTML5 audio events via `addEventListener()`

## Development

### Requirements

- Node.js 16+
- pnpm (recommended)

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd audioToolHeadless

# Install dependencies
pnpm install

# Install git hooks
pnpm run prepare
```

### Scripts

```bash
# Development
pnpm run dev          # Watch mode with auto-rebuild
pnpm run build        # Build for production
pnpm run typecheck    # Type checking only

# Code Quality
pnpm run lint         # Lint code
pnpm run lint:fix     # Lint and auto-fix
pnpm run format       # Format code

# Documentation
pnpm run docs         # Generate documentation
pnpm run docs:clean   # Clean docs folder

# Testing
pnpm run test         # Run tests

# Release
pnpm run release:patch   # Patch release (0.0.1 -> 0.0.2)
pnpm run release:minor   # Minor release (0.0.1 -> 0.1.0)  
pnpm run release:major   # Major release (0.0.1 -> 1.0.0)
```

### Project Structure

```
audioToolHeadless/
├── src/                  # Source code
│   ├── core/             # Core player implementation
│   │   └── player.ts     # Main AudioHeadless class
│   ├── lib/              # Library modules
│   │   ├── equalizer/    # Equalizer implementation
│   │   ├── hls/          # HLS streaming support
│   │   └── media-session/ # Media Session API integration
│   ├── utils/            # Utility functions
│   │   ├── validation.ts # Input validation
│   │   ├── event-emitter.ts # Event handling
│   │   ├── queue-manager.ts # Queue operations
│   │   └── playback-utils.ts # Playback calculations
│   ├── config/           # Configuration and constants
│   │   └── index.ts      # Equalizer bands, presets, etc.
│   ├── types/            # TypeScript type definitions
│   │   └── index.ts      # All interfaces and types
│   ├── events/           # Event handling
│   ├── helpers/          # Helper functions
│   ├── states/           # State management
│   ├── constants/        # Application constants
│   ├── adapters/         # Legacy adapter classes
│   └── index.ts          # Main entry point
├── dist/                 # Built files (auto-generated)
│   ├── index.js          # ESM build
│   ├── index.cjs         # CommonJS build
│   ├── index.d.ts        # Type definitions
│   └── *.map             # Source maps
├── docs/                 # Generated API documentation (TypeDoc)
├── package.json          # Package configuration
├── tsconfig.json         # TypeScript configuration
├── tsup.config.ts        # Build configuration (tsup)
├── typedoc.json          # Documentation configuration
├── biome.json            # Code formatting and linting
├── commitlint.config.js  # Commit message linting
├── .lefthook.yml         # Git hooks configuration
└── README.md            # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/amazing-feature`
3. Make your changes
4. Commit using conventional commits: `git commit -m "feat: add amazing feature"`
5. Push to the branch: `git push origin feat/amazing-feature`
6. Open a Pull Request

### Commit Convention

This project uses [Conventional Commits](https://conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

## License

ISC License - see the [LICENSE](LICENSE) file for details.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.
