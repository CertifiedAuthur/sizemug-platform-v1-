document.addEventListener("DOMContentLoaded", () => {
  const showOnlineSignToggle = document.getElementById("showOnlineSignToggle");
  const advancedResetButton = document.getElementById("advancedResetButton");
  const advancedApplyButton = document.getElementById("advancedApplyButton");
  // Get the element with the ID "advancedEditorInterests"
  const advancedEditorInterests = document.getElementById("advancedEditorInterests");

  const locationSelectedList = document.getElementById("locationSelectedList");
  const professionSelectedList = document.getElementById("professionSelectedList");

  let advancedFilterData = {};

  advancedResetButton.addEventListener("click", () => updateAdvancedSelectionInterface(true));

  function renderSelectedList(data, container, type) {
    container.innerHTML = "";

    if (!data.length) {
      return (container.innerHTML = "Any"); // Initiate Default value
    }

    data.forEach((d, i) => {
      const html = `
            <div class="selected_item" data-type="${type}" data-item="${d}">
              <span>${d}</span>
              <span tabindex="0" role="button">
                <!-- prettier-ignore -->
                <svg width="16" height="16" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M23.9552 6.71678L22.2853 5.04688L14.8882 12.4557L7.49119 5.04688L5.82129 6.71678L13.2301 14.1138L5.82129 21.5109L7.49119 23.1808L14.8882 15.772L22.2853 23.1808L23.9552 21.5109L16.5464 14.1138L23.9552 6.71678Z" fill="#8837e9" /></svg>
              </span>
            </div>
    `;

      container.insertAdjacentHTML("beforeend", html);
    });
  }

  function updateAdvancedSelectionInterface(hardUpdate = false) {
    if (hardUpdate) {
      const allCheckboxes = document.querySelectorAll("#advancedEditor input[type='checkbox']");
      const advancedEditorFirstList = document.querySelectorAll('#advancedEditor li[data-value="any"]');

      advancedFilterData = {};
      allCheckboxes.forEach((check) => (check.checked = false));

      toggleOnlineSign(true);

      advancedEditorFirstList.forEach((li) => {
        li.setAttribute("aria-selected", true);
      });

      advancedEditorInterests.querySelectorAll("button").forEach((button) => {
        button.setAttribute("aria-selected", false);
      });
    }

    const selectedSomething = Object.values(advancedFilterData).length;

    if (selectedSomething) {
      advancedResetButton.removeAttribute("disabled");
      advancedApplyButton.removeAttribute("disabled");

      if (advancedFilterData?.location?.length) {
        renderSelectedList(advancedFilterData.location, locationSelectedList, "country");
      }

      if (advancedFilterData?.profession?.length) {
        renderSelectedList(advancedFilterData.profession, professionSelectedList, "work");
      }
    } else {
      advancedResetButton.setAttribute("disabled", true);
      advancedApplyButton.setAttribute("disabled", true);
    }
  }

  function toggleOnlineSign(type = false) {
    const showOnlineSign = document.querySelectorAll(".showOnlineSign");

    if (type) {
      return showOnlineSign.forEach((sign) => sign.classList.add(HIDDEN));
    }

    if (showOnlineSignToggle.checked) {
      showOnlineSign.forEach((sign) => sign.classList.remove(HIDDEN));
    } else {
      showOnlineSign.forEach((sign) => sign.classList.add(HIDDEN));
    }
  }

  // Show online users
  showOnlineSignToggle.addEventListener("change", () => toggleOnlineSign());

  // Filter Age Range
  const filterAgeRange = document.querySelectorAll(".filter_age_range");

  filterAgeRange.forEach((range) => {
    range.addEventListener("change", function () {
      filterAgeRange.forEach((other) => (other.checked = false));
      range.checked = true;

      const { value } = range.closest(".advanced_editor_range_item").dataset;
      advancedFilterData.age = value;

      updateAdvancedSelectionInterface();
    });
  });

  // Filter Education Range
  const filterEducationRange = document.querySelectorAll(".filter_education_range");

  filterEducationRange.forEach((range) => {
    range.addEventListener("change", function () {
      filterEducationRange.forEach((other) => (other.checked = false));
      range.checked = true;

      const { value } = range.closest(".advanced_editor_range_item").dataset;
      advancedFilterData.education = value;

      updateAdvancedSelectionInterface();
    });
  });

  // Filter by Location/Profession
  const locationDropdownContainer = document.getElementById("locationDropdownContainer");
  const professionDropdownContainer = document.getElementById("professionDropdownContainer");
  const advancedEditorDropdownBtns = document.querySelectorAll(".advancedEditorDropdownBtn");
  const advancedEditorDropdowns = document.querySelectorAll(".advanced_editor_dropdown_container");

  /**
   * Renders a list of location professions into the specified container.
   *
   * @param {HTMLElement} container - The container element where the list items will be appended.
   * @param {Array<Object>} data - An array of objects representing the location professions.
   * @param {string} data[].label - The label of the location profession.
   * @param {string} data[].value - The value associated with the location profession.
   *
   * @example
   * const container = document.getElementById('profession-list');
   * const data = [
   *   { label: 'Engineer', value: 'engineer' },
   *   { label: 'Doctor', value: 'doctor' },
   * ];
   * renderLocationProfession(container, data);
   */
  function renderLocationProfession(container, data) {
    // Remove All list item except for one which is Any (any) field :)
    container.querySelectorAll("li:not(:first-child)").forEach((li) => {
      li.remove();
    });

    data.forEach((d) => {
      const { label, value } = d;

      const markup = `
        <li role="button" tabindex="0" data-value="${value}" data-label="${label}">
          <span>${label}</span>
          <label class="dot_custom_checkbox" id="">
              <input type="checkbox" ${advancedFilterData?.location?.includes(value) ? "checked" : ""} />
              <span class="dot_custom_checkmark"></span>
          </label>
        </li>
      `;

      container.insertAdjacentHTML("beforeend", markup);
    });
  }
  renderLocationProfession(locationDropdownContainer, globalCountriesData);
  renderLocationProfession(professionDropdownContainer, globalProfessionalWorks);

  // Iterate over all buttons in the `advancedEditorDropdownBtns` collection
  advancedEditorDropdownBtns.forEach((button) => {
    // Add a click event listener to each button
    button.addEventListener("click", (e) => {
      // Remove Selected :)
      const buttonEl = e.target.closest("[role='button']");
      if (buttonEl) {
        const selectedItem = buttonEl.closest(".selected_item");
        const { item, type } = selectedItem.dataset;

        // updateAdvancedSelectionInterface();
        if (type === "country") {
          advancedFilterData.location = advancedFilterData.location.filter((lc) => lc !== item);
          renderLocationProfession(locationDropdownContainer, globalCountriesData);
          renderSelectedList(advancedFilterData.location, locationSelectedList, "country");
        } else {
          advancedFilterData.profession = advancedFilterData.profession.filter((lc) => lc !== item);
          renderLocationProfession(professionDropdownContainer, globalProfessionalWorks);
          renderSelectedList(advancedFilterData.profession, professionSelectedList, "work");
        }

        console.log(advancedFilterData);
        selectedItem.remove();
        return;
      }

      // Find the closest container for the clicked button with the class `advanced_editor_dropdown_container`
      const advancedEditorDropdownContainer = e.target.closest(".advanced_editor_dropdown_container");

      // Close all dropdowns by setting `aria-expanded` to false
      advancedEditorDropdowns.forEach((dropdown) => {
        dropdown.setAttribute("aria-expanded", false);
      });

      // Open the dropdown associated with the clicked button by setting `aria-expanded` to true
      advancedEditorDropdownContainer.setAttribute("aria-expanded", true);
    });

    // Add a click event listener to the document to handle clicks outside the dropdown
    document.addEventListener("click", (e) => {
      // If the click is outside any `.advanced_editor_dropdown_container`, close all dropdowns
      if (!e.target.closest(".advanced_editor_dropdown_container")) {
        advancedEditorDropdowns.forEach((dropdown) => {
          dropdown.setAttribute("aria-expanded", false);
        });
      }
    });
  });

  // Iterate over the dropdown containers (e.g., location and profession dropdowns)
  [locationDropdownContainer, professionDropdownContainer].forEach((container) => {
    // Add a click event listener to each container
    container.addEventListener("click", (e) => {
      // Find the closest `<li>` element that was clicked
      const listItem = e.target.closest("li");

      if (listItem) {
        // Retrieve the `value` and `label` attributes from the clicked list item's dataset
        const { value, label } = listItem.dataset;

        // Get the filter type from the closest `.advanced_editor_dropdown_option` container
        const { filterType } = e.target.closest(".advanced_editor_dropdown_option").dataset;

        // Find the "any" list item within the container
        const anyListItem = container.querySelector('[data-value="any"]');

        if (value !== "any") {
          // If a specific value is selected (not "any"):
          // Unselect the "any" list item and check the input associated with the clicked list item
          anyListItem.setAttribute("aria-selected", false);
          listItem.querySelector("input").checked = true;

          // Update the `advancedFilterData` object to include the selected value, removing duplicates
          advancedFilterData = {
            ...advancedFilterData,
            [filterType]: [...(advancedFilterData[filterType]?.filter((type) => type !== value) ?? []), value],
          };

          // Log the updated filter data for debugging
        } else {
          // If "any" is selected:
          // Mark the "any" list item as selected and uncheck all inputs within the container
          anyListItem.setAttribute("aria-selected", true);
          container.querySelectorAll("input").forEach((input) => (input.checked = false));

          // Reset the filter data for the current filter type
          advancedFilterData = {
            ...advancedFilterData,
            [filterType]: [],
          };
        }
      }

      updateAdvancedSelectionInterface();
    });
  });

  // Add a click event listener to the "advancedEditorInterests" element
  advancedEditorInterests.addEventListener("click", (e) => {
    // Check if the clicked target or its closest ancestor is a button
    const button = e.target.closest("button");

    if (button) {
      // Get the current `aria-selected` state of the button
      const isSelected = button.getAttribute("aria-selected") === "true";
      // Retrieve the `value` attribute from the button's dataset
      const { value } = button.dataset;

      if (isSelected) {
        // If the button is currently selected:
        // - Set its `aria-selected` attribute to `false` to mark it as unselected
        button.setAttribute("aria-selected", false);

        // - Remove the corresponding value from the `interests` array in `advancedFilterData`
        advancedFilterData = {
          ...advancedFilterData,
          interests: advancedFilterData.interests.filter((int) => int !== value),
        };
      } else {
        // If the button is not currently selected:
        // - Set its `aria-selected` attribute to `true` to mark it as selected
        button.setAttribute("aria-selected", true);

        // - Add the corresponding value to the `interests` array in `advancedFilterData`
        advancedFilterData = {
          ...advancedFilterData,
          interests: [...(advancedFilterData?.interests ?? []), value],
        };
      }
    }

    updateAdvancedSelectionInterface();
  });
});

const advancedEditorWrapper = document.querySelector(".advanced_editor_wrapper");
const mobileAdvancedFilterButton = document.getElementById("mobileAdvancedFilterButton");

mobileAdvancedFilterButton.addEventListener("click", () => {
  advancedEditorWrapper.classList.remove(HIDDEN);
});

["load", "resize"].forEach((event) => {
  window.addEventListener(event, () => {
    if (window.innerWidth <= 667) {
      advancedEditorWrapper.classList.add(HIDDEN);
    } else {
      advancedEditorWrapper.classList.remove(HIDDEN);
    }
  });
});

advancedEditorWrapper.addEventListener("click", function (e) {
  if (e.target.classList.contains("advanced_editor_wrapper")) {
    this.classList.add(HIDDEN);
  }
});

const mobileHideAdvancedFilter = document.querySelector(".mobileHideAdvancedFilter");

mobileHideAdvancedFilter.addEventListener("click", () => {
  advancedEditorWrapper.classList.add(HIDDEN);
});
