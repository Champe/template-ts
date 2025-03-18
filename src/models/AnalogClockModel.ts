import { ClockModel, ClockType, EditMode } from './ClockModel';

export class AnalogClockModel extends ClockModel {
  constructor(protected timeZoneOffsets?: number) {
    super(ClockType.analog, timeZoneOffsets);
  }
}
