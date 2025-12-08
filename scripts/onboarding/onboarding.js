const interestContainer = document.getElementById("onboardingInterests");

/////////////////
// const duetPickerEl = document.querySelector(".pickerYourBirthday");
// const duetPickerBtn = document.getElementById("pickerYourBirthday--wrapper");

// Duet setup
// document.addEventListener("DOMContentLoaded", function () {
//   duetPickerEl.min = today;
//   duetPickerEl.value = today;
//   duetPickerBtn.addEventListener("click", function () {
//     duetPickerEl.show();
//   });

//   // Listen for date changes
//   duetPickerEl.addEventListener("duetChange", function (e) {
//     const showSelected = duetPickerBtn.querySelector(".show_selected");

//     const selectedDate = e.detail.value;
//     showSelected.textContent = selectedDate; // update DOM

//     // Delay class removal to allow Duet to complete its cycle
//     setTimeout(function () {
//       const dateDialog = document.querySelector('[name="pickerYourBirthday"]').querySelector(".duet-date__dialog");

//       if (dateDialog) {
//         dateDialog.classList.remove("is-active");
//       }
//     }, 100); // Adjust the delay as needed
//   });
// });

class OnboardScreenApp {
  constructor() {
    this.stepsElement = ["identity", "about", "goal", "location"];
    this.currentStep = 0;
    this.stepsLength = 3;
    this.profileData = {};

    document.querySelectorAll(".onboard_secondary_button").forEach((button) => button.setAttribute("disabled", "true"));

    this.identitySaveContinue = document.getElementById("identitySaveContinue");

    this.aboutBackContinue = document.getElementById("aboutBackContinue");
    this.aboutSaveContinue = document.getElementById("aboutSaveContinue");

    this.goalBackContinue = document.getElementById("goalBackContinue");
    this.goalSaveContinue = document.getElementById("goalSaveContinue");

    this.locationBackContinue = document.getElementById("locationBackContinue");
    this.locationSaveContinue = document.getElementById("locationSaveContinue");

    this.onboardWithUsername = document.getElementById("onboardWithUsername");
    this.onboardWithBio = document.getElementById("onboardWithBio");
    this.identityContainer = document.getElementById("identityContainer");
    this.aboutContainer = document.getElementById("aboutContainer");
    this.goalContainer = document.getElementById("goalContainer");
    this.locationContainer = document.getElementById("locationContainer");
    this.setupStepsContainer = document.getElementById("setupStepsContainer");
    this.onboardStreetAddress = document.getElementById("onboardStreetAddress");
    this.setupStepsContainerSteps = this.setupStepsContainer.querySelectorAll(".step");

    // Identity Board Changed
    window.addEventListener("onboard-identity-changed", (event) => {
      const { gender, username } = event.detail || {};
      if (this.profileData.gender && this.profileData.username) {
        this.identitySaveContinue.removeAttribute("disabled");
      } else {
        this.identitySaveContinue.setAttribute("disabled", "true");
      }
    });

    // About Board Changed
    window.addEventListener("onboard-about-changed", (event) => {
      const { bio, education, occupation, interests } = event.detail || {};
      if (this.profileData.bio && this.profileData.education && this.profileData.occupation && this.profileData?.interests?.length) {
        this.aboutSaveContinue.removeAttribute("disabled");
      } else {
        this.aboutSaveContinue.setAttribute("disabled", "true");
      }
    });

    // Goals Board Changed
    window.addEventListener("onboard-goal-changed", (event) => {
      const { goals } = event.detail || {};
      if (this.profileData?.goals?.length && this.profileData?.goals?.length >= 3) {
        this.goalSaveContinue.removeAttribute("disabled");
      } else {
        this.goalSaveContinue.setAttribute("disabled", "true");
      }
    });

    // Location Board Changed
    window.addEventListener("onboard-location-changed", (event) => {
      const { city, state, country, language } = event.detail || {};

      // State controller 😂 :)
      if (country) {
        window.onboardStateDropdown.enable();
        this.getStatesOfCountry(country);
      } else {
        window.onboardStateDropdown.disable();
      }

      if (this.profileData.country && this.profileData.language && this.profileData.street) {
        this.locationSaveContinue.removeAttribute("disabled");
      } else {
        this.locationSaveContinue.setAttribute("disabled", "true");
      }
    });

    this.initEvents();
    this._invalidateProgressbar();
  }

