import { ClockController } from './controllers/ClockController';
import { ClocksController } from './controllers/ClocksController';
import './index.css';
import { ClocksModel } from './models/ClocksModel';
import { SVGService } from './services/SvgService';
import { TimeTickerService } from './services/TimeTickerService';

(async function () {
  await SVGService.initialize();
  TimeTickerService.initialize();
  const clocksController = new ClocksController(new ClocksModel());
  clocksController.addClock();
})();
