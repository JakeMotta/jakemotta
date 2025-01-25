import React, { useEffect, useState } from 'react';
import Canvas from '../canvas';

// Import your SVGs directly - you'll need to add these imports
import image1 from './a.svg';
import image2 from './b.svg';

export const Background = () => {
  const [images, setImages] = useState<HTMLImageElement[]>([]);
      
  useEffect(() => {

    // Initialize ParticleSystem when component mounts
    const particleSystem = new ParticleSystem();

    // Cleanup on unmount
    return () => {
      // Add any cleanup if needed
      window.removeEventListener('resize', particleSystem['resize']);
    };
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

  interface ParticleProps {
    canvas: HTMLCanvasElement;
    image: HTMLImageElement;
    startX: number;
    startY: number;
  }

  class Particle {
    private canvas: HTMLCanvasElement;
    private x: number;
    private y: number;
    private size: number;
    private speedX: number;
    private speedY: number;
    private image: HTMLImageElement;
    private hue: number;
    private hueSpeed: number;

    constructor({ canvas, image, startX, startY }: ParticleProps) {
      this.canvas = canvas;
      this.x = startX;
      this.y = startY;
      this.size = 50;
      this.speedX = 1;
      this.speedY = -1;
      this.image = image;
      this.hue = Math.random() * 360;
      this.hueSpeed = Math.random() * 1 + 0.5;
    }
  
    update(): void {
      // Update position
      this.x += this.speedX;
      this.y += this.speedY;
  
      // Update color
      // this.hue = (this.hue + this.hueSpeed) % 360;
  
      // Wrap around screen when particle reaches the edges
      if (this.x > this.canvas.width) {
        this.x = 0; // Reset to left edge
      } else if (this.x < 0) {
        this.x = this.canvas.width; // Reset to right edge
      }
  
      if (this.y < 0) {
        this.y = this.canvas.height; // Reset to bottom
      } else if (this.y > this.canvas.height) {
        this.y = 0; // Reset to top
      }
    }
  
    draw(ctx: CanvasRenderingContext2D): void {
      ctx.globalAlpha = 0.8;
      ctx.save();
      ctx.filter = `hue-rotate(${this.hue}deg)`;
  
      // Draw the main particle
      this.drawAtPosition(ctx, this.x, this.y);
  
      // Draw duplicate particles near edges for smooth wrapping
      const margin = this.size;
  
      // Wrap horizontally
      if (this.x < margin) {
        this.drawAtPosition(ctx, this.x + this.canvas.width, this.y);
      } else if (this.x > this.canvas.width - margin) {
        this.drawAtPosition(ctx, this.x - this.canvas.width, this.y);
      }
  
      // Wrap vertically
      if (this.y < margin) {
        this.drawAtPosition(ctx, this.x, this.y + this.canvas.height);
      } else if (this.y > this.canvas.height - margin) {
        this.drawAtPosition(ctx, this.x, this.y - this.canvas.height);
      }
  
      ctx.restore();
      ctx.globalAlpha = 1;
    }
  
    private drawAtPosition(ctx: CanvasRenderingContext2D, x: number, y: number): void {
      ctx.drawImage(this.image, x - this.size / 2, y - this.size / 2, this.size, this.size);
    }
  }

  class ParticleSystem {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private particles: Particle[];
    private particleImages: HTMLImageElement[];
    private numberOfCols: number;
    private numberOfRows: number;
    private numberOfParticles: number;

    constructor() {
      const canvas = document.getElementById('particleCanvas') as HTMLCanvasElement;
      if (!canvas) throw new Error('Canvas element not found');
      
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get 2D context');

      this.canvas = canvas;
      this.ctx = ctx;
      this.particles = [];
      this.particleImages = [];
      this.numberOfCols = 0;
      this.numberOfRows = 0;
      this.numberOfParticles = 0;

      this.calculateGridSize();

      this.loadParticleImages().then(() => {
        this.init();
        this.animate();
      });

      window.addEventListener('resize', () => {
        this.calculateGridSize();
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.initParticles();
      });
    }
  
    private calculateGridSize(): void {
      const aspectRatio = window.innerWidth / window.innerHeight;
      // Reduce base particles for mobile screens
      const baseParticles = window.innerWidth < 768 ? 40 : 120;
      this.numberOfCols = Math.round(Math.sqrt(baseParticles * aspectRatio));
      this.numberOfRows = Math.round(baseParticles / this.numberOfCols);
      this.numberOfParticles = this.numberOfRows * this.numberOfCols;
    }
  
    private async loadParticleImages(): Promise<void> {
      try {
        const imageFiles = [image1, image2]; // Use imported SVG paths
        const loadedImages = await Promise.all(
          imageFiles.map((imagePath) => {
            return new Promise<HTMLImageElement>((resolve, reject) => {
              const img = new Image();
              img.src = imagePath;
              img.onload = () => resolve(img);
              img.onerror = (e) => reject(new Error(`Failed to load image: ${e}`));
            });
          })
        );
        this.particleImages = loadedImages;
      } catch (error) {
        console.error('Error loading images:', error);
      }
    }
  
    private init(): void {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.initParticles();
    }
  
    private initParticles(): void {
      const spacingX = this.canvas.width / this.numberOfCols;
      const spacingY = this.canvas.height / this.numberOfRows;
  
      const existingParticles = [...this.particles];
      this.particles = [];
  
      for (let row = 0; row < this.numberOfRows; row++) {
        for (let col = 0; col < this.numberOfCols; col++) {
          const startX = (col + 0.5) * spacingX;
          const startY = (row + 0.5) * spacingY;
  
          const index = row * this.numberOfCols + col;
          const image = existingParticles[index]?.image || 
            this.particleImages[Math.floor(Math.random() * this.particleImages.length)];
  
          const particle = new Particle({
            canvas: this.canvas,
            image,
            startX,
            startY
          });
          this.particles.push(particle);
        }
      }
    }
  
    private animate(): void {
      // this.hue = (this.hue + 0.5) % 360;
      // this.backgroundColor = `hsl(${this.hue}, 70%, 90%)`;
      // this.canvas.style.backgroundColor = this.backgroundColor;
  
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  
      this.particles.forEach((particle) => {
        particle.update();
        particle.draw(this.ctx);
      });
  
      requestAnimationFrame(() => this.animate());
    }
  }

  return (
    <canvas
      id="particleCanvas"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1
      }}
    />
  );
};
