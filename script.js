const audio = document.getElementById("audioPlayer");
const fileInput = document.getElementById("sound");

// Handle file selection
fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const fileURL = URL.createObjectURL(file);
        audio.src = fileURL;
        audio.load();
    }
});
