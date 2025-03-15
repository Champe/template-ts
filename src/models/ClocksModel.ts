import { ClockController } from '../controllers/ClockController';
import { Observable } from '../interfaces/IObserver';
import { ClockModel } from './ClockModel';

export class ClocksModel extends Observable {
  private clocks: ClockController[] = [];

  public addClock(): void {
    const newClockController = new ClockController(new ClockModel());
    this.clocks.push(newClockController);
    this.notifyObservers();
    newClockController.addEventListenerToRemoveButton('click', () =>
      this.removeClock(newClockController)
    );
  }

  public removeClock(clockController: ClockController): void {
    const index = this.clocks.findIndex((clock) => clock === clockController);
    if (index !== -1) {
      this.clocks.splice(index, 1);
    }
  }

  public getClocks(): ClockController[] {
    return this.clocks;
  }
}
