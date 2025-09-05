// Export the main player class
export { AudioHeadless } from '@/core/player';

// Export types for external use
export type {
  // Core types
  PlayerConfiguration,
  PlayerState,
  MediaTrack,
  MediaArtwork,
  PlaybackRate,
  LoopMode,
  QueuePlaybackType,
  // Audio types
  AudioEvents,
  HlsEvents,
  // Equalizer types
  EqualizerStatus,
  EqualizerPresets,
  EqualizerBand,
  // Event types
  EventCallbackMap,
  HlsEventCallbackMap,
  // Error types
  PlayerError,
  ErrorEvents,
  // State types
  ReadyState,
  NetworkState,
  // Configuration types
  InitMode,
  PreloadStrategy,
  CrossOriginValue,
} from '@/types';

// Export configuration constants
export {
  PLAYER_CONSTANTS,
  PLAYBACK_STATES,
  READY_STATES,
  NETWORK_STATES,
  ERROR_MESSAGES,
  EXTERNAL_URLS,
  EQUALIZER_PRESETS,
  EQUALIZER_BANDS,
  AUDIO_EVENTS,
  HLS_EVENTS,
  ERROR_EVENTS,
  // Legacy constant exports for backward compatibility
  AUDIO_X_CONSTANTS,
  PLAYBACK_STATE,
  READY_STATE,
  ERROR_MSG_MAP,
  URLS,
} from '@/config';

// Export utility classes for advanced usage
export {
  EventEmitter,
  QueueManager,
  ValidationUtils,
  PlaybackUtils,
} from '@/utils';

// Export library modules for advanced integration
export { Equalizer } from '@/lib/equalizer';

// Legacy exports for backward compatibility
export { AudioHeadless as AudioX } from '@/core/player';
