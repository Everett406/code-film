import React from 'react';
import {useCurrentFrame} from 'remotion';
import {progress} from '../../lib/motion';
import {theme} from '../../theme';

export type SplitPreset = 'rise' | 'blur' | 'fade' | 'scale';

/**
 * 逐字或逐词错峰入场。
 * rise：遮罩升起（高级感最强）；blur：模糊入场；fade：淡入；scale：0.9 到 1 缩放加淡入。
 */
export const SplitText: React.FC<{
  text: string;
  start?: number;
  stagger?: number;
  duration?: number;
  preset?: SplitPreset;
  by?: 'char' | 'word';
  style?: React.CSSProperties;
}> = ({text, start = 0, stagger = theme.motion.stagger, duration = theme.motion.enter, preset = 'rise', by = 'char', style}) => {
  const frame = useCurrentFrame();
  const parts = by === 'word' ? text.split(/(\s+)/) : Array.from(text);
  return (
    <span style={{display: 'inline-block', whiteSpace: 'pre', ...style}}>
      {parts.map((p, i) => {
        const t = progress(frame, start + i * stagger, duration);
        if (preset === 'rise') {
          return (
            <span key={i} style={{display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', paddingBottom: '0.08em'}}>
              <span style={{display: 'inline-block', transform: `translateY(${(1 - t) * 110}%)`}}>{p}</span>
            </span>
          );
        }
        if (preset === 'blur') {
          return (
            <span
              key={i}
              style={{display: 'inline-block', opacity: t, filter: `blur(${(1 - t) * 12}px)`, transform: `translateY(${(1 - t) * 10}px)`}}
            >
              {p}
            </span>
          );
        }
        if (preset === 'scale') {
          return (
            <span key={i} style={{display: 'inline-block', opacity: t, transform: `scale(${0.9 + 0.1 * t})`}}>
              {p}
            </span>
          );
        }
        return (
          <span key={i} style={{display: 'inline-block', opacity: t}}>
            {p}
          </span>
        );
      })}
    </span>
  );
};
