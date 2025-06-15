// SkyExplorer.ts
export class SkyExplorer {
  width: number;
  height: number;
  player: Player;
  scrollOffset: number;
  scrollSpeed: number;
  gravity: number;
  handleCrystalCollection: (crystal: Crystal) => void;
  level: number;
  biomes: string[];

  constructor(
    width: number,
    height: number,
    player: Player,
    handleCrystalCollection: (crystal: Crystal) => void,
    level: number
  ) {
    this.width = width;
    this.height = height;
    this.player = player;
    this.scrollOffset = 0;
    this.scrollSpeed = 3;
    this.gravity = 0.4;
    this.handleCrystalCollection = handleCrystalCollection;
    this.level = level;
    this.biomes = ['jungle', 'aquatic', 'savannah', 'farm'];
  }

  updateScroll() {
    this.scrollOffset += this.scrollSpeed;
  }

  generateIslands(level: number): FloatingIsland[] {
    const islands: FloatingIsland[] = [];
    const minGap = 200;
    const maxGap = 300;
    let lastX = 0;
    
    // Island size varies by biome
    const islandSizes = {
      jungle: { minWidth: 200, maxWidth: 300, minHeight: 60, maxHeight: 90 },
      aquatic: { minWidth: 180, maxWidth: 250, minHeight: 50, maxHeight: 70 },
      savannah: { minWidth: 220, maxWidth: 320, minHeight: 60, maxHeight: 80 },
      farm: { minWidth: 200, maxWidth: 280, minHeight: 55, maxHeight: 75 }
    };

    // Get the biome for this level
    const currentBiome = this.biomes[(level - 1) % this.biomes.length];
    const { minWidth, maxWidth, minHeight, maxHeight } = islandSizes[currentBiome as keyof typeof islandSizes];

    // Generate a series of islands with the current biome
    const islandCount = level + 3;
    for (let i = 0; i < islandCount; i++) {
      const gap = minGap + Math.random() * (maxGap - minGap);
      const x = lastX + gap;
      const islandWidth = minWidth + Math.random() * (maxWidth - minWidth);
      const islandHeight = minHeight + Math.random() * (maxHeight - minHeight);
      const y = 200 + Math.random() * (this.height * 0.6 - 200);

      islands.push(
        new FloatingIsland(
          x,
          y,
          islandWidth,
          islandHeight,
          currentBiome,
          i % 3,  // Variation within the biome
          level
        )
      );
      lastX = x + islandWidth;
    }

    return islands;
  }

  generateCrystals(islands: FloatingIsland[]): Crystal[] {
    const crystals: Crystal[] = [];
    const biome = islands[0]?.biome || 'jungle';
    
    // Different crystal counts and colors based on biome
    const biomeInfo = {
      jungle: { maxPerIsland: 4, colors: ['green', 'purple', 'orange'] },
      aquatic: { maxPerIsland: 3, colors: ['blue', 'cyan', 'teal'] },
      savannah: { maxPerIsland: 3, colors: ['yellow', 'orange', 'red'] },
      farm: { maxPerIsland: 4, colors: ['gold', 'red', 'green'] }
    };
    
    const { maxPerIsland, colors } = biomeInfo[biome as keyof typeof biomeInfo];
    
    for (const island of islands) {
      // Random crystal count for this island
      const count = Math.floor(1 + Math.random() * maxPerIsland);
      
      for (let i = 0; i < count; i++) {
        // Distribute crystals across the island
        const x = island.x + 20 + Math.random() * (island.width - 40);
        const y = island.y - 20 - Math.random() * 40; // Position above the island
        
        // Determine crystal type and color
        const crystalType = Math.random() < 0.2 ? "rare" : "common";
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        crystals.push(new Crystal(x, y, crystalType, color));
      }
    }
    
    return crystals;
  }

  generateClouds(): SkyObject[] {
    const clouds: SkyObject[] = [];
    const cloudTypes = ['fluffy', 'wispy', 'round'];
    
    for (let i = 0; i < 8; i++) {
      const x = Math.random() * this.width;
      const y = Math.random() * (this.height * 0.5);
      const width = 80 + Math.random() * 120;
      const height = 40 + Math.random() * 30;
      const cloudType = cloudTypes[Math.floor(Math.random() * cloudTypes.length)];
      const cloud = new SkyObject(x, y, width, height, 'cloud', cloudType);
      clouds.push(cloud);
    }
    
    // Add some animals in balloons and vehicles in the sky
    if (Math.random() > 0.5) {
      const x = Math.random() * this.width;
      const y = 50 + Math.random() * 100;
      const balloon = new SkyObject(x, y, 60, 80, 'balloon', 'animal');
      clouds.push(balloon);
    }
    
    if (Math.random() > 0.7) {
      const x = this.width * 0.8;
      const y = 30 + Math.random() * 80;
      const plane = new SkyObject(x, y, 80, 40, 'aircraft', 'plane');
      clouds.push(plane);
    }
    
    return clouds;
  }

