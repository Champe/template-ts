import { ClockModel, EditMode } from '../models/ClockModel';
import { SVGService } from '../services/SvgService';
import { TimeTickerService } from '../services/TimeTickerService';
import { ClockView } from '../views/ClockView';

export class ClockController {
  private view: ClockView;
  private timeTickerListener: () => void;
  constructor(private model: ClockModel) {
    this.initializeView();
    this.timeTickerListener = () => this.model.tick();
    TimeTickerService.getInstance().subscribe(this.timeTickerListener);
  }

  public dispose(): void {
    TimeTickerService.getInstance().unsubscribe(this.timeTickerListener);
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

  public setTimeZoneOffset(timeZoneOffset: number): void {
    this.model.setTimeZoneOffset(timeZoneOffset);
  }

  public getIsH24Format(): boolean {
    return this.model.getIsH24Format();
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
