import type { MediaTrack } from '@/types';

// This will be set by the main player
let globalAudioElement: HTMLAudioElement;

/**
 * Media Session Manager for OS-level media controls
 */
export class MediaSessionManager {
  private isSupported = false;
  private currentTrack: MediaTrack | null = null;

  constructor() {
    this.checkSupport();
  }

  /**
   * Initialize Media Session API
   * @param audioElement - The audio element to control
   */
  async initialize(audioElement?: HTMLAudioElement): Promise<void> {
    if (!this.isSupported) {
      console.warn('MediaSessionManager: Media Session API not supported');
      return;
    }

    if (audioElement) {
      globalAudioElement = audioElement;
    }

    this.setupActionHandlers();
  }

  /**
   * Check if Media Session API is supported
   * @private
   */
  private checkSupport(): void {
    this.isSupported = 'mediaSession' in navigator;
  }

  /**
   * Update media metadata
   * @param track - Current media track
   */
  updateMetadata(track: MediaTrack): void {
    if (!this.isSupported) return;

    this.currentTrack = track;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title || 'Unknown Title',
      artist: track.artist || 'Unknown Artist',
      album: track.album || 'Unknown Album',
      artwork: track.artwork
        ? Array.isArray(track.artwork)
          ? track.artwork.map((art) => ({
              src: art.src,
              sizes: art.sizes || '512x512',
              type: art.type || 'image/png',
            }))
          : [
              {
                src: (track.artwork as any).src,
                sizes: (track.artwork as any).sizes || '512x512',
                type: (track.artwork as any).type || 'image/png',
              },
            ]
        : [],
    });
  }

  /**
   * Update playback queue for media session
   * @param queue - Current playback queue
   */
  updateQueue(queue: MediaTrack[]): void {
    if (!this.isSupported) return;

    // Media Session API doesn't directly support queue display
    // This is a placeholder for future queue integration
    console.debug('MediaSessionManager: Queue updated with', queue.length, 'tracks');
  }

  /**
   * Set playback state
   * @param state - Playback state ('playing', 'paused', 'none')
   */
  setPlaybackState(state: 'playing' | 'paused' | 'none'): void {
    if (!this.isSupported) return;

    navigator.mediaSession.playbackState = state;
  }

  /**
   * Set position state
   * @param duration - Track duration in seconds
   * @param position - Current position in seconds
   * @param playbackRate - Current playback rate
   */
  setPositionState(duration: number, position: number, playbackRate = 1.0): void {
    if (!this.isSupported) return;

    try {
      navigator.mediaSession.setPositionState({
        duration: duration || 0,
        position: position || 0,
        playbackRate: playbackRate || 1.0,
      });
    } catch (error) {
      console.warn('MediaSessionManager: Failed to set position state:', error);
    }
  }

  /**
   * Setup media session action handlers
   * @private
   */
  private setupActionHandlers(): void {
    if (!this.isSupported) return;

    // Play action
    navigator.mediaSession.setActionHandler('play', () => {
      this.handleAction('play');
    });

    // Pause action
    navigator.mediaSession.setActionHandler('pause', () => {
      this.handleAction('pause');
    });

    // Previous track
    navigator.mediaSession.setActionHandler('previoustrack', () => {
      this.handleAction('previoustrack');
    });

    // Next track
    navigator.mediaSession.setActionHandler('nexttrack', () => {
      this.handleAction('nexttrack');
    });

    // Seek backward
    navigator.mediaSession.setActionHandler('seekbackward', (details) => {
      this.handleAction('seekbackward', details.seekOffset || 10);
    });

    // Seek forward
    navigator.mediaSession.setActionHandler('seekforward', (details) => {
      this.handleAction('seekforward', details.seekOffset || 10);
    });

    // Seek to position
    navigator.mediaSession.setActionHandler('seekto', (details) => {
      this.handleAction('seekto', details.seekTime || 0);
    });
  }

  /**
   * Handle media session actions
   * @private
   */
  private handleAction(action: string, value?: number): void {
    // Get the global audio element and player instance
    const audioElement = globalAudioElement;
    if (!audioElement) return;

    // Get the player instance - this would need to be set up properly in the main player
    const playerInstance = (globalThis as any).audioHeadlessInstance;

    switch (action) {
      case 'play':
        audioElement.play().catch(console.error);
        break;
      case 'pause':
        audioElement.pause();
        break;
      case 'previoustrack':
        playerInstance?.playPrevious?.();
        break;
      case 'nexttrack':
        playerInstance?.playNext?.();
        break;
      case 'seekbackward':
        if (value && audioElement.currentTime >= value) {
          audioElement.currentTime -= value;
        }
        break;
      case 'seekforward':
        if (value && audioElement.duration) {
          audioElement.currentTime = Math.min(
            audioElement.currentTime + value,
            audioElement.duration,
          );
        }
        break;
      case 'seekto':
        if (typeof value === 'number' && audioElement.duration) {
          audioElement.currentTime = Math.min(value, audioElement.duration);
        }
        break;
    }
  }

  /**
   * Clear media session metadata
   */
  clearMetadata(): void {
    if (!this.isSupported) return;

    navigator.mediaSession.metadata = null;
    this.currentTrack = null;
  }

  /**
   * Check if Media Session is supported
   * @returns True if supported
   */
  isMediaSessionSupported(): boolean {
    return this.isSupported;
  }

  /**
   * Destroy media session and cleanup
   */
  async destroy(): Promise<void> {
    if (!this.isSupported) return;

    this.clearMetadata();
    this.setPlaybackState('none');

    // Clear all action handlers
    const actions = [
      'play',
      'pause',
      'previoustrack',
      'nexttrack',
      'seekbackward',
      'seekforward',
      'seekto',
    ];
    for (const action of actions) {
      try {
        navigator.mediaSession.setActionHandler(action as any, null);
      } catch {
        // Ignore errors when clearing handlers
      }
    }
  }
}
