import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from '../theme';

/** 亮度场：u 横向（按画面宽高比缩放，中心为 0），v 纵向（-1 顶部到 1 底部），t 为秒。返回 0 到 1。 */
export type AsciiField = (u: number, v: number, t: number, frame: number) => number;

export const RAMP = ' .:-=+*#%@';
export const RAMP_FINE = " .'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";

/**
 * 字符画。cols 为列数；charAspect 是等宽字体的字宽 / 字号（大多数等宽字体约 0.55 到 0.6），
 * 换字体后要按实际字体调整，否则画面会被拉伸。
 */
export const Ascii: React.FC<{
  field: AsciiField;
  cols?: number;
  ramp?: string;
  color?: string;
  charAspect?: number;
  style?: React.CSSProperties;
}> = ({field, cols = 160, ramp = RAMP, color = theme.color.fg, charAspect = 0.6, style}) => {
  const frame = useCurrentFrame();
  const {width, height, fps} = useVideoConfig();
  const cellW = width / cols;
  const fontSize = cellW / charAspect;
  const rows = Math.floor(height / fontSize);
  const t = frame / fps;
  const aspect = width / height;
  const lines: string[] = [];
  for (let r = 0; r < rows; r++) {
    const v = ((r + 0.5) / rows) * 2 - 1;
    let line = '';
    for (let c = 0; c < cols; c++) {
      const u = (((c + 0.5) / cols) * 2 - 1) * aspect;
      const b = Math.min(1, Math.max(0, field(u, v, t, frame)));
      line += ramp[Math.round(b * (ramp.length - 1))];
    }
    lines.push(line);
  }
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <pre
        style={{
          margin: 0,
          fontFamily: theme.font.mono,
          fontSize,
          lineHeight: `${fontSize}px`,
          letterSpacing: 0,
          color,
          whiteSpace: 'pre',
          ...style,
        }}
      >
        {lines.join('\n')}
      </pre>
    </AbsoluteFill>
  );
};
