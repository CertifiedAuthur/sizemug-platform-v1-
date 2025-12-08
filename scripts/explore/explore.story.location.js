class CreateStoryLocation {
  constructor() {
    this.dummyPeople = [
      {
        id: 1,
        name: "Floyd Miles",
        avatarUrl: "https://images.unsplash.com/photo-1575936123452-b67c3203c357?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
        borderColor: "",
        isHost: true,
      },
      {
        id: 2,
        name: "Theresa Webb",
        avatarUrl: "https://media.istockphoto.com/id/2194078950/photo/profile-picture-of-smiling-confident-arabic-businessman.webp?a=1&b=1&s=612x612&w=0&k=20&c=42Z7FDi1u5Ogevtd0xMUkTWM7hDzrre4YOlbHKvK_T8=",
      },
      {
        id: 3,
        name: "Marvin McKinney",
        avatarUrl: "https://media.istockphoto.com/id/1305462732/photo/headshot-studio-portrait-of-a-woman-in-profile-looking-at-the-camera.webp?a=1&b=1&s=612x612&w=0&k=20&c=eUD1dQpwz-vwxv4N6Y8CGHlL6L-klb-xDYm5qmJcJD0=",
      },
      {
        id: 4,
        name: "Ralph Edwards",
        avatarUrl: "https://images.unsplash.com/photo-1695927621677-ec96e048dce2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZSUyMHBob3RvfGVufDB8fDB8fHww",
      },
      {
        id: 5,
        name: "Bessie Cooper",
        avatarUrl: "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cHJvZmlsZSUyMHBob3RvfGVufDB8fDB8fHww",
      },

      {
        id: 6,
        name: "Ronald Richards",
        avatarUrl: "https://images.unsplash.com/photo-1688888745596-da40843a8d45?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZSUyMHBob3RvfGVufDB8fDB8fHww",
      },

      {
        id: 7,
        name: "Savannah Nguyen",
        avatarUrl: "https://images.unsplash.com/photo-1672863601285-253fc82db868?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZmlsZSUyMHBob3RvfGVufDB8fDB8fHww",
      },
      {
        id: 8,
        name: "Eliza Jacobs",
        avatarUrl: "https://plus.unsplash.com/premium_photo-1689977968861-9c91dbb16049?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cHJvZmlsZSUyMHBob3RvfGVufDB8fDB8fHww",
      },
      {
        id: 9,
        name: "Guy Hawkins",
        avatarUrl: "https://plus.unsplash.com/premium_photo-1690086519096-0594592709d3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHByb2ZpbGUlMjBwaG90b3xlbnwwfHwwfHx8MA%3D%3D",
      },
      {
        id: 10,
        name: "Jane Appleseed",
        avatarUrl: "https://images.unsplash.com/photo-1620000617482-821324eb9a14?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHByb2ZpbGUlMjBwaG90b3xlbnwwfHwwfHx8MA%3D%3D",
      },
      {
        id: 11,
        name: "Marvin McKinney",
        avatarUrl: "https://media.istockphoto.com/id/1305462732/photo/headshot-studio-portrait-of-a-woman-in-profile-looking-at-the-camera.webp?a=1&b=1&s=612x612&w=0&k=20&c=eUD1dQpwz-vwxv4N6Y8CGHlL6L-klb-xDYm5qmJcJD0=",
      },
    ];

    //
    this.locationSearchContent = document.getElementById("locationSearchContent");
    this.locationTagToggle = document.getElementById("locationTagToggle");
    this.locationSection = document.getElementById("locationSection");
    this.tagSection = document.getElementById("tagSection");
    this.peopleList = document.getElementById("peopleList");
    this.tagsOnScreenTools = document.getElementById("tagsOnScreenTools");

    //
    this.GEOAPIFY_KEY = "4ac26bb38ec2489c983ff99624957faf";
    this.OPENCAGE_KEY = "b03ea56c78f546909f5e7bbff5d294c7";

    //
    this.selectedLocation = null;
    this.selectedTags = [];

    //
    this._init();
  }

  //
  _init() {
    this._registerSearchHandler();
    this._bindEvents();
    this._renderPeople();
  }

  _getLocationScreenMarkup() {
    return `
      <div class="location_display_box">
        <span class="location_box_icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="#ffffff" d="M12 11.5A2.5 2.5 0 0 1 9.5 9A2.5 2.5 0 0 1 12 6.5A2.5 2.5 0 0 1 14.5 9a2.5 2.5 0 0 1-2.5 2.5M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7"></path></svg>
        </span>

        <div>
          <h3 class="location_track">${this.selectedLocation.address}</h3>
          <span class="location_country">${this.selectedLocation.country}</span>
        </div>
      </div>
    `;
  }

  _getActiveEditorElements() {
    const canvasEditorContainer = document.querySelector(`[data-canvas-media-id="${currentStoryEditingMedia.id}"]`);
    const locationBox = canvasEditorContainer.querySelector(".location_display_box");
    const tagBox = canvasEditorContainer.querySelector(".tag_display_box");
    return { tagBox, locationBox, canvasEditorContainer };
  }

  _setupElement(el, cn, cl) {
    const markup = this._getLocationScreenMarkup();
    cn.insertAdjacentHTML("beforeend", markup);
    el = cn.querySelector(cl);
    new Interactive()._makeInteractive(el);
    return el;
  }

  //
  _bindEvents() {
    // Location Selected
    this.locationSearchContent.addEventListener("click", (e) => {
      const locationItem = e.target.closest(".location-item");

      if (locationItem) {
        const address = locationItem.dataset.address;
        const country = locationItem.dataset.country;

        this.selectedLocation = { country, address };

        let { locationBox, canvasEditorContainer } = this._getActiveEditorElements();

        // Remove previous one :)
        if (locationBox) {
          locationBox.remove();
        }

        // setup new markup :)
        locationBox = this._setupElement(null, canvasEditorContainer, ".location_display_box");
      }
    });

    // locationTagToggle
    this.locationTagToggle.addEventListener("click", (e) => {
      const button = e.target.closest("button");

      if (button) {
        const { type } = button.dataset;

        this.locationTagToggle.querySelectorAll("button").forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        this.locationSection.classList.add(HIDDEN);
        this.tagSection.classList.add(HIDDEN);

        if (type === "location") {
          this.locationSection.classList.remove(HIDDEN);
        } else {
          this.tagSection.classList.remove(HIDDEN);
        }
      }
    });

    // People Tags 😎 :)
    this.peopleList.addEventListener("click", (e) => {
      const personItem = e.target.closest(".person-item");
      if (personItem) {
        const id = +personItem.dataset.id;
        const isSelected = personItem.classList.contains("selected");

        if (isSelected) {
          this.selectedTags = this.selectedTags.filter((tag) => tag.id !== id);
          personItem.classList.remove("selected");
        } else {
          const person = this.dummyPeople.find((person) => person.id === id);
          this.selectedTags.push(person);
          personItem.classList.add("selected");
        }

        // Empty Tag
        if (!this.selectedTags.length) {
          const { tagBox } = this._getActiveEditorElements();
          tagBox.remove();
          return;
        }

        let { tagBox, canvasEditorContainer } = this._getActiveEditorElements();

        if (!tagBox) {
          const markup = this._getPeopleTagsMarkup();
          canvasEditorContainer.insertAdjacentHTML("beforeend", markup);
          const el = canvasEditorContainer.querySelector(".tag_display_box");
          new Interactive()._makeInteractive(el);

          tagBox = el;
        }

        const renderTaggedUsers = canvasEditorContainer.querySelector(".render_tagged_users");
        const renderedUsernames = canvasEditorContainer.querySelector(".rendered_usernames");

        // Render user images 😎 :)
        renderTaggedUsers.innerHTML = "";
        this.selectedTags.forEach((tag, i) => {
          if (i > 3) return;

          if (i === 3) {
            renderTaggedUsers.insertAdjacentHTML("beforeend", `<span>+${this.selectedTags.length - 3}</span>`);
            return;
          }

          const markup = `<img src="${tag.avatarUrl}" alt="${tag.name}" />`;
          renderTaggedUsers.insertAdjacentHTML("beforeend", markup);
        });

        // Render usernames 😎 :)
        let usernames = [];
        if (Array.isArray(this.selectedTags)) {
          const limit = Math.min(3, this.selectedTags.length);
          for (let i = 0; i < limit; i++) {
            const tag = this.selectedTags[i];
            if (!tag || !tag.name) continue;
            const firstName = tag.name.split(" ")[0].trim();
            if (firstName) usernames.push(firstName);
          }
        }

        renderedUsernames.textContent = `${usernames.join(", ")}${this.selectedTags.length > 3 ? " and more" : ""}`;
        this.usernames = usernames;
      }
    });
  }

  _renderPeople() {
    this.dummyPeople.forEach((people) => {
      const markup = `
                        <div class="person-item" data-id="${people.id}">
                          <img src="${people.avatarUrl}" alt="${people.name}" class="profile-pic" />
                          <span class="person-name">${people.name}</span>
                          <button>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#ffffff" d="m9.55 18l-5.7-5.7l1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4z"/></svg>
                          </button>
                        </div>
      `;

      this.peopleList.insertAdjacentHTML("beforeend", markup);
    });
  }

  //
  _renderSkeleton(container, length) {
    if (!(container instanceof HTMLElement)) {
      console.warn("Invalid container passed to _renderSkeleton:", container);
      return;
    }

    if (typeof length !== "number" || length <= 0) {
      container.innerHTML = "";
      console.log("Invalid length");
      return;
    }

    // Clear old content
    container.innerHTML = "";

    // Build skeleton items
    for (let i = 0; i < length; i++) {
      container.insertAdjacentHTML("beforeend", `<div class="skeleton_loading" style="height: 30px; min-height: 30px; width: 100%; border-radius: 5px"></div>`);
    }
  }

  //
  _registerSearchHandler() {
    const locationSearchInput = document.getElementById("locationSearch");
    let debounceTimer;

    locationSearchInput.addEventListener("input", (e) => {
      const query = e.target.value.trim();

      if (query.length < 2) return;
      clearTimeout(debounceTimer);

      this._renderSkeleton(this.locationSearchContent, 20);

      debounceTimer = setTimeout(async () => {
        this.searchPlaces = await this._searchPlacesGeoapify(query, 20);
        this._renderFormattedPlaces(this.locationSearchContent, this.searchPlaces);
      }, 300);
    });
  }

  /*** Search places by text (up to `limit` suggestions) ***/
  async _searchPlacesGeoapify(query, limit = 2) {
    const url = new URL("https://api.geoapify.com/v1/geocode/autocomplete");
    url.searchParams.set("text", query);
    url.searchParams.set("limit", limit);
    url.searchParams.set("apiKey", this.GEOAPIFY_KEY);

    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`Geoapify search error: ${resp.statusText}`);
    const json = await resp.json();
    console.log(json);
    return json.features.map((f) => ({
      address: `${f.properties.state ?? ""}, ${f.properties.address_line1}`,
      country: f.properties.country,
      coords: [f.properties.lat, f.properties.lon],
    }));
  }

  //
  _renderFormattedPlaces(container, places = []) {
    //
    if (!(container instanceof HTMLElement)) {
      console.warn("Invalid container passed to _renderSkeleton:", container);
      return;
    }

    container.innerHTML = "";

    //
    if (!Array.isArray(places)) {
      console.log("Invalid places");
      return;
    }

    // Empty Array :)
    if (!places.length) {
      container.insertAdjacentHTML("beforeend", this._getEmptyMarkup());
      return;
    }

    places.forEach((place) => {
      const markup = this._getMarkup(place);
      container.insertAdjacentHTML("beforeend", markup);
    });
  }

  //
  _getEmptyMarkup() {
    return `
        <div class="no_location_found">
                <h2>No Location Found 😉 :)</h2>
                <p>Search for location 🔍</p>
        </div>
        `;
  }

  //
  _getMarkup(place) {
    return `
                        <div class="location-item" data-address="${place.address}" data-country="${place.country}">
                          <div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 56 56"><path fill="#000000" d="M5.137 28.246c.82.797 1.64 1.055 3.258 1.078l17.742.07c.164 0 .304.024.375.094c.07.07.093.211.093.375l.07 17.743c.024 1.617.282 2.437 1.102 3.257c1.102 1.125 2.649.938 3.797-.187c.61-.61 1.102-1.617 1.547-2.555L51.051 9.45c.937-1.968.82-3.422-.14-4.36c-.939-.96-2.392-1.077-4.36-.14L7.879 22.88c-.938.445-1.945.937-2.555 1.547c-1.125 1.148-1.312 2.695-.187 3.82m4.758-2.484c-.024-.07.023-.14.164-.211L47.16 8.51c.188-.07.281-.07.352-.023c.047.07.047.164-.024.352L30.45 45.94c-.07.141-.14.188-.21.164c-.048 0-.118-.093-.118-.187l.117-18.516c0-.586-.21-.96-.445-1.195c-.235-.234-.61-.445-1.195-.445l-18.516.117c-.094 0-.187-.07-.187-.117" /></svg>
                          </div>
                          <div>
                            <h3>${place.address}</h3>
                            <span>${place.country}</span>
                          </div>
                        </div>`;
  }

  _getPeopleTagsMarkup() {
    return `
      <div class="tag_display_box">
        <div class="render_tagged_users"></div>
        <div class="rendered_usernames"></div>
      </div>
    `;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.createStoryLocation = new CreateStoryLocation();
});
