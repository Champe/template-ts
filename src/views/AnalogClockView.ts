import { AnalogClockController } from '../controllers/AnalogClockController';
import { Observer } from '../core/Observer';
import { EditMode } from '../models/ClockModel';
import { ClockView } from './ClockView';

/**
 * View for rendering and interacting with the clock display.
 * It listens for updates from the model and reflects those changes in the DOM.
 */
export class AnalogClockView extends ClockView implements Observer {
  /**
   * Constructor to initialize the ClockView.
   * @param controller The controller for managing the clock interactions.
   * @param clockSVGElement The SVG element containing the clock's display elements.
   */
  constructor(
    protected controller: AnalogClockController,
    clockSVGElement: HTMLElement
  ) {
    super(controller, clockSVGElement);
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
  protected addListeners(): void {}

  /**
   * Renders the clock's display elements based on the current state.
   */
  protected render(): void {}
}
