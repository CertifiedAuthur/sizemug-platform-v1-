/**
 *
 *
 *
 * Start Recording Voice Note
 *
 *
 *
 */

const startRecordingVoiceNote = document.getElementById(
  "startRecordingVoiceNote"
);
const voiceRecordingWaves = document.getElementById("voiceRecordingWaves");
const voiceRecordingTimer = document.getElementById("voiceRecordingTimer");
const toggleRecordingState = document.getElementById("toggleRecordingState");
const sendVoiceNote = document.getElementById("sendVoiceNote");

let voiceNoteMediaRecorder;
let voiceNoteAudioChunks = [];
let voiceNoteAudioContext;
let voiceNoteAnalyser;
let voiceNoteSource;
let isVoiceNoteRecording = false;
let voiceNoteStartTime;
let voiceNoteAnimationFrameId;
let voiceNoteTimerInterval;
let voiceNoteWaveformInterval;
let voiceNoteTotalDuration = 0;

// Voice Note Events
startRecordingVoiceNote.addEventListener("click", startRecording);

toggleRecordingState.addEventListener("click", function () {
  const { mode } = this.dataset;

  if (mode === "pause") {
    voiceNoteMediaRecorder.pause();
    this.setAttribute("data-mode", "play");
    voiceNoteTotalDuration += Date.now() - voiceNoteStartTime;

    // Clear Existing Intervals
    clearInterval(voiceNoteTimerInterval);
    clearInterval(voiceNoteWaveformInterval);
  } else {
    voiceNoteMediaRecorder.resume();
    this.setAttribute("data-mode", "pause");
    voiceNoteStartTime = Date.now();
    startIntervals();
  }
});

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
// Voice Recording Note Function
async function startRecording(e) {
  e.preventDefault();
  if (isVoiceNoteRecording) return;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    isVoiceNoteRecording = true;

    // Setup audio context and analyzer
    voiceNoteAudioContext = new AudioContext();
    voiceNoteAnalyser = voiceNoteAudioContext.createAnalyser();
    voiceNoteAnalyser.fftSize = 2048;
    voiceNoteSource = voiceNoteAudioContext.createMediaStreamSource(stream);
    voiceNoteSource.connect(voiceNoteAnalyser);

    // Setup media recorder
    voiceNoteMediaRecorder = new MediaRecorder(stream);
    voiceNoteMediaRecorder.start();
    voiceNoteAudioChunks = [];

    voiceNoteMediaRecorder.ondataavailable = (event) => {
      voiceNoteAudioChunks.push(event.data);
    };

    // Start visual updates
    voiceNoteStartTime = Date.now();
    voiceNoteTotalDuration = 0;

    toggleRecordingState.removeAttribute("disabled");
    sendVoiceNote.removeAttribute("disabled");
    startRecordingVoiceNote.setAttribute("disabled", true);

    toggleRecordingState.setAttribute("data-mode", "pause");

    startIntervals();
  } catch (err) {
    console.error("Error accessing microphone:", err);
  }
}

function startIntervals() {
  voiceNoteTimerInterval = setInterval(handleUpdateVoiceNoteTimer, 1000);
  voiceNoteWaveformInterval = setInterval(handleUpdateVoiceNoteWaveform, 100);
}

