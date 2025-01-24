import React from 'react';
import { useCanvas } from './useCanvas';

// eslint-disable-next-line
const Canvas = (props: { [x: string]: any; draw: any }) => {
  const { draw, ...rest } = props;
  const ref = useCanvas(draw);

  return <canvas ref={ref} {...rest} />;
};

export default Canvas;
