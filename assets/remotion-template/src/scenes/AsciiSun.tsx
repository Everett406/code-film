import React from 'react';
import {AbsoluteFill, interpolateColors, useCurrentFrame, useVideoConfig} from 'remotion';
import {noise2D, noise3D} from '@remotion/noise';
import {Ascii, type AsciiField} from '../components/Ascii';
import {SplitText} from '../components/text/SplitText';
import {smoothstep, springAt, springs, progress} from '../lib/motion';
import {theme} from '../theme';

/** 字符画太阳：先是散落的字符尘埃，第 formAt 帧开始汇聚成一个发光的太阳，颜色从冷变暖。 */
export const AsciiSun: React.FC<{caption?: string; formAt?: number}> = ({caption, formAt = 30}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = springAt(frame, fps, formAt, springs.smooth);
  const color = interpolateColors(frame, [0, formAt, formAt + 40], [theme.color.muted, theme.color.fg, theme.color.accent]);
  const bg = interpolateColors(frame, [formAt, formAt + 60], [theme.color.bg, theme.color.warmBg]);

  const field: AsciiField = (u, v, t) => {
    const r = Math.sqrt(u * u + v * v);
    const R = 0.05 + 0.5 * s;
    const core = smoothstep(R, R * 0.8, r);
    const out = Math.max(0, r - R);
    const glow = Math.exp(-out * 4) * 0.45 * s;
    const rays = Math.pow(Math.max(0, Math.cos(Math.atan2(v, u) * 12 + t * 0.8)), 6) * Math.exp(-out * 1.6) * 0.5 * s;
    const flicker = 0.08 * noise3D('sun', u * 3, v * 3, t * 0.8);
    const dust = noise2D('dust', u * 4 + t * 0.3, v * 4) > 0.55 ? 0.35 * (1 - s) : 0;
    return Math.max(core * s + flicker * s, glow + rays, dust);
  };

  return (
    <AbsoluteFill style={{backgroundColor: bg}}>
      <Ascii field={field} color={color} cols={150} />
      {caption ? (
        <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: '8%'}}>
          <div
            style={{
              fontFamily: theme.font.display,
              fontSize: theme.size.body,
              color: theme.color.fg,
              letterSpacing: '0.12em',
              padding: '10px 28px',
              background: 'rgba(0,0,0,0.55)',
              borderRadius: 6,
              opacity: progress(frame, formAt + 18, 8),
            }}
          >
            <SplitText text={caption} start={formAt + 24} stagger={2} preset="blur" />
          </div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
