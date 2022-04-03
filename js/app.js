
///////////////////////////////////////////////////////////////
///// ANIMATION FRAME SETUP

(function () {
  let requestAnimationFrame = window.requestAnimationFrame
  || window.mozRequestAnimationFrame
  || window.webkitRequestAnimationFrame
  || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 800;

///////////////////////////////////////////////////////////////
///// CANVAS & CURSOR SETUP

const CANVAS = document.querySelector('#animationCanvas');
const CTX = CANVAS.getContext('2d');
CANVAS.width = CANVAS_WIDTH;
CANVAS.height = CANVAS_HEIGHT;
let canvasPosition =  CANVAS.getBoundingClientRect();

const MOUSE = {
  x: canvasPosition.width/2,
  y: canvasPosition.height/2,
  click: false
}

const KEYACTIVE = {
  ArrowDownActive: false,
  ArrowUpActive: false,
  ArrowLeftActive: false,
  ArrowRightActive: false,
  SpaceActive: false
}

//ADJUST POSITION ON RESIZE
window.addEventListener('resize', function() {
  canvasPosition = CANVAS.getBoundingClientRect();
})

///////////////////////////////////////////////////////////////
///// EVENT LISTENER SETUP MOUSE CONTROL

CANVAS.addEventListener('mousedown', (event) => {
  MouseDown(event);
});

CANVAS.addEventListener('mousemove', (event) => {
  MouseMove(event);
});

CANVAS.addEventListener('mouseup', function() {
  MouseUp();
});

///////////////////////////////////////////////////////////////
///// EVENT LISTENER SETUP TOUCH CONTROL

CANVAS.addEventListener('touchstart', (event) => {
  MouseDown(event);
});

CANVAS.addEventListener('touchmove', (event) => {
  MouseMove(event);
});

CANVAS.addEventListener('touchend', function() {
  MouseUp();
});

///////////////////////////////////////////////////////////////
//// EVENT LISTENER SETUP KEY CONTROL
let keyControlActive = false;
document.addEventListener('keydown', function(e) {
  KeyControl(e);
})

document.addEventListener('keyup', function(e) {
  switch (e.key) {
    case ('ArrowDown'): {
      MOUSE.y = ROCKET.y;
      MOUSE.x = ROCKET.x;
      KEYACTIVE.ArrowDownActive = false;
      break;
    }
    case ('ArrowRight'): {
      MOUSE.y = ROCKET.y;
      MOUSE.x = ROCKET.x;
      KEYACTIVE.ArrowRightActive = false;
      break;
    }
    case ('ArrowLeft'): {
      MOUSE.y = ROCKET.y;
      MOUSE.x = ROCKET.x;
      KEYACTIVE.ArrowLeftActive = false;
      break;
    }
    case ('ArrowUp'): {
      MOUSE.y = ROCKET.y;
      MOUSE.x = ROCKET.x;
      KEYACTIVE.ArrowUpActive = false;
      break;
    }
    case (' '): {
      MOUSE.y = ROCKET.y;
      MOUSE.x = ROCKET.x;
      KEYACTIVE.SpaceActive = false;
      keyHold = false;
      MouseUp();
      break;
    }
    default: {
      console.log(e.key)
    }
  }
})

///////////////////////////////////////////////////////////////
///// GLOBAL VARS

const ROCKET_IMG = new Image();
ROCKET_IMG.src = ROCKET.src;
const PROJECTILE_IMG = new Image();
PROJECTILE_IMG.src = PROJECTILE.src;
const REFUEL_IMG = new Image();
REFUEL_IMG.src = REFUEL.src;
let backgroundMusic = document.querySelector('#music');
let gameSoundEffect = document.querySelector('#gameSoundEffect');
let cover = document.querySelector('#cover');//HIDES HUD FLASH ON LOAD
let startScreen = document.querySelector('#startScreen');
let rulesScreen = document.querySelector('#rulesScreen');
let startScreenTyper = document.querySelector('#startScreenTyper');
let endScreen = document.querySelector('#endScreen');
let endStats = document.querySelector('#endStats');
let finalScore = document.querySelector('#finalScore');
let difficulty = 1;
let projectiles = [];
let projectilesQty;
let refuels = [];
let refuelQty;
let fuelLevel = 5;
let keyHold;
let burned = false;
let burnTimer;
let burnTime;
let HUDLevel = document.querySelector('#level');
let gameTime = 0;
let score = 0;
let HUDscore = document.querySelector('#score');
let lives = 3;
let impacts = 0;
let countedFuelCans = 0;
let HUDlives = document.querySelector('#lives');
let gameFrame = 0;
let startGame = false;
let startScreenOpen = false;
let rulesScreenOpen = false;
let endGame = false;

///////////////////////////////////////////////////////////////
///// FUNCTIONS

ToggleStartScreen();

//RESET VARIABLES ON EACH GAME START
function StartGame() {
  startScreen.setAttribute('style', 'display: none;');
  startScreen.remove();
  rulesScreen.setAttribute('style', 'display: none;');
  endScreen.setAttribute('style','display: inital;');
  startGame = true;
  endGame = false;
  ROCKET.ending = false;
  ROCKET.width = 100;
  ROCKET.height = 200;
  score = 0;
  lives = 3;
  refuelQty = 1;
  projectilesQty = 5;
  projectiles = [];
  fuelLevel = 5;
  refuels = [];
  gameTime = 0;
  time = 0;
  impacts = 0;
  countedFuelCans = 0;
  difficulty = 1;
}

//KILL GAME AND DISPLAY STATS
function EndGame() {
  ROCKET.width = 0;
  ROCKET.height = 0;
  endGame = true;
  endScreen.setAttribute('style','display: inline');
  endStats.innerHTML = 'HIGHEST LEVEL: ' + difficulty;
  endStats.innerHTML += '<br>SCORE: ' + score;
  endStats.innerHTML += '<br>IMPACTS: ' + impacts;
  endStats.innerHTML += '<br>TIMES REFUELED: ' + countedFuelCans;
  endStats.innerHTML += '<br>TOTAL TIME: ' + Math.floor(gameTime / 10) + 's';
}

function ToggleStartScreen() {
  if(startScreenOpen == false){
    startScreen.setAttribute('style','display: inline;')
    startScreenOpen = true;
  }
  else {
    startScreen.setAttribute('style', 'display: inital;');
    startScreenOpen = false;
  }
}

function ToggleRulesScreen() {
  if(rulesScreenOpen == false) {
    rulesScreen.setAttribute('style','display: inline;')
    rulesScreenOpen = true;
    if(startScreenOpen == true) {
      ToggleStartScreen();
    }
  }
  else {
    rulesScreen.setAttribute('style', 'display: inital;');
    rulesScreenOpen = false;
    if(startScreenOpen == false) {
      ToggleStartScreen();
    }
  }
}

//TRACK TIME, POINTS AND CONTROL DIFFICULTY
let time = setInterval(tick, 100);
function tick() {
  if(startGame == true && endGame != true){
    time++;
    gameTime++;
    //DELAY projectiles
    if(time % 2 == 0) {
      CreateProjectiles();
      CreateRefuels();
    }
    //AVOID CLUMPING ON START
    if(gameTime == 50) {
      projectilesQty += 2;
      refuelQty += 1;
    }
    //LEVEL UP
    if(time === 600) {
      time = 0
      difficulty++;
      projectilesQty = 8 * difficulty;
      refuelQty += difficulty;
      lives = 3;
    }
  }

  //ON GAME START AND RESTART
  if(gameTime > 0 && gameTime <= 1) {
    backgroundMusic.src = './assets/music/backgroundMusic.mp3';
    backgroundMusic.volume = 0.02;
    backgroundMusic.play();
    ROCKET.x = CANVAS_WIDTH/2;
    ROCKET.y = CANVAS_HEIGHT/2;
  }
  if(gameTime === 660) {
    backgroundMusic.src = './assets/music/backgroundMusic2.mp3';
    backgroundMusic.volume = 0.02;
    backgroundMusic.play();
  }
  if(gameTime === 2035) {
    backgroundMusic.src = './assets/music/backgroundMusic.mp3';
    backgroundMusic.volume = 0.02;
    backgroundMusic.play();
  }
}

//START CLICK DURATION LIMIT
function BurnFuel() {
  burnTimer = setInterval(Burn, 1000);
  burnTime = 5;
}

//LIMIT
function Burn() {
  burnTime--;
  if(burnTime === 0){
    burned = true;
    MouseUp();
  }
}

//PLAYER CONTROL EVENTS
function MouseDown(event) {
  if(fuelLevel > 0 && !burned && lives > 0) {
    BurnFuel();
    MOUSE.click = true;
    MOUSE.x = event.x - canvasPosition.left;
    MOUSE.y = event.y - canvasPosition.top;
    fuelLevel--;
  }else{ MouseUp();}
}

function MouseMove(event) {
  if(MOUSE.click && !burned && !keyHold){
    MOUSE.x = event.x - canvasPosition.left;
    MOUSE.y = event.y - canvasPosition.top;
  }else{MouseUp();}
}

function MouseUp() {
  MOUSE.click = false;
  burned = false;
  clearInterval(burnTimer);
  MOUSE.x = canvasPosition.left;
  MOUSE.y = canvasPosition.top;
}

function KeyControl(e) {
  switch (e.key) {
    case (' '): { // SPACEBAR
      KEYACTIVE.SpaceActive = true;
      if(!keyHold) {
        keyHold = true;
        BurnFuel();
      }
      if(!burned && KEYACTIVE.SpaceActive) {
        MOUSE.y = ROCKET.y;
        MOUSE.x = ROCKET.x;
        MOUSE.click = true;
        ROCKET.Move(MOUSE.x, MOUSE.y);
      }
      break;
    }
    case ('ArrowDown'): {
      KEYACTIVE.ArrowDownActive = true;
      if(KEYACTIVE.ArrowDownActive && MOUSE.click) {
        MOUSE.y = ROCKET.y;
        MOUSE.x = ROCKET.x;
        if(ROCKET.y < CANVAS.height - 50) {
          MOUSE.y += 125;
          ROCKET.Move(MOUSE.x, MOUSE.y);
        }
      }
      break;
    }
    case ('ArrowRight'): {
      KEYACTIVE.ArrowRightActive = true;
      if(KEYACTIVE.ArrowRightActive && MOUSE.click) {
        MOUSE.y = ROCKET.y;
        MOUSE.x = ROCKET.x;
        
        if(ROCKET.x < CANVAS.width - 50) {
          MOUSE.x += 125;
          ROCKET.Move(MOUSE.x, MOUSE.y);
        }
      }
      break;
    }
    case ('ArrowLeft'): {
      KEYACTIVE.ArrowLeftActive = true;
      if(KEYACTIVE.ArrowLeftActive && MOUSE.click) {
        MOUSE.y = ROCKET.y;
        MOUSE.x = ROCKET.x;
        
        if(ROCKET.x > 50){
          MOUSE.x -= 125;
          ROCKET.Move(MOUSE.x, MOUSE.y);
        }
      }
      break;
    }
    case ('ArrowUp'): {
      KEYACTIVE.ArrowUpActive = true;
      if(KEYACTIVE.ArrowUpActive && MOUSE.click) {
        MOUSE.y = ROCKET.y;
        MOUSE.x = ROCKET.x;
        if(ROCKET.y > 50){
          MOUSE.y -= 125;
          ROCKET.Move(MOUSE.x, MOUSE.y);
        }
      }
      break;
    }
    default: {
      break
    }
  }
}

//CREATE GAME COMPONENTS
function CreateProjectiles() {
  if(projectiles.length < projectilesQty){
      let projectile = new Projectile(difficulty);
      projectiles.splice(0, 0, projectile);
  }
}

function CreateRefuels() {
  if(refuels.length < refuelQty){
    let refuel = new Refuel(difficulty);
    refuels.splice(0, 0, refuel);
  }
}

//MAIN GAME LOOP
function Update() {
  score = gameTime * difficulty;
  HUDscore.innerHTML = "SCORE: " + score;
  HUDLevel.innerHTML = "LEVEL: " + difficulty;
  CTX.clearRect(0, 0, 1200, 800);
  if(gameTime >= 1 && startGame == true && endGame != true){
    Move();
    Draw();
  }
  DrawLives(lives);
  DrawFuelLevel(fuelLevel);
  requestAnimationFrame(Update);
  gameFrame++;
}

//DRAW ALL COMPONENTS
function Draw() {
  ROCKET.Draw();
  if(projectiles.length > 0) 
    projectiles.forEach(projectile => {
      if(projectile != null && projectile != undefined)
        projectile.Draw();
    });
  if(refuels.length > 0)
    refuels.forEach(refuel => {
      if(refuel != null && refuel != undefined)
        refuel.Draw();
    });
}

//MOVE OR REMOVE
function Move(){
  if(MOUSE.click){
    ROCKET.Move(MOUSE.x, MOUSE.y);
  }
  if(!MOUSE.click){
    ROCKET.DriftMove()
  }
  ProjectileMoveCheck();
  RefuelMoveCheck();
}

//COLLISION (component1, component2)
function CheckCircularCollision(a, b) {
  let dx = a.x - b.x;
  let dy = a.y - b.y;
  
  //OPTIMIZE
  if(a.x > -100 && a.y > -100 && dx < 100 && dy < 100 && dx > -100 && dy > -100 ) {
    let squareDistance = Math.sqrt(dx * dx + dy * dy);
    if(squareDistance < a.r + b.r) {
      ChangeDirection(dx, dy, a);
      ChangeOppositeDirection(dx, dy, b);
    }
  }  
}

//(component1, component2, component1 name)
function CheckRocketCollision(a, b, c) {
  let dx = a.x - b.x;
  let dy = a.y - b.y;
  //OPTIMIZE
  if(c === 'BLACKHOLE' || dx < 100 && dy < 100 && dx > -100 && dy > -100) {
    let squareDistance = Math.sqrt(dx * dx + dy * dy);
    
    if(squareDistance < a.r + b.r) {
      if(c === 'PROJECTILE') {
        Bump(dx, dy, a);
        a.AddDamage(dx, dy, a);
      }
      if(c === 'REFUEL') {
        a.Collect();
      }
      if(c === 'BLACKHOLE') {
        ROCKET.SetGameOver();
      }
    }
  }  
}

//BUMP AWAY FROM IMPACT AVOIDS EXCESSIVE ROCKET COLLISION (distance, distance, component)
function Bump(dx, dy, c) {
  if(dx > 0){
    c.x += c.r/4;
  }
  if(dx < 0){
    c.x -= c.r/4;
  }
  if(dy > 0){
    c.y += c.r/4;
  }
  if(dy < 0){
    c.y -= c.r/4;
  }
}

//CHANGE FINAL DESTINATION
function ChangeDirection(a, b, c) {
  if(a > 0){
    c.driftX = c.maxDriftX + Math.random() * 10 + Math.random() * 10;
  }
  if(a < 0){
    c.driftX = c.minDriftX - Math.random() * 10 - Math.random() * 10;
  }
  if(b > 0){
    c.driftY = c.maxDriftY + Math.random() * 10 + Math.random() * 10;
  }
  if(b < 0){
    c.driftY = c.minDriftY - Math.random() * 10 - Math.random() * 10;
  }
}

function ChangeOppositeDirection(a, b, c) {
  if(a < 0){
    c.driftX = c.maxDriftX + Math.random() * 10 + Math.random() * 10;
  }
  if(a > 0){
    c.driftX = c.minDriftX - Math.random() * 10 - Math.random() * 10;
  }
  if(b < 0){
    c.driftY = c.maxDriftY + Math.random() * 10 + Math.random() * 10;;
  }
  if(b > 0){
    c.driftY = c.minDriftY - Math.random() * 10 - Math.random() * 10;
  }
}

function ProjectileMoveCheck() {
  for(let i = 0; i < projectiles.length; i++) {
    //MOVE ALL
    projectiles[i].DriftMove(difficulty, i);
    //CHECK WITH ROCKET
    CheckRocketCollision(projectiles[i], ROCKET, 'PROJECTILE');
    //CHECK WITH OTHERS
    for(let j = 0; j < projectiles.length; j++){
      if(i === j){
        continue;
      } CheckCircularCollision(projectiles[i], projectiles[j]);
    }
    if(projectiles[i].finalPos){
      projectiles[i] = null;
      projectiles.splice(i, 1);
      i--;
      CreateProjectiles();
    }
  }
}

function RefuelMoveCheck() {
  for(let i = 0; i < refuels.length; i++) {
    //MOVE ALL
    if(refuels[i] != null && refuels[i] != undefined) {
      refuels[i].DriftMove(difficulty, i);
      //CHECK WITH ROCKET
      CheckRocketCollision(refuels[i], ROCKET, 'REFUEL');
      //CHECK WITH projectiles
      if(refuels[i] != null && refuels[i] != undefined) 
        for(let j = 0; j < projectiles.length; j++) {
          if(j < refuels.length && j != i) {
            CheckCircularCollision(refuels[j], refuels[i]);
          }
          CheckCircularCollision(projectiles[j], refuels[i]);
        }
      if(refuels[i] != null && refuels[i] != undefined) 
        if(refuels[i].collision || refuels[i].finalPos) {
          CreateRefuels();
          refuels.splice(i, 1);
          i--;   
        }
    } 
  }
}

//DRAW ROCKET ICONS FOR AVAILABLE LIVES
function DrawLives(l) {
  for(let i = 0; i <= 3; i++) {
    if(i <= l){
      CTX.drawImage(ROCKET_IMG, 0, 400, 100, 200, (CANVAS_WIDTH) - i * 50, CANVAS_HEIGHT - 100, 50, 100);
    }
    CTX.drawImage(ROCKET_IMG, 100, 400, 100, 200, (CANVAS_WIDTH) - i * 50, CANVAS_HEIGHT - 100, 50, 100);
  }
}

//DRAW FUEL ICON AND UPDATES FUEL LEVEL
function DrawFuelLevel(f) {
  CTX.drawImage(REFUEL_IMG, 0, 0, 100, 100, (CANVAS_WIDTH) - 160, CANVAS_HEIGHT - 200, 100, 100);
  CTX.beginPath();
  CTX.font = "35px Play";
  CTX.fillStyle = "white";
  CTX.fillText('x '+ f, (CANVAS_WIDTH) - 70, CANVAS_HEIGHT - 125,);
}

///////////////////////////////////////////////////////////////
///// ONLOAD EVENT LISTENER
window.addEventListener("load", function () {
  Update();
  cover.setAttribute('style', 'display: none');
});