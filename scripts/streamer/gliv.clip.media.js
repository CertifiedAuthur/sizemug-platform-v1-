const savedClips = [
  {
    id: 1,
    type: "video",
  },

  {
    id: 2,
    type: "image",
  },

  {
    id: 3,
    type: "image",
  },

  {
    id: 4,
    type: "image",
  },
];

class ClipsModal {
  constructor() {
    this.button = document.getElementById("createClipBtn");
    this.modal = document.getElementById("clipMediaModal");
    this.container = this.modal.querySelector(".boosts_modal_container");
    this.takePhotoClip = document.getElementById("takePhotoClip");
    this.takeVideoClip = document.getElementById("takeVideoClip");
    this.captureOverlay = document.getElementById("captureOverlay");
    this.captureBox = document.getElementById("captureBox");
    this.cancelCapture = document.getElementById("cancelCapture");
    this.saveCapture = document.getElementById("saveCapture");
    this.asideClipsSlider = document.getElementById("asideClipsSlider");
    this.asideSlidesItems = document.querySelectorAll(".aside_slides_containers");
    this.clipsBack = document.getElementById("clipsBack");
    this.asideChatSlider = document.getElementById("asideChatSlider");
    this.viewAllClips = document.getElementById("viewAllClips");
    this.clipHeaderTab = document.getElementById("clipHeaderTab");
    this.clipMediaGrid = document.getElementById("clipMediaGrid");

    this.popperInstance = null;
    this.isVisible = false;

    this.button.addEventListener("click", (e) => {
      if (this.isVisible) {
        this.hide();
      } else {
        this.show();
      }
    });

    //
    this.clipHeaderTab.addEventListener("click", (e) => {
      const button = e.target.closest("button");

      if (button) {
        const { key } = button.dataset;
        const allButtons = this.clipHeaderTab.querySelectorAll("button");

        let clips;
        if (key === "videos") {
          clips = savedClips.filter((d) => d.type === "video");
        } else if (key === "images") {
          clips = savedClips.filter((d) => d.type === "image");
        } else {
          clips = savedClips;
        }

        allButtons.forEach((btn) => btn.removeAttribute("data-active"));
        button.setAttribute("data-active", "");
        this._renderClips(clips);
      }
    });

    // Take photo clip
    this.takePhotoClip.addEventListener("click", () => {
      this.hide();
      this.captureOverlay.classList.remove(HIDDEN);

      this.initializeCaptureBox();
    });

    // Take video clip
    this.takeVideoClip.addEventListener("click", () => {
      this.hide();
      this.captureOverlay.classList.remove(HIDDEN);

      this.initializeCaptureBox();
    });

    // show aside clips container
    this.viewAllClips.addEventListener("click", () => {
      this.asideSlidesItems.forEach((item) => item.classList.add(HIDDEN));
      this.asideClipsSlider.classList.remove(HIDDEN);
    });

    // Hide modal when clicking outside
    document.addEventListener("click", (e) => {
      if (!e.target.closest("#clipMediaModal") && !e.target.closest("#createClipBtn") && this.isVisible) {
        this.hide();
      }
    });

    // Cancel capture
    this.cancelCapture.addEventListener("click", () => {
      this.captureOverlay.classList.add(HIDDEN);
    });

    // Save capture
    this.saveCapture.addEventListener("click", () => {
      this.handleCapture();

      this.asideSlidesItems.forEach((item) => item.classList.add(HIDDEN));
      this.asideClipsSlider.classList.remove(HIDDEN);
    });

    // Go back to chat
    this.clipsBack.addEventListener("click", () => {
      this.asideSlidesItems.forEach((item) => item.classList.add(HIDDEN));
      this.asideChatSlider.classList.remove(HIDDEN);
    });

    // Add to global modal management
    window.clipModalInstance = this;

    this._renderClips(savedClips);
  }

  _renderClips(data) {
    this.clipMediaGrid.innerHTML = "";

    data.forEach((d) => {
      const isVideo = d.type === "video";

      const markup = `
        <div class="clip_media_item" data-clip-id="${d.id}">
          <div class="clip_media_item_content">
          </div>

          <div class="clip_media_tools">
            <button class="clip_media_options">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><circle cx="2.5" cy="8" r=".75"></circle><circle cx="8" cy="8" r=".75"></circle><circle cx="13.5" cy="8" r=".75"></circle></g></svg>
            </button>
            ${
              isVideo
                ? `<button class="play_media">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="4"><path d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z"></path><path d="M20 24v-6.928l6 3.464L32 24l-6 3.464l-6 3.464z"></path></g></svg>
            </button>`
                : ""
            }
            <time>00:23</time>
          </div>
        </div>
      `;

      this.clipMediaGrid.insertAdjacentHTML("beforeend", markup);
    });
  }

