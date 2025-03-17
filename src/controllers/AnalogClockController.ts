import { ClockModel, EditMode } from '../models/ClockModel';
import { SVGService } from '../services/SvgService';
import { TimeTickerService } from '../services/TimeTickerService';
import { AnalogClockView } from '../views/AnalogClockView';
import { DigitalClockView } from '../views/DigitalClockView';
import { ClockController } from './ClockController';

export class AnalogClockController extends ClockController {
  protected view: AnalogClockView;

  /**
   * Constructor to initialize the ClockController.
   * @param model The clock model that stores the time data and logic.
   */
  constructor(model: ClockModel) {
    super(model);
  }

  /**
   * Initializes the view and connects it to the clock model.
   */
  protected initializeView(): void {
    this.view = new AnalogClockView(
      this,
      SVGService.getInstance().getAnalogClockSVGElement()
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

  protected timeTickerListener(): void {
    this.model.tick();
  }
}