  renderLanguagesAndCountries() {
    // enable the dropdowns
    window.onboardLanguageDropdown.enable();
    window.onboardCountryDropdown.enable();

    // update each dropdown data
    window.onboardCountryDropdown.setData([
      {
        label: "UK",
        value: "uk",
        icon: `
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_2_12727)">
            <path d="M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20Z" fill="#F0F0F0"/>
            <path d="M2.06724 3.91083C1.28173 4.93282 0.689426 6.11075 0.344543 7.3904H5.54681L2.06724 3.91083Z" fill="#0052B4"/>
            <path d="M19.6558 7.39054C19.3109 6.11093 18.7186 4.933 17.9331 3.91101L14.4536 7.39054H19.6558Z" fill="#0052B4"/>
            <path d="M0.344543 12.6085C0.689466 13.8881 1.28177 15.0661 2.06724 16.088L5.54669 12.6085H0.344543Z" fill="#0052B4"/>
            <path d="M16.088 2.06649C15.066 1.28098 13.8881 0.688672 12.6085 0.34375V5.54598L16.088 2.06649Z" fill="#0052B4"/>
            <path d="M3.91162 17.9314C4.93361 18.7169 6.11155 19.3092 7.39116 19.6542V14.452L3.91162 17.9314Z" fill="#0052B4"/>
            <path d="M7.39111 0.34375C6.1115 0.688672 4.93357 1.28098 3.91162 2.06644L7.39111 5.54593V0.34375Z" fill="#0052B4"/>
            <path d="M12.6085 19.6542C13.8881 19.3092 15.066 18.7169 16.088 17.9315L12.6085 14.452V19.6542Z" fill="#0052B4"/>
            <path d="M14.4536 12.6085L17.9331 16.088C18.7186 15.0661 19.3109 13.8881 19.6558 12.6085H14.4536Z" fill="#0052B4"/>
            <path d="M19.9154 8.69566H11.3044H11.3044V0.0846484C10.8774 0.0290625 10.4421 0 10 0C9.55785 0 9.12262 0.0290625 8.69566 0.0846484V8.69559V8.69563H0.0846484C0.0290625 9.12262 0 9.55793 0 10C0 10.4421 0.0290625 10.8774 0.0846484 11.3043H8.69559H8.69563V19.9154C9.12262 19.9709 9.55785 20 10 20C10.4421 20 10.8774 19.971 11.3043 19.9154V11.3044V11.3044H19.9154C19.9709 10.8774 20 10.4421 20 10C20 9.55793 19.9709 9.12262 19.9154 8.69566Z" fill="#D80027"/>
            <path d="M12.6087 12.6094L17.071 17.0717C17.2763 16.8665 17.4721 16.6521 17.6589 16.4297L13.8385 12.6093H12.6087V12.6094Z" fill="#D80027"/>
            <path d="M7.39128 12.6093H7.3912L2.92889 17.0716C3.13405 17.2769 3.34854 17.4726 3.57089 17.6594L7.39128 13.839V12.6093Z" fill="#D80027"/>
            <path d="M7.39116 7.39093V7.39085L2.92882 2.92847C2.72358 3.13362 2.5278 3.34812 2.341 3.57046L6.16143 7.39089H7.39116V7.39093Z" fill="#D80027"/>
            <path d="M12.6087 7.39184L17.0711 2.92942C16.8659 2.72418 16.6514 2.5284 16.4291 2.34164L12.6087 6.16207V7.39184V7.39184Z" fill="#D80027"/>
          </g>
          <defs>
            <clipPath id="clip0_2_12727">
              <rect width="20" height="20" fill="white"/>
            </clipPath>
          </defs>
        </svg>
      `,
      },
      {
        label: "US",
        value: "us",
        icon: `
        <img src="https://cdn-icons-png.flaticon.com/128/4628/4628635.png" width="20px" height="20px" alt="English US">
      `,
      },
      {
        label: "French",
        value: "french",
        icon: `
        <img src="https://cdn-icons-png.flaticon.com/128/323/323315.png" width="20px" height="20px" alt="French">
      `,
      },
      {
        label: "Spanish",
        value: "spanish",
        icon: `
        <img src="https://cdn-icons-png.flaticon.com/128/197/197593.png" width="20px" height="20px" alt="Spanish">
      `,
      },
      {
        label: "German",
        value: "german",
        icon: `
        <img src="https://cdn-icons-png.flaticon.com/128/197/197571.png" width="20px" height="20px" alt="German">
      `,
      },
    ]);
    window.onboardLanguageDropdown.setData([
      {
        label: "English UK",
        value: "english-uk",
        icon: `
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_2_12727)">
            <path d="M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20Z" fill="#F0F0F0"/>
            <path d="M2.06724 3.91083C1.28173 4.93282 0.689426 6.11075 0.344543 7.3904H5.54681L2.06724 3.91083Z" fill="#0052B4"/>
            <path d="M19.6558 7.39054C19.3109 6.11093 18.7186 4.933 17.9331 3.91101L14.4536 7.39054H19.6558Z" fill="#0052B4"/>
            <path d="M0.344543 12.6085C0.689466 13.8881 1.28177 15.0661 2.06724 16.088L5.54669 12.6085H0.344543Z" fill="#0052B4"/>
            <path d="M16.088 2.06649C15.066 1.28098 13.8881 0.688672 12.6085 0.34375V5.54598L16.088 2.06649Z" fill="#0052B4"/>
            <path d="M3.91162 17.9314C4.93361 18.7169 6.11155 19.3092 7.39116 19.6542V14.452L3.91162 17.9314Z" fill="#0052B4"/>
            <path d="M7.39111 0.34375C6.1115 0.688672 4.93357 1.28098 3.91162 2.06644L7.39111 5.54593V0.34375Z" fill="#0052B4"/>
            <path d="M12.6085 19.6542C13.8881 19.3092 15.066 18.7169 16.088 17.9315L12.6085 14.452V19.6542Z" fill="#0052B4"/>
            <path d="M14.4536 12.6085L17.9331 16.088C18.7186 15.0661 19.3109 13.8881 19.6558 12.6085H14.4536Z" fill="#0052B4"/>
            <path d="M19.9154 8.69566H11.3044H11.3044V0.0846484C10.8774 0.0290625 10.4421 0 10 0C9.55785 0 9.12262 0.0290625 8.69566 0.0846484V8.69559V8.69563H0.0846484C0.0290625 9.12262 0 9.55793 0 10C0 10.4421 0.0290625 10.8774 0.0846484 11.3043H8.69559H8.69563V19.9154C9.12262 19.9709 9.55785 20 10 20C10.4421 20 10.8774 19.971 11.3043 19.9154V11.3044V11.3044H19.9154C19.9709 10.8774 20 10.4421 20 10C20 9.55793 19.9709 9.12262 19.9154 8.69566Z" fill="#D80027"/>
            <path d="M12.6087 12.6094L17.071 17.0717C17.2763 16.8665 17.4721 16.6521 17.6589 16.4297L13.8385 12.6093H12.6087V12.6094Z" fill="#D80027"/>
            <path d="M7.39128 12.6093H7.3912L2.92889 17.0716C3.13405 17.2769 3.34854 17.4726 3.57089 17.6594L7.39128 13.839V12.6093Z" fill="#D80027"/>
            <path d="M7.39116 7.39093V7.39085L2.92882 2.92847C2.72358 3.13362 2.5278 3.34812 2.341 3.57046L6.16143 7.39089H7.39116V7.39093Z" fill="#D80027"/>
            <path d="M12.6087 7.39184L17.0711 2.92942C16.8659 2.72418 16.6514 2.5284 16.4291 2.34164L12.6087 6.16207V7.39184V7.39184Z" fill="#D80027"/>
          </g>
          <defs>
            <clipPath id="clip0_2_12727">
              <rect width="20" height="20" fill="white"/>
            </clipPath>
          </defs>
        </svg>
      `,
      },
      {
        label: "English US",
        value: "english-us",
        icon: `
        <img src="https://cdn-icons-png.flaticon.com/128/4628/4628635.png" width="20px" height="20px" alt="English US">
      `,
      },
      {
        label: "French",
        value: "french",
        icon: `
        <img src="https://cdn-icons-png.flaticon.com/128/323/323315.png" width="20px" height="20px" alt="French">
      `,
      },
      {
        label: "Spanish",
        value: "spanish",
        icon: `
        <img src="https://cdn-icons-png.flaticon.com/128/197/197593.png" width="20px" height="20px" alt="Spanish">
      `,
      },
      {
        label: "German",
        value: "german",
        icon: `
        <img src="https://cdn-icons-png.flaticon.com/128/197/197571.png" width="20px" height="20px" alt="German">
      `,
      },
    ]);
  }

