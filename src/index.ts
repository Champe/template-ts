import { ClockController } from './controllers/ClockController';
import './index.css';
import { ClockModel } from './models/ClockModel';
import { SVGService } from './service/SvgService';
import { ClockView } from './views/ClockView';

(async function () {
  const svgClock: HTMLElement = await SVGService.loadLocalSVG(
    'assets/images/clock.svg'
  );

  document.body.appendChild(svgClock);
  const clockModel = new ClockModel();
  const clockController = new ClockController(clockModel);
  const clockView = new ClockView(clockController, svgClock);

  clockModel.addObserver(clockView);

  clockView.init();
})();
