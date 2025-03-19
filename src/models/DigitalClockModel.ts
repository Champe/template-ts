import { ClockModel, ClockType, EditMode } from './ClockModel';

export class DigitalClockModel extends ClockModel {
  /**
   * Constructor to initialize the clock model.
   * @param lightIsOn (optional) Initial state of the light (true if on, false if off)
   */
  constructor(
    protected timeZoneOffsets?: number,
    private isH24Format: boolean = true,
    private lightIsOn: boolean = false
  ) {
    super(ClockType.digital, timeZoneOffsets);
  }

  public toggleEditMode(): void {
    this.editMode = (this.editMode + 1) % (EditMode.minutes + 1);
    this.notifyObservers();
  }

  /**
   * Gets the current state of the light (on or off).
   * @returns {boolean} True if the light is on, false if off.
   */
  public getLightIsOn(): boolean {
    return this.lightIsOn;
  }

  /**
   * Toggles the light state between on and off.
   */
  public toggleLightState(): void {
    this.lightIsOn = !this.lightIsOn;
    this.notifyObservers();
  }

  /**
   * Set the light state to off.
   */
  public resetLightState(): void {
    // Don't notify observers if value is the same
    if (!this.lightIsOn) {
      return;
    }
    this.lightIsOn = false;
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
   * Gets whether the clock is in H24 format.
   * @returns {boolean} True if in H24 format, false if in AM/PM format.
   */
  public getIsH24Format(): boolean {
    return this.isH24Format;
  }

  /**
   * Toggles between H24 and AM/PM time formats.
   */
  public toggleTimeFormat(): void {
    this.isH24Format = !this.isH24Format;
    this.notifyObservers();
  }
}
