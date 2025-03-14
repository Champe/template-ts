import { ClockModel } from '../models/ClockModel';

export class ClockController {
  constructor(private model: ClockModel) {}

  public toggleEditMode(): void {
    this.model.toggleEditMode();
  }

  public getTime(): string {
    return this.model.getTime();
  }
}
