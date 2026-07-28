import Reveal from '../components/Reveal.jsx';
import LazyVideo from '../components/LazyVideo.jsx';
import { VIDEO_ASSETS } from '../lib/videoAssets.js';

export default function InvisibleBarrier() {
  return (
    <section className="section video-section" aria-labelledby="invisible-barrier-heading">
      <LazyVideo asset={VIDEO_ASSETS.invisibleBarrier} mode="background" aria-hidden="true" />
      <div className="section-scrim" aria-hidden="true" />

      <div className="container section-content narrow-content">
        <Reveal as="h2" id="invisible-barrier-heading" className="section-heading">
          The Invisible Barrier
        </Reveal>
        <Reveal as="p" delay={80} className="section-lede">
          You&rsquo;ve read the books. Tried the techniques. Made the promises to yourself. And yet,
          the same patterns quietly return &mdash; in your decisions, your relationships, your
          reactions under pressure. That barrier isn&rsquo;t a lack of willpower. It sits far below
          conscious thought, in the subconscious mind that runs the vast majority of what you do.
        </Reveal>
        <Reveal delay={160}>
          <a href="#what-is-hypnoreiki" className="btn btn--ghost">
            Continue &darr;
          </a>
        </Reveal>
      </div>
    </section>
  );
}
