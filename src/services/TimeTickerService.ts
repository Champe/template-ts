type TickCallback = () => void;

export class TimeTickerService {
  private static instance: TimeTickerService;
  private callbacks: TickCallback[] = [];
  private intervalId: NodeJS.Timeout | null = null;

  private constructor() {
    this.start();
  }

  public static getInstance(): TimeTickerService {
    if (!this.instance) {
      throw new Error('SVGService must be initalized before using it');
    }
    return this.instance;
  }

  public static initialize(): TimeTickerService {
    if (!this.instance) {
      this.instance = new TimeTickerService();
    }
    return this.instance;
  }

  private clearTimers(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private start(): void {
    this.clearTimers();
    this.intervalId = setInterval(() => this.notifySubscribers(), 1000);
  }

  public subscribe(callback: TickCallback): void {
    this.callbacks.push(callback);
  }

  public unsubscribe(callback: TickCallback): void {
    this.callbacks = this.callbacks.filter(
      (_callback) => _callback !== callback
    );
  }

  private notifySubscribers(): void {
    this.callbacks.forEach((callback) => callback());
  }

  public stop(): void {
    this.clearTimers();
  }
}
