
# AudioTool Headless

A lightweight TypeScript audio format wrapper that provides universal HLS support across all browsers using hls.js.

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

- 🎵 **Universal HLS support** - Works across all browsers using hls.js
- 🎛️ **Built-in Equalizer** - 10-band EQ with presets and bass boost
- 📱 **Media Session API** - OS-level media controls and notifications  
- 🔄 **Queue Management** - Playlist support with shuffle, loop, and navigation
- ⚡ **Multiple Playback Rates** - 1x to 3x speed control
- 📊 **State Management** - Observable state with custom event system
- ✨ **TypeScript first** - Full type safety and IntelliSense support
- 📦 **Dual package** - Works with both ESM and CommonJS
- 🔧 **Lightweight** - Minimal dependencies, only hls.js when needed
- 🧪 **Fully typed** - Comprehensive TypeScript definitions

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
import { AudioHeadless, type MediaTrack } from 'audiotoolheadless';

// Create audio player instance
const audioPlayer = new AudioHeadless();

// Initialize the player
await audioPlayer.init({
  mode: 'VANILLA',
  useDefaultEventListeners: true,
  enableHls: true, // Enable HLS support
  enableEQ: true,  // Enable equalizer
  showNotificationActions: true,
  autoPlay: false,
  preloadStrategy: 'auto'
});

// Create a media track
const track: MediaTrack = {
  id: '1',
  title: 'My Song',
  source: 'https://example.com/audio.mp3',
  artist: 'Artist Name',
  album: 'Album Name',
  artwork: [{ src: 'https://example.com/artwork.jpg' }]
};

// Play regular audio formats (MP3, AAC, WAV, OGG, Opus)
await audioPlayer.addMedia(track);
await audioPlayer.play();

// Play HLS streams (works on all browsers)
const hlsTrack: MediaTrack = {
  id: '2',
  title: 'Live Stream',
  source: 'https://example.com/stream.m3u8',
  artist: 'Live Artist',
  artwork: null
};

await audioPlayer.addMediaAndPlay(hlsTrack);

// Subscribe to state changes
audioPlayer.subscribe('AUDIO_STATE', (state) => {
  console.log('Audio state changed:', state);
});

// Control playback
audioPlayer.pause();
audioPlayer.setVolume(75); // 0-100
audioPlayer.seek(30); // Seek to 30 seconds
audioPlayer.setPlaybackRate(1.5); // 1.5x speed
```

### CommonJS

```javascript
const { AudioHeadless } = require('audiotoolheadless');

const audioPlayer = new AudioHeadless();

// Initialize and play
audioPlayer.init({
  mode: 'VANILLA',
  useDefaultEventListeners: true,
  enableHls: true
}).then(() => {
  const track = {
    id: '1',
    title: 'My Song',
    source: 'https://example.com/audio.mp3',
    artwork: null
  };
  
  return audioPlayer.addMediaAndPlay(track);
}).then(() => {
  console.log('Playing audio');
});
```

## API Reference

### Classes

#### `AudioHeadless`

The main audio player class that provides universal audio format support with HLS streaming capabilities, queue management, equalizer, and media session integration.

```typescript
class AudioHeadless {
  constructor();
  
  // Core methods
  init(initProps: AudioInit): Promise<void>;
  addMedia(mediaTrack: MediaTrack, mediaFetchFn?: (track: MediaTrack) => Promise<void>): Promise<void>;
  addMediaAndPlay(mediaTrack?: MediaTrack, fetchFn?: (track: MediaTrack) => Promise<void>): Promise<void>;
  play(): Promise<void>;
  pause(): void;
  stop(): void;
  reset(): Promise<void>;
  destroy(): Promise<void>;
  
  // Playback control
  setVolume(volume: number): void; // 0-100
  setPlaybackRate(playbackRate: PlaybackRate): void;
  seek(time: number): void;
  seekBy(time: number): void;
  mute(): void;
  
  // Queue management
  addQueue(queue: MediaTrack[], playbackType: QueuePlaybackType): void;
  addToQueue(mediaTracks: MediaTrack | MediaTrack[]): void;
  playNext(): void;
  playPrevious(): void;
  clearQueue(): void;
  removeFromQueue(mediaTrack: MediaTrack): void;
  getQueue(): MediaTrack[];
  
  // Shuffle and Loop
  toggleShuffle(): void;
  loop(loopMode: LoopMode): void;
  isShuffledEnabled(): boolean;
  getLoopMode(): LoopMode;
  
  // Equalizer
  attachEq(): void;
  getPresets(): Preset[];
  setPreset(id: keyof Preset): void;
  setCustomEQ(gains: number[]): void;
  setBassBoost(enabled: boolean, boost: number): void;
  
  // Event handling
  subscribe(eventName: string, callback: (data: any) => void, state?: any): () => void;
  addEventListener(event: keyof HTMLMediaElementEventMap, callback: (data: any) => void): void;
  
  // Static methods
  static getAudioInstance(): HTMLAudioElement;
}
```

### Types

#### `AudioInit`

Configuration object for initializing AudioX.

```typescript
interface AudioInit {
  mode: InitMode; // 'REACT' | 'VANILLA'
  useDefaultEventListeners: boolean;
  showNotificationActions?: boolean;
  preloadStrategy?: 'none' | 'metadata' | 'auto';
  playbackRate?: PlaybackRate;
  customEventListeners?: EventListenerCallbackMap | null;
  autoPlay?: boolean;
  enablePlayLog?: boolean;
  enableHls?: boolean; // Enable HLS support
  enableEQ?: boolean;  // Enable equalizer
  crossOrigin?: 'anonymous' | 'use-credentials' | null;
  hlsConfig?: HlsConfig;
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

#### `init(initProps: AudioInit): Promise<void>`

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

#### `setPreset(id: keyof Preset): void`

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
├── src/
│   └── index.ts          # Main source file
├── dist/                 # Built files
│   ├── index.js          # ESM build
│   ├── index.cjs         # CommonJS build
│   └── index.d.ts        # Type definitions
├── docs/                 # Generated documentation
├── package.json          # Package configuration
├── tsconfig.json         # TypeScript configuration
├── tsup.config.ts        # Build configuration
├── typedoc.json          # Documentation configuration
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