  _invalidateProgressbar() {
    const progress = ((this.currentStep + 1) / (this.stepsLength + 1)) * 100;
    document.querySelector(".onboarding_main_header_progress_line").style.width = `${progress}%`;
  }

  _invalidateOnboardAsideContainer() {
    const classes = ["inactive", "active", "completed"];
    // Identity
    this.setupStepsContainerSteps.forEach((step) => step.classList.add("inactive"));
    Array.from({ length: this.currentStep }, (_, i) => i + 1).forEach((num) => {
      const container = document.querySelector(`#setupStepsContainer>div:nth-child(${num})`);
      classes.forEach((cl) => container.classList.remove(cl));
      container.classList.add("completed");
    });

    // Activate Current
    const currentContainer = document.querySelector(`#setupStepsContainer>div:nth-child(${this.currentStep + 1})`);
    classes.forEach((cl) => currentContainer.classList.remove(cl));
    currentContainer.classList.add("active");

    // Interface
    const containerInterface = document.getElementById(`${this.stepsElement[this.currentStep]}Container`);
    if (containerInterface) {
      document.querySelectorAll(".identity_container").forEach((container) => container.classList.add(HIDDEN));
      containerInterface.classList.remove(HIDDEN);
    }

    // Aside Desc Container
    document.querySelectorAll(".aside_account_description_main").forEach((container) => container.classList.add(HIDDEN));
    document.getElementById(`${this.stepsElement[this.currentStep]}DescContainer`).classList.remove(HIDDEN);
  }

