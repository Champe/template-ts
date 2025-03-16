export class SVGService {
  private static instance: SVGService;

  /**
   * Private constructor to prevent direct instantiation.
   * Loads an SVG on initialization.
   */
  private constructor(private clockSVGElement: HTMLElement) {}
  private static async construct(): Promise<SVGService> {
    const clockSVGElement = await this.loadLocalSVG('assets/images/clock.svg');
    return new SVGService(clockSVGElement);
  }

  /**
   * Returns the singleton instance of SVGService.
   * @returns SVGService instance.
   */
  public static getInstance(): SVGService {
    if (!this.instance) {
      throw new Error('SVGService must be initalized before using it');
    }
    return this.instance;
  }

  /**
   * Instanciation of SVGService.
   * @returns SVGService instance.
   */
  public static async initialize(): Promise<SVGService> {
    if (!SVGService.instance) {
      SVGService.instance = await SVGService.construct();
    }
    return SVGService.instance;
  }

  /**
   * Loads an SVG file from a local path
   * @param filePath - The path to the local SVG file
   */
  public static async loadLocalSVG(filePath: string): Promise<HTMLElement> {
    // TODO(jpdcs): Handle possible errors
    const response = await fetch(filePath);
    const svgText = await response.text();
    const parser = new DOMParser();
    const svgDocument = parser.parseFromString(svgText, 'image/svg+xml');
    return svgDocument.documentElement;
  }

  /**
   * Getter for the loaded SVG element
   * @returns A clone of the loaded SVG element.
   */
  public getClockSVGElement(): HTMLElement | null {
    return this.clockSVGElement.cloneNode(true) as HTMLElement;
  }
}
