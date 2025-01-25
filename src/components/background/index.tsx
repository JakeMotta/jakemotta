import React, { useEffect, useState } from 'react';
import Canvas from '../canvas';

// Import your SVGs directly - you'll need to add these imports
import image1 from './a.svg';
import image2 from './b.svg';

export const Background = () => {
  const [images, setImages] = useState<HTMLImageElement[]>([]);

  useEffect(() => {
    // Load SVG images using imported paths
    const loadImages = async () => {
      try {
        const imageFiles = [image1, image2]; // Use imported SVG paths
        const loadedImages = await Promise.all(
          imageFiles.map((imagePath) => {
            return new Promise<HTMLImageElement>((resolve) => {
              const img = new Image();
              img.src = imagePath;
              img.onload = () => resolve(img);
            });
          })
        );
        setImages(loadedImages);
      } catch (error) {
        console.error('Error loading images:', error);
      }
    };

    loadImages();
  }, []);

  const draw = (context: CanvasRenderingContext2D, count: number) => {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    
    // Calculate position based on count
    const x = count % (context.canvas.width + 200) - 200; // Loop position
    
    // Draw each image
    images.forEach((img, index) => {
      const yOffset = 100 * index; // Stack images vertically
      context.drawImage(img, x, 50 + yOffset, 100, 100);
    });
  };

  return <Canvas draw={draw} width="800" height="800" style={{ border: '1px solid black' }} />;
};
