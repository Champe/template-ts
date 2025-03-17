import { AnalogClockController } from '../controllers/AnalogClockController';
import { ClockController } from '../controllers/ClockController';
import { DigitalClockController } from '../controllers/DigitalClockController';
import { ClockModel, ClockType } from './ClockModel';

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
  public addClock(type: ClockType, timeZoneOffset?: number): void {
    const model: ClockModel = new ClockModel(false, timeZoneOffset);
    const newClockController =
      type === ClockType.digital
        ? new DigitalClockController(model)
        : new AnalogClockController(model);
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
    this.clocks.forEach((clock) => {
      if (clock.getType() !== ClockType.digital) {
        return;
      }
      (clock as DigitalClockController).reset();
    });
  }

  /**
   * Toggle all lights
   */
  public toggleAllLights(): void {
    this.clocks.forEach((clock) => {
      if (clock.getType() !== ClockType.digital) {
        return;
      }
      (clock as DigitalClockController).toggleLightState();
    });
  }

  /**
   * Reset all lights
   */
  public resetAllLights(): void {
    this.clocks.forEach((clock) => {
      if (clock.getType() !== ClockType.digital) {
        return;
      }
      (clock as DigitalClockController).resetLightState();
    });
  }
}
