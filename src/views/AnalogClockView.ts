import { AnalogClockController } from '../controllers/AnalogClockController';
import { Observer } from '../core/Observer';
import { Matrix3x3 } from '../core/math/Matrix3x3';
import { ClockView } from './ClockView';

/**
 * View for rendering and interacting with the clock display.
 * It listens for updates from the model and reflects those changes in the DOM.
 */
export class AnalogClockView extends ClockView implements Observer {
  private hoursHand: SVGLineElement;
  private minutesHand: SVGLineElement;
  private secondsHand: SVGLineElement;

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
    this.hoursHand = clockSVGElement.querySelector('.hours-hand');
    this.minutesHand = clockSVGElement.querySelector('.minutes-hand');
    this.secondsHand = clockSVGElement.querySelector('.seconds-hand');
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
  protected addListeners(): void {}

  /**
   * Renders the clock's display elements based on the current state.
   */
  protected render(): void {
    const hours = this.controller.getHours() % 12;
    const minutes = this.controller.getMinutes();
    const seconds = this.controller.getSeconds();

    // Calculate radians angles for each unit
    const hourAngle = (hours + minutes / 60) * 30 * (Math.PI / 180);
    const minuteAngle = minutes * 6 * (Math.PI / 180);
    const secondAngle = seconds * 6 * (Math.PI / 180);

    this.applyMatrixTransform(this.hoursHand, hourAngle);
    this.applyMatrixTransform(this.minutesHand, minuteAngle);
    this.applyMatrixTransform(this.secondsHand, secondAngle);
  }

  private applyMatrixTransform(hand: SVGLineElement, angle: number) {
    const ClockCenterX = 256;
    const ClockCenterY = 256;

    // We need to set translate to origin before rotating. Unit hand must rotate
    // Translate to origin -> Rotate -> Translate back to it's position
    const transformMatrix = Matrix3x3.translation(ClockCenterX, ClockCenterY)
      .multiply(Matrix3x3.rotation(angle))
      .multiply(Matrix3x3.translation(-ClockCenterX, -ClockCenterY));
    const [a, c, e, b, d, f] = transformMatrix.getValues().flat().slice(0, 6);

    hand.setAttribute('transform', `matrix(${a} ${b} ${c} ${d} ${e} ${f})`);
  }
}
