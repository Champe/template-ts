import { ClockModel } from '../models/ClockModel';
import { ClockView } from '../views/ClockView';

export class ClockController {
  private model: ClockModel;
  constructor(model: ClockModel) {
    this.model = model;
  }

  public toggleEditMode(): void {
    this.model.toggleEditMode();
  }

  public increaseValue(): void {
    this.model.increaseValue();
  }

  public getTime(): string {
    return this.model.getTime();
  }
}
