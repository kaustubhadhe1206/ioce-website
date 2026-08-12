import { IOCE_LOGO_DATA_URI } from '../assets/ioceLogoBase64.js';

export default function AnimatedLogo({ className = '' }) {
  return (
    <div className={`ioce-anim-logo ${className}`}>
      <div className="ioce-anim-logo__rays" />
      <div className="ioce-anim-logo__halo" />
      <div className="ioce-anim-logo__wrap">
        <img className="ioce-anim-logo__img" src={IOCE_LOGO_DATA_URI} alt="IOCE crest" />
        <div className="ioce-anim-logo__shimmer" />
      </div>
      <div className="ioce-anim-logo__sparkle" />
      <div className="ioce-anim-logo__sparkle" />
      <div className="ioce-anim-logo__sparkle" />
      <div className="ioce-anim-logo__sparkle" />
      <div className="ioce-anim-logo__sparkle" />
      <div className="ioce-anim-logo__flare" />
    </div>
  );
}
