///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
////////////////////  VOICE RECORDING /////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
// Show Voice Recording Modal
const showRecordModalBtn = document.querySelector(".start_recording--btn");
const recordingListContainer = document.querySelector(".collaboration_tool--recording");
const recordingContainer = document.querySelector(".voice_note-overlay");
const addRecording = recordingContainer.querySelector(".bottom_content .add_recording");

const startRecordingBtn = document.querySelector(".voice_note #start_recording");
const waveformContainer = document.getElementById("waveformContainer");
const timer = document.querySelector(".timer");
const recordedItem = document.querySelector(".voice_listbox");

let audioContext;
let analyser;
let microphone;
let audioWorkletNode;
let isRecording = false;
let startTime;
let timerInterval;
let mediaRecorder;
let audioChunks = [];
// if this variable is empty new Audio object will be creating when user want to play the recorded audio. if this recording want to be play once again, it won't be created anymore
let voiceAudio;

// Event
startRecordingBtn.addEventListener("click", function () {
  const playIcon = this.querySelector(".globe");
  const pauseIcon = this.querySelector(".rectangle-pause");
  const buttonSpan = this.querySelector("span");

  if (!this.classList.contains("active")) {
    this.classList.add("active");
    pauseIcon.classList.remove(HIDDEN);
    playIcon.classList.add(HIDDEN);
    waveformContainer.classList.remove(HIDDEN);
    recordedItem.classList.add(HIDDEN);
    buttonSpan.textContent = "Stop Recording";
    audioVoiceUrl = "";

    startRecording();
  } else {
    this.classList.remove("active");
    pauseIcon.classList.add(HIDDEN);
    playIcon.classList.remove(HIDDEN);
    waveformContainer.classList.add(HIDDEN);
    recordedItem.classList.remove(HIDDEN);
    buttonSpan.textContent = "Start Recording";

    stopRecording();
  }
});

// Inline AudioWorkletProcessor
const volumeProcessor = `
class VolumeProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this._buffer = [];
    this._bufferSize = 1024;
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (input.length > 0) {
      this._buffer.push(...input[0]);
      if (this._buffer.length >= this._bufferSize) {
        const rms = this.calculateRMS(this._buffer);
        this.port.postMessage(rms);
        this._buffer.splice(0);
      }
    }
    return true;
  }

  calculateRMS(buffer) {
    let sum = 0;
    buffer.forEach((value) => {
      sum += value * value;
    });
    return Math.sqrt(sum / buffer.length);
  }
}

registerProcessor('volume-processor', VolumeProcessor);
`;

// start recording
async function startRecording() {
  try {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      microphone = audioContext.createMediaStreamSource(stream);

      try {
        const blob = new Blob([volumeProcessor], { type: "application/javascript" });
        await audioContext.audioWorklet.addModule(URL.createObjectURL(blob));
        audioWorkletNode = new AudioWorkletNode(audioContext, "volume-processor");
      } catch (error) {
        console.error("Failed to load audio worklet module:", error);
        alert("Error loading audio worklet module. Please try again.");
        return;
      }

      mediaRecorder = new MediaRecorder(stream);
      audioChunks = []; // Reset the audio chunks array

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        audioVoiceUrl = URL.createObjectURL(audioBlob);
      };

      analyser.smoothingTimeConstant = 0.3;
      analyser.fftSize = 1024;

      microphone.connect(analyser);
      analyser.connect(audioWorkletNode);
      audioWorkletNode.connect(audioContext.destination);

      audioWorkletNode.port.onmessage = (event) => {
        const volume = event.data;
        addVolumeBar(volume);
      };

      mediaRecorder.start();
      waveformContainer.innerHTML = ""; // clear previous bar before starting new one
      addRecording.classList.add(HIDDEN);

      isRecording = true;
      startTime = Date.now();
      updateTimer();
    }
  } catch (error) {
    handleMicrophoneError(error);
  }
}

// stop recording
function stopRecording() {
  if (isRecording) {
    mediaRecorder.stop();
    microphone.disconnect();
    analyser.disconnect();
    audioWorkletNode.disconnect();
    audioContext.close();
    isRecording = false;

    clearInterval(timerInterval);
    addRecording.classList.remove(HIDDEN);
    voiceAudio = "";

    timer.textContent = "00:00:00";
  }
}

function handleMicrophoneError(error) {
  if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
    alert("Microphone access was denied. Please allow microphone access to record.");
  } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
    alert("No microphone was found. Please connect a microphone to record.");
  } else if (error.name === "NotReadableError" || error.name === "TrackStartError") {
    alert("Microphone is already in use or not accessible. Please try again.");
  } else if (error.name === "AbortError") {
    alert("Microphone request was aborted. Please try again.");
  } else {
    console.error("Error accessing microphone: ", error);
  }
}

