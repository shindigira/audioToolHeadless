/**
 * Validation utilities for the audio player
 */
export class ValidationUtils {
  /**
   * Check if an array is valid and has elements
   * @param arr - Array to validate
   * @returns True if array is valid and not empty
   */
  static isValidArray(arr: any[]): boolean {
    return arr && Array.isArray(arr) && arr.length > 0;
  }

  /**
   * Check if a function is valid
   * @param fn - Function to validate
   * @returns True if function is valid
   */
  static isValidFunction(fn: any): boolean {
    return fn instanceof Function && typeof fn === 'function';
  }

  /**
   * Check if an object is valid and not null
   * @param obj - Object to validate
   * @returns True if object is valid
   */
  static isValidObject(obj: any): boolean {
    return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
  }

  /**
   * Check if a string is valid and not empty
   * @param str - String to validate
   * @returns True if string is valid
   */
  static isValidString(str: any): boolean {
    return typeof str === 'string' && str.trim().length > 0;
  }

  /**
   * Check if a number is valid and finite
   * @param num - Number to validate
   * @returns True if number is valid
   */
  static isValidNumber(num: any): boolean {
    return typeof num === 'number' && Number.isFinite(num);
  }

  /**
   * Check if a value is defined (not null or undefined)
   * @param value - Value to check
   * @returns True if value is defined
   */
  static isDefined(value: any): boolean {
    return value !== null && value !== undefined;
  }

  /**
   * Validate volume range (0-100)
   * @param volume - Volume value to validate
   * @returns True if volume is in valid range
   */
  static isValidVolume(volume: number): boolean {
    return ValidationUtils.isValidNumber(volume) && volume >= 0 && volume <= 100;
  }

  /**
   * Validate time value (non-negative)
   * @param time - Time value to validate
   * @returns True if time is valid
   */
  static isValidTime(time: number): boolean {
    return ValidationUtils.isValidNumber(time) && time >= 0;
  }
}
