import fs from "fs/promises";
import fsSync from "fs";

export async function loadSvgBuffer(svgPath: string): Promise<Buffer> {
  if (!fsSync.existsSync(svgPath)) {
    throw new Error(`Input SVG file not found at: ${svgPath}`);
  }

  const svgContent = await fs.readFile(svgPath);
  if (svgContent.length === 0) {
    throw new Error(`SVG file at ${svgPath} is empty.`);
  }

  return svgContent;
}
