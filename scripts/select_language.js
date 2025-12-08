const countries = [
  {
    name: "English(US)",
    flag: "/icons/flags/us.svg",
    language: "us",
  },
  {
    name: "English(UK)",
    flag: "/icons/flags/uk.svg",
    language: "uk",
  },
  {
    name: "Spanish(ES)",
    flag: "/icons/flags/spanish.svg",
    language: "spanish",
  },
  {
    name: "Portugues(PT)",
    flag: "/icons/flags/portugal.svg",
    language: "portugal",
  },
  {
    name: "Hindi(HI)",
    flag: "/icons/flags/hindi.svg",
    language: "hindi",
  },
  {
    name: "Bengali(BN)",
    flag: "/icons/flags/bengali.svg",
    language: "bengali",
  },
  {
    name: "French(FR)",
    flag: "/icons/flags/french.svg",
    language: "french",
  },
  {
    name: "Chinese(ZH)",
    flag: "/icons/flags/chinese.svg",
    language: "chinese",
  },
  {
    name: "Russian(RU)",
    flag: "/icons/flags/russian.svg",
    language: "russian",
  },
  {
    name: "German(DE)",
    flag: "/icons/flags/german.svg",
    language: "german",
  },
  {
    name: "Urdu(UR)",
    flag: "/icons/flags/urdu.svg",
    language: "urdu",
  },
  {
    name: "Italian(IT)",
    flag: "/icons/flags/italy.svg",
    language: "italy",
  },
];

const selectLanguage = document.getElementById("select-language");
const selectLanguageDropdown = document.getElementById("select_language_dropdown");
const selectLanguageDropdownOl = document.querySelector("#select_language_dropdown ol");

selectLanguage.addEventListener("click", (e) => {
  e.stopPropagation();
  const target = e.target;

  // Show language dropdown
  if (target.closest(".selected")) {
    const status = JSON.parse(selectLanguageDropdown.ariaExpanded);

    if (!status) {
      hideSelectLanguage(target, "show");
    } else {
      hideSelectLanguage(target);
    }
    return;
  }

  // Select country
  const countryItem = target.closest("li");
  if (countryItem && !e.target.closest(".wrapper")) {
    const selectedImage = selectLanguage.querySelector(".selected img");
    const selectedText = selectLanguage.querySelector(".selected span");

    hideSelectLanguage(target); // Hide country list container
    const { lang, value } = countryItem.dataset;

    selectedImage.src = `/icons/flags/${lang}.svg`;
    selectedText.innerText = value;

    selectLanguageDropdownOl.querySelectorAll("li").forEach((li) => li.classList.remove("active"));
    countryItem.classList.add("active");
  }
});

// Outside clicked
document.addEventListener("click", (e) => {
  if (!e.target.closest("#select-language") && selectLanguageDropdown.ariaExpanded === "true") {
    hideSelectLanguage(e.target);
  }
});

/**
 *
 * @param {string} target - HTMLElement
 * @param {string} mode - hide or show
 */
function hideSelectLanguage(target, mode = "hide") {
  const expandedIcon = selectLanguage.querySelector(".expanded_icon");
  const status = mode === "hide";

  selectLanguageDropdown.classList[status ? "add" : "remove"](location.pathname === "/collaborations.html" ? "collaboration-hidden" : HIDDEN);
  selectLanguageDropdown.ariaExpanded = status ? "false" : "true";
  expandedIcon.classList[status ? "remove" : "add"]("active");
}

////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
function renderSelectCountry(countries) {
  selectLanguageDropdownOl.innerHTML = "";

  countries.forEach((country, i) => {
    const html = `
        <li role="button" class="${i === 0 ? "active" : ""}" data-lang="${country.language}" data-value="${country.name}">
          <img src="${country.flag}" alt="" />
          <span>${country.name}</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="#8837E9" d="M9 16.17L5.53 12.7a.996.996 0 1 0-1.41 1.41l4.18 4.18c.39.39 1.02.39 1.41 0L20.29 7.71a.996.996 0 1 0-1.41-1.41z" /></svg>
        </li>
    `;
    selectLanguageDropdownOl.insertAdjacentHTML("beforeend", html);
  });
}
renderSelectCountry(countries);

////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
// Find country
const selectLanguageDropdownInput = document.querySelector("#select_language_dropdown input");

selectLanguageDropdownInput.oninput = (e) => {
  const results = countries.filter((country) => country.name.toLowerCase().includes(e.target.value));
  renderSelectCountry(results);
};
