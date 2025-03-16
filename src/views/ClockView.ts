import { ClockController } from '../controllers/ClockController';
import { Observable, Observer } from '../core/Observer';
import { EditMode, timeZoneOffsets } from '../models/ClockModel';

export class ClockView implements Observer {
  private editModeElementMap: Map<EditMode, HTMLElement | null>;
  private clocksContainer: HTMLElement;
  private clockContainer: HTMLElement;
  private timeZoneSelect: HTMLElement;
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
    this.timeZoneSelect = this.createTimeZoneSelect();
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

    this.buildUpClock(
      this.clockContainer,
      this.timeZoneSelect,
      this.removeButton,
      clockSVGElement
    );
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
    this.timeZoneSelect.addEventListener('change', (event) => {
      const selectedValue = (event.currentTarget as HTMLSelectElement).value;
      this.controller.setTimeZoneOffset(parseInt(selectedValue));
    });
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
    let hours: number = this.controller.getHours();

    // Convert from H24 to AM/PM format if clock is in AM/PM mode and it's afternoon
    if (!this.controller.getIsH24Format() && hours > 12) {
      hours = hours % 12;
    }
    this.hoursDisplay.innerHTML = this.padUnit(hours);
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

  private padUnit(unitValue: number) {
    return unitValue.toString().padStart(2, '0');
  }

  private createRemoveButton(): HTMLElement {
    const removeButton = document.createElement('button');
    removeButton.innerHTML = 'X';
    removeButton.classList.add('remove-button');
    return removeButton;
  }

  private createTimeZoneSelect(): HTMLElement {
    const select = document.createElement('select');
    const localOffset = new Date().getTimezoneOffset();
    timeZoneOffsets.forEach((currentOffset, timezone) => {
      const option = document.createElement('option');
      if (currentOffset === localOffset) {
        option.setAttribute('selected', 'true');
      }
      option.setAttribute('value', `${currentOffset}`);
      option.innerHTML = timezone;
      select.appendChild(option);
    });

    return select;
  }

  private createClockContainer(): HTMLElement {
    const clockContainer = document.createElement('div');
    clockContainer.classList.add('clock-container');
    return clockContainer;
  }

  private buildUpClock(
    container: HTMLElement,
    select: HTMLElement,
    removebutton: HTMLElement,
    svgClock: HTMLElement
  ) {
    container.appendChild(removebutton);
    container.appendChild(select);
    container.appendChild(svgClock);
  }

  private appendToDOM(element: HTMLElement): void {
    this.clocksContainer.appendChild(element);
  }

  private removeFromDOM(): void {
    this.clockContainer.remove();
  }

  private getTimeFormatIndicator(): string {
    const isH24Format: boolean = this.controller.getIsH24Format();
    if (isH24Format) {
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
