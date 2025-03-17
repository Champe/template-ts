import { ClocksController } from '../controllers/ClocksController';
import { ClockType } from '../models/ClockModel';

/**
 * View class for managing the clocks section in the UI.
 * Handles user interactions and updates to display clock data.
 */
export class ClocksView {
  private addDigitalClockButton: HTMLElement;
  private addAnalogClockButton: HTMLElement;
  private resetAllClocksButton: HTMLElement;
  private toggleAllClockLightsButton: HTMLElement;
  private resetAllClockLightsButton: HTMLElement;

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
    this.addDigitalClockButton = this.clocksSection.querySelector(
      '.add-new-digital-clock-button'
    );
    this.addAnalogClockButton = this.clocksSection.querySelector(
      '.add-new-analog-clock-button'
    );
    this.resetAllClocksButton = this.clocksSection.querySelector(
      '.reset-all-clocks-button'
    );
    this.toggleAllClockLightsButton = this.clocksSection.querySelector(
      '.toggle-all-clock-lights-button'
    );
    this.resetAllClockLightsButton = this.clocksSection.querySelector(
      '.reset-all-clock-lights-button'
    );
  }

  /**
   * Initializes event listeners for user interactions, such as adding a new clock.
   */
  public init() {
    this.addDigitalClockButton.addEventListener('click', () =>
      this.controller.addClock(ClockType.digital)
    );

    this.addAnalogClockButton.addEventListener('click', () =>
      this.controller.addClock(ClockType.analog)
    );

    this.resetAllClocksButton.addEventListener('click', () =>
      this.controller.resetAllClocks()
    );

    this.toggleAllClockLightsButton.addEventListener('click', () =>
      this.controller.toggleAllLights()
    );

    this.resetAllClockLightsButton.addEventListener('click', () =>
      this.controller.resetAllLights()
    );
  }
}
