/**
 * DOM helpers for the hero's scroll-scrubbed background video. Pulled out
 * of Hero.tsx so this logic is unit-testable against a mocked
 * HTMLVideoElement without needing to render the whole GSAP/ScrollTrigger
 * component tree.
 */

/**
 * Seeks the video to `progress` (0..1) of its total duration. No-ops
 * safely if the video isn't mounted yet or its duration isn't known yet
 * (metadata not loaded, load failed, etc.) -- callers don't need to guard
 * against either case themselves.
 */
export function syncVideoTime(video: HTMLVideoElement | null, progress: number): void {
  if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;
  const clamped = Math.min(1, Math.max(0, progress));
  video.currentTime = clamped * video.duration;
}

/**
 * Forces the browser to decode the video's first frame without ever
 * visibly autoplaying it. Some browsers (notably iOS Safari) won't seek a
 * paused <video> that has never played -- setting `currentTime` silently
 * no-ops until the video has actually rendered at least one frame. A
 * muted play() immediately followed by pause() works around that.
 *
 * play() rejects (rather than throwing) when the browser blocks it, so
 * that's swallowed here -- worst case on a blocking browser is the same
 * graceful "no scrub yet" state syncVideoTime already tolerates.
 */
export function primeVideoPlayback(video: HTMLVideoElement | null): void {
  if (!video) return;
  video
    .play()
    .then(() => video.pause())
    .catch(() => {
      // Autoplay blocked or playback interrupted -- nothing to do, the
      // video will simply stay on its poster frame until it can decode.
    });
}
