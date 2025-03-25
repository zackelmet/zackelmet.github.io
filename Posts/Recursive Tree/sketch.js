let angle = 0;
let branchRatio = 0.67;
let colorOffset = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  colorMode(HSB, 360, 100, 100);
}

function draw() {
  background(220, 30, 15);
  
  // Slowly change the color over time
  colorOffset = (colorOffset + 0.5) % 360;
  
  // Calculate the angle based on mouse position
  angle = map(mouseX, 0, width, 15, 45);
  
  // Start the tree from the bottom of the screen
  translate(width / 2, height);
  
  // Draw the tree
  branch(height * 0.25, 0);
  
  describe('A colorful recursive tree with colors that change over time');
}

function branch(len, level) {
  // Color based on branch level and time
  let hue = (map(level, 0, 8, 30, 140) + colorOffset) % 360;
  stroke(hue, 80, 70);
  
  // Draw the branch
  strokeWeight(len * 0.1);
  line(0, 0, 0, -len);
  
  // Move to the end of the branch
  translate(0, -len);
  
  // If the branch is still long enough, create two new branches
  if (len > 4) {
    // Right branch
    push();
    rotate(angle);
    branch(len * branchRatio, level + 1);
    pop();
    
    // Left branch
    push();
    rotate(-angle);
    branch(len * branchRatio, level + 1);
    pop();
  } else {
    // Draw colorful leaf at the end
    noStroke();
    fill((hue + 60) % 360, 90, 90);
    ellipse(0, 0, 6, 6);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Simple keyboard controls
function keyPressed() {
  if (key === 'ArrowUp') {
    branchRatio = min(branchRatio + 0.02, 0.85);
  } else if (key === 'ArrowDown') {
    branchRatio = max(branchRatio - 0.02, 0.5);
  }
}
