// Get the modal
var modalContainer = document.getElementById("modalContainer");
var modal = document.getElementById("timeSettingModal");

// Get the button that opens the modal
var btn = document.getElementById("timeSettingButton");

// When the user clicks the button, open the modal
btn.onclick = function() {
  modalContainer.style.display = "flex";
}

// When the user clicks on <span> (x), close the modal
function closeTimeSettingModal() {
  modalContainer.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modalContainer) {
    modalContainer.style.display = "none";
  }
}

var timeLimitValue = 180; // Default to 3 minutes

function setTimeLimit() {
  var selectedTime = document.getElementById("timeLimit").value;
  timeLimitValue = parseInt(selectedTime) * 60; // Convert minutes to seconds
  alert("Time limit set to " + selectedTime + " minutes.");
  modalContainer.style.display = "none";
}

// Get the modal container for the About modal
var modalContainer2 = document.getElementById("modalContainer2");

// Function to show the About modal
function showAboutModal() {
  var aboutModal = document.getElementById("aboutModal");
  modalContainer2.style.display = "flex";
  aboutModal.style.display = "block";
}

// Function to close the About modal
function closeAboutModal() {
  var aboutModal = document.getElementById("aboutModal");
  modalContainer2.style.display = "none";
  aboutModal.style.display = "none";
}

// Add event listener to About button
var aboutButton = document.getElementById("aboutButton");
aboutButton.addEventListener("click", showAboutModal);

// Add event listener to Play button
var playButton = document.getElementById("playButton");
playButton.addEventListener("click", function() {
  console.log("Play button clicked"); // Debug log

  // Play the start sound
  var startSound = document.getElementById('gameStartSound');
  startSound.play();

  // Hide cover elements
  document.querySelector('.cover').style.display = 'none';
  // Show game area
  document.getElementById("gameArea").style.display = 'flex';
  // Show score and timer
  document.getElementById("score").style.display = 'block';
  document.getElementById("timer").style.display = 'block';
  // Change background image
  document.body.classList.add('game-active');
  // Initialize the game
  initGame();
});

// Inside your game loop or event handler
var score = 0; // Example score value
updateScore(score);

function updateScore(score) {
  document.getElementById("score").textContent = "Score: " + score;
}

// Timer function
function startTimer(duration) {
  var timer = duration, minutes, seconds;
  var timerInterval = setInterval(function() {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    document.getElementById("timer").textContent = "Time: " + minutes + ":" + seconds;

    if (--timer < 0) {
      clearInterval(timerInterval);
      endGame(); // Call end game function when timer reaches 0
    }
  }, 1000);
}

function endGame() {
  document.getElementById("gameArea").style.display = 'none';
  document.getElementById("hud").style.display = 'none';
  document.getElementById("gameOverModal").style.display = 'flex';
  document.getElementById("finalScore").textContent = score;

  var gameOverSound = document.getElementById("gameOverSound");
  gameOverSound.play();
}

function restartGame() {
  // Reload the page
  location.reload();
}

