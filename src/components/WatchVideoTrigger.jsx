import { useState } from 'react';
import Button from './Button.jsx';
import VideoModal from './VideoModal.jsx';

/**
 * Opens the given video (with full audio + controls) in VideoModal.
 * Shared by the Hero's "Watch How It Works" and every background-video
 * section — otherwise a video kept with narration has no way to be heard.
 */
export default function WatchVideoTrigger({ asset, label = 'Watch Video', variant = 'secondary', className = '' }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button as="button" variant={variant} className={className} onClick={() => setOpen(true)}>
        {label}
      </Button>
      {open && <VideoModal asset={asset} onClose={() => setOpen(false)} />}
    </>
  );
}
