import { ClocksController } from '../controllers/ClocksController';
import { Observable, Observer } from '../core/Observer';

export class ClocksView implements Observer {
  private addClockButton: HTMLElement;
  constructor(
    private controller: ClocksController,
    private clocksSection: HTMLElement
  ) {
    this.addClockButton = this.clocksSection.querySelector(
      '.add-new-clock-button'
    );
  }

  update(observable: Observable): void {}

  public init() {
    this.addClockButton.addEventListener('click', () =>
      this.controller.addClock()
    );
  }
}
