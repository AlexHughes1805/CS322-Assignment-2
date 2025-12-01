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

var oscillatorGainSlide = document.getElementById("oscillatorGain");
var oscillatorGainAmount = Number(oscillatorGainSlide.value);
var oscillatorGainDisplay = document.getElementById("oscillatorGainValue");
oscillatorGainDisplay.innerHTML = oscillatorGainSlide.value;

const noiseCheck = document.getElementById("noise");
const noiseTypeSelect = document.getElementById("noiseType");
var noiseGainSlide = document.getElementById("noiseGain");
var noiseGainAmount = Number(noiseGainSlide.value);
var noiseGainDisplay = document.getElementById("noiseGainValue");
noiseGainDisplay.innerHTML = noiseGainSlide.value;

var stereoPannerSlide = document.getElementById("stereoPanner");
var stereoPannerValue = Number(stereoPannerSlide.value);
var stereoPannerDisplay = document.getElementById("stereoPannerValue");
stereoPannerDisplay.innerHTML = stereoPannerSlide.value;

// Audio context and node setup from provided biquad filter files on Moodle

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const source = audioCtx.createMediaElementSource(audio);
const analyser = audioCtx.createAnalyser();
const distortion = audioCtx.createWaveShaper();
const gainNode = audioCtx.createGain();
const stereoPannerNode = audioCtx.createStereoPanner();

// handle each filter independently of each other
const highpassFilter = audioCtx.createBiquadFilter(); highpassFilter.type = "allpass";
const lowpassFilter  = audioCtx.createBiquadFilter(); lowpassFilter.type  = "allpass";
const bandpassFilter = audioCtx.createBiquadFilter(); bandpassFilter.type = "allpass";
const lowshelfFilter = audioCtx.createBiquadFilter(); lowshelfFilter.type = "allpass";
const highshelfFilter = audioCtx.createBiquadFilter(); highshelfFilter.type = "allpass";

let oscillator = null;
const oscillatorGain = audioCtx.createGain();
oscillatorGain.gain.value = 0;

const compressorCheck = document.getElementById("compressor");
var compressorSlide = document.getElementById("compressorRatio");
var compressorRatio = compressorSlide.value;
var compressorValue = document.getElementById("compressorValue");
compressorValue.innerHTML = compressorSlide.value;

const compressor = audioCtx.createDynamicsCompressor();
compressor.threshold.setValueAtTime(compressorRatio, audioCtx.currentTime);
compressor.knee.setValueAtTime(40, audioCtx.currentTime);
compressor.ratio.setValueAtTime(12, audioCtx.currentTime);
compressor.attack.setValueAtTime(0, audioCtx.currentTime);
compressor.release.setValueAtTime(0.25, audioCtx.currentTime);

// Tone.js noise generatepr
let noise = null;
let toneGain = null;
const noiseGain = audioCtx.createGain();
noiseGain.gain.value = 0;
Tone.setContext(audioCtx);

async function startNoise() {
    await Tone.start();
    if (noise) {
        noise.stop();
        noise.dispose();
    }
    if (toneGain) {
        toneGain.dispose();
    }
    
    noise = new Tone.Noise(noiseTypeSelect.value);
    toneGain = new Tone.Gain(noiseGainAmount);
    
    noise.connect(toneGain);
    toneGain.connect(noiseGain);
    noiseGain.gain.value = 1;
    
    noise.start();
}

function stopNoise() {
    if (noise) {
        noise.stop();
        noise.dispose();
        noise = null;
    }
    if (toneGain) {
        toneGain.dispose();
        toneGain = null;
    }
    noiseGain.gain.value = 0;
}

source.connect(distortion);
distortion.connect(highpassFilter);
highpassFilter.connect(lowpassFilter);
lowpassFilter.connect(bandpassFilter);
bandpassFilter.connect(lowshelfFilter);
lowshelfFilter.connect(highshelfFilter);
highshelfFilter.connect(gainNode);
gainNode.connect(stereoPannerNode);
stereoPannerNode.connect(analyser);
analyser.connect(audioCtx.destination);
oscillatorGain.connect(gainNode);
noiseGain.connect(gainNode);


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
        highshelfFilter.type = "allpass";
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
    if (oscillator) {
        oscillator.frequency.value = oscillatorFreq;
    }
    oscillatorValue.innerHTML = `${oscillatorFreq}`;
});

oscillatorWave.addEventListener("change", () => {
    if (oscillator) {
        oscillator.type = oscillatorWave.value;
    }
});

oscillatorGainSlide.addEventListener("input", () => {
    oscillatorGainAmount = Number(oscillatorGainSlide.value);
    oscillatorGainDisplay.innerHTML = oscillatorGainAmount;
    if (oscillatorCheck.checked) {
        oscillatorGain.gain.value = oscillatorGainAmount;
    }
});

