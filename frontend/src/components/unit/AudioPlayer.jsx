'use client';

import { useEffect, useRef, useState } from 'react';
import Plyr from 'plyr-react';
import 'plyr-react/plyr.css';

export default function AudioPlayer({ audioUrl, onTimeUpdate, onEnded, savedPosition = 0 }) {
  const plyrRef = useRef(null);
  const [hasSetInitialPosition, setHasSetInitialPosition] = useState(false);

  useEffect(() => {
    if (plyrRef.current && plyrRef.current.plyr && !hasSetInitialPosition && savedPosition > 0) {
      plyrRef.current.plyr.currentTime = savedPosition;
      setHasSetInitialPosition(true);
    }
  }, [savedPosition, hasSetInitialPosition]);

  const plyrOptions = {
    controls: [
      'play-large',
      'play',
      'progress',
      'current-time',
      'duration',
      'mute',
      'volume',
      'settings',
      'download',
    ],
    settings: ['speed'],
    speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5] },
    i18n: {
      speed: 'Tốc độ',
      normal: 'Bình thường',
    },
  };

  return (
    <div className="w-full">
      <Plyr
        ref={plyrRef}
        source={{
          type: 'audio',
          sources: [
            {
              src: audioUrl,
              type: 'audio/mp3',
            },
          ],
        }}
        options={plyrOptions}
        onTimeUpdate={(event) => {
          if (onTimeUpdate && plyrRef.current?.plyr) {
            const time = plyrRef.current.plyr.currentTime;
            onTimeUpdate(time);
          }
        }}
        onEnded={() => {
          if (onEnded) {
            onEnded();
          }
        }}
      />
    </div>
  );
}

