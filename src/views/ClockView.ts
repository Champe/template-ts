import { ClockController } from '../controllers/ClockController';
import { Observable, Observer } from '../interfaces/IObserver';

export class ClockView implements Observer {
  constructor(
    private controller: ClockController,
    private clockElement: HTMLElement,
    private editModeButton: HTMLElement,
    private increaseButton: HTMLElement
  ) {}

  update(observable: Observable): void {
    console.log(observable);
    this.render();
  }

  public init() {
    this.editModeButton.addEventListener('click', () =>
      this.controller.toggleEditMode()
    );
    this.increaseButton.addEventListener('click', () =>
      this.controller.increaseValue()
    );
  }

  public render(): void {
    this.clockElement.innerHTML = this.controller.getTime();
  }

  public getTime(): String {
    return this.controller.getTime();
  }
}
