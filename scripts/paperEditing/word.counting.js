document.addEventListener("DOMContentLoaded", function () {
  function countWordsAndCharacters() {
    let text = focusedEditor.getText(); // Get plain text from the editor
    let wordCount = 0;
    let charCount = text.length; // Character count includes spaces

    text = text.trim();

    if (text.length > 0) {
      wordCount = text.split(/\s+/).length; // Split by spaces or any whitespace and count
    }

    return { wordCount, charCount };
  }

  focusedEditor.on("text-change", function () {
    const counts = countWordsAndCharacters();
    document.getElementById("word_counting").innerText = counts.wordCount;
    document.getElementById("char_counting").innerText = counts.charCount;
  });
});
