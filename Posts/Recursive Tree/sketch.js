let angle;
let branchRatio = 0.72;
let hueOffset = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);
  angleMode(DEGREES);
  // Set a nice background color
  background(220, 30, 15);
}

function draw() {
  // Gentle fade effect
  background(220, 30, 15, 0.2);

  // Smoothly animate hue
  hueOffset = (hueOffset + 0.3) % 360;
  
  // Calculate the base angle from mouse X with smoother movement
  let targetAngle = (mouseX / width) * 90;
  angle = lerp(angle || targetAngle, targetAngle, 0.1);
  
  // Start the tree from the bottom of the screen
  translate(width / 2, height);

  // Draw the trunk
  stroke(25, 70, 90);
  strokeWeight(14);
  line(0, 0, 0, -120);

  // Move to the end of that line
  translate(0, -120);

  // Start the recursive branching
  branch(120, 0);

  describe(
    'An artistic tree drawn with recursive branches, smoothly changing colors and responsive to mouse movement.'
  );
}

function branch(h, level) {
  // Set the color based on branch thickness and level
  let hue = (level * 15 + hueOffset) % 360;
  let saturation = map(h, 2, 120, 100, 70);
  let brightness = map(h, 2, 120, 100, 90);
  stroke(hue, saturation, brightness);
  
  // Set stroke weight based on branch thickness
  strokeWeight(map(h, 2, 120, 1, 14));

  // Each branch will be smaller than the previous one
  h *= branchRatio;

  if (h > 2) {
    // Right branch
    push();
    let rightAngle = angle + random(-2, 2);
    rotate(rightAngle);
    line(0, 0, 0, -h);
    translate(0, -h);
    branch(h, level + 1);
    pop();

    // Left branch
    push();
    let leftAngle = -angle + random(-2, 2);
    rotate(leftAngle);
    line(0, 0, 0, -h);
    translate(0, -h);
    branch(h, level + 1);
    pop();
  } else {
    // Draw glowing leaves at the end of branches
    let leafColor = color((hue + 30) % 360, 80, 100);
    strokeWeight(4);
    stroke(leafColor);
    point(0, 0);
    // Add a subtle glow effect
    strokeWeight(2);
    stroke(leafColor.levels[0], leafColor.levels[1], leafColor.levels[2], 50);
    point(0, 0);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(220, 30, 15);
}

// Add keyboard controls
function keyPressed() {
  if (key === 'ArrowUp') {
    branchRatio = min(branchRatio + 0.02, 0.85);
  } else if (key === 'ArrowDown') {
    branchRatio = max(branchRatio - 0.02, 0.5);
  }
}
