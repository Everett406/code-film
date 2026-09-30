import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {theme} from '../theme';

/** 胶片颗粒和暗角。颗粒每 2 帧换一次种子，播放时若隐若现。 */
export const Texture: React.FC<{grain?: number; vignette?: number}> = ({
  grain = theme.texture.grain,
  vignette = theme.texture.vignette,
}) => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 2) % 97;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {vignette > 0 ? (
        <AbsoluteFill
          style={{background: `radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,${vignette}) 100%)`}}
        />
      ) : null}
      {grain > 0 ? (
        <svg width="100%" height="100%" style={{position: 'absolute', inset: 0, opacity: grain, mixBlendMode: 'overlay'}}>
          <filter id="cf-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={seed} stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#cf-grain)" />
        </svg>
      ) : null}
    </AbsoluteFill>
  );
};
