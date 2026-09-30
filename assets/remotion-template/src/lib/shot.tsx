import React, {createContext, useContext} from 'react';
import type {Shot} from '../storyboard';

const ShotContext = createContext<Shot | null>(null);

export const ShotProvider: React.FC<{shot: Shot; children: React.ReactNode}> = ({shot, children}) => (
  <ShotContext.Provider value={shot}>{children}</ShotContext.Provider>
);

/** 在场景组件里拿到当前镜头（duration、id 等），用来安排退场。 */
export const useShot = (): Shot => {
  const shot = useContext(ShotContext);
  if (!shot) {
    throw new Error('useShot() 只能在由 storyboard 驱动的场景组件里使用');
  }
  return shot;
};
