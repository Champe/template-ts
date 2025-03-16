import { ClockModel, EditMode } from '../models/ClockModel';
import { SVGService } from '../services/SvgService';
import { TimeTickerService } from '../services/TimeTickerService';
import { ClockView } from '../views/ClockView';

type VoidCallback = () => void;

/**
 * Controller for managing the clock's model, view, and interactions with the time ticker service.
 * This class handles user actions, updates the view, and manages the time-ticking behavior.
 */
export class ClockController {
  private view: ClockView;
  private timeTickerListener: VoidCallback;

  /**
   * Constructor to initialize the ClockController.
   * @param model The clock model that stores the time data and logic.
   */
  constructor(private model: ClockModel) {
    this.initializeView();
    this.timeTickerListener = () => this.model.tick();
    TimeTickerService.getInstance().subscribe(this.timeTickerListener);
  }

  /**
   * Initializes the view and connects it to the clock model.
   */
  private initializeView(): void {
    this.view = new ClockView(
      this,
      SVGService.getInstance().getClockSVGElement()
    );
    this.model.addObserver(this.view);
    this.view.init();
  }

  /**
   * Unsubscribes from the time ticker service when the controller is disposed.
   */
  public dispose(): void {
    TimeTickerService.getInstance().unsubscribe(this.timeTickerListener); // Remove the time ticker listener
  }

  /**
   * Gets the current hour from the model.
   * @returns {number} The current hour.
   */
  public getHours(): number {
    return this.model.getHours();
  }

  /**
   * Gets the current minute from the model.
   * @returns {number} The current minute.
   */
  public getMinutes(): number {
    return this.model.getMinutes();
  }

  /**
   * Gets the current second from the model.
   * @returns {number} The current second.
   */
  public getSeconds(): number {
    return this.model.getSeconds();
  }

  /**
   * Gets the current edit mode from the model.
   * @returns {EditMode} The current edit mode.
   */
  public getEditMode(): EditMode {
    return this.model.getEditMode();
  }

  /**
   * Toggles the edit mode of the clock (e.g., between idle, editing hours, minutes, or seconds).
   */
  public toggleEditMode(): void {
    this.model.toggleEditMode(); // Toggle the edit mode in the model
  }

  /**
   * Gets the current light state from the model.
   * @returns {boolean} True if the light is on, false if it is off.
   */
  public getLightIsOn(): boolean {
    return this.model.getLightIsOn();
  }

  /**
   * Toggles the light state of the clock (on/off).
   */
  public toggleLightState(): void {
    this.model.toggleLightState();
  }

  /**
   * Increases the current value of the clock (hour, minute, or second) based on the edit mode.
   */
  public increaseValue(): void {
    this.model.increaseValue();
  }

  /**
   * Resets the clock to the current time.
   */
  public reset(): void {
    this.model.reset();
  }

  /**
   * Gets whether the clock is in 24-hour format.
   * @returns {boolean} True if the clock is in 24-hour format, false if in 12-hour format.
   */
  public getIsH24Format(): boolean {
    return this.model.getIsH24Format();
  }

  /**
   * Toggles between 24-hour and 12-hour time formats in the model.
   */
  public toggleTimeFormat(): void {
    this.model.toggleTimeFormat();
  }

  /**
   * Sets the time zone offset for the clock model.
   * @param {number} timeZoneOffset The time zone offset in minutes.
   */
  public setTimeZoneOffset(timeZoneOffset: number): void {
    this.model.setTimeZoneOffset(timeZoneOffset);
  }

  /**
   * Adds an event listener to the remove button in the view.
   * @param type The event type (e.g., 'click').
   * @param listener The event listener to attach to the remove button.
   */
  public addEventListenerToRemoveButton(
    type: keyof HTMLElementEventMap,
    listener: EventListenerOrEventListenerObject
  ): void {
    this.view.addEventListenerToRemoveButton(type, listener);
  }
}
