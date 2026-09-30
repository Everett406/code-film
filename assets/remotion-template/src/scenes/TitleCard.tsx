import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {SplitText} from '../components/text/SplitText';
import {exitFade, progress} from '../lib/motion';
import {useShot} from '../lib/shot';
import {theme} from '../theme';

/** 片名 / 落版：标题遮罩升起，强调色细线生长，副标题模糊入场，结尾淡出到黑。 */
export const TitleCard: React.FC<{title: string; subtitle?: string}> = ({title, subtitle}) => {
  const frame = useCurrentFrame();
  const {duration} = useShot();
  const line = progress(frame, 8, 20);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: exitFade(frame, duration, 12)}}>
      <div style={{transform: `scale(${1 + 0.02 * (frame / duration)})`, textAlign: 'center'}}>
        <div style={{fontFamily: theme.font.display, fontSize: theme.size.title * 1.2, color: theme.color.fg, letterSpacing: '0.04em'}}>
          <SplitText text={title} start={0} stagger={2} />
        </div>
        <div style={{height: 3, width: 240 * line, background: theme.color.accent, margin: '28px auto'}} />
        {subtitle ? (
          <div style={{fontFamily: theme.font.body, fontSize: theme.size.caption * 1.1, color: theme.color.muted, letterSpacing: '0.12em'}}>
            <SplitText text={subtitle} start={14} stagger={1} preset="blur" />
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