  initEvents() {
    this.identitySaveContinue.addEventListener("click", () => {
      this.currentStep = 1;
      this._invalidateOnboardAsideContainer();
      this._invalidateProgressbar();
    });

    this.aboutSaveContinue.addEventListener("click", () => {
      this.currentStep = 2;
      this._invalidateOnboardAsideContainer();
      this._invalidateProgressbar();
    });

    this.goalSaveContinue.addEventListener("click", async () => {
      this.currentStep = 3;
      this._invalidateOnboardAsideContainer();
      this._invalidateProgressbar();

      if (!this.countries) {
        this.countries = await this._getAllCountries();
        this.renderLanguagesAndCountries();
      }
    });

    this.locationSaveContinue.addEventListener("click", () => {
      window.introScreenSetup.init();

      this._invalidateOnboardAsideContainer();
      this._invalidateProgressbar();

      console.log(window.introScreenSetup);
      console.log(window.introScreenSetup.driver);

      localStorage.setItem("sizemug_status", "mid-end");
      setTimeout(() => {
        openDashboardHasNewUser();
      }, 1000);
    });

    this.aboutBackContinue.addEventListener("click", () => {
      this.currentStep = 0;
      this._invalidateOnboardAsideContainer();
      this._invalidateProgressbar();
    });

    this.goalBackContinue.addEventListener("click", () => {
      this.currentStep = 1;
      this._invalidateOnboardAsideContainer();
      this._invalidateProgressbar();
    });

    this.locationBackContinue.addEventListener("click", () => {
      this.currentStep = 2;
      this._invalidateOnboardAsideContainer();
      this._invalidateProgressbar();
    });

    // USERNAME :)
    this.onboardWithUsername.addEventListener("input", (e) => {
      this.profileData.username = e.target.value;
      window.dispatchEvent(new CustomEvent("onboard-identity-changed", { detail: { username: e.target.value } }));
    });

    // BIO :)
    this.onboardWithBio.addEventListener("input", (e) => {
      this.profileData.bio = e.target.value;
      window.dispatchEvent(new CustomEvent("onboard-about-changed", { detail: { bio: e.target.value } }));
    });

    // Interests
    document.getElementById("aboutInterestsSelect").addEventListener("click", (e) => {
      this._chipSelectionManager(e, "about", "interests");
    });

    // Goals
    document.getElementById("goalInterestsSelect").addEventListener("click", (e) => {
      this._chipSelectionManager(e, "goal", "goals");
    });

    // BIO :)
    this.onboardStreetAddress.addEventListener("input", (e) => {
      this.profileData.street = e.target.value;
      window.dispatchEvent(new CustomEvent("onboard-location-changed", { detail: { street: e.target.value } }));
    });
  }

  _chipSelectionManager(e, step = "about", type = "interests") {
    e.preventDefault();

    const chipContainer = e.target.closest(".chip-container");
    if (!chipContainer) return;

    const chipButton = chipContainer.querySelector(".chip-button");
    const label = chipContainer.querySelector(".chip-label");
    if (!chipButton || !label) return;

    // normalize value for uniqueness
    const value = label.textContent.trim().toLowerCase().split(" ").join("-");

    // get existing values (array) or start empty
    const existing = Array.isArray(this.profileData?.[type]) ? this.profileData[type] : [];

    // use a Set to enforce uniqueness
    const s = new Set(existing.map((v) => String(v).trim().toLowerCase()));

    // toggle selection
    const willSelect = !chipButton.classList.contains("selected");
    if (willSelect) {
      s.add(value);
      chipButton.classList.add("selected");
    } else {
      s.delete(value);
      chipButton.classList.remove("selected");
    }

    // persist back as array (lowercase normalized)
    this.profileData = {
      ...(this.profileData || {}),
      [type]: Array.from(s),
    };

    window.dispatchEvent(
      new CustomEvent(`onboard-${step}-changed`, {
        detail: { [type]: this.profileData[type] },
      })
    );
  }

  // async getStatesOfCountry(code) {
  //   try {
  //     const country = this.getCountryFromLocal(code);

  //     console.log(country);

  //     // Ensure this URL is exactly correct in your code
  //     const apiUrl = "https://countriesnow.space/api/v0.1/countries/states";

  //     const response = await fetch(apiUrl, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ country: country.label }),
  //     });

  //     const data = await response.json();
  //     this.states = data.data.states;

  //     console.log("states:", this.states);
  //   } catch (error) {
  //     console.error("Failed to fetch states:", error);
  //   }
  // }

