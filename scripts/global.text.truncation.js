function truncateText(text, maxLength) {
  if (text.length <= maxLength) return { text, isTrunc: false }; // No truncation needed

  let truncated = text.slice(0, maxLength);
  let lastSpace = truncated.lastIndexOf(" "); // Ensure we don’t cut a word in half

  if (lastSpace > 0) {
    truncated = truncated.slice(0, lastSpace); // Cut at last space
  }

  return { text: truncated + "...", isTrunc: true };
}
