import React from 'react';
import {Audio, Sequence, staticFile, useVideoConfig} from 'remotion';
import manifest from '../../public/sfx/manifest.json';
import type {SfxAlign, Shot} from '../storyboard';

type Entry = {file: string; duration: number; peak: number; align?: SfxAlign};
const library = manifest as Record<string, Entry>;

/** 把每个镜头的 events 放到时间轴上：音效的 start / peak / end 点对准事件帧。 */
export const SfxTrack: React.FC<{shots: Shot[]}> = ({shots}) => {
  const {fps} = useVideoConfig();
  return (
    <>
      {shots.flatMap((shot) =>
        (shot.events ?? []).map((ev, i) => {
          const entry = library[ev.sfx];
          if (!entry) {
            throw new Error(`音效 "${ev.sfx}"（镜头 ${shot.id}）不在 public/sfx/manifest.json 里`);
          }
          const rate = ev.rate ?? 1;
          const align = ev.align ?? entry.align ?? 'peak';
          const anchorSec = align === 'peak' ? entry.peak : align === 'end' ? entry.duration : 0;
          const from = Math.max(0, shot.from + ev.at - Math.round((anchorSec / rate) * fps));
          return (
            <Sequence
              key={`${shot.id}-sfx-${i}`}
              from={from}
              durationInFrames={Math.ceil((entry.duration / rate) * fps) + 1}
              layout="none"
              name={`sfx ${ev.sfx}`}
            >
              <Audio src={staticFile(entry.file)} volume={ev.volume ?? 0.8} playbackRate={rate} />
            </Sequence>
          );
        }),
      )}
    </>
  );
};
