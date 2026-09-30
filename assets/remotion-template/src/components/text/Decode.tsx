import React from 'react';
import {random, useCurrentFrame} from 'remotion';

const LATIN = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*+=<>/\\|';
const CJK = '的一是不了人我在有他这为之大来以个中上们到说国和地也子时道出而要于就下得可你年生自会那后能对着事其里所去行过家十用发天如然作方成者多日都三小军二无同么经法当起与好看学进种将还分此心前面又定见只主没公从';
const IS_CJK = /[\u3400-\u9fff]/;

/**
 * 乱码解码：每个字在揭晓前显示随机字符（每 changeEvery 帧换一次），从左到右依次揭晓。
 * 中文字位用随机汉字占位，西文字位用随机字母符号，这样揭晓前后宽度基本不变。
 */
export const Decode: React.FC<{
  text: string;
  start?: number;
  duration?: number;
  changeEvery?: number;
  seed?: string;
  style?: React.CSSProperties;
}> = ({text, start = 0, duration = 30, changeEvery = 2, seed = 'decode', style}) => {
  const frame = useCurrentFrame();
  const local = frame - start;
  const chars = Array.from(text);
  const bucket = Math.floor(frame / changeEvery);
  const shown =
    local < 0
      ? ''
      : chars
          .map((ch, i) => {
            if (/\s/.test(ch)) {
              return ch;
            }
            const revealAt = duration * 0.2 + (i / Math.max(1, chars.length)) * duration * 0.8;
            if (local >= revealAt) {
              return ch;
            }
            const pool = IS_CJK.test(ch) ? CJK : LATIN;
            return pool[Math.floor(random(`${seed}-${i}-${bucket}`) * pool.length)];
          })
          .join('');
  return <span style={{whiteSpace: 'pre', ...style}}>{shown}</span>;
};
