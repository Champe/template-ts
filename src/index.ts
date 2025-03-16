import { ClockController } from './controllers/ClockController';
import { ClocksController } from './controllers/ClocksController';
import './index.css';
import { timeZoneOffsets } from './models/ClockModel';
import { ClocksModel } from './models/ClocksModel';
import { SVGService } from './services/SvgService';
import { TimeTickerService } from './services/TimeTickerService';

(async function () {
  await SVGService.initialize();
  TimeTickerService.initialize();
  const clocksController = new ClocksController(new ClocksModel());
  timeZoneOffsets.forEach((currentOffset, timezone) => {
    clocksController.addClock(currentOffset);
  });
})();
