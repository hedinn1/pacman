const canvas = document.getElementById('pacman');
const ctx = canvas.getContext('2d');
const hp = document.querySelector('#health');
canvas.width = window.innerWidth * 0.99;
canvas.height = window.innerHeight * 0.99;
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth * 0.99;
  canvas.height = window.innerHeight * 0.99;
});

class Obstacle {
  constructor(x, y, width) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = width;
    this.radius = width / 2;
  }
  draw() {
    ctx.fillRect(this.x - this.radius, this.y - this.radius, this.width, this.height);
  }
}

const obstacles = [
  new Obstacle(canvas.width / 3, canvas.height / 4, canvas.width / 6),
  new Obstacle(canvas.width / 1.1, canvas.height / 2.4, canvas.width / 6),
  new Obstacle(canvas.width / 1.3, canvas.height / 1.4, canvas.width / 6)
];

obstacles.push();
obstacles.push();


class Character {
  constructor(x, y, radius, vx, vy, color, isPlayer) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.collision = false;
    this.isPlayer = isPlayer;
    this.angle = 0;
  }
  draw() {

    this.angle = Math.atan2(this.vy, this.vx)

    if (this.isPlayer) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, -Math.PI/4, Math.PI/4, true);
      ctx.lineTo(0, 0);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.closePath();

      // Draw the eye
      ctx.beginPath();
      ctx.arc(-7, -5, 3, 0, Math.PI * 2, false);
      ctx.fillStyle = 'black';
      ctx.fill();
      ctx.closePath();

      ctx.restore();

    } 
    
    
    else {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();

    // Draw the body
    ctx.fillRect(this.x - this.radius, this.y, this.radius * 2, this.radius);
    // Draw the left eye
    ctx.beginPath();
    ctx.arc(this.x - 8, this.y, 5, 0, Math.PI * 2, false);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();

    // Draw the right eye
    ctx.beginPath();
    ctx.arc(this.x + 8, this.y, 5, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();
    }
  }

  move() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.y + this.vy > canvas.height - this.radius || this.y + this.vy < this.radius) {
      this.vy = -this.vy;
    }
    if (this.x + this.vx > canvas.width - this.radius || this.x + this.vx < this.radius) {
      this.vx = -this.vx;
    }

    obstacles.forEach((obstacle) => {
      let distance = (this.x - obstacle.x) ** 2 + (this.y - obstacle.y) ** 2;
      if (distance < (this.radius + obstacle.radius) ** 2) {
        this.vx = -this.vx;
        this.vy = -this.vy;
      }
    });

    characters.forEach((otherGhost) => {
      if (otherGhost === this || otherGhost.collision === true) {
        return;
      }
      let distance = (this.x - otherGhost.x) ** 2 + (this.y - otherGhost.y) ** 2;
      if (distance < (this.radius + otherGhost.radius) ** 2) {
        if (otherGhost.isPlayer || this.isPlayer) {
          playerCollision();
        } else {
          this.vx = -this.vx;
          this.vy = -this.vy;
          otherGhost.vx = -otherGhost.vx;
          otherGhost.vy = -otherGhost.vy;
          this.collision = true;
          otherGhost.collision = true;
        }
      }
    });
    this.collision = false;

    if (!this.isPlayer) {
      
    } else {
    // move the player circle here, using arrow keys or other input
    window.addEventListener("keydown", (e) => {
      
      switch (e.key) {
        case "ArrowLeft": // left arrow
          this.vx = -3;
          break;
        case "ArrowUp": // up arrow
          this.vy = -3;
          break;
        case "ArrowRight": // right arrow
          this.vx = 3;
          break;
        case "ArrowDown": // down arrow
          this.vy = 3;
          break;
      }
      });
      document.addEventListener('keyup', (e) => {
        switch (e.key) {
          case 'ArrowLeft':
          case 'ArrowRight':
            this.vx = 0;
            break;
          case 'ArrowUp':
          case 'ArrowDown':
            this.vy = 0;
            break;
        }
      });
    }
}
}

let health = 3;
let cooldown = false;
function playerCollision() {
  if (!cooldown) {
    health--;
    window.navigator.vibrate(200);
    switch (health) {
      case 2:
        hp.textContent = '❤❤';
        break;
      case 1:
        hp.textContent = '❤';
        break;
      case 0:
        hp.textContent = ''
        break;
    }
    
    cooldown = true;
    setTimeout(() => {
      cooldown = false;
    }, 1000)
  }
}



let score = 0;
const pellets = []

function declarePellets() {
  for (let i = 0; i < 100; i++) {
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    pellets.push({ x, y });
  }
}

function drawPellets() {
  pellets.forEach((pellet) => {
    ctx.fillStyle = "gold";
    ctx.beginPath();
    ctx.arc(pellet.x, pellet.y, 5, 0, 2 * Math.PI);
    ctx.fill();
  });
}

function updateScore() {
  ctx.fillStyle = "white";
  ctx.font = "36px Arial";
  ctx.fillText(`Score: ${score}`, 20, 50);
}

function checkForPelletCollision() {
  pellets.forEach((pellet, index) => {
    let distance = (characters[4].x - pellet.x) ** 2 + (characters[4].y - pellet.y) ** 2;
    if (distance < (characters[4].radius + 5) ** 2) {
      score++;
      pellets.splice(index, 1);
    }
  });
}




const radius = 30;
const speed = 4;

let characters = []

function declareCharacters() {
  characters = [
    new Character(50, 100, radius, speed, speed, 'orange'),
    new Character(50, canvas.height - 100, radius, speed, speed, 'red'),
    new Character(canvas.width - 50, canvas.height -100, radius, speed, speed, 'green'),
    new Character(canvas.width - 50, 100, radius, speed, speed, 'blue'),
    new Character(canvas.width / 2, canvas.height / 2, radius, 0, 0, 'yellow', isPlayer = true)
    ];
}
declarePellets();
declareCharacters()

function gameLoop() {
  declarePellets();
  declareCharacters();
  render();
  hp.textContent = '❤❤❤';
  score = 0;
}
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  drawPellets();
  updateScore();
  checkForPelletCollision();

  for (let i = 0; i < characters.length; i++) {
    characters[i].draw();
    characters[i].move();
  }
  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].draw();
  }

  if (health === 0) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '48px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
    ctx.fillStyle = 'white';
    ctx.font = '28px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2.5);
  
    // Create the Start Over button
    const startOverButton = document.createElement('button');
    startOverButton.innerHTML = 'Start Over';
    startOverButton.style.width = '100px';
    startOverButton.style.height = '50px';
    startOverButton.style.position = 'absolute';
    startOverButton.style.left = (canvas.width / 2) - 50 + 'px';
    startOverButton.style.top = (canvas.height / 2) + 50 + 'px';
    document.body.appendChild(startOverButton);
  
    // Add an event listener to the Start Over button to restart the game
    startOverButton.addEventListener('click', function() {
      // Reset player's health
      health = 3;
  
      // Remove the game over screen and Start Over button
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      document.body.removeChild(startOverButton);
  
      // Restart the game loop
      gameLoop();
    });
  }

  if (health > 0) {
    window.requestAnimationFrame(render);
  }
}

render();