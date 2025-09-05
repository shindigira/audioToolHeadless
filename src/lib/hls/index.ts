import type { MediaTrack } from '@/types';

/**
 * HLS Manager for handling HLS streams using hls.js
 */
export class HlsManager {
  private hlsInstance: any = null;
  private isHlsSupported = false;
  private isLoggingEnabled = false;

  constructor() {
    this.checkHlsSupport();
  }

  /**
   * Initialize HLS manager
   * @param enableLogging - Whether to enable HLS logging
   * @param hlsConfig - HLS configuration options
   */
  async initialize(enableLogging = false, hlsConfig: any = {}): Promise<void> {
    this.isLoggingEnabled = enableLogging;

    if (this.isHlsSupported) {
      await this.loadHlsLibrary();
      await this.createHlsInstance(hlsConfig);
    }
  }

  /**
   * Check if HLS is supported
   * @private
   */
  private checkHlsSupport(): void {
    // Check if browser has native HLS support
    const audio = document.createElement('audio');
    const hasNativeHls = audio.canPlayType('application/vnd.apple.mpegurl') !== '';

    // If no native support, check if hls.js is available or can be loaded
    this.isHlsSupported = hasNativeHls || typeof window !== 'undefined';
  }

  /**
   * Load hls.js library dynamically
   * @private
   */
  private async loadHlsLibrary(): Promise<void> {
    if (typeof window === 'undefined') return;

    // Check if Hls is already available
    if ((window as any).Hls) {
      return;
    }

    try {
      // Try to import hls.js if available
      const { default: Hls } = await import('hls.js');
      (window as any).Hls = Hls;
    } catch (_error) {
      console.warn('HlsManager: hls.js not found, HLS streams will not be supported');
      this.isHlsSupported = false;
    }
  }

  /**
   * Create HLS instance
   * @private
   */
  private async createHlsInstance(config: any): Promise<void> {
    const Hls = (window as any).Hls;

    if (!Hls || !Hls.isSupported()) {
      this.isHlsSupported = false;
      return;
    }

    const defaultConfig = {
      debug: this.isLoggingEnabled,
      enableWorker: true,
      lowLatencyMode: false,
      ...config,
    };

    this.hlsInstance = new Hls(defaultConfig);

    if (this.isLoggingEnabled) {
      this.attachHlsEventListeners();
    }
  }

  /**
   * Attach HLS event listeners for debugging
   * @private
   */
  private attachHlsEventListeners(): void {
    if (!this.hlsInstance) return;

    this.hlsInstance.on((window as any).Hls.Events.ERROR, (_event: any, data: any) => {
      if (data.fatal) {
        console.error('HlsManager: Fatal error:', data);
      } else {
        console.warn('HlsManager: Non-fatal error:', data);
      }
    });

    this.hlsInstance.on((window as any).Hls.Events.MANIFEST_LOADED, () => {
      console.log('HlsManager: Manifest loaded successfully');
    });
  }

  /**
   * Load HLS media
   * @param track - Media track with HLS source
   */
  async loadMedia(track: MediaTrack): Promise<void> {
    if (!this.isHlsSupported || !this.hlsInstance) {
      throw new Error('HlsManager: HLS not supported or not initialized');
    }

    const audioElement = (globalThis as any).getAudioElement?.();
    if (!audioElement) {
      throw new Error('HlsManager: Audio element not available');
    }

    this.hlsInstance.attachMedia(audioElement);
    this.hlsInstance.loadSource(track.source);
  }

  /**
   * Get HLS instance
   * @returns HLS instance or null
   */
  getHlsInstance(): any {
    return this.hlsInstance;
  }

  /**
   * Check if HLS is supported
   * @returns True if HLS is supported
   */
  isSupported(): boolean {
    return this.isHlsSupported;
  }

  /**
   * Destroy HLS instance and cleanup
   */
  async destroy(): Promise<void> {
    if (this.hlsInstance) {
      this.hlsInstance.destroy();
      this.hlsInstance = null;
    }
  }
}
