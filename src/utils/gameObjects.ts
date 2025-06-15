
// Game objects for FrenGame - Candy Crush style

export class CandyGame {
  grid: Array<Array<Candy | null>>;
  x: number;
  y: number;
  cols: number;
  rows: number;
  cellSize: number;
  selectedCandy: {row: number, col: number} | null;
  swappingCandies: {
    from: {row: number, col: number},
    to: {row: number, col: number},
    progress: number
  } | null;
  matchHandler: (matched: Candy[], points: number) => void;
  animationInProgress: boolean;
  fallingCandies: boolean;
  
  constructor(x: number, y: number, cols: number, rows: number, cellSize: number, matchHandler: (matched: Candy[], points: number) => void) {
    this.x = x;
    this.y = y;
    this.cols = cols;
    this.rows = rows;
    this.cellSize = cellSize;
    this.grid = Array(rows).fill(null).map(() => Array(cols).fill(null));
    this.selectedCandy = null;
    this.swappingCandies = null;
    this.matchHandler = matchHandler;
    this.animationInProgress = false;
    this.fallingCandies = false;
  }
  
  initializeGrid(level: number): void {
    // Clear the grid
    this.grid = Array(this.rows).fill(null).map(() => Array(this.cols).fill(null));
    this.selectedCandy = null;
    this.swappingCandies = null;
    this.animationInProgress = false;
    
    // Determine candy types based on level
    const candyColors = ['red', 'blue', 'green', 'yellow'];
    if (level >= 3) candyColors.push('purple');
    if (level >= 5) candyColors.push('orange');
    
    // Fill the grid with candies
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        // Avoid creating matches when generating the initial grid
        let availableColors = [...candyColors];
        
        // Check for horizontal matches (2 in a row)
        if (col >= 2) {
          const color1 = this.grid[row][col-1]?.color;
          const color2 = this.grid[row][col-2]?.color;
          if (color1 === color2 && color1) {
            availableColors = availableColors.filter(c => c !== color1);
          }
        }
        
        // Check for vertical matches (2 in a row)
        if (row >= 2) {
          const color1 = this.grid[row-1][col]?.color;
          const color2 = this.grid[row-2][col]?.color;
          if (color1 === color2 && color1) {
            availableColors = availableColors.filter(c => c !== color1);
          }
        }
        
        // If we've filtered out all colors, use the original set
        if (availableColors.length === 0) {
          availableColors = [...candyColors];
        }
        
        // Pick a random color from available ones
        const color = availableColors[Math.floor(Math.random() * availableColors.length)];
        
        // Create a candy and add special types based on level
        // FIX: Explicitly type the candyType variable to fix the type error
        let candyType: 'regular' | 'striped' | 'wrapped' | 'color_bomb' = 'regular';
        
        if (level >= 2 && Math.random() < 0.05) candyType = 'striped';
        if (level >= 4 && Math.random() < 0.03) candyType = 'wrapped';
        if (level >= 6 && Math.random() < 0.01) candyType = 'color_bomb';
        
        this.grid[row][col] = new Candy(
          this.x + col * this.cellSize,
          this.y - this.cellSize, // Start above the grid
          this.cellSize,
          this.cellSize,
          color,
          candyType
        );
        
        // Set target position for initial animation
        if (this.grid[row][col]) {
          this.grid[row][col]!.targetY = this.y + row * this.cellSize;
        }
      }
    }
    
    this.fallingCandies = true;
    
    // Ensure the grid has at least one possible match
    while (!this.hasAvailableMoves()) {
      this.shuffleGrid();
    }
  }
  
  handleInput(inputX: number, inputY: number): boolean {
    // Ignore input if animations are in progress
    if (this.animationInProgress || this.fallingCandies) {
      return false;
    }
    
    // Convert input coordinates to grid position
    const col = Math.floor((inputX - this.x) / this.cellSize);
    const row = Math.floor((inputY - this.y) / this.cellSize);
    
    // Check if the click is within the grid
    if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
      return false;
    }
    
    // If no candy is currently selected, select this one
    if (!this.selectedCandy) {
      this.selectedCandy = { row, col };
      return true;
    }
    
    // If the same candy is clicked again, deselect it
    if (this.selectedCandy.row === row && this.selectedCandy.col === col) {
      this.selectedCandy = null;
      return false;
    }
    
    // Check if the new selection is adjacent to the previous one
    const isAdjacent = (
      (Math.abs(this.selectedCandy.row - row) === 1 && this.selectedCandy.col === col) ||
      (Math.abs(this.selectedCandy.col - col) === 1 && this.selectedCandy.row === row)
    );
    
    if (isAdjacent) {
      // Try to swap the candies
      this.swapCandies(this.selectedCandy.row, this.selectedCandy.col, row, col);
      this.selectedCandy = null;
      return true;
    } else {
      // If not adjacent, select the new candy instead
      this.selectedCandy = { row, col };
      return true;
    }
  }
  
  swapCandies(row1: number, col1: number, row2: number, col2: number): void {
    const candy1 = this.grid[row1][col1];
    const candy2 = this.grid[row2][col2];
    
    if (!candy1 || !candy2) return;
    
    // Start swap animation
    this.swappingCandies = {
      from: { row: row1, col: col1 },
      to: { row: row2, col: col2 },
      progress: 0
    };
    
    this.animationInProgress = true;
    
    // Temporarily swap for match checking
    this.grid[row1][col1] = candy2;
    this.grid[row2][col2] = candy1;
    
    // Check if the swap creates a match
    const matches = this.findMatches();
    
    if (matches.length > 0) {
      // Set target positions for animation
      candy1.targetX = this.x + col2 * this.cellSize;
      candy1.targetY = this.y + row2 * this.cellSize;
      
      candy2.targetX = this.x + col1 * this.cellSize;
      candy2.targetY = this.y + row1 * this.cellSize;
    } else {
      // Swap back if no match was created
      this.grid[row1][col1] = candy1;
      this.grid[row2][col2] = candy2;
      
      // Set targets back to original positions
      candy1.targetX = this.x + col1 * this.cellSize;
      candy1.targetY = this.y + row1 * this.cellSize;
      
      candy2.targetX = this.x + col2 * this.cellSize;
      candy2.targetY = this.y + row2 * this.cellSize;
    }
  }
  
  findMatches(): Candy[][] {
    const matches: Candy[][] = [];
    
    // Check horizontal matches
    for (let row = 0; row < this.rows; row++) {
      let matchCount = 1;
      let matchType = '';
      let matchColor = '';
      let startCol = 0;
      
      for (let col = 1; col < this.cols; col++) {
        const prevCandy = this.grid[row][col-1];
        const currCandy = this.grid[row][col];
        
        if (prevCandy && currCandy && 
            prevCandy.color === currCandy.color && 
            prevCandy.type === currCandy.type) {
          
          if (matchCount === 1) {
            startCol = col - 1;
            matchType = prevCandy.type;
            matchColor = prevCandy.color;
          }
          matchCount++;
          
          // Check for match at the end of the row
          if (col === this.cols - 1 && matchCount >= 3) {
            const match: Candy[] = [];
            for (let i = 0; i < matchCount; i++) {
              const candy = this.grid[row][startCol + i];
              if (candy) match.push(candy);
            }
            matches.push(match);
          }
        } else {
          // Check if we've found a match
          if (matchCount >= 3) {
            const match: Candy[] = [];
            for (let i = 0; i < matchCount; i++) {
              const candy = this.grid[row][startCol + i];
              if (candy) match.push(candy);
            }
            matches.push(match);
          }
          
          matchCount = 1;
        }
      }
    }
    
    // Check vertical matches
    for (let col = 0; col < this.cols; col++) {
      let matchCount = 1;
      let matchType = '';
      let matchColor = '';
      let startRow = 0;
      
      for (let row = 1; row < this.rows; row++) {
        const prevCandy = this.grid[row-1][col];
        const currCandy = this.grid[row][col];
        
        if (prevCandy && currCandy && 
            prevCandy.color === currCandy.color && 
            prevCandy.type === currCandy.type) {
          
          if (matchCount === 1) {
            startRow = row - 1;
            matchType = prevCandy.type;
            matchColor = prevCandy.color;
          }
          matchCount++;
          
          // Check for match at the bottom of the column
          if (row === this.rows - 1 && matchCount >= 3) {
            const match: Candy[] = [];
            for (let i = 0; i < matchCount; i++) {
              const candy = this.grid[startRow + i][col];
              if (candy) match.push(candy);
            }
            matches.push(match);
          }
        } else {
          // Check if we've found a match
          if (matchCount >= 3) {
            const match: Candy[] = [];
            for (let i = 0; i < matchCount; i++) {
              const candy = this.grid[startRow + i][col];
              if (candy) match.push(candy);
            }
            matches.push(match);
          }
          
          matchCount = 1;
        }
      }
    }
    
    return matches;
  }
  
  processMatches(): boolean {
    const matches = this.findMatches();
    
    if (matches.length === 0) {
      this.animationInProgress = false;
      return false;
    }
    
    // Process all matches
    for (const match of matches) {
      // Calculate points based on match length and candy types
      let points = match.length * 10;
      
      // Bonus points for special candies
      for (const candy of match) {
        if (candy.type === 'striped') points += 10;
        if (candy.type === 'wrapped') points += 20;
        if (candy.type === 'color_bomb') points += 50;
      }
      
      // Call match handler with matched candies and points
      this.matchHandler(match, points);
      
      // Remove matched candies from the grid
      for (const candy of match) {
        // Find the position of this candy in the grid
        for (let row = 0; row < this.rows; row++) {
          for (let col = 0; col < this.cols; col++) {
            if (this.grid[row][col] === candy) {
              this.grid[row][col] = null;
            }
          }
        }
      }
    }
    
    // Move candies down to fill gaps
    this.cascadeCandies();
    
    return true;
  }
  
  cascadeCandies(): void {
    this.fallingCandies = false;
    
    // Check each column for candies that need to fall
    for (let col = 0; col < this.cols; col++) {
      // Find gaps and move candies down
      let emptySpaces = 0;
      
      for (let row = this.rows - 1; row >= 0; row--) {
        if (this.grid[row][col] === null) {
          emptySpaces++;
        } else if (emptySpaces > 0) {
          // Move this candy down by the number of empty spaces
          const candy = this.grid[row][col];
          
          if (candy) {
            // Set new target position
            candy.targetY = this.y + (row + emptySpaces) * this.cellSize;
            
            // Move candy in the grid
            this.grid[row + emptySpaces][col] = candy;
            this.grid[row][col] = null;
            
            this.fallingCandies = true;
          }
        }
      }
      
      // Fill empty spaces at the top with new candies
      for (let space = 0; space < emptySpaces; space++) {
        const row = emptySpaces - space - 1;
        
        // Create a new candy above the grid
        const candyColors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
        const color = candyColors[Math.floor(Math.random() * candyColors.length)];
        
        const newCandy = new Candy(
          this.x + col * this.cellSize,
          this.y - (space + 1) * this.cellSize,
          this.cellSize,
          this.cellSize,
          color,
          'regular' // FIX: Using proper literal type
        );
        
        // Set target position
        newCandy.targetY = this.y + row * this.cellSize;
        
        // Add to grid
        this.grid[row][col] = newCandy;
        this.fallingCandies = true;
      }
    }
  }
  
  update(): void {
    // Update all candies
    let allSettled = true;
    
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const candy = this.grid[row][col];
        if (candy) {
          candy.update();
          
          // Check if candy is still moving
          if (Math.abs(candy.x - candy.targetX) > 0.1 || 
              Math.abs(candy.y - candy.targetY) > 0.1) {
            allSettled = false;
          }
        }
      }
    }
    
    // Update swap animation
    if (this.swappingCandies) {
      this.swappingCandies.progress += 0.05;
      
      if (this.swappingCandies.progress >= 1) {
        this.swappingCandies = null;
        
        // Check for matches after swap animation completes
        this.processMatches();
      }
    } else if (allSettled && this.fallingCandies) {
      // All candies have settled after falling, check for matches
      this.fallingCandies = false;
      setTimeout(() => {
        this.processMatches();
      }, 250);
    }
  }
  
  draw(ctx: CanvasRenderingContext2D, images: Record<string, HTMLImageElement>): void {
    // Draw the grid background
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(this.x, this.y, this.cols * this.cellSize, this.rows * this.cellSize);
    
    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= this.cols; i++) {
      ctx.beginPath();
      ctx.moveTo(this.x + i * this.cellSize, this.y);
      ctx.lineTo(this.x + i * this.cellSize, this.y + this.rows * this.cellSize);
      ctx.stroke();
    }
    
    for (let i = 0; i <= this.rows; i++) {
      ctx.beginPath();
      ctx.moveTo(this.x, this.y + i * this.cellSize);
      ctx.lineTo(this.x + this.cols * this.cellSize, this.y + i * this.cellSize);
      ctx.stroke();
    }
    
    // Draw all candies
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const candy = this.grid[row][col];
        if (candy) {
          // Highlight selected candy
          if (this.selectedCandy && 
              this.selectedCandy.row === row && 
              this.selectedCandy.col === col) {
            
            // Draw selection glow
            ctx.save();
            const glowSize = this.cellSize * 1.1;
            const glowX = candy.x + candy.width/2 - glowSize/2;
            const glowY = candy.y + candy.height/2 - glowSize/2;
            
            ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
            ctx.shadowBlur = 15;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.beginPath();
            ctx.arc(
              candy.x + candy.width/2,
              candy.y + candy.height/2,
              candy.width/2 * 1.2,
              0,
              Math.PI * 2
            );
            ctx.fill();
            ctx.restore();
          }
          
          // Draw the candy
          candy.draw(ctx, images[candy.color] || null);
        }
      }
    }
    
    ctx.restore();
  }
  
  shuffleGrid(): void {
    // Collect all candies
    const candies: Candy[] = [];
    const positions: {row: number, col: number}[] = [];
    
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const candy = this.grid[row][col];
        if (candy) {
          candies.push(candy);
          positions.push({row, col});
        }
      }
    }
    
    // Shuffle positions
    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }
    
    // Reassign candies to new positions
    for (let i = 0; i < candies.length; i++) {
      const candy = candies[i];
      const pos = positions[i];
      
      // Update grid
      this.grid[pos.row][pos.col] = candy;
      
      // Set target position
      candy.targetX = this.x + pos.col * this.cellSize;
      candy.targetY = this.y + pos.row * this.cellSize;
    }
    
    // Reset selection
    this.selectedCandy = null;
    
    // Make sure the shuffled grid has at least one possible match
    if (!this.hasAvailableMoves()) {
      this.shuffleGrid(); // Try again
    }
  }
  
  hasAvailableMoves(): boolean {
    // Check for potential matches by temporarily swapping adjacent candies
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        // Try swapping with the candy to the right
        if (col < this.cols - 1) {
          // Swap
          const temp = this.grid[row][col];
          this.grid[row][col] = this.grid[row][col+1];
          this.grid[row][col+1] = temp;
          
          // Check for matches
          const matches = this.findMatches();
          
          // Swap back
          this.grid[row][col+1] = this.grid[row][col];
          this.grid[row][col] = temp;
          
          if (matches.length > 0) {
            return true;
          }
        }
        
        // Try swapping with the candy below
        if (row < this.rows - 1) {
          // Swap
          const temp = this.grid[row][col];
          this.grid[row][col] = this.grid[row+1][col];
          this.grid[row+1][col] = temp;
          
          // Check for matches
          const matches = this.findMatches();
          
          // Swap back
          this.grid[row+1][col] = this.grid[row][col];
          this.grid[row][col] = temp;
          
          if (matches.length > 0) {
            return true;
          }
        }
      }
    }
    
    return false;
  }
}