  async getStatesOfCountry(code) {
    try {
      const country = this.getCountryFromLocal(code);
      console.log(country);

      // Use a proxy to bypass the CORS error during development
      const proxyUrl = "https://corsproxy.io/?";
      const apiUrl = `${proxyUrl}https://countriesnow.space/api/v0.1/countries/states`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: country.label }),
      });

      // NOTE: If the response is still not working, it might be due to the proxy
      // You can try another proxy if the first one is down.
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      this.states = data.data.states;

      console.log("states:", this.states);
    } catch (error) {
      console.error("Failed to fetch states:", error);
    }
  }

  // fetchAndRenderCity() {}

  /**
   * Get all countries with their flags for a country selector
   * @returns {Promise<Array>} Array of country objects for dropdown
   */
  async _getAllCountries() {
    const url = "https://restcountries.com/v3.1/all?fields=name,cca2";

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`RESTCountries error ${res.status}`);

      const countries = await res.json();

      const countryData = countries.map((country) => ({
        value: country.cca2.toLowerCase(), // Use lowercase for value 'us' vs 'US'
        label: country.name.common,
        icon: this._countryCodeToFlag(country.cca2),
      }));

      console.log(countryData);

      // Sort alphabetically
      return countryData.sort((a, b) => a.label.localeCompare(b.label));
    } catch (error) {
      console.error("Error fetching countries:", error);
      // Return an empty array or re-throw the error as needed
      return [];
    }
  }

  // Helper function to convert country code to flag emoji
  _countryCodeToFlag(countryCode) {
    if (!countryCode || countryCode.length !== 2) return "🌐";

    const codePoints = countryCode
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt());

    return String.fromCodePoint(...codePoints);
  }

  /**
   * Finds a country object from the local this.countries array.
   * This search is case-insensitive.
   *
   * @param {string} identifier - The country code (e.g., 'us') or name (e.g., 'Nigeria').
   * @returns {object|undefined} The found country object or undefined if not found.
   */
  getCountryFromLocal(identifier) {
    // Ensure we have an array and an identifier to search for
    if (!this.countries || !identifier) {
      return undefined;
    }

    // Sanitize the search term to be lowercase and without extra spaces
    const searchTerm = String(identifier).toLowerCase().trim();

    // Use the .find() method to search the array
    const country = this.countries.find(
      (c) =>
        // Check against the 'value' property (e.g., 'us')
        c.value.toLowerCase() === searchTerm ||
        // Also check against the 'label' property (e.g., 'United States')
        c.label.toLowerCase() === searchTerm
    );

    return country;
  }
}

window.onboardscreen = new OnboardScreenApp();

/**
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */
// Instantiate the custom dropdown
new SGCustomDropdown("onboardingGenderDropdown", {
  placeholder: "Select Gender",
  data: [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ],
  disabled: false,
  onChange: (value) => {
    window.onboardscreen.profileData.gender = value;
    window.dispatchEvent(new CustomEvent("onboard-identity-changed", { detail: { gender: value } }));
  },
});

// Instantiate the custom dropdown
new SGCustomDropdown("onboardingEducationDropdown", {
  placeholder: "Select Education",
  data: [
    { value: "none", label: "None" },
    { value: "primary-school", label: "Primary School" },
    { value: "middle-school", label: "Middle School / Junior High" },
    { value: "high-school", label: "High School Diploma / GED" },
    { value: "associate-degree", label: "Associate Degree" },
    { value: "bachelor-degree", label: "Bachelor's Degree" },
    { value: "master-degree", label: "Master's Degree" },
    { value: "professional-degree", label: "Professional Degree" },
    { value: "doctorate", label: "Doctorate" },
    { value: "postdoctoral-studies", label: "Postdoctoral Studies" },
  ],
  disabled: false,
  icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3L0.75 9L12 15L23.25 9L12 3Z" stroke="#1B1D22" stroke-opacity="0.8" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M5.25 11.3999V16.4999C5.25 18.1499 8.25 20.2499 12 20.2499C15.75 20.2499 18.75 18.1499 18.75 16.4999V11.3999" stroke="#1B1D22" stroke-opacity="0.8" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M23.25 9V18.75" stroke="#1B1D22" stroke-opacity="0.8" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  iconType: "text",
  onChange: (value) => {
    window.onboardscreen.profileData.education = value;
    window.dispatchEvent(new CustomEvent("onboard-about-changed", { detail: { education: value } }));
  },
});

// Instantiate the custom dropdown
new SGCustomDropdown("onboardingOccupationDropdown", {
  placeholder: "Select Occupation",
  data: [
    { value: "none", label: "None" },
    { value: "business-administration", label: "Business & Administration" },
    { value: "healthcare", label: "Healthcare" },
    { value: "education", label: "Education" },
    { value: "technology-engineering", label: "Technology & Engineering" },
    { value: "creative-media", label: "Creative & Media" },
    { value: "skilled-trades-services", label: "Skilled Trades & Services" },
    { value: "public-service-law", label: "Public Service & Law" },
    { value: "others", label: "Others" },
  ],
  disabled: false,
  icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21M4 7H20C21.1046 7 22 7.89543 22 9V19C22 20.1046 21.1046 21 20 21H4C2.89543 21 2 20.1046 2 19V9C2 7.89543 2.89543 7 4 7Z" stroke="#1B1D22" stroke-opacity="0.8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  iconType: "text",
  onChange: (value) => {
    window.onboardscreen.profileData.occupation = value;
    window.dispatchEvent(new CustomEvent("onboard-about-changed", { detail: { occupation: value } }));
  },
});

