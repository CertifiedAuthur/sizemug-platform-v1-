class ChatLocationTracker {
  constructor(mapContainerId = "locationTrackingMap") {
    this.mapContainerId = mapContainerId;
    this.locationTrackingMap = document.getElementById(this.mapContainerId);
    this.currentLocationPlace = document.getElementById("currentLocationPlace");
    this.placesContainer = document.getElementById("placesContainer");
    this.searchPlacesContainer = document.getElementById("searchPlacesContainer");
    this.shareLiveLocationBtn = document.getElementById("shareLiveLocationBtn");
    this.backShareLiveLocation = document.getElementById("backShareLiveLocation");
    this.shareLocationModal = document.getElementById("shareLocationModal");
    this.findManuallyBtn = document.getElementById("findManually");
    this.shareLocationBtn = document.getElementById("shareLocationBtn");
    this.locationContainerTracking = document.getElementById("locationContainerTracking");

    this.initState = false;
    this.popper = null;
    this.lat = null;
    this.lng = null;
    this.map = null;
    this.address = null;
    this.places = null;
    this.searchPlaces = null;
    this.GEOAPIFY_KEY = "4ac26bb38ec2489c983ff99624957faf";
    this.OPENCAGE_KEY = "b03ea56c78f546909f5e7bbff5d294c7";

    this.selectedLocation = {};

    this.initEvents();
  }

  async init() {
    if (this.initState) return;

    this.initState = true;
    await this._getIPCoords();
    await this._renderMap();
    await this._getAddressFromCoords();
    await this._getNearbyPlaces();

    this._updateUserLocation();
    this._registerSearchHandler();
  }

  // Event listeners
  initEvents() {
    // Open modal
    this.shareLiveLocationBtn.addEventListener("click", () => {
      hideAdditionalChatModalContainer();
      this.shareLocationModal.classList.remove(HIDDEN);
      this.init();
    });

    // Back Share Live Location :)
    this.backShareLiveLocation.addEventListener("click", (e) => {
      e.stopPropagation();

      this.shareLocationModal.classList.add(HIDDEN);
      if (recentAddtionalReferenceBtn && recentAddtionalTrackerId) {
        showAdditionalChatModalContainer(recentAddtionalReferenceBtn, recentAddtionalTrackerId, !!isRecentAddtionalModal);
      }
    });

    // Close modal on click outside
    document.addEventListener("click", (e) => {
      if (!this.shareLocationModal.classList.contains(HIDDEN) && !e.target.closest("#shareLocationModal") && !e.target.closest("#shareLiveLocationBtn")) {
        this.shareLocationModal.classList.add(HIDDEN);
      }
    });

    // Find manually
    this.findManuallyBtn.addEventListener("click", (e) => {
      this.locationContainerTracking.setAttribute("aria-state", "searching");
    });

    // Share location
    this.shareLocationBtn.addEventListener("click", () => {
      if (currentOpenedUser) {
        const currentUserChats = chatMessages.find((msg) => msg.userId === currentOpenedUser.id);

        const newMap = {
          sender_id: USERID,
          receiver_id: Number(`${Math.random()}`.split(".").at(-1)),
          message_id: Number(`${Math.random()}`.split(".").at(-1)),
          type: "map",
          thumbnail: "/images/receiver-map.png",
          location_address: this.selectedLocation.address,
          coords: [this.selectedLocation.latitude, this.selectedLocation.longitude],
          timestamp: new Date().getTime(),
          status: "sent",
          reactions: [],
          message: {
            text: "Whats the full gist? 👂",
          },
        };

        currentUserChats.messages.push(newMap);

        const container = currentOpenedChatContainer.querySelector(".chatting_container_message");

        invalidateChattingMessages(currentUserChats, container);
        this.shareLocationModal.classList.add(HIDDEN);
      }
    });

    //
    this.locationContainerTracking.addEventListener("click", (e) => {
      const listItem = e.target.closest("li.location_item");
      const listItems = this.locationContainerTracking.querySelectorAll("li");

      if (listItem) {
        const { longitude, latitude, address } = listItem.dataset;

        listItems.forEach((li) => li.classList.remove("active"));
        listItem.classList.add("active");
        this.shareLocationBtn.disabled = false;

        // Update
        this.selectedLocation.address = address;
        this.selectedLocation.longitude = longitude;
        this.selectedLocation.latitude = latitude;
      }
    });
  }

  //
  _getCoords() {
    if (!this.lat || !this.lng) {
      console.log("No coordinates found");
      return;
    }

    return [this.lat, this.lng];
  }

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
      container.insertAdjacentHTML(
        "beforeend",
        `<div class="skeleton_loading" 
           style="height: 30px; width: 100%; border-radius: 5px"></div>`
      );
    }
  }

  _registerSearchHandler() {
    const searchPlacesInput = document.getElementById("searchPlacesInput");
    let debounceTimer;

    searchPlacesInput.addEventListener("input", (e) => {
      const query = e.target.value.trim();

      if (query.length < 3) return;
      clearTimeout(debounceTimer);

      this._renderSkeleton(this.searchPlacesContainer, 2);

      debounceTimer = setTimeout(async () => {
        this.searchPlaces = await this._searchPlacesGeoapify(query);
        this._renderFormattedPlaces(this.searchPlacesContainer, this.searchPlaces);
      }, 300);
    });
  }

  //
  async _getIPCoords() {
    const response = await fetch("https://get.geojs.io/v1/ip/geo.json");
    const res = await response.json();
    const [lat, lng] = [res.latitude, res.longitude];

    this.lat = lat;
    this.lng = lng;
    return [lat, lng];
  }

  //
  async _renderMap() {
    const [lat, lng] = this._getCoords();

    this.map = L.map(this.mapContainerId, {
      zoomControl: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      dragging: false,
      boxZoom: false,
      keyboard: false,
      touchZoom: false,
    }).setView([lat, lng], 8);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 8,
      attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors",
    }).addTo(this.map);

    const profileImage = `https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZSUyMGltYWdlfGVufDB8fDB8fHww`;
    const ProfileIcon = L.divIcon({
      html: `
        <div class="location_icon">
          <img src="/images/map-marker.png" style="width: 25px;height: 25px;" />
          <img src="${profileImage}" style="width: 30px;height: 30px;border-radius: 50%;border: 3px solid purple;box-shadow: 0 0 5px rgba(0,0,0,0.3);" alt="You" role="presentation" />
        </div>
      `,
      className: "",
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      interactive: false,
    });

    L.marker([lat, lng], { icon: ProfileIcon }).addTo(this.map);
  }

  //
  async _getAddressFromCoords() {
    const [lat, lng] = this._getCoords();
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${this.OPENCAGE_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    this.address = data.results[0]?.formatted;
    return data.results[0]?.formatted;
  }

  /*** Fetch nearby places (max `limit` results) ***/
  async _getNearbyPlaces(categories = "catering.restaurant", limit = 2) {
    const url = new URL("https://api.geoapify.com/v2/places");
    url.searchParams.set("categories", categories);
    url.searchParams.set("bias", `proximity:${this.lng},${this.lat}`);
    url.searchParams.set("limit", limit);
    url.searchParams.set("apiKey", this.GEOAPIFY_KEY);

    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`Geoapify error: ${resp.statusText}`);
    const { features } = await resp.json();
    const places = features.map((f) => ({
      name: f.properties.name,
      address: f.properties.formatted,
      coords: [f.geometry.coordinates[1], f.geometry.coordinates[0]],
      distanceMeters: f.properties.distance,
    }));
    this.places = places;
    return places;
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
    return json.features.map((f) => ({
      address: f.properties.formatted,
      coords: [f.properties.lat, f.properties.lon],
    }));
  }

  //
  _updateUserLocation() {
    // Update user location
    this.currentLocationPlace.innerHTML = this._getMarkup({ address: this.address });

    // Render places
    this._renderFormattedPlaces(this.placesContainer, this.places);
  }

  //
  _renderFormattedPlaces(container, places = []) {
    if (!(container instanceof HTMLElement)) {
      console.warn("Invalid container passed to _renderSkeleton:", container);
      return;
    }

    if (!Array.isArray(places) || places.length <= 0) {
      container.innerHTML = "";
      console.log("Invalid places");
      return;
    }

    container.innerHTML = "";
    places.forEach((place) => {
      const markup = this._getMarkup({ address: place.address, lat: place.coords[0], lng: place.coords[1] });
      container.insertAdjacentHTML("beforeend", markup);
    });
  }

  _getMarkup(location) {
    return `
      <li role="button" class="location_item" data-address="${location.address}" data-latitude="${location.lat}" data-longitude="${location.lng}">
        <div class="location_icon">
          <svg width="24" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.7161 19.7279C13.7225 18.8076 14.6538 17.8073 15.5013 16.7367C17.2863 14.4765 18.3721 12.248 18.4456 10.2665C18.4747 9.46117 18.3424 8.65821 18.0567 7.90557C17.771 7.15293 17.3377 6.46604 16.7827 5.88595C16.2277 5.30586 15.5623 4.84446 14.8264 4.52932C14.0905 4.21417 13.2991 4.05175 12.4996 4.05175C11.7 4.05175 10.9086 4.21417 10.1727 4.52932C9.43679 4.84446 8.77146 5.30586 8.21644 5.88595C7.66143 6.46604 7.22812 7.15293 6.9424 7.90557C6.65668 8.65821 6.52442 9.46117 6.5535 10.2665C6.62787 12.248 7.71462 14.4765 9.49875 16.7367C10.3462 17.8073 11.2775 18.8076 12.2839 19.7279C12.3807 19.8161 12.4528 19.8802 12.5 19.9202L12.7161 19.7279ZM11.8542 20.7553C11.8542 20.7553 5.5 15.3619 5.5 10.0548C5.5 8.18378 6.2375 6.38936 7.55025 5.06632C8.86301 3.74328 10.6435 3 12.5 3C14.3565 3 16.137 3.74328 17.4497 5.06632C18.7625 6.38936 19.5 8.18378 19.5 10.0548C19.5 15.3619 13.1458 20.7553 13.1458 20.7553C12.7922 21.0833 12.2104 21.0798 11.8542 20.7553ZM12.5 12.524C13.1498 12.524 13.7729 12.2639 14.2324 11.8008C14.6919 11.3378 14.95 10.7097 14.95 10.0548C14.95 9.39997 14.6919 8.77192 14.2324 8.30886C13.7729 7.8458 13.1498 7.58565 12.5 7.58565C11.8502 7.58565 11.2271 7.8458 10.7676 8.30886C10.3081 8.77192 10.05 9.39997 10.05 10.0548C10.05 10.7097 10.3081 11.3378 10.7676 11.8008C11.2271 12.2639 11.8502 12.524 12.5 12.524ZM12.5 13.5823C11.5717 13.5823 10.6815 13.2106 10.0251 12.5491C9.36875 11.8876 9 10.9904 9 10.0548C9 9.11931 9.36875 8.2221 10.0251 7.56058C10.6815 6.89906 11.5717 6.52742 12.5 6.52742C13.4283 6.52742 14.3185 6.89906 14.9749 7.56058C15.6313 8.2221 16 9.11931 16 10.0548C16 10.9904 15.6313 11.8876 14.9749 12.5491C14.3185 13.2106 13.4283 13.5823 12.5 13.5823Z" fill="#8837E9"/></svg>
        </div>
        <div class="location_name">${location.address}</div>
        <div role="button" class="custom_location_check">
          <span></span>
        </div>
      </li>
  `;
  }
}

window.ChatLocationTracker = new ChatLocationTracker();
