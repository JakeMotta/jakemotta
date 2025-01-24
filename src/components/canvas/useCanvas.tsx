import { useRef, useEffect } from 'react';

export const useCanvas = (draw: unknown) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    let count = 0;
    // eslint-disable-next-line
    let animationId: any;

    const renderer = () => {
      count++;
      if (!context) return;

      // @ts-ignore
      draw(context, count);
      animationId = window.requestAnimationFrame(renderer);
    };
    renderer();
    return () => {
      window.cancelAnimationFrame(animationId);
    };
  }, [draw]);

  return ref;
};
