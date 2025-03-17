import { ClockController } from '../controllers/ClockController';
import { Observer } from '../core/Observer';
import { EditMode, timeZoneOffsets } from '../models/ClockModel';

/**
 * View for rendering and interacting with the clock display.
 * It listens for updates from the model and reflects those changes in the DOM.
 */
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

  /**
   * Constructor to initialize the ClockView.
   * @param controller The controller for managing the clock interactions.
   * @param clockSVGElement The SVG element containing the clock's display elements.
   */
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

    this.attachDragEvents();
  }

  /**
   * Initializes the view by appending it to the DOM and adding event listeners.
   */
  public init(): void {
    this.appendToDOM(this.clockContainer);
    this.addListeners();
    this.render();
  }

  /**
   * Updates the view when the observable (model) is updated.
   * @param observable The observable that has been updated (in this case, the ClockModel).
   */
  public update(): void {
    this.render();
  }

  /**
   * Adds event listeners to the DOM elements.
   */
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

  /**
   * Renders the clock's display elements based on the current state.
   */
  private render(): void {
    this.renderTime();
    this.renderDisplayDial();
    this.renderTimeFormatIndicatorDisplay();
    this.renderBlinker();
  }

  /**
   * Renders the time (hours, minutes, and seconds) on the clock.
   */
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

  /**
   * Renders the clock's display dial (light color based on state).
   */
  private renderDisplayDial(): void {
    this.clockDisplayDial.setAttribute(
      'fill',
      this.controller.getLightIsOn() ? '#FBE106' : '#FFFFFF'
    );
  }

  /**
   * Renders the blinking effect for the active edit mode.
   */
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

  /**
   * Renders the time format indicator (AM/PM or empty for 24-hour format).
   */
  private renderTimeFormatIndicatorDisplay(): void {
    this.timeFormatIndicatorDisplay.textContent = this.getTimeFormatIndicator();
  }

  /**
   * Pads a unit (e.g., hours, minutes, seconds) with a leading zero if needed.
   * @param unitValue The value to be padded.
   * @returns {string} The padded value as a string.
   */
  private padUnit(unitValue: number): string {
    return unitValue.toString().padStart(2, '0');
  }

  /**
   * Creates the remove button (X) for the clock.
   * @returns {HTMLElement} The remove button element.
   */
  private createRemoveButton(): HTMLElement {
    const removeButton = document.createElement('button');
    removeButton.innerHTML = 'X';
    removeButton.classList.add('remove-button');
    return removeButton;
  }

  /**
   * Creates the time zone select dropdown element.
   * @returns {HTMLElement} The select element for time zones.
   */
  private createTimeZoneSelect(): HTMLElement {
    const select = document.createElement('select');
    timeZoneOffsets.forEach((currentOffset, timezone) => {
      const option = document.createElement('option');
      if (currentOffset === this.controller.getTimeZoneOffset()) {
        option.setAttribute('selected', 'true');
      }
      option.setAttribute('value', `${currentOffset}`);
      option.innerHTML = timezone;
      select.appendChild(option);
    });

    return select;
  }

  /**
   * Creates the clock container element.
   * @returns {HTMLElement} The container element for the clock.
   */
  private createClockContainer(): HTMLElement {
    const clockContainer = document.createElement('div');
    clockContainer.setAttribute(
      'id',
      `clock-container-${this.controller.getId()}`
    );
    clockContainer.classList.add('clock-container');
    return clockContainer;
  }

  /**
   * Builds the structure of the clock (container, select, remove button, and SVG).
   * @param container The clock container element.
   * @param select The time zone select element.
   * @param removebutton The remove button element.
   * @param svgClock The SVG element for the clock display.
   */
  private buildUpClock(
    container: HTMLElement,
    select: HTMLElement,
    removebutton: HTMLElement,
    svgClock: HTMLElement
  ): void {
    container.appendChild(removebutton);
    container.appendChild(select);
    container.appendChild(svgClock);
  }

  /**
   * Appends the clock container to the DOM.
   * @param element The clock container element to append.
   */
  private appendToDOM(element: HTMLElement): void {
    this.clocksContainer.appendChild(element);
  }

  /**
   * Removes the clock container from the DOM.
   */
  private removeFromDOM(): void {
    this.clockContainer.remove();
  }

  /**
   * Gets the time format indicator string (AM/PM or empty for 24-hour format).
   * @returns {string} The time format indicator.
   */
  private getTimeFormatIndicator(): string {
    const isH24Format: boolean = this.controller.getIsH24Format();
    if (isH24Format) {
      return '';
    }

    return this.controller.getHours() < 12 ? 'AM' : 'PM';
  }

  /**
   * Adds an event listener to the remove button for custom events.
   * @param type The event type
   * @param listener The event listener to attach to the remove button.
   */
  public addEventListenerToRemoveButton(
    type: keyof HTMLElementEventMap,
    listener: EventListenerOrEventListenerObject
  ): void {
    this.removeButton.addEventListener(type, listener);
  }

  private attachDragEvents(): void {
    this.clockContainer.setAttribute('draggable', 'true');
    this.clockContainer.addEventListener(
      'dragstart',
      this.onDragStart.bind(this)
    );
    this.clockContainer.addEventListener(
      'dragenter',
      this.onDragEnter.bind(this)
    );
    this.clockContainer.addEventListener(
      'dragover',
      this.onDragOver.bind(this)
    );
    this.clockContainer.addEventListener(
      'dragleave',
      this.onDragLeave.bind(this)
    );
    this.clockContainer.addEventListener('drop', this.onDrop.bind(this));
    this.clockContainer.addEventListener('dragend', this.onDragEnd.bind(this));
  }

  private onDragStart(event: DragEvent): void {
    event.dataTransfer?.setData('text/plain', this.clockContainer.id);
    this.clockContainer.classList.add('dragging');
  }

  private onDragEnter(event: DragEvent): void {
    event.preventDefault();
    const draggedElementId = event.dataTransfer?.getData('text/plain');
    // Useless to handle drop if droping dragged clock at same place
    if (
      draggedElementId === undefined ||
      draggedElementId === null ||
      // this.clockContainer referes to clock where dragged clock is dropped
      draggedElementId === this.clockContainer.id
    ) {
      return;
    }

    // Find the nearest parent with class 'clock-container', including the target itself
    let clockContainer = (event.target as HTMLElement).closest(
      '.clock-container'
    ) as HTMLElement | null;

    if (clockContainer) {
      clockContainer.classList.add('dragged-over');
    }
  }

  private onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  private onDragLeave(event: DragEvent): void {
    event.preventDefault();

    const draggedElementId = event.dataTransfer?.getData('text/plain');
    // Useless to handle drop if droping dragged clock at same place
    if (
      draggedElementId === undefined ||
      draggedElementId === null ||
      // this.clockContainer referes to clock where dragged clock is dropped
      draggedElementId === this.clockContainer.id
    ) {
      return;
    }

    const currentTarget = event.currentTarget as HTMLElement;
    const relatedTarget = event.relatedTarget as HTMLElement;
    // Trigger leave only if it leaves from a non child element
    if (currentTarget.contains(relatedTarget as HTMLElement)) {
      return;
    }

    let clockContainer = currentTarget.closest(
      '.clock-container'
    ) as HTMLElement | null;
    clockContainer.classList.remove('dragged-over');
  }

  private onDrop(event: DragEvent): void {
    event.preventDefault();
    const draggedElementId = event.dataTransfer?.getData('text/plain');
    // Useless to handle drop if droping dragged clock at same place
    if (
      draggedElementId === undefined ||
      draggedElementId === null ||
      // this.clockContainer referes to clock where dragged clock is dropped
      draggedElementId === this.clockContainer.id
    ) {
      return;
    }

    const clockContainerElements: Element[] = Array.from(
      this.clocksContainer.children
    );
    const draggedElement: HTMLElement = this.clocksContainer.querySelector(
      `#${draggedElementId}`
    );
    const draggedIndex: number = clockContainerElements.indexOf(draggedElement);
    const droppedIndex: number = clockContainerElements.indexOf(
      this.clockContainer
    );

    if (droppedIndex < 0 || draggedIndex < 0) {
      return;
    }

    const droppedElement = clockContainerElements[droppedIndex];
    // Swap elements position
    const nextSibling = draggedElement.nextSibling;
    const targetSibling =
      droppedIndex < draggedIndex ? droppedElement : droppedElement.nextSibling;

    // Swap the elements
    this.clocksContainer.insertBefore(draggedElement, targetSibling);
    this.clocksContainer.insertBefore(droppedElement, nextSibling);

    // Remove target style
    this.clockContainer.classList.remove('dragged-over');
  }

  private onDragEnd(): void {
    this.clockContainer.classList.remove('dragging');
  }
}
