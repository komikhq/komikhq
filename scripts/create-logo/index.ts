import fs from "fs/promises";
import { LOGO_CONFIG } from "./config";
import { loadSvgBuffer } from "./svg-loader";
import { convertSvgToPngs } from "./png-converter";
import { generateIcoFile } from "./ico-converter";

async function main() {
  console.log("🎨 Starting GoxStream Logo & Favicon Generator...");
  console.log(`📍 Input SVG: ${LOGO_CONFIG.svgInputPath}`);

  try {
    // 1. Load SVG Buffer
    const svgBuffer = await loadSvgBuffer(LOGO_CONFIG.svgInputPath);
    console.log("✓ Loaded SVG buffer successfully.");

    // 2. Generate PNG multisize buffers and save files
    const pngResults = await convertSvgToPngs(svgBuffer, LOGO_CONFIG.pngTargets);
    for (const res of pngResults) {
      await fs.writeFile(res.target.outPath, res.buffer);
      console.log(`  └─ Generated PNG (${res.target.size}x${res.target.size}): ${res.target.name}`);
    }

    // 3. Generate ICO file
    const icoBuffer = await generateIcoFile(pngResults, LOGO_CONFIG.icoSizes);
    await fs.writeFile(LOGO_CONFIG.icoOutputPath, icoBuffer);
    console.log(`✓ Generated multi-size ICO: favicon.ico (${LOGO_CONFIG.icoSizes.join(", ")}px)`);

    console.log("\n🚀 All logo assets generated successfully!");
  } catch (error) {
    console.error("❌ Failed to generate logo assets:", error);
    process.exit(1);
  }
}

main();
