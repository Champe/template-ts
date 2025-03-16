import { Observable } from '../interfaces/IObserver';

export enum EditMode {
  idle = 0,
  hours = 1,
  minutes = 2,
  seconds = 3,
}

export enum TimeFormat {
  H24,
  AM_PM,
}

// export enum TimeZoneOffset {
//   UTC_MINUS_12 = -720,
//   UTC_MINUS_11 = -660,
//   UTC_MINUS_10 = -600,
//   UTC_MINUS_9_30 = -570,
//   UTC_MINUS_9 = -540,
//   UTC_MINUS_8 = -480,
//   UTC_MINUS_7 = -420,
//   UTC_MINUS_6 = -360,
//   UTC_MINUS_5 = -300,
//   UTC_MINUS_4_30 = -270,
//   UTC_MINUS_4 = -240,
//   UTC_MINUS_3_30 = -210,
//   UTC_MINUS_3 = -180,
//   UTC_MINUS_2 = -120,
//   UTC_MINUS_1 = -60,
//   UTC_0 = 0,
//   UTC_PLUS_1 = 60,
//   UTC_PLUS_2 = 120,
//   UTC_PLUS_3 = 180,
//   UTC_PLUS_3_30 = 210,
//   UTC_PLUS_4 = 240,
//   UTC_PLUS_4_30 = 270,
//   UTC_PLUS_5 = 300,
//   UTC_PLUS_5_30 = 330,
//   UTC_PLUS_5_45 = 345,
//   UTC_PLUS_6 = 360,
//   UTC_PLUS_6_30 = 390,
//   UTC_PLUS_7 = 420,
//   UTC_PLUS_8 = 480,
//   UTC_PLUS_8_45 = 525,
//   UTC_PLUS_9 = 540,
//   UTC_PLUS_9_30 = 570,
//   UTC_PLUS_10 = 600,
//   UTC_PLUS_10_30 = 630,
//   UTC_PLUS_11 = 660,
//   UTC_PLUS_12 = 720,
//   UTC_PLUS_12_45 = 765,
//   UTC_PLUS_13 = 780,
//   UTC_PLUS_14 = 840,
// }

export const timeZoneOffsets = new Map<string, number>([
  ['GMT-12:00', -720],
  ['GMT-11:00', -660],
  ['GMT-10:00', -600],
  ['GMT-9:30', -570],
  ['GMT-9:00', -540],
  ['GMT-8:00', -480],
  ['GMT-7:00', -420],
  ['GMT-6:00', -360],
  ['GMT-5:00', -300],
  ['GMT-4:30', -270],
  ['GMT-4:00', -240],
  ['GMT-3:30', -210],
  ['GMT-3:00', -180],
  ['GMT-2:00', -120],
  ['GMT-1:00', -60],
  ['GMT±0:00', 0],
  ['GMT+1:00', 60],
  ['GMT+2:00', 120],
  ['GMT+3:00', 180],
  ['GMT+3:30', 210],
  ['GMT+4:00', 240],
  ['GMT+4:30', 270],
  ['GMT+5:00', 300],
  ['GMT+5:30', 330],
  ['GMT+5:45', 345],
  ['GMT+6:00', 360],
  ['GMT+6:30', 390],
  ['GMT+7:00', 420],
  ['GMT+8:00', 480],
  ['GMT+8:45', 525],
  ['GMT+9:00', 540],
  ['GMT+9:30', 570],
  ['GMT+10:00', 600],
  ['GMT+10:30', 630],
  ['GMT+11:00', 660],
  ['GMT+11:30', 690],
  ['GMT+12:00', 720],
  ['GMT+12:45', 765],
  ['GMT+13:00', 780],
  ['GMT+14:00', 840],
]);

export class ClockModel extends Observable {
  private hours: number;
  private minutes: number;
  private seconds: number;
  private editMode: EditMode = EditMode.idle;
  private timeFormat: TimeFormat = TimeFormat.H24;
  private timeZoneOffset: number;

  constructor(private lightIsOn: boolean = false) {
    super();
    this.timeZoneOffset = new Date().getTimezoneOffset();
    this.setToCurrentTime();
  }

  private setToCurrentTime(): void {
    const now = new Date();
    now.setUTCMinutes(now.getUTCMinutes() + this.timeZoneOffset);
    this.hours = now.getUTCHours();
    this.minutes = now.getUTCMinutes();
    this.seconds = now.getUTCSeconds();
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
    console.log(this.timeZoneOffset);
    return this.hours;
  }
  public getMinutes(): number {
    return this.minutes;
  }
  public getSeconds(): number {
    return this.seconds;
  }

  public reset(): void {
    this.setToCurrentTime();
    this.notifyObservers();
  }

  public setTimeZoneOffset(timeZoneOffset: number): void {
    this.timeZoneOffset = timeZoneOffset;
    this.setToCurrentTime();
    this.notifyObservers();
  }

  public getTimeFormat(): TimeFormat {
    return this.timeFormat;
  }

  public toggleTimeFormat(): void {
    this.timeFormat =
      this.timeFormat === TimeFormat.AM_PM ? TimeFormat.H24 : TimeFormat.AM_PM;
    this.notifyObservers();
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
