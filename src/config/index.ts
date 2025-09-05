import type { InitMode } from '@/types';
import type { ErrorMessageMap } from '@/types';

// ==================== PLAYER CONSTANTS ====================

export const PLAYER_CONSTANTS = Object.freeze({
  REACT: 'REACT' as InitMode,
  VANILLA: 'VANILLA' as InitMode,
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
});

// ==================== PLAYBACK STATES ====================

export const PLAYBACK_STATES = Object.freeze({
  BUFFERING: 'buffering',
  PLAYING: 'playing',
  PAUSED: 'paused',
  READY: 'ready',
  IDLE: 'idle',
  ENDED: 'ended',
  STALLED: 'stalled',
  ERROR: 'error',
  TRACK_CHANGE: 'trackchanged',
  DURATION_CHANGE: 'durationchanged',
  QUEUE_ENDED: 'queueended',
});

// ==================== READY STATES ====================

export const READY_STATES = Object.freeze({
  HAVE_NOTHING: 0,
  HAVE_METADATA: 1,
  HAVE_CURRENT_DATA: 2,
  HAVE_FUTURE_DATA: 3,
  HAVE_ENOUGH_DATA: 4,
});

// ==================== NETWORK STATES ====================

export const NETWORK_STATES = Object.freeze({
  NETWORK_EMPTY: 0,
  NETWORK_IDLE: 1,
  NETWORK_LOADING: 2,
  NETWORK_NO_SOURCE: 3,
});

// ==================== ERROR MESSAGES ====================

export const ERROR_MESSAGES: ErrorMessageMap = Object.freeze({
  MEDIA_ERR_ABORTED: 'The user canceled the audio.',
  MEDIA_ERR_DECODE: 'An error occurred while decoding the audio.',
  MEDIA_ERR_NETWORK: 'A network error occurred while fetching the audio.',
  MEDIA_ERR_SRC_NOT_SUPPORTED:
    'The audio is missing or is in a format not supported by your browser.',
  DEFAULT: 'An unknown error occurred.',
});

// ==================== EXTERNAL URLS ====================

export const EXTERNAL_URLS = Object.freeze({
  HLS_CDN: 'https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.5.18/hls.min.js',
  CAST_SDK: 'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1',
});

// ==================== EQUALIZER PRESETS ====================

export const EQUALIZER_PRESETS = Object.freeze({
  FLAT: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ACOUSTIC: [-0.5, 0, 0.5, 0.8, 0.8, 0.5, 0, 0.2, 0.5, 0.8],
  BASS_BOOSTER: [2.4, 1.8, 1.2, 0.5, 0, 0, 0, 0, 0, 0],
  BASS_REDUCER: [-2.4, -1.8, -1.2, -0.5, 0, 0, 0, 0, 0, 0],
  CLASSICAL: [0, 0, 0, 0, 0, 0, 0, -1.2, -1.2, -1.2],
  DEEP: [1.2, 0.8, 1.6, 1.3, 0, 1.5, 2.4, 2.2, 1.8, 1.4],
  ELECTRONIC: [2.4, 1.8, 1.0, 0, -0.5, 2.0, 1.0, 1.8, 2.4, 2.4],
  LATIN: [0, 0, 0, 0, -1.0, -1.0, -1.0, 0, 1.2, 1.8],
  LOUDNESS: [6.5, 4.0, 0, 0, -2.0, 0, -1.0, -4.5, 4.0, 1.0],
  LOUNGE: [-1.5, -0.5, -0.2, 1.8, 2.4, 1.0, 0, 0, 1.8, 0.2],
  PIANO: [1.5, 1.0, 0, 2.4, 3.0, 1.5, 3.5, 4.0, 3.0, 3.5],
  POP: [-1.0, -0.5, 0, 0.8, 1.4, 1.4, 0.8, 0, -0.5, -1.0],
  RNB: [3.0, 7.0, 5.5, 1.4, -2.0, -1.5, 2.0, 2.4, 2.8, 3.5],
  ROCK: [3.2, 2.5, -0.6, -0.8, -0.3, 0.4, 0.9, 1.1, 1.1, 1.1],
  SMALL_SPEAKERS: [2.4, 4.0, 3.5, 3.0, 1.5, 0, -1.5, -2.0, -2.5, -3.0],
  SPOKEN_WORD: [-2.5, -1.0, 0, 0.7, 1.8, 2.5, 2.5, 2.0, 1.0, 0],
  TREBLE_BOOSTER: [0, 0, 0, 0, 0, 1.0, 2.0, 3.0, 4.0, 4.5],
  TREBLE_REDUCER: [0, 0, 0, 0, 0, -1.0, -2.0, -3.0, -4.0, -4.5],
  VOCAL_BOOSTER: [-1.6, -3.0, -3.0, 1.0, 3.8, 3.8, 3.0, 2.4, 1.5, 0],
});

