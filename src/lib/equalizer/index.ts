import { EQUALIZER_BANDS, EQUALIZER_PRESETS } from '@/config';
import type { EqualizerPresets, EqualizerStatus } from '@/types';
import { ValidationUtils } from '@/utils';

/**
 * Professional audio equalizer with 10-band EQ and bass boost
 */
export class Equalizer {
  private static equalizerInstance: Equalizer;
  private audioContext!: AudioContext;
  private contextStatus!: EqualizerStatus;
  private filterBands!: BiquadFilterNode[];
  private bassBoostFilter!: BiquadFilterNode;
  private compressorNode!: DynamicsCompressorNode;
  private gainNode!: GainNode;

  constructor() {
    if (Equalizer.equalizerInstance) {
      console.warn(
        'Equalizer: Multiple instances detected. Returning existing **singleton** instance.',
      );
      // biome-ignore lint/correctness/noConstructorReturn: Singleton pattern requirement
      return Equalizer.equalizerInstance;
    }

    this.initializeAudioContext();

    // Store this instance as the **singleton** instance - ensures only one Equalizer
    // exists across the app for consistent audio processing and resource management
    Equalizer.equalizerInstance = this;
  }

  /**
   * Initialize AudioContext with browser compatibility
   * @private
   */
  private initializeAudioContext(): void {
    const contextOptions: AudioContextOptions = {
      latencyHint: 'playback',
      sampleRate: 44100,
    };

    try {
      if (typeof AudioContext !== 'undefined') {
        this.audioContext = new AudioContext(contextOptions);
      } else if (typeof (window as any).webkitAudioContext !== 'undefined') {
        this.audioContext = new (window as any).webkitAudioContext(contextOptions);
      } else {
        throw new Error('Web Audio API is not supported in this browser');
      }

      this.contextStatus = 'RUNNING';

      if (this.audioContext.state === 'suspended') {
        this.addContextResumeListener();
      }
    } catch (error) {
      console.error('Equalizer: Failed to initialize AudioContext:', error);
      this.contextStatus = 'CLOSED';
    }
  }

  /**
   * Add listener to resume AudioContext on user interaction
   * @private
   */
  private addContextResumeListener(): void {
    const resumeContext = () => {
      this.audioContext.resume();
      setTimeout(() => {
        if (this.audioContext.state === 'running') {
          document.body.removeEventListener('click', resumeContext, false);
          document.body.removeEventListener('touchstart', resumeContext, false);
        }
      }, 0);
    };

    document.body.addEventListener('click', resumeContext, false);
    document.body.addEventListener('touchstart', resumeContext, false);
  }

  /**
   * Initialize all audio processing nodes
   * @param audioElement - The HTML audio element to connect
   */
  initializeWithAudioElement(audioElement: HTMLAudioElement): void {
    try {
      const audioSource = this.audioContext.createMediaElementSource(audioElement);

      // Create equalizer filter bands
      this.filterBands = EQUALIZER_BANDS.map((bandConfig) => {
        const filter = this.audioContext.createBiquadFilter();
        filter.type = bandConfig.type;
        filter.frequency.value = bandConfig.frequency;
        filter.gain.value = bandConfig.gain;
        filter.Q.value = bandConfig.Q || 1;
        return filter;
      });

      // Create bass boost filter
      this.bassBoostFilter = this.audioContext.createBiquadFilter();
      this.bassBoostFilter.type = 'lowshelf';
      this.bassBoostFilter.frequency.value = 100;
      this.bassBoostFilter.gain.value = 0;

      // Create compressor for dynamic range control
      this.compressorNode = this.audioContext.createDynamicsCompressor();
      this.compressorNode.threshold.value = -24;
      this.compressorNode.knee.value = 30;
      this.compressorNode.ratio.value = 12;
      this.compressorNode.attack.value = 0.003;
      this.compressorNode.release.value = 0.25;

      // Create master gain node
      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.value = 1.0;

      // Connect the audio processing chain
      this.connectAudioChain(audioSource);

      this.contextStatus = 'RUNNING';
    } catch (error) {
      console.error('Equalizer: Failed to initialize audio nodes:', error);
      this.contextStatus = 'CLOSED';
    }
  }

