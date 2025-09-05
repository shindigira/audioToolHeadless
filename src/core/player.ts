import { PLAYBACK_STATES, PLAYER_CONSTANTS } from '@/config';
import { Equalizer } from '@/lib/equalizer';
import { HlsManager } from '@/lib/hls';
import { MediaSessionManager } from '@/lib/media-session';
import type {
  EqualizerPresets,
  EqualizerStatus,
  LoopMode,
  MediaTrack,
  PlaybackRate,
  PlayerConfiguration,
  PlayerState,
  QueuePlaybackType,
} from '@/types';
import { EventEmitter, PlaybackUtils, QueueManager, ValidationUtils } from '@/utils';

let globalAudioElement: HTMLAudioElement;

/**
 * AudioHeadless - A modern, headless audio player with HLS support,
 * equalizer, queue management, and media session integration.
 */
export class AudioHeadless {
  // Core audio element and singleton management
  private audioElement!: HTMLAudioElement;
  private static playerInstance: AudioHeadless;

  // Configuration and state
  private isPlaybackLoggingEnabled!: boolean;
  private isEqualizerEnabled = false;
  private shouldShowNotifications = false;

  // Queue and playback management
  private playbackQueue!: MediaTrack[];
  private currentTrackIndex = 0;
  private originalPlaybackQueue: MediaTrack[] = [];
  private isShuffleEnabled = false;
  private currentLoopMode: LoopMode = 'OFF';

  // Media loading and processing
  private mediaFetchFunction!: (track: MediaTrack) => Promise<void>;

  // Audio processing modules
  private equalizerStatus: EqualizerStatus = 'IDEAL';
  private equalizerInstance!: Equalizer;
  private hlsManager!: HlsManager;
  private mediaSessionManager!: MediaSessionManager;

  // Event management
  private eventEmitter!: EventEmitter;
  private queueManager!: QueueManager;

  constructor() {
    if (AudioHeadless.playerInstance) {
      console.warn(
        'AudioHeadless: Multiple instances detected. Returning existing singleton instance.',
      );
      // biome-ignore lint/correctness/noConstructorReturn: Singleton pattern requirement
      return AudioHeadless.playerInstance;
    }

    if (process.env.NODE_ENV !== PLAYER_CONSTANTS.DEVELOPMENT && globalAudioElement) {
      throw new Error('AudioHeadless: Cannot create multiple audio instances in production.');
    }

    // Store singleton instance
    AudioHeadless.playerInstance = this;
    this.audioElement = new Audio();
    globalAudioElement = this.audioElement;

    // Initialize core utilities
    this.initializeCoreModules();
  }

  /**
   * Initialize core utility modules
   * @private
   */
  private initializeCoreModules(): void {
    this.eventEmitter = new EventEmitter();
    this.queueManager = new QueueManager();
  }

  /**
   * Initialize the audio player with configuration
   * @param config - Player configuration options
   */
  async initialize(config: PlayerConfiguration): Promise<void> {
    const {
      preloadStrategy = 'auto',
      autoPlay = false,
      useDefaultEventListeners = true,
      customEventListeners = null,
      showNotificationActions = false,
      enablePlayLog = false,
      enableHls = false,
      enableEqualizer = false,
      crossOrigin = null,
      hlsConfig = {},
    } = config;

    // Configure audio element
    this.audioElement.setAttribute('id', 'audioheadless_instance');
    this.audioElement.preload = preloadStrategy;
    this.audioElement.autoplay = autoPlay;
    this.audioElement.crossOrigin = crossOrigin;

    // Store configuration
    this.isPlaybackLoggingEnabled = enablePlayLog;
    this.isEqualizerEnabled = enableEqualizer;
    this.shouldShowNotifications = showNotificationActions;

    // Initialize event listeners
    await this.initializeEventListeners(
      useDefaultEventListeners,
      customEventListeners,
      enablePlayLog,
    );

    // Initialize optional modules
    if (showNotificationActions) {
      this.mediaSessionManager = new MediaSessionManager();
      await this.mediaSessionManager.initialize(this.audioElement);
    }

    if (enableHls) {
      this.hlsManager = new HlsManager();
      await this.hlsManager.initialize(enablePlayLog, hlsConfig);
    }

    if (enableEqualizer) {
      await this.initializeEqualizer();
    }
  }

