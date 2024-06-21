import React from 'react';
import { CiLocationArrow1 } from 'react-icons/ci';

export enum ViewCubeSide {
  NORTHEAST = 'NE',
  NORTHWEST = 'NW',
  SOUTHEAST = 'SE',
  SOUTHWEST = 'SW',
}

export enum ViewCubePosition {
  LeftBottomCorner = 'LeftCorner',
  AllCorners = 'AllCorners',
}

export interface CameraParameters {
  alfa: number;
  beta: number;
  radius: number;
  target: { x: number; y: number; z: number };
}

interface IViewCubeProps {
  viewCubePosition?: ViewCubePosition;
  size?: number;
  onSideChange: (cameraParameters: CameraParameters | undefined) => void;
}

export const ViewCube: React.FC<IViewCubeProps> = ({ onSideChange, viewCubePosition = ViewCubePosition.AllCorners, size = 15 }) => {
  const setSide = (side: ViewCubeSide) => {
    const target = { x: 0, y: 8, z: 0 };
    const radius = 80;
    const beta = 1.2;

    switch (side) {
      case ViewCubeSide.NORTHEAST:
        onSideChange({ alfa: 0.25 * Math.PI, beta, radius, target });
        break;
      case ViewCubeSide.NORTHWEST:
        onSideChange({ alfa: 0.75 * Math.PI, beta, radius, target });
        break;
      case ViewCubeSide.SOUTHEAST:
        onSideChange({ alfa: 1.75 * Math.PI, beta, radius, target });
        break;
      case ViewCubeSide.SOUTHWEST:
        onSideChange({ alfa: 1.25 * Math.PI, beta, radius, target });
        break;
    }
  };

  const position: React.CSSProperties =
    viewCubePosition === ViewCubePosition.LeftBottomCorner
      ? { position: 'absolute', left: size * (0.5 + 2.3), bottom: size * (0.5 + 2), width: 0, height: 0 }
      : {};

  return (
    <div style={position}>
      <Arrow size={size} setSide={setSide} side={ViewCubeSide.NORTHEAST} viewCubePosition={viewCubePosition} />
      <Arrow size={size} setSide={setSide} side={ViewCubeSide.NORTHWEST} viewCubePosition={viewCubePosition} />
      <Arrow size={size} setSide={setSide} side={ViewCubeSide.SOUTHEAST} viewCubePosition={viewCubePosition} />
      <Arrow size={size} setSide={setSide} side={ViewCubeSide.SOUTHWEST} viewCubePosition={viewCubePosition} />
    </div>
  );
};

interface IArrowProps {
  size: number;
  setSide: (side: ViewCubeSide) => void;
  side: ViewCubeSide;
  viewCubePosition: ViewCubePosition;
}

const getAngleForSide = (side: ViewCubeSide) => {
  switch (side) {
    case ViewCubeSide.NORTHEAST:
      return 0.5;
    case ViewCubeSide.SOUTHEAST:
      return 0.75;
    case ViewCubeSide.SOUTHWEST:
      return 1;
    case ViewCubeSide.NORTHWEST:
      return 1.25;
  }
};

const getStyleAlignmentForSide = (side: ViewCubeSide, size: number, viewCubePosition: ViewCubePosition) => {
  const arrowInset = viewCubePosition ? size * 0.25 : 0;
  const textInset = 0;

  switch (side) {
    case ViewCubeSide.NORTHEAST:
      return {
        arrowPosition: { left: arrowInset, bottom: arrowInset },
        arrowTransform: { transform: `rotate(${getAngleForSide(side)}turn)` },
        text: { right: textInset, top: textInset },
      };
    case ViewCubeSide.NORTHWEST:
      return {
        arrowPosition: { right: arrowInset, bottom: arrowInset },
        arrowTransform: { transform: `rotate(${getAngleForSide(side)}turn)` },
        text: { left: textInset, top: textInset },
      };
    case ViewCubeSide.SOUTHWEST:
      return {
        arrowPosition: { right: arrowInset, top: arrowInset },
        arrowTransform: { transform: `rotate(${getAngleForSide(side)}turn)` },
        text: { left: textInset, bottom: textInset },
      };
    case ViewCubeSide.SOUTHEAST:
      return {
        arrowPosition: { left: arrowInset, top: arrowInset },
        arrowTransform: { transform: `rotate(${getAngleForSide(side)}turn)` },
        text: { right: textInset, bottom: textInset },
      };
  }
};

export const Arrow: React.FC<IArrowProps> = ({ setSide, side, size, viewCubePosition }) => {
  const color = 'blue';
  const { arrowPosition, arrowTransform, text } = getStyleAlignmentForSide(side, size, viewCubePosition);

  const height = size * (1.8 + (viewCubePosition === ViewCubePosition.AllCorners ? 0.25 : 0));
  const width = size * (2.1 + (viewCubePosition === ViewCubePosition.AllCorners ? 0.25 : 0));

  return (
    <div style={{ position: 'absolute', ...arrowPosition, cursor: 'pointer', height, width }} onClick={() => setSide(side)}>
      <CiLocationArrow1 size={size * 1.2} fill={color} style={{ position: 'absolute', ...arrowTransform, ...arrowPosition }} />
      <span style={{ position: 'absolute', textAnchor: 'middle', verticalAlign: 'middle', color, ...text, fontSize: size * 0.9 }}>{side}</span>
    </div>
  );
};
