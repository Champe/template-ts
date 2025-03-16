/**
 * Singleton service class for managing and loading SVG elements.
 * Handles the loading of SVG files and provides access to the clock SVG element.
 */
export class SVGService {
  private static instance: SVGService;

  /**
   * Private constructor for the SVGService. Can only be called within the class.
   * @param clockSVGElement The loaded SVG element for the clock.
   */
  private constructor(private clockSVGElement: HTMLElement) {}

  /**
   * Constructs the SVGService by loading an SVG file from the provided path.
   * @returns A Promise that resolves to an SVGService instance.
   */
  private static async construct(): Promise<SVGService> {
    const clockSVGElement = await this.loadLocalSVG('assets/images/clock.svg');
    return new SVGService(clockSVGElement);
  }

  /**
   * Returns the singleton instance of the SVGService.
   * Throws an error if the SVGService has not been initialized yet.
   * @throws Error if SVGService is not initialized.
   * @returns The singleton instance of SVGService.
   */
  public static getInstance(): SVGService {
    if (!this.instance) {
      throw new Error('SVGService must be initialized before using it');
    }
    return this.instance;
  }

  /**
   * Initializes the SVGService singleton instance.
   * If not initialized, it loads the SVG and sets up the instance.
   * @returns A Promise that resolves to the initialized SVGService instance.
   */
  public static async initialize(): Promise<SVGService> {
    if (!SVGService.instance) {
      SVGService.instance = await SVGService.construct();
    }
    return SVGService.instance;
  }

  /**
   * Loads an SVG file from the specified path.
   * @param filePath The relative file path to the SVG file.
   * @returns A Promise that resolves to an HTML element representing the loaded SVG.
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
   * Returns a clone of the clock SVG element.
   * @returns A cloned copy of the clock SVG element.
   */
  public getClockSVGElement(): HTMLElement | null {
    return this.clockSVGElement.cloneNode(true) as HTMLElement;
  }
}
