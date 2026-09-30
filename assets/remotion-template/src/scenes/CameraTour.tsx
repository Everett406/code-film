import React from 'react';
import {AbsoluteFill} from 'remotion';
import {CameraMotionBlur} from '@remotion/motion-blur';
import {Camera, type CamKey} from '../components/Camera';
import {theme} from '../theme';

const WORLD = {w: 3840, h: 2160};

const CARDS = [
  {x: 900, y: 700, char: '推', label: 'PUSH · 聚焦'},
  {x: 2900, y: 700, char: '移', label: 'PAN · 下一个'},
  {x: 1900, y: 1600, char: '拉', label: 'PULL · 回到全局'},
];

// 三段运镜的中点分别在第 27、67、100 帧，storyboard 里的 whoosh 就对准这三帧
const KEYS: CamKey[] = [
  {frame: 0, x: 1920, y: 1080, zoom: 0.5},
  {frame: 15, x: 1920, y: 1080, zoom: 0.5},
  {frame: 40, x: 900, y: 700, zoom: 1.6},
  {frame: 55, x: 900, y: 700, zoom: 1.6},
  {frame: 80, x: 2900, y: 700, zoom: 1.6},
  {frame: 90, x: 2900, y: 700, zoom: 1.6},
  {frame: 110, x: 1920, y: 1080, zoom: 0.5},
];

const World: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      width: WORLD.w,
      height: WORLD.h,
      backgroundImage:
        'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
      backgroundSize: '120px 120px',
    }}
  >
    {CARDS.map((c) => (
      <div
        key={c.char}
        style={{
          position: 'absolute',
          left: c.x - 260,
          top: c.y - 180,
          width: 520,
          height: 360,
          borderRadius: 20,
          border: `2px solid ${theme.color.muted}`,
          background: 'rgba(255,255,255,0.03)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: theme.color.fg,
        }}
      >
        <div style={{fontFamily: theme.font.display, fontSize: 180, lineHeight: 1}}>{c.char}</div>
        <div style={{fontFamily: theme.font.mono, fontSize: 26, color: theme.color.accent, marginTop: 18, letterSpacing: '0.1em'}}>
          {c.label}
        </div>
      </div>
    ))}
  </div>
);

/** 虚拟摄像机示例：全景 → 推到「推」→ 移到「移」→ 拉回全景。motionBlur 为 true 时加子帧运动模糊（渲染慢 6 倍）。 */
export const CameraTour: React.FC<{motionBlur?: boolean}> = ({motionBlur = false}) => {
  const cam = (
    <Camera keys={KEYS} drift={2}>
      <World />
    </Camera>
  );
  return (
    <AbsoluteFill style={{backgroundColor: theme.color.bg}}>
      {motionBlur ? (
        <CameraMotionBlur shutterAngle={180} samples={6}>
          {cam}
        </CameraMotionBlur>
      ) : (
        cam
      )}
    </AbsoluteFill>
  );
};
