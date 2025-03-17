import { ClockModel, ClockType, EditMode } from '../models/ClockModel';
import { SVGService } from '../services/SvgService';
import { TimeTickerService } from '../services/TimeTickerService';
import { ClockView } from '../views/ClockView';
import { DigitalClockController } from './DigitalClockController';

/**
 * Controller for managing the clock's model, view, and interactions with the time ticker service.
 * This class handles user actions, updates the view, and manages the time-ticking behavior.
 */
export abstract class ClockController {
  protected abstract view: ClockView;

  /**
   * Constructor to initialize the ClockController.
   * @param model The clock model that stores the time data and logic.
   */
  constructor(protected model: ClockModel) {
    this.initializeView();
    TimeTickerService.getInstance().subscribe(
      this.timeTickerListener.bind(this)
    );
  }

  /**
   * Initializes the view and connects it to the clock model.
   */
  protected abstract initializeView(): void;

  /**
   * Unsubscribes from the time ticker service when the controller is disposed.
   */
  public abstract dispose(): void;

  protected abstract timeTickerListener(): void;

  /**
   * Get the current id from the model.
   */
  public getId() {
    return this.model.getId();
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
   * Gets the time zone offset from the model.
   * @returns {number} timeZoneOffset in minutes.
   */
  public getTimeZoneOffset(): number {
    return this.model.getTimeZoneOffset();
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
