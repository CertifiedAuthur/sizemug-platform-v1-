let loggedIn = false;

//Hide aside links if not logged in

// Mobile view open and close aside menu start
let menuOpen = false;
function toggleMenu() {
  const aside = document.querySelector("#aside");
  menuOpen = !menuOpen;
  aside.classList.toggle("show-aside", menuOpen);
}
// Mobile view open and close aside menu end

//News aside list menu start
document
  .querySelector(".aside-news-list-toggle")
  .addEventListener("change", (e) => {
    if (e.target.checked) {
      document
        .querySelector(".aside-news-list-container")
        .classList.add("show-aside-news-list");
    } else {
      document
        .querySelector(".aside-news-list-container")
        .classList.remove("show-aside-news-list");
    }
  });
//News aside list menu end

//Header compose drop down menu start
var dropdown = document.querySelector(".header-compose-selection");
var button = document.querySelector(".right-section-logged-in-compose");
var button_icon = document.querySelector(
  ".right-section-logged-in-compose > span"
);
var button_p = document.querySelector(".right-section-logged-in-compose > p");

document.addEventListener("click", function (event) {
  if (
    event.target === button ||
    event.target === button_icon ||
    event.target === button_p
  ) {
    dropdown.style.display =
      dropdown.style.display === "grid" ? "none" : "grid";
  } else if (
    dropdown.style.display === "grid" &&
    !dropdown.contains(event.target)
  ) {
    dropdown.style.display = "none";
  }
});

// Explore Carousel start
const carouselData = [
  {
    title: "We invest in the world's potential 1",
    content:
      "Here at flowbite we focus on markets where technology, innovation, and capital can unlock long-term value and drive economic growth.",
    button: "Learn more",
  },
  {
    title: "We invest in the world's potential 2",
    content:
      "Here at flowbite we focus on markets where technology, innovation, and capital can unlock long-term value and drive economic growth.",
    button: "Learn more",
  },
  {
    title: "We invest in the world's potential 3",
    content:
      "Here at flowbite we focus on markets where technology, innovation, and capital can unlock long-term value and drive economic growth.",
    button: "Learn more",
  },
  {
    title: "We invest in the world's potential 4",
    content:
      "Here at flowbite we focus on markets where technology, innovation, and capital can unlock long-term value and drive economic growth.",
    button: "Learn more",
  },
  {
    title: "We invest in the world's potential 5",
    content:
      "Here at flowbite we focus on markets where technology, innovation, and capital can unlock long-term value and drive economic growth.",
    button: "Learn more",
  },
];

let carouselIndex = 0;

const carouselSec = carouselData.map((ele) => {
  return `<li class="carousel-container">
      <div class="carousel-wrapper">
        <p class="carousel-wrapper-title">${ele.title}</p>
        <p class="carousel-wrapper-content">${ele.content}</p>
        <button class="carousel-wrapper-btn">
          ${ele.button}
          <span class="material-symbols-sharp">arrow_right_alt</span>
        </button>
      </div>
    </li>`;
});

document
  .querySelector(".carousel-main")
  .insertAdjacentHTML("afterbegin", carouselSec.join(""));

function switchCarousel() {
  const carouselElements = document.querySelectorAll(".carousel-container");

  carouselElements.forEach((ele) => {
    ele.style.translate = `-${carouselIndex}00% 0`;
    ele.style.transition = `all`;
  });
}

const leftArrow = document.querySelector(".carousel-nav-left-arrow");
const rightArrow = document.querySelector(".carousel-nav-right-arrow");

leftArrow.setAttribute("disabled", "true");
rightArrow.removeAttribute("disabled");

leftArrow.addEventListener("click", () => {
  if (carouselIndex > 0) {
    carouselIndex = carouselIndex - 1;
  }

  if (carouselIndex === 0) {
    leftArrow.setAttribute("disabled", true);
  } else {
    leftArrow.removeAttribute("disabled");
  }

  if (carouselIndex + 1 === carouselData.length) {
    rightArrow.setAttribute("disabled", true);
  } else {
    rightArrow.removeAttribute("disabled");
  }

  document.querySelector(".carousel-nav-text > span").textContent =
    carouselIndex + 1;
  switchCarousel();
});

rightArrow.addEventListener("click", () => {
  if (carouselIndex < carouselData.length - 1) {
    carouselIndex = carouselIndex + 1;
  }

  if (carouselIndex === 0) {
    leftArrow.setAttribute("disabled", true);
  } else {
    leftArrow.removeAttribute("disabled");
  }

  if (carouselIndex + 1 === carouselData.length) {
    rightArrow.setAttribute("disabled", true);
  } else {
    rightArrow.removeAttribute("disabled");
  }

  document.querySelector(".carousel-nav-text > span").textContent =
    carouselIndex + 1;
  switchCarousel();
});

document.querySelector(".carousel-length").textContent = carouselData.length;
switchCarousel();
// Explore Carousel end