oscillatorCheck.addEventListener("change", () => {
    if (oscillatorCheck.checked) {
        oscillator = audioCtx.createOscillator();
        oscillator.type = oscillatorWave.value;
        oscillator.frequency.value = oscillatorFreq;
        oscillator.connect(oscillatorGain);
        oscillatorGain.gain.value = oscillatorGainAmount;
        oscillator.start();
    }
    else {
        if (oscillator) {
            oscillator.stop();
            oscillator.disconnect();
            oscillator = null;
        }
        oscillatorGain.gain.value = 0;
    }
});

noiseGainSlide.addEventListener("input", () => {
    noiseGainAmount = Number(noiseGainSlide.value);
    noiseGainDisplay.innerHTML = noiseGainAmount;
    if (noiseCheck.checked && toneGain) {
        toneGain.gain.value = noiseGainAmount;
    }
});

noiseTypeSelect.addEventListener("change", () => {
    if (noiseCheck.checked && noise) {
        noise.type = noiseTypeSelect.value;
    }
});

noiseCheck.addEventListener("change", async () => {
    if (noiseCheck.checked) {
        if (audioCtx.state == "suspended") {
            await audioCtx.resume();
        }
        await startNoise();
    } else {
        stopNoise();
    }
});

stereoPannerSlide.addEventListener("input", () => {
    const stereoPannerValue = Number(stereoPannerSlide.value);
    stereoPannerNode.pan.value = stereoPannerValue;
    stereoPannerDisplay.innerHTML = stereoPannerValue;
});

compressorSlide.addEventListener("input", () => {
    compressorRatio = Number(compressorSlide.value);
    compressor.threshold.setValueAtTime(compressorRatio, audioCtx.currentTime);
    compressorValue.innerHTML = `${compressorRatio}`;
})

compressorCheck.addEventListener("change", () => {
    if(compressorCheck.checked)
    {
        highshelfFilter.disconnect();
        highshelfFilter.connect(compressor);
        compressor.connect(gainNode);
    }
    else
    {
        compressor.disconnect();
        highshelfFilter.disconnect();
        highshelfFilter.connect(gainNode);
    }
});

function resetFilters() {
    highpassCheck.checked = false;
    lowpassCheck.checked = false;
    bandpassCheck.checked = false;
    highshelfCheck.checked = false;
    lowshelfCheck.checked = false;

    highpassFilter.type = "allpass";
    lowpassFilter.type = "allpass";
    bandpassFilter.type = "allpass";
    highshelfFilter.type = "allpass";
    lowshelfFilter.type = "allpass";

    highpassSlide.value = 200;
    lowpassSlide.value = 5000;
    bandpassSlide.value = 1000;
    highshelfSlide.value = 0;
    lowshelfSlide.value = 0;

    highpassFilter.frequency.value = 200;
    lowpassFilter.frequency.value = 5000;
    bandpassFilter.frequency.value = 1000;
    highshelfFilter.gain.value = 0;
    lowshelfFilter.gain.value = 0;

    highpassValue.innerHTML = "200";
    lowpassValue.innerHTML = "5000";
    bandpassValue.innerHTML = "1000";
    highshelfValue.innerHTML = "0";
    lowshelfValue.innerHTML = "0";
}

document.getElementById("resetFilters").addEventListener("click", resetFilters);
resetFilters();

// Waveform visualiser and bar graph setup
const visualiser = document.getElementById("visualiser");
const visualiserCtx = visualiser.getContext("2d");
const WIDTH = visualiser.width;
const HEIGHT = visualiser.height;
const frequencyGraph = document.getElementById("frequencyGraph");
const frequencyGraphCtx = frequencyGraph.getContext("2d");
const FREQ_WIDTH = frequencyGraph.width;
const FREQ_HEIGHT = frequencyGraph.height;

analyser.fftSize = 2048;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);
const frequencyDataArray = new Uint8Array(bufferLength);

visualiserCtx.clearRect(0, 0, WIDTH, HEIGHT);

function drawWaveform() {
  requestAnimationFrame(drawWaveform);
  analyser.getByteTimeDomainData(dataArray);
  visualiserCtx.fillStyle = "rgb(0, 0, 0)";
  visualiserCtx.fillRect(0, 0, WIDTH, HEIGHT);
  visualiserCtx.lineWidth = 2;
  visualiserCtx.strokeStyle = "rgb(255, 105, 180)";
  visualiserCtx.beginPath();
  const sliceWidth = WIDTH / bufferLength;
  let x = 0;
  for (let i = 0; i < bufferLength; i++) {
    const v = dataArray[i] / 128.0;
    const y = v * (HEIGHT / 2);

    if (i === 0) {
      visualiserCtx.moveTo(x, y);
    } else {
      visualiserCtx.lineTo(x, y);
    }

    x += sliceWidth;
  }

  visualiserCtx.lineTo(WIDTH, HEIGHT / 2);
  visualiserCtx.stroke();
}

