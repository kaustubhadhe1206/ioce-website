import { useEffect, useRef, useState } from 'react';
import { getVideoUrl } from '../lib/supabaseClient.js';

/**
 * Fetches the actual <video> src only once the element is near the
 * viewport (real lazy-loading, not just the `loading` attribute which
 * browsers don't consistently honour for <video>).
 *
 * mode="background": muted, autoplay, loop, no controls, fills container
 * mode="content": has controls, does not autoplay, keeps audio
 */
export default function LazyVideo({
  asset,
  mode = 'background',
  className = '',
  poster,
  ...rest
}) {
  const containerRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const isBackground = mode === 'background';

  // Background videos autoplay on loop indefinitely — a vestibular trigger
  // for some visitors, so WCAG 2.2.2 requires a way to avoid it. Simplest
  // reliable fix: honour the OS-level reduced-motion preference by not
  // autoplaying at all for background clips (content-mode videos already
  // require an explicit click via native controls, so they're unaffected).
  const prefersReducedMotion =
    isBackground &&
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const src = shouldLoad && !prefersReducedMotion ? getVideoUrl(asset) : null;

  useEffect(() => {
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setShouldLoad(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={`lazy-video lazy-video--${mode} ${className}`.trim()}>
      {src ? (
        <video
          src={src}
          poster={poster}
          muted={isBackground}
          autoPlay={isBackground}
          loop={isBackground}
          controls={!isBackground}
          playsInline
          preload="none"
          {...rest}
        />
      ) : (
        poster && <img src={poster} alt="" aria-hidden="true" className="lazy-video__poster" />
      )}
    </div>
  );
}
