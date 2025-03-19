import { AnalogClockController } from '../controllers/AnalogClockController';
import { Observer } from '../core/Observer';
import { Matrix3x3 } from '../core/math/Matrix3x3';
import { EditMode } from '../models/ClockModel';
import { ClockView } from './ClockView';

const computeDegreesRotationAnglePerUnit = (unitMaxvalue: number) =>
  360 / unitMaxvalue;
enum UnitDegreesRotationAnglePerUnit {
  hours = computeDegreesRotationAnglePerUnit(12),
  minutes = computeDegreesRotationAnglePerUnit(60),
  seconds = computeDegreesRotationAnglePerUnit(60),
}

/**
 * View for rendering and interacting with the clock display.
 * It listens for updates from the model and reflects those changes in the DOM.
 */
export class AnalogClockView extends ClockView implements Observer {
  private static readonly SVGClockRadius: number = 256;
  private static readonly SVGClockCenterX: number = 256;
  private static readonly SVGClockCenterY: number = 256;
  private static readonly REAJUST_ANGLE_TO_START_AT_CLOCK_TOP = -90; // In trigo, crcle origin is on the right, removing 90 place it a pi/2. 12/00 for an analog clock
  private static readonly TICK_LENGTH = 15;

  private hoursHand: SVGLineElement;
  private minutesHand: SVGLineElement;
  private secondsHand: SVGLineElement;
  private clockSVGElement: HTMLElement;
  private editModeSpindle: HTMLElement;
  private editModeButton: HTMLElement;

  /**
   * Constructor to initialize the ClockView.
   * @param controller The controller for managing the clock interactions.
   * @param clockSVGElement The SVG element containing the clock's display elements.
   */
  constructor(
    protected controller: AnalogClockController,
    clockSVGElement: HTMLElement
  ) {
    super(controller, clockSVGElement);
    this.clockSVGElement = clockSVGElement;
    this.hoursHand = clockSVGElement.querySelector('.hours-hand');
    this.minutesHand = clockSVGElement.querySelector('.minutes-hand');
    this.secondsHand = clockSVGElement.querySelector('.seconds-hand');
    this.editModeSpindle = clockSVGElement.querySelector(
      '.analog-clock-edit-spindle'
    );
    this.editModeButton = clockSVGElement.querySelector(
      '.clock-edit-mode-button'
    );

    this.addClockDialHours();
    this.addClockTicks();
  }

  /**
   * Updates the view when the observable (model) is updated.
   * @param observable The observable that has been updated (in this case, the ClockModel).
   */
  public update(): void {
    this.render();
  }

  private computeXPosition(radianAngle: number, offset: number = 0): number {
    return (
      AnalogClockView.SVGClockCenterX +
      (AnalogClockView.SVGClockRadius + offset) * Math.cos(radianAngle)
    );
  }

  private computeUnitRotationAngle(
    unitValue: number,
    degreeRotationAngle: UnitDegreesRotationAnglePerUnit,
    offset: number = 0
  ): number {
    return (unitValue * degreeRotationAngle + offset) * (Math.PI / 180);
  }

  private computeYPosition(radianAngle: number, offset: number = 0): number {
    return (
      AnalogClockView.SVGClockCenterX +
      (AnalogClockView.SVGClockRadius + offset) * Math.sin(radianAngle)
    );
  }

