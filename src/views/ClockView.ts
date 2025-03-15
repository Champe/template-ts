import { ClockController } from '../controllers/ClockController';
import { Observable, Observer } from '../interfaces/IObserver';
import { EditMode } from '../models/ClockModel';

export class ClockView implements Observer {
  private editModeElementMap: Map<EditMode, HTMLElement | null>;
  private hoursDisplay: HTMLElement;
  private minutesDisplay: HTMLElement;
  private secondsDisplay: HTMLElement;
  private editModeButton: HTMLElement;
  private lightSwitcherButton: HTMLElement;
  private increaseValueButton: HTMLElement;
  private clockDisplayDial: HTMLElement;

  constructor(
    private controller: ClockController,
    private clockSVGElement: HTMLElement
  ) {
    this.hoursDisplay = this.clockSVGElement.querySelector(
      '.clock-hours-display'
    );
    this.minutesDisplay = this.clockSVGElement.querySelector(
      '.clock-minutes-display'
    );
    this.secondsDisplay = this.clockSVGElement.querySelector(
      '.clock-seconds-display'
    );
    this.editModeButton = this.clockSVGElement.querySelector(
      '.clock-edit-mode-button'
    );
    this.lightSwitcherButton = this.clockSVGElement.querySelector(
      '.light-switcher-button'
    );
    this.increaseValueButton = this.clockSVGElement.querySelector(
      '.increase-value-button'
    );
    this.clockDisplayDial = this.clockSVGElement.querySelector(
      '.clock-display-dial'
    );

    this.editModeElementMap = new Map<EditMode, HTMLElement | null>([
      [EditMode.idle, null],
      [EditMode.hours, this.hoursDisplay],
      [EditMode.minutes, this.minutesDisplay],
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
    this.increaseValueButton.addEventListener('click', () =>
      this.controller.increaseValue()
    );
    this.lightSwitcherButton.addEventListener('click', () =>
      this.controller.toggleLightState()
    );
    this.render();
  }

  public render(): void {
    this.hoursDisplay.innerHTML = this.padUnit(this.controller.getHours());
    this.minutesDisplay.innerHTML = this.padUnit(this.controller.getMinutes());
    this.secondsDisplay.innerHTML = this.padUnit(this.controller.getSeconds());

    this.clockDisplayDial.setAttribute(
      'fill',
      this.controller.getLightIsOn() ? '#FBE106' : '#FFFFFF'
    );
  }

  public setBlinker(): void {
    this.hoursDisplay.classList.remove('blink');
    this.minutesDisplay.classList.remove('blink');
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

  public getHours(): number {
    return this.controller.getHours();
  }
  public getMinutes(): number {
    return this.controller.getMinutes();
  }
  public getSeconds(): number {
    return this.controller.getSeconds();
  }

  private padUnit(unitValue: number) {
    return unitValue.toString().padStart(2, '0');
  }
}
