import path from "path";

export interface PngTarget {
  name: string;
  size: number;
  outPath: string;
}

export interface LogoConfig {
  svgInputPath: string;
  publicDir: string;
  pngTargets: PngTarget[];
  icoOutputPath: string;
  icoSizes: number[];
}

const ROOT_DIR = process.cwd();
const PUBLIC_DIR = path.join(ROOT_DIR, "public");

export const LOGO_CONFIG: LogoConfig = {
  svgInputPath: path.join(PUBLIC_DIR, "logo.svg"),
  publicDir: PUBLIC_DIR,
  pngTargets: [
    { name: "favicon-16x16.png", size: 16, outPath: path.join(PUBLIC_DIR, "favicon-16x16.png") },
    { name: "favicon-32x32.png", size: 32, outPath: path.join(PUBLIC_DIR, "favicon-32x32.png") },
    { name: "favicon-48x48.png", size: 48, outPath: path.join(PUBLIC_DIR, "favicon-48x48.png") },
    { name: "icon-16.png", size: 16, outPath: path.join(PUBLIC_DIR, "icon-16.png") },
    { name: "icon-32.png", size: 32, outPath: path.join(PUBLIC_DIR, "icon-32.png") },
    { name: "icon-48.png", size: 48, outPath: path.join(PUBLIC_DIR, "icon-48.png") },
    { name: "icon-64.png", size: 64, outPath: path.join(PUBLIC_DIR, "icon-64.png") },
    { name: "icon-128.png", size: 128, outPath: path.join(PUBLIC_DIR, "icon-128.png") },
    { name: "apple-touch-icon.png", size: 180, outPath: path.join(PUBLIC_DIR, "apple-touch-icon.png") },
    { name: "icon-192.png", size: 192, outPath: path.join(PUBLIC_DIR, "icon-192.png") },
    { name: "icon-512.png", size: 512, outPath: path.join(PUBLIC_DIR, "icon-512.png") },
  ],
  icoOutputPath: path.join(PUBLIC_DIR, "favicon.ico"),
  icoSizes: [16, 32, 48],
};
