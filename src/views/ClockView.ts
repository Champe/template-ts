import { ClockController } from '../controllers/ClockController';
import { Observable, Observer } from '../interfaces/IObserver';
import { EditMode } from '../models/ClockModel';

export class ClockView implements Observer {
  private digitalClockHours: HTMLElement;
  private digitalClockMinutes: HTMLElement;
  private digitalClockSecondes: HTMLElement;

  private editModeElementMap: Map<EditMode, HTMLElement | null>;
  constructor(
    private controller: ClockController,
    private clockElement: HTMLElement,
    private editModeButton: HTMLElement,
    private increaseButton: HTMLElement
  ) {
    this.digitalClockHours = this.clockElement.querySelector(
      '#digital-clock-hours'
    );
    this.digitalClockMinutes = this.clockElement.querySelector(
      '#digital-clock-minutes'
    );
    this.digitalClockSecondes = this.clockElement.querySelector(
      '#digital-clock-secondes'
    );

    this.editModeElementMap = new Map<EditMode, HTMLElement | null>([
      [EditMode.idle, null],
      [EditMode.hours, this.digitalClockHours],
      [EditMode.minutes, this.digitalClockMinutes],
    ]);
  }

  update(observable: Observable): void {
    this.render();
    this.setBlinker();
  }

  public init() {
    this.editModeButton.addEventListener('click', () =>
      this.controller.toggleEditMode()
    );
    this.increaseButton.addEventListener('click', () =>
      this.controller.increaseValue()
    );
    this.render();
  }

  public render(): void {
    this.clockElement.querySelector(
      '#digital-clock-hours'
    ).innerHTML = `${this.controller.getHours()}`;
    this.clockElement.querySelector(
      '#digital-clock-minutes'
    ).innerHTML = `${this.controller.getMinutes()}`;
    this.clockElement.querySelector(
      '#digital-clock-secondes'
    ).innerHTML = `${this.controller.getSeconds()}`;
  }

  public setBlinker(): void {
    this.digitalClockHours.classList.remove('blink');
    this.digitalClockMinutes.classList.remove('blink');
    if (this.controller.getEditMode() === EditMode.idle) {
      return;
    }

    const elementToBlink: HTMLElement = this.editModeElementMap.get(
      this.controller.getEditMode()
    );
    if (elementToBlink) {
      elementToBlink.classList.add('blink');
    }
  }

  // public getTime(): String {
  //   return this.controller.getTime();
  // }

  public getHours(): number {
    return this.controller.getHours();
  }
  public getMinutes(): number {
    return this.controller.getMinutes();
  }
  public getSeconds(): number {
    return this.controller.getSeconds();
  }
}
