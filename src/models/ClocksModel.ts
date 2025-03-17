import { ClockController } from '../controllers/ClockController';
import { DigitalClockController } from '../controllers/DigitalClockController';
import { ClockModel } from './ClockModel';

/**
 * Model for managing a collection of clocks.
 * It handles the creation, removal, and retrieval of clocks.
 */
export class ClocksModel {
  private clocks: ClockController[] = [];

  /**
   * Adds a new clock to the collection.
   * A new ClockController instance is created, and an event listener is added to remove the clock when the remove button is clicked.
   */
  public addClock(timeZoneOffset?: number): void {
    const newClockController = new DigitalClockController(
      new ClockModel(false, timeZoneOffset)
    );
    this.clocks.push(newClockController);
    newClockController.addEventListenerToRemoveButton('click', () =>
      this.removeClock(newClockController)
    );
  }

  /**
   * Removes a clock from the collection.
   * The specified ClockController is found and removed from the clocks array.
   * The disposed ClockController is properly cleaned up.
   * @param clockController The ClockController instance to be removed.
   */
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

  /**
   * Retrieves the list of current clocks.
   * @returns {ClockController[]} An array of ClockController instances.
   */
  public getClocks(): ClockController[] {
    return this.clocks;
  }

  /**
   * Reset all clocks
   */
  public resetAllClocks(): void {
    this.clocks.forEach((clock) => (clock as DigitalClockController).reset());
  }

  /**
   * Toggle all lights
   */
  public toggleAllLights(): void {
    this.clocks.forEach((clock) =>
      (clock as DigitalClockController).toggleLightState()
    );
  }

  /**
   * Reset all lights
   */
  public resetAllLights(): void {
    this.clocks.forEach((clock) =>
      (clock as DigitalClockController).resetLightState()
    );
  }
}
