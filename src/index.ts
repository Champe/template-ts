import { ClockController } from './controllers/ClockController';
import { ClocksController } from './controllers/ClocksController';
import './index.css';
import { ClockType, timeZoneOffsets } from './models/ClockModel';
import { ClocksModel } from './models/ClocksModel';
import { SVGService } from './services/SvgService';
import { TimeTickerService } from './services/TimeTickerService';

(async function () {
  await SVGService.initialize();
  TimeTickerService.initialize();
  const clocksController = new ClocksController(new ClocksModel());
  let i = 0;

  timeZoneOffsets.forEach((currentOffset, timezone) => {
    if (currentOffset < 0) {
      return;
    }
    clocksController.addClock(
      i % 2 === 0 ? ClockType.digital : ClockType.analog,
      currentOffset
    );
    i++;
  });
})();
