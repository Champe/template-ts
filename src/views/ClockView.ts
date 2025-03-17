import { ClockController } from '../controllers/ClockController';
import { Observer } from '../core/Observer';
import { ClockType, EditMode, timeZoneOffsets } from '../models/ClockModel';

/**
 * View for rendering and interacting with the clock display.
 * It listens for updates from the model and reflects those changes in the DOM.
 */
export abstract class ClockView implements Observer {
  protected clocksContainer: HTMLElement;
  protected clockContainer: HTMLElement;
  protected timeZoneSelect: HTMLElement;
  protected removeButton: HTMLElement;
  protected hoursDisplay: HTMLElement;
  protected minutesDisplay: HTMLElement;
  protected secondsDisplay: HTMLElement;

  /**
   * Constructor to initialize the ClockView.
   * @param controller The controller for managing the clock interactions.
   * @param clockSVGElement The SVG element containing the clock's display elements.
   */
  constructor(
    protected controller: ClockController,
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

    this.buildUpClock(
      this.clockContainer,
      this.timeZoneSelect,
      this.removeButton,
      clockSVGElement
    );
  }

  /**
   * Initializes the view by appending it to the DOM and adding event listeners.
   */
  public init(): void {
    this.attachDragEvents();
    this.addCommonListeners();
    this.addListeners();
    this.appendToDOM(this.clockContainer);
    this.render();
  }

  /**
   * Updates the view when the observable (model) is updated.
   * @param observable The observable that has been updated (in this case, the ClockModel).
   */
  public update(): void {
    this.render();
  }

  private addCommonListeners(): void {
    this.timeZoneSelect.addEventListener('change', (event) => {
      const selectedValue = (event.currentTarget as HTMLSelectElement).value;
      this.controller.setTimeZoneOffset(parseInt(selectedValue));
    });

    this.removeButton.addEventListener('click', () => this.removeFromDOM());
  }

  /**
   * Adds event listeners to the DOM elements.
   */
  protected abstract addListeners(): void;

  /**
   * Renders the clock's display elements based on the current state.
   */
  protected abstract render(): void;

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
    timeZoneSelect: HTMLElement,
    removebutton: HTMLElement,
    svgClock: HTMLElement
  ): void {
    container.appendChild(removebutton);
    container.appendChild(timeZoneSelect);
    // container.appendChild(typeSelect);
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
  protected removeFromDOM(): void {
    this.clockContainer.remove();
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