function initGame() {
  console.log("Game initialization started"); // Debug log
  // Game initialization code
  var canvas = document.getElementById('gameCanvas');
  var ctx = canvas.getContext('2d');

  // Load character images for different directions and frames
  var characterImages = {
    up: [new Image(), new Image(), new Image()],
    down: [new Image(), new Image(), new Image()],
    left: [new Image(), new Image(), new Image()],
    right: [new Image(), new Image(), new Image()]
  };

  // Ensure these images exist in the same directory
  characterImages.up[0].src = 'character10.jpg';
  characterImages.up[1].src = 'character11.jpg';
  characterImages.up[2].src = 'character12.jpg';

  characterImages.down[0].src = 'character7.jpg';
  characterImages.down[1].src = 'character8.jpg';
  characterImages.down[2].src = 'character9.jpg';

  characterImages.left[0].src = 'character4.jpg';
  characterImages.left[1].src = 'character5.jpg';
  characterImages.left[2].src = 'character6.jpg';

  characterImages.right[0].src = 'character1.jpg';
  characterImages.right[1].src = 'character2.jpg';
  characterImages.right[2].src = 'character3.jpg';

  var character = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 50,
    height: 50,
    dx: 0,
    dy: 0,
    speed: 2,
    direction: 'down', // Initial direction
    frameIndex: 0,
    frameTimer: 0,
    frameInterval: 10, // Adjust for animation speed
    images: characterImages
  };

  // Ensure all images are loaded before starting the game loop
  let imagesLoaded = 0;
  let totalImages = 12;
  for (let direction in characterImages) {
    for (let img of characterImages[direction]) {
      img.onload = function() {
        imagesLoaded++;
        if (imagesLoaded === totalImages) {
          console.log("All character images loaded"); // Debug log
          gameLoop();
          startTimer(timeLimitValue); // Start the timer with the set time limit
        }
      }
    }
  }

  // Worm object definition
  var wormImage = new Image();
  wormImage.src = 'worm.jpg'; // Ensure this image exists in the same directory
  var worms = [];
  var wormLifeStages = [
    { stage: 1, duration: 4000 }, // Stage 1: 4 seconds
    { stage: 2, duration: 5000 }, // Stage 2: 5 seconds
    { stage: 3, duration: 3000 }, // Stage 3: 3 seconds
    { stage: 4, duration: 0 }     // Stage 4: 0 seconds (disappears)
  ];
  
  for (var i = 0; i < 20; i++) { // More worms
    worms.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      width: 30,
      height: 30,
      speed: 1,
      direction: Math.random() * 2 * Math.PI, // Random direction in radians
      radius: 5,
      stage: 0,
      timer: 0,
      color: "#F4A460", // Sand color for initial stage
      maxRadius: 15 // Maximum radius for the worm
    });
  }

  function drawCharacter() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let currentFrame = character.images[character.direction][character.frameIndex];
    ctx.drawImage(currentFrame, character.x, character.y, character.width, character.height);

    // Draw worms
    for (let worm of worms) {
      if (worm.stage !== 3) { // Only draw if not in disappearing stage
        ctx.beginPath();
        ctx.arc(worm.x, worm.y, worm.radius, 0, Math.PI, true); // Draw semi-circle upwards
        ctx.fillStyle = worm.color;
        ctx.fill();
        ctx.closePath();
      }
    }
  }

  function updateCharacterPosition() {
    character.x += character.dx;
    character.y += character.dy;
    // Prevent character from moving out of canvas bounds
    if (character.x < 0) character.x = 0;
    if (character.y < 0) character.y = 0;
    if (character.x + character.width > canvas.width) character.x = canvas.width - character.width;
    if (character.y + character.height > canvas.height) character.y = canvas.height - character.height;

    // Update animation frame
    if (character.dx !== 0 || character.dy !== 0) {
      character.frameTimer++;
      if (character.frameTimer >= character.frameInterval) {
        character.frameTimer = 0;
        character.frameIndex = (character.frameIndex + 1) % 3; // Cycle through 3 frames
      }
    } else {
      character.frameIndex = 0; // Reset to standing frame when not moving
    }

    // Update worms position and lifecycle
    for (let worm of worms) {
      worm.x += Math.cos(worm.direction) * worm.speed;
      worm.y += Math.sin(worm.direction) * worm.speed;
      
      // Change direction if the worm hits the canvas edge
      if (worm.x < 0 || worm.x + worm.width > canvas.width) worm.direction = Math.PI - worm.direction;
      if (worm.y < 0 || worm.y + worm.height > canvas.height) worm.direction = -worm.direction;

      // Update worm lifecycle
      worm.timer += 16.67; // Assuming 60fps, approximately 16.67ms per frame
      if (worm.timer >= wormLifeStages[worm.stage].duration) {
        worm.stage = (worm.stage + 1) % wormLifeStages.length;
        worm.timer = 0;

        // Stage-specific updates
        if (worm.stage === 0) {
          worm.x = Math.random() * canvas.width;
          worm.y = Math.random() * canvas.height;
        } else if (worm.stage === 1) {
          worm.color = "#F4A460"; // Sand color
          worm.radius = 5;
        } else if (worm.stage === 2) {
          worm.color = "#A0522D"; // Darker color for worm
          worm.radius = 10;
        } else if (worm.stage === 3) {
          worm.radius = 15; // Max size before disappearing
        }
      } else {
        // Radius adjustments based on stage
        if (worm.stage === 1) {
          worm.radius += 0.1; // Increase radius in stage 1
          if (worm.radius > worm.maxRadius) worm.radius = worm.maxRadius;
        } else if (worm.stage === 2) {
          worm.radius -= 0.1; // Decrease radius in stage 2
          if (worm.radius < 5) worm.radius = 5;
        }
      }
    }
  }

  function handleKeyDown(e) {
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
        character.dy = -character.speed;
        character.direction = 'up';
        break;
      case 'ArrowDown':
      case 's':
        character.dy = character.speed;
        character.direction = 'down';
        break;
      case 'ArrowLeft':
      case 'a':
        character.dx = -character.speed;
        character.direction = 'left';
        break;
      case 'ArrowRight':
      case 'd':
        character.dx = character.speed;
        character.direction = 'right';
        break;
      case ' ':
        catchWorm();
        break;
    }
  }

  function handleKeyUp(e) {
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'ArrowDown':
      case 's':
        character.dy = 0;
        break;
      case 'ArrowLeft':
      case 'a':
      case 'ArrowRight':
      case 'd':
        character.dx = 0;
        break;
    }
  }

  function catchWorm() {
    let catchAttempt = false; // Flag to track if a catch attempt was made
    for (let i = worms.length - 1; i >= 0; i--) {
      let worm = worms[i];
      if (worm.stage === 2 && character.x < worm.x + worm.width &&
          character.x + character.width > worm.x &&
          character.y < worm.y + worm.height &&
          character.y + character.height > worm.y) {
        // Remove caught worm and update score
        worms.splice(i, 1);
        worms.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          width: 30,
          height: 30,
          speed: 1,
          direction: Math.random() * 2 * Math.PI,
          radius: 5,
          stage: 0,
          timer: 0,
          color: "#F4A460",
          maxRadius: 15
        });
        score++;
        updateScore(score);
        // Play the catch sound
        var catchSound = document.getElementById('catchSound');
        catchSound.play();
        catchAttempt = true; // Set flag to true since a catch attempt was successful
      }
    }
    // If no catch attempt was successful, play the fail sound
    if (!catchAttempt) {
      var failSound = document.getElementById('failSound');
      failSound.play();
    }
  }

  function gameLoop() {
    updateCharacterPosition();
    drawCharacter();
    requestAnimationFrame(gameLoop);
  }

  // Event listeners for key presses
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);

  console.log("Game loop started"); // Debug log
}