  // Handle capture
  handleCapture() {
    html2canvas(document.body).then((canvas) => {
      const { left, top, width, height } = this.captureBox.getBoundingClientRect();

      if (width === 0 || height === 0) {
        console.error("Invalid crop size – make sure the box is visible and has non-zero dimensions.");
        return;
      }
      const x = left + window.scrollX;
      const y = top + window.scrollY;

      const cropped = document.createElement("canvas");
      cropped.width = width;
      cropped.height = height;
      const ctx = cropped.getContext("2d");
      ctx.drawImage(canvas, x, y, width, height, 0, 0, width, height);

      // Use toBlob with a MIME type so blob is definitely created
      cropped.toBlob((blob) => {
        if (!blob) {
          console.error("Failed to generate blob from canvas");
          return;
        }

        // Create an object URL from that blob
        const url = URL.createObjectURL(blob);

        // Trigger download
        const a = document.createElement("a");
        a.href = url;
        a.download = "partial-screenshot.png";
        document.body.appendChild(a); // needed for Firefox
        a.click();
        a.remove();

        // Clean up
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }, "image/png"); // specify type explicitly

      // now hide overlay
      this.captureOverlay.classList.add(HIDDEN);
    });
  }

  // Initialize capture box
  initializeCaptureBox() {
    interact(this.captureBox)
      .draggable({
        modifiers: [
          interact.modifiers.restrictRect({
            restriction: this.captureBox.parentElement,
            endOnly: true,
          }),
        ],
        onmove: dragMoveListener,
      })
      .resizable({
        // tell Interact which edges/handles to use
        edges: {
          top: ".resize_handler--top-left, .resize_handler--top-right",
          bottom: ".resize_handler--bottom-left, .resize_handler--bottom-right",
          left: ".resize_handler--top-left, .resize_handler--bottom-left",
          right: ".resize_handler--top-right, .resize_handler--bottom-right",
        },
        modifiers: [
          // 1. keep the *box’s edges* inside the parent
          interact.modifiers.restrictEdges({
            outer: this.captureBox.parentElement,
            endOnly: true,
          }),

          // 2. optional: min/max size
          interact.modifiers.restrictSize({
            min: { width: 100, height: 100 },
            max: {
              width: this.captureBox.parentElement.clientWidth,
              height: this.captureBox.parentElement.clientHeight,
            },
          }),
        ],
        inertia: true,
      })
      .on("resizemove", function (event) {
        let { x, y } = event.target.dataset;

        x = (parseFloat(x) || 0) + event.deltaRect.left;
        y = (parseFloat(y) || 0) + event.deltaRect.top;

        // update the element’s style
        Object.assign(event.target.style, {
          width: `${event.rect.width}px`,
          height: `${event.rect.height}px`,
          transform: `translate(${x}px, ${y}px)`,
        });

        // store the translation for next time
        event.target.dataset.x = x;
        event.target.dataset.y = y;
      });

    // Optional draggable listener
    function dragMoveListener(event) {
      const target = event.target;
      let x = (parseFloat(target.dataset.x) || 0) + event.dx;
      let y = (parseFloat(target.dataset.y) || 0) + event.dy;

      target.style.transform = `translate(${x}px, ${y}px)`;
      target.dataset.x = x;
      target.dataset.y = y;
    }
  }

  show() {
    // Close other modals first
    window.closeAllLiveModals && window.closeAllLiveModals();

    this.isVisible = true;
    this.modal.classList.remove("streamer-hidden");
    this.button.classList.add("active");
    this.container.classList.add("modal-anim-in");
    this.container.classList.remove("modal-anim-out");
    if (this.popperInstance) this.popperInstance.destroy();
    this.popperInstance = Popper.createPopper(this.button, this.modal, {
      placement: "top",
      modifiers: [
        {
          name: "offset",
          options: { offset: [0, 10] },
        },
        {
          name: "computeStyles",
          options: { gpuAcceleration: false },
        },
      ],
    });
  }

  hide() {
    this.isVisible = false;
    this.modal.classList.add("streamer-hidden");
    this.button.classList.remove("active");
    this.container.classList.remove("modal-anim-in");
    this.container.classList.add("modal-anim-out");
    this.container.addEventListener(
      "animationend",
      () => {
        if (this.modal.classList.contains("streamer-hidden")) {
          // Animation completed, modal is hidden
        }
      },
      { once: true }
    );
    if (this.popperInstance) {
      this.popperInstance.destroy();
      this.popperInstance = null;
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new ClipsModal();
});