drawWaveform();

function drawFrequencyGraph() {
    requestAnimationFrame(drawFrequencyGraph);

    analyser.getByteFrequencyData(frequencyDataArray);

    frequencyGraphCtx.fillStyle = "rgb(0, 0, 0)";
    frequencyGraphCtx.fillRect(0, 0, FREQ_WIDTH, FREQ_HEIGHT);

    const barCount = 40;
    const barWidth = (FREQ_WIDTH / barCount) - 2;
    const step = Math.floor(bufferLength / barCount);

    for (let i = 0; i < barCount; i++) {
        const dataIndex = i * step;
        const barHeight = (frequencyDataArray[dataIndex] / 255) * FREQ_HEIGHT;

        const ratio = i / barCount;
        const r = Math.floor(0 + ratio * 255);
        const g = Math.floor(212 - ratio * 105);
        const b = Math.floor(255 - ratio * 98);
        frequencyGraphCtx.fillStyle = `rgb(${r}, ${g}, ${b})`;

        const x = i * (barWidth + 2);
        const y = FREQ_HEIGHT - barHeight;

        frequencyGraphCtx.fillRect(x, y, barWidth, barHeight);
    }
}

drawFrequencyGraph();

document.getElementById("exportWav").addEventListener("click", async () => {
    const file = fileInput.files[0];
    if (!file) {
        alert("No file loaded !!");
        return;
    }

    const buffer = await audioCtx.decodeAudioData(await file.arrayBuffer());

    const offlineCtx = new OfflineAudioContext(
        buffer.numberOfChannels,
        buffer.length,
        buffer.sampleRate
    );

    const offlineSource = offlineCtx.createBufferSource();
    offlineSource.buffer = buffer;

    // Recreating filter chain in offline context (cause we can't reuse nodes)
    const offHighpass = offlineCtx.createBiquadFilter();
    offHighpass.type = highpassFilter.type;
    offHighpass.frequency.value = highpassFilter.frequency.value;

    const offLowpass = offlineCtx.createBiquadFilter();
    offLowpass.type = lowpassFilter.type;
    offLowpass.frequency.value = lowpassFilter.frequency.value;

    const offBandpass = offlineCtx.createBiquadFilter();
    offBandpass.type = bandpassFilter.type;
    offBandpass.frequency.value = bandpassFilter.frequency.value;

    const offLowshelf = offlineCtx.createBiquadFilter();
    offLowshelf.type = lowshelfFilter.type;
    offLowshelf.frequency.value = lowshelfFilter.frequency.value;
    offLowshelf.gain.value = lowshelfFilter.gain.value;

    const offHighshelf = offlineCtx.createBiquadFilter();
    offHighshelf.type = highshelfFilter.type;
    offHighshelf.frequency.value = highshelfFilter.frequency.value;
    offHighshelf.gain.value = highshelfFilter.gain.value;

    offlineSource.connect(offHighpass);
    offHighpass.connect(offLowpass);
    offLowpass.connect(offBandpass);
    offBandpass.connect(offLowshelf);
    const offStereoPanner = offlineCtx.createStereoPanner();
    offStereoPanner.pan.value = stereoPannerNode.pan.value;

    offLowshelf.connect(offHighshelf);
    offHighshelf.connect(offStereoPanner);
    offStereoPanner.connect(offlineCtx.destination);

    if (oscillatorCheck.checked) {
        const offOscillator = offlineCtx.createOscillator();
        offOscillator.type = oscillatorWave.value;
        offOscillator.frequency.value = oscillatorFreq;
        const offOscGain = offlineCtx.createGain();
        offOscGain.gain.value = oscillatorGainAmount;
        offOscillator.connect(offOscGain);
        offOscGain.connect(offStereoPanner);
        offOscillator.start(0);
    }
    if (noiseCheck.checked) {
        Tone.setContext(offlineCtx);
        const offNoise = new Tone.Noise(noiseTypeSelect.value);
        const offToneGain = new Tone.Gain(noiseGainAmount);
        offNoise.connect(offToneGain);
        offToneGain.connect(offStereoPanner);
        offNoise.start(0);
    }

    offlineSource.start(0);

    const renderedBuffer = await offlineCtx.startRendering();
    
    Tone.setContext(audioCtx);

    const wav = audioBufferToWav(renderedBuffer);
    const blob = new Blob([wav], { type: 'audio/wav' });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'processed_audio.wav';
    a.click();
});