// ==================== EQUALIZER BANDS ====================

export const EQUALIZER_BANDS = [
  { type: 'peaking' as BiquadFilterType, frequency: 32, Q: 1, gain: 0 },
  { type: 'peaking' as BiquadFilterType, frequency: 64, Q: 1, gain: 0 },
  { type: 'peaking' as BiquadFilterType, frequency: 125, Q: 1, gain: 0 },
  { type: 'peaking' as BiquadFilterType, frequency: 250, Q: 1, gain: 0 },
  { type: 'peaking' as BiquadFilterType, frequency: 500, Q: 1, gain: 0 },
  { type: 'peaking' as BiquadFilterType, frequency: 1000, Q: 1, gain: 0 },
  { type: 'peaking' as BiquadFilterType, frequency: 2000, Q: 1, gain: 0 },
  { type: 'peaking' as BiquadFilterType, frequency: 4000, Q: 1, gain: 0 },
  { type: 'peaking' as BiquadFilterType, frequency: 8000, Q: 1, gain: 0 },
  { type: 'peaking' as BiquadFilterType, frequency: 16000, Q: 1, gain: 0 },
];

// ==================== AUDIO EVENTS ====================

export const AUDIO_EVENTS = Object.freeze({
  ABORT: 'abort',
  TIME_UPDATE: 'timeupdate',
  CAN_PLAY: 'canplay',
  CAN_PLAY_THROUGH: 'canplaythrough',
  DURATION_CHANGE: 'durationchange',
  ENDED: 'ended',
  EMPTIED: 'emptied',
  PLAYING: 'playing',
  WAITING: 'waiting',
  SEEKING: 'seeking',
  SEEKED: 'seeked',
  LOADED_META_DATA: 'loadedmetadata',
  LOADED_DATA: 'loadeddata',
  PLAY: 'play',
  PAUSE: 'pause',
  RATE_CHANGE: 'ratechange',
  VOLUME_CHANGE: 'volumechange',
  SUSPEND: 'suspend',
  STALLED: 'stalled',
  PROGRESS: 'progress',
  LOAD_START: 'loadstart',
  ERROR: 'error',
  TRACK_CHANGE: 'trackchange',
  QUEUE_ENDED: 'queueended',
});

// ==================== HLS EVENTS ====================

