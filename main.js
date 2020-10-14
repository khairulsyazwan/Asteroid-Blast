const gameHeight = 700;
const gameWidth = 800;

const playerWidth = 40;
const playerHeight = 20;

let $gameContainer = document.querySelector(".game__container");
let $startPage = document.querySelector(".start__page");

// keyboard keycodes
const keyUp = 38;
const keyDown = 40;
const keyRight = 39;
const keyLeft = 37;
const keySpace = 32;

//player settings
const playerSpeed = 400;
// time before player can shoot laser again
const laserCooldownTime = 0.4;  
const laserSpeed = 400;


// asteroid settings
const asteroidsRow = 4;
const asteroidsPerRow = 7;
const asteroidsXPadding = 50;
const asteroidsYPadding =50;
const asteroidsXSpacing = (gameWidth - asteroidsYPadding * 2) / (asteroidsPerRow - 1);
const asteroidsYSpacing = 60;
// adjust for difficulty
let asteroidSpeed = 300;
let asteroidCooldown = 10;



let gameState = {
    playerXPos: 0,
    playerYPos: 0,
    keyLeftPressed: false,
    keyRightPressed: false,
    keyUpPressed: false,
    keyDownPressed: false,
    keySpacePressed: false,
    asteroids: [],
    lasers: [],
    asteroidShower: [],
    startTimeStamp: Date.now(),
    playerCoolDownTime: 0,
    playerLives: 5,
    gameOver: false,
    points: 0,
    startPageOpen: true,
    classicMode: false,
    endlessMode: false,
};


function startPage(){
    let startPage = document.querySelector(".start__page");
    startPage.style.display = "block";

    createPlayer($gameContainer);
}

function startGame() {
    // create asteroids
    for (let index = 0; index < asteroidsRow; index++) {
        let y = asteroidsYPadding + index * asteroidsYSpacing;
        for (let i = 0; i < asteroidsPerRow; i++) {
            let x = i * asteroidsXSpacing + asteroidsXPadding;
            createAsteroid($gameContainer, x, y);
        }
    }
}

function startEndless() {
    // endless mode. create asteroid shower only
    // sets asteroids off screen. laser disappears if y < 0
    let y = -50;
    for (let i = 1; i < 20; i++) {
        let x = i * 40;
        createAsteroid($gameContainer, x, y);
    }
    asteroidCooldown = 3;
    asteroidSpeed = 350;
}

function startGameBtn(e){
    startBtn = document.getElementById("startBtn");
    restartBtn = document.getElementById("restartBtn")
    if(e.target == startBtn){
        gameState.startPageOpen = false;
        gameState.classicMode = true;
        document.querySelector(".start__page").style.display = "none";
        const sound = new Audio("media/laser9.ogg");
        sound.play();
        startGame();
    }else if(e.target == restartBtn){
        document.querySelector(".game__over").style.display = "none";
        window.location.reload();
    }else if(e.target == restart2Btn){
        document.querySelector(".game__over").style.display = "none";
        window.location.reload();
    }else if(e.target == endlessBtn){
        gameState.startPageOpen = false;
        gameState.endlessMode = true;
        document.querySelector(".start__page").style.display = "none";
        const sound = new Audio("media/laser9.ogg");
        sound.play();
        startEndless();
    }
}


// updates the game
function gameLoop(e){
    let currentTimeStamp = Date.now();
    // divide by 1000 to get time in seconds
    let timeDifference = (currentTimeStamp - gameState.startTimeStamp) / 1000.0;

    if(gameState.gameOver == true){
        document.querySelector(".game__over").style.display = "block";
        const sound = new Audio("media/gameover.ogg");
        sound.play();
        return
    }
    
    if(gameState.asteroids.length === 0 && !gameState.startPageOpen){
        document.querySelector(".congrats").style.display = "block"
        const sound = new Audio("media/congrats.ogg");
        sound.play();
        return
    }

    let $gameContainer = document.querySelector(".game__container");
    movePlayer(timeDifference, $gameContainer);
    moveLaser(timeDifference, $gameContainer);
    moveAsteroids(timeDifference, $gameContainer)
    moveAsteroidShower(timeDifference, $gameContainer);

    gameState.startTimeStamp = currentTimeStamp;
    // self-invoked function
    window.requestAnimationFrame(gameLoop);
}

// create player & starting position
function createPlayer($gameContainer) {
    gameState.playerXPos = gameWidth / 2;
    gameState.playerYPos = gameHeight - 60;
    let $player = document.createElement("img");
    $player.src = "media/player.png";
    $player.classList.add("player");
    $gameContainer.appendChild($player);
    setPosition($player, gameState.playerXPos, gameState.playerYPos);
}

// create asteroid
function createAsteroid($gameContainer, x, y){
    let $asteroid = document.createElement("img");
    $asteroid.src = "media/asteroid.png";
    $asteroid.classList.add("asteroid");
    $gameContainer.appendChild($asteroid);
    let asteroid = {x, y, $asteroid, cooldown: rand(0.1, asteroidCooldown)};
    gameState.asteroids.push(asteroid);
    setPosition($asteroid, x, y);
}

