import { Observable } from '../interfaces/IObserver';

export enum EditMode {
  idle = 0,
  hours = 1,
  minutes = 2,
  seconds = 3,
}

export class ClockModel extends Observable {
  private hours: number;
  private minutes: number;
  private seconds: number;
  private editMode: EditMode = EditMode.idle;

  constructor(private lightIsOn: boolean = false) {
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

  public getLightIsOn(): boolean {
    return this.lightIsOn;
  }

  public toggleLightState(): void {
    this.lightIsOn = !this.lightIsOn;
    this.notifyObservers();
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

  public tick(): void {
    this.seconds++;
    if (this.seconds >= 60) {
      this.seconds = 0;
      this.minutes++;
    }

    if (this.minutes >= 60) {
      this.minutes = 0;
      this.hours++;
    }

    if (this.hours >= 24) {
      this.hours = 0;
    }

    this.notifyObservers();
  }
}
