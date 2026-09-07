import pngToIco from "png-to-ico";
import type { GeneratedPng } from "./png-converter";

export async function generateIcoFile(
  generatedPngs: GeneratedPng[],
  icoSizes: number[]
): Promise<Buffer> {
  // Filter PNG buffers that match required ico sizes
  const icoBuffers = generatedPngs
    .filter((p) => icoSizes.includes(p.target.size))
    .map((p) => p.buffer);

  if (icoBuffers.length === 0) {
    throw new Error("No PNG buffers found for ICO generation.");
  }

  const icoBuffer = await pngToIco(icoBuffers);
  return icoBuffer;
}
