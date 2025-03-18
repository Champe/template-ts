import { ClockModel, EditMode } from '../models/ClockModel';
import { DigitalClockModel } from '../models/DigitalClockModel';
import { SVGService } from '../services/SvgService';
import { TimeTickerService } from '../services/TimeTickerService';
// import { ClockView } from '../views/ClockView';
import { DigitalClockView } from '../views/DigitalClockView';
import { ClockController } from './ClockController';

export class DigitalClockController extends ClockController {
  protected view: DigitalClockView;

  /**
   * Constructor to initialize the ClockController.
   * @param model The clock model that stores the time data and logic.
   */
  constructor(protected model: DigitalClockModel) {
    super(model);
  }

  /**
   * Initializes the view and connects it to the clock model.
   */
  protected initializeView(): void {
    this.view = new DigitalClockView(
      this,
      SVGService.getInstance().getDigitalClockSVGElement()
    );
    this.model.addObserver(this.view);
    this.view.init();
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
   * Set the light state to off.
   */
  public resetLightState(): void {
    this.model.resetLightState();
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
}
