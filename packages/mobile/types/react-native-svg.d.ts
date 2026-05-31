declare module 'react-native-svg' {
  import React from 'react';
  export interface SvgProps {
    width?: number | string;
    height?: number | string;
    viewBox?: string;
    fill?: string;
    stroke?: string;
    strokeWidth?: number | string;
    [key: string]: any;
  }
  export interface PathProps extends SvgProps { d?: string; }
  export interface EllipseProps extends SvgProps {
    cx?: number | string;
    cy?: number | string;
    rx?: number | string;
    ry?: number | string;
  }
  const Svg: React.FC<SvgProps>;
  export const Path: React.FC<PathProps>;
  export const Ellipse: React.FC<EllipseProps>;
  export const Circle: React.FC<SvgProps & { cx?: number | string; cy?: number | string; r?: number | string }>;
  export const Rect: React.FC<SvgProps & { x?: number | string; y?: number | string; width?: number | string; height?: number | string }>;
  export const G: React.FC<SvgProps>;
  export default Svg;
}
