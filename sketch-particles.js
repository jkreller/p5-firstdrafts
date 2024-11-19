let p;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  p = new Particle(width/2, height/2);
  //console.log(Math.sqrt(Math.pow(acc.x, 2)+Math.pow(acc.y, 2)));
}

function draw() {
  background(20);
  p.display();
  p.update();
}