import fs from 'fs';
import path from 'path';

/**
 * Regression test for a real bug: several menu photos shipped with a
 * 1-4px strip along the top and/or bottom edge that ramped up to near
 * white -- an artifact of the source export, not part of the photograph.
 * Against the dark theme those strips read as a bright hairline across
 * the card, which is what made americano/cappuccino/latte/mocha look
 * inconsistent with their neighbours (the same defect was also on the
 * bottom edge of six more photos).
 *
 * The artifact has a distinctive shape: the outermost row is far brighter
 * than the image body AND falls away steeply inward. Genuinely bright
 * photography (a sunlit window, a white tablecloth) is flat across those
 * same rows instead, so this check doesn't flag it -- meygoo-polo and
 * zeytoon-koofte both have bright edges and both pass.
 *
 * Decoding WebP needs a native module. `sharp` is present in this repo
 * only transitively via Next.js and is NOT a declared dependency, and its
 * prebuilt binaries don't cover 32-bit Windows -- which is this project's
 * actual dev machine. So the pixel assertions are skipped rather than
 * failed when it can't be loaded, and the always-on part below checks
 * what it can without decoding anything.
 */
const MENU_DIR = path.join(__dirname, '..', 'public', 'images', 'menu');
const files = fs.readdirSync(MENU_DIR).filter((f) => f.endsWith('.webp'));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let sharp: any;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  sharp = require('sharp');
} catch {
  sharp = undefined;
}

describe('menu photos', () => {
  it('are all present and non-empty', () => {
    expect(files.length).toBeGreaterThan(50);
    for (const f of files) {
      expect([f, fs.statSync(path.join(MENU_DIR, f)).size > 0]).toEqual([f, true]);
    }
  });

  it('are all real WebP files (RIFF....WEBP header)', () => {
    for (const f of files) {
      const head = fs.readFileSync(path.join(MENU_DIR, f)).subarray(0, 12);
      expect([f, head.toString('ascii', 0, 4), head.toString('ascii', 8, 12)]).toEqual([
        f,
        'RIFF',
        'WEBP',
      ]);
    }
  });
});

const describeIfSharp = sharp ? describe : describe.skip;

describeIfSharp('menu photos have no bright edge artifact', () => {
  async function rowBrightness(file: string): Promise<{ rows: number[]; body: number }> {
    const { data, info } = await sharp(path.join(MENU_DIR, file))
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { width, height, channels } = info;
    const rows: number[] = [];
    for (let y = 0; y < height; y++) {
      let sum = 0;
      let n = 0;
      for (let x = 0; x < width; x += 8) {
        const i = (y * width + x) * channels;
        sum += (data[i] + data[i + 1] + data[i + 2]) / 3;
        n++;
      }
      rows.push(sum / n);
    }

    const middle = rows.slice(12, Math.max(13, height - 12)).slice().sort((a, b) => a - b);
    return { rows, body: middle[Math.floor(middle.length / 2)] };
  }

  /** True when `edge` is far brighter than the body and drops off steeply. */
  function hasArtifactRamp(edge: number[], body: number): boolean {
    return edge[0] > body + 60 && edge[0] > 100 && edge[3] < edge[0] - 20;
  }

  it.each(files)('%s has a clean top and bottom edge', async (file) => {
    const { rows, body } = await rowBrightness(file);
    expect([file, 'top', hasArtifactRamp(rows.slice(0, 4), body)]).toEqual([file, 'top', false]);
    expect([file, 'bottom', hasArtifactRamp(rows.slice(-4).reverse(), body)]).toEqual([
      file,
      'bottom',
      false,
    ]);
  });
});