// Handle Update Voice Note Timer :)
function handleUpdateVoiceNoteTimer() {
  if (!isVoiceNoteRecording) return;

  let currentTotal = voiceNoteTotalDuration;

  if (isVoiceNoteRecording) {
    currentTotal += Date.now() - voiceNoteStartTime;
  }

  const seconds = Math.floor(currentTotal / 1000);
  voiceRecordingTimer.textContent = `${String(
    Math.floor(seconds / 60)
  ).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

// Handler Update Voice Note Wave Form
function handleUpdateVoiceNoteWaveform() {
  if (!isVoiceNoteRecording) return;

  const bufferLength = voiceNoteAnalyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  voiceNoteAnalyser.getByteTimeDomainData(dataArray);

  // Create waveform bars
  const maxAmplitude = Math.max(...dataArray);
  const normalizedAmplitude = (maxAmplitude - 128) / 128; // Normalize to -1 to 1

  const bar = document.createElement("div");
  bar.className = "wave_bar";
  bar.style.height = `${10 + Math.abs(normalizedAmplitude) * 40}%`;
  voiceRecordingWaves.appendChild(bar);

  // Keep only recent bars (last 5 seconds)
  const maxBars = 100;
  while (voiceRecordingWaves.children.length > maxBars) {
    voiceRecordingWaves.removeChild(voiceRecordingWaves.firstChild);
  }

  // Scroll to show new bars
  voiceRecordingWaves.scrollLeft = voiceRecordingWaves.scrollWidth;
}

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
// Hide Voice Recording Footer :)
const hideVoiceNoteFooter = document.getElementById("hideVoiceNoteFooter");

hideVoiceNoteFooter.addEventListener("click", (e) => {
  const chatPrimaryFooter = e.target.closest(".chat_primary_footer");

  isVoiceNoteRecording = false;

  voiceNoteMediaRecorder.stop();
  voiceNoteSource.disconnect();
  voiceNoteAudioContext.close();

  // Clear Existing Intervals
  clearInterval(voiceNoteTimerInterval);
  clearInterval(voiceNoteWaveformInterval);

  voiceNoteMediaRecorder.onstop = () => {
    const audioBlob = new Blob(voiceNoteAudioChunks, { type: "audio/webm" });
    const audioUrl = URL.createObjectURL(audioBlob);

    console.log("Recorded duration:", voiceNoteTotalDuration, "ms");
    console.log("Audio URL:", audioUrl);
  };

  // Clear all wave bars
  voiceRecordingWaves.innerHTML = "";

  toggleRecordingState.setAttribute("disabled", true);
  sendVoiceNote.setAttribute("disabled", true);
  toggleRecordingState.setAttribute("data-mode", "play");
  startRecordingVoiceNote.removeAttribute("disabled");

  const chattingSpacerFooterItems = chatPrimaryFooter
    .closest(".chat_spacer_area")
    .querySelectorAll(".chattingSpacerFooter>div");
  chattingSpacerFooterItems.forEach((item) => item.classList.add(HIDDEN));
  chatPrimaryFooter.classList.remove(HIDDEN);
});

// Send Voice Note
sendVoiceNote.addEventListener("click", (e) => {
  const chatPrimaryFooter = e.target.closest(".chattingSpacerFooter");
  const chatSpacerArea = chatPrimaryFooter.closest(".chat_spacer_area");

  isVoiceNoteRecording = false;

  voiceNoteMediaRecorder.stop();
  voiceNoteSource.disconnect();
  voiceNoteAudioContext.close();

  // Clear Existing Intervals
  clearInterval(voiceNoteTimerInterval);
  clearInterval(voiceNoteWaveformInterval);

  voiceNoteMediaRecorder.onstop = () => {
    const audioBlob = new Blob(voiceNoteAudioChunks, { type: "audio/webm" });
    const audioUrl = URL.createObjectURL(audioBlob);

    console.log("Audio URL:", audioUrl);

    chatMessages.map((chat) => {
      if (chat.userId !== currentOpenedUser.id) {
        return chat;
      } else {
        chat.messages.push({
          sender_id: USERID,
          receiver_id: 8192709189,
          message_id: `${Math.random()}`.split(".").at(-1),
          type: "recorded_audio",
          phtotos: null,
          message: null,
          audioURL: audioUrl,
          timestamp: "1670001001",
          status: "sent",
        });

        return chat;
      }
    });

    const messagesItem = chatMessages.find(
      (message) => message.userId === +currentOpenedUser.id
    );

    const chattingContainerMessage = chatSpacerArea.querySelector(
      ".chatting_container_message"
    );
    invalidateChattingMessages(messagesItem, chattingContainerMessage);
  };

  // Clear all wave bars
  voiceRecordingWaves.innerHTML = "";

  toggleRecordingState.setAttribute("disabled", true);
  sendVoiceNote.setAttribute("disabled", true);
  toggleRecordingState.setAttribute("data-mode", "play");
  startRecordingVoiceNote.removeAttribute("disabled");

  const chattingSpacerFooterItems = chatSpacerArea.querySelectorAll(
    ".chattingSpacerFooter>div"
  );

  chattingSpacerFooterItems.forEach((item) => item.classList.add(HIDDEN));
  chatPrimaryFooter
    .querySelector(".chat_primary_footer")
    .classList.remove(HIDDEN);
});
