import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {noise2D} from '@remotion/noise';
import {ease, logZoom, mix} from '../lib/motion';

/** x、y 是镜头对准的世界坐标（像素），zoom 是缩放倍数，easing 作用于从上一个关键帧到这一帧的过程。 */
export type CamKey = {frame: number; x: number; y: number; zoom: number; rotate?: number; easing?: (t: number) => number};
export type CamState = {x: number; y: number; zoom: number; rotate: number};
export type Shake = {frame: number; amount: number; decay?: number};

export const cameraAt = (frame: number, keys: CamKey[]): CamState => {
  if (keys.length === 0) {
    throw new Error('Camera 至少需要一个关键帧');
  }
  const first = keys[0];
  const last = keys[keys.length - 1];
  if (frame <= first.frame) {
    return {x: first.x, y: first.y, zoom: first.zoom, rotate: first.rotate ?? 0};
  }
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (frame <= b.frame) {
      const raw = (frame - a.frame) / Math.max(1, b.frame - a.frame);
      const t = (b.easing ?? ease.inOut)(raw);
      return {
        x: mix(a.x, b.x, t),
        y: mix(a.y, b.y, t),
        zoom: logZoom(t, a.zoom, b.zoom),
        rotate: mix(a.rotate ?? 0, b.rotate ?? 0, t),
      };
    }
  }
  return {x: last.x, y: last.y, zoom: last.zoom, rotate: last.rotate ?? 0};
};

/**
 * 虚拟摄像机：children 用绝对定位摆在世界坐标里，镜头按关键帧平移、缩放、旋转。
 * drift 是手持漂移的幅度（像素），shake 是撞击震屏列表。
 */
export const Camera: React.FC<{keys: CamKey[]; children: React.ReactNode; drift?: number; shake?: Shake[]}> = ({
  keys,
  children,
  drift = 0,
  shake = [],
}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const c = cameraAt(frame, keys);
  let dx = drift * noise2D('cam-x', frame * 0.02, 0);
  let dy = drift * noise2D('cam-y', frame * 0.02, 0);
  for (const s of shake) {
    const age = frame - s.frame;
    if (age >= 0 && age < 30) {
      const k = s.amount * Math.exp(-age / (s.decay ?? 4));
      dx += k * noise2D('shake-x', age * 0.9, s.frame);
      dy += k * noise2D('shake-y', age * 0.9, s.frame);
    }
  }
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          transformOrigin: '0 0',
          transform: `translate(${width / 2 + dx}px, ${height / 2 + dy}px) rotate(${c.rotate}deg) scale(${c.zoom}) translate(${-c.x}px, ${-c.y}px)`,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};
