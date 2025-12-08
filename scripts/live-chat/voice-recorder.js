/* ============================================
   Voice Recorder Handler
   WhatsApp-like voice recording functionality
   ============================================ */

class VoiceRecorder {
  constructor() {
    this.isRecording = false;
    this.isPaused = false;
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.startTime = null;
    this.pausedTime = 0;
    this.timerInterval = null;

    // Audio analysis
    this.audioContext = null;
    this.analyser = null;
    this.microphone = null;
    this.audioWorkletNode = null;
    this.animationFrame = null;

    // Waveform state
    this.currentBarIndex = 0;
    this.lastBarTime = 0;
    this.barInterval = 100; // Add new bar every 100ms

    this.initElements();
    this.bindEvents();
  }

  initElements() {
    // Main containers
    this.normalInput = document.getElementById("threadInputNormal");
    this.voiceRecording = document.getElementById("threadVoiceRecording");

    // Buttons
    this.voiceNoteBtn = document.getElementById("voiceNoteBtn");
    this.cancelBtn = document.getElementById("voiceCancelBtn");
    this.pauseBtn = document.getElementById("voicePauseBtn");
    this.sendBtn = document.getElementById("voiceSendBtn");

    // Display elements
    this.timer = document.getElementById("voiceTimer");
    this.waveform = document.getElementById("voiceWaveform");

    // Generate waveform bars
    this.generateWaveformBars();
  }

  generateWaveformBars() {
    if (!this.waveform) return;

    // Clear existing bars
    this.waveform.innerHTML = "";
  }

  bindEvents() {
    if (this.voiceNoteBtn) {
      this.voiceNoteBtn.addEventListener("click", () => this.startRecording());
    }

    if (this.cancelBtn) {
      this.cancelBtn.addEventListener("click", () => this.cancelRecording());
    }

    if (this.pauseBtn) {
      this.pauseBtn.addEventListener("click", () => this.togglePause());
    }

    if (this.sendBtn) {
      this.sendBtn.addEventListener("click", () => this.sendVoiceNote());
    }
  }

  async startRecording() {
    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // (Re)build waveform bars in case UI was hidden or DOM changed
      this.generateWaveformBars();

      // Initialize audio analysis
      this.setupAudioAnalysis(stream);

      // Initialize MediaRecorder
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        // Stop audio analysis
        this.stopAudioAnalysis();
        // Stop all tracks to release microphone
        stream.getTracks().forEach((track) => track.stop());
      };

      // Start recording
      this.mediaRecorder.start();
      this.isRecording = true;
      this.startTime = Date.now();
      this.pausedTime = 0;
      this.currentBarIndex = 0;

      // Reset waveform
      this.resetWaveform();

      // Switch UI
      this.showRecordingUI();

      // Start timer and waveform animation
      this.startTimer();
      this.startWaveformAnimation();

