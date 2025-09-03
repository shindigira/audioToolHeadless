/**
 * Headless Audio Player
 * A lightweight TypeScript module for audio playback without UI dependencies
 */

export class AudioPlayer {
  private audio: HTMLAudioElement;
  private isPlaying: boolean = false;

  constructor() {
    this.audio = new Audio();
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.audio.addEventListener('play', () => {
      this.isPlaying = true;
    });

    this.audio.addEventListener('pause', () => {
      this.isPlaying = false;
    });

    this.audio.addEventListener('ended', () => {
      this.isPlaying = false;
    });
  }

  /**
   * Load an audio file from URL
   */
  load(url: string): void {
    this.audio.src = url;
  }

  /**
   * Play the loaded audio
   */
  async play(): Promise<void> {
    try {
      await this.audio.play();
    } catch (error) {
      console.error('Failed to play audio:', error);
      throw error;
    }
  }

  /**
   * Pause the audio playback
   */
  pause(): void {
    this.audio.pause();
  }

  /**
   * Stop the audio and reset to beginning
   */
  stop(): void {
    this.audio.pause();
    this.audio.currentTime = 0;
  }

  /**
   * Set the volume (0-1)
   */
  setVolume(volume: number): void {
    this.audio.volume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Get current volume
   */
  getVolume(): number {
    return this.audio.volume;
  }

  /**
   * Seek to specific time in seconds
   */
  seek(time: number): void {
    this.audio.currentTime = time;
  }

  /**
   * Get current playback time in seconds
   */
  getCurrentTime(): number {
    return this.audio.currentTime;
  }

  /**
   * Get total duration in seconds
   */
  getDuration(): number {
    return this.audio.duration;
  }

  /**
   * Check if audio is currently playing
   */
  isAudioPlaying(): boolean {
    return this.isPlaying;
  }

  /**
   * Get the underlying HTMLAudioElement for advanced use
   */
  getAudioElement(): HTMLAudioElement {
    return this.audio;
  }
}

// Default export
export default AudioPlayer;

// Example usage (commented out for library use)
/*
const player = new AudioPlayer();
player.load('path/to/audio.mp3');
player.play();
*/
