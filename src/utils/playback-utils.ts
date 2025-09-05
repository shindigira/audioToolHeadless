import type { LoopMode } from '@/types';

/**
 * Playback utility functions
 */
export class PlaybackUtils {
  private static playbackStartTime = 0;
  private static totalPlayTime = 0;

  /**
   * Calculate actual played length for analytics
   * @param audioElement - HTML audio element
   * @param event - Event type that triggered calculation
   */
  static calculateActualPlayedLength(audioElement: HTMLAudioElement, event: string): void {
    if (!audioElement) return;

    const currentTime = Date.now();
    const _currentPosition = audioElement.currentTime;

    switch (event) {
      case 'PLAY':
        PlaybackUtils.playbackStartTime = currentTime;
        break;
      case 'PAUSE':
      case 'ENDED':
      case 'TRACK_CHANGE':
        if (PlaybackUtils.playbackStartTime > 0) {
          const sessionDuration = currentTime - PlaybackUtils.playbackStartTime;
          PlaybackUtils.totalPlayTime += sessionDuration;
          PlaybackUtils.playbackStartTime = 0;

          console.debug('PlaybackUtils: Session duration:', sessionDuration, 'ms');
          console.debug('PlaybackUtils: Total play time:', PlaybackUtils.totalPlayTime, 'ms');
        }
        break;
    }
  }

  /**
   * Get total playback time
   * @returns Total playback time in milliseconds
   */
  static getTotalPlayTime(): number {
    return PlaybackUtils.totalPlayTime;
  }

  /**
   * Reset playback time tracking
   */
  static resetPlayTime(): void {
    PlaybackUtils.playbackStartTime = 0;
    PlaybackUtils.totalPlayTime = 0;
  }

  /**
   * Handle loop playback mode
   * @param loopMode - The loop mode to apply
   */
  static handleLoopPlayback(loopMode: LoopMode): void {
    // This would integrate with the main player's event system
    // For now, it's a placeholder for loop mode handling logic
    console.debug('PlaybackUtils: Loop mode set to:', loopMode);
  }

  /**
   * Handle queue playback progression
   */
  static handleQueuePlayback(): void {
    // This would handle automatic queue progression
    // Placeholder for queue progression logic
    console.debug('PlaybackUtils: Queue playback handler activated');
  }

  /**
   * Calculate playback progress percentage
   * @param currentTime - Current playback time
   * @param duration - Total track duration
   * @returns Progress percentage (0-100)
   */
  static calculateProgress(currentTime: number, duration: number): number {
    if (!duration || duration === 0) return 0;
    return Math.min(100, (currentTime / duration) * 100);
  }

  /**
   * Calculate remaining time
   * @param currentTime - Current playback time
   * @param duration - Total track duration
   * @returns Remaining time in seconds
   */
  static calculateRemainingTime(currentTime: number, duration: number): number {
    if (!duration || duration === 0) return 0;
    return Math.max(0, duration - currentTime);
  }

  /**
   * Format time for display
   * @param seconds - Time in seconds
   * @returns Formatted time string (MM:SS or HH:MM:SS)
   */
  static formatTime(seconds: number): string {
    if (!Number.isFinite(seconds) || seconds < 0) return '00:00';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const formatPart = (num: number): string => num.toString().padStart(2, '0');

    if (hours > 0) {
      return `${formatPart(hours)}:${formatPart(minutes)}:${formatPart(secs)}`;
    }
    return `${formatPart(minutes)}:${formatPart(secs)}`;
  }

  /**
   * Get buffered duration
   * @param audioElement - HTML audio element
   * @returns Buffered duration in seconds
   */
  static getBufferedDuration(audioElement: HTMLAudioElement): number {
    if (!audioElement.buffered || audioElement.buffered.length === 0) {
      return 0;
    }

    const buffered = audioElement.buffered;
    const currentTime = audioElement.currentTime;

    // Find the buffered range that contains the current time
    for (let i = 0; i < buffered.length; i++) {
      const start = buffered.start(i);
      const end = buffered.end(i);

      if (currentTime >= start && currentTime <= end) {
        return end - currentTime;
      }
    }

    return 0;
  }

  /**
   * Check if track can be played through without buffering
   * @param audioElement - HTML audio element
   * @returns True if track can play through
   */
  static canPlayThrough(audioElement: HTMLAudioElement): boolean {
    return audioElement.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA;
  }

  /**
   * Get playback rate adjusted duration
   * @param duration - Original duration
   * @param playbackRate - Current playback rate
   * @returns Adjusted duration
   */
  static getAdjustedDuration(duration: number, playbackRate: number): number {
    if (playbackRate <= 0) return duration;
    return duration / playbackRate;
  }

  /**
   * Smooth seek to prevent audio glitches
   * @param audioElement - HTML audio element
   * @param targetTime - Target time to seek to
   * @param smooth - Whether to use smooth seeking
   */
  static seekTo(audioElement: HTMLAudioElement, targetTime: number, smooth = true): void {
    if (!Number.isFinite(targetTime) || targetTime < 0) return;

    const duration = audioElement.duration;
    let adjustedTargetTime = targetTime;
    if (Number.isFinite(duration)) {
      adjustedTargetTime = Math.min(targetTime, duration - 0.1); // Prevent seeking to exact end
    }

    if (smooth && Math.abs(audioElement.currentTime - adjustedTargetTime) < 1) {
      // For small seeks, use smooth transition
      const steps = 5;
      const stepSize = (adjustedTargetTime - audioElement.currentTime) / steps;
      let currentStep = 0;

      const smoothSeek = () => {
        if (currentStep < steps) {
          audioElement.currentTime += stepSize;
          currentStep++;
          setTimeout(smoothSeek, 20);
        } else {
          audioElement.currentTime = adjustedTargetTime;
        }
      };

      smoothSeek();
    } else {
      audioElement.currentTime = adjustedTargetTime;
    }
  }
}
