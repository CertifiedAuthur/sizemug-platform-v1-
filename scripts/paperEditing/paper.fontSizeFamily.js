// Font family configuration
const fontFamilies = [
  { label: "Arima", value: "Arima" },
  { label: "Geologica", value: "Geologica" },
  { label: "Finlandica", value: "Finlandica" },
  { label: "Inter", value: "Inter" },
  { label: "Montserrat", value: "Montserrat" },
  { label: "Playwrite", value: "Playwrite" },
  { label: "Roboto", value: "Roboto" },
];

const fontSizes = [
  { label: "10px", value: "10px" },
  { label: "12px", value: "12px" },
  { label: "14px", value: "14px" },
  { label: "16px", value: "16px" },
  { label: "18px", value: "18px" },
  { label: "20px", value: "20px" },
  { label: "22px", value: "22px" },
  { label: "24px", value: "24px" },
  { label: "26px", value: "26px" },
  { label: "28px", value: "28px" },
  { label: "30px", value: "30px" },
  { label: "32px", value: "32px" },
  { label: "34px", value: "34px" },
  { label: "36px", value: "36px" },
];

// Register fonts with Quill
const Font = Quill.import("formats/font");
Font.whitelist = fontFamilies.map((family) => family.value);
Quill.register(Font, true);

// Register custom font sizes
const Size = Quill.import("attributors/style/size");
Size.whitelist = fontSizes.map((size) => size.value);
Quill.register(Size, true);

document.addEventListener("DOMContentLoaded", () => {
  const sizemugFontFamilyBtn = document.querySelector("select#sizemug_font_family--btn");
  const sizemugFontSizeBtn = document.querySelector("select#sizemug_font_size--btn");

  // Populate dropdowns
  fontFamilies.forEach((family) => {
    const markup = `<option value="${family.value}">${family.label}</option>`;
    sizemugFontFamilyBtn.insertAdjacentHTML("beforeend", markup);
  });

  fontSizes.forEach((size) => {
    const markup = `<option value="${size.value}">${size.label}</option>`;
    sizemugFontSizeBtn.insertAdjacentHTML("beforeend", markup);
  });

  let focusedEditor = null;

  // Function to update toolbar state
  const updateToolbarState = (editor) => {
    if (!editor) return;

    const format = focusedEditor?.getFormat();

    // Update font family dropdown
    if (format.font) {
      sizemugFontFamilyBtn.value = format.font;
    } else {
      sizemugFontFamilyBtn.value = fontFamilies[0].value;
    }

    // Update font size dropdown
    if (format.size) {
      sizemugFontSizeBtn.value = format.size;
    } else {
      sizemugFontSizeBtn.value = "16px";
    }
  };

  // Track focused editor and update toolbar state
  paperEditors.forEach((editor) => {
    // Handle focus events
    editor.container.addEventListener("focusin", function () {
      focusedEditor = editor;
      updateToolbarState(editor);
    });

    // Handle selection changes
    editor.on("selection-change", function (range) {
      if (editor === focusedEditor && range) {
        updateToolbarState(editor);
      }
    });

    // Handle text changes
    editor.on("text-change", function (delta, oldContents, source) {
      if (editor === focusedEditor) {
        updateToolbarState(editor);
      }
    });
  });

  // Change Font Family
  sizemugFontFamilyBtn.addEventListener("change", (e) => {
    if (!focusedEditor) return;

    const family = e.target.value;
    const range = focusedEditor.getSelection();

    if (range) {
      focusedEditor.format("font", family);
    } else {
      focusedEditor.format("font", family, "user");
    }

    // Update toolbar state after format change
    updateToolbarState(focusedEditor);
  });

  // Change Font Size
  sizemugFontSizeBtn.addEventListener("change", (e) => {
    if (!focusedEditor) return;

    const size = e.target.value;
    const range = focusedEditor.getSelection();

    if (range) {
      focusedEditor.format("size", size);
    } else {
      focusedEditor.format("size", size, "user");
    }

    // Update toolbar state after format change
    updateToolbarState(focusedEditor);
  });
});
