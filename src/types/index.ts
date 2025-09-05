import type { HlsConfig } from 'hls.js';
import type Hls from 'hls.js';

// ==================== CORE TYPES ====================

export type InitMode = 'REACT' | 'VANILLA';
export type PlaybackRate = 1.0 | 1.25 | 1.5 | 1.75 | 2.0 | 2.5 | 3.0;
export type PreloadStrategy = 'none' | 'metadata' | 'auto' | '';
export type CrossOriginValue = 'anonymous' | 'use-credentials' | null;

export type PlaybackState =
  | 'idle'
  | 'playing'
  | 'ended'
  | 'ready'
  | 'paused'
  | 'stalled'
  | 'error'
  | 'buffering'
  | 'trackchanged'
  | 'durationchanged'
  | 'queueended';

export type QueuePlaybackType = 'DEFAULT' | 'REVERSE' | 'SHUFFLE';
export type LoopMode = 'SINGLE' | 'QUEUE' | 'OFF';

// ==================== MEDIA TYPES ====================

export interface MediaArtwork {
  src: string;
  name?: string;
  sizes?: string;
  type?: string;
}

export interface MediaTrack {
  id: string;
  title: string;
  source: string;
  artwork: MediaArtwork[] | null;
  duration?: number;
  genre?: string;
  album?: string;
  comment?: string;
  year?: number | string;
  artist?: string;
}

// ==================== CONFIGURATION TYPES ====================

export interface PlayerConfiguration {
  mode: InitMode;
  useDefaultEventListeners: boolean;
  showNotificationActions?: boolean;
  preloadStrategy?: PreloadStrategy;
  playbackRate?: PlaybackRate;
  customEventListeners?: EventCallbackMap | null;
  autoPlay?: boolean;
  enablePlayLog?: boolean;
  enableHls?: boolean;
  enableEqualizer?: boolean;
  crossOrigin?: CrossOriginValue;
  hlsConfig?: HlsConfig;
}

// ==================== STATE TYPES ====================

export interface PlayerError {
  code: number | string | null;
  message: string;
  readable: string;
}

export interface PlayerState {
  playbackState: PlaybackState;
  duration: number | undefined;
  bufferedDuration: number;
  progress: number | undefined;
  volume: number;
  playbackRate: PlaybackRate;
  error: PlayerError;
  currentTrack: MediaTrack;
  currentTrackPlayTime: number;
  previousTrackPlayTime: number;
}

export interface ReadyState {
  HAVE_NOTHING: 0;
  HAVE_METADATA: 1;
  HAVE_CURRENT_DATA: 2;
  HAVE_FUTURE_DATA: 3;
  HAVE_ENOUGH_DATA: 4;
}

export interface NetworkState {
  NETWORK_EMPTY: 0;
  NETWORK_IDLE: 1;
  NETWORK_LOADING: 2;
  NETWORK_NO_SOURCE: 3;
}

// ==================== EVENT TYPES ====================

export interface AudioEvents {
  ABORT: 'abort';
  TIME_UPDATE: 'timeupdate';
  CAN_PLAY: 'canplay';
  CAN_PLAY_THROUGH: 'canplaythrough';
  DURATION_CHANGE: 'durationchange';
  ENDED: 'ended';
  EMPTIED: 'emptied';
  PLAYING: 'playing';
  WAITING: 'waiting';
  SEEKING: 'seeking';
  SEEKED: 'seeked';
  LOADED_META_DATA: 'loadedmetadata';
  LOADED_DATA: 'loadeddata';
  PLAY: 'play';
  PAUSE: 'pause';
  RATE_CHANGE: 'ratechange';
  VOLUME_CHANGE: 'volumechange';
  SUSPEND: 'suspend';
  STALLED: 'stalled';
  PROGRESS: 'progress';
  LOAD_START: 'loadstart';
  ERROR: 'error';
  TRACK_CHANGE: 'trackchange';
  QUEUE_ENDED: 'queueended';
}