// News list start
const newsPosts = [
  {
    id: "1",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1721249917/Venswap/avatars/exz16olfhmblrw6adwbx.png",
  },
  {
    id: "2",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563138/Venswap/listings/rgwrgwrg/hzovsrha3u5xbvnu4bwk.jpg",
  },
  {
    id: "3",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563134/Venswap/listings/rgwrgwrg/mgpb5sjq1jw5kvwaniaf.jpg",
  },
  {
    id: "4",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1721249917/Venswap/avatars/exz16olfhmblrw6adwbx.png",
  },
  {
    id: "5",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563138/Venswap/listings/rgwrgwrg/hzovsrha3u5xbvnu4bwk.jpg",
  },
  {
    id: "6",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563134/Venswap/listings/rgwrgwrg/mgpb5sjq1jw5kvwaniaf.jpg",
  },
  {
    id: "7",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1721249917/Venswap/avatars/exz16olfhmblrw6adwbx.png",
  },
  {
    id: "8",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563138/Venswap/listings/rgwrgwrg/hzovsrha3u5xbvnu4bwk.jpg",
  },
  {
    id: "9",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563134/Venswap/listings/rgwrgwrg/mgpb5sjq1jw5kvwaniaf.jpg",
  },
  {
    id: "10",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1721249917/Venswap/avatars/exz16olfhmblrw6adwbx.png",
  },
  {
    id: "11",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563138/Venswap/listings/rgwrgwrg/hzovsrha3u5xbvnu4bwk.jpg",
  },
  {
    id: "12",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563134/Venswap/listings/rgwrgwrg/mgpb5sjq1jw5kvwaniaf.jpg",
  },
  {
    id: "13",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563134/Venswap/listings/rgwrgwrg/mgpb5sjq1jw5kvwaniaf.jpg",
  },
  {
    id: "14",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1721249917/Venswap/avatars/exz16olfhmblrw6adwbx.png",
  },
  {
    id: "15",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563138/Venswap/listings/rgwrgwrg/hzovsrha3u5xbvnu4bwk.jpg",
  },
  {
    id: "16",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563134/Venswap/listings/rgwrgwrg/mgpb5sjq1jw5kvwaniaf.jpg",
  },
];

const newsList = (amount) =>
  newsPosts.slice(0, amount ?? 20).map((post) => {
    return `<div id="link" data-target="News_article" class="news-main-list-card">
      <img
        src=${post.image}
        alt=""
        class="news-main-list-img"
      />
      <div class="news-main-list-content">
        <p class="news-main-list-content-category">
          ${post.category}
        </p>
        <p class="news-main-list-content-title">${post.title}</p>
        <p class="news-main-list-content-text">
          ${post.content.slice(0, 127)}
          ${post.content.length > 127 && "..."}
        </p>
      </div>
    </div>`;
  });

function mapList(dom, func, amt) {
  // console.log(func);
  document
    .querySelector(dom)
    .insertAdjacentHTML("afterbegin", func(amt).join(""));
}

mapList(".news-main-list", newsList);
// News list end

//News article news list start
mapList(".news-article-news-main-list", newsList, 4);
//News article news list end

// Events start
const eventsList = [
  {
    id: "1",
    category: "Physical",
    title: "Noteworthy technology acquisitions 2021",
    location: "36 Guild Street London, UK",
    link: "#",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1721249917/Venswap/avatars/exz16olfhmblrw6adwbx.png",
  },
  {
    id: "2",
    category: "Physical",
    title: "Noteworthy technology acquisitions 2021",
    location: "36 Guild Street London, UK",
    link: "#",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563138/Venswap/listings/rgwrgwrg/hzovsrha3u5xbvnu4bwk.jpg",
  },
  {
    id: "3",
    category: "Virtual",
    title: "Noteworthy technology acquisitions 2021",
    location: "Online",
    link: "#",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563134/Venswap/listings/rgwrgwrg/mgpb5sjq1jw5kvwaniaf.jpg",
  },
  {
    id: "4",
    category: "Virtual",
    title: "Noteworthy technology acquisitions 2021",
    location: "Online",
    link: "#",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1721249917/Venswap/avatars/exz16olfhmblrw6adwbx.png",
  },
  {
    id: "5",
    category: "Physical",
    title: "Noteworthy technology acquisitions 2021",
    location: "36 Guild Street London, UK",
    link: "#",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563138/Venswap/listings/rgwrgwrg/hzovsrha3u5xbvnu4bwk.jpg",
  },
  {
    id: "6",
    category: "Virtual",
    title: "Noteworthy technology acquisitions 2021",
    location: "Online",
    link: "#",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563134/Venswap/listings/rgwrgwrg/mgpb5sjq1jw5kvwaniaf.jpg",
  },
  {
    id: "7",
    category: "Physical",
    title: "Noteworthy technology acquisitions 2021",
    location: "36 Guild Street London, UK",
    link: "#",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1721249917/Venswap/avatars/exz16olfhmblrw6adwbx.png",
  },
  {
    id: "8",
    category: "Virtual",
    title: "Noteworthy technology acquisitions 2021",
    location: "Online",
    link: "#",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563138/Venswap/listings/rgwrgwrg/hzovsrha3u5xbvnu4bwk.jpg",
  },
  {
    id: "9",
    category: "Virtual",
    title: "Noteworthy technology acquisitions 2021",
    location: "Online",
    link: "#",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563134/Venswap/listings/rgwrgwrg/mgpb5sjq1jw5kvwaniaf.jpg",
  },
  {
    id: "10",
    category: "Physical",
    title: "Noteworthy technology acquisitions 2021",
    location: "36 Guild Street London, UK",
    link: "#",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1721249917/Venswap/avatars/exz16olfhmblrw6adwbx.png",
  },
  {
    id: "11",
    category: "Physical",
    title: "Noteworthy technology acquisitions 2021",
    location: "36 Guild Street London, UK",
    link: "#",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563138/Venswap/listings/rgwrgwrg/hzovsrha3u5xbvnu4bwk.jpg",
  },
  {
    id: "12",
    category: "Virtual",
    title: "Noteworthy technology acquisitions 2021",
    location: "Online",
    link: "#",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563134/Venswap/listings/rgwrgwrg/mgpb5sjq1jw5kvwaniaf.jpg",
  },
  {
    id: "13",
    category: "Virtual",
    title: "Noteworthy technology acquisitions 2021",
    location: "Online",
    link: "#",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563134/Venswap/listings/rgwrgwrg/mgpb5sjq1jw5kvwaniaf.jpg",
  },
  {
    id: "14",
    category: "Physical",
    title: "Noteworthy technology acquisitions 2021",
    location: "36 Guild Street London, UK",
    link: "#",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1721249917/Venswap/avatars/exz16olfhmblrw6adwbx.png",
  },
  {
    id: "15",
    category: "Physical",
    title: "Noteworthy technology acquisitions 2021",
    location: "36 Guild Street London, UK",
    link: "#",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563138/Venswap/listings/rgwrgwrg/hzovsrha3u5xbvnu4bwk.jpg",
  },
  {
    id: "16",
    category: "Physical",
    title: "Noteworthy technology acquisitions 2021",
    location: "36 Guild Street London, UK",
    link: "#",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563134/Venswap/listings/rgwrgwrg/mgpb5sjq1jw5kvwaniaf.jpg",
  },
];
const events = (amount) =>
  eventsList.slice(0, amount ?? 20).map((event) => {
    return `<div id="link" data-target="Event_article" class="events-main-card">
      <img
        src=${event.image}
        alt=""
        class="events-main-card-img"
      />
      <div class="events-main-card-content">
        <p class="events-main-card-content-title">
          ${event.title}
        </p>
        <a href="${event.link}" class="events-main-card-content-link">
          Watch event
          <span class="material-symbols-sharp">
            arrow_right_alt
          </span>
        </a>        
          ${
            event.category === "Physical"
              ? `<p class="events-main-card-content-location">
                    <span class="material-symbols-sharp">
                      location_on
                    </span> ${event.location}
                  </p>`
              : ``
          }        
      </div>
    </div>`;
  });

