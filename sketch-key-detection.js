let fft, mic;
const noteFrequencies = {
  "C": 261.63, "C#": 277.18, "D": 293.66, "D#": 311.13, "E": 329.63,
  "F": 349.23, "F#": 369.99, "G": 392.00, "G#": 415.30, "A": 440.00,
  "A#": 466.16, "B": 493.88
};

// Major and Minor keys for detection
const majorKeys = {
  "C": ["C", "D", "E", "F", "G", "A", "B"],
  "D": ["D", "E", "F#", "G", "A", "B", "C#"],
  "E": ["E", "F#", "G#", "A", "B", "C#", "D#"],
  "F": ["F", "G", "A", "A#", "C", "D", "E"],
  "G": ["G", "A", "B", "C", "D", "E", "F#"],
  "A": ["A", "B", "C#", "D", "E", "F#", "G#"],
  "B": ["B", "C#", "D#", "E", "F#", "G#", "A#"]
};

const minorKeys = {
  "A": ["A", "B", "C", "D", "E", "F", "G"],
  "B": ["B", "C#", "D", "E", "F#", "G", "A"],
  "C": ["C", "D", "D#", "F", "G", "G#", "A#"],
  "D": ["D", "E", "F", "G", "A", "A#", "C"],
  "E": ["E", "F#", "G", "A", "B", "C", "D"],
  "F": ["F", "G", "G#", "A#", "C", "C#", "D#"],
  "G": ["G", "A", "A#", "C", "D", "D#", "F"]
};

function setup() {
  createCanvas(400, 200);
  textAlign(CENTER, CENTER);

  // Start microphone and set up Tone.js for pitch detection
  mic = new Tone.UserMedia().toDestination();
  mic.open().then(() => {
    fft = new Tone.FFT(1024);
    mic.connect(fft);
  });
}

function draw() {
  background(220);

  // Get the FFT data and identify the main frequency component
  const fftValues = fft.getValue();
  const freq = getDominantFrequency(fftValues);

  const note = getClosestNoteFromFrequency(freq);
  const key = estimateKey(note);

  textSize(16);
  text(`Frequency: ${freq.toFixed(2)} Hz`, width / 2, height / 2 - 20);
  text(`Note: ${note}`, width / 2, height / 2);
  text(`Estimated Key: ${key}`, width / 2, height / 2 + 20);
}

// Find the dominant frequency from FFT data
function getDominantFrequency(fftValues) {
  const nyquist = Tone.context.sampleRate / 2;
  let maxIndex = 0;
  let maxAmplitude = -Infinity;

  // Find the index with the highest amplitude
  for (let i = 0; i < fftValues.length; i++) {
    if (fftValues[i] > maxAmplitude) {
      maxAmplitude = fftValues[i];
      maxIndex = i;
    }
  }

  // Map the index to a frequency
  const freq = (maxIndex / fftValues.length) * nyquist;
  return freq;
}

// Find the closest note to the detected frequency
function getClosestNoteFromFrequency(freq) {
  let closestNote = null;
  let smallestDifference = Infinity;

  // Iterate through the notes to find the closest match
  for (let note in noteFrequencies) {
    let diff = Math.abs(noteFrequencies[note] - freq);
    if (diff < smallestDifference) {
      smallestDifference = diff;
      closestNote = note;
    }
  }
  return closestNote || "Unknown";
}

// Estimate the key by matching detected notes to major or minor keys
function estimateKey(note) {
  if (!note) return "Unknown";

  // Check major keys
  for (let key in majorKeys) {
    if (majorKeys[key].includes(note)) {
      return `${key} Major`;
    }
  }

  // Check minor keys
  for (let key in minorKeys) {
    if (minorKeys[key].includes(note)) {
      return `${key} Minor`;
    }
  }

  return "Unknown Key";
}