// create asteroid shower
function createAsteroidShower($gameContainer, x, y){
    let $asteroidShower = document.createElement("img");
    $asteroidShower.src = "media/asteroid2.png";
    $asteroidShower.classList.add("asteroidShower");
    $gameContainer.appendChild($asteroidShower);
    let asteroid = {x, y, $asteroidShower};
    gameState.asteroidShower.push(asteroid);
    setPosition($asteroidShower, x, y);
}

// create laser
function createLaser($gameContainer, x, y){
    let $laser = document.createElement("img");
    $laser.src = "media/laser.png"
    $laser.classList.add("laser");
    $gameContainer.appendChild($laser);
    setPosition($laser, x, y);
    let laser = {x, y, $laser};
    gameState.lasers.push(laser);
    const sound = new Audio("media/laser.ogg");
    sound.play();
}

// set position of element
function setPosition(element, x, y) {
    element.style.transform = `translate(${x}px, ${y}px)`;
}


function rand(min, max) {
    if (min === undefined) min = 0;
    if (max === undefined) max = 1;
    return min + Math.random() * (max - min);
  }


// movement functions
function keypressDown(e) {
    if (e.keyCode == keyRight) {
        gameState.keyRightPressed = true;
    } else if (e.keyCode == keyLeft){
        gameState.keyLeftPressed = true;
    } else if (e.keyCode == keyUp){
        gameState.keyUpPressed = true;
    } else if (e.keyCode == keyDown){
        gameState.keyDownPressed = true;
    } else if (e.keyCode == keySpace){
        gameState.keySpacePressed = true;
    }
}

function keypressUp(e) {
    if (e.keyCode == keyRight) {
        gameState.keyRightPressed = false;
    } else if (e.keyCode == keyLeft){
        gameState.keyLeftPressed = false;
    } else if (e.keyCode == keyUp){
        gameState.keyUpPressed = false;
    } else if (e.keyCode == keyDown){
        gameState.keyDownPressed = false;
    } else if (e.keyCode == keySpace){
        gameState.keySpacePressed = false;
    }
}

// min- 0px max-(max height/width of game container)
function boundary(currentPos, min, max){
    if(currentPos > max){
        return max;
    }else if(currentPos < min){
        return min;
    }else {
        return currentPos;
    }
}

function movePlayer(timeDifference, $gameContainer){
    if (gameState.keyRightPressed == true) {
        gameState.playerXPos += timeDifference * playerSpeed;
    }else if (gameState.keyLeftPressed == true) {
        gameState.playerXPos -= timeDifference * playerSpeed
    }else if (gameState.keyUpPressed == true) {
        gameState.playerYPos -= timeDifference * playerSpeed
    }else if (gameState.keyDownPressed == true) {
        gameState.playerYPos += timeDifference * playerSpeed
    }

    let maxWidth = gameWidth - playerWidth;
    let maxHeight = gameHeight - (playerHeight * 4);

    gameState.playerXPos = boundary(gameState.playerXPos, playerWidth, maxWidth);
    gameState.playerYPos = boundary(gameState.playerYPos, playerHeight, maxHeight);

    let $player = document.querySelector(".player");
    setPosition($player, gameState.playerXPos, gameState.playerYPos);

    if(gameState.keySpacePressed && gameState.playerCoolDownTime <= 0){
        createLaser($gameContainer, gameState.playerXPos, gameState.playerYPos);
        gameState.playerCoolDownTime = laserCooldownTime;
    }
    if(gameState.playerCoolDownTime > 0){
        gameState.playerCoolDownTime -= timeDifference;
    }

};

function moveLaser(timeDifference, $gameContainer){
    let $laserArr = gameState.lasers;
    for (let index = 0; index < $laserArr.length; index++) {
        let laser = $laserArr[index];
        // y axis = 0 at top.
        laser.y -= timeDifference * laserSpeed;
        if (laser.y < 0){
            removeLaser($gameContainer, laser);
        }
        setPosition(laser.$laser, laser.x, laser.y);  
        let r1 = laser.$laser.getBoundingClientRect();
        let asteroids = gameState.asteroids;
        for (let index = 0; index < asteroids.length; index++) {
            const asteroid = asteroids[index];
            if (asteroid.isGone) continue;
            let r2 = asteroid.$asteroid.getBoundingClientRect();
            if (hitDetection(r1, r2)){
                removeLaser($gameContainer, laser);
                removeAsteroid($gameContainer, asteroid);
                gameState.points += 10;
                updateScore();
                break
                
            }
        }
        let asteroidShower = gameState.asteroidShower;
        for (let index = 0; index < asteroidShower.length; index++) {
            const asteroid = asteroidShower[index];
            if (asteroidShower.isGone) continue;
            let r2 = asteroid.$asteroidShower.getBoundingClientRect();
            if (hitDetection(r1, r2) && asteroidShower[index].y > 260 && gameState.classicMode){
                removeLaser($gameContainer, laser);
                removeAsteroidShower($gameContainer, asteroid);
                const sound = new Audio("media/explosion.ogg");
                sound.play();
                gameState.points += 20;
                updateScore();
                console.log(gameState.classicMode);
                break
            }
            if (hitDetection(r1, r2) && !gameState.classicMode){
                removeLaser($gameContainer, laser);
                removeAsteroidShower($gameContainer, asteroid);
                const sound = new Audio("media/explosion.ogg");
                sound.play();
                gameState.points += 20;
                updateScore();
                console.log(gameState.classicMode);
                break
            }
        }
    }
    // updates the array in gameState, to keep lasers that are not gone
    gameState.lasers = gameState.lasers.filter(laser => !laser.isGone);
    
}

