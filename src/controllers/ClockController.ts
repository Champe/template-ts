import { ClockModel, EditMode, TimeFormat } from '../models/ClockModel';
import { SVGService } from '../services/SvgService';
import { ClockView } from '../views/ClockView';

export class ClockController {
  private view: ClockView;
  constructor(private model: ClockModel) {
    this.initializeView();
    const now: number = Date.now();
    const msToNextSecond: number = 1000 - (now % 1000);
    setTimeout(
      () => setInterval(() => this.model.tick(), 1000),
      msToNextSecond
    );
  }

  private initializeView(): void {
    this.view = new ClockView(
      this,
      SVGService.getInstance().getClockSVGElement()
    );
    this.model.addObserver(this.view);
    this.view.init();
  }

  public getEditMode(): EditMode {
    return this.model.getEditMode();
  }

  public toggleEditMode(): void {
    this.model.toggleEditMode();
  }

  public getLightIsOn(): boolean {
    return this.model.getLightIsOn();
  }

  public toggleLightState(): void {
    this.model.toggleLightState();
  }

  public increaseValue(): void {
    this.model.increaseValue();
  }

  public getHours(): number {
    return this.model.getHours();
  }

  public getMinutes(): number {
    return this.model.getMinutes();
  }

  public getSeconds(): number {
    return this.model.getSeconds();
  }

  public reset(): void {
    this.model.reset();
  }

  public getTimeFormat(): TimeFormat {
    return this.model.getTimeFormat();
  }

  public toggleTimeFormat(): void {
    return this.model.toggleTimeFormat();
  }

  public addEventListenerToRemoveButton(
    type: keyof HTMLElementEventMap,
    listener: EventListenerOrEventListenerObject
  ): void {
    this.view.addEventListenerToRemoveButton(type, listener);
  }
}