      console.log("Voice recording started");
    } catch (error) {
      console.error("Error starting voice recording:", error);
      this.showError("Microphone access denied or not available");
    }
  }

  cancelRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
    }

    this.resetRecording();
    this.showNormalUI();
    console.log("Voice recording cancelled");
  }

  togglePause() {
    if (!this.isRecording) return;

    if (this.isPaused) {
      // Resume recording
      if (this.mediaRecorder.state === "paused") {
        this.mediaRecorder.resume();
      }
      this.isPaused = false;
      this.pauseBtn.classList.remove("paused");
      this.waveform.classList.remove("paused");
      this.startTimer();
      this.resumeWaveform();
      console.log("Voice recording resumed");
    } else {
      // Pause recording
      if (this.mediaRecorder.state === "recording") {
        this.mediaRecorder.pause();
      }
      this.isPaused = true;
      this.pauseBtn.classList.add("paused");
      this.waveform.classList.add("paused");
      this.stopTimer();
      this.pauseWaveform();
      console.log("Voice recording paused");
    }
  }

  async sendVoiceNote() {
    if (!this.mediaRecorder || !this.isRecording) return;

    // Stop recording
    this.mediaRecorder.stop();
    this.isRecording = false;
    this.stopTimer();

    // Wait for the recording to be processed
    await new Promise((resolve) => {
      this.mediaRecorder.onstop = () => {
        resolve();
      };
    });

    // Create audio blob
    const audioBlob = new Blob(this.audioChunks, { type: "audio/webm" });
    const duration = this.getRecordingDuration();

    // Send the voice note
    this.sendToChat(audioBlob, duration);

    // Reset UI
    this.resetRecording();
    this.showNormalUI();

    console.log("Voice note sent");
  }

  sendToChat(audioBlob, duration) {
    // Create a voice message object
    const voiceMessage = {
      type: "voice",
      blob: audioBlob,
      duration: duration,
      timestamp: new Date().toISOString(),
    };

    // Here you would integrate with your existing chat system
    // For now, we'll just log it and show a placeholder
    console.log("Voice message ready to send:", voiceMessage);

    // You can integrate this with your existing message sending system
    if (window.threadMessagesRenderer) {
      // Create a temporary voice message display
      this.displayVoiceMessage(voiceMessage);
    }
  }

  displayVoiceMessage(voiceMessage) {
    // This is a placeholder - integrate with your actual message system
    const messageContainer = document.querySelector(".thread-messages");
    if (messageContainer) {
      const voiceElement = document.createElement("div");
      voiceElement.className = "message voice-message";
      voiceElement.innerHTML = `
        <div class="voice-message-content">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 1V17M8 6V12M20 7V11M4 7V11M16 4V14" stroke="#007AFF" stroke-width="2"/>
          </svg>
          <span>Voice message (${voiceMessage.duration})</span>
        </div>
      `;
      messageContainer.appendChild(voiceElement);
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  }

  showRecordingUI() {
    if (this.normalInput && this.voiceRecording) {
      this.normalInput.classList.add("live-chat-hidden");
      this.voiceRecording.classList.remove("live-chat-hidden");
    }
  }

  showNormalUI() {
    if (this.normalInput && this.voiceRecording) {
      this.voiceRecording.classList.add("live-chat-hidden");
      this.normalInput.classList.remove("live-chat-hidden");
    }
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      const elapsed = Date.now() - this.startTime - this.pausedTime;
      const seconds = Math.floor(elapsed / 1000);
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;

      if (this.timer) {
        this.timer.textContent = `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
      }
    }, 100);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  getRecordingDuration() {
    if (!this.startTime) return "0:00";

    const elapsed = Date.now() - this.startTime - this.pausedTime;
    const seconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  resetRecording() {
    this.isRecording = false;
    this.isPaused = false;
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.startTime = null;
    this.pausedTime = 0;
    this.stopTimer();

    // Reset UI elements
    if (this.pauseBtn) {
      this.pauseBtn.classList.remove("paused");
    }
    if (this.waveform) {
      this.waveform.classList.remove("paused");
    }
    if (this.timer) {
      this.timer.textContent = "0:00";
    }
  }

  async setupAudioAnalysis(stream) {
    try {
      // Create audio context and analyser
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.analyser = this.audioContext.createAnalyser();
      this.microphone = this.audioContext.createMediaStreamSource(stream);

      // Inline AudioWorkletProcessor (same as collaboration page)
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

      try {
        const blob = new Blob([volumeProcessor], {
          type: "application/javascript",
        });
        await this.audioContext.audioWorklet.addModule(URL.createObjectURL(blob));
        this.audioWorkletNode = new AudioWorkletNode(this.audioContext, "volume-processor");
      } catch (error) {
        console.error("Failed to load audio worklet module:", error);
        return;
      }

      // Configure analyser (same as collaboration page)
      this.analyser.smoothingTimeConstant = 0.3;
      this.analyser.fftSize = 1024;

      // Connect stream to analyser and worklet
      this.microphone.connect(this.analyser);
      this.analyser.connect(this.audioWorkletNode);
      this.audioWorkletNode.connect(this.audioContext.destination);

      // Listen for volume data from worklet
      this.audioWorkletNode.port.onmessage = (event) => {
        const volume = event.data;
        this.addVolumeBar(volume);
      };
    } catch (error) {
      console.error("Error setting up audio analysis:", error);
    }
  }

  stopAudioAnalysis() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }

    if (this.microphone) {
      this.microphone.disconnect();
      this.microphone = null;
    }

    if (this.analyser) {
      this.analyser.disconnect();
      this.analyser = null;
    }

    if (this.audioWorkletNode) {
      this.audioWorkletNode.disconnect();
      this.audioWorkletNode = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }

  startWaveformAnimation() {
    if (!this.isRecording || this.isPaused) return;

    this.animateWaveform();
  }

  animateWaveform() {
    if (!this.isRecording || this.isPaused) return;

    // Move existing bars to the left
    this.moveWaveformBars();

    // Continue animation
    this.animationFrame = requestAnimationFrame(() => this.animateWaveform());
  }

  addVolumeBar(volume) {
    if (!this.waveform) return;

    // Use the same calculation as collaboration page
    const maxHeight = 30; // Maximum height of the bar in pixels
    const height = Math.min(volume * 500, maxHeight); // Scale the volume to fit the bar height

    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = `${Math.max(height, 2)}px`; // Minimum 2px height
    bar.style.right = "0px"; // Start at the right edge
    bar.style.bottom = "50%"; // Start from the middle
    bar.style.transformOrigin = "bottom"; // Grow from the middle
    this.waveform.appendChild(bar);

    // Keep more bars before deleting (same as collaboration page - 200)
    if (this.waveform.children.length > 200) {
      this.waveform.removeChild(this.waveform.firstChild);
    }
  }

  moveWaveformBars() {
    if (!this.waveform) return;

    // Move all bars to the left (same speed as collaboration page)
    Array.from(this.waveform.children).forEach((child) => {
      const rightPosition = parseFloat(child.style.right) || 0;
      child.style.right = `${rightPosition + 4}px`; // Move left (same as collaboration page)
    });
  }

  resetWaveform() {
    if (this.waveform) {
      this.waveform.innerHTML = ""; // Clear all bars
    }
    this.currentBarIndex = 0;
    this.lastBarTime = 0;
  }

  pauseWaveform() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  resumeWaveform() {
    if (this.isRecording && !this.isPaused) {
      this.startWaveformAnimation();
    }
  }

  showError(message) {
    // You can integrate this with your existing notification system
    console.error("Voice Recorder Error:", message);

    // Show a temporary error message
    if (window.threadsManager && window.threadsManager.showNotification) {
      window.threadsManager.showNotification(message, "error");
    }
  }
}

// Initialize voice recorder when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  window.voiceRecorder = new VoiceRecorder();
});

// Make it globally available
window.VoiceRecorder = VoiceRecorder;
