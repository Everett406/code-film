import React from 'react';
import {Composition} from 'remotion';
import {Film} from './Film';
import {storyboard} from './storyboard';

export const RemotionRoot: React.FC = () => {
  const {meta} = storyboard;
  return (
    <Composition
      id="Film"
      component={Film}
      durationInFrames={meta.durationInFrames}
      fps={meta.fps}
      width={meta.width}
      height={meta.height}
    />
  );
};
