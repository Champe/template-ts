import { ClocksController } from '../controllers/ClocksController';

export class ClocksView {
  private addClockButton: HTMLElement;
  constructor(
    private controller: ClocksController,
    private clocksSection: HTMLElement
  ) {
    this.addClockButton = this.clocksSection.querySelector(
      '.add-new-clock-button'
    );
  }

  public init() {
    this.addClockButton.addEventListener('click', () =>
      this.controller.addClock()
    );
  }
}
