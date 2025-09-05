import type { PlayerState } from '@/types';

type EventCallback = (data: any) => void;
type EventMap = Record<string, EventCallback[]>;

/**
 * Simple event emitter for player state management
 */
export class EventEmitter {
  private eventMap: EventMap = {};

  /**
   * Subscribe to an event
   * @param eventName - Name of the event
   * @param callback - Function to call when event is emitted
   * @returns Unsubscribe function
   */
  subscribe(eventName: string, callback: EventCallback): () => void {
    if (!this.eventMap[eventName]) {
      this.eventMap[eventName] = [];
    }

    this.eventMap[eventName].push(callback);

    // Return unsubscribe function
    return () => {
      this.unsubscribe(eventName, callback);
    };
  }

  /**
   * Unsubscribe from an event
   * @param eventName - Name of the event
   * @param callback - Function to remove
   */
  unsubscribe(eventName: string, callback: EventCallback): void {
    if (!this.eventMap[eventName]) return;

    const index = this.eventMap[eventName].indexOf(callback);
    if (index > -1) {
      this.eventMap[eventName].splice(index, 1);
    }
  }

  /**
   * Emit an event to all subscribers
   * @param eventName - Name of the event
   * @param data - Data to pass to callbacks
   */
  emit(eventName: string, data: any): void {
    if (!this.eventMap[eventName]) return;

    // Call all subscribers
    for (const callback of this.eventMap[eventName]) {
      try {
        callback(data);
      } catch (error) {
        console.error(`EventEmitter: Error in callback for event '${eventName}':`, error);
      }
    }
  }

  /**
   * Remove all listeners for an event
   * @param eventName - Name of the event
   */
  removeAllListeners(eventName?: string): void {
    if (eventName) {
      delete this.eventMap[eventName];
    } else {
      this.eventMap = {};
    }
  }

  /**
   * Get the number of listeners for an event
   * @param eventName - Name of the event
   * @returns Number of listeners
   */
  listenerCount(eventName: string): number {
    return this.eventMap[eventName]?.length || 0;
  }

  /**
   * Get all event names that have listeners
   * @returns Array of event names
   */
  eventNames(): string[] {
    return Object.keys(this.eventMap);
  }
}