  generateBackground(biome: string): SkyObject[] {
    const bgElements: SkyObject[] = [];
    
    // Add biome-specific background elements
    switch (biome) {
      case 'jungle':
        // Add distant trees
        for (let i = 0; i < 5; i++) {
          const x = Math.random() * this.width;
          const y = this.height * 0.6 + Math.random() * 100;
          bgElements.push(new SkyObject(x, y, 100, 120, 'tree', 'jungle'));
        }
        break;
        
      case 'aquatic':
        // Add water reflections
        for (let i = 0; i < 8; i++) {
          const x = Math.random() * this.width;
          const y = this.height * 0.7 + Math.random() * 80;
          bgElements.push(new SkyObject(x, y, 30, 10, 'reflection', 'water'));
        }
        break;
        
      case 'savannah':
        // Add distant mountains
        for (let i = 0; i < 3; i++) {
          const x = (i * this.width/3) + Math.random() * 100;
          const y = this.height * 0.65;
          bgElements.push(new SkyObject(x, y, 180, 100, 'mountain', 'savannah'));
        }
        break;
        
      case 'farm':
        // Add fence and farm elements
        const fenceX = 0;
        const fenceY = this.height * 0.75;
        bgElements.push(new SkyObject(fenceX, fenceY, this.width, 30, 'fence', 'farm'));
        
        // Add barn in the distance
        bgElements.push(new SkyObject(this.width * 0.7, this.height * 0.65, 120, 80, 'building', 'barn'));
        break;
    }
    
    return bgElements;
  }

  checkCollisions(islands: FloatingIsland[], crystals: Crystal[]) {
    // Island collision
    for (const island of islands) {
      if (
        this.player.x + this.player.width > island.x &&
        this.player.x < island.x + island.width &&
        this.player.y + this.player.height > island.y &&
        this.player.y + this.player.height < island.y + island.height + 10 // Slight adjustment for better collision feel
      ) {
        this.player.y = island.y - this.player.height;
        this.player.velocityY = 0;
        this.player.isGrounded = true;
        
        // Create footprint particles when landing
        if (Math.random() > 0.6) {
          for (let i = 0; i < 3; i++) {
            this.player.trailParticles.push({
              x: this.player.x + Math.random() * this.player.width,
              y: island.y + 2,
              size: 2 + Math.random() * 2,
              life: 0.5 + Math.random() * 0.3,
              color: island.getParticleColor()
            });
          }
        }
      }
    }

    // Crystal collision
    for (let i = 0; i < crystals.length; i++) {
      const crystal = crystals[i];
      if (!crystal.collected) {
        const dx = this.player.x + this.player.width / 2 - (crystal.x + 15);
        const dy = this.player.y + this.player.height / 2 - (crystal.y + 15);
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.player.width / 2 + 15) {
          crystal.collected = true;
          this.handleCrystalCollection(crystal);
          
          // Create sparkle effect on collection
          for (let j = 0; j < 12; j++) {
            const angle = j / 12 * Math.PI * 2;
            const speed = 2 + Math.random() * 2;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            crystal.particles.push(
              new Particle(
                crystal.x + 15, 
                crystal.y + 15,
                vx, vy,
                3 + Math.random() * 3,
                1,
                crystal.color
              )
            );
          }
        }
      }
    }
  }
}

