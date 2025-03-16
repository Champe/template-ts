import { ClockController } from '../controllers/ClockController';
import { Observable, Observer } from '../interfaces/IObserver';
import { EditMode, TimeFormat } from '../models/ClockModel';

export class ClockView implements Observer {
  private editModeElementMap: Map<EditMode, HTMLElement | null>;
  private clocksContainer: HTMLElement;
  private clockContainer: HTMLElement;
  private removeButton: HTMLElement;
  private hoursDisplay: HTMLElement;
  private minutesDisplay: HTMLElement;
  private secondsDisplay: HTMLElement;
  private timeFormatIndicatorDisplay: HTMLElement;
  private timeFormatSwictherButton: HTMLElement;
  private editModeButton: HTMLElement;
  private resetButton: HTMLElement;
  private lightSwitcherButton: HTMLElement;
  private increaseValueButton: HTMLElement;
  private clockDisplayDial: HTMLElement;

  constructor(
    private controller: ClockController,
    clockSVGElement: HTMLElement
  ) {
    this.clocksContainer = document.body.querySelector('.clocks-container');
    this.clockContainer = this.createClockContainer();
    this.removeButton = this.createRemoveButton();
    this.hoursDisplay = clockSVGElement.querySelector('.clock-hours-display');
    this.minutesDisplay = clockSVGElement.querySelector(
      '.clock-minutes-display'
    );
    this.secondsDisplay = clockSVGElement.querySelector(
      '.clock-seconds-display'
    );
    this.timeFormatIndicatorDisplay = clockSVGElement.querySelector(
      '.clock-time_fomat-indicator-display'
    );
    this.timeFormatSwictherButton = clockSVGElement.querySelector(
      '.clock-time_format-switcher-button'
    );
    this.editModeButton = clockSVGElement.querySelector(
      '.clock-edit-mode-button'
    );
    this.resetButton = clockSVGElement.querySelector('.clock-reset-button');
    this.lightSwitcherButton = clockSVGElement.querySelector(
      '.light-switcher-button'
    );
    this.increaseValueButton = clockSVGElement.querySelector(
      '.increase-value-button'
    );
    this.clockDisplayDial = clockSVGElement.querySelector(
      '.clock-display-dial'
    );

    this.buildUpClock(this.clockContainer, this.removeButton, clockSVGElement);
    this.editModeElementMap = new Map<EditMode, HTMLElement | null>([
      [EditMode.idle, null],
      [EditMode.hours, this.hoursDisplay],
      [EditMode.minutes, this.minutesDisplay],
    ]);
  }

  public update(observable: Observable): void {
    this.render();
  }

  public init() {
    this.appendToDOM(this.clockContainer);
    this.addListeners();
    this.render();
  }

  private addListeners(): void {
    this.timeFormatSwictherButton.addEventListener('click', () =>
      this.controller.toggleTimeFormat()
    );
    this.editModeButton.addEventListener('click', () =>
      this.controller.toggleEditMode()
    );
    this.resetButton.addEventListener('click', () => this.controller.reset());
    this.increaseValueButton.addEventListener('click', () =>
      this.controller.increaseValue()
    );
    this.lightSwitcherButton.addEventListener('click', () =>
      this.controller.toggleLightState()
    );
    this.removeButton.addEventListener('click', () => this.removeFromDOM());
  }

  private render(): void {
    this.renderTime();
    this.renderDisplayDial();
    this.renderTimeFormatIndicatorDisplay();
    this.renderBlinker();
  }

  private renderTime(): void {
    this.hoursDisplay.innerHTML = this.padUnit(this.controller.getHours());
    this.minutesDisplay.innerHTML = this.padUnit(this.controller.getMinutes());
    this.secondsDisplay.innerHTML = this.padUnit(this.controller.getSeconds());
  }

  private renderDisplayDial(): void {
    this.clockDisplayDial.setAttribute(
      'fill',
      this.controller.getLightIsOn() ? '#FBE106' : '#FFFFFF'
    );
  }

  private renderBlinker(): void {
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

  private renderTimeFormatIndicatorDisplay(): void {
    this.timeFormatIndicatorDisplay.textContent = this.getTimeFormatIndicator();
  }

  public setBlinker(): void {}

  private padUnit(unitValue: number) {
    return unitValue.toString().padStart(2, '0');
  }

  private createRemoveButton(): HTMLElement {
    const removeButton = document.createElement('button');
    removeButton.innerHTML = 'X';
    removeButton.classList.add('remove-button');
    return removeButton;
  }

  private createClockContainer(): HTMLElement {
    const clockContainer = document.createElement('div');
    clockContainer.classList.add('clock-container');
    return clockContainer;
  }

  private buildUpClock(
    container: HTMLElement,
    removebutton: HTMLElement,
    svgClock: HTMLElement
  ) {
    container.appendChild(removebutton);
    container.appendChild(svgClock);
  }

  private appendToDOM(element: HTMLElement): void {
    this.clocksContainer.appendChild(element);
  }

  private removeFromDOM(): void {
    this.clockContainer.remove();
  }

  private getTimeFormatIndicator(): string {
    const timeFormat: TimeFormat = this.controller.getTimeFormat();
    if (timeFormat === TimeFormat.H24) {
      return '';
    }

    return this.controller.getHours() < 12 ? 'AM' : 'PM';
  }

  public addEventListenerToRemoveButton(
    type: keyof HTMLElementEventMap,
    listener: EventListenerOrEventListenerObject
  ): void {
    this.removeButton.addEventListener(type, listener);
  }
}
