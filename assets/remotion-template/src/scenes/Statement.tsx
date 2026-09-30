import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Decode} from '../components/text/Decode';
import {SplitText} from '../components/text/SplitText';
import {Typewriter} from '../components/text/Typewriter';
import {exitFade} from '../lib/motion';
import {useShot} from '../lib/shot';
import {theme} from '../theme';

type Props = {
  text: string;
  technique?: 'type' | 'rise' | 'blur' | 'decode';
  delay?: number;
  sub?: string;
  size?: number;
  mono?: boolean;
  color?: string;
  exit?: boolean;
};

/** 一句话 / 一个大字。technique 选择入场方式；exit 为 true 时在镜头末尾淡出，否则等着被硬切。 */
export const Statement: React.FC<Props> = ({
  text,
  technique = 'rise',
  delay = 6,
  sub,
  size,
  mono = false,
  color = theme.color.fg,
  exit = false,
}) => {
  const frame = useCurrentFrame();
  const {duration} = useShot();
  const fontSize = size ?? theme.size.title;
  const drift = 1 + 0.02 * (frame / duration);
  const main =
    technique === 'type' ? (
      <Typewriter text={text} start={delay} cursorColor={theme.color.accent} />
    ) : technique === 'decode' ? (
      <Decode text={text} start={delay} duration={24} />
    ) : (
      <SplitText text={text} start={delay} preset={technique} />
    );
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: exit ? exitFade(frame, duration) : 1}}>
      <div
        style={{
          transform: `scale(${drift})`,
          textAlign: 'center',
          color,
          fontFamily: mono ? theme.font.mono : theme.font.display,
          fontSize,
          letterSpacing: mono ? 0 : '0.08em',
        }}
      >
        {main}
        {sub ? (
          <div
            style={{
              marginTop: fontSize * 0.5,
              fontFamily: theme.font.body,
              fontSize: theme.size.caption,
              color: theme.color.muted,
              letterSpacing: '0.12em',
            }}
          >
            <SplitText text={sub} start={delay + 18} preset="blur" />
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
