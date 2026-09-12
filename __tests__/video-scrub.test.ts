import { syncVideoTime, primeVideoPlayback } from '@/lib/video-scrub';

function mockVideo(overrides: Partial<HTMLVideoElement> = {}): HTMLVideoElement {
  return {
    currentTime: 0,
    duration: NaN,
    play: jest.fn().mockResolvedValue(undefined),
    pause: jest.fn(),
    ...overrides,
  } as unknown as HTMLVideoElement;
}

describe('syncVideoTime', () => {
  it('sets currentTime to progress * duration', () => {
    const video = mockVideo({ duration: 10 });
    syncVideoTime(video, 0.5);
    expect(video.currentTime).toBe(5);
  });

  it('clamps progress below 0', () => {
    const video = mockVideo({ duration: 10 });
    syncVideoTime(video, -0.5);
    expect(video.currentTime).toBe(0);
  });

  it('clamps progress above 1', () => {
    const video = mockVideo({ duration: 10 });
    syncVideoTime(video, 1.5);
    expect(video.currentTime).toBe(10);
  });

  it('does nothing when video is null (not mounted yet)', () => {
    expect(() => syncVideoTime(null, 0.5)).not.toThrow();
  });

  it('does nothing when duration is NaN (metadata not loaded yet)', () => {
    const video = mockVideo({ duration: NaN, currentTime: 3 });
    syncVideoTime(video, 0.5);
    expect(video.currentTime).toBe(3);
  });

  it('does nothing when duration is 0', () => {
    const video = mockVideo({ duration: 0, currentTime: 3 });
    syncVideoTime(video, 0.5);
    expect(video.currentTime).toBe(3);
  });

  it('does nothing when duration is Infinity (some live/streamed sources report this)', () => {
    const video = mockVideo({ duration: Infinity, currentTime: 3 });
    syncVideoTime(video, 0.5);
    expect(video.currentTime).toBe(3);
  });
});

describe('primeVideoPlayback', () => {
  it('does nothing when video is null (not mounted yet)', () => {
    expect(() => primeVideoPlayback(null)).not.toThrow();
  });

  it('calls play() and pauses once playback starts', async () => {
    const video = mockVideo();
    primeVideoPlayback(video);
    // play() resolves on a microtask; flush it.
    await Promise.resolve();
    await Promise.resolve();
    expect(video.play).toHaveBeenCalledTimes(1);
    expect(video.pause).toHaveBeenCalledTimes(1);
  });

  it('swallows a play() rejection (e.g. autoplay blocked) without throwing', async () => {
    const video = mockVideo({ play: jest.fn().mockRejectedValue(new Error('NotAllowedError')) });
    expect(() => primeVideoPlayback(video)).not.toThrow();
    await Promise.resolve();
    await Promise.resolve();
    expect(video.pause).not.toHaveBeenCalled();
  });
});
