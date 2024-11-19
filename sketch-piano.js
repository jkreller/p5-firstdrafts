let mic;
let frequencies = [
  { freq: [20, 200], color: [255, 0, 0] },     // Low frequencies (bass) - Red
  { freq: [200, 1000], color: [0, 255, 0] },   // Mid frequencies - Green
  { freq: [1000, 4000], color: [0, 0, 255] },  // High frequencies - Blue
];

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  mic = new p5.AudioIn();

  fft = new p5.FFT();
  fft.setInput(mic); 
}

function draw() {
  noStroke();
  fill('white');

  fft.analyze();

  let red = fft.getEnergy(frequencies[0].freq[0], frequencies[0].freq[1]);
  let green = fft.getEnergy(frequencies[1].freq[0], frequencies[1].freq[1]);
  let blue = fft.getEnergy(frequencies[2].freq[0], frequencies[2].freq[1]);
  console.log(mic.getLevel());
  //let intensity = map(amplitude, 0, 255, 0, 1);
  background(red, green, blue);
  
  //circle(window.innerWidth/2, window.innerHeight/2, 100+mic.getLevel()*2500)
}

function mousePressed() {
  mic.start();
}