export interface HlsEvents {
  MEDIA_ATTACHING: 'hlsMediaAttaching';
  MEDIA_ATTACHED: 'hlsMediaAttached';
  MEDIA_DETACHING: 'hlsMediaDetaching';
  MEDIA_DETACHED: 'hlsMediaDetached';
  BUFFER_RESET: 'hlsBufferReset';
  BUFFER_CODECS: 'hlsBufferCodecs';
  BUFFER_CREATED: 'hlsBufferCreated';
  BUFFER_APPENDING: 'hlsBufferAppending';
  BUFFER_APPENDED: 'hlsBufferAppended';
  BUFFER_EOS: 'hlsBufferEos';
  BUFFER_FLUSHING: 'hlsBufferFlushing';
  BUFFER_FLUSHED: 'hlsBufferFlushed';
  MANIFEST_LOADING: 'hlsManifestLoading';
  MANIFEST_LOADED: 'hlsManifestLoaded';
  MANIFEST_PARSED: 'hlsManifestParsed';
  LEVEL_SWITCHING: 'hlsLevelSwitching';
  LEVEL_SWITCHED: 'hlsLevelSwitched';
  LEVEL_LOADING: 'hlsLevelLoading';
  LEVEL_LOADED: 'hlsLevelLoaded';
  LEVEL_UPDATED: 'hlsLevelUpdated';
  LEVEL_PTS_UPDATED: 'hlsLevelPtsUpdated';
  LEVELS_UPDATED: 'hlsLevelsUpdated';
  AUDIO_TRACKS_UPDATED: 'hlsAudioTracksUpdated';
  AUDIO_TRACK_SWITCHING: 'hlsAudioTrackSwitching';
  AUDIO_TRACK_SWITCHED: 'hlsAudioTrackSwitched';
  AUDIO_TRACK_LOADING: 'hlsAudioTrackLoading';
  AUDIO_TRACK_LOADED: 'hlsAudioTrackLoaded';
  SUBTITLE_TRACKS_UPDATED: 'hlsSubtitleTracksUpdated';
  SUBTITLE_TRACKS_CLEARED: 'hlsSubtitleTracksCleared';
  SUBTITLE_TRACK_SWITCH: 'hlsSubtitleTrackSwitch';
  SUBTITLE_TRACK_LOADING: 'hlsSubtitleTrackLoading';
  SUBTITLE_TRACK_LOADED: 'hlsSubtitleTrackLoaded';
  SUBTITLE_FRAG_PROCESSED: 'hlsSubtitleFragProcessed';
  CUES_PARSED: 'hlsCuesParsed';
  NON_NATIVE_TEXT_TRACKS_FOUND: 'hlsNonNativeTextTracksFound';
  INIT_PTS_FOUND: 'hlsInitPtsFound';
  FRAG_LOADING: 'hlsFragLoading';
  FRAG_LOAD_EMERGENCY_ABORTED: 'hlsFragLoadEmergencyAborted';
  FRAG_LOADED: 'hlsFragLoaded';
  FRAG_DECRYPTED: 'hlsFragDecrypted';
  FRAG_PARSING_INIT_SEGMENT: 'hlsFragParsingInitSegment';
  FRAG_PARSING_USERDATA: 'hlsFragParsingUserdata';
  FRAG_PARSING_METADATA: 'hlsFragParsingMetadata';
  FRAG_PARSED: 'hlsFragParsed';
  FRAG_BUFFERED: 'hlsFragBuffered';
  FRAG_CHANGED: 'hlsFragChanged';
  FPS_DROP: 'hlsFpsDrop';
  FPS_DROP_LEVEL_CAPPING: 'hlsFpsDropLevelCapping';
  ERROR: 'hlsError';
  DESTROYING: 'hlsDestroying';
  KEY_LOADING: 'hlsKeyLoading';
  KEY_LOADED: 'hlsKeyLoaded';
  LIVE_BACK_BUFFER_REACHED: 'hlsLiveBackBufferReached';
  BACK_BUFFER_REACHED: 'hlsBackBufferReached';
}

export interface PlayerCustomEvents {
  PLAYER_STATE: 'PLAYER_STATE';
}

export type EventCallbackMap = {
  [key in keyof Partial<AudioEvents>]: (
    event: Event,
    audioInstance: HTMLAudioElement,
    playLogEnabled: boolean,
  ) => void;
};

export type HlsEventCallbackMap = {
  [key in keyof Partial<HlsEvents>]: (
    event: Event,
    data: any,
    hlsInstance: Hls,
    playLogEnabled: boolean,
  ) => void;
};

export type EventListenersList = Array<keyof AudioEvents> | Array<keyof PlayerCustomEvents>;

// ==================== EQUALIZER TYPES ====================

export type EqualizerStatus = 'IDEAL' | 'RUNNING' | 'SUSPENDED' | 'CLOSED';

export interface EqualizerBand {
  type: BiquadFilterType;
  frequency: number;
  Q: number;
  gain: number;
}

export interface EqualizerPresets {
  FLAT: number[];
  ACOUSTIC: number[];
  BASS_BOOSTER: number[];
  BASS_REDUCER: number[];
  CLASSICAL: number[];
  DEEP: number[];
  ELECTRONIC: number[];
  LATIN: number[];
  LOUDNESS: number[];
  LOUNGE: number[];
  PIANO: number[];
  POP: number[];
  RNB: number[];
  ROCK: number[];
  SMALL_SPEAKERS: number[];
  SPOKEN_WORD: number[];
  TREBLE_BOOSTER: number[];
  TREBLE_REDUCER: number[];
  VOCAL_BOOSTER: number[];
}

// ==================== ERROR TYPES ====================

export interface ErrorEvents {
  MEDIA_ERR_ABORTED: 'Media playback was aborted';
  MEDIA_ERR_NETWORK: 'Network error occurred';
  MEDIA_ERR_DECODE: 'Media decoding error';
  MEDIA_ERR_SRC_NOT_SUPPORTED: 'Media source not supported';
}

export interface ErrorMessageMap {
  MEDIA_ERR_ABORTED: string;
  MEDIA_ERR_DECODE: string;
  MEDIA_ERR_NETWORK: string;
  MEDIA_ERR_SRC_NOT_SUPPORTED: string;
  DEFAULT: string;
}

// ==================== TYPE ALIASES FOR BACKWARD COMPATIBILITY ====================

/** @deprecated Use PlayerConfiguration instead */
export type AudioInit = PlayerConfiguration;

/** @deprecated Use PlayerState instead */
export type AudioState = PlayerState;

/** @deprecated Use PlayerError instead */
export type AudioError = PlayerError;

/** @deprecated Use PlaybackState instead */
export type PlayBackState = PlaybackState;

/** @deprecated Use EventCallbackMap instead */
export type EventListenerCallbackMap = EventCallbackMap;

/** @deprecated Use EqualizerBand instead */
export type Band = EqualizerBand;

/** @deprecated Use EqualizerPresets instead */
export type Preset = EqualizerPresets;

/** @deprecated Use HlsEventCallbackMap instead */
export type HlsEventsCallbackMap = HlsEventCallbackMap;

/** @deprecated Use EventListenersList instead */
export type EventListenersListLegacy = EventListenersList;
