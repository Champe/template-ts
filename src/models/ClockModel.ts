import { Observable } from '../core/Observer';

/**
 * Enum representing the different modes for editing the clock.
 */
export enum EditMode {
  idle = 0,
  hours = 1,
  minutes = 2,
  seconds = 3,
}

/**
 * A map of different time zones and their corresponding offsets in minutes.
 */
export const timeZoneOffsets = new Map<string, number>([
  ['GMT-12:00', -720],
  ['GMT-11:00', -660],
  ['GMT-10:00', -600],
  ['GMT-9:30', -570],
  ['GMT-9:00', -540],
  ['GMT-8:00', -480],
  ['GMT-7:00', -420],
  ['GMT-6:00', -360],
  ['GMT-5:00', -300],
  ['GMT-4:30', -270],
  ['GMT-4:00', -240],
  ['GMT-3:30', -210],
  ['GMT-3:00', -180],
  ['GMT-2:00', -120],
  ['GMT-1:00', -60],
  ['GMT±0:00', 0],
  ['GMT+1:00', 60],
  ['GMT+2:00', 120],
  ['GMT+3:00', 180],
  ['GMT+3:30', 210],
  ['GMT+4:00', 240],
  ['GMT+4:30', 270],
  ['GMT+5:00', 300],
  ['GMT+5:30', 330],
  ['GMT+5:45', 345],
  ['GMT+6:00', 360],
  ['GMT+6:30', 390],
  ['GMT+7:00', 420],
  ['GMT+8:00', 480],
  ['GMT+8:45', 525],
  ['GMT+9:00', 540],
  ['GMT+9:30', 570],
  ['GMT+10:00', 600],
  ['GMT+10:30', 630],
  ['GMT+11:00', 660],
  ['GMT+11:30', 690],
  ['GMT+12:00', 720],
  ['GMT+12:45', 765],
  ['GMT+13:00', 780],
  ['GMT+14:00', 840],
]);

export enum ClockType {
  digital = 0,
  analog = 1,
}

/**
 * Class representing the clock model.
 * This class extends Observable to notify observers when the clock state changes.
 */
export class ClockModel extends Observable {
  protected hours: number;
  protected minutes: number;
  protected seconds: number;
  protected editMode: EditMode = EditMode.idle;
  protected timeZoneOffset: number;
  protected id: string;

  /**
   * Constructor to initialize the clock model.
   * @param lightIsOn (optional) Initial state of the light (true if on, false if off)
   */
  constructor(private type: ClockType, timeZoneOffsets?: number) {
    super();
    this.id = `${Date.now()}-${Math.random().toString().slice(2)}`;
    this.timeZoneOffset =
      timeZoneOffsets !== undefined
        ? timeZoneOffsets
        : new Date().getTimezoneOffset();
    this.setToCurrentTime();
  }

  /**
   * Get the clock id.
   */
  public getId(): string {
    return this.id;
  }

  /**
   * Get the clock type.
   */
  public getType(): ClockType {
    return this.type;
  }

  /**
   * Sets the clock to the current system time based on the time zone offset.
   */
  private setToCurrentTime(): void {
    const now = new Date();
    now.setUTCMinutes(now.getUTCMinutes() + this.timeZoneOffset);
    this.hours = now.getUTCHours();
    this.minutes = now.getUTCMinutes();
    this.seconds = now.getUTCSeconds();
  }

  /**
   * Gets the current hour of the clock.
   * @returns {number} The current hour.
   */
  public getHours(): number {
    return this.hours;
  }

  /**
   * Gets the current minute of the clock.
   * @returns {number} The current minute.
   */
  public getMinutes(): number {
    return this.minutes;
  }

  /**
   * Gets the current second of the clock.
   * @returns {number} The current second.
   */
  public getSeconds(): number {
    return this.seconds;
  }

  /**
   * Gets the current edit mode of the clock.
   * @returns {EditMode} The current edit mode (idle, hours, minutes, or seconds).
   */
  public getEditMode(): EditMode {
    return this.editMode;
  }

  /**
   * Toggles through the edit modes (idle -> hours -> minutes -> seconds -> idle).
   */
  public toggleEditMode(): void {
    this.editMode = (this.editMode + 1) % (EditMode.minutes + 1);
    this.notifyObservers();
  }

  /**
   * Resets the clock to the current system time.
   */
  public reset(): void {
    this.setToCurrentTime();
    this.notifyObservers();
  }

  /**
   * Increases the current value (hour, minute, or second) depending on the edit mode.
   * Does nothing if the edit mode is idle.
   */
  public increaseValue(): void {
    if (this.editMode === EditMode.idle) {
      return;
    }
    if (this.editMode === EditMode.hours) {
      this.hours = (this.hours + 1) % 24;
    }
    if (this.editMode === EditMode.minutes) {
      this.minutes = (this.minutes + 1) % 60;
    }

    this.notifyObservers();
  }

  /**
   * gets the time zone offset.
   * @returns {number} timeZoneOffset The new time zone offset in minutes.
   */
  public getTimeZoneOffset(): number {
    return this.timeZoneOffset;
  }

  /**
   * Sets the time zone offset to a new value and updates the clock time.
   * @param {number} timeZoneOffset The new time zone offset in minutes.
   */
  public setTimeZoneOffset(timeZoneOffset: number): void {
    if (this.timeZoneOffset === timeZoneOffset) {
      return;
    }
    this.timeZoneOffset = timeZoneOffset;
    this.setToCurrentTime();
    this.notifyObservers();
  }

  /**
   * Advances the clock by one second, updating hours, minutes, and seconds accordingly.
   * If the time exceeds the limit, it wraps around.
   */
  public tick(): void {
    this.seconds++;
    if (this.seconds >= 60) {
      this.seconds = 0;
      this.minutes++;
    }

    if (this.minutes >= 60) {
      this.minutes = 0;
      this.hours++;
    }

    if (this.hours >= 24) {
      this.hours = 0;
    }

    this.notifyObservers();
  }
}