// Instantiate the custom dropdown
window.onboardLanguageDropdown = new SGCustomDropdown("onboardingLanguageDropdown", {
  placeholder: "Select Language",
  data: [],
  disabled: true,
  iconType: "dynamic",
  showItemBadge: true,
  onChange: (value) => {
    window.onboardscreen.profileData.language = value;
    window.dispatchEvent(new CustomEvent("onboard-location-changed", { detail: { language: value } }));
  },
});

// Instantiate the custom dropdown
window.onboardCountryDropdown = new SGCustomDropdown("onboardingCountryDropdown", {
  placeholder: "Select Country",
  disabled: true,
  iconType: "dynamic",
  showItemBadge: true,
  onChange: (value) => {
    window.onboardscreen.profileData.country = value;
    console.log(value);

    window.dispatchEvent(new CustomEvent("onboard-location-changed", { detail: { country: value } }));
  },
});

// Instantiate the custom dropdown
window.onboardStateDropdown = new SGCustomDropdown("onboardingStateDropdown", {
  placeholder: "Select State",
  data: [
    { value: "England", label: "England" },
    { value: "Scotland", label: "England" },
    { value: "Wales", label: "Wales" },
    { value: "Washington", label: "Washington" },
    { value: "Alabama", label: "Alabama" },
    { value: "Alaska", label: "Alaska" },
    { value: "California", label: "California" }
  ],
  disabled: false,
  onChange: (value) => {
    window.onboardscreen.profileData.state = value;
    window.dispatchEvent(new CustomEvent("onboard-location-changed", { detail: { state: value } }));
  },
});

// Instantiate the custom dropdown
window.onboardCityDropdown = new SGCustomDropdown("onboardingCityDropdown", {
  placeholder: "Select City",
  data: [
    { value: "New York City", label: "New York City" },
    { value: "Los Angeles", label: "Los Angeles" },
    { value: "London", label: "London" },
    { value: "Manchester", label: "Manchester" },
    { value: "Birmingham", label: "Birmingham" }
  ],
  disabled: false,
  onChange: (value) => {
    window.onboardscreen.profileData.city = value;
    window.dispatchEvent(new CustomEvent("onboard-location-changed", { detail: { city: value } }));
  },
});

/**
 *
 *
 *
 *
 *
 *
 */
class IntroScreenSetup {
  constructor() {
    this.driver = null;
  }