function getRMS(array) {
  let sum = 0;
  for (let i = 0; i < array.length; i++) {
    const value = array[i] / 128.0 - 1.0;
    sum += value * value;
  }
  return Math.sqrt(sum / array.length);
}

function addVolumeBar(volume) {
  const maxHeight = 200; // Maximum height of the bar in pixels
  const height = Math.min(volume * 500, maxHeight); // Scale the volume to fit the bar height
  const bar = document.createElement("div");
  bar.className = "bar";
  bar.style.height = `${height}px`;
  bar.style.bottom = "50%"; // Start from the middle
  bar.style.transformOrigin = "bottom"; // Grow from the middle
  waveformContainer.appendChild(bar);

  // Animate the bar moving to the left
  Array.from(waveformContainer.children).forEach((child, index) => {
    const rightPosition = parseFloat(child.style.right) || 0;
    child.style.right = `${rightPosition + 4}px`; // Move left
  });

  // Remove old bars to keep the container clean
  if (waveformContainer.children.length > 200) {
    waveformContainer.removeChild(waveformContainer.firstChild);
  }
}

function updateTimer() {
  timerInterval = setInterval(() => {
    const elapsedTime = Date.now() - startTime;
    const seconds = Math.floor((elapsedTime / 1000) % 60);
    const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
    const hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24);

    timer.textContent = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }, 1000);
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
const playRecordedAudio = document.querySelector(".button_play_pause_voice_recording > button"); //prettier-ignore
let voice_playing = false;
let progress;

playRecordedAudio.addEventListener("click", function (e) {
  if (audioVoiceUrl) {
    if (!voiceAudio) {
      voiceAudio = new Audio(audioVoiceUrl);
      voiceAudio.preload = "auto"; // Set preload to auto

      // Wait for metadata to load
      voiceAudio.addEventListener("loadedmetadata", () => {
        // The below conditional statement is compulsory for getting accurate audio duration for a blob type
        if (voiceAudio.duration === Infinity) {
          voiceAudio.currentTime = 1e101;
          voiceAudio.ontimeupdate = () => {
            voiceAudio.ontimeupdate = null;
            voiceAudio.currentTime = 0;
          };
        }
      });

      voiceAudio.addEventListener("timeupdate", () => {
        const progress = (voiceAudio.currentTime / voiceAudio.duration) * 100;
        setProgress(progress, recordedItem.querySelector(".voice_progress-ring__circle"));
      });
    }

    const playSVG = this.querySelector(".voice_play");
    const pauseSVG = this.querySelector(".voice_pause");

    if (!voice_playing) {
      voiceAudio.play();
      playSVG.classList.add(HIDDEN);
      pauseSVG.classList.remove(HIDDEN);
      voice_playing = !voice_playing;
    } else {
      voiceAudio.pause();
      playSVG.classList.remove(HIDDEN);
      pauseSVG.classList.add(HIDDEN);
      voice_playing = !voice_playing;
    }

    voiceAudio.addEventListener("ended", () => {
      playSVG.classList.remove(HIDDEN);
      pauseSVG.classList.add(HIDDEN);
      voice_playing = false;
    });
  }
});

// function that handle music circle rotating
function setProgress(percent, circle) {
  const radius = circle.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  circle.style.strokeDashoffset = offset;
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
// Add Recording
const addRecordedAudio = document.querySelector(".voice_note .bottom_content .add_recording");

addRecordedAudio.addEventListener("click", function () {
  const newMusic = {
    id: addSoundData.length,
    name: "commandcodes",
    author: "Musa Abdulkabir",
    musicPath: audioVoiceUrl,
  };
  addSoundData.push(newMusic);

  // Get last music index
  const musicIndex = addSoundData.findIndex((sound) => sound.id === addSoundData.length - 1);

  // Update DOM
  handleAddSoundOrRecordingToPost(musicIndex);

  // Update Voice Container
  audioVoiceUrl = "";
  waveformContainer.innerHTML = "";
  waveformContainer.classList.remove(HIDDEN);
  recordedItem.classList.add(HIDDEN);
  recordingContainer.classList.add(HIDDEN);
  addRecording.classList.add(HIDDEN);
});

// Hide Recording modal
const cancelRecordedAudioModal = document.querySelector(".voice_note .bottom_content .cancel");

cancelRecordedAudioModal.addEventListener("click", function () {
  recordingContainer.classList.add(HIDDEN);
});

// Remove Recorded
const removeRecord = document.getElementById("remove_record");

removeRecord.addEventListener("click", function (e) {
  addRecordedAudio.classList.add(HIDDEN);
  recordedItem.classList.add(HIDDEN);

  waveformContainer.classList.remove(HIDDEN);
  waveformContainer.innerHTML = "";
});
