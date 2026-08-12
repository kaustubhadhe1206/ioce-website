import Button from '../components/Button.jsx';
import LazyVideo from '../components/LazyVideo.jsx';
import WatchVideoTrigger from '../components/WatchVideoTrigger.jsx';
import { VIDEO_ASSETS } from '../lib/videoAssets.js';

export default function Hero() {
  return (
    <section className="hero" aria-label="Introduction">
      <LazyVideo asset={VIDEO_ASSETS.heroLoop} mode="background" aria-hidden="true" />
      <div className="section-scrim" aria-hidden="true" />

      <div className="container section-content hero__content">
        <p className="eyebrow">Institute Of Consciousness Engineering</p>
        <h1 className="hero__headline">Yes!!, Zindagi Badal Sakti Hai, Janiye Kaise?</h1>
        <p className="hero__tagline">
          By Re-Engineering the Thoughts Within Your Subconscious. Transform Your Life.
        </p>
        <p className="hero__subheadline">
          Clinical Hypnotherapy integrated with Authentic Usui Reiki to create meaningful, lasting
          transformations.
        </p>
        <div className="hero__actions">
          <Button href="#book-consultation" variant="primary">
            Book Your Consultation
          </Button>
          <WatchVideoTrigger asset={VIDEO_ASSETS.watchHowItWorks} label="Watch How It Works" />
        </div>
      </div>
    </section>
  );
}