  /**
   * Connect all audio nodes in the processing chain
   * @private
   */
  private connectAudioChain(audioSource: MediaElementAudioSourceNode): void {
    if (this.filterBands.length === 0) return;

    // Connect source to first filter
    const firstBand = this.filterBands[0];
    if (firstBand) {
      audioSource.connect(firstBand);
    }

    // Connect filter bands in series
    for (let i = 0; i < this.filterBands.length - 1; i++) {
      const currentBand = this.filterBands[i];
      const nextBand = this.filterBands[i + 1];
      if (currentBand && nextBand) {
        currentBand.connect(nextBand);
      }
    }

    // Connect final filter to bass boost
    const lastBand = this.filterBands[this.filterBands.length - 1];
    if (lastBand) {
      lastBand.connect(this.bassBoostFilter);
    }

    // Complete the chain: bass boost → compressor → gain → destination
    this.bassBoostFilter.connect(this.compressorNode);
    this.compressorNode.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);
  }

  /**
   * Apply equalizer preset
   * @param presetName - Name of the preset to apply
   */
  setPreset(presetName: keyof EqualizerPresets): void {
    const presetGains = EQUALIZER_PRESETS[presetName];
    if (!presetGains) {
      throw new Error(`Equalizer: Preset '${String(presetName)}' not found`);
    }

    this.setCustomEQ(presetGains);
  }

  /**
   * Set custom equalizer gains
   * @param gains - Array of gain values (-12 to +12 dB)
   */
  setCustomEQ(gains: number[]): void {
    if (!ValidationUtils.isValidArray(gains)) {
      throw new Error('Equalizer: Invalid gains array provided');
    }

    if (gains.length !== this.filterBands.length) {
      throw new Error(
        `Equalizer: Expected ${this.filterBands.length} gain values, received ${gains.length}`,
      );
    }

    const currentTime = this.audioContext.currentTime;
    const transitionTime = 0.05; // 50ms smooth transition

    for (let i = 0; i < this.filterBands.length; i++) {
      const band = this.filterBands[i];
      const gainValue = gains[i];

      if (band && gainValue !== undefined && ValidationUtils.isValidNumber(gainValue)) {
        // Clamp gain values to reasonable range
        const clampedGain = Math.max(-12, Math.min(12, gainValue));
        band.gain.setTargetAtTime(clampedGain, currentTime, transitionTime);
      }
    }
  }

  /**
   * Enable or disable bass boost
   * @param enabled - Whether to enable bass boost
   * @param boostAmount - Boost amount in dB (default: 6)
   */
  setBassBoost(enabled: boolean, boostAmount = 6): void {
    const currentTime = this.audioContext.currentTime;
    const targetGain = enabled ? Math.max(0, Math.min(12, boostAmount)) : 0;

    this.bassBoostFilter.gain.setTargetAtTime(targetGain, currentTime, 0.05);
  }

  /**
   * Set master volume
   * @param volume - Volume level (0.0 to 1.0)
   */
  setMasterVolume(volume: number): void {
    if (!ValidationUtils.isValidNumber(volume)) {
      throw new Error('Equalizer: Invalid volume value');
    }

    const clampedVolume = Math.max(0, Math.min(1, volume));
    const currentTime = this.audioContext.currentTime;

    this.gainNode.gain.setTargetAtTime(clampedVolume, currentTime, 0.01);
  }

  /**
   * Get current equalizer gains
   * @returns Array of current gain values
   */
  getCurrentGains(): number[] {
    return this.filterBands.map((band) => band.gain.value);
  }

  /**
   * Reset equalizer to flat response
   */
  reset(): void {
    const currentTime = this.audioContext.currentTime;

    // Reset all band gains to 0
    for (const band of this.filterBands) {
      band.gain.setTargetAtTime(0, currentTime, 0.05);
    }

    // Reset bass boost
    this.bassBoostFilter.gain.setTargetAtTime(0, currentTime, 0.05);

    // Reset master volume
    this.gainNode.gain.setTargetAtTime(1.0, currentTime, 0.05);
  }

  /**
   * Get equalizer status
   * @returns Current equalizer status
   */
  status(): EqualizerStatus {
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    return this.contextStatus;
  }

  /**
   * Update compressor settings
   * @param settings - Partial compressor settings
   */
  setCompressorSettings(
    settings: Partial<{
      threshold: number;
      knee: number;
      ratio: number;
      attack: number;
      release: number;
    }>,
  ): void {
    const currentTime = this.audioContext.currentTime;

    if (settings.threshold !== undefined) {
      this.compressorNode.threshold.setTargetAtTime(settings.threshold, currentTime, 0.01);
    }
    if (settings.knee !== undefined) {
      this.compressorNode.knee.setTargetAtTime(settings.knee, currentTime, 0.01);
    }
    if (settings.ratio !== undefined) {
      this.compressorNode.ratio.setTargetAtTime(settings.ratio, currentTime, 0.01);
    }
    if (settings.attack !== undefined) {
      this.compressorNode.attack.setTargetAtTime(settings.attack, currentTime, 0.01);
    }
    if (settings.release !== undefined) {
      this.compressorNode.release.setTargetAtTime(settings.release, currentTime, 0.01);
    }
  }

  /**
   * Get available presets
   * @returns Object containing all available presets
   */
  static getPresets(): EqualizerPresets {
    return EQUALIZER_PRESETS as EqualizerPresets;
  }

  /**
   * Destroy equalizer and cleanup resources
   */
  async destroy(): Promise<void> {
    try {
      if (this.audioContext && this.audioContext.state !== 'closed') {
        await this.audioContext.close();
      }
      this.contextStatus = 'CLOSED';
    } catch (error) {
      console.error('Equalizer: Error during cleanup:', error);
    }
  }
}
