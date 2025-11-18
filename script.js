const audio = document.getElementById("audioPlayer");
const fileInput = document.getElementById("sound");
const highpassCheck = document.getElementById("highpass");
const lowpassCheck = document.getElementById("lowpass");
const bandpassCheck = document.getElementById("bandpass");
const highshelfCheck = document.getElementById("highshelf");
const lowshelfCheck = document.getElementById("lowshelf");

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const source = audioCtx.createMediaElementSource(audio);
const analyser = audioCtx.createAnalyser();
const distortion = audioCtx.createWaveShaper();
const gainNode = audioCtx.createGain();
const biquadFilter = audioCtx.createBiquadFilter();

source.connect(analyser);
analyser.connect(distortion);
distortion.connect(biquadFilter);
biquadFilter.connect(gainNode);
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

// enable highpass filter when highpass checkbox is ticked
highpassCheck.addEventListener("change", () => {
    if (highpassCheck.checked) {
        biquadFilter.type = "highpass";
    }
    else{
        biquadFilter.type = "";
    }
});

lowpassCheck.addEventListener("change", () => {
    if (highpassCheck.checked) {
        biquadFilter.type = "lowpass";
    }
    else{
        biquadFilter.type = "";
    }
});

bandpassCheck.addEventListener("change", () => {
    if (highpassCheck.checked) {
        biquadFilter.type = "bandpass";
    }
    else{
        biquadFilter.type = "";
    }
});

lowshelfCheck.addEventListener("change", () => {
    if (highpassCheck.checked) {
        biquadFilter.type = "lowshelf";
    }
    else{
        biquadFilter.type = "";
    }
});

highshelfCheck.addEventListener("change", () => {
    if (highpassCheck.checked) {
        biquadFilter.type = "highshelf";
    }
    else{
        biquadFilter.type = "";
    }
});
