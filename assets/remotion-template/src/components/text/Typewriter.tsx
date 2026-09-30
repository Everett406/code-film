import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';

export type TypeStep =
  | {type: 'type'; text: string; cps?: number}
  | {type: 'delete'; count: number; cps?: number}
  | {type: 'wait'; frames: number};

/** 按步骤算出某一帧屏幕上的文字：打字、删除、停顿。cps 是每秒字数。 */
export const typewriterText = (steps: TypeStep[], frame: number, fps: number): {text: string; typing: boolean} => {
  let text = '';
  let t = 0;
  for (const s of steps) {
    if (s.type === 'wait') {
      if (frame < t + s.frames) {
        return {text, typing: false};
      }
      t += s.frames;
      continue;
    }
    const perChar = fps / (s.cps ?? 14);
    if (s.type === 'type') {
      const chars = Array.from(s.text);
      const len = chars.length * perChar;
      if (frame < t + len) {
        return {text: text + chars.slice(0, Math.floor((frame - t) / perChar)).join(''), typing: true};
      }
      text += s.text;
      t += len;
    } else {
      const chars = Array.from(text);
      const len = s.count * perChar;
      if (frame < t + len) {
        return {text: chars.slice(0, chars.length - Math.floor((frame - t) / perChar)).join(''), typing: true};
      }
      text = chars.slice(0, Math.max(0, chars.length - s.count)).join('');
      t += len;
    }
  }
  return {text, typing: false};
};

/** 打字机。只给 text 就是单纯打字；给 steps 可以做打字、删除、改写。光标在打字时常亮，停下时每 16 帧闪一次。 */
export const Typewriter: React.FC<{
  text?: string;
  steps?: TypeStep[];
  start?: number;
  cps?: number;
  cursor?: boolean;
  cursorColor?: string;
  style?: React.CSSProperties;
}> = ({text = '', steps, start = 0, cps, cursor = true, cursorColor = 'currentColor', style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const program: TypeStep[] = steps ?? [{type: 'type', text, cps}];
  const local = frame - start;
  const {text: shown, typing} = local < 0 ? {text: '', typing: false} : typewriterText(program, local, fps);
  const on = typing || Math.floor(frame / 16) % 2 === 0;
  return (
    <span style={{whiteSpace: 'pre-wrap', ...style}}>
      {shown}
      {cursor ? (
        <span
          style={{
            display: 'inline-block',
            width: '0.5em',
            height: '1em',
            marginLeft: '0.08em',
            verticalAlign: '-0.12em',
            background: cursorColor,
            opacity: on ? 1 : 0,
          }}
        />
      ) : null}
    </span>
  );
};
