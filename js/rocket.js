
///////////////////////////////////////////
/////PLAYER SETUP

class Rocket {
  constructor() {
    this.src = './assets/images/RocketShip.png';
    this.x = 0;
    this.y = 0;
    this.driftX = 0;
    this.driftY = 900;
    this.angle = 0;
    this.frame = 0;
    this.frameCounter = 0;
    this.frameHeight = 0;
    this.width = 75;
    this.height = 175;
    this.r = 30;
    this.ending = false;
  }

  //WHILE CLICKED
  Move(x, y) {
    //GET POS DIFFERENTIAL
    const dx = this.x - MOUSE.x;
    const dy = this.y - MOUSE.y;

    let theta = Math.atan2(dy, dx);
    this.angle = theta -89.60;
    
    //CHECK POS & CONTROL SPEED
    if(x != this.x) {
      this.x -= dx/25;
    }
    if(y != this.y) {
      this.y -= dy/25;
    }
    this.ChangeImg();

    if(this.x - BLACKHOLE.x < 300 && BLACKHOLE.y - this.y < 300)
    CheckRocketCollision(this, BLACKHOLE, 'BLACKHOLE');
  }

  //WHILE NOT CLICKED
  DriftMove() {
    //GET POS DIFFERENTIAL
    const dx = this.x - this.driftX;
    const dy = this.y - this.driftY;
    
    //CHECK POS & CONTROL SPEED
    if(this.driftX != this.x) {
      this.x -= dx/400;
    }
    if(this.driftY != this.y) {
      this.y -= dy/400;
    }
    this.angle += 0.01;
    this.ChangeImg();
    
    if(this.x - BLACKHOLE.x < 300 && BLACKHOLE.y - this.y < 300)
    CheckRocketCollision(BLACKHOLE, ROCKET, 'BLACKHOLE');
  }

   //GOES IN HOLE
  SetGameOver() { 
    if(!this.ending){
      gameSoundEffect.src = './assets/effects/gameover.wav';
      gameSoundEffect.play();
      this.ending = true;
      MouseUp();
    }
    lives = -1;
    if(this.width > 0){
      this.width -= 0.5;
      this.height--;
    }
    this.driftX--;
    this.driftY++;
    this.angle += 0.3;

    //END GAME
    if(this.x - BLACKHOLE.x < 100 && BLACKHOLE.y - this.y < 100) {
      EndGame();
    }
  }
  
  ChangeImg() {
    //CHANGING SPRITE CROP DIMENSIONS & CONTROLLING ANIMATION SPEED
    this.frameCounter++;
    if (this.frameCounter % 2 === 0){ 
      this.frame++;  
    }
    if (this.frame >= 4) {
      this.frame = 0;
    }
  }

  Draw() {
    //DRAW ROCKET BASED ON CURRENT ROCKET POS/ CLICK STATE/ BURN TIME
    CTX.save();
    CTX.translate(this.x, this.y);
    CTX.rotate(this.angle);
    //MOVING
    if(MOUSE.click && burnTime > 2){
      CTX.drawImage(ROCKET_IMG, 100 * this.frame, this.frameHeight, 100, 200, 0 - 50, 0 - 50, this.width, this.height);
    }
    //RUNNING OUT
    if(MOUSE.click && burnTime <= 2){
      CTX.drawImage(ROCKET_IMG, 100 * this.frame, 200 + this.frameHeight, 100, 200, 0 - 50, 0 - 50, this.width, this.height);
    }
    //DRIFTING
    if(!MOUSE.click){
      CTX.drawImage(ROCKET_IMG, 100, this.frameHeight + 200, 100, 200, 0 - 50, 0 - 50, this.width, this.height);
    }
    CTX.restore();
  }
}
const ROCKET = new Rocket();