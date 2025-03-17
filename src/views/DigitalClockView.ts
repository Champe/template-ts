import { DigitalClockController } from '../controllers/DigitalClockController';
import { Observer } from '../core/Observer';
import { EditMode } from '../models/ClockModel';
import { ClockView } from './ClockView';

/**
 * View for rendering and interacting with the clock display.
 * It listens for updates from the model and reflects those changes in the DOM.
 */
export class DigitalClockView extends ClockView implements Observer {
  private editModeElementMap: Map<EditMode, HTMLElement | null>;
  private timeFormatIndicatorDisplay: HTMLElement;
  private timeFormatSwictherButton: HTMLElement;
  private editModeButton: HTMLElement;
  private resetButton: HTMLElement;
  private lightSwitcherButton: HTMLElement;
  private increaseValueButton: HTMLElement;
  private clockDisplayDial: HTMLElement;

  /**
   * Constructor to initialize the ClockView.
   * @param controller The controller for managing the clock interactions.
   * @param clockSVGElement The SVG element containing the clock's display elements.
   */
  constructor(
    protected controller: DigitalClockController,
    clockSVGElement: HTMLElement
  ) {
    super(controller, clockSVGElement);
    this.timeFormatIndicatorDisplay = clockSVGElement.querySelector(
      '.clock-time_fomat-indicator-display'
    );
    this.timeFormatSwictherButton = clockSVGElement.querySelector(
      '.clock-time_format-switcher-button'
    );
    this.editModeButton = clockSVGElement.querySelector(
      '.clock-edit-mode-button'
    );
    this.resetButton = clockSVGElement.querySelector('.clock-reset-button');
    this.lightSwitcherButton = clockSVGElement.querySelector(
      '.light-switcher-button'
    );
    this.increaseValueButton = clockSVGElement.querySelector(
      '.increase-value-button'
    );
    this.clockDisplayDial = clockSVGElement.querySelector(
      '.clock-display-dial'
    );

    this.editModeElementMap = new Map<EditMode, HTMLElement | null>([
      [EditMode.idle, null],
      [EditMode.hours, this.hoursDisplay],
      [EditMode.minutes, this.minutesDisplay],
    ]);
  }

  /**
   * Updates the view when the observable (model) is updated.
   * @param observable The observable that has been updated (in this case, the ClockModel).
   */
  public update(): void {
    this.render();
  }

  /**
   * Adds event listeners to the DOM elements.
   */
  protected addListeners(): void {
    this.timeZoneSelect.addEventListener('change', (event) => {
      const selectedValue = (event.currentTarget as HTMLSelectElement).value;
      this.controller.setTimeZoneOffset(parseInt(selectedValue));
    });
    this.timeFormatSwictherButton.addEventListener('click', () =>
      this.controller.toggleTimeFormat()
    );
    this.editModeButton.addEventListener('click', () =>
      this.controller.toggleEditMode()
    );
    this.resetButton.addEventListener('click', () => this.controller.reset());
    this.increaseValueButton.addEventListener('click', () =>
      this.controller.increaseValue()
    );
    this.lightSwitcherButton.addEventListener('click', () =>
      this.controller.toggleLightState()
    );
    this.removeButton.addEventListener('click', () => this.removeFromDOM());
  }

  /**
   * Renders the clock's display elements based on the current state.
   */
  protected render(): void {
    this.renderTime();
    this.renderDisplayDial();
    this.renderTimeFormatIndicatorDisplay();
    this.renderBlinker();
  }

  /**
   * Renders the time (hours, minutes, and seconds) on the clock.
   */
  private renderTime(): void {
    let hours: number = this.controller.getHours();

    // Convert from H24 to AM/PM format if clock is in AM/PM mode and it's afternoon
    if (!this.controller.getIsH24Format() && hours > 12) {
      hours = hours % 12;
    }
    this.hoursDisplay.innerHTML = this.padUnit(hours);
    this.minutesDisplay.innerHTML = this.padUnit(this.controller.getMinutes());
    this.secondsDisplay.innerHTML = this.padUnit(this.controller.getSeconds());
  }

  /**
   * Renders the clock's display dial (light color based on state).
   */
  private renderDisplayDial(): void {
    this.clockDisplayDial.setAttribute(
      'fill',
      this.controller.getLightIsOn() ? '#FBE106' : '#FFFFFF'
    );
  }

  /**
   * Renders the blinking effect for the active edit mode.
   */
  private renderBlinker(): void {
    this.hoursDisplay.classList.remove('blink');
    this.minutesDisplay.classList.remove('blink');
    if (this.controller.getEditMode() === EditMode.idle) {
      return;
    }

    const elementToBlink: HTMLElement = this.editModeElementMap.get(
      this.controller.getEditMode()
    );
    if (elementToBlink) {
      elementToBlink.classList.add('blink');
    }
  }

  /**
   * Renders the time format indicator (AM/PM or empty for 24-hour format).
   */
  private renderTimeFormatIndicatorDisplay(): void {
    this.timeFormatIndicatorDisplay.textContent = this.getTimeFormatIndicator();
  }

  /**
   * Pads a unit (e.g., hours, minutes, seconds) with a leading zero if needed.
   * @param unitValue The value to be padded.
   * @returns {string} The padded value as a string.
   */
  private padUnit(unitValue: number): string {
    return unitValue.toString().padStart(2, '0');
  }

  /**
   * Gets the time format indicator string (AM/PM or empty for 24-hour format).
   * @returns {string} The time format indicator.
   */
  private getTimeFormatIndicator(): string {
    const isH24Format: boolean = this.controller.getIsH24Format();
    if (isH24Format) {
      return '';
    }

    return this.controller.getHours() < 12 ? 'AM' : 'PM';
  }
}
