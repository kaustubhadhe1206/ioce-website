import { useEffect, useRef, useState } from 'react';
import Reveal from '../components/Reveal.jsx';
import Card from '../components/Card.jsx';
import VideoModal from '../components/VideoModal.jsx';
import { getVideoUrl } from '../lib/supabaseClient.js';
import { VIDEO_ASSETS } from '../lib/videoAssets.js';

const CATEGORIES = [
  { label: 'Smoking', asset: VIDEO_ASSETS.issueSmoking },
  { label: 'Anxiety', asset: VIDEO_ASSETS.issueAnxiety },
  { label: 'Self-Doubt', asset: VIDEO_ASSETS.issueSelfDoubt },
  { label: 'Anger', asset: VIDEO_ASSETS.issueAnger },
  { label: 'Burnout', asset: VIDEO_ASSETS.issueBurnout },
  { label: 'Decision fatigue', asset: VIDEO_ASSETS.issueDecisionFatigue },
  { label: 'Imposter Syndrome', asset: VIDEO_ASSETS.issueImposterSyndrome },
  { label: 'Job Interview Anxiety', asset: VIDEO_ASSETS.issueJobInterviewAnxiety },
  { label: 'Overthinking', asset: VIDEO_ASSETS.issueOverthinking },
  { label: 'Relationships', asset: VIDEO_ASSETS.issueRelationships },
  { label: 'Sleep Deprivation', asset: VIDEO_ASSETS.issueSleepDeprivation },
];

export default function WhoCanBenefit() {
  // Shared across cards: once the visitor unmutes one preview, later hovers
  // play with sound too instead of forcing them to click the speaker every time.
  const [isMuted, setIsMuted] = useState(true);

  return (
    <section className="section" aria-labelledby="who-benefits-heading">
      <div className="container">
        <Reveal as="h2" id="who-benefits-heading" className="section-heading section-heading--center">
          Is this you or someone you love?
        </Reveal>

        <div className="card-grid benefit-grid">
          {CATEGORIES.map((category, index) => (
            <BenefitCard
              key={category.label}
              category={category}
              delay={(index % 4) * 80}
              isMuted={isMuted}
              setIsMuted={setIsMuted}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// Hover (or keyboard focus) lazily loads that issue's clip, pops the card up
// to the video's native 16:9 frame so nothing is cropped, and autoplays it.
// Browsers only allow unmuted autoplay from a "real" gesture like a click —
// hover doesn't qualify — so previews start muted with a speaker toggle,
// same pattern as Twitter/Instagram hover-previews.
function BenefitCard({ category, delay, isMuted, setIsMuted }) {
  const [isActive, setIsActive] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef(null);

  const activate = () => {
    setIsActive(true);
    setHasLoaded(true);
  };

  const deactivate = () => setIsActive(false);

  const src = hasLoaded ? getVideoUrl(category.asset) : null;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // Paused (not just muted) while the fullscreen modal is open — otherwise, if the
    // visitor had already unmuted the hover preview, its audio would overlap the modal's.
    if (isActive && !isFullscreen) {
      video.muted = isMuted;
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isActive, isMuted, isFullscreen, src]);

  const toggleMute = (event) => {
    event.stopPropagation();
    setIsMuted((muted) => !muted);
  };

  return (
    <Reveal
      as={Card}
      delay={delay}
      className={`benefit-card ${isActive ? 'benefit-card--active' : ''}`}
      onMouseEnter={activate}
      onMouseLeave={deactivate}
      onFocus={activate}
      onBlur={deactivate}
      tabIndex={0}
    >
      <div className="benefit-card__inner">
        <span className="benefit-card__mark" aria-hidden="true" />
        <h3 className="benefit-card__title">{category.label}</h3>

        {src && (
          <video
            ref={videoRef}
            src={src}
            className="benefit-card__video"
            loop
            playsInline
            preload="none"
            disablePictureInPicture
            onContextMenu={(e) => e.preventDefault()}
            aria-hidden="true"
          />
        )}

        {isActive && src && (
          <button
            type="button"
            className="benefit-card__mute-toggle"
            onClick={toggleMute}
            aria-label={isMuted ? `Unmute ${category.label} video` : `Mute ${category.label} video`}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
        )}

        {isActive && src && (
          <button
            type="button"
            className="benefit-card__expand"
            onClick={(event) => {
              event.stopPropagation();
              setIsFullscreen(true);
            }}
            aria-label={`View ${category.label} video full screen`}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M8 3H5a2 2 0 0 0-2 2v3" />
              <path d="M16 3h3a2 2 0 0 1 2 2v3" />
              <path d="M8 21H5a2 2 0 0 1-2-2v-3" />
              <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
            </svg>
          </button>
        )}
      </div>

      {isFullscreen && (
        <VideoModal asset={category.asset} label={category.label} onClose={() => setIsFullscreen(false)} />
      )}
    </Reveal>
  );
}
