document.addEventListener("DOMContentLoaded", function () {
  const textColorButton = document.getElementById("sizemug_text_color--btn");
  const textColorPickrInstance = createPickrInstance("#sizemug_text_color--btn", "#sizemug_text_color_pickr", "custom-pickr");
  const pcrApp = document.querySelector(".custom-pickr");

  pcrApp.id = "sizemug_pcr_text_color";

  textColorButton.addEventListener("click", (event) => {
    event.preventDefault();

    const buttonRect = textColorButton.getBoundingClientRect();
    const pickerRoot = textColorPickrInstance.getRoot().root;

    // Position the picker
    pickerRoot.style.position = "absolute";
    pickerRoot.style.left = `${buttonRect.left}px`;
    pickerRoot.style.top = `${buttonRect.bottom + 5}px`; // Add a small offset

    // Ensure the picker is within the viewport
    setTimeout(() => {
      const pickerRect = pickerRoot.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      if (pickerRect.right > viewportWidth) {
        pickerRoot.style.left = `${viewportWidth - pickerRect.width}px`;
      }

      if (pickerRect.bottom > viewportHeight) {
        pickerRoot.style.top = `${buttonRect.top - pickerRect.height - 5}px`;
      }
    }, 0);

    pcrApp.style.display = "block";
  });

  let focusedEditor = null;

  paperEditors.forEach((editor) => {
    editor.container.addEventListener("focusin", function () {
      focusedEditor = editor;
    });
  });

  textColorPickrInstance.on("save", (color, instance) => {
    const colorValue = color.toHEXA().toString();

    if (focusedEditor) {
      focusedEditor.format("color", colorValue);
    }

    pcrApp.style.display = "none";
  });
});
