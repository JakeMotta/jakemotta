import React, { useEffect } from 'react';

declare const require: {
  context: (
    directory: string,
    useSubdirectories: boolean,
    regExp: RegExp,
  ) => {
    keys(): string[];
    (id: string): string;
  };
};

// Replace the static imports with dynamic imports
const svgContext = require.context('./svgs/', false, /\.svg$/);
const svgFiles = svgContext.keys().map(svgContext);

// Configuration constants
const MOBILE_PARTICLE_COUNT = 40;
const DESKTOP_PARTICLE_COUNT = 80;
const MIN_OPACITY = 0.25;
const MAX_OPACITY = 1;
const MOUSE_RADIUS = 100;
const PARTICLE_SIZE = 55;
const SPEED = 2;
const PARTICLE_SPEED_X = SPEED;
const PARTICLE_SPEED_Y = -SPEED;

export const Background = () => {
  useEffect(() => {
    // Initialize ParticleSystem when component mounts
    const particleSystem = new ParticleSystem();

    // Cleanup on unmount
    return () => {
      // @ts-ignore
      window.removeEventListener('resize', particleSystem['resize']);
    };
  }, []);

  interface ParticleProps {
    canvas: HTMLCanvasElement;
    image: HTMLImageElement;
    startX: number;
    startY: number;
    color: string;
  }

  class Particle {
    private canvas: HTMLCanvasElement;
    private x: number;
    private y: number;
    private size: number;
    private speedX: number;
    private speedY: number;
    private image: HTMLImageElement;
    private color: string;

    constructor({ canvas, image, startX, startY, color }: ParticleProps) {
      this.canvas = canvas;
      this.x = startX;
      this.y = startY;
      this.size = PARTICLE_SIZE;
      this.speedX = PARTICLE_SPEED_X;
      this.speedY = PARTICLE_SPEED_Y;
      this.image = image;
      this.color = color;
    }

    update(): void {
      // Update position
      this.x += this.speedX;
      this.y += this.speedY;

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

    draw(ctx: CanvasRenderingContext2D, mouseX: number, mouseY: number): void {
      // Calculate distance from mouse
      const dx = this.x - mouseX;
      const dy = this.y - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const mouseRadius = MOUSE_RADIUS;

      // Calculate opacity with minimum of 0.25
      let opacity = MAX_OPACITY;
      if (distance < mouseRadius) {
        opacity = Math.max(MIN_OPACITY, distance / mouseRadius);
      }

      ctx.globalAlpha = opacity;
      ctx.save();

      if (this.color) {
        ctx.filter = 'grayscale(100%)';
        ctx.globalCompositeOperation = 'source-over';
      }

      // Draw all particles (main and wrapped) first
      this.drawAtPosition(ctx, this.x, this.y);

      // Draw wrapped particles
      const margin = this.size;
      if (this.x < margin) {
        this.drawAtPosition(ctx, this.x + this.canvas.width, this.y);
      } else if (this.x > this.canvas.width - margin) {
        this.drawAtPosition(ctx, this.x - this.canvas.width, this.y);
      }

      if (this.y < margin) {
        this.drawAtPosition(ctx, this.x, this.y + this.canvas.height);
      } else if (this.y > this.canvas.height - margin) {
        this.drawAtPosition(ctx, this.x, this.y - this.canvas.height);
      }

      ctx.restore();
      ctx.globalAlpha = 1;

      // Apply color overlay to all drawn particles
      if (this.color) {
        ctx.save();
        ctx.globalCompositeOperation = 'source-atop';
        ctx.fillStyle = this.color;

        // Color the main particle
        this.colorAtPosition(ctx, this.x, this.y);

        // Color the wrapped particles
        if (this.x < margin) {
          this.colorAtPosition(ctx, this.x + this.canvas.width, this.y);
        } else if (this.x > this.canvas.width - margin) {
          this.colorAtPosition(ctx, this.x - this.canvas.width, this.y);
        }

        if (this.y < margin) {
          this.colorAtPosition(ctx, this.x, this.y + this.canvas.height);
        } else if (this.y > this.canvas.height - margin) {
          this.colorAtPosition(ctx, this.x, this.y - this.canvas.height);
        }

        ctx.restore();
      }
    }

    private drawAtPosition(ctx: CanvasRenderingContext2D, x: number, y: number): void {
      ctx.drawImage(this.image, x - this.size / 2, y - this.size / 2, this.size, this.size);
    }

    private colorAtPosition(ctx: CanvasRenderingContext2D, x: number, y: number): void {
      ctx.fillRect(x - this.size / 2, y - this.size / 2, this.size, this.size);
    }
  }

  class ParticleSystem {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private particles: Particle[];
    private particleImages: HTMLImageElement[];
    private numberOfCols: number;
    private numberOfRows: number;
    private mouseX: number = 0;  // Add mouse position tracking
    private mouseY: number = 0;

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

      // Add mouse move event listener
      window.addEventListener('mousemove', (e) => {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
      });
    }

    private calculateGridSize(): void {
      const aspectRatio = window.innerWidth / window.innerHeight;
      // Reduce base particles for mobile screens
      const baseParticles = window.innerWidth < 768 ? MOBILE_PARTICLE_COUNT : DESKTOP_PARTICLE_COUNT;
      this.numberOfCols = Math.round(Math.sqrt(baseParticles * aspectRatio));
      this.numberOfRows = Math.round(baseParticles / this.numberOfCols);
    }

    private async loadParticleImages(): Promise<void> {
      try {
        const loadedImages = await Promise.all(
          svgFiles.map((imagePath) => {
            return new Promise<HTMLImageElement>((resolve, reject) => {
              const img = new Image();
              img.src = imagePath;
              img.onload = () => resolve(img);
              img.onerror = (e) => reject(new Error(`Failed to load image: ${e}`));
            });
          }),
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

      const shuffledImages = [...this.particleImages]
        .sort(() => Math.random() - 0.5);

      const existingParticles = [...this.particles];
      this.particles = [];

      const colors = ['#000000']

      for (let row = 0; row < this.numberOfRows; row++) {
        for (let col = 0; col < this.numberOfCols; col++) {
          const startX = (col + 0.5) * spacingX;
          const startY = (row + 0.5) * spacingY;

          const imageIndex = (row * this.numberOfCols + col) % shuffledImages.length;
          const image = existingParticles[row * this.numberOfCols + col]?.image || shuffledImages[imageIndex];

          // Assign a color from the colors array
          const colorIndex = (row * this.numberOfCols + col) % colors.length;
          const color = colors[colorIndex];

          const particle = new Particle({
            canvas: this.canvas,
            image,
            startX,
            startY,
            color,
          });
          this.particles.push(particle);
        }
      }
    }

    private animate(): void {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.particles.forEach((particle) => {
        particle.update();
        particle.draw(this.ctx, this.mouseX, this.mouseY);
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
        zIndex: -1,
      }}
    />
  );
};