  /**
   * Initialize event listeners for the audio element
   * @private
   */
  private async initializeEventListeners(
    _useDefault: boolean,
    _customListeners: any,
    _enableLogging: boolean,
  ): Promise<void> {
    // Implementation would attach event listeners
    // This is a placeholder for the actual implementation
  }

  /**
   * Initialize the equalizer module
   * @private
   */
  private async initializeEqualizer(): Promise<void> {
    try {
      this.equalizerInstance = new Equalizer();
      this.equalizerInstance.initializeWithAudioElement(this.audioElement);
      this.equalizerStatus = this.equalizerInstance.status();
    } catch (error) {
      console.error('AudioHeadless: Failed to initialize equalizer:', error);
      this.equalizerStatus = 'CLOSED';
    }
  }

  // ==================== MEDIA LOADING METHODS ====================

  /**
   * Load a media track into the player
   * @param track - The media track to load
   * @param fetchFunction - Optional function to fetch track data
   */
  async loadTrack(
    track: MediaTrack,
    fetchFunction?: (track: MediaTrack) => Promise<void>,
  ): Promise<void> {
    if (!track) {
      throw new Error('AudioHeadless: No media track provided');
    }

    if (fetchFunction && !track.source.length) {
      this.mediaFetchFunction = fetchFunction;
    }

    // Update queue index if track exists in queue
    this.updateCurrentTrackIndex(track);

    const isHlsStream = track.source.includes('.m3u8');

    if (this.isPlaybackLoggingEnabled) {
      PlaybackUtils.calculateActualPlayedLength(globalAudioElement, 'TRACK_CHANGE');
    }

    // Handle HLS streams
    if (isHlsStream && !this.audioElement.canPlayType('application/vnd.apple.mpegurl')) {
      await this.loadHlsStream(track);
    } else {
      this.audioElement.src = track.source;
    }

    // Notify state change and update metadata
    this.emitStateChange({
      playbackState: PLAYBACK_STATES.TRACK_CHANGE,
      currentTrackPlayTime: 0,
      currentTrack: track,
    });

    if (this.mediaSessionManager) {
      this.mediaSessionManager.updateMetadata(track);
    }

    this.audioElement.load();
  }

  /**
   * Load and immediately play a media track
   * @param track - The media track to load and play
   * @param fetchFunction - Optional function to fetch track data
   */
  async loadAndPlay(
    track?: MediaTrack | null,
    fetchFunction?: (track: MediaTrack) => Promise<void>,
  ): Promise<void> {
    const targetTrack =
      track || (this.playbackQueue?.length > 0 ? this.playbackQueue[0] : undefined);

    if (
      fetchFunction &&
      ValidationUtils.isValidFunction(fetchFunction) &&
      targetTrack?.source.length
    ) {
      this.mediaFetchFunction = fetchFunction;
      await fetchFunction(targetTrack);
    }

    if (!targetTrack) {
      throw new Error('AudioHeadless: No media track available for playback');
    }

    await this.loadTrack(targetTrack);

    // Auto-play with delay to ensure loading
    if (this.audioElement.readyState >= 4) {
      setTimeout(async () => {
        await this.play();
        if (this.isEqualizerEnabled) {
          await this.initializeEqualizer();
        }
      }, 950);
    }
  }

  /**
   * Load HLS stream using HLS manager
   * @private
   */
  private async loadHlsStream(track: MediaTrack): Promise<void> {
    if (!this.hlsManager) {
      console.warn(
        'AudioHeadless: HLS stream detected but HLS support not enabled. ' +
          'Please enable HLS in player configuration.',
      );
      await this.reset();
      return;
    }

    const hlsInstance = this.hlsManager.getHlsInstance();
    if (hlsInstance) {
      hlsInstance.detachMedia();
      await this.hlsManager.loadMedia(track);
    }
  }

  // ==================== PLAYBACK CONTROL METHODS ====================

