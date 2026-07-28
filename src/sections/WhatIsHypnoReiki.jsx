import Reveal from '../components/Reveal.jsx';
import LazyVideo from '../components/LazyVideo.jsx';
import WatchVideoTrigger from '../components/WatchVideoTrigger.jsx';
import { VIDEO_ASSETS } from '../lib/videoAssets.js';

export default function WhatIsHypnoReiki() {
  return (
    <section id="what-is-hypnoreiki" className="section video-section" aria-labelledby="hypnoreiki-heading">
      <LazyVideo asset={VIDEO_ASSETS.whatIsHypnoReiki} mode="background" aria-hidden="true" />
      <div className="section-scrim" aria-hidden="true" />

      <div className="container section-content narrow-content">
        <p className="eyebrow">A Clinically Grounded Approach</p>
        <Reveal as="h2" id="hypnoreiki-heading" className="section-heading">
          What is HypnoReiki?
        </Reveal>
        <Reveal as="p" delay={80} className="section-lede">
          HypnoReiki is IOCE&rsquo;s integrated methodology &mdash; internationally accredited
          Clinical Hypnotherapy combined with Authentic Usui Reiki. Clinical Hypnotherapy works
          directly with the subconscious mind to identify and re-pattern the root cause of a
          challenge, while Reiki supports the nervous system&rsquo;s natural capacity to settle and
          recover. Together, they address both the mental pattern and the state it lives in.
        </Reveal>
        <Reveal delay={160} className="section-actions">
          <WatchVideoTrigger asset={VIDEO_ASSETS.whatIsHypnoReiki} label="Watch Video" />
          <a href="#why-choose-ioce" className="btn btn--ghost">
            Discover Your Transformation &darr;
          </a>
        </Reveal>
      </div>
    </section>
  );
}
