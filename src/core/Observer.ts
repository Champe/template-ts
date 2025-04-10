/**
 * Abstract class for the Observer pattern.
 * Observers should implement the `update` method to respond to changes in an Observable.
 */
export abstract class Observer {
  public abstract update(): void;
}

/**
 * Class implementing the Observable pattern.
 * Manages a list of observers and notifies them of any changes.
 */
export class Observable {
  private observers: Observer[] = [];

  /**
   * Adds an observer to the list of observers.
   * @param observer The Observer instance to add.
   */
  public addObserver(observer: Observer): void {
    this.observers.push(observer);
  }

  /**
   * Removes an observer from the list of observers.
   * @param observer The Observer instance to remove.
   * @returns The removed Observer instance, or null if not found.
   */
  public removeObserver(observer: Observer): void {
    const index: number = this.observers.findIndex(
      (_observer) => _observer === observer
    );
    if (index === -1) {
      return;
    }
    this.observers.splice(index, 1);
  }

  /**
   * Notifies all observers of a change in the Observable.
   * This will call the `update` method on each observer.
   */
  public notifyObservers(): void {
    for (const observer of this.observers) {
      observer.update();
    }
  }
}
