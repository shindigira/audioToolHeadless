import type { MediaTrack, QueuePlaybackType } from '@/types';
import { ValidationUtils } from './validation';

/**
 * Queue management utility for the audio player
 */
export class QueueManager {
  private queue: MediaTrack[] = [];

  /**
   * Set the queue with specific playback type
   * @param tracks - Array of tracks
   * @param playbackType - Type of playback ordering
   */
  setQueue(tracks: MediaTrack[], playbackType: QueuePlaybackType): void {
    if (!ValidationUtils.isValidArray(tracks)) {
      throw new Error('QueueManager: Invalid tracks array provided');
    }

    const tracksCopy = [...tracks];

    switch (playbackType) {
      case 'DEFAULT':
        this.queue = tracksCopy;
        break;
      case 'REVERSE':
        this.queue = tracksCopy.reverse();
        break;
      case 'SHUFFLE':
        this.queue = this.shuffleArray(tracksCopy);
        break;
      default:
        this.queue = tracksCopy;
        break;
    }
  }

  /**
   * Get the current queue
   * @returns Array of tracks
   */
  getQueue(): MediaTrack[] {
    return [...this.queue];
  }

  /**
   * Add tracks to the queue
   * @param tracks - Single track or array of tracks
   */
  addToQueue(tracks: MediaTrack | MediaTrack[]): void {
    const tracksArray = Array.isArray(tracks) ? tracks : [tracks];
    this.queue.push(...tracksArray);
  }

  /**
   * Remove track from queue by ID
   * @param trackId - ID of track to remove
   * @returns True if track was removed
   */
  removeFromQueue(trackId: string): boolean {
    const initialLength = this.queue.length;
    this.queue = this.queue.filter((track) => track.id !== trackId);
    return this.queue.length < initialLength;
  }

  /**
   * Clear the entire queue
   */
  clearQueue(): void {
    this.queue = [];
  }

  /**
   * Get queue length
   * @returns Number of tracks in queue
   */
  getQueueLength(): number {
    return this.queue.length;
  }

  /**
   * Get track at specific index
   * @param index - Index of track
   * @returns Track at index or undefined
   */
  getTrackAt(index: number): MediaTrack | undefined {
    return this.queue[index];
  }

  /**
   * Find track index by ID
   * @param trackId - ID of track to find
   * @returns Index of track or -1 if not found
   */
  findTrackIndex(trackId: string): number {
    return this.queue.findIndex((track) => track.id === trackId);
  }

  /**
   * Move track to new position
   * @param fromIndex - Current index
   * @param toIndex - Target index
   * @returns True if move was successful
   */
  moveTrack(fromIndex: number, toIndex: number): boolean {
    if (
      fromIndex < 0 ||
      fromIndex >= this.queue.length ||
      toIndex < 0 ||
      toIndex >= this.queue.length
    ) {
      return false;
    }

    const track = this.queue.splice(fromIndex, 1)[0];
    if (track) {
      this.queue.splice(toIndex, 0, track);
    }
    return true;
  }

  /**
   * Shuffle the queue using Fisher-Yates algorithm
   * @param currentTrackId - Optional current track ID to keep at current position
   * @returns Shuffled queue
   */
  shuffleQueue(currentTrackId?: string): MediaTrack[] {
    let currentTrack: MediaTrack | undefined;
    let currentIndex = -1;

    if (currentTrackId) {
      currentIndex = this.findTrackIndex(currentTrackId);
      if (currentIndex > -1) {
        currentTrack = this.queue[currentIndex];
      }
    }

    // Create shuffled copy
    const shuffled = this.shuffleArray([...this.queue]);

    // If we have a current track, ensure it stays in a reasonable position
    if (currentTrack && currentIndex > -1) {
      const newIndex = shuffled.findIndex((track) => track.id === currentTrackId);
      if (newIndex > -1 && newIndex !== currentIndex) {
        // Swap current track to its original relative position
        const trackAtCurrent = shuffled[currentIndex];
        const trackAtNew = shuffled[newIndex];
        if (trackAtCurrent && trackAtNew) {
          shuffled[currentIndex] = trackAtNew;
          shuffled[newIndex] = trackAtCurrent;
        }
      }
    }

    this.queue = shuffled;
    return [...this.queue];
  }

  /**
   * Shuffle an array using Fisher-Yates algorithm
   * @param array - Array to shuffle
   * @returns New shuffled array
   */
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = shuffled[i];
      const other = shuffled[j];
      if (temp !== undefined && other !== undefined) {
        shuffled[i] = other;
        shuffled[j] = temp;
      }
    }

    return shuffled;
  }

  /**
   * Get next track index with loop support
   * @param currentIndex - Current track index
   * @param loopMode - Current loop mode
   * @returns Next track index or -1 if no next track
   */
  getNextTrackIndex(currentIndex: number, loopMode: 'OFF' | 'SINGLE' | 'QUEUE'): number {
    switch (loopMode) {
      case 'SINGLE':
        return currentIndex; // Stay on same track
      case 'QUEUE':
        return currentIndex + 1 >= this.queue.length ? 0 : currentIndex + 1;
      case 'OFF':
        return currentIndex + 1 < this.queue.length ? currentIndex + 1 : -1;
      default:
        return currentIndex + 1 < this.queue.length ? currentIndex + 1 : -1;
    }
  }

  /**
   * Get previous track index
   * @param currentIndex - Current track index
   * @returns Previous track index or -1 if no previous track
   */
  getPreviousTrackIndex(currentIndex: number): number {
    return currentIndex > 0 ? currentIndex - 1 : -1;
  }

  /**
   * Check if queue is empty
   * @returns True if queue is empty
   */
  isEmpty(): boolean {
    return this.queue.length === 0;
  }

  /**
   * Get queue statistics
   * @returns Object with queue statistics
   */
  getQueueStats(): {
    totalTracks: number;
    totalDuration: number;
    averageDuration: number;
  } {
    const totalTracks = this.queue.length;
    const totalDuration = this.queue.reduce((sum, track) => {
      return sum + (track.duration || 0);
    }, 0);
    const averageDuration = totalTracks > 0 ? totalDuration / totalTracks : 0;

    return {
      totalTracks,
      totalDuration,
      averageDuration,
    };
  }
}
