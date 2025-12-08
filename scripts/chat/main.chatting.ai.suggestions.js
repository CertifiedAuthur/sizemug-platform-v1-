const aiSuggestionPhrases = ["It's alright", "Amazing", "It's fine", "Hey", "Yesterday", "Cool", "How're you doing", "Noted", "Nice", "See you later", "Great", "Nice to meet you", "Again", "Tomorrow", "Please", "How’s it going?", "Take care", "Catch up later", "Can’t wait to see you", "Forever", "Lol", "Love you", "I hear you", "Wonderful", "I really appreciate it", "Come on", "See you soon", "I miss you", "As soon as possible", "Thanks", "Good", "Okay", "Yes", "Perfect"];
const aiSuggestionTextContainers = document.querySelectorAll(".ai_suggested_texts_wrapper .ai_suggested_texts");

function renderAiSuggestionPhrases(container) {
  aiSuggestionPhrases.forEach((phrase) => {
    const markup = `<button data-message="${phrase}">${phrase}</button>`;

    container.insertAdjacentHTML("beforeend", markup);
  });
}

aiSuggestionTextContainers.forEach((container) => {
  renderAiSuggestionPhrases(container);

  container.addEventListener("click", (e) => {
    const button = e.target.closest("button");

    if (button) {
      const { message } = button.dataset;
      sendMessage(message);
    }
  });
});
