import { ClocksController } from '../controllers/ClocksController';

/**
 * View class for managing the clocks section in the UI.
 * Handles user interactions and updates to display clock data.
 */
export class ClocksView {
  private addClockButton: HTMLElement;

  /**
   * Constructor for the ClocksView class.
   * @param controller The ClocksController that handles the logic for adding and managing clocks.
   * @param clocksSection The DOM element representing the section where clocks are displayed.
   */
  constructor(
    private controller: ClocksController,
    private clocksSection: HTMLElement
  ) {
    // Initialize the "Add Clock" button by selecting it from the provided clocksSection.
    this.addClockButton = this.clocksSection.querySelector(
      '.add-new-clock-button'
    );
  }

  /**
   * Initializes event listeners for user interactions, such as adding a new clock.
   */
  public init() {
    // Add a click event listener to the "Add Clock" button, which triggers the controller to add a clock.
    this.addClockButton.addEventListener('click', () =>
      this.controller.addClock()
    );
  }
}
