// Array of Languages
const languages = [
  { name: "English (UK)", native: "English", code: "en-GB" },
  { name: "English (US)", native: "English", code: "en-US" },
  { name: "Arabic", native: "العربية", code: "ar", rtl: true },
  { name: "Chinese (Simplified)", native: "简体中文", code: "zh-CN" },
  { name: "Chinese (Traditional)", native: "繁體中文", code: "zh-TW" },
  { name: "Dutch", native: "Nederlands", code: "nl" },
  { name: "French", native: "Français", code: "fr" },
  { name: "German", native: "Deutsch", code: "de" },
  { name: "Hindi", native: "हिंदी", code: "hi" },
  { name: "Italian", native: "Italiano", code: "it" },
  { name: "Japanese", native: "日本語", code: "ja" },
  { name: "Korean", native: "한국어", code: "ko" },
  { name: "Portuguese", native: "Português", code: "pt" },
  { name: "Russian", native: "Русский", code: "ru" },
  { name: "Spanish", native: "Español", code: "es" },
  { name: "Turkish", native: "Türkçe", code: "tr" },
  { name: "Urdu", native: "اردو", code: "ur", rtl: true },
  { name: "Persian", native: "فارسی", code: "fa", rtl: true },
  { name: "Hebrew", native: "עברית", code: "he", rtl: true },
  { name: "Thai", native: "ไทย", code: "th" },
];

const languageLists = document.getElementById("languageLists");

function renderLangugaes() {
  languageLists.innerHTML = ""; // clear container

  languages.forEach((lang) => {
    const { code, name, native } = lang;

    const nativeVar = code === "en-GB" ? "System Language" : native;
    const defaultLanguage = code === "en-GB";

    const markup = `
        <li role="button">
                <div>
                        <h4>${name}</h4>
                        <span>${nativeVar}</span>
                </div>

                <button aria-selected="${defaultLanguage ? true : false}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#fff" d="M9 16.17L5.53 12.7a.996.996 0 1 0-1.41 1.41l4.18 4.18c.39.39 1.02.39 1.41 0L20.29 7.71a.996.996 0 1 0-1.41-1.41z" /></svg>
                </button>
        </li>
    `;

    languageLists.insertAdjacentHTML("beforeend", markup);
  });
}

renderLangugaes();

languageLists.addEventListener("click", function (e) {
  const li = e.target.closest("li");
  const langItems = this.querySelectorAll("li");

  if (li) {
    const checkbox = li.querySelector("button");

    langItems.forEach((lang) => lang.querySelector("button").setAttribute("aria-selected", false));
    checkbox.setAttribute("aria-selected", true);
  }
});
