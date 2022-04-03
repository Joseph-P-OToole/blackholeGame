
///////////////////////////////////////////
/////ASTEROID SETUP

class Projectile{
  constructor(d){
    this.src = './assets/images/Projectile.png';
    this.x = Math.random() * (1800 - 150) + 150;
    this.y = Math.random() * 100 - Math.random() * 400 - 200;
    this.diameter = Math.random() * 45 + 45;
    this.r = this.diameter - (this.diameter * 0.5269);//SQUARE PEG ROUND HOLE ADJUSTMENT 
    this.speed = Math.random() * 6 + 1 * d;
    this.distance;
    this.driftX = 0;
    this.driftY = 1000;
    this.minDriftX = -100;
    this.maxDriftX = 1800;
    this.minDriftY = -100;
    this.maxDriftY = 1000;
    this.frame = 0;
    this.frameCounter = 0;
    this.frameHeight = 0;
    this.collision = false;
    this.counted = false;
    this.finalPos = false;
    this.timeStamp;
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
      if(this.y > 800 || this.y < -800 || this.x < -100 || this.x > 1800) {
        this.finalPos = true;
      }
      if((this.maxDriftY - this.y) < 400 
      && (this.minDriftX - this.x) < 20
      && this.x < 300
      && this.r > 0) {
        this.driftX = 0;
        this.driftY = 850;
        this.speed += 200;
        this.diameter -= 3;
      }
    }
      this.ChangeImg(); 
  }
  
  AddDamage(dx, dy, c) {
    if(!this.counted) {
      this.timeStamp = gameTime;
      this.counted = true;
      lives--;
      impacts++;
      MouseUp();
      this.PlaySound('ROCKET');
    }
    if(gameTime - this.timeStamp > 1){
      this.counted = false;
    }
    ChangeDirection(dx, dy, c);
  }
  
  PlaySound(x) {
  if(x == 'ROCKET'){
    if(this.r > 22) {
        gameSoundEffect.src = './assets/effects/impact3.mp3';
        gameSoundEffect.play();
      }else{
        gameSoundEffect.src = './assets/effects/impact4.wav';
        gameSoundEffect.play();
      }
    }else{
      if(this.r > 22) {
        gameSoundEffect.src = './assets/effects/impact3.mp3';
        gameSoundEffect.volume = 0.2;
        gameSoundEffect.play();
      }else{
        gameSoundEffect.src = './assets/effects/impact4.wav';
        gameSoundEffect.volume = 0.2;
        gameSoundEffect.play();
      }
    }
  }

  ChangeImg() {
    //CHANGING SPRITE CROP & CONTROL ANIMATION SPEED
    this.frameCounter++;
    if (this.frameCounter % 5 === 0){
      this.frame++;
    }
    if (this.frame >= 4) {
      this.frame = 0;
      this.frameHeight++;
    }
    if(this.frameHeight >= 2) {
      this.frameHeight = 0;
    }
  }

  Draw(){
    CTX.drawImage(PROJECTILE_IMG, this.frame * 100, this.frameHeight, 100, 100, this.x - this.r, this.y - this.r, this.diameter, this.diameter);
  }
} 
const PROJECTILE = new Projectile();