class GlivRoomModal {
  constructor() {
    this.roomTopics = ["The Myth of Perfect Acoustics: Embrace the Imperfections", "Microphone Placement 2.0: Going Beyond the ‘Rule of Thirds’", "AI‑Powered Room EQ: Friend or Foe?", "Low‑Latency Monitoring: The Quest for Zero Delay", "Network Realities: When Bandwidth Becomes Your Bottleneck", "Holistic Stream Design: Integrating Environment, Content & Community"];
    this.roomImages = ["./images/lives/live-room-photo-1.jpeg", "./images/lives/live-room-photo-2.jpeg", "./images/lives/live-room-photo-3.jpeg", "./images/lives/live-room-photo-4.jpeg", "./images/lives/live-room-photo-5.jpeg"];
    this.roomNames = ["Bessie Cooper", "John Doe", "Jane Doe", "Alice Johnson", "Bob Smith", "Charlie Brown", "Diana Prince", "Eve Wilson", "Franklin Roosevelt", "Grace Hopper", "Helen Keller", "Isaac Newton", "Jill Valentine", "Katie Steele", "Liam Davis", "Morgan Freeman", "Nancy Pelosi", "Oliver Queen", "Penelope Garcia", "Quinn Mallory", "Rebecca Chambers", "Samuel Jackson", "Taylor Swift", "Victor Hugo", "Wanda Maximoff", "Xander Harris", "Yasmin Rahman", "Zack Morris"];

    this.sidebarCategories = [
      { key: "all", value: "All" },
      { key: "gaming", value: "Gaming" },
      { key: "technology", value: "Technology" },
      { key: "health_wellness", value: "Health & Wellness" },
      { key: "finance", value: "Finance" },
      { key: "travel", value: "Travel" },
      { key: "education", value: "Education" },
      { key: "food_beverage", value: "Food & Beverage" },
      { key: "fashion", value: "Fashion" },
      { key: "real_estate", value: "Real Estate" },
      { key: "sports", value: "Sports" },
      { key: "automotive", value: "Automotive" },
      { key: "entertainment", value: "Entertainment" },
      { key: "art_culture", value: "Art & Culture" },
      { key: "music", value: "Music" },
      { key: "science", value: "Science" },
    ];
    this.roomCategories = document.getElementById("roomCategories");
    this.liveRoomModalGrid = document.getElementById("liveRoomModalGrid");
    this.liveRoomModal = document.getElementById("liveRoomModal");
    this.exploreRoomContainer = document.getElementById("exploreRoomContainer");

    this.#renderCategories();
    this.#render();
    this.#renderRoomExplore();

    this.init();
  }

  #renderRoomExplore() {
    this.exploreRoomContainer.innerHTML = "";

    // Generate room data
    const roomData = this.generateRoomData(20);

    roomData.forEach((room) => {
      const markup = this.#generateRoomExploreMarkup(room);
      this.exploreRoomContainer.insertAdjacentHTML("beforeend", markup);
    });