mapList(".events-main-list", events);
// Events end

//Events article news list start
mapList(".news-article-short-event-list-main", events, 4);
//Events article news list end

//Active holiday category start
const holidayCategoryBtns = document.querySelectorAll(
  ".holidays-category-navigation-btn"
);
let activeHolidayCategory;

holidayCategoryBtns.forEach((link) => {
  link.addEventListener("click", () => {
    // Remove active class from all Links
    holidayCategoryBtns.forEach((l) =>
      l.classList.remove("active-holidays-category-navigation-btn")
    );

    // Add active class to the clicked link
    link.classList.add("active-holidays-category-navigation-btn");

    //Hide main title
    document.querySelector(".holidays-main-title").style.display = "none";
    document.querySelector(".holiday-main-filter-flex").style.display = "flex";

    //Get text content of current active link
    document.querySelector(".holiday-main-filter-title").textContent =
      document.querySelector(
        ".active-holidays-category-navigation-btn"
      ).textContent;
  });
});

//Clear filter
document
  .querySelector(".holiday-main-filter-clear-btn")
  .addEventListener("click", () => {
    holidayCategoryBtns.forEach((l) =>
      l.classList.remove("active-holidays-category-navigation-btn")
    );
    document.querySelector(".holiday-main-filter-title").textContent = "All";
    document.querySelector(".holidays-main-title").style.display = "grid";
    document.querySelector(".holiday-main-filter-flex").style.display = "none";
  });
//Active holiday category end

// Holidays list start
const holidaysList = [
  {
    id: "1",
    category: "Unique Experience",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1721249917/Venswap/avatars/exz16olfhmblrw6adwbx.png",
    title: "Top Solo Travel Destinations for 2024",
  },
  {
    id: "2",
    category: "Unique Experience",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563138/Venswap/listings/rgwrgwrg/hzovsrha3u5xbvnu4bwk.jpg",
    title: "Eco-Friendly Destinations for Conscious Travelers",
  },
  {
    id: "3",
    category: "Sustainable Travel",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563134/Venswap/listings/rgwrgwrg/mgpb5sjq1jw5kvwaniaf.jpg",
    title: "Mastering the Art of Packing Light",
  },
  {
    id: "4",
    category: "Sustainable Travel",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1719021333/Venswap/listings/Azure%20Bay%20Hotel/c1ocqq9c5n2ovyi9x2cd.jpg",
    title: "Top Festivals Around the World You Can't Miss",
  },
  {
    id: "5",
    category: "Travel Photography",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1721249917/Venswap/avatars/exz16olfhmblrw6adwbx.png",
    title: "Top Solo Travel Destinations for 2024",
  },
  {
    id: "6",
    category: "Travel Photography",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563138/Venswap/listings/rgwrgwrg/hzovsrha3u5xbvnu4bwk.jpg",
    title: "Eco-Friendly Destinations for Conscious Travelers",
  },
  {
    id: "7",
    category: "Budget Travel",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563134/Venswap/listings/rgwrgwrg/mgpb5sjq1jw5kvwaniaf.jpg",
    title: "Mastering the Art of Packing Light",
  },
  {
    id: "8",
    category: "Budget Travel",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1721249917/Venswap/avatars/exz16olfhmblrw6adwbx.png",
    title: "Top Festivals Around the World You Can't Miss",
  },
  {
    id: "9",
    category: "Unique Experience",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1719021333/Venswap/listings/Azure%20Bay%20Hotel/c1ocqq9c5n2ovyi9x2cd.jpg",
    title: "Top Solo Travel Destinations for 2024",
  },
  {
    id: "10",
    category: "Budget Travel",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563138/Venswap/listings/rgwrgwrg/hzovsrha3u5xbvnu4bwk.jpg",
    title: "Eco-Friendly Destinations for Conscious Travelers",
  },
  {
    id: "11",
    category: "Unique Experience",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563134/Venswap/listings/rgwrgwrg/mgpb5sjq1jw5kvwaniaf.jpg",
    title: "Mastering the Art of Packing Light",
  },
  {
    id: "12",
    category: "Budget Travel",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1721249917/Venswap/avatars/exz16olfhmblrw6adwbx.png",
    title: "Top Festivals Around the World You Can't Miss",
  },
  {
    id: "13",
    category: "Unique Experience",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1719021333/Venswap/listings/Azure%20Bay%20Hotel/c1ocqq9c5n2ovyi9x2cd.jpg",
    title: "Top Solo Travel Destinations for 2024",
  },
  {
    id: "14",
    category: "Travel Photography",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563138/Venswap/listings/rgwrgwrg/hzovsrha3u5xbvnu4bwk.jpg",
    title: "Eco-Friendly Destinations for Conscious Travelers",
  },
  {
    id: "15",
    category: "Travel Photography",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563134/Venswap/listings/rgwrgwrg/mgpb5sjq1jw5kvwaniaf.jpg",
    title: "Mastering the Art of Packing Light",
  },
  {
    id: "16",
    category: "Travel Photography",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1721249917/Venswap/avatars/exz16olfhmblrw6adwbx.png",
    title: "Top Festivals Around the World You Can't Miss",
  },
];