  // Dynamic Tour Configuration based on interests
  init() {
    const goals = window.onboardscreen?.profileData?.goals ?? [];
    if (localStorage.getItem("sizemug_status") !== "mid-start") return;

    const tourStepsData = [];

    // Tasks
    if (goals.includes("manage-tasks-&-goals")) {
      tourStepsData.push({
        element: "#taskDriverItem",
        title: 'Manage <span class="title_highlight">Tasks</span>',
        description: "Stay on top of your priorities with a smart task manager. Break down big goals into actionable steps, set deadlines, and track progress in one place.",
        image: "/icons/dashboard/manage-tasks.png",
      });
    }

    // Explore
    if (goals.includes("explore-contents")) {
      tourStepsData.push({
        element: "#exploreDriverItem",
        title: '<span class="title_highlight">Explore</span> contents',
        description: "Dive into a world of curated content across categories. Discover articles, videos, and resources that inspire, inform, and entertain.",
        image: "/icons/dashboard/explore-contents.png",
      });
    }

    // Chat & Go Live
    if (goals.includes("chat-&-go-live")) {
      tourStepsData.push({
        element: "#chatDriverItem",
        title: '<span class="title_highlight">Chat</span> with friends',
        description: "Connect instantly with friends, colleagues, or communities. Chat privately, join group discussions, or go live to share experiences in real time.",
        image: "/icons/dashboard/manage-tasks.png",
      });
    }

    // Create Or Share Paper
    if (goals.includes("create-or-share-paper")) {
      tourStepsData.push({
        element: "#paperDriverItem",
        title: 'Create or share <span class="title_highlight">New paper</span>',
        description: "Write, edit, and share documents effortlessly. Collaborate with peers, co-author research, or distribute knowledge with easy-to-use paper tools.",
        image: "/icons/dashboard/paper.png",
      });
    }

    // meet-like-minded-people
    if (goals.includes("meet-like-minded-people")) {
      tourStepsData.push({
        element: "#meetPeopleDriverItem",
        title: '<span class="title_highlight">Meet</span> People',
        description: "Work seamlessly with your team on shared projects. Assign tasks, exchange ideas, and monitor progress in real time.",
        image: "/icons/dashboard/manage-tasks.png",
      });
    }

    // Collaboration
    if (goals.includes("collaborate-on-projects")) {
      tourStepsData.push({
        element: "#collaborateDriverItem",
        title: '<span class="title_highlight">Collaborate</span> on projects',
        description: "Work seamlessly with your team on shared projects. Assign tasks, exchange ideas, and monitor progress in real time.",
        image: "/icons/dashboard/manage-tasks.png",
        side: "center",
        align: "end",
      });
    }

    // Explore Marketplace
    if (goals.includes("explore-marketplace")) {
      tourStepsData.push({
        element: "#marketplaceDriverItem",
        title: 'Explore <span class="title_highlight">Marketplace</span>',
        description: "Browse a vibrant marketplace filled with tools, resources, and digital products. Discover new solutions that help you work, learn, and create smarter.",
        image: "/icons/dashboard/marketplace.png",
        side: "center",
        align: "end",
      });
    }

    // Calender Marketplace
    if (goals.includes("calendar")) {
      tourStepsData.push({
        element: "#calenderDriverItem",
        title: 'Plan with <span class="title_highlight">Calendar</span>',
        description: "Keep your schedule organized. Sync events, set reminders, and plan your day, week, or month without missing a thing.",
        image: "/icons/dashboard/calender.png",
        side: "center",
        align: "end",
      });
    }

    // Whiteboard
    if (goals.includes("whiteboard")) {
      tourStepsData.push({
        element: "#boardDriverItem",
        title: 'Collaborate with <span class="title_highlight">Board Mode</span>',
        description: "Brainstorm and visualize your ideas on a collaborative whiteboard. Draw, map, and design concepts together in real time.",
        image: "/icons/dashboard/board.png",
        side: "center",
        align: "end",
      });
    }

    // Explore Wavy AI
    if (goals.includes("explore-wavy-ai")) {
      tourStepsData.push({
        element: ".wavyDriverItem",
        title: '<span class="title_highlight">Wavy</span>, your AI companion',
        description: "Get instant answers, create with ease, and stay productive. Wavy helps you think smarter, work faster, and focus on what matters most.",
        image: "/icons/dashboard/wavy.png",
        side: "top",
        align: "center",
      });
    }

    // Use Wallet & Coins
    if (goals.includes("use-wallet-&-coins")) {
      tourStepsData.push({
        element: ".useWalletDriverItem",
        title: 'Send & receive Coins with your <span class="title_highlight">Wallet</span>',
        description: "Manage your digital wallet with ease. Earn, spend, and track coins or tokens for purchases, rewards, and in-app transactions securely.",
        image: "/icons/dashboard/manage-tasks.png",
        side: "top",
        align: "center",
      });
    }

    // Create Post
    if (goals.includes("create-posts")) {
      tourStepsData.push({
        element: "#createPostDriverItem",
        title: 'Send & receive Coins with your <span class="title_highlight">Wallet</span>',
        description: "Manage your digital wallet with ease. Earn, spend, and track coins or tokens for purchases, rewards, and in-app transactions securely.",
        image: "/icons/dashboard/manage-tasks.png",
        side: "top",
        align: "center",
      });
    }

    // Create Campaign
    if (goals.includes("campaign")) {
      tourStepsData.push({
        element: "#createCampaignDriverItem",
        title: 'Send & receive Coins with your <span class="title_highlight">Wallet</span>',
        description: "Manage your digital wallet with ease. Earn, spend, and track coins or tokens for purchases, rewards, and in-app transactions securely.",
        image: "/icons/dashboard/manage-tasks.png",
        side: "top",
        align: "center",
      });
    }

    // === Step 2: Define single custom template ===
    const customTemplate = `
    <div class="driver-popover-tip"></div>

    <div class="driver-popover-content-wrapper">
      <div class="tour-card" role="dialog" aria-label="Tour popover">
        <div class="tour-main-container">
          <div id="tour-image-container"></div>
          <div class="tour-footer-content">
            <div class="tour-text">
              <h2 class="tour-title" id="tour-title-content"></h2>
              <div class="tour-desc" id="tour-desc-content"></div>
            </div>

            <div class="tour-footer">
              <div style="display: flex; align-items: center; gap: 16px;">
                <div class="tour-dots" id="tour-dots-container" aria-hidden="true"></div>
              </div>

              <div class="tour-controls">
                <button class="btn btn-prev">Go Back</button>
                <button class="btn btn-next">Next</button>
                <button class="btn btn-done">Done</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

    // === Step 3: Generate dots indicator ===
    const generateDots = (activeIndex, totalSteps) => {
      return Array.from({ length: totalSteps }, (_, i) => `<span class="tour-dot ${i === activeIndex ? "active" : ""}"></span>`).join("");
    };

    // === Step 4: Transform data into driver.js steps format ===
    const tourSteps = tourStepsData.map((stepData) => ({
      element: stepData.element,
      popover: {
        title: stepData.title,
        description: stepData.description,
        // Pass side and align to driver.js
        side: stepData.side || "right",
        align: stepData.align || "start",
        // Store custom data
        image: stepData.image,
      },
    }));

    // === Step 5: Initialize driver with custom rendering ===
    const driver = window.driver.js.driver({
      showProgress: false,
      showButtons: false,
      animate: true,
      smoothScroll: true,
      stagePadding: 1,
      // Remove global side/align - let each step define its own
      // side: "right",
      // align: "start",

      // Apply the custom template globally
      popoverClass: "custom-driver-popover",

      popover: {
        template: customTemplate,
      },

      steps: tourSteps,

      onPopoverRender: (popover, { _, state }) => {
        const popoverEl = popover.wrapper;

        // Replace the entire popover content with our custom template
        const closeBtn = popoverEl.querySelector(".driver-popover-close-btn");
        const arrow = popoverEl.querySelector(".driver-popover-arrow");

        // Customize close button icon
        if (closeBtn) {
          closeBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#000" d="m13.06 12l4.42-4.42a.75.75 0 1 0-1.06-1.06L12 10.94L7.58 6.52a.75.75 0 0 0-1.06 1.06L10.94 12l-4.42 4.42a.75.75 0 0 0 0 1.06a.75.75 0 0 0 1.06 0L12 13.06l4.42 4.42a.75.75 0 0 0 1.06 0a.75.75 0 0 0 0-1.06Z"/></svg>`;

          // Reattach the close event handler
          closeBtn.onclick = (e) => {
            e.preventDefault();
            driver.destroy();
            console.log("Tour closed via X button");
          };
        }