    const moreButtonMarkup = `
      <button class="show_more_room_content">
        <span>Show more</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m6 9l6 6l6-6" /></svg>
      </button>
    `;
    this.exploreRoomContainer.insertAdjacentHTML("beforeend", moreButtonMarkup);
  }

  #generateRoomExploreMarkup(room) {
    return `
      <a href="/audio-room.html">
            <article class="room_card">
                  <div class="room_card__image">
                    <img src="${room.image}" alt="Room Banner" />
                  </div>

                  <div class="room_card__content">
                    <div class="room_card__header">
                      <svg width="20" height="20" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.42426 0.328125C5.18951 0.328125 2.92676 2.01862 2.92676 5.25C2.92676 5.55188 3.17176 5.79688 3.47363 5.79688C3.77551 5.79688 4.02051 5.55188 4.02051 5.25C4.02051 2.61975 5.78494 1.42188 7.42426 1.42188C9.06357 1.42188 10.828 2.61975 10.828 5.25C10.8302 5.30425 10.8315 5.36812 10.8315 5.432C10.8315 5.74569 10.8022 6.05237 10.7466 6.34987L10.7514 6.31925C10.646 6.80575 10.4745 7.23625 10.2431 7.62781L10.254 7.60769C10.1289 7.82337 9.99894 8.00888 9.85544 8.183L9.86113 8.176C9.77888 8.27531 9.68919 8.365 9.59951 8.45381C9.43413 8.61088 9.28451 8.78063 9.15063 8.96263L9.14319 8.97313C8.95551 9.24919 8.77176 9.56769 8.6112 9.89975L8.59107 9.94569C8.47469 10.1601 8.36357 10.4134 8.27344 10.6763L8.26294 10.7122C8.22007 10.8557 8.18944 11.0232 8.17719 11.1956L8.17676 11.2035C8.17107 11.2998 8.15663 11.3899 8.13432 11.4765L8.13651 11.4669C8.10019 11.5903 8.05907 11.6952 8.01051 11.7959L8.01619 11.7832C7.91951 11.97 7.79526 12.1288 7.64651 12.2609L7.64476 12.2622C7.32407 12.5344 6.91982 12.7172 6.47576 12.768L6.4657 12.7689C6.36288 12.7833 6.24432 12.7916 6.12401 12.7916C5.76613 12.7916 5.42532 12.7186 5.11601 12.5864L5.13263 12.593C4.74195 12.4307 4.42957 12.1459 4.2362 11.7871L4.23138 11.7775C4.11501 11.5395 4.04676 11.2599 4.04676 10.9642C4.04676 10.955 4.04676 10.9454 4.04676 10.9362V10.9375C4.04676 10.6356 3.80176 10.3906 3.49988 10.3906C3.19801 10.3906 2.95301 10.6356 2.95301 10.9375C2.95301 10.9454 2.95301 10.9541 2.95301 10.9633C2.95301 11.438 3.06413 11.8869 3.26188 12.285L3.25401 12.2675C3.56901 12.866 4.07126 13.3302 4.68113 13.5901L4.69995 13.5971C5.11426 13.7786 5.59726 13.8841 6.10476 13.8841C6.10957 13.8841 6.11438 13.8841 6.11963 13.8841H6.11876C6.29026 13.8841 6.45913 13.8727 6.62451 13.8512L6.60482 13.8534C7.28776 13.7738 7.89413 13.4943 8.37626 13.0751L8.37232 13.0786C8.62344 12.8546 8.83126 12.5886 8.98569 12.2907L8.99269 12.2754C9.06051 12.1402 9.12438 11.9801 9.17513 11.8138L9.18082 11.7919C9.22282 11.6506 9.25301 11.4861 9.26482 11.3164L9.26526 11.3089C9.27094 11.2101 9.28626 11.1178 9.30944 11.0289L9.30726 11.039C9.38907 10.8019 9.47788 10.6019 9.58069 10.4107L9.56976 10.4331C9.72463 10.108 9.88169 9.83412 10.0567 9.57337L10.0414 9.59744C10.1442 9.46006 10.2531 9.33887 10.3713 9.22819L10.3726 9.22688C10.4872 9.11312 10.6005 8.99806 10.7059 8.87075C11.2371 8.225 11.6264 7.44187 11.8146 6.5835L11.8211 6.54719C11.8872 6.21469 11.9253 5.83231 11.9253 5.44119C11.9253 5.37381 11.9239 5.30687 11.9218 5.24038L11.9222 5.25C11.9222 2.01862 9.65944 0.328125 7.4247 0.328125H7.42426ZM7.28688 7.15313C6.31257 7.30975 5.57757 8.1445 5.57757 9.15075C5.57757 9.16388 5.57757 9.17656 5.57801 9.18969V9.18794C5.57801 9.506 5.44938 9.71075 5.24988 9.71075C5.05038 9.71075 4.92176 9.50556 4.92176 9.18794C4.92176 8.88606 4.67676 8.64106 4.37488 8.64106C4.07301 8.64106 3.82801 8.88606 3.82801 9.18794C3.82363 9.23081 3.82101 9.28069 3.82101 9.331C3.82101 10.1294 4.45538 10.7791 5.24769 10.8045H5.24988C6.04438 10.7791 6.67876 10.1294 6.67876 9.331C6.67876 9.28069 6.67613 9.23081 6.67132 9.18181L6.67176 9.18794C6.67176 9.18312 6.67176 9.17744 6.67176 9.17175C6.67176 8.69663 7.02001 8.30331 7.47544 8.23244L7.4807 8.23156C7.64869 8.22063 7.80401 8.17513 7.94313 8.10294L7.93657 8.106C8.07132 8.02637 8.18376 7.924 8.27257 7.80325L8.27476 7.80019C8.61294 7.38544 8.8177 6.85038 8.8177 6.26762C8.8177 5.73913 8.64926 5.24956 8.36269 4.85056L8.36751 4.858C7.93088 4.298 7.25626 3.941 6.49807 3.941C6.46963 3.941 6.4412 3.94144 6.4132 3.94231H6.41713C6.23645 3.95281 6.0667 3.983 5.90526 4.03112L5.92145 4.02719C6.20976 3.46369 6.78594 3.08481 7.45094 3.08481C7.92476 3.08481 8.35351 3.27731 8.66326 3.58794C9.02507 3.99656 9.24557 4.53731 9.24557 5.12969C9.24557 5.17213 9.24426 5.21456 9.24207 5.25656L9.24251 5.25087C9.24251 5.55275 9.48751 5.79775 9.78938 5.79775C10.0913 5.79775 10.3363 5.55275 10.3363 5.25087C10.3446 5.16644 10.3494 5.06844 10.3494 4.96912C10.3494 3.346 9.05657 2.02475 7.44438 1.97925H7.44001C5.82388 2.02519 4.53107 3.346 4.53107 4.96912C4.53107 5.06844 4.53588 5.16644 4.54551 5.26312L4.54463 5.25087V5.25131C4.54463 5.55319 4.7892 5.79775 5.09107 5.79775C5.31463 5.79775 5.5067 5.66387 5.59113 5.47137L5.59245 5.46788C5.59988 5.46044 5.60951 5.45781 5.61651 5.44994C5.8392 5.19444 6.16513 5.03387 6.52826 5.03387C6.92157 5.03387 7.27113 5.222 7.49163 5.51338L7.49382 5.51644C7.63994 5.733 7.72744 6.00031 7.72744 6.28775C7.72744 6.60756 7.61938 6.90244 7.43782 7.13737L7.44001 7.13431L7.28688 7.15313Z" fill="#1C64F2"/></svg>
                      <span>230</span>
                    </div>

                    <div class="room_card__title">${room.title}</div>

                    <div class="room_card__host">
                      <span class="room_card__host_name">Kathryn Murphy</span>
                      <span class="room_card__host_badge">Host</span>
                    </div>

                    <div class="room_card__cohosts">
                      <span>Co-Hosts</span>

                      <div class="room_card__cohost_avatars">
                        <img class="room_card__cohost_avatar" src="./students/student--3.avif" alt="Co-host" />
                        <img class="room_card__cohost_avatar" src="./students/student--2.avif" alt="Co-host" />
                        <img class="room_card__cohost_avatar" src="./students/student--1.avif" alt="Co-host" />
                        <img class="room_card__cohost_avatar" src="./students/student--5.avif" alt="Co-host" />
                        <span class="more">+4</span>
                      </div>
                    </div>
                  </div>
            </article>
      </a>`;
  }

  init() {
    // Open
    this.exploreRoomContainer.addEventListener("click", (e) => {
      const button = e.target.closest(".show_more_room_content");

      if (button) this.show();
    });

    // Close
    this.liveRoomModal.addEventListener("click", (e) => {
      if (e.target.id === "liveRoomModal") {
        this.hide();
      }
    });

    // Category Click
    this.roomCategories.addEventListener("click", (e) => {
      const button = e.target.closest("button");
      if (button) {
        this.roomCategories.querySelector("button[data-active]").removeAttribute("data-active");
        button.setAttribute("data-active", "");

        this.#render();
      }
    });
  }

  generateRoomData(count = 10) {
    const roomData = [];

    for (let i = 0; i < count; i++) {
      roomData.push({
        title: this.roomTopics[Math.floor(Math.random() * this.roomTopics.length)],
        image: this.roomImages[Math.floor(Math.random() * this.roomImages.length)],
        userImage: this.roomImages[Math.floor(Math.random() * this.roomImages.length)],
        host: this.roomNames[Math.floor(Math.random() * this.roomNames.length)],
        userCount: Math.floor(Math.random() * 1000),
        views: Math.floor(Math.random() * 1000),
        likes: Math.floor(Math.random() * 1000),
        category: this.sidebarCategories[Math.floor(Math.random() * this.sidebarCategories.length)],
      });
    }

    return roomData;
  }

  hide() {
    this.liveRoomModal.classList.add(HIDDEN);
  }

  show() {
    this.liveRoomModal.classList.remove(HIDDEN);
  }

  // Render Live Categories :)
  #renderCategories() {
    if (!this.roomCategories) return;
    this.roomCategories.innerHTML = this.sidebarCategories.map((cat, i) => `<button ${i === 0 ? "data-active" : ""} type="button" aria-label="${cat.value}" role="button" data-key="${cat.key}">${cat.value}</button>`).join("");
  }

  #render() {
    // Clear existing content first
    this.liveRoomModalGrid.innerHTML = "";

    // Generate room data
    const roomData = this.generateRoomData(20);

    // Shuffle the array
    for (let i = roomData.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [roomData[i], roomData[j]] = [roomData[j], roomData[i]];
    }

    // Render the shuffled rooms
    roomData.forEach((room) => {
      const markup = this.#generateMarkup(room);
      this.liveRoomModalGrid.insertAdjacentHTML("beforeend", markup);
    });
  }

  #generateMarkup(room) {
    return `
                    <article class="room_card">
                          <div class="room_card__image">
                            <img src="${room.image}" alt="Room Banner" />
                          </div>
    
                          <div class="room_card__content">
                            <div class="room_card__header">
                              <svg width="20" height="20" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.42426 0.328125C5.18951 0.328125 2.92676 2.01862 2.92676 5.25C2.92676 5.55188 3.17176 5.79688 3.47363 5.79688C3.77551 5.79688 4.02051 5.55188 4.02051 5.25C4.02051 2.61975 5.78494 1.42188 7.42426 1.42188C9.06357 1.42188 10.828 2.61975 10.828 5.25C10.8302 5.30425 10.8315 5.36812 10.8315 5.432C10.8315 5.74569 10.8022 6.05237 10.7466 6.34987L10.7514 6.31925C10.646 6.80575 10.4745 7.23625 10.2431 7.62781L10.254 7.60769C10.1289 7.82337 9.99894 8.00888 9.85544 8.183L9.86113 8.176C9.77888 8.27531 9.68919 8.365 9.59951 8.45381C9.43413 8.61088 9.28451 8.78063 9.15063 8.96263L9.14319 8.97313C8.95551 9.24919 8.77176 9.56769 8.6112 9.89975L8.59107 9.94569C8.47469 10.1601 8.36357 10.4134 8.27344 10.6763L8.26294 10.7122C8.22007 10.8557 8.18944 11.0232 8.17719 11.1956L8.17676 11.2035C8.17107 11.2998 8.15663 11.3899 8.13432 11.4765L8.13651 11.4669C8.10019 11.5903 8.05907 11.6952 8.01051 11.7959L8.01619 11.7832C7.91951 11.97 7.79526 12.1288 7.64651 12.2609L7.64476 12.2622C7.32407 12.5344 6.91982 12.7172 6.47576 12.768L6.4657 12.7689C6.36288 12.7833 6.24432 12.7916 6.12401 12.7916C5.76613 12.7916 5.42532 12.7186 5.11601 12.5864L5.13263 12.593C4.74195 12.4307 4.42957 12.1459 4.2362 11.7871L4.23138 11.7775C4.11501 11.5395 4.04676 11.2599 4.04676 10.9642C4.04676 10.955 4.04676 10.9454 4.04676 10.9362V10.9375C4.04676 10.6356 3.80176 10.3906 3.49988 10.3906C3.19801 10.3906 2.95301 10.6356 2.95301 10.9375C2.95301 10.9454 2.95301 10.9541 2.95301 10.9633C2.95301 11.438 3.06413 11.8869 3.26188 12.285L3.25401 12.2675C3.56901 12.866 4.07126 13.3302 4.68113 13.5901L4.69995 13.5971C5.11426 13.7786 5.59726 13.8841 6.10476 13.8841C6.10957 13.8841 6.11438 13.8841 6.11963 13.8841H6.11876C6.29026 13.8841 6.45913 13.8727 6.62451 13.8512L6.60482 13.8534C7.28776 13.7738 7.89413 13.4943 8.37626 13.0751L8.37232 13.0786C8.62344 12.8546 8.83126 12.5886 8.98569 12.2907L8.99269 12.2754C9.06051 12.1402 9.12438 11.9801 9.17513 11.8138L9.18082 11.7919C9.22282 11.6506 9.25301 11.4861 9.26482 11.3164L9.26526 11.3089C9.27094 11.2101 9.28626 11.1178 9.30944 11.0289L9.30726 11.039C9.38907 10.8019 9.47788 10.6019 9.58069 10.4107L9.56976 10.4331C9.72463 10.108 9.88169 9.83412 10.0567 9.57337L10.0414 9.59744C10.1442 9.46006 10.2531 9.33887 10.3713 9.22819L10.3726 9.22688C10.4872 9.11312 10.6005 8.99806 10.7059 8.87075C11.2371 8.225 11.6264 7.44187 11.8146 6.5835L11.8211 6.54719C11.8872 6.21469 11.9253 5.83231 11.9253 5.44119C11.9253 5.37381 11.9239 5.30687 11.9218 5.24038L11.9222 5.25C11.9222 2.01862 9.65944 0.328125 7.4247 0.328125H7.42426ZM7.28688 7.15313C6.31257 7.30975 5.57757 8.1445 5.57757 9.15075C5.57757 9.16388 5.57757 9.17656 5.57801 9.18969V9.18794C5.57801 9.506 5.44938 9.71075 5.24988 9.71075C5.05038 9.71075 4.92176 9.50556 4.92176 9.18794C4.92176 8.88606 4.67676 8.64106 4.37488 8.64106C4.07301 8.64106 3.82801 8.88606 3.82801 9.18794C3.82363 9.23081 3.82101 9.28069 3.82101 9.331C3.82101 10.1294 4.45538 10.7791 5.24769 10.8045H5.24988C6.04438 10.7791 6.67876 10.1294 6.67876 9.331C6.67876 9.28069 6.67613 9.23081 6.67132 9.18181L6.67176 9.18794C6.67176 9.18312 6.67176 9.17744 6.67176 9.17175C6.67176 8.69663 7.02001 8.30331 7.47544 8.23244L7.4807 8.23156C7.64869 8.22063 7.80401 8.17513 7.94313 8.10294L7.93657 8.106C8.07132 8.02637 8.18376 7.924 8.27257 7.80325L8.27476 7.80019C8.61294 7.38544 8.8177 6.85038 8.8177 6.26762C8.8177 5.73913 8.64926 5.24956 8.36269 4.85056L8.36751 4.858C7.93088 4.298 7.25626 3.941 6.49807 3.941C6.46963 3.941 6.4412 3.94144 6.4132 3.94231H6.41713C6.23645 3.95281 6.0667 3.983 5.90526 4.03112L5.92145 4.02719C6.20976 3.46369 6.78594 3.08481 7.45094 3.08481C7.92476 3.08481 8.35351 3.27731 8.66326 3.58794C9.02507 3.99656 9.24557 4.53731 9.24557 5.12969C9.24557 5.17213 9.24426 5.21456 9.24207 5.25656L9.24251 5.25087C9.24251 5.55275 9.48751 5.79775 9.78938 5.79775C10.0913 5.79775 10.3363 5.55275 10.3363 5.25087C10.3446 5.16644 10.3494 5.06844 10.3494 4.96912C10.3494 3.346 9.05657 2.02475 7.44438 1.97925H7.44001C5.82388 2.02519 4.53107 3.346 4.53107 4.96912C4.53107 5.06844 4.53588 5.16644 4.54551 5.26312L4.54463 5.25087V5.25131C4.54463 5.55319 4.7892 5.79775 5.09107 5.79775C5.31463 5.79775 5.5067 5.66387 5.59113 5.47137L5.59245 5.46788C5.59988 5.46044 5.60951 5.45781 5.61651 5.44994C5.8392 5.19444 6.16513 5.03387 6.52826 5.03387C6.92157 5.03387 7.27113 5.222 7.49163 5.51338L7.49382 5.51644C7.63994 5.733 7.72744 6.00031 7.72744 6.28775C7.72744 6.60756 7.61938 6.90244 7.43782 7.13737L7.44001 7.13431L7.28688 7.15313Z" fill="#1C64F2"/></svg>
                              <span>${room.userCount}</span>
                            </div>
    
                            <div class="room_card__title">${room.title}</div>
    
                            <div class="room_card__host">
                              <span class="room_card__host_name">${room.host}</span>
                              <span class="room_card__host_badge">Host</span>
                            </div>
    
                            <div class="room_card__cohosts">
                              <span>Co-Hosts</span>
    
                              <div class="room_card__cohost_avatars">
                                <img class="room_card__cohost_avatar" src="./students/student--3.avif" alt="Co-host" />
                                <img class="room_card__cohost_avatar" src="./students/student--2.avif" alt="Co-host" />
                                <img class="room_card__cohost_avatar" src="./students/student--1.avif" alt="Co-host" />
                                <img class="room_card__cohost_avatar" src="./students/student--5.avif" alt="Co-host" />
                                <span class="more">+4</span>
                              </div>
                            </div>
                          </div>
                    </article>
        `;
  }
}

new GlivRoomModal();