const holidays = (amount) =>
  holidaysList.slice(0, amount ?? 20).map((holiday) => {
    return `<div id="link" data-target="Holiday_article" class="holidays-main-card">
      <div class="holidays-main-card-img-link">
        <img
          src=${holiday.image}
          alt=""
          class="holidays-main-card-img"
        />
        <a href="#" class="holidays-main-card-content-link">
            <span class="material-symbols-sharp">
              arrow_right_alt
            </span>
          </a>
      </div>
      <div class="holidays-main-card-content">
        <p class="holidays-main-card-content-title">
          ${holiday.title}
        </p>
           
      </div>
    </div>`;
  });

mapList(".holidays-main-list", holidays);
// Holidays list end

//Holiday article news list start
mapList(".holiday-article-short-holiday-list-main", holidays, 4);
//Holiday article news list end

// Finance start
const financePosts = [
  {
    id: "1",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1721249917/Venswap/avatars/exz16olfhmblrw6adwbx.png",
  },
  {
    id: "2",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563138/Venswap/listings/rgwrgwrg/hzovsrha3u5xbvnu4bwk.jpg",
  },
  {
    id: "3",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563134/Venswap/listings/rgwrgwrg/mgpb5sjq1jw5kvwaniaf.jpg",
  },
  {
    id: "4",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1721249917/Venswap/avatars/exz16olfhmblrw6adwbx.png",
  },
  {
    id: "5",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563138/Venswap/listings/rgwrgwrg/hzovsrha3u5xbvnu4bwk.jpg",
  },
  {
    id: "6",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563134/Venswap/listings/rgwrgwrg/mgpb5sjq1jw5kvwaniaf.jpg",
  },
  {
    id: "7",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1721249917/Venswap/avatars/exz16olfhmblrw6adwbx.png",
  },
  {
    id: "8",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563138/Venswap/listings/rgwrgwrg/hzovsrha3u5xbvnu4bwk.jpg",
  },
  {
    id: "9",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563134/Venswap/listings/rgwrgwrg/mgpb5sjq1jw5kvwaniaf.jpg",
  },
  {
    id: "10",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1721249917/Venswap/avatars/exz16olfhmblrw6adwbx.png",
  },
  {
    id: "11",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563138/Venswap/listings/rgwrgwrg/hzovsrha3u5xbvnu4bwk.jpg",
  },
  {
    id: "12",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563134/Venswap/listings/rgwrgwrg/mgpb5sjq1jw5kvwaniaf.jpg",
  },
  {
    id: "13",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563134/Venswap/listings/rgwrgwrg/mgpb5sjq1jw5kvwaniaf.jpg",
  },
  {
    id: "14",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1721249917/Venswap/avatars/exz16olfhmblrw6adwbx.png",
  },
  {
    id: "15",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563138/Venswap/listings/rgwrgwrg/hzovsrha3u5xbvnu4bwk.jpg",
  },
  {
    id: "16",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563134/Venswap/listings/rgwrgwrg/mgpb5sjq1jw5kvwaniaf.jpg",
  },
];

const financeList = (amount) =>
  financePosts.slice(0, amount ?? 20).map((post) => {
    return `<div id="link" data-target="Finance_article" class="finance-main-list-card">
      <img
        src=${post.image}
        alt=""
        class="finance-main-list-img"
      />
      <div class="finance-main-list-content">
        <p class="finance-main-list-content-category">
          ${post.category}
        </p>
        <p class="finance-main-list-content-title">${post.title}</p>
        <p class="finance-main-list-content-text">
          ${post.content.slice(0, 127)}
          ${post.content.length > 127 && "..."}
        </p>
      </div>
    </div>`;
  });

mapList(".finance-main-list", financeList);
// Finance end

//Finance article finance list start
mapList(".finance-article-finance-main-list", financeList, 4);
//Finance article finance list end

