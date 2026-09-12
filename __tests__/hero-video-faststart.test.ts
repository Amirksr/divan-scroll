import fs from 'fs';
import path from 'path';

/**
 * Regression test for a real production bug: the hero's scroll-scrubbed
 * background video (public/videos/divan-interior-hero.mp4) was exported
 * with its `moov` atom (the box holding duration, dimensions, and the
 * seek index) placed AFTER the `mdat` atom (the actual, multi-megabyte
 * media payload) -- i.e. not "faststart".
 *
 * Browsers can't read `duration` or fire `loadedmetadata` until they've
 * parsed `moov`. With `moov` at the end of the file, that meant
 * downloading the ENTIRE video before scrubbing could start at all,
 * regardless of connection speed -- on a slow connection this looked
 * exactly like "the video never scrolls", while everything else on the
 * page (which doesn't wait on the video) worked fine.
 *
 * This walks the file's top-level MP4 box structure directly (no video
 * library needed -- MP4/ISOBMFF boxes are just [4-byte size][4-byte
 * type][payload], read sequentially from offset 0) and asserts `moov`
 * appears before `mdat`, so a future re-export/re-upload of this asset
 * without `-movflags +faststart` fails CI instead of shipping silently.
 */
describe('hero background video is faststart (moov before mdat)', () => {
  const videoPath = path.join(__dirname, '..', 'public', 'videos', 'divan-interior-hero.mp4');

  function readTopLevelBoxTypes(filePath: string): string[] {
    const data = fs.readFileSync(filePath);
    const types: string[] = [];
    let pos = 0;

    while (pos + 8 <= data.length) {
      const size32 = data.readUInt32BE(pos);
      const type = data.toString('ascii', pos + 4, pos + 8);
      types.push(type);

      if (size32 === 0) break; // box extends to EOF -- nothing after it
      if (size32 === 1) {
        // 64-bit "largesize" follows the type for boxes bigger than 4GB.
        const high = data.readUInt32BE(pos + 8);
        const low = data.readUInt32BE(pos + 12);
        const size64 = high * 2 ** 32 + low;
        pos += size64;
      } else {
        pos += size32;
      }
    }

    return types;
  }

  it('the video file exists in public/videos', () => {
    expect(fs.existsSync(videoPath)).toBe(true);
  });

  it('has a moov box positioned before its mdat box', () => {
    const types = readTopLevelBoxTypes(videoPath);
    const moovIndex = types.indexOf('moov');
    const mdatIndex = types.indexOf('mdat');

    expect(moovIndex).toBeGreaterThanOrEqual(0);
    expect(mdatIndex).toBeGreaterThanOrEqual(0);
    expect(moovIndex).toBeLessThan(mdatIndex);
  });
});
