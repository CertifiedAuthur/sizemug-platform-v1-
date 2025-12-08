document.addEventListener("DOMContentLoaded", () => {
  const sizemugRectangleShapeBtn = document.getElementById("sizemug_rectangle_shape--btn");
  const sizemugCircleShapeBtn = document.getElementById("sizemug_circle_shape--btn");
  const sizemugTriangleShapeBtn = document.getElementById("sizemug_triangle_shape--btn");

  const rectangleDocumentElement = document.querySelector(".rectangle_document_element");
  const triangleDocumentElement = document.querySelector(".triangle_document_element");
  const circleDocumentElement = document.querySelector(".circle_document_element");

  [sizemugRectangleShapeBtn, rectangleDocumentElement].forEach((button) => {
    button.addEventListener("click", () => {
      const range = focusedEditor.getSelection(true);

      const value = { type: "rectangle", width: "100px", height: "100px", color: "#000" };
      focusedEditor.insertEmbed(range?.index, "shape", value, "user");

      closeDropdownBar(); // close all dropdown
    });
  });

  [sizemugCircleShapeBtn, circleDocumentElement].forEach((button) => {
    button.addEventListener("click", () => {
      const range = focusedEditor.getSelection(true);

      const value = { type: "circle", width: "100px", height: "100px", color: "#000" };
      focusedEditor.insertEmbed(range?.index, "shape", value, "user");

      closeDropdownBar(); // close all dropdown
    });
  });

  [sizemugTriangleShapeBtn, triangleDocumentElement].forEach((button) => {
    button.addEventListener("click", () => {
      const range = focusedEditor.getSelection(true);

      const value = { type: "triangle", width: "100px", height: "100px", color: "#000" };
      focusedEditor.insertEmbed(range?.index, "shape", value, "user");

      closeDropdownBar(); // close all dropdown
    });
  });
});
