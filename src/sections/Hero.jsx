import { useState } from 'react';
import Button from '../components/Button.jsx';
import LazyVideo from '../components/LazyVideo.jsx';
import { VIDEO_ASSETS } from '../lib/videoAssets.js';
import VideoModal from '../components/VideoModal.jsx';

export default function Hero() {
  const [showModal, setShowModal] = useState(false);

  return (
    <section className="hero" aria-label="Introduction">
      <LazyVideo asset={VIDEO_ASSETS.heroLoop} mode="background" aria-hidden="true" />
      <div className="section-scrim" aria-hidden="true" />

      <div className="container section-content hero__content">
        <p className="eyebrow">Institute Of Consciousness Engineering</p>
        <h1 className="hero__headline">
          Re-Engineer the Thoughts Within Your Subconscious. Transform Your Life.
        </h1>
        <p className="hero__subheadline">
          Clinical Hypnotherapy integrated with Authentic Usui Reiki to create meaningful, lasting
          transformations.
        </p>
        <div className="hero__actions">
          <Button href="#book-consultation" variant="primary">
            Book Your Consultation
          </Button>
          <Button as="button" variant="secondary" onClick={() => setShowModal(true)}>
            Watch How It Works
          </Button>
        </div>
      </div>

      {showModal && (
        <VideoModal asset={VIDEO_ASSETS.watchHowItWorks} onClose={() => setShowModal(false)} />
      )}
    </section>
  );
}
