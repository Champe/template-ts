type TickCallback = () => void;

/**
 * A service that handles time ticks, notifying subscribers every second.
 */
export class TimeTickerService {
  private static instance: TimeTickerService;
  private callbacks: TickCallback[] = [];
  private intervalId: NodeJS.Timeout | null = null;

  /**
   * Private constructor to initialize the TimeTickerService and start the timer.
   * @private
   */
  private constructor() {
    this.start();
  }

  /**
   * Retrieves the singleton instance of the TimeTickerService.
   * @throws Will throw an error if the TimeTickerService has not been initialized.
   * @returns The singleton instance of TimeTickerService.
   */
  public static getInstance(): TimeTickerService {
    if (!this.instance) {
      throw new Error('TimeTickerService must be initialized before using it');
    }
    return this.instance;
  }

  /**
   * Initializes the singleton instance of TimeTickerService.
   * @returns The initialized instance of TimeTickerService.
   */
  public static initialize(): TimeTickerService {
    if (!this.instance) {
      this.instance = new TimeTickerService();
    }
    return this.instance;
  }

  /**
   * Clears any existing timers.
   * @private
   */
  private clearTimers(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Starts the timer to notify subscribers every second.
   * @private
   */
  private start(): void {
    this.clearTimers();
    this.intervalId = setInterval(() => this.notifySubscribers(), 1000);
  }

  /**
   * Subscribes a callback function to be notified every time the time ticker triggers.
   * @param callback The function to be called every time a tick occurs.
   */
  public subscribe(callback: TickCallback): void {
    this.callbacks.push(callback);
  }

  /**
   * Unsubscribes a callback function from the time ticker notifications.
   * @param callback The function to be removed from the subscription list.
   */
  public unsubscribe(callback: TickCallback): void {
    this.callbacks = this.callbacks.filter(
      (_callback) => _callback !== callback
    );
  }

  /**
   * Notifies all subscribers by invoking their callback functions.
   * @private
   */
  private notifySubscribers(): void {
    this.callbacks.forEach((callback) => callback());
  }

  /**
   * Stops the time ticker by clearing the interval timer.
   */
  public stop(): void {
    this.clearTimers();
  }
}
