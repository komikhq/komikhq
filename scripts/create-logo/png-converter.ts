import sharp from "sharp";
import type { PngTarget } from "./config";

export interface GeneratedPng {
  target: PngTarget;
  buffer: Buffer;
}

export async function convertSvgToPngs(
  svgBuffer: Buffer,
  targets: PngTarget[]
): Promise<GeneratedPng[]> {
  const results: GeneratedPng[] = [];

  for (const target of targets) {
    const pngBuffer = await sharp(svgBuffer)
      .resize(target.size, target.size, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png({ compressionLevel: 9 })
      .toBuffer();

    results.push({
      target,
      buffer: pngBuffer,
    });
  }

  return results;
}
