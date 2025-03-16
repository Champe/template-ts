export abstract class Observer {
  public abstract update(observable: Observable): void;
}

export class Observable {
  private observers: Observer[] = [];

  public addObserver(observer: Observer): void {
    this.observers.push(observer);
  }

  public removeObserver(observer: Observer): Observer | null {
    const index: number = this.observers.findIndex(
      (_observer) => _observer === observer
    );
    return index == -1 ? null : this.observers.splice(index, index)[0];
  }

  public notifyObservers(): void {
    for (const observer of this.observers) {
      observer.update(this);
    }
  }
}
