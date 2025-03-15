export class SVGService {
  /**
   * Loads an SVG file from a local path
   * @param filePath - The path to the local SVG file
   */
  static async loadLocalSVG(filePath: string): Promise<HTMLElement> {
    try {
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error(
          `Failed to load SVG: ${response.status} ${response.statusText}`
        );
      }

      const svgText = await response.text();
      const parser = new DOMParser();
      const svgDocument = parser.parseFromString(svgText, 'image/svg+xml');
      return svgDocument.documentElement;
    } catch (error) {
      console.error('Error loading SVG:', error);
    }
  }
}