  private addClockDialHours() {
    for (let hour = 1; hour <= 12; hour++) {
      const angleInRadians = this.computeUnitRotationAngle(
        hour,
        UnitDegreesRotationAnglePerUnit.hours,
        AnalogClockView.REAJUST_ANGLE_TO_START_AT_CLOCK_TOP
      );

      const fontSize: number = 32;
      const textMarginFromTicks: number = 10;
      const textMarginOffset: number =
        AnalogClockView.TICK_LENGTH * 3 + textMarginFromTicks + fontSize / 2;
      const x = this.computeXPosition(angleInRadians, -textMarginOffset);
      const y = this.computeYPosition(angleInRadians, -textMarginOffset);

      const hourText = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'text'
      );
      hourText.setAttribute('x', x.toString());
      hourText.setAttribute('y', y.toString());
      hourText.setAttribute('text-anchor', 'middle');
      hourText.setAttribute('dominant-baseline', 'middle');
      hourText.setAttribute('font-size', `${fontSize}`);
      hourText.setAttribute('fill', 'black');
      this.clockSVGElement.appendChild(hourText);
      hourText.textContent = hour.toString();
    }
  }

  private addClockTicks() {
    const numberOfTicks = 60; // Each minutes

    for (let tick = 0; tick < numberOfTicks; tick++) {
      const angleInRadians = this.computeUnitRotationAngle(
        tick,
        UnitDegreesRotationAnglePerUnit.minutes,
        AnalogClockView.REAJUST_ANGLE_TO_START_AT_CLOCK_TOP
      );

      let tickLength = AnalogClockView.TICK_LENGTH * (tick % 5 ? 1 : 1.75);
      if (tick % 15 === 0) {
        tickLength = AnalogClockView.TICK_LENGTH * 2.75;
      }
      const x1 = this.computeXPosition(angleInRadians);
      const y1 = this.computeYPosition(angleInRadians);
      const x2 = this.computeXPosition(angleInRadians, -tickLength);
      const y2 = this.computeYPosition(angleInRadians, -tickLength);

      const tickLine = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'line'
      );
      tickLine.setAttribute('x1', x1.toString());
      tickLine.setAttribute('y1', y1.toString());
      tickLine.setAttribute('x2', x2.toString());
      tickLine.setAttribute('y2', y2.toString());
      tickLine.setAttribute('stroke', 'black');
      tickLine.setAttribute('stroke-width', '2');

      this.clockSVGElement.appendChild(tickLine);
    }
  }

  /**
   * Adds event listeners to the DOM elements.
   */
  protected addListeners(): void {
    this.editModeSpindle.addEventListener(
      'click',
      this.onEditModeClick.bind(this)
    );
    this.editModeButton.addEventListener(
      'click',
      this.onEditModeClick.bind(this)
    );

    this.editModeButton.addEventListener(
      'mouseenter',
      this.onEditModeMouseEnter.bind(this)
    );
    this.editModeButton.addEventListener(
      'mouseleave',
      this.onEditModeMouseLeave.bind(this)
    );
  }

  /**
   * Renders the clock's display elements based on the current state.
   */
  protected render(): void {
    const hours = this.controller.getHours() % 12;
    const minutes = this.controller.getMinutes();
    const seconds = this.controller.getSeconds();

    // Calculate radians angles for each unit
    const hourAngle = this.computeUnitRotationAngle(
      hours + minutes / 60,
      UnitDegreesRotationAnglePerUnit.hours
    );
    const minuteAngle = this.computeUnitRotationAngle(
      minutes + seconds / 60,
      UnitDegreesRotationAnglePerUnit.minutes
    );
    const secondAngle = this.computeUnitRotationAngle(
      seconds,
      UnitDegreesRotationAnglePerUnit.seconds
    );

    this.applyMatrixTransform(this.hoursHand, hourAngle);
    this.applyMatrixTransform(this.minutesHand, minuteAngle);
    this.applyMatrixTransform(this.secondsHand, secondAngle);
  }

  private applyMatrixTransform(hand: SVGLineElement, angle: number) {
    // We need to set translate to origin before rotating. Unit hand must rotate
    // Translate to origin -> Rotate -> Translate back to it's position
    const transformMatrix = Matrix3x3.translation(
      AnalogClockView.SVGClockCenterX,
      AnalogClockView.SVGClockCenterY
    )
      .multiply(Matrix3x3.rotation(angle))
      .multiply(
        Matrix3x3.translation(
          -AnalogClockView.SVGClockCenterX,
          -AnalogClockView.SVGClockCenterY
        )
      );
    const [a, c, e, b, d, f] = transformMatrix.getValues().flat().slice(0, 6);

    hand.setAttribute('transform', `matrix(${a} ${b} ${c} ${d} ${e} ${f})`);
  }

  private onEditModeClick(e: MouseEvent): void {
    const x = parseInt(this.editModeButton.getAttribute('x'));
    const pinTranslationOffset =
      20 * (this.controller.getEditMode() === EditMode.idle ? 1 : -1);
    this.editModeButton.setAttribute('x', `${x + pinTranslationOffset}`);
    this.controller.toggleEditMode();
  }

  private onEditModeMouseEnter(e: MouseEvent): void {
    this.editModeButton.setAttribute('fill', 'aqua');
    this.editModeSpindle.setAttribute('fill', 'aqua');
  }

  private onEditModeMouseLeave(e: MouseEvent): void {
    this.editModeButton.setAttribute('fill', 'silver');
    this.editModeSpindle.setAttribute('fill', 'silver');
  }
}