//Scholarship start
const scholarshipPosts = [
  {
    id: "1",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1721249917/Venswap/avatars/exz16olfhmblrw6adwbx.png",
  },
  {
    id: "2",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563138/Venswap/listings/rgwrgwrg/hzovsrha3u5xbvnu4bwk.jpg",
  },
  {
    id: "3",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563134/Venswap/listings/rgwrgwrg/mgpb5sjq1jw5kvwaniaf.jpg",
  },
  {
    id: "4",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1721249917/Venswap/avatars/exz16olfhmblrw6adwbx.png",
  },
  {
    id: "5",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563138/Venswap/listings/rgwrgwrg/hzovsrha3u5xbvnu4bwk.jpg",
  },
  {
    id: "6",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563134/Venswap/listings/rgwrgwrg/mgpb5sjq1jw5kvwaniaf.jpg",
  },
  {
    id: "7",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1721249917/Venswap/avatars/exz16olfhmblrw6adwbx.png",
  },
  {
    id: "8",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563138/Venswap/listings/rgwrgwrg/hzovsrha3u5xbvnu4bwk.jpg",
  },
  {
    id: "9",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563134/Venswap/listings/rgwrgwrg/mgpb5sjq1jw5kvwaniaf.jpg",
  },
  {
    id: "10",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1721249917/Venswap/avatars/exz16olfhmblrw6adwbx.png",
  },
  {
    id: "11",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563138/Venswap/listings/rgwrgwrg/hzovsrha3u5xbvnu4bwk.jpg",
  },
  {
    id: "12",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563134/Venswap/listings/rgwrgwrg/mgpb5sjq1jw5kvwaniaf.jpg",
  },
  {
    id: "13",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563134/Venswap/listings/rgwrgwrg/mgpb5sjq1jw5kvwaniaf.jpg",
  },
  {
    id: "14",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1721249917/Venswap/avatars/exz16olfhmblrw6adwbx.png",
  },
  {
    id: "15",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563138/Venswap/listings/rgwrgwrg/hzovsrha3u5xbvnu4bwk.jpg",
  },
  {
    id: "16",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563134/Venswap/listings/rgwrgwrg/mgpb5sjq1jw5kvwaniaf.jpg",
  },
];

const scholarshipList = (amount) =>
  scholarshipPosts.slice(0, amount ?? 20).map((post) => {
    return `<div id="link" data-target="Scholarship_article" class="scholarship-main-list-card">
      <img
        src=${post.image}
        alt=""
        class="scholarship-main-list-img"
      />
      <div class="scholarship-main-list-content">
        <p class="scholarship-main-list-content-category">
          ${post.category}
        </p>
        <p class="scholarship-main-list-content-title">${post.title}</p>
        <p class="scholarship-main-list-content-text">
          ${post.content.slice(0, 127)}
          ${post.content.length > 127 && "..."}
        </p>
      </div>
    </div>`;
  });

mapList(".scholarship-main-list", scholarshipList);
//Scholarship end

//Scholarship article scholarship list start
mapList(".scholarship-article-short-scholarship-list-main", scholarshipList, 4);
//Scholarship article scholarship list end

//Business start
const businessPosts = [
  {
    id: "1",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1721249917/Venswap/avatars/exz16olfhmblrw6adwbx.png",
  },
  {
    id: "2",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563138/Venswap/listings/rgwrgwrg/hzovsrha3u5xbvnu4bwk.jpg",
  },
  {
    id: "3",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563134/Venswap/listings/rgwrgwrg/mgpb5sjq1jw5kvwaniaf.jpg",
  },
  {
    id: "4",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1721249917/Venswap/avatars/exz16olfhmblrw6adwbx.png",
  },
  {
    id: "5",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563138/Venswap/listings/rgwrgwrg/hzovsrha3u5xbvnu4bwk.jpg",
  },
  {
    id: "6",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563134/Venswap/listings/rgwrgwrg/mgpb5sjq1jw5kvwaniaf.jpg",
  },
  {
    id: "7",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1721249917/Venswap/avatars/exz16olfhmblrw6adwbx.png",
  },
  {
    id: "8",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563138/Venswap/listings/rgwrgwrg/hzovsrha3u5xbvnu4bwk.jpg",
  },
  {
    id: "9",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563134/Venswap/listings/rgwrgwrg/mgpb5sjq1jw5kvwaniaf.jpg",
  },
  {
    id: "10",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1721249917/Venswap/avatars/exz16olfhmblrw6adwbx.png",
  },
  {
    id: "11",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563138/Venswap/listings/rgwrgwrg/hzovsrha3u5xbvnu4bwk.jpg",
  },
  {
    id: "12",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563134/Venswap/listings/rgwrgwrg/mgpb5sjq1jw5kvwaniaf.jpg",
  },
  {
    id: "13",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563134/Venswap/listings/rgwrgwrg/mgpb5sjq1jw5kvwaniaf.jpg",
  },
  {
    id: "14",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1721249917/Venswap/avatars/exz16olfhmblrw6adwbx.png",
  },
  {
    id: "15",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563138/Venswap/listings/rgwrgwrg/hzovsrha3u5xbvnu4bwk.jpg",
  },
  {
    id: "16",
    category: "POP Culture & Entertanment",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563134/Venswap/listings/rgwrgwrg/mgpb5sjq1jw5kvwaniaf.jpg",
  },
];

const businessList = (amount) =>
  businessPosts.slice(0, amount ?? 20).map((post) => {
    return `<div id="link" data-target="Business_article" class="business-main-list-card">
      <img
        src=${post.image}
        alt=""
        class="business-main-list-img"
      />
      <div class="business-main-list-content">
        <p class="business-main-list-content-category">
          ${post.category}
        </p>
        <p class="business-main-list-content-title">${post.title}</p>
        <p class="business-main-list-content-text">
          ${post.content.slice(0, 127)}
          ${post.content.length > 127 && "..."}
        </p>
      </div>
    </div>`;
  });

mapList(".business-main-list", businessList);
//Business end