export class Candy {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  type: 'regular' | 'striped' | 'wrapped' | 'color_bomb';
  targetX: number;
  targetY: number;
  scale: number;
  rotation: number;
  
  constructor(x: number, y: number, width: number, height: number, color: string, type: 'regular' | 'striped' | 'wrapped' | 'color_bomb') {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.type = type;
    this.targetX = x;
    this.targetY = y;
    this.scale = 0.8; // Start slightly smaller for pop-in effect
    this.rotation = (Math.random() - 0.5) * 0.2; // Small random rotation
  }
  
  update(): void {
    // Move towards target position with easing
    this.x += (this.targetX - this.x) * 0.2;
    this.y += (this.targetY - this.y) * 0.2;
    
    // Scale animation
    this.scale += (1 - this.scale) * 0.1;
    
    // Gentle rotation animation
    this.rotation *= 0.95; // Dampen rotation
  }
  
  draw(ctx: CanvasRenderingContext2D, image: HTMLImageElement | null): void {
    ctx.save();
    
    // Translate to center of the candy for rotation and scale
    ctx.translate(this.x + this.width/2, this.y + this.height/2);
    ctx.rotate(this.rotation);
    ctx.scale(this.scale, this.scale);
    
    // Get candy color
    const colorMap: Record<string, string> = {
      'red': '#FF5252',
      'blue': '#4FC3F7',
      'green': '#66BB6A',
      'yellow': '#FFEB3B',
      'purple': '#BA68C8',
      'orange': '#FFA726'
    };
    
    const candyColor = colorMap[this.color] || '#FFFFFF';
    
    // Draw candy based on type
    if (image) {
      // Draw using the provided image (tinted with candy color)
      ctx.globalAlpha = 0.9;
      ctx.drawImage(
        image,
        -this.width/2,
        -this.height/2,
        this.width,
        this.height
      );
      
      // Apply color overlay
      ctx.globalCompositeOperation = 'source-atop';
      ctx.fillStyle = candyColor;
      ctx.globalAlpha = 0.7;
      ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    } else {
      // Fallback candy drawing if no image
      switch (this.type) {
        case 'color_bomb':
          // Rainbow gradient circle
          const gradient = ctx.createRadialGradient(0, 0, this.width/10, 0, 0, this.width/2);
          gradient.addColorStop(0, 'white');
          gradient.addColorStop(0.2, '#FF5252');
          gradient.addColorStop(0.4, '#FFEB3B');
          gradient.addColorStop(0.6, '#66BB6A');
          gradient.addColorStop(0.8, '#4FC3F7');
          gradient.addColorStop(1, '#BA68C8');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(0, 0, this.width/2 * 0.9, 0, Math.PI * 2);
          ctx.fill();
          
          // Spikes
          ctx.strokeStyle = 'white';
          ctx.lineWidth = 2;
          for (let i = 0; i < 8; i++) {
            const angle = i * Math.PI / 4;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(
              Math.cos(angle) * this.width/2 * 1.1,
              Math.sin(angle) * this.width/2 * 1.1
            );
            ctx.stroke();
          }
          break;
          
        case 'striped':
          // Striped candy
          ctx.fillStyle = candyColor;
          ctx.beginPath();
          ctx.arc(0, 0, this.width/2 * 0.9, 0, Math.PI * 2);
          ctx.fill();
          
          // Stripes
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.lineWidth = this.width/8;
          for (let i = -2; i <= 2; i++) {
            ctx.beginPath();
            ctx.moveTo(-this.width/2, i * this.width/5);
            ctx.lineTo(this.width/2, i * this.width/5);
            ctx.stroke();
          }
          break;
          
        case 'wrapped':
          // Double candy
          ctx.fillStyle = candyColor;
          
          // First circle
          ctx.beginPath();
          ctx.arc(-this.width/6, -this.height/6, this.width/2 * 0.6, 0, Math.PI * 2);
          ctx.fill();
          
          // Second circle
          ctx.beginPath();
          ctx.arc(this.width/6, this.height/6, this.width/2 * 0.6, 0, Math.PI * 2);
          ctx.fill();
          
          // Wrapper
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(-this.width/2, -this.height/2);
          ctx.lineTo(this.width/2, this.height/2);
          ctx.stroke();
          
          ctx.beginPath();
          ctx.moveTo(this.width/2, -this.height/2);
          ctx.lineTo(-this.width/2, this.height/2);
          ctx.stroke();
          break;
          
        default: // regular
          // Simple candy
          ctx.fillStyle = candyColor;
          ctx.beginPath();
          ctx.arc(0, 0, this.width/2 * 0.9, 0, Math.PI * 2);
          ctx.fill();
          
          // Highlight
          ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.beginPath();
          ctx.arc(-this.width/6, -this.height/6, this.width/3, 0, Math.PI * 2);
          ctx.fill();
      }
    }
    
    ctx.restore();
  }
}

