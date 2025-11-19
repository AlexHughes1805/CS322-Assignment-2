const audio = document.getElementById("audioPlayer");
const fileInput = document.getElementById("sound");
const highpassCheck = document.getElementById("highpass");
const lowpassCheck = document.getElementById("lowpass");
const bandpassCheck = document.getElementById("bandpass");
const highshelfCheck = document.getElementById("highshelf");
const lowshelfCheck = document.getElementById("lowshelf");

var highpassSlide = document.getElementById("highpassGain");
var highpassGain = highpassSlide.value;
var lowpassSlide = document.getElementById("lowpassGain");
var lowpassGain = lowpassSlide.value;
var bandpassSlide = document.getElementById("bandpassGain");
var bandpassGain = bandpassSlide.value;
var highshelfSlide = document.getElementById("highshelfGain");
var highshelfGain = highshelfSlide.value;
var lowshelfSlide = document.getElementById("lowshelfGain");
var lowshelfGain = lowshelfSlide.value;

var output = document.getElementById("demo");
output.innerHTML = lowpassSlide.value;

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

source.connect(analyser);
analyser.connect(distortion);
distortion.connect(highpassFilter);
highpassFilter.connect(lowpassFilter);
lowpassFilter.connect(bandpassFilter);
bandpassFilter.connect(lowshelfFilter);
lowshelfFilter.connect(highshelfFilter);
highshelfFilter.connect(gainNode);
gainNode.connect(audioCtx.destination);

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

// enable highpass filter when highpass checkbox is ticked and so on and so forth
highpassCheck.addEventListener("change", () => {
    if (highpassCheck.checked) {
        highpassFilter.type = "highpass";
        highpassFilter.gain.value = highpassGain;
    }
    else{
        highpassFilter.type = "allpass";
    }
});

lowpassCheck.addEventListener("change", () => {
    lowpassSlide.oninput = function() {
        output.innerHTML = this.value;
    }
    output.innerHTML = lowpassSlide.value;
    if (lowpassCheck.checked) {
        lowpassFilter.type = "lowpass";
    }
    else{
        lowpassFilter.type = "allpass";
    }
});

bandpassCheck.addEventListener("change", () => {
    if (bandpassCheck.checked) {
        bandpassFilter.type = "bandpass";
        bandpassFilter.gain.value = bandpassGain;
    }
    else{
        bandpassFilter.type = "allpass";
    }
});

lowshelfCheck.addEventListener("change", () => {
    if (lowshelfCheck.checked) {
        lowshelfFilter.type = "lowshelf";
    }
    else{
        lowshelfFilter.type = "allpass";
    }
    while(checked == true)
    {
        console.log(lowpassFilter.gain.value);
    }
});

highshelfCheck.addEventListener("change", () => {
    if (highshelfCheck.checked) {
        highshelfFilter.type = "highshelf";
        highshelfFilter.gain.value = highshelfGain;
    }
    else{
        highpassFilter.type = "allpass";
    }
});
