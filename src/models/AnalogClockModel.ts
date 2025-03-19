import { ClockModel, ClockType, EditMode } from './ClockModel';

export class AnalogClockModel extends ClockModel {
  constructor(protected timeZoneOffsets?: number) {
    super(ClockType.analog, timeZoneOffsets);
  }

  /**
   * Override tick to prevent it to update time when in edit mode
   */
  public tick(): void {
    // We don't want to update time during edition on analog clocks
    if (this.editMode !== EditMode.idle) {
      return;
    }
    this.incrementTimeByOneSecond();
    this.notifyObservers();
  }

  public toggleEditMode(): void {
    this.editMode =
      this.editMode === EditMode.idle ? EditMode.minutes : EditMode.idle;
    this.notifyObservers();
  }

  public incrementTimeByMinutes(minutes: number): void {
    throw new Error('To implement');
  }
}