export class DuckMascot {
  x: number;
  y: number;
  width: number;
  height: number;
  targetX: number;
  targetY: number;
  bobAmount: number;
  celebrationTimer: number;
  isCelebrating: boolean;
  emotes: Array<{text: string, x: number, y: number, alpha: number, scale: number}>;
  
  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.targetX = x;
    this.targetY = y;
    this.bobAmount = 0;
    this.celebrationTimer = 0;
    this.isCelebrating = false;
    this.emotes = [];
  }
  
  update(): void {
    // Move towards target with easing
    this.x += (this.targetX - this.x) * 0.1;
    this.y += (this.targetY - this.y) * 0.1;
    
    // Bobbing animation
    this.bobAmount = Math.sin(Date.now() / 500) * 5;
    
    // Update celebration state
    if (this.isCelebrating) {
      this.celebrationTimer--;
      if (this.celebrationTimer <= 0) {
        this.isCelebrating = false;
      }
      
      // Add emotes during celebration
      if (Math.random() < 0.1) {
        const emotes = ['👍', '😄', '🎉', '⭐', '🦆', '🍭', '🍬'];
        const emote = emotes[Math.floor(Math.random() * emotes.length)];
        
        this.emotes.push({
          text: emote,
          x: this.x + this.width/2 + (Math.random() - 0.5) * this.width,
          y: this.y - this.height/2,
          alpha: 1,
          scale: 0.5 + Math.random() * 0.5
        });
      }
    }
    
    // Update emotes
    for (let i = this.emotes.length - 1; i >= 0; i--) {
      const emote = this.emotes[i];
      emote.y -= 0.5;
      emote.alpha -= 0.01;
      
      if (emote.alpha <= 0) {
        this.emotes.splice(i, 1);
      }
    }
  }
  
  draw(ctx: CanvasRenderingContext2D, image: HTMLImageElement | null): void {
    ctx.save();
    
    const drawX = this.x;
    const drawY = this.y + this.bobAmount;
    
    // Draw celebration effects if celebrating
    if (this.isCelebrating) {
      // Draw glow behind duck
      ctx.shadowColor = 'rgba(255, 215, 0, 0.6)';
      ctx.shadowBlur = 20;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.beginPath();
      ctx.arc(
        drawX + this.width/2,
        drawY + this.height/2,
        this.width * 0.8,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.shadowBlur = 0;
      
      // Draw sparkles around duck
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 + Date.now() / 500;
        const distance = this.width * 0.8;
        const sparkleX = drawX + this.width/2 + Math.cos(angle) * distance;
        const sparkleY = drawY + this.height/2 + Math.sin(angle) * distance;
        const sparkleSize = 3 + Math.sin(Date.now() / 200 + i) * 2;
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(sparkleX, sparkleY, sparkleSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Draw the duck mascot
    if (image) {
      // Scale animation when celebrating
      const scale = this.isCelebrating ? 1 + Math.sin(Date.now() / 100) * 0.05 : 1;
      
      ctx.save();
      ctx.translate(drawX + this.width/2, drawY + this.height/2);
      ctx.scale(scale, scale);
      
      ctx.drawImage(
        image,
        -this.width/2,
        -this.height/2,
        this.width,
        this.height
      );
      ctx.restore();
    } else {
      // Fallback duck drawing
      ctx.fillStyle = '#FFEB3B';
      ctx.beginPath();
      ctx.ellipse(
        drawX + this.width/2,
        drawY + this.height/2,
        this.width/2,
        this.height/2,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();
      
      // Eyes
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.arc(
        drawX + this.width/3,
        drawY + this.height/3,
        this.width/10,
        0,
        Math.PI * 2
      );
      ctx.arc(
        drawX + this.width*2/3,
        drawY + this.height/3,
        this.width/10,
        0,
        Math.PI * 2
      );
      ctx.fill();
      
      // Bill
      ctx.fillStyle = 'orange';
      ctx.beginPath();
      ctx.ellipse(
        drawX + this.width/2,
        drawY + this.height*2/3,
        this.width/4,
        this.height/8,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
    
    // Draw emotes
    for (const emote of this.emotes) {
      ctx.globalAlpha = emote.alpha;
      ctx.font = `${30 * emote.scale}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(emote.text, emote.x, emote.y);
    }
    
    ctx.globalAlpha = 1;
    ctx.restore();
  }
  
  celebrateAt(x: number, y: number): void {
    // Move to celebration location
    this.targetX = x - this.width/2;
    this.targetY = y - this.height/2;
    
    // Start celebration
    this.isCelebrating = true;
    this.celebrationTimer = 60; // Celebrate for 60 frames
  }
}

export class SpecialEffect {
  x: number;
  y: number;
  color: string;
  type: 'sparkle' | 'burst' | 'explosion';
  particles: Array<{x: number, y: number, vx: number, vy: number, size: number, alpha: number, color: string}>;
  timeLeft: number;
  
  constructor(x: number, y: number, color: string, type: 'sparkle' | 'burst' | 'explosion') {
    this.x = x;
    this.y = y;
    this.color = color;
    this.type = type;
    this.particles = [];
    this.timeLeft = 60;
    
    // Create particles based on effect type
    switch (type) {
      case 'sparkle':
        // Create a few sparkles
        for (let i = 0; i < 10; i++) {
          this.particles.push({
            x: this.x,
            y: this.y,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 3 + 1,
            alpha: 1,
            color: 'white'
          });
        }
        break;
        
      case 'burst':
        // Create a burst of particles
        const colorValues = this.getColorValues(color);
        
        for (let i = 0; i < 30; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 3 + 1;
          
          this.particles.push({
            x: this.x,
            y: this.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: Math.random() * 5 + 3,
            alpha: 1,
            color: colorValues[i % colorValues.length]
          });
        }
        break;
        
      case 'explosion':
        // Create a large explosion
        const colors = ['#FF5252', '#FFEB3B', '#66BB6A', '#4FC3F7', '#BA68C8', 'white'];
        
        for (let i = 0; i < 60; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 5 + 2;
          
          this.particles.push({
            x: this.x,
            y: this.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: Math.random() * 6 + 2,
            alpha: 1,
            color: colors[Math.floor(Math.random() * colors.length)]
          });
        }
        break;
    }
  }
  
  getColorValues(color: string): string[] {
    // Return array of shades for the color
    switch (color) {
      case 'red': return ['#FFCDD2', '#EF9A9A', '#E57373', '#FF5252', '#FF8A80'];
      case 'blue': return ['#BBDEFB', '#90CAF9', '#64B5F6', '#4FC3F7', '#03A9F4'];
      case 'green': return ['#C8E6C9', '#A5D6A7', '#81C784', '#66BB6A', '#4CAF50'];
      case 'yellow': return ['#FFF9C4', '#FFEE58', '#FFEB3B', '#FFEB3B', '#FDD835'];
      case 'purple': return ['#E1BEE7', '#CE93D8', '#BA68C8', '#AB47BC', '#8E24AA'];
      case 'orange': return ['#FFE0B2', '#FFCC80', '#FFB74D', '#FFA726', '#FF9800'];
      case 'rainbow': return ['#FF5252', '#FFEB3B', '#66BB6A', '#4FC3F7', '#BA68C8', 'white'];
      default: return ['white', '#f0f0f0', '#e0e0e0', '#d0d0d0', '#c0c0c0'];
    }
  }
  
  update(): void {
    // Update all particles
    for (const particle of this.particles) {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Fade out
      particle.alpha -= 0.02;
      
      // Shrink
      particle.size *= 0.97;
    }
    
    // Remove faded particles
    this.particles = this.particles.filter(p => p.alpha > 0 && p.size > 0.5);
    
    // Update time left
    this.timeLeft--;
  }
  
  draw(ctx: CanvasRenderingContext2D): void {
    // Draw all particles
    ctx.save();
    
    for (const particle of this.particles) {
      ctx.globalAlpha = particle.alpha;
      ctx.fillStyle = particle.color;
      
      // Add glow effect
      ctx.shadowColor = particle.color;
      ctx.shadowBlur = 10;
      
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    ctx.restore();
  }
  
  isComplete(): boolean {
    return this.particles.length === 0 || this.timeLeft <= 0;
  }
}
