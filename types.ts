export interface Position {
  x: number;
  y: number;
  z: number;
}

export interface CatProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  animationOffset: number;
}

export interface LightProps {
  position: [number, number, number];
  color: string;
  intensity: number;
}