export const HLS_EVENTS = Object.freeze({
  MEDIA_ATTACHING: 'hlsMediaAttaching',
  MEDIA_ATTACHED: 'hlsMediaAttached',
  MEDIA_DETACHING: 'hlsMediaDetaching',
  MEDIA_DETACHED: 'hlsMediaDetached',
  BUFFER_RESET: 'hlsBufferReset',
  BUFFER_CODECS: 'hlsBufferCodecs',
  BUFFER_CREATED: 'hlsBufferCreated',
  BUFFER_APPENDING: 'hlsBufferAppending',
  BUFFER_APPENDED: 'hlsBufferAppended',
  BUFFER_EOS: 'hlsBufferEos',
  BUFFER_FLUSHING: 'hlsBufferFlushing',
  BUFFER_FLUSHED: 'hlsBufferFlushed',
  MANIFEST_LOADING: 'hlsManifestLoading',
  MANIFEST_LOADED: 'hlsManifestLoaded',
  MANIFEST_PARSED: 'hlsManifestParsed',
  LEVEL_SWITCHING: 'hlsLevelSwitching',
  LEVEL_SWITCHED: 'hlsLevelSwitched',
  LEVEL_LOADING: 'hlsLevelLoading',
  LEVEL_LOADED: 'hlsLevelLoaded',
  LEVEL_UPDATED: 'hlsLevelUpdated',
  LEVEL_PTS_UPDATED: 'hlsLevelPtsUpdated',
  LEVELS_UPDATED: 'hlsLevelsUpdated',
  AUDIO_TRACKS_UPDATED: 'hlsAudioTracksUpdated',
  AUDIO_TRACK_SWITCHING: 'hlsAudioTrackSwitching',
  AUDIO_TRACK_SWITCHED: 'hlsAudioTrackSwitched',
  AUDIO_TRACK_LOADING: 'hlsAudioTrackLoading',
  AUDIO_TRACK_LOADED: 'hlsAudioTrackLoaded',
  SUBTITLE_TRACKS_UPDATED: 'hlsSubtitleTracksUpdated',
  SUBTITLE_TRACKS_CLEARED: 'hlsSubtitleTracksCleared',
  SUBTITLE_TRACK_SWITCH: 'hlsSubtitleTrackSwitch',
  SUBTITLE_TRACK_LOADING: 'hlsSubtitleTrackLoading',
  SUBTITLE_TRACK_LOADED: 'hlsSubtitleTrackLoaded',
  SUBTITLE_FRAG_PROCESSED: 'hlsSubtitleFragProcessed',
  CUES_PARSED: 'hlsCuesParsed',
  NON_NATIVE_TEXT_TRACKS_FOUND: 'hlsNonNativeTextTracksFound',
  INIT_PTS_FOUND: 'hlsInitPtsFound',
  FRAG_LOADING: 'hlsFragLoading',
  FRAG_LOAD_EMERGENCY_ABORTED: 'hlsFragLoadEmergencyAborted',
  FRAG_LOADED: 'hlsFragLoaded',
  FRAG_DECRYPTED: 'hlsFragDecrypted',
  FRAG_PARSING_INIT_SEGMENT: 'hlsFragParsingInitSegment',
  FRAG_PARSING_USERDATA: 'hlsFragParsingUserdata',
  FRAG_PARSING_METADATA: 'hlsFragParsingMetadata',
  FRAG_PARSED: 'hlsFragParsed',
  FRAG_BUFFERED: 'hlsFragBuffered',
  FRAG_CHANGED: 'hlsFragChanged',
  FPS_DROP: 'hlsFpsDrop',
  FPS_DROP_LEVEL_CAPPING: 'hlsFpsDropLevelCapping',
  ERROR: 'hlsError',
  DESTROYING: 'hlsDestroying',
  KEY_LOADING: 'hlsKeyLoading',
  KEY_LOADED: 'hlsKeyLoaded',
  LIVE_BACK_BUFFER_REACHED: 'hlsLiveBackBufferReached',
  BACK_BUFFER_REACHED: 'hlsBackBufferReached',
});

// ==================== ERROR EVENTS ====================

export const ERROR_EVENTS = Object.freeze({
  MEDIA_ERR_ABORTED: 'Media playback was aborted',
  MEDIA_ERR_NETWORK: 'Network error occurred',
  MEDIA_ERR_DECODE: 'Media decoding error',
  MEDIA_ERR_SRC_NOT_SUPPORTED: 'Media source not supported',
});

// Legacy exports for backward compatibility
export const AUDIO_X_CONSTANTS = PLAYER_CONSTANTS;
export const PLAYBACK_STATE = PLAYBACK_STATES;
export const READY_STATE = READY_STATES;
export const ERROR_MSG_MAP = ERROR_MESSAGES;
export const URLS = EXTERNAL_URLS;
