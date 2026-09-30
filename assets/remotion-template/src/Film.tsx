import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {SfxTrack} from './components/SfxTrack';
import {Texture} from './components/Texture';
import {useFonts} from './lib/fonts';
import {ShotProvider} from './lib/shot';
import {scenes} from './scenes';
import {storyboard} from './storyboard';
import {theme} from './theme';

export const Film: React.FC = () => {
  useFonts();
  const {meta, shots} = storyboard;
  return (
    <AbsoluteFill style={{backgroundColor: theme.color.bg}}>
      {shots.map((shot) => {
        const Scene = scenes[shot.scene];
        if (!Scene) {
          throw new Error(`storyboard 里的 scene "${shot.scene}"（镜头 ${shot.id}）没有在 src/scenes/index.ts 注册`);
        }
        return (
          <Sequence key={shot.id} from={shot.from} durationInFrames={shot.duration} name={`${shot.id} ${shot.scene}`}>
            <ShotProvider shot={shot}>
              <Scene {...(shot.props ?? {})} />
            </ShotProvider>
          </Sequence>
        );
      })}
      <Texture />
      {meta.music ? (
        <Sequence from={meta.musicStartFrame ?? 0} name="music">
          <Audio src={staticFile(meta.music)} volume={meta.musicVolume ?? 0.8} />
        </Sequence>
      ) : null}
      <SfxTrack shots={shots} />
    </AbsoluteFill>
  );
};
