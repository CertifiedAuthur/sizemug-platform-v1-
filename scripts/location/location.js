class LocationApp {
  constructor() {
    this.locationStar = document.getElementById("locationStar");
    this.rateLocationStars = document.getElementById("rateLocationStars");
    this.locationAllTimeRatings = document.getElementById("locationAllTimeRatings");
    this.locationModalInfo = document.getElementById("locationModalInfo");
    this.showAllRatings = document.getElementById("showAllRatings");
    this.allStarItems = Array.from(this.rateLocationStars.querySelectorAll("li"));

    // initial selected rating (0 = none). Could be loaded from server.
    this.selectedRating = 0;

    this._init();
  }

  _init() {
    // show/hide the star UI (existing behavior)
    this.locationStar.addEventListener("mouseenter", () => this._showStars());
    const ratedLocation = document.querySelector(".rated_location");
    if (ratedLocation) {
      ratedLocation.addEventListener("mouseleave", () => this._hideStars());
    }

    // per-star pointer + keyboard handlers
    this.allStarItems.forEach((star) => {
      // pointerenter / pointerleave for hover highlight
      star.addEventListener("pointerenter", (e) => {
        const pos = this._posFromStar(star);
        this._highlight(pos);
      });

      // click (or pointerup) to set rating
      star.addEventListener("click", (e) => {
        const pos = this._posFromStar(star);
        this._setRating(pos);
      });
    });

    // When pointer leaves the whole star list, restore the selected rating
    this.rateLocationStars.addEventListener("pointerleave", () => {
      this._restoreSelected();
    });

    // Optionally initialize from markup (e.g., li elements that have `.selected` already)
    this._loadInitialSelectedFromDOM();

    // show all ratings — stop the click from bubbling so the document handler won't immediately close it
    this.showAllRatings.addEventListener("click", (e) => {
      e.stopPropagation(); //  very important
      this.locationModalInfo.classList.add(HIDDEN);
      this.locationAllTimeRatings.classList.remove(HIDDEN);
    });

    document.addEventListener("click", (e) => {
      if (this.locationAllTimeRatings.classList.contains(HIDDEN)) return;
      if (this.locationAllTimeRatings.contains(e.target) || this.locationModalInfo.contains(e.target)) {
        return;
      }

      this.locationAllTimeRatings.classList.add(HIDDEN);
      this.locationModalInfo.classList.remove(HIDDEN);
    });

    // Also prevent clicks INSIDE the all-time ratings panel from bubbling to document
    this.locationAllTimeRatings.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }

  _posFromStar(star) {
    // read the data-star-position attribute (number)
    return Number(star.dataset.starPosition) || this.allStarItems.indexOf(star) + 1;
  }

  // Highlight 1..n (temporary hover)
  _highlight(n) {
    this.allStarItems.forEach((li) => {
      const pos = this._posFromStar(li);
      if (pos <= n) li.classList.add("filled");
      else li.classList.remove("filled");
    });
  }

  // Set the selected rating (persist in UI)
  _setRating(n) {
    this.selectedRating = n;
    this.allStarItems.forEach((li) => {
      const pos = this._posFromStar(li);
      const selected = pos <= n;
      li.classList.toggle("selected", selected);
      // update aria-checked for each as radiogroup (true only for the "selected value")
      // we mark the exact radio with aria-checked true for best screen reader result
      li.setAttribute("aria-checked", pos === n ? "true" : "false");
    });
  }

  // Restore UI to the last selected rating (used on container leave)
  _restoreSelected() {
    this._highlight(0); // remove temporary highlights
    // apply selected class based on selectedRating
    this.allStarItems.forEach((li) => {
      const pos = this._posFromStar(li);
      if (pos <= this.selectedRating) li.classList.add("filled");
      else li.classList.remove("filled");
    });
  }

  // load initial `.selected` from DOM if present
  _loadInitialSelectedFromDOM() {
    const selectedEls = this.allStarItems.filter((li) => li.classList.contains("selected"));
    if (selectedEls.length) {
      // assume highest pos among selectedEls is the current rating
      const max = Math.max(...selectedEls.map((el) => this._posFromStar(el)));
      this._setRating(max);
    } else {
      // nothing selected; ensure no filled state
      this._restoreSelected();
    }
  }

  _showStars() {
    this.rateLocationStars.classList.remove("location-hidden");
  }

  _hideStars() {
    this.rateLocationStars.classList.add("location-hidden");
    // when hiding restore selected visuals
    this._restoreSelected();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.locationApp = new LocationApp();
});
