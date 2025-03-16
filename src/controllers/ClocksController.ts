import { ClocksModel } from '../models/ClocksModel';
import { ClocksView } from '../views/ClocksView';
import { ClockController } from './ClockController';

/**
 * Controller for managing a collection of clocks.
 * It coordinates between the model (ClocksModel) and the view (ClocksView).
 */
export class ClocksController {
  private view: ClocksView;

  /**
   * Constructor to initialize the ClocksController.
   * @param model The model responsible for managing the clocks' state.
   */
  constructor(private model: ClocksModel) {
    this.initializeView();
  }

  /**
   * Initializes the view and sets up the observer pattern for updating the view.
   */
  private initializeView(): void {
    this.view = new ClocksView(
      this,
      document.body.querySelector('.clocks-section')
    );
    this.view.init();
  }

  /**
   * Adds a new clock to the model.
   * This method triggers the model to add a clock and will notify the view accordingly.
   */
  public addClock(): void {
    this.model.addClock();
  }

  /**
   * Retrieves the list of existing clocks from the model.
   * @returns {ClockController[]} An array of ClockController instances representing the clocks.
   */
  public getClocks(): ClockController[] {
    return this.model.getClocks();
  }
}