  /**
   * Start audio playback
   */
  async play(): Promise<void> {
    const hasSource = this.audioElement.src !== '';
    const isReady = this.audioElement.readyState >= 4;

    if (this.audioElement.paused && isReady && hasSource) {
      try {
        await this.audioElement.play();
        console.log('AudioHeadless: Playback started');
      } catch (error) {
        console.warn('AudioHeadless: Playback cancelled or failed:', error);
      }
    }

    if (this.isEqualizerEnabled && this.equalizerStatus === 'IDEAL') {
      await this.initializeEqualizer();
    }
  }

  /**
   * Pause audio playback
   */
  pause(): void {
    if (this.audioElement && !this.audioElement.paused) {
      this.audioElement.pause();
    }
  }

  /**
   * Stop audio playback and reset position
   */
  stop(): void {
    if (this.audioElement && !this.audioElement.paused) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }
  }

  // ==================== VOLUME AND PLAYBACK RATE METHODS ====================

  /**
   * Set audio volume (0-100)
   * @param volume - Volume level between 0 and 100
   */
  setVolume(volume: number): void {
    if (volume < 0 || volume > 100) {
      throw new Error('AudioHeadless: Volume must be between 0 and 100');
    }

    const normalizedVolume = volume / 100;
    this.audioElement.volume = normalizedVolume;

    this.emitStateChange({ volume });
  }

  /**
   * Get current volume (0-100)
   */
  getVolume(): number {
    return Math.round(this.audioElement.volume * 100);
  }

  /**
   * Set playback rate
   * @param rate - Playback rate multiplier
   */
  setPlaybackRate(rate: PlaybackRate): void {
    this.audioElement.playbackRate = rate;
    this.emitStateChange({ playbackRate: rate });
  }

  /**
   * Get current playback rate
   */
  getPlaybackRate(): PlaybackRate {
    return this.audioElement.playbackRate as PlaybackRate;
  }

  /**
   * Seek to specific time in seconds
   * @param seconds - Time position in seconds
   */
  seekToTime(seconds: number): void {
    if (seconds < 0) {
      throw new Error('AudioHeadless: Seek time cannot be negative');
    }
    this.audioElement.currentTime = seconds;
  }

  /**
   * Seek by relative time offset
   * @param seconds - Time offset in seconds (can be negative)
   */
  seekByTime(seconds: number): void {
    const newTime = this.audioElement.currentTime + seconds;
    this.seekToTime(Math.max(0, newTime));
  }

  /**
   * Mute audio
   */
  mute(): void {
    this.audioElement.muted = true;
  }

  /**
   * Unmute audio
   */
  unmute(): void {
    this.audioElement.muted = false;
  }

  /**
   * Check if audio is muted
   */
  isMuted(): boolean {
    return this.audioElement.muted;
  }

  // ==================== QUEUE MANAGEMENT METHODS ====================

  /**
   * Set the playback queue
   * @param tracks - Array of media tracks
   * @param playbackType - Type of queue playback (default, reverse, shuffle)
   */
  setQueue(tracks: MediaTrack[], playbackType: QueuePlaybackType = 'DEFAULT'): void {
    this.clearQueue();

    if (!ValidationUtils.isValidArray(tracks)) {
      console.warn('AudioHeadless: Invalid tracks array provided');
      return;
    }

    this.queueManager.setQueue(tracks, playbackType);
    this.playbackQueue = this.queueManager.getQueue();

    if (playbackType === 'SHUFFLE') {
      this.isShuffleEnabled = true;
      this.originalPlaybackQueue = [...tracks];
    }

    this.emitQueueChange();
  }

  /**
   * Add tracks to the current queue
   * @param tracks - Single track or array of tracks to add
   */
  addToQueue(tracks: MediaTrack | MediaTrack[]): void {
    const tracksArray = Array.isArray(tracks) ? tracks : [tracks];

    if (this.playbackQueue) {
      this.playbackQueue.push(...tracksArray);
    } else {
      this.playbackQueue = tracksArray;
    }
  }

  /**
   * Remove track from queue by ID
   * @param trackId - ID of the track to remove
   */
  removeFromQueue(trackId: string): void {
    if (this.playbackQueue) {
      this.playbackQueue = this.playbackQueue.filter((track) => track.id !== trackId);
    }
  }

  /**
   * Clear the entire queue
   */
  clearQueue(): void {
    this.playbackQueue = [];
    this.currentTrackIndex = 0;
    this.originalPlaybackQueue = [];
    this.isShuffleEnabled = false;
  }

  /**
   * Get current queue
   */
  getQueue(): MediaTrack[] {
    return this.playbackQueue || [];
  }

  /**
   * Get current track index
   */
  getCurrentTrackIndex(): number {
    return this.currentTrackIndex;
  }

  /**
   * Play next track in queue
   */
  async playNext(): Promise<void> {
    const nextIndex = this.currentTrackIndex + 1;
    if (this.playbackQueue?.length > nextIndex) {
      const nextTrack = this.playbackQueue[nextIndex];
      await this.loadAndPlay(nextTrack, this.mediaFetchFunction);
      this.currentTrackIndex = nextIndex;
    } else {
      this.stop();
      this.emitStateChange({ playbackState: PLAYBACK_STATES.QUEUE_ENDED });
    }
  }

  /**
   * Play previous track in queue
   */
  async playPrevious(): Promise<void> {
    const previousIndex = this.currentTrackIndex - 1;
    if (previousIndex >= 0) {
      const previousTrack = this.playbackQueue[previousIndex];
      await this.loadAndPlay(previousTrack, this.mediaFetchFunction);
      this.currentTrackIndex = previousIndex;
    } else {
      console.log('AudioHeadless: Already at the beginning of the queue');
    }
  }

  /**
   * Play track at specific index
   * @param index - Index of track to play
   */
  async playTrackAt(index: number): Promise<void> {
    if (index < 0 || index >= this.playbackQueue.length) {
      throw new Error('AudioHeadless: Track index out of bounds');
    }

    const track = this.playbackQueue[index];
    await this.loadAndPlay(track, this.mediaFetchFunction);
    this.currentTrackIndex = index;
  }

  // ==================== SHUFFLE AND LOOP METHODS ====================

  /**
   * Enable or disable shuffle mode
   * @param enabled - Whether to enable shuffle
   */
  enableShuffle(enabled: boolean): void {
    if (enabled && !this.isShuffleEnabled) {
      this.originalPlaybackQueue = [...this.playbackQueue];
      // Set the queue in the queue manager first
      this.queueManager.setQueue(this.playbackQueue, 'SHUFFLE');
      this.playbackQueue = this.queueManager.getQueue();
      this.isShuffleEnabled = true;
    } else if (!enabled && this.isShuffleEnabled) {
      this.playbackQueue = [...this.originalPlaybackQueue];
      this.isShuffleEnabled = false;
    }
  }

  /**
   * Check if shuffle is enabled
   */
  isShuffleActive(): boolean {
    return this.isShuffleEnabled;
  }

  /**
   * Set loop mode
   * @param mode - Loop mode (SINGLE, QUEUE, OFF)
   */
  setLoopMode(mode: LoopMode): void {
    this.currentLoopMode = mode;
    PlaybackUtils.handleLoopPlayback(mode);
  }

  /**
   * Get current loop mode
   */
  getLoopMode(): LoopMode {
    return this.currentLoopMode;
  }

  // ==================== EQUALIZER METHODS ====================

  /**
   * Get available equalizer presets
   */
  getEqualizerPresets(): EqualizerPresets {
    return Equalizer.getPresets();
  }

  /**
   * Set equalizer preset
   * @param presetName - Name of the preset to apply
   */
  setEqualizerPreset(presetName: keyof EqualizerPresets): void {
    if (!this.isEqualizerEnabled) {
      throw new Error('AudioHeadless: Equalizer not enabled. Enable it in player configuration.');
    }
    this.equalizerInstance.setPreset(presetName);
  }

  /**
   * Set custom equalizer gains
   * @param gains - Array of gain values for each band
   */
  setCustomEqualizer(gains: number[]): void {
    if (!this.isEqualizerEnabled) {
      throw new Error('AudioHeadless: Equalizer not enabled. Enable it in player configuration.');
    }
    this.equalizerInstance.setCustomEQ(gains);
  }

  /**
   * Enable or disable bass boost
   * @param enabled - Whether to enable bass boost
   * @param boost - Boost amount (default: 6)
   */
  enableBassBoost(enabled: boolean, boost = 6): void {
    if (!this.isEqualizerEnabled) {
      throw new Error('AudioHeadless: Equalizer not enabled. Enable it in player configuration.');
    }
    this.equalizerInstance.setBassBoost(enabled, boost);
  }

  /**
   * Get equalizer status
   */
  getEqualizerState(): EqualizerStatus {
    return this.equalizerStatus;
  }

  // ==================== STATE AND EVENT METHODS ====================

  /**
   * Subscribe to state changes
   * @param callback - Function to call when state changes
   * @returns Unsubscribe function
   */
  onStateChange(callback: (state: PlayerState) => void): () => void {
    return this.eventEmitter.subscribe('PLAYER_STATE', callback);
  }

  /**
   * Get current player state
   */
  getCurrentState(): PlayerState {
    // Return current state object
    return {
      playbackState: this.audioElement.paused ? 'paused' : 'playing',
      currentTrack: this.playbackQueue?.[this.currentTrackIndex] || null,
      volume: this.getVolume(),
      playbackRate: this.getPlaybackRate(),
      duration: this.audioElement.duration,
      // ... other state properties
    } as PlayerState;
  }

  /**
   * Add event listener to audio element
   * @param event - Event name
   * @param callback - Event callback
   */
  addEventListener(event: keyof HTMLMediaElementEventMap, callback: EventListener): void {
    this.audioElement.addEventListener(event, callback);
  }

  /**
   * Remove event listener from audio element
   * @param event - Event name
   * @param callback - Event callback
   */
  removeEventListener(event: keyof HTMLMediaElementEventMap, callback: EventListener): void {
    this.audioElement.removeEventListener(event, callback);
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Reset player to initial state
   */
  async reset(): Promise<void> {
    if (this.audioElement) {
      this.stop();
      this.audioElement.src = '';
      this.audioElement.srcObject = null;
    }
  }

  /**
   * Destroy player instance and cleanup resources
   */
  async destroy(): Promise<void> {
    await this.reset();
    if (this.audioElement) {
      this.audioElement.removeAttribute('src');
      this.audioElement.load();
    }

    // Cleanup modules
    if (this.hlsManager) {
      await this.hlsManager.destroy();
    }

    if (this.mediaSessionManager) {
      await this.mediaSessionManager.destroy();
    }
  }

  // ==================== STATIC METHODS ====================

  /**
   * Get singleton instance
   */
  static getInstance(): AudioHeadless {
    if (!AudioHeadless.playerInstance) {
      AudioHeadless.playerInstance = new AudioHeadless();
    }
    return AudioHeadless.playerInstance;
  }

  /**
   * Get audio element
   */
  static getAudioElement(): HTMLAudioElement {
    return globalAudioElement;
  }

  /**
   * Legacy method name for backward compatibility
   */
  static getAudioInstance(): HTMLAudioElement {
    return globalAudioElement;
  }

  // ==================== PRIVATE HELPER METHODS ====================

  /**
   * Update current track index based on track ID
   * @private
   */
  private updateCurrentTrackIndex(track: MediaTrack): void {
    if (ValidationUtils.isValidArray(this.playbackQueue)) {
      const index = this.playbackQueue.findIndex((t) => t.id === track.id);
      if (index > -1) {
        this.currentTrackIndex = index;
      }
    }
  }

  /**
   * Emit state change event
   * @private
   */
  private emitStateChange(partialState: Partial<PlayerState>): void {
    const currentState = this.getCurrentState();
    const newState = { ...currentState, ...partialState };
    this.eventEmitter.emit('PLAYER_STATE', newState);
  }

  /**
   * Emit queue change event
   * @private
   */
  private emitQueueChange(): void {
    // Handle queue change notifications
    if (this.shouldShowNotifications && this.mediaSessionManager) {
      this.mediaSessionManager.updateQueue(this.playbackQueue);
    }
  }
}

// Legacy export for backward compatibility
export { AudioHeadless as AudioX };
