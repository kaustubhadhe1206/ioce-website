import { useEffect, useRef } from 'react';
import { getVideoUrl } from '../lib/supabaseClient.js';

export default function VideoModal({ asset, onClose }) {
  const closeButtonRef = useRef(null);
  const src = getVideoUrl(asset);

  useEffect(() => {
    closeButtonRef.current?.focus();
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="video-modal" role="dialog" aria-modal="true" aria-label="How It Works video">
      <div className="video-modal__backdrop" onClick={onClose} />
      <div className="video-modal__panel">
        <button
          ref={closeButtonRef}
          type="button"
          className="video-modal__close"
          onClick={onClose}
          aria-label="Close video"
        >
          ✕
        </button>
        {src ? (
          <video src={src} controls autoPlay playsInline className="video-modal__video" />
        ) : (
          <p className="video-modal__fallback">Video is not available yet.</p>
        )}
      </div>
    </div>
  );
}
