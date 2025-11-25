const audio = document.getElementById("audioPlayer");
const fileInput = document.getElementById("sound");
const highpassCheck = document.getElementById("highpass");
const lowpassCheck = document.getElementById("lowpass");
const bandpassCheck = document.getElementById("bandpass");
const highshelfCheck = document.getElementById("highshelf");
const lowshelfCheck = document.getElementById("lowshelf");
const oscillatorCheck = document.getElementById("oscillator");

var highpassSlide = document.getElementById("highpassGain");
var highpassGain = highpassSlide.value;
var highpassValue = document.getElementById("highpassValue");
highpassValue.innerHTML = highpassSlide.value;

var lowpassSlide = document.getElementById("lowpassGain");
var lowpassGain = lowpassSlide.value;
var lowpassValue = document.getElementById("lowpassValue");
lowpassValue.innerHTML = lowpassSlide.value;

var bandpassSlide = document.getElementById("bandpassGain");
var bandpassGain = bandpassSlide.value;
var bandpassValue = document.getElementById("bandpassValue");
bandpassValue.innerHTML = bandpassSlide.value;

var highshelfSlide = document.getElementById("highshelfGain");
var highshelfGain = highshelfSlide.value;
var highshelfValue = document.getElementById("highshelfValue");
highshelfValue.innerHTML = highshelfSlide.value;

var lowshelfSlide = document.getElementById("lowshelfGain");
var lowshelfGain = lowshelfSlide.value;
var lowshelfValue = document.getElementById("lowshelfValue");
lowshelfValue.innerHTML = lowshelfSlide.value;

var oscillatorSlide = document.getElementById("oscillatorFreq");
var oscillatorFreq = oscillatorSlide.value;
var oscillatorValue = document.getElementById("oscillatorValue");
oscillatorValue.innerHTML = oscillatorSlide.value;
var oscillatorWave = document.getElementById("wave");

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const source = audioCtx.createMediaElementSource(audio);
const analyser = audioCtx.createAnalyser();
const distortion = audioCtx.createWaveShaper();
const gainNode = audioCtx.createGain();

// handle each filter independently of each other
const highpassFilter = audioCtx.createBiquadFilter(); highpassFilter.type = "allpass";
const lowpassFilter  = audioCtx.createBiquadFilter(); lowpassFilter.type  = "allpass";
const bandpassFilter = audioCtx.createBiquadFilter(); bandpassFilter.type = "allpass";
const lowshelfFilter = audioCtx.createBiquadFilter(); lowshelfFilter.type = "allpass";
const highshelfFilter = audioCtx.createBiquadFilter(); highshelfFilter.type = "allpass";

// handle each effect
const oscillator = audioCtx.createOscillator();

source.connect(analyser);
analyser.connect(distortion);
distortion.connect(highpassFilter);
highpassFilter.connect(lowpassFilter);
lowpassFilter.connect(bandpassFilter);
bandpassFilter.connect(lowshelfFilter);
lowshelfFilter.connect(highshelfFilter);
highshelfFilter.connect(gainNode);
gainNode.connect(audioCtx.destination);
oscillator.connect(gainNode).connect(analyser).connect(audioCtx.destination);

// Handle file selection
fileInput.addEventListener("change", (event) => {
    var file = event.target.files[0];
    if (file) {
        const fileURL = URL.createObjectURL(file);
        audio.src = fileURL;
        audio.load();

        // resume AudioContext on user gesture and start playback
        if (audioCtx.state === "suspended") {
            audioCtx.resume().catch(() => {});
        }
        audio.play().catch((err) => console.warn("Playback prevented:", err));
    }
});

highpassSlide.addEventListener("input", () => {
    highpassGain = Number(highpassSlide.value);
    highpassFilter.frequency.value = highpassGain;
    highpassValue.innerHTML = `${highpassGain}`;
});

// enable highpass filter when highpass checkbox is ticked and so on and so forth
highpassCheck.addEventListener("change", () => {
    if (highpassCheck.checked) {
        highpassFilter.type = "highpass";
    }
    else{
        highpassFilter.type = "allpass";
    }
});

lowpassSlide.addEventListener("input", () => {
    lowpassGain = Number(lowpassSlide.value);
    lowpassFilter.frequency.value = lowpassGain;
    lowpassValue.innerHTML = `${lowpassGain}`;
});

lowpassCheck.addEventListener("change", () => {
    if (lowpassCheck.checked) {
        lowpassFilter.type = "lowpass";
    }
    else{
        lowpassFilter.type = "allpass";
    }
});

bandpassSlide.addEventListener("input", () => {
    bandpassGain = Number(bandpassSlide.value);
    bandpassFilter.frequency.value = bandpassGain;
    bandpassValue.innerHTML = `${bandpassGain}`;
});

bandpassCheck.addEventListener("change", () => {
    if (bandpassCheck.checked) {
        bandpassFilter.type = "bandpass";
    }
    else{
        bandpassFilter.type = "allpass";
    }
});

highshelfSlide.addEventListener("input", () => {
    highshelfGain = Number(highshelfSlide.value);
    highshelfFilter.gain.value = highshelfGain;
    highshelfValue.innerHTML = `${highshelfGain}`;
});

highshelfCheck.addEventListener("change", () => {
    if (highshelfCheck.checked) {
        highshelfFilter.type = "highshelf";
    }
    else{
        highpassFilter.type = "allpass";
    }
});

lowshelfSlide.addEventListener("input", () => {
    lowshelfGain = Number(lowshelfSlide.value);
    lowshelfFilter.gain.value = lowshelfGain;
    lowshelfValue.innerHTML = `${lowshelfGain}`;
});

lowshelfCheck.addEventListener("change", () => {
    if (lowshelfCheck.checked) {
        lowshelfFilter.type = "lowshelf";
    }
    else{
        lowshelfFilter.type = "allpass";
    }
});

oscillatorSlide.addEventListener("input", () => {
    oscillatorFreq = Number(oscillatorSlide.value);
    oscillator.frequency.value = oscillatorFreq;
    oscillatorValue.innerHTML = `${oscillatorFreq}`;
});

oscillatorWave.addEventListener("change", () => {
  oscillator.type = oscillatorWave.value;
})

oscillatorCheck.addEventListener("change", () => {
    if (oscillatorCheck.checked) {
        oscillator.start(audioCtx.currentTime);
    }
    else {
        oscillator.stop();
    }
})