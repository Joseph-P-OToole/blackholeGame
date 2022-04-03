
///////////////////////////////////////////
/////FUEL TARGET SETUP

class Refuel{
  constructor(d){
    this.src = './assets/images/Refuel.png';
    this.x = Math.random() * (1200 - 150) + 150;
    this.y = Math.random() * 50 - 200;
    this.width = Math.random() * 20 + 75;
    this.height = this.width;
    this.r = this.width - (this.width * 0.5621);//SQUARE PEG ROUND HOLE ADJUSTMENT
    this.speed = Math.random() * 4 + 2 * d;
    this.distance;
    this.driftX = 0;
    this.driftY = 1000;
    this.minDriftX = -100;
    this.maxDriftX = 1200;
    this.minDriftY = -100;
    this.maxDriftY = 1000;
    this.frame = 0;
    this.frameCounter = 0;
    this.frameHeight = 0;
    this.collision = false;
    this.counted = false;
    this.finalPos = false;
  }

  DriftMove(){
    //GET POS DIFFERENTIAL
    const dx = this.x - this.driftX;
    const dy = this.y - this.driftY;

    //CHECK POS & CONTROL SPEED
    if(gameFrame % 3 === 0) {
      if(this.driftX != this.x) {
        this.x -= (this.speed + dx)/200;
      }
      if(this.driftY != this.y) {
        this.y -= (dy - this.speed)/200;
      }
      if(this.y > 800 || this.y < -200 || this.x < -100 || this.x > 1300) {
        this.finalPos = true;
      }
      if((this.maxDriftY - this.y) < 400 && (this.minDriftX - this.x) < 20 && this.x < 300 && this.width > 0) {
        this.speed += 200;
        this.driftX = 0;
        this.driftY = 1000;
        this.height -= 1;
        this.width -= 1;
      }
    }
      this.ChangeImg(); 
  }

  Collect() {
    if (!this.counted) {
      fuelLevel++;
      this.collision = true;
      this.counted = true;
      countedFuelCans++;
      gameSoundEffect.src = './assets/effects/refuel1.wav';
      gameSoundEffect.volume = 0.2;
      gameSoundEffect.play();
    }
    this.counted = false;
  } 
  
  ChangeImg() {
    //CHANGING SPRITE CROP & CONTROL ANIMATION SPEED
    this.frameCounter++;
    if (this.frameCounter % 6 === 0){
      this.frame++;
    }
    if (this.frame >= 4) {
      this.frame = 0;
      this.frameHeight++;
    }
    if(this.frameHeight >= 4) {
      this.frameHeight = 0;
    }
  }

  Draw(){
    CTX.drawImage(REFUEL_IMG, this.frame * 100, this.frameHeight, 100, 100, this.x - this.r, this.y - this.r, this.width, this.height);
  }
}

const REFUEL = new Refuel();