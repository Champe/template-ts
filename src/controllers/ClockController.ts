import { ClockModel, EditMode } from '../models/ClockModel';
import { ClockView } from '../views/ClockView';

export class ClockController {
  private model: ClockModel;
  constructor(model: ClockModel) {
    this.model = model;

    setInterval(() => {
      this.model.tick();
    }, 1000);
  }

  public toggleEditMode(): void {
    this.model.toggleEditMode();
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

  // public tick(): void {
  //   this.model.tick();
  // }
}
