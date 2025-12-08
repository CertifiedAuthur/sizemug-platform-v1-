const emojiList = [
  { label: "Smiling Face", value: "😊" },
  { label: "Laughing Face", value: "😂" },
  { label: "Thumbs Up", value: "👍" },
  { label: "Heart", value: "❤️" },
  { label: "Star", value: "⭐" },
  { label: "Fire", value: "🔥" },
  { label: "Clapping Hands", value: "👏" },
  { label: "Raised Hands", value: "🙌" },
  { label: "Winking Face", value: "😉" },
  { label: "Thinking Face", value: "🤔" },
  { label: "Crying Face", value: "😢" },
  { label: "Angry Face", value: "😡" },
  { label: "Sleepy Face", value: "😴" },
  { label: "Cool Face", value: "😎" },
  { label: "Party Popper", value: "🎉" },
  { label: "Rocket", value: "🚀" },
  { label: "Check Mark", value: "✔️" },
  { label: "X Mark", value: "❌" },
  { label: "Sun", value: "☀️" },
  { label: "Moon", value: "🌙" },
  { label: "Earth", value: "🌍" },
  { label: "Tree", value: "🌳" },
  { label: "Flower", value: "🌸" },
  { label: "Snowflake", value: "❄️" },
  { label: "Umbrella", value: "☂️" },
  { label: "Apple", value: "🍎" },
  { label: "Orange", value: "🍊" },
  { label: "Banana", value: "🍌" },
  { label: "Pineapple", value: "🍍" },
  { label: "Pizza", value: "🍕" },
  { label: "Burger", value: "🍔" },
  { label: "Ice Cream", value: "🍦" },
  { label: "Coffee", value: "☕" },
  { label: "Cake", value: "🎂" },
  { label: "Candy", value: "🍬" },
  { label: "Balloon", value: "🎈" },
  { label: "Gift", value: "🎁" },
  { label: "Camera", value: "📷" },
  { label: "Phone", value: "📱" },
  { label: "Laptop", value: "💻" },
  { label: "Light Bulb", value: "💡" },
  { label: "Book", value: "📚" },
  { label: "Pencil", value: "✏️" },
  { label: "Scissors", value: "✂️" },
  { label: "Clock", value: "⏰" },
  { label: "Anchor", value: "⚓" },
  { label: "Scales", value: "⚖️" },
  { label: "Syringe", value: "💉" },
  { label: "Pill", value: "💊" },
  { label: "Briefcase", value: "💼" },
  { label: "Key", value: "🔑" },
  { label: "Lock", value: "🔒" },
  { label: "Hammer", value: "🔨" },
  { label: "Wrench", value: "🔧" },
  { label: "Paintbrush", value: "🖌️" },
  { label: "Gear", value: "⚙️" },
  { label: "Rocket Ship", value: "🚀" },
  { label: "Car", value: "🚗" },
  { label: "Airplane", value: "✈️" },
  { label: "Boat", value: "🚤" },
  { label: "Train", value: "🚆" },
  { label: "Bus", value: "🚌" },
  { label: "Traffic Light", value: "🚦" },
  { label: "Fuel Pump", value: "⛽" },
  { label: "House", value: "🏠" },
  { label: "School", value: "🏫" },
  { label: "Hospital", value: "🏥" },
  { label: "Bank", value: "🏦" },
  { label: "Post Office", value: "🏤" },
  { label: "Fountain", value: "⛲" },
  { label: "Statue of Liberty", value: "🗽" },
  { label: "Mountain", value: "⛰️" },
  { label: "Volcano", value: "🌋" },
  { label: "Beach", value: "🏖️" },
  { label: "Desert", value: "🏜️" },
  { label: "Forest", value: "🌲" },
  { label: "Cityscape", value: "🏙️" },
  { label: "Map", value: "🗺️" },
  { label: "Compass", value: "🧭" },
  { label: "Bell", value: "🔔" },
  { label: "Flag", value: "🚩" },
  { label: "Trophy", value: "🏆" },
  { label: "Medal", value: "🎖️" },
  { label: "Soccer Ball", value: "⚽" },
  { label: "Basketball", value: "🏀" },
  { label: "Baseball", value: "⚾" },
  { label: "Tennis Ball", value: "🎾" },
  { label: "Golf", value: "🏌️" },
  { label: "Bowling", value: "🎳" },
  { label: "Fishing", value: "🎣" },
  { label: "Camping", value: "🏕️" },
  { label: "Guitar", value: "🎸" },
  { label: "Microphone", value: "🎤" },
  { label: "Drum", value: "🥁" },
];

document.addEventListener("DOMContentLoaded", () => {
  const allEmojisLists = document.getElementById("allEmojisLists");
  allEmojisLists.innerHTML = "";

  emojiList.forEach((emoji) => {
    const { label, value } = emoji;

    const markup = `<button class="emoji_item" data-label="${label}">${value}</button>`;
    allEmojisLists.insertAdjacentHTML("beforeend", markup);
  });

  const closeEmojiContainer = document.getElementById("closeEmojiContainer");
  const noteOptionEmojiContainer = document.getElementById("noteOptionEmojiContainer");

  noteOptionEmojiContainer.addEventListener("click", (e) => {
    if (e.target.id === "noteOptionEmojiContainer") {
      noteOptionEmojiContainer.classList.add(HIDDEN);
    }
  });

  closeEmojiContainer.addEventListener("click", () => {
    noteOptionEmojiContainer.classList.add(HIDDEN);
  });

  const emojiContainer = document.getElementById("emojiContainer");

  emojiContainer.addEventListener("click", (e) => {
    const emojiButton = e.target.closest(".emoji_item");

    if (emojiButton) {
      const { label } = emojiButton.dataset;
      const emoji = emojiList.find((emoji) => emoji.label === label);

      if (sendNoteContentArea.innerHTML === "Type here...") {
        sendNoteContentArea.innerHTML = "";
      }

      sendNoteContentArea.innerHTML = sendNoteContentArea.innerHTML + emoji.value;

      noteOptionEmojiContainer.classList.add(HIDDEN);
    }
  });
});
