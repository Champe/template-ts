import { AnalogClockModel } from '../models/AnalogClockModel';
import { ClockModel, EditMode } from '../models/ClockModel';
import { SVGService } from '../services/SvgService';
import { AnalogClockView } from '../views/AnalogClockView';
import { ClockController } from './ClockController';

export class AnalogClockController extends ClockController {
  protected view: AnalogClockView;

  /**
   * Constructor to initialize the ClockController.
   * @param model The clock model that stores the time data and logic.
   */
  constructor(protected model: AnalogClockModel) {
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
}
