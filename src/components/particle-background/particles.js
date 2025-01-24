class Particle {
  constructor(canvas, image, startX, startY) {
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

  update() {
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

  draw(ctx) {
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

  drawAtPosition(ctx, x, y) {
    ctx.drawImage(this.image, x - this.size / 2, y - this.size / 2, this.size, this.size);
  }
}

class ParticleSystem {
  constructor() {
    this.canvas = document.getElementById('particleCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];

    // Calculate rows and columns based on aspect ratio and screen size
    this.calculateGridSize();
    this.particleImages = [];

    this.loadParticleImages().then(() => {
      this.init();
      this.animate();
    });

    // Handle window resize
    window.addEventListener('resize', () => {
      this.calculateGridSize();

      // Update canvas dimensions
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;

      // Reinitialize particles with new grid
      this.initParticles();
    });
  }

  calculateGridSize() {
    const aspectRatio = window.innerWidth / window.innerHeight;
    // Reduce base particles for mobile screens
    const baseParticles = window.innerWidth < 768 ? 40 : 120;
    this.numberOfCols = Math.round(Math.sqrt(baseParticles * aspectRatio));
    this.numberOfRows = Math.round(baseParticles / this.numberOfCols);
    this.numberOfParticles = this.numberOfRows * this.numberOfCols;
  }

  async loadParticleImages() {
    // Update to include all image files in the particles folder
    const imageFiles = ['a.svg', 'b.svg'];

    const loadingDiv = document.getElementById('loading');
    loadingDiv.style.display = 'block';

    try {
      for (const filename of imageFiles) {
        const image = new Image();
        image.src = `../../assets//${filename}`;
        await new Promise((resolve, reject) => {
          image.onload = resolve;
          image.onerror = () => reject(new Error(`Failed to load ${filename}`));
        });
        this.particleImages.push(image);
      }
    } catch (error) {
      console.error('Error loading particle images:', error);
    } finally {
      loadingDiv.style.display = 'none';
    }
  }

  init() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.initParticles();
  }

  initParticles() {
    // Calculate spacing using the canvas dimensions
    const spacingX = this.canvas.width / this.numberOfCols;
    const spacingY = this.canvas.height / this.numberOfRows;

    // Preserve existing particles if they exist
    const existingParticles = [...this.particles];
    this.particles = [];

    for (let row = 0; row < this.numberOfRows; row++) {
      for (let col = 0; col < this.numberOfCols; col++) {
        const startX = (col + 0.5) * spacingX;
        const startY = (row + 0.5) * spacingY;

        // Use existing particle's image if available, otherwise create new
        const index = row * this.numberOfCols + col;
        const image = existingParticles[index]?.image || this.particleImages[Math.floor(Math.random() * this.particleImages.length)];

        const particle = new Particle(this.canvas, image, startX, startY);
        this.particles.push(particle);
      }
    }
  }

  animate() {
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

// Initialize the particle system when the window loads
window.onload = () => new ParticleSystem();