// FloatingIsland.ts
export class FloatingIsland {
  x: number;
  y: number;
  width: number;
  height: number;
  biome: string;
  variant: number;
  level: number;
  color: string;
  elements: IslandElement[];
  
  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    biome: string,
    variant: number,
    level: number
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.biome = biome;
    this.variant = variant;
    this.level = level;
    this.color = this.getBiomeBaseColor();
    this.elements = this.generateElements();
  }
  
  getBiomeBaseColor(): string {
    const colors = {
      jungle: ['#4a7c10', '#3a6d05', '#2d5c04'],
      aquatic: ['#1a8caf', '#0d7796', '#05668a'],
      savannah: ['#d9a566', '#c4964b', '#b1883d'],
      farm: ['#7cb518', '#5f9a0c', '#4d8208']
    };
    
    const biomeColors = colors[this.biome as keyof typeof colors] || colors.jungle;
    return biomeColors[this.variant % biomeColors.length];
  }
  
  generateElements(): IslandElement[] {
    const elements: IslandElement[] = [];
    
    // Add biome-specific decorative elements to the island
    switch(this.biome) {
      case 'jungle':
        // Add trees
        for (let i = 0; i < 1 + Math.floor(this.width / 100); i++) {
          const x = this.x + 20 + Math.random() * (this.width - 40);
          elements.push(new IslandElement(
            x, this.y - 30 - Math.random() * 20,
            30, 40, 'tree', this.getTreeType()
          ));
        }
        break;
        
      case 'aquatic':
        // Add water plants
        for (let i = 0; i < 2 + Math.floor(this.width / 120); i++) {
          const x = this.x + 15 + Math.random() * (this.width - 30);
          elements.push(new IslandElement(
            x, this.y - 15 - Math.random() * 10,
            20, 25, 'water_plant', Math.random() > 0.5 ? 'seaweed' : 'coral'
          ));
        }
        break;
        
      case 'savannah':
        // Add rocks and small bushes
        for (let i = 0; i < 1 + Math.floor(this.width / 150); i++) {
          const x = this.x + 30 + Math.random() * (this.width - 60);
          if (Math.random() > 0.5) {
            elements.push(new IslandElement(
              x, this.y - 15,
              25, 20, 'rock', Math.random() > 0.5 ? 'large' : 'small'
            ));
          } else {
            elements.push(new IslandElement(
              x, this.y - 20,
              20, 25, 'bush', 'savannah'
            ));
          }
        }
        break;
        
      case 'farm':
        // Add crops and farm items
        for (let i = 0; i < 2 + Math.floor(this.width / 100); i++) {
          const x = this.x + 20 + Math.random() * (this.width - 40);
          if (Math.random() > 0.6) {
            elements.push(new IslandElement(
              x, this.y - 20,
              15, 25, 'crop', Math.random() > 0.5 ? 'corn' : 'wheat'
            ));
          } else {
            elements.push(new IslandElement(
              x, this.y - 15,
              20, 20, 'farm_item', Math.random() > 0.5 ? 'hay' : 'pumpkin'
            ));
          }
        }
        
        // Maybe add a small fence
        if (this.width > 200 && Math.random() > 0.5) {
          elements.push(new IslandElement(
            this.x + 10, this.y - 15,
            50, 15, 'fence', 'wooden'
          ));
        }
        break;
    }
    
    return elements;
  }
  
  getTreeType(): string {
    const treeTypes = ['oak', 'palm', 'pine'];
    return treeTypes[Math.floor(Math.random() * treeTypes.length)];
  }
  
  getParticleColor(): string {
    const colors = {
      jungle: ['#3d6b09', '#2c5802'],
      aquatic: ['#0a6d8a', '#055a73'],
      savannah: ['#c49146', '#b38235'],
      farm: ['#6a9e0c', '#588904']
    };
    
    const particleColors = colors[this.biome as keyof typeof colors] || colors.jungle;
    return particleColors[Math.floor(Math.random() * particleColors.length)];
  }

  draw(ctx: CanvasRenderingContext2D, biomeImages: Record<string, HTMLImageElement> | null) {
    // Draw the main island body with a rounded top
    ctx.fillStyle = this.color;
    
    // Island shape with curved top
    ctx.beginPath();
    ctx.moveTo(this.x, this.y + this.height);
    ctx.lineTo(this.x, this.y + this.height * 0.3);
    ctx.quadraticCurveTo(
      this.x + this.width / 2, this.y - this.height * 0.1,
      this.x + this.width, this.y + this.height * 0.3
    );
    ctx.lineTo(this.x + this.width, this.y + this.height);
    ctx.closePath();
    ctx.fill();
    
    // Add grass/top layer with biome-specific color
    const topColors = {
      jungle: '#73b92d',
      aquatic: '#5abedc',
      savannah: '#e8c07d',
      farm: '#98d636'
    };
    
    const topColor = topColors[this.biome as keyof typeof topColors] || topColors.jungle;
    ctx.fillStyle = topColor;
    
    // Draw the top of the island
    ctx.beginPath();
    ctx.moveTo(this.x, this.y + this.height * 0.3);
    ctx.quadraticCurveTo(
      this.x + this.width / 2, this.y - this.height * 0.1,
      this.x + this.width, this.y + this.height * 0.3
    );
    ctx.lineTo(this.x + this.width, this.y);
    ctx.lineTo(this.x, this.y);
    ctx.closePath();
    ctx.fill();
    
    // Draw decorative elements
    for (const element of this.elements) {
      element.draw(ctx, biomeImages);
    }
  }
}

// IslandElement.ts
export class IslandElement {
  x: number;
  y: number;
  width: number;
  height: number;
  type: string;
  variant: string;
  
  constructor(x: number, y: number, width: number, height: number, type: string, variant: string) {
    this.x = x;
    this.y = y;
    this.width = width; 
    this.height = height;
    this.type = type;
    this.variant = variant;
  }
  