//Business article business list start
mapList(".business-article-business-main-list", businessList, 4);
//Business article business list end

//Compose news start
const newsImageInput = document.querySelector(
  ".news-compose-body-main-right-input-field-thumbnail"
);

newsImageInput.addEventListener("change", (e) => {
  const preview = URL.createObjectURL(e.target.files[0]);
  document.querySelector(
    ".news-compose-body-main-right-input-field-thumbnail-img"
  ).src = preview;
});
//Compose news start

//Admin news list start
const adminNewsPosts = [
  {
    id: "1",
    engagement: "1,269",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1721249917/Venswap/avatars/exz16olfhmblrw6adwbx.png",
  },
  {
    id: "2",
    engagement: "1,269",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563138/Venswap/listings/rgwrgwrg/hzovsrha3u5xbvnu4bwk.jpg",
  },
  {
    id: "3",
    engagement: "1,269",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563134/Venswap/listings/rgwrgwrg/mgpb5sjq1jw5kvwaniaf.jpg",
  },
  {
    id: "4",
    engagement: "1,269",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1721249917/Venswap/avatars/exz16olfhmblrw6adwbx.png",
  },
  {
    id: "5",
    engagement: "1,269",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563138/Venswap/listings/rgwrgwrg/hzovsrha3u5xbvnu4bwk.jpg",
  },
  {
    id: "6",
    engagement: "1,269",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563134/Venswap/listings/rgwrgwrg/mgpb5sjq1jw5kvwaniaf.jpg",
  },
  {
    id: "7",
    engagement: "1,269",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1721249917/Venswap/avatars/exz16olfhmblrw6adwbx.png",
  },
  {
    id: "8",
    engagement: "1,269",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563138/Venswap/listings/rgwrgwrg/hzovsrha3u5xbvnu4bwk.jpg",
  },
  {
    id: "9",
    engagement: "1,269",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563134/Venswap/listings/rgwrgwrg/mgpb5sjq1jw5kvwaniaf.jpg",
  },
  {
    id: "10",
    engagement: "1,269",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1721249917/Venswap/avatars/exz16olfhmblrw6adwbx.png",
  },
  {
    id: "11",
    engagement: "1,269",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563138/Venswap/listings/rgwrgwrg/hzovsrha3u5xbvnu4bwk.jpg",
  },
  {
    id: "12",
    engagement: "1,269",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563134/Venswap/listings/rgwrgwrg/mgpb5sjq1jw5kvwaniaf.jpg",
  },
  {
    id: "13",
    engagement: "1,269",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563134/Venswap/listings/rgwrgwrg/mgpb5sjq1jw5kvwaniaf.jpg",
  },
  {
    id: "14",
    engagement: "1,269",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1721249917/Venswap/avatars/exz16olfhmblrw6adwbx.png",
  },
  {
    id: "15",
    engagement: "1,269",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563138/Venswap/listings/rgwrgwrg/hzovsrha3u5xbvnu4bwk.jpg",
  },
  {
    id: "16",
    engagement: "1,269",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563134/Venswap/listings/rgwrgwrg/mgpb5sjq1jw5kvwaniaf.jpg",
  },
];

const adminNewsList = (amount) =>
  adminNewsPosts.slice(0, amount ?? 20).map((post) => {
    return `<li class="admin-news-list-body-main-item">
                <div class="admin-news-list-body-main-item-top">
                  <img src=${post.image} alt="" class="" />
                  <div class="admin-news-list-body-main-item-top-right">
                    <div class="">
                      <p>${post.title}s</p>
                      <div
                        class="admin-news-list-body-main-item-top-right-menu-open"
                      >
                        <span class="material-symbols-sharp"> steppers </span>
                      </div>
                      <div
                        class="admin-news-list-body-main-item-top-right-menu-close"
                      >
                        <span class="material-symbols-sharp"> close </span>
                      </div>
                      <div class="admin-news-list-body-main-item-menu">
                        <button class="">
                          <span class="material-symbols-sharp"> edit </span>
                          <p class="">Edit Post</p>
                        </button>
                        <button class="">
                          <span class="material-symbols-sharp">
                            do_not_disturb_on
                          </span>
                          <p class="">Close Post</p>
                        </button>
                        <button class="">
                          <span class="material-symbols-sharp"> delete </span>
                          <p class="">Delete Post</p>
                        </button>
                      </div>
                    </div>
                    <p>
                      ${post.content.slice(0, 65)}...
                    </p>
                  </div>
                </div>
                <div class="admin-news-list-body-main-item-bottom">
                  <div>
                    <span class="material-symbols-sharp">
                      brand_awareness
                    </span>
                    <p class="">Engagement</p>
                  </div>
                  <p class="">${post.engagement}</p>
                </div>
                
              </li>`;
  });

mapList(".admin-news-list-body-main", adminNewsList);

//Admin list menu start
const adminListMenuBtnOpenSpans = document.querySelectorAll(
  ".admin-news-list-body-main-item-top-right-menu-open > span"
);
const adminListMenus = document.querySelectorAll(
  ".admin-news-list-body-main-item-menu"
);

