import { ClockController } from './controllers/ClockController';
import { ClocksController } from './controllers/ClocksController';
import './index.css';
import { ClocksModel } from './models/ClocksModel';
import { SVGService } from './services/SvgService';

(async function () {
  await SVGService.initialize();
  const clocksController = new ClocksController(new ClocksModel());
  clocksController.addClock();
})();
