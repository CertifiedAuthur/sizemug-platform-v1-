document.addEventListener("DOMContentLoaded", function () {
  const paperEditor = document.getElementById("paper-editor");
  const dropArea = document.getElementById("video_drop_area");
  const importVideoChange = document.getElementById("import_video--input");
  const uploadEditVideo = document.getElementById("upload_edit_video");

  importVideoChange.addEventListener("change", (event) => {
    const files = [...event.target.files];

    handleVideoChange(files);
  });

  dropArea.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropArea.classList.add("highlight"); // apply light background color
  });

  dropArea.addEventListener("dragleave", () => {
    dropArea.classList.remove("highlight"); // remove light background color
  });

  dropArea.addEventListener("drop", (event) => {
    event.preventDefault();

    dropArea.classList.remove("highlight"); // remove light background color

    const files = [...event.dataTransfer.files];
    handleVideoChange(files);
  });

  function handleVideoChange(files) {
    const previewContainer = document.getElementById("import_video_lists");
    previewContainer.innerHTML = ""; // Clear previous preview

    if (files.length > 0) {
      files.forEach((file) => {
        console.log(file.type);
        if (["video/mp4", "video/mov", "video/avi", "video/webm", "video/quicktime"].includes(file.type)) {
          const videoElement = document.createElement("video");
          videoElement.controls = true; // Add video controls like play, pause
          videoElement.width = 600; // Set width for the preview
          videoElement.style.maxWidth = "none"; // set max-width for preview
          videoElement.height = 400; // Set height for the preview
          videoElement.autoplay = true; // Play Automatically

          const reader = new FileReader();
          reader.onload = function (e) {
            videoElement.src = e.target.result; // Set video src to the file data
            console.log(e.target.result);
            previewContainer.querySelector("video").src = e.target.result;
          };
          reader.readAsDataURL(file); // Read the video file as a data URL

          //   previewContainer.appendChild(videoElement);
        } else {
          console.error("Invalid file type");
        }
      });
    }
  }

  //////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////
  /////////////// EMBED VIDEO //////////////////////////////
  //////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////

  uploadEditVideo.addEventListener("click", () => {
    const videoAsideBtns = document.querySelectorAll("#container_nav_btns button");
    const embedContainerCode = document.querySelector("#embed_container #paste_embed_code");
    const tabButton = Array.from(videoAsideBtns).find((btn) => btn.classList.contains("active"));
    const { type } = tabButton.dataset;

    // General Tab
    if (type === "general") {
      console.log("General");
      return;
    }

    // Embed Tab
    if (type === "embed") {
      paperEditor.insertAdjacentHTML("beforeend", embedContainerCode.value);
      embedContainerCode.value = ""; // clear textarea
      importVideoModal.classList.add(HIDDEN); // Hide video Modal
      return;
    }

    // Advanced Tab
    if (type === "advanced") {
      console.log("Adanced");
      return;
    }
  });
});