// Close dropdown for outside clicks functions
function openDropdown(event, menus) {
  const button = event.target;
  const dropdown = button.parentElement.parentElement.lastElementChild;

  // Check if dropdown is already open
  if (dropdown.style.display === "grid") return;

  // Close all other dropdowns
  menus.forEach((menu) => {
    menu.style.display = "none";
  });

  //Hide/show open/close button
  button.parentElement.style.display = "none";
  button.parentElement.nextElementSibling.style.display = "grid";

  // Open current dropdown
  dropdown.style.display = "grid";
}
// Open dropdown functions
function closeDropdown(event, menus) {
  // Check if click is outside dropdown
  menus.forEach((menu) => {
    if (
      !menu.contains(event.target) &&
      event.target !==
        menu.previousElementSibling.previousElementSibling.firstElementChild
    ) {
      menu.style.display = "none";
      //Hide/show open/close button
      menu.previousElementSibling.style.display = "none";
      menu.previousElementSibling.previousElementSibling.style.display = "grid";
    }
  });
}

// Close dropdown for outside clicks
adminListMenuBtnOpenSpans.forEach((button) => {
  button.addEventListener("click", (e) => {
    openDropdown(e, adminListMenus);
  });
});

// Open dropdown
document.addEventListener("click", (e) => {
  closeDropdown(e, adminListMenus);
});
//Admin list menu end
//Admin news list end

//Admin draft start
const adminDraftNavItems = document.querySelectorAll(
  ".admin-draft-header-nav-item"
);
adminDraftNavItems.forEach((draftNavItem) => {
  draftNavItem.addEventListener("click", () => {
    // Remove active class from all Links
    adminDraftNavItems.forEach((l) =>
      l.classList.remove("active-admin-draft-header-nav-item")
    );

    // Add active class to the clicked link
    draftNavItem.classList.add("active-admin-draft-header-nav-item");
  });
});

const adminDraftPosts = [
  {
    id: "1",
    createdAt: "Created 4 days ago",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1721249917/Venswap/avatars/exz16olfhmblrw6adwbx.png",
  },
  {
    id: "2",
    createdAt: "Created 4 days ago",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563138/Venswap/listings/rgwrgwrg/hzovsrha3u5xbvnu4bwk.jpg",
  },
  {
    id: "3",
    createdAt: "Created 4 days ago",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563134/Venswap/listings/rgwrgwrg/mgpb5sjq1jw5kvwaniaf.jpg",
  },
  {
    id: "4",
    createdAt: "Created 4 days ago",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1721249917/Venswap/avatars/exz16olfhmblrw6adwbx.png",
  },
  {
    id: "5",
    createdAt: "Created 4 days ago",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563138/Venswap/listings/rgwrgwrg/hzovsrha3u5xbvnu4bwk.jpg",
  },
  {
    id: "6",
    createdAt: "Created 4 days ago",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563134/Venswap/listings/rgwrgwrg/mgpb5sjq1jw5kvwaniaf.jpg",
  },
  {
    id: "7",
    createdAt: "Created 4 days ago",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1721249917/Venswap/avatars/exz16olfhmblrw6adwbx.png",
  },
  {
    id: "8",
    createdAt: "Created 4 days ago",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563138/Venswap/listings/rgwrgwrg/hzovsrha3u5xbvnu4bwk.jpg",
  },
  {
    id: "9",
    createdAt: "Created 4 days ago",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563134/Venswap/listings/rgwrgwrg/mgpb5sjq1jw5kvwaniaf.jpg",
  },
  {
    id: "10",
    createdAt: "Created 4 days ago",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1721249917/Venswap/avatars/exz16olfhmblrw6adwbx.png",
  },
  {
    id: "11",
    createdAt: "Created 4 days ago",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563138/Venswap/listings/rgwrgwrg/hzovsrha3u5xbvnu4bwk.jpg",
  },
  {
    id: "12",
    createdAt: "Created 4 days ago",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563134/Venswap/listings/rgwrgwrg/mgpb5sjq1jw5kvwaniaf.jpg",
  },
  {
    id: "13",
    createdAt: "Created 4 days ago",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563134/Venswap/listings/rgwrgwrg/mgpb5sjq1jw5kvwaniaf.jpg",
  },
  {
    id: "14",
    createdAt: "Created 4 days ago",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1721249917/Venswap/avatars/exz16olfhmblrw6adwbx.png",
  },
  {
    id: "15",
    createdAt: "Created 4 days ago",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563138/Venswap/listings/rgwrgwrg/hzovsrha3u5xbvnu4bwk.jpg",
  },
  {
    id: "16",
    createdAt: "Created 4 days ago",
    title: "The Power of Online Communities",
    content:
      "Climate change is a pressing issue, but individual actions matter. Find out how you can contribute to climate action and make a positive impact on the environment.",
    image:
      "https://res.cloudinary.com/diiohnshc/image/upload/v1720563134/Venswap/listings/rgwrgwrg/mgpb5sjq1jw5kvwaniaf.jpg",
  },
];

const adminDraftList = (amount) =>
  adminDraftPosts.slice(0, amount ?? 20).map((post) => {
    return `<li class="admin-draft-body-main-item">
                <div class="admin-draft-body-main-item-top">
                  <img src=${post.image} alt="" class="" />
                  <div class="admin-draft-body-main-item-top-right">
                    <div class="">
                      <p>${post.title}s</p>
                      <div
                        class="admin-draft-body-main-item-top-right-menu-open"
                      >
                        <span class="material-symbols-sharp"> steppers </span>
                      </div>
                      <div
                        class="admin-draft-body-main-item-top-right-menu-close"
                      >
                        <span class="material-symbols-sharp"> close </span>
                      </div>
                      <div class="admin-draft-body-main-item-menu">
                        <button class="">
                          <span class="material-symbols-sharp"> edit </span>
                          <p class="">Edit Post</p>
                        </button>
                        <button class="">
                          <span class="material-symbols-sharp">
                            do_not_disturb_on
                          </span>
                          <p class="">Close Post</p>
                        </button>
                        <button class="">
                          <span class="material-symbols-sharp"> delete </span>
                          <p class="">Delete Post</p>
                        </button>
                      </div>
                    </div>
                    <p>
                      ${post.content.slice(0, 65)}...
                    </p>
                  </div>
                </div>
                <p class="admin-draft-body-main-item-bottom">
                  ${post.createdAt}
                </p>                
              </li>`;
  });

