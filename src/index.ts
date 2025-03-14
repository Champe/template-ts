import { ClockController } from './controllers/ClockController';
import './index.css';
import { ClockModel } from './models/ClockModel';
import { ClockView } from './views/ClockView';

(function () {
  const clockContainer = document.getElementById('clock-digits-container');
  const editModeButton = document.getElementById('edit-mode-button');
  const increaseValueButton = document.getElementById('increase-value-button');

  const clockModel = new ClockModel();
  const clockController = new ClockController(clockModel);
  const clockView = new ClockView(
    clockController,
    clockContainer,
    editModeButton,
    increaseValueButton
  );

  clockModel.addObserver(clockView);

  clockView.init();
})();