  draw(ctx: CanvasRenderingContext2D, biomeImages: Record<string, HTMLImageElement> | null) {
    // If we have images, use them, otherwise draw simple shapes
    if (biomeImages && biomeImages[`${this.type}_${this.variant}`]) {
      ctx.drawImage(biomeImages[`${this.type}_${this.variant}`], this.x - this.width/2, this.y - this.height, this.width, this.height);
      return;
    }
    
    // Fallback shapes based on element type
    switch(this.type) {
      case 'tree':
        // Draw a simple tree
        // Tree trunk
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(this.x - 3, this.y - this.height/2, 6, this.height/2);
        
        // Tree top
        ctx.fillStyle = this.variant === 'palm' ? '#2EAE52' : '#3c893c';
        ctx.beginPath();
        if (this.variant === 'palm') {
          // Palm tree
          for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2;
            const leafLength = this.width * 0.7;
            ctx.moveTo(this.x, this.y - this.height/2);
            ctx.quadraticCurveTo(
              this.x + Math.cos(angle) * leafLength * 0.6,
              this.y - this.height/2 + Math.sin(angle) * leafLength * 0.6,
              this.x + Math.cos(angle) * leafLength,
              this.y - this.height/2 + Math.sin(angle) * leafLength
            );
          }
        } else {
          // Regular tree
          ctx.arc(this.x, this.y - this.height/2 - this.height/4, this.width/2, 0, Math.PI * 2);
        }
        ctx.fill();
        break;
        
      case 'water_plant':
        if (this.variant === 'seaweed') {
          // Seaweed
          ctx.fillStyle = '#1c8e40';
          for (let i = 0; i < 3; i++) {
            const xOffset = i * 5 - 5;
            ctx.beginPath();
            ctx.moveTo(this.x + xOffset, this.y);
            ctx.quadraticCurveTo(
              this.x + xOffset + 5, this.y - this.height/2,
              this.x + xOffset, this.y - this.height
            );
            ctx.quadraticCurveTo(
              this.x + xOffset - 5, this.y - this.height/2,
              this.x + xOffset, this.y
            );
            ctx.fill();
          }
        } else {
          // Coral
          ctx.fillStyle = '#FF7F50';
          ctx.beginPath();
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(this.x - this.width/2, this.y - this.height);
          ctx.lineTo(this.x + this.width/2, this.y - this.height);
          ctx.closePath();
          ctx.fill();
        }
        break;
        
      case 'rock':
        // Rock
        ctx.fillStyle = this.variant === 'large' ? '#777777' : '#999999';
        ctx.beginPath();
        ctx.ellipse(this.x, this.y - this.height/2, this.width/2, this.height/2, 0, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case 'bush':
        // Bush
        ctx.fillStyle = '#8BC34A';
        ctx.beginPath();
        ctx.arc(this.x, this.y - this.height/2, this.width/2, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case 'crop':
        if (this.variant === 'corn') {
          // Corn
          ctx.fillStyle = '#1B5E20';
          ctx.fillRect(this.x - 2, this.y - this.height, 4, this.height);
          
          ctx.fillStyle = '#FFC107';
          ctx.fillRect(this.x - 4, this.y - this.height/2, 8, this.height/4);
        } else {
          // Wheat
          ctx.fillStyle = '#D4AF37';
          ctx.beginPath();
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(this.x, this.y - this.height);
          ctx.lineTo(this.x + 5, this.y - this.height + 5);
          ctx.fill();
        }
        break;
        
      case 'farm_item':
        if (this.variant === 'hay') {
          // Hay bale
          ctx.fillStyle = '#D4B483';
          ctx.beginPath();
          ctx.ellipse(this.x, this.y - this.height/2, this.width/2, this.height/2, 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Pumpkin
          ctx.fillStyle = '#FF7F00';
          ctx.beginPath();
          ctx.ellipse(this.x, this.y - this.height/2, this.width/2, this.height/2, 0, 0, Math.PI * 2);
          ctx.fill();
          
          // Pumpkin stem
          ctx.fillStyle = '#1B5E20';
          ctx.fillRect(this.x - 2, this.y - this.height, 4, this.height/4);
        }
        break;
        
      case 'fence':
        // Fence posts
        ctx.fillStyle = '#A0522D';
        const postWidth = 4;
        const postCount = Math.ceil(this.width / 12);
        for (let i = 0; i < postCount; i++) {
          const postX = this.x + i * 12;
          ctx.fillRect(postX, this.y - this.height, postWidth, this.height);
        }
        
        // Fence rails
        ctx.fillRect(this.x, this.y - this.height * 0.7, this.width, 3);
        ctx.fillRect(this.x, this.y - this.height * 0.4, this.width, 3);
        break;
    }
  }
}

// SkyObject.ts
export class SkyObject {
  x: number;
  y: number;
  width: number;
  height: number;
  type: string;
  subtype: string;
  color: string;
  speedX: number;
  frame: number;
  animationSpeed: number;

  constructor(x: number, y: number, width: number, height: number, type: string, subtype: string = '') {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type;
    this.subtype = subtype;
    this.color = this.getColor();
    this.speedX = this.getSpeed();
    this.frame = 0;
    this.animationSpeed = 0.05 + Math.random() * 0.05;
  }

  getColor(): string {
    // Cloud colors
    if (this.type === 'cloud') {
      return 'white';
    }
    
    // Background element colors
    if (this.type === 'mountain') {
      return '#9b7653';
    }
    
    if (this.type === 'tree') {
      return '#496a2d';
    }
    
    if (this.type === 'reflection') {
      return 'rgba(255, 255, 255, 0.5)';
    }
    
    if (this.type === 'fence') {
      return '#8a5c2d';
    }
    
    if (this.type === 'building') {
      return '#c23b22';
    }
    
    if (this.type === 'balloon') {
      const balloonColors = ['#FF5252', '#FFAB40', '#7C4DFF', '#18FFFF', '#B2FF59'];
      return balloonColors[Math.floor(Math.random() * balloonColors.length)];
    }
    
    if (this.type === 'aircraft') {
      return '#FFFFFF';
    }
    
    return 'white';
  }
  
  getSpeed(): number {
    if (this.type === 'cloud') {
      // Different cloud types move at different speeds
      const speedMap = {
        'fluffy': 0.2,
        'wispy': 0.4,
        'round': 0.3
      };
      
      return speedMap[this.subtype as keyof typeof speedMap] || 0.3;
    }
    
    if (this.type === 'aircraft') {
      return 1.5;
    }
    
    if (this.type === 'balloon') {
      return 0.15;
    }
    
    // Static background elements
    return 0;
  }

  update() {
    this.x -= this.speedX;
    
    // Increment animation frame
    this.frame += this.animationSpeed;
    if (this.frame > 1) {
      this.frame -= 1;
    }
  }

  draw(ctx: CanvasRenderingContext2D, images: Record<string, HTMLImageElement> | null) {
    const id = `${this.type}_${this.subtype}`;
    
    // If we have images, use them
    if (images && images[id]) {
      ctx.drawImage(images[id], this.x, this.y, this.width, this.height);
      return;
    }
    
    // Otherwise draw basic shapes based on type
    switch(this.type) {
      case 'cloud':
        this.drawCloud(ctx);
        break;
        
      case 'balloon':
        this.drawBalloon(ctx);
        break;
        
      case 'aircraft':
        this.drawAircraft(ctx);
        break;
        
      case 'mountain':
        this.drawMountain(ctx);
        break;
        
      case 'tree':
        this.drawTree(ctx);
        break;
        
      case 'reflection':
        this.drawReflection(ctx);
        break;
        
      case 'fence':
        this.drawFence(ctx);
        break;
        
      case 'building':
        this.drawBuilding(ctx);
        break;
      
      default:
        // Fallback
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }
  
  drawCloud(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'white';
    
    if (this.subtype === 'fluffy') {
      // Draw fluffy cloud with multiple circles
      const baseSize = this.width / 3;
      ctx.beginPath();
      ctx.arc(this.x + baseSize, this.y + this.height/2, baseSize, 0, Math.PI * 2);
      ctx.arc(this.x + this.width - baseSize, this.y + this.height/2, baseSize, 0, Math.PI * 2);
      ctx.arc(this.x + this.width/2, this.y + this.height/3, baseSize * 1.2, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.subtype === 'wispy') {
      // Draw wispy elongated cloud
      ctx.beginPath();
      ctx.ellipse(this.x + this.width/2, this.y + this.height/2, this.width/2, this.height/2, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Draw round cloud
      ctx.beginPath();
      ctx.arc(this.x + this.width/2, this.y + this.height/2, this.width/2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  drawBalloon(ctx: CanvasRenderingContext2D) {
    // Draw balloon
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.ellipse(this.x + this.width/2, this.y + this.height/3, this.width/2, this.height/3, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw basket
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(this.x + this.width/2 - 10, this.y + this.height*2/3, 20, 15);
    
    // Draw strings
    ctx.strokeStyle = '#000000';
    ctx.beginPath();
    ctx.moveTo(this.x + this.width/2 - 10, this.y + this.height*2/3);
    ctx.lineTo(this.x + this.width/3, this.y + this.height/3);
    ctx.moveTo(this.x + this.width/2 + 10, this.y + this.height*2/3);
    ctx.lineTo(this.x + this.width*2/3, this.y + this.height/3);
    ctx.stroke();
    
    // Draw animal in basket
    ctx.fillStyle = this.subtype === 'animal' ? '#FFA500' : '#7E57C2';
    ctx.beginPath();
    ctx.arc(this.x + this.width/2, this.y + this.height*2/3 + 5, 8, 0, Math.PI * 2);
    ctx.fill();
  }
  
  drawAircraft(ctx: CanvasRenderingContext2D) {
    if (this.subtype === 'plane') {
      // Draw airplane body
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.ellipse(this.x + this.width/2, this.y + this.height/2, this.width/2, this.height/4, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw wings
      ctx.fillStyle = '#EEEEEE';
      ctx.beginPath();
      ctx.moveTo(this.x + this.width/2, this.y + this.height/2);
      ctx.lineTo(this.x + this.width/3, this.y - this.height/4);
      ctx.lineTo(this.x + this.width*2/3, this.y - this.height/4);
      ctx.closePath();
      ctx.fill();
      
      // Draw tail
      ctx.beginPath();
      ctx.moveTo(this.x + this.width - 10, this.y + this.height/2);
      ctx.lineTo(this.x + this.width, this.y - this.height/4);
      ctx.lineTo(this.x + this.width + 5, this.y + this.height/2);
      ctx.closePath();
      ctx.fill();
    } else {
      // Draw a simpler aircraft silhouette
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(this.x, this.y, this.width, this.height/3);
    }
  }
  
  drawMountain(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y + this.height);
    ctx.lineTo(this.x + this.width/2, this.y);
    ctx.lineTo(this.x + this.width, this.y + this.height);
    ctx.closePath();
    ctx.fill();
    
    // Snow cap
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.moveTo(this.x + this.width/2 - 15, this.y + 20);
    ctx.lineTo(this.x + this.width/2, this.y);
    ctx.lineTo(this.x + this.width/2 + 15, this.y + 20);
    ctx.closePath();
    ctx.fill();
  }
  
  drawTree(ctx: CanvasRenderingContext2D) {
    // Draw trunk
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(this.x + this.width/2 - 5, this.y + this.height/2, 10, this.height/2);
    
    // Draw foliage
    ctx.fillStyle = '#2E8B57';
    ctx.beginPath();
    ctx.arc(this.x + this.width/2, this.y + this.height/3, this.width/2, 0, Math.PI * 2);
    ctx.fill();
  }
  
  drawReflection(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.beginPath();
    ctx.ellipse(this.x + this.width/2, this.y + this.height/2, 
                this.width/2, this.height/2 * (0.7 + 0.3 * Math.sin(this.frame * Math.PI * 2)), 
                0, 0, Math.PI * 2);
    ctx.fill();
  }
  
  drawFence(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    
    // Draw fence posts
    const postSpacing = 30;
    for (let x = this.x; x < this.x + this.width; x += postSpacing) {
      ctx.fillRect(x, this.y, 5, this.height);
    }
    
    // Draw rails
    ctx.fillRect(this.x, this.y + 5, this.width, 3);
    ctx.fillRect(this.x, this.y + this.height - 8, this.width, 3);
  }
  
  drawBuilding(ctx: CanvasRenderingContext2D) {
    if (this.subtype === 'barn') {
      // Draw barn body
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height * 0.7);
      
      // Draw roof
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x + this.width/2, this.y - this.height * 0.3);
      ctx.lineTo(this.x + this.width, this.y);
      ctx.closePath();
      ctx.fill();
      
      // Draw door
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(this.x + this.width/2 - 10, this.y + this.height * 0.4, 20, 30);
    }
  }
}

// Player.ts
interface TrailParticle {
  x: number;
  y: number;
  size: number;
  life: number;
  color: string;
}

export class Player {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityY: number;
  gravity: number;
  isGrounded: boolean;
  isGliding: boolean;
  glidePower: number;
  jumpPower: number;
  trailParticles: TrailParticle[];
  frameX: number;
  frameY: number;
  frameTimer: number;
  frameInterval: number;
  facingRight: boolean;
  specialActionTimer: number;
  
  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.velocityY = 0;
    this.gravity = 0.3;
    this.isGrounded = false;
    this.isGliding = false;
    this.glidePower = 0.15;
    this.jumpPower = -8;
    this.trailParticles = [];
    
    // Animation properties
    this.frameX = 0; // Current frame in sprite sheet
    this.frameY = 0; // Row in sprite sheet (0: gliding, 1: flapping, 2: idle)
    this.frameTimer = 0;
    this.frameInterval = 10; // Frames between sprite changes 
    this.facingRight = true;
    this.specialActionTimer = 0;
  }

  update() {
    // Apply gravity
    if (this.isGliding) {
      // Gliding has reduced gravity
      this.velocityY += this.gravity * 0.5;
      
      // Generate glide particles
      if (Math.random() > 0.7) {
        this.trailParticles.push({
          x: this.x + (this.facingRight ? 0 : this.width),
          y: this.y + this.height * 0.7,
          size: 2 + Math.random() * 2,
          life: 0.5 + Math.random() * 0.3,
          color: 'rgba(255, 255, 255, 0.6)'
        });
      }
      
      // Use gliding animation frames
      this.frameY = 0; 
      this.frameTimer++;
      if (this.frameTimer >= this.frameInterval) {
        this.frameX = (this.frameX + 1) % 4; // 4 gliding animation frames
        this.frameTimer = 0;
      }
    } else {
      // Normal gravity
      this.velocityY += this.gravity;
      
      // Animation for falling or flapping
      this.frameY = 1;
      this.frameTimer++;
      if (this.frameTimer >= this.frameInterval) {
        this.frameX = (this.frameX + 1) % 3; // 3 flapping frames
        this.frameTimer = 0;
      }
    }
    
    // Update position
    this.y += this.velocityY;
    
    // If grounded, play idle animation
    if (this.isGrounded) {
      this.frameY = 2;
      this.frameTimer++;
      if (this.frameTimer >= this.frameInterval * 1.5) {
        this.frameX = (this.frameX + 1) % 2; // 2 idle frames
        this.frameTimer = 0;
      }
    }
    
    // Forward movement when not grounded
    if (!this.isGrounded) {
      this.x += 1;
      this.facingRight = true;
    }
    
    // Special action timer decrement
    if (this.specialActionTimer > 0) {
      this.specialActionTimer--;
    }

    // Cap vertical speed
    if (this.velocityY > 8) {
      this.velocityY = 8;
    }

    // Reset grounded state (will be set to true again in collision detection if needed)
    this.isGrounded = false;

    // Update and remove old particles
    for (let i = this.trailParticles.length - 1; i >= 0; i--) {
      const particle = this.trailParticles[i];
      particle.life -= 0.02;
      particle.x += Math.random() * 2 - 1;
      particle.y += Math.random() * 2 - 1;

      if (particle.life <= 0) {
        this.trailParticles.splice(i, 1);
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D, image: HTMLImageElement | null) {
    // Draw trail particles
    for (const particle of this.trailParticles) {
      if (particle.life <= 0) continue;

      ctx.save();
      const alpha = Math.min(1, particle.life);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = particle.color;

      // Ensure radius is always positive
      const safeRadius = Math.max(0.1, particle.size * particle.life);

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, safeRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    
    // Draw the player duck
    if (image) {
      // If we have a sprite sheet, draw the appropriate animation frame
      // Each frame is 40px wide and tall in the sprite sheet
      const frameWidth = 40;
      const frameHeight = 40;
      
      // Special action animation override
      if (this.specialActionTimer > 0) {
        this.frameY = 3; // Use celebration row
      }
      
      ctx.save();
      if (!this.facingRight) {
        // Flip the image horizontally if facing left
        ctx.translate(this.x + this.width, this.y);
        ctx.scale(-1, 1);
        ctx.drawImage(
          image, 
          this.frameX * frameWidth, this.frameY * frameHeight, 
          frameWidth, frameHeight, 
          0, 0, 
          this.width, this.height
        );
      } else {
        // Normal drawing
        ctx.drawImage(
          image, 
          this.frameX * frameWidth, this.frameY * frameHeight, 
          frameWidth, frameHeight, 
          this.x, this.y, 
          this.width, this.height
        );
      }
      ctx.restore();
    } else {
      // Fallback to a basic colored rectangle
      ctx.fillStyle = "gold";
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  startGliding() {
    this.isGliding = true;
    
    // Add gliding particles
    for (let i = 0; i < 5; i++) {
      this.trailParticles.push({
        x: this.x + Math.random() * this.width,
        y: this.y + this.height * 0.8,
        size: 2 + Math.random() * 3,
        life: 0.8 + Math.random() * 0.4,
        color: 'rgba(255, 255, 255, 0.7)'
      });
    }
  }

  stopGliding() {
    this.isGliding = false;
  }
  
  celebrate() {
    // Set special action timer
    this.specialActionTimer = 30;
    
    // Create celebration particles
    for (let i = 0; i < 10; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      
      this.trailParticles.push({
        x: this.x + this.width / 2,
        y: this.y + this.height / 2,
        size: 3 + Math.random() * 3,
        life: 1 + Math.random() * 0.5,
        color: i % 2 === 0 ? '#FFD700' : '#FF9900'
      });
    }
  }
  
  resetForNewLevel() {
    this.x = 100;
    this.y = 200;
    this.velocityY = 0;
    this.isGrounded = false;
    this.isGliding = false;
    this.frameX = 0;
    this.frameY = 0;
    this.trailParticles = [];
  }
}

// Crystal.ts
export class Crystal {
  x: number;
  y: number;
  crystalType: string;
  color: string;
  collected: boolean;
  particles: Particle[];
  rotation: number;
  scale: number;
  oscillateTimer: number;

  constructor(x: number, y: number, crystalType: string, color: string) {
    this.x = x;
    this.y = y;
    this.crystalType = crystalType;
    this.color = color;
    this.collected = false;
    this.particles = [];
    this.rotation = Math.random() * Math.PI * 2;
    this.scale = 0.8 + Math.random() * 0.4;
    this.oscillateTimer = Math.random() * Math.PI * 2;
  }

  update() {
    // Animate crystal (rotate and oscillate)
    this.rotation += 0.02;
    this.oscillateTimer += 0.05;
    
    // Generate particles if not collected
    if (!this.collected && this.particles.length < 8) {
      if (Math.random() > 0.7) {
        for (let i = 0; i < 2; i++) {
          const colorVariants = {
            'green': ['#50C878', '#4CBB17', '#98FB98'],
            'purple': ['#9370DB', '#8A2BE2', '#D8BFD8'],
            'orange': ['#FFA07A', '#FF7F50', '#FFDAB9'],
            'blue': ['#87CEEB', '#1E90FF', '#B0E0E6'],
            'cyan': ['#00FFFF', '#20B2AA', '#AFEEEE'],
            'teal': ['#008080', '#40E0D0', '#7FFFD4'],
            'yellow': ['#FFD700', '#FFFF00', '#FAFAD2'],
            'red': ['#FF6347', '#DC143C', '#FFA07A'],
            'gold': ['#FFD700', '#DAA520', '#FFFACD']
          };
          
          const colors = colorVariants[this.color as keyof typeof colorVariants] || ['cyan', 'teal', 'blue'];
          const particleColor = colors[Math.floor(Math.random() * colors.length)];
          
          this.particles.push(
            new Particle(
              this.x + 15,
              this.y + 15,
              Math.random() * 2 - 1,
              Math.random() * 2 - 1,
              2 + Math.random() * 3,
              0.6 + Math.random() * 0.4,
              particleColor
            )
          );
        }
      }
    }

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      particle.update();
      if (particle.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D, image: HTMLImageElement | null) {
    if (this.collected) {
      return;
    }

    // Draw particles first (behind crystal)
    for (const particle of this.particles) {
      particle.draw(ctx);
    }
    
    // Slight bobbing movement
    const offsetY = Math.sin(this.oscillateTimer) * 3;

    // Draw crystal with rotation and scale
    ctx.save();
    ctx.translate(this.x + 15, this.y + 15 + offsetY);
    ctx.rotate(this.rotation);
    ctx.scale(this.scale, this.scale);
    
    if (image) {
      // Draw the image with color tinting
      ctx.drawImage(image, -15, -15, 30, 30);
      
      // Apply color overlay
      ctx.globalCompositeOperation = 'source-atop';
      ctx.fillStyle = this.getCrystalColor();
      ctx.globalAlpha = 0.7;
      ctx.fillRect(-15, -15, 30, 30);
      
      // Reset composite operation and alpha
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1.0;
      
      // Add shine effect
      this.drawShine(ctx);
    } else {
      // Draw a diamond shape as fallback
      ctx.fillStyle = this.getCrystalColor();
      ctx.beginPath();
      ctx.moveTo(0, -15);
      ctx.lineTo(15, 0);
      ctx.lineTo(0, 15);
      ctx.lineTo(-15, 0);
      ctx.closePath();
      ctx.fill();
      
      // Add shine effect
      this.drawShine(ctx);
    }
    
    ctx.restore();
  }
  
  drawShine(ctx: CanvasRenderingContext2D) {
    // Add a shine effect based on crystal type
    if (this.crystalType === "rare") {
      // Rainbow shine for rare crystals
      ctx.globalAlpha = 0.5 + Math.sin(this.oscillateTimer) * 0.2;
      ctx.strokeStyle = this.getRainbowColor();
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-12, -12);
      ctx.lineTo(12, 12);
      ctx.moveTo(12, -12);
      ctx.lineTo(-12, 12);
      ctx.stroke();
      ctx.globalAlpha = 1.0;
    } else {
      // Simple shine for common crystals
      ctx.globalAlpha = 0.7;
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(-5, -5, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;
    }
  }
  
  getCrystalColor(): string {
    const colorMap: Record<string, string> = {
      'green': '#50C878',
      'purple': '#9370DB',
      'orange': '#FF7F50',
      'blue': '#1E90FF',
      'cyan': '#00FFFF',
      'teal': '#20B2AA',
      'yellow': '#FFD700',
      'red': '#FF6347',
      'gold': '#DAA520'
    };
    
    return colorMap[this.color] || 'cyan';
  }

  getRainbowColor() {
    const hue = (Date.now() / 20) % 360;
    return `hsl(${hue}, 100%, 70%)`;
  }
}

// Particle.ts
class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  color: string;

  constructor(
    x: number,
    y: number,
    vx: number,
    vy: number,
    size: number,
    life: number,
    color: string
  ) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.size = size;
    this.life = life;
    this.color = color;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life -= 0.01;
    
    // Add slight gravity to particles
    this.vy += 0.01;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.life <= 0) return;

    ctx.save();
    const alpha = Math.min(1, this.life);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;

    // This is the fix: ensure radius is always positive
    const safeRadius = Math.max(0.1, this.size * this.life);

    // Draw the particle with a safe radius
    ctx.beginPath();
    ctx.arc(this.x, this.y, safeRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
