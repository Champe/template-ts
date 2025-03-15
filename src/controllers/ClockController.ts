import { ClockModel, EditMode } from '../models/ClockModel';

export class ClockController {
  private model: ClockModel;
  constructor(model: ClockModel) {
    this.model = model;

    const now: number = Date.now();
    const msToNextSecond: number = 1000 - (now % 1000);
    setTimeout(
      () => setInterval(() => this.model.tick(), 1000),
      msToNextSecond
    );
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

  public getEditMode(): EditMode {
    return this.model.getEditMode();
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
}