        // Clear existing content but keep close button and arrow
        popoverEl.innerHTML = "";
        if (closeBtn) popoverEl.appendChild(closeBtn);
        if (arrow) popoverEl.appendChild(arrow);

        // Append custom template
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = customTemplate;
        while (tempDiv.firstChild) {
          popoverEl.appendChild(tempDiv.firstChild);
        }

        // === Populate dynamic content ===
        const currentStepIndex = state.activeIndex;
        const currentStepData = tourStepsData[currentStepIndex];
        const totalSteps = tourStepsData.length;
        const isFirstStep = currentStepIndex === 0;
        const isLastStep = currentStepIndex === totalSteps - 1;

        // Set title
        const titleEl = popoverEl.querySelector("#tour-title-content");
        if (titleEl) titleEl.innerHTML = currentStepData.title;

        // Set description
        const descEl = popoverEl.querySelector("#tour-desc-content");
        if (descEl) descEl.textContent = currentStepData.description;

        // Set image
        const imageContainer = popoverEl.querySelector("#tour-image-container");
        if (imageContainer && currentStepData.image) {
          imageContainer.innerHTML = `<img class="tour-image" src="${currentStepData.image}" alt="Feature preview">`;
        }

        // Set dots
        const dotsContainer = popoverEl.querySelector("#tour-dots-container");
        if (dotsContainer) {
          dotsContainer.innerHTML = generateDots(currentStepIndex, totalSteps);
        }

        // === Manage button visibility and events ===
        const prevBtn = popoverEl.querySelector(".btn-prev");
        const nextBtn = popoverEl.querySelector(".btn-next");
        const doneBtn = popoverEl.querySelector(".btn-done");

        if (prevBtn) {
          prevBtn.style.display = isFirstStep ? "none" : "inline-block";
          prevBtn.onclick = (e) => {
            e.preventDefault();
            driver.movePrevious();
            console.log("Previous clicked");
          };
        }

        if (nextBtn) {
          nextBtn.style.display = isLastStep ? "none" : "inline-block";
          nextBtn.onclick = (e) => {
            e.preventDefault();
            driver.moveNext();
            console.log("Next clicked");
          };
        }

        if (doneBtn) {
          doneBtn.style.display = isLastStep ? "inline-block" : "none";
          doneBtn.onclick = (e) => {
            e.preventDefault();
            driver.destroy();
            console.log("Tour completed");
            // Add your completion logic here
            // localStorage.setItem("tour_completed", "true");
          };
        }
      },

      onHighlighted: (element, step) => {
        if (element.id === "createPostDriverItem" || element.id === "createCampaignDriverItem") {
          document.getElementById("sizemugNavbarActionPlus").setAttribute("aria-expanded", "true");
        } else {
          document.getElementById("sizemugNavbarActionPlus").removeAttribute("aria-expanded");
        }
        // A tiny delay ensures the browser's scroll animation is fully finished
        // before we recalculate the position.
        setTimeout(() => {
          driver.refresh();
          console.log("Position refreshed on step navigation.");
        }, 10); // 10ms is usually enough
      },

      onDeselected: (element, step) => {
        console.log("Deselected:", element);
      },

      onDestroyed: () => {
        console.log("Tour ended");
      },
    });

    console.log(driver);

    // === Step 6: Start the tour ===
    this.driver = driver;

    // Listen for the window resize event
    document.querySelector("aside#sidebar").addEventListener("scroll", () => {
      if (driver.isActive()) {
        driver.refresh();
      }
    });
  }
}

window.introScreenSetup = new IntroScreenSetup();
