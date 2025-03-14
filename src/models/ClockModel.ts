import { Observable } from '../interfaces/IObserver';

export enum EditMode {
  idle = 0,
  hours = 1,
  minutes = 2,
}

export class ClockModel extends Observable {
  private hours: number;
  private minutes: number;
  private seconds: number;
  private editMode: EditMode = EditMode.idle;

  constructor() {
    super();
    const now = new Date();
    this.hours = now.getHours();
    this.minutes = now.getMinutes();
    this.seconds = now.getSeconds();
  }

  public toggleEditMode(): void {
    this.editMode = (this.editMode + 1) % (EditMode.minutes + 1);
    this.notifyObservers();
  }

  public getEditMode(): EditMode {
    return this.editMode;
  }

  public increaseValue(): void {
    if (this.editMode === EditMode.idle) {
      return;
    }
    if (this.editMode === EditMode.hours) {
      this.hours = (this.hours + 1) % 24;
    }
    if (this.editMode === EditMode.minutes) {
      this.minutes = (this.minutes + 1) % 60;
    }

    this.notifyObservers();
  }

  public getHours(): number {
    return this.hours;
  }
  public getMinutes(): number {
    return this.minutes;
  }
  public getSeconds(): number {
    return this.seconds;
  }
}