mapList(".admin-draft-body-main", adminDraftList);

const adminDraftMenuBtnOpenSpans = document.querySelectorAll(
  ".admin-draft-body-main-item-top-right-menu-open > span"
);
const adminDraftMenus = document.querySelectorAll(
  ".admin-draft-body-main-item-menu"
);

// Close dropdown for outside clicks
document.addEventListener("click", (e) => {
  closeDropdown(e, adminDraftMenus);
});

// Open dropdown
adminDraftMenuBtnOpenSpans.forEach((button) => {
  button.addEventListener("click", (e) => {
    openDropdown(e, adminDraftMenus);
  });
});
//Admin draft end

const Pages = document.querySelectorAll(`[data-role="Page"]`);
const Links = document.querySelectorAll("#link");
const AuthModalBtns = document.querySelectorAll(`#auth_modal_btn`);
const AuthModals = document.querySelectorAll(`[data-role="Auth_Modal"]`);
const AuthCloseModals = document.querySelectorAll("#auth_close_modal");
const LoginSignupBtns = document.querySelectorAll("#login_signup_btn");

//Links start
//Show login modal
function showLogIn() {
  AuthModals.forEach((modal) => {
    if (modal.dataset.target === "Login_modal") {
      modal.classList.remove("hideSection");
    } else {
      modal.classList.add("hideSection");
    }
  });
}

Links.forEach((link) => {
  link.addEventListener("click", () => {
    // Remove active class from all Links
    Links.forEach((l) => l.classList.remove(link.dataset.active_link));

    // Add active class to the clicked link
    link.classList.add(link.dataset.active_link);

    // Navigation;
    Pages.forEach((page) => {
      if (link.dataset.target === page.dataset.target) {
        if (loggedIn) {
          page.classList.remove("hideSection");
        } else {
          if (
            link.dataset.target === "Explore" ||
            link.dataset.target === "News" ||
            link.dataset.target === "Event"
          ) {
            page.classList.remove("hideSection");
          } else {
            showLogIn();
          }
        }

        if (
          link.dataset.target === "Settings_details" ||
          link.dataset.target === "Settings_password" ||
          link.dataset.target === "Settings_help" ||
          link.dataset.target === "Settings_delete"
        ) {
          document.querySelector("#aside").classList.add("hideSection");
          document
            .querySelector("#aside_settings")
            .classList.remove("hideSection");
        } else {
          document.querySelector("#aside").classList.remove("hideSection");
          document
            .querySelector("#aside_settings")
            .classList.add("hideSection");
        }
      } else {
        page.classList.add("hideSection");
      }
    });

    dropdown.style.display = "none";
  });
});
//Links end

//Open/Close Auth Modals start
AuthModalBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    AuthModals.forEach((modal) => {
      if (btn.dataset.target === modal.dataset.target) {
        modal.classList.remove("hideSection");
      } else {
        modal.classList.add("hideSection");
      }
    });
  });
});

AuthCloseModals.forEach((btn) => {
  btn.addEventListener("click", () => {
    AuthModals.forEach((modal) => {
      if (btn.dataset.target === modal.dataset.target) {
        modal.classList.add("hideSection");
        Pages.forEach((page) => {
          if (page.dataset.target === "Explore") {
            page.classList.remove("hideSection");
          } else {
            page.classList.add("hideSection");
          }
        });
      }
    });
  });
});
//Open/Close Auth Modals end

//Login/Signup button start
LoginSignupBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    loggedIn = true;
    AuthModals.forEach((modal) => {
      modal.classList.add("hideSection");
    });

    Pages.forEach((page) => {
      if (page.dataset.target === "Explore") {
        page.classList.remove("hideSection");
      } else {
        page.classList.add("hideSection");
      }
    });

    Links.forEach((link) => {
      if (link.className === "explore-aside-link") {
        link.classList.add(link.dataset.active_link);
      } else {
        link.classList.remove(link.dataset.active_link);
      }
    });

    if (document.querySelector("#aside").classList.contains("hideSection")) {
      document.querySelector("#aside").classList.remove("hideSection");
      document.querySelector("#aside_settings").classList.add("hideSection");
    }

    // Hide/show links and sections after login
    document.querySelector(".community-card").classList.add("hideSection");
    document.querySelector(".right-section").classList.add("hideSection");
    document
      .querySelector(".right-section-logged-in")
      .classList.remove("hideSection");
    document
      .querySelector(".aside-settings-guide")
      .classList.remove("hideSection");
    document
      .querySelector(".aside-analytics-drafts")
      .classList.remove("hideSection");
    document
      .querySelector(".aside-news-list-container")
      .classList.remove("hideSection");
  });
});
//Login/Signup button end

//Delete popup start
document
  .querySelector(".delete-details-form-btns-delete")
  .addEventListener("click", () => {
    document
      .querySelector("#delete_confirm_popup")
      .classList.remove("hideSection");
  });

document.querySelectorAll("#close_delete_confirm_popup").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelector("#delete_confirm_popup")
      .classList.add("hideSection");
  });
});
//Delete popup end

document
  .querySelector(".community-description > .close-btn")
  .addEventListener("click", () => {
    document.querySelector(".community-content").classList.add("hideSection");
    console.log(document.querySelector(".community-description > .close-btn"));
  });
