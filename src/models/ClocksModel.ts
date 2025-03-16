import { ClockController } from '../controllers/ClockController';
import { Observable } from '../core/Observer';
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
      const removedClockController: ClockController = this.clocks.splice(
        index,
        1
      )[0];
      removedClockController.dispose();
    }
  }

  public getClocks(): ClockController[] {
    return this.clocks;
  }
}
