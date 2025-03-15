import { ClocksModel } from '../models/ClocksModel';
import { ClocksView } from '../views/ClocksView';
import { ClockController } from './ClockController';

export class ClocksController {
  private view: ClocksView;
  constructor(private model: ClocksModel) {
    this.initializeView();
  }

  private initializeView(): void {
    this.view = new ClocksView(
      this,
      document.body.querySelector('.clocks-section')
    );
    this.model.addObserver(this.view);
    this.view.init();
  }

  public addClock(): void {
    this.model.addClock();
  }

  public getClocks(): ClockController[] {
    return this.model.getClocks();
  }
}