function removeLaser($gameContainer, laser){
    $gameContainer.removeChild(laser.$laser);
    // set true, so we can update gameState array
    laser.isGone = true;
}


function moveAsteroids(timeDifference, $gameContainer) {
    const dx = Math.sin(gameState.startTimeStamp/ 1000.0) * 5;
  
    const asteroids = gameState.asteroids;
    for (let i = 0; i < asteroids.length; i++) {
      const asteroid = asteroids[i];
      const x = asteroid.x + dx;
      const y = asteroid.y + 0;
      setPosition(asteroid.$asteroid, x, y);
      if (!gameState.startPageOpen) {
        asteroid.cooldown -= timeDifference;
      }
    //   only creates asteroid shower when start page is not open
      if (asteroid.cooldown <= 0 && !gameState.startPageOpen) {
          createAsteroidShower($gameContainer, x, y);
          asteroid.cooldown = asteroidCooldown;
      }
    }
    gameState.asteroids = gameState.asteroids.filter(asteroid => !asteroid.isGone);
}

function removeAsteroid($gameContainer, asteroid){
    $gameContainer.removeChild(asteroid.$asteroid);
    // set true, so we can update gameState array
    asteroid.isGone = true;
    const sound = new Audio("media/explosion.ogg");
    sound.play();
}


// asteroid shower dependant on number of asteroids available
function moveAsteroidShower(timeDifference, $gameContainer) {
    const asteroids = gameState.asteroidShower;
    for (let i = 0; i < asteroids.length; i++) {
      const asteroid = asteroids[i];
      asteroid.y += timeDifference * asteroidSpeed;
      asteroid.x += Math.cos(timeDifference * rand(25, 500));
      if (asteroid.y >= gameHeight - 35 || asteroid.x >= gameWidth - 35){
          removeAsteroidShower($gameContainer, asteroid);
      }
      setPosition(asteroid.$asteroidShower, asteroid.x, asteroid.y);
      let r1 = asteroid.$asteroidShower.getBoundingClientRect();
      let player = document.querySelector(".player");
      let r2 = player.getBoundingClientRect();
      if(hitDetection(r1,r2)) {
          if (gameState.playerLives > 1) {
            removeAsteroidShower($gameContainer, asteroid);
            gameState.playerLives = gameState.playerLives - 1;
            const sound = new Audio("media/explosionPlayer.ogg");
            sound.play();
            removeLives();
            break
          }
          if (gameState.playerLives == 1) {
            removePlayer($gameContainer, player);
            break;
          }
      }

    }
    gameState.asteroidShower = gameState.asteroidShower.filter(asteroid => !asteroid.isGone);
}

function removeAsteroidShower($gameContainer, asteroid){
    $gameContainer.removeChild(asteroid.$asteroidShower);
    // set true, so we can update gameState array
    asteroid.isGone = true;
    // const sound = new Audio("media/explosion.ogg");
    // sound.play();
}


// remove player
function removePlayer($gameContainer, $player) {
    $gameContainer.removeChild($player);
    gameState.gameOver = true;
    const sound = new Audio("media/explosionPlayer.ogg");
    sound.play();
}

function removeLives() {
    let lives = document.querySelector(".lives > div:last-child")
    lives.remove();
}

// returns if true (not false),when rectangles intersect
// condition checks if cannot intersect, then reverse it
function hitDetection(r1, r2) {
    return !(
        r2.left > r1.right ||
        r2.right < r1.left ||
        r2.top > r1.bottom ||
        r2.bottom < r1.top
      );
}

function updateScore(){
    document.getElementById("current__score").innerHTML = `${gameState.points}`;
    document.querySelector(".finalScore").innerHTML = `YOUR SCORE: ${gameState.points}`;
    document.querySelector(".finalScore2").innerHTML = `YOUR SCORE: ${gameState.points}`;
}


function hoverSound(e) {
    let sbutton = document.getElementById("startBtn");
    let ebutton = document.getElementById("endlessBtn");
    let restartBtn = document.getElementById("restartBtn");
    let restart2Btn = document.getElementById("restart2Btn");
    
    if (e.target == sbutton || e.target == ebutton || e.target == restartBtn || e.target == restart2Btn ) {
        const sound = new Audio("media/forceField_000.ogg");
        sound.play();   
    }
}

startPage();
// startGame();
document.addEventListener("keydown", keypressDown);
document.addEventListener("keyup", keypressUp);
document.addEventListener("click", startGameBtn);
document.addEventListener("mouseover", hoverSound);
window.requestAnimationFrame(gameLoop);