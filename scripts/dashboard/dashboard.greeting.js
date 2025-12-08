///////////////////////////////////////////////
///// Landing Homepage Greeting With API  /////
///////////////////////////////////////////////
const greetContainer = document.querySelector(".greeting_bar");
const greetHeading = document.querySelector(".greeting_bar .content h4");
const greetParagraph = document.querySelector(".greeting_bar .content p");
const greetMorningIcon = document.querySelector(".greeting_bar .current_time .morning");
const greetEveningIcon = document.querySelector(".greeting_bar .current_time .evening");
const greetNightIcon = document.querySelector(".greeting_bar .current_time .night");

const greetingBar = document.querySelector(".greeting_bar");
const greetingBarBtn = document.querySelector(".greeting_bar .cancel");

const greeting_Activity_container = document.querySelector(".landing_page .activity_spotify_greeting");
const firstGreetingChild = greeting_Activity_container.querySelector(".landing_page .activity_spotify_greeting > div:first-child");
const lastGreetingChild = greeting_Activity_container.querySelector(".landing_page .activity_spotify_greeting > div:last-child");

function handleDisplayGreeting(status, headingMessage, message, mornStatus, afterStatus, nightStatus) {
  greetContainer.classList.add(`greeting_bar--${status}`);
  greetHeading.textContent = headingMessage;
  greetParagraph.textContent = message;
  greetMorningIcon.classList[mornStatus](HIDDEN);
  greetEveningIcon.classList[afterStatus](HIDDEN);
  greetNightIcon.classList[nightStatus](HIDDEN);

  const activitySpotifyGreeting = document.getElementById("activitySpotifyGreeting");
  const activitySpotifySkeleton = document.getElementById("activitySpotifySkeleton");

  activitySpotifySkeleton.remove();
  activitySpotifyGreeting.classList.remove(HIDDEN);
}

async function getCoordsPosition() {
  const response = await fetch("https://get.geojs.io/v1/ip/geo.json");
  const res = await response.json();
  return [res.latitude, res.longitude];
}

async function getSunriseSunset(lat, lng) {
  const res = await fetch(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&formatted=0`);
  const { results } = await res.json();
  return {
    sunrise: new Date(results.sunrise),
    sunset: new Date(results.sunset),
  };
}

async function showGreeting() {
  let hour = new Date().getHours();
  // OR, to be fancy, do:
  const [lat, lng] = await getCoordsPosition();
  const { sunrise, sunset } = await getSunriseSunset(lat, lng);
  const now = new Date();
  hour = now < sunrise || now >= sunset ? 0 /*night*/ : now < sunrise.setHours(12) /*morning*/ ? 6 /*morning*/ : now < sunset.setHours(17) /*afternoon*/ ? 13 /*afternoon*/ : 18 /*evening*/;

  // Morning Display Mode
  if (hour >= 5 && hour < 12) {
    const message = "Each morning brings a fresh canvas of tasks awaiting our touch.";
    handleDisplayGreeting("morning", "Good morning", message, "remove", "add", "add");
    return;
  }

  // Afternoon Display Mode
  if ((hour >= 1 && hour < 5) || hour === 12) {
    const message = "Sunset: a reminder of tasks completed, goals pursued.";
    handleDisplayGreeting("evening", "Good afternoon", message, "add", "remove", "add");
    return;
  }

  // Evening Display Mode
  if (hour >= 5 && hour < 9) {
    const message = "Sunset: a reminder of tasks completed, goals pursued.";
    handleDisplayGreeting("evening", "Good evening", message, "add", "add", "remove");
    return;
  }

  // Night Display Mode
  const message = "Nightfall: a pause to rest, recharge, and ready ourselves for tomorrow's tasks.";
  handleDisplayGreeting("night", "Good night", message, "add", "remove", "add");
}
showGreeting();

// mouseenter the greeting container
greetingBar.addEventListener("mouseenter", () => {
  greetingBarBtn.style.opacity = 1;
});

// mouseleave the greeting container
greetingBar.addEventListener("mouseleave", () => {
  greetingBarBtn.style.opacity = 0;
});

// remove the greeting bar container
greetingBarBtn.addEventListener("click", function () {
  greeting_Activity_container.style.flexDirection = "column";
  firstGreetingChild.style.minWidth = "100%";
  lastGreetingChild.style.minWidth = "100%";
  greetingBar.classList.add(HIDDEN);
});
