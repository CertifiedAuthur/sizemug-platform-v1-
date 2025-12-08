/**
 * Challenges Page Manager
 * Handles trend chart, filters, and challenge navigation
 */
class ChallengesManager {
  constructor() {
    this.chart = null;
    this.filterTagsContainer = null;
    this.advancedFiltersDropdown = null;
    this.moreChallengesContainer = null;
    this.initialView = null;

    this.init();
  }

  /**
   * Initialize the challenges manager
   */
  init() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.onDOMReady());
    } else {
      this.onDOMReady();
    }
    window.addEventListener("load", () => this.initTrendChart());
  }

  /**
   * Handle DOM ready event
   */
  onDOMReady() {
    this.initTrendChart();
    this.initMoreChallengesToggle();
    this.initAdvancedFilters();
    const challenge_trending_lists = document.querySelectorAll(".challenge_trending_lists li");
    challenge_trending_lists.forEach((challenge_trending) => {
      challenge_trending.addEventListener("click", (event) => {
        const selectedChallenges = document.querySelector(".selected_challenge span.challenge_text");
        const challenge_stats_header_text = document.querySelector(".challenge_stats_header_text");
        const trend_text = challenge_trending.querySelector("span.title").textContent;
        challenge_stats_header_text.textContent = trend_text;
        selectedChallenges.textContent = "# " + trend_text;
      })
    });
  }

  /**
   * Initialize the trend chart
   */
  initTrendChart() {
    const canvas = document.getElementById("trendChart");
    if (!canvas) {
      setTimeout(() => this.initTrendChart(), 100);
      return;
    }

    const ctx = canvas.getContext("2d");

    // Upward trending data that matches the reference image
    const dataPoints = [10, 11, 9, 12, 11, 13, 14, 15, 13, 16, 18, 17, 19, 22, 25, 24, 26, 28, 30, 29, 32, 35, 33, 36];
    const labels = new Array(dataPoints.length).fill("").map((_, i) => i);

    // Create vertical gradient for fill
    const createGradient = (ctx, chartArea) => {
      const { top, bottom } = chartArea;
      const grad = ctx.createLinearGradient(0, top, 0, bottom);
      grad.addColorStop(0, "rgba(34, 197, 94, 0.3)");
      grad.addColorStop(0.5, "rgba(34, 197, 94, 0.1)");
      grad.addColorStop(1, "rgba(34, 197, 94, 0.02)");
      return grad;
    };

    // Build the chart with working configuration
    this.chart = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Trend",
            data: dataPoints,
            tension: 0.38,
            cubicInterpolationMode: "monotone",
            borderWidth: 3,
            pointRadius: 0,
            pointHoverRadius: 5,
            borderColor: "#22c55e",
            fill: true,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        layout: { padding: { top: 14, bottom: 14, left: 10, right: 10 } },
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: true,
            backgroundColor: "#fff",
            titleColor: "#000",
            bodyColor: "#111",
            borderColor: "rgba(0,0,0,0.06)",
            borderWidth: 1,
            padding: 8,
            boxPadding: 4,
          },
        },
        scales: {
          x: {
            display: true,
            grid: {
              display: true,
              color: "rgba(15,23,42,0.08)",
              lineWidth: 1,
              drawBorder: false,
            },
            ticks: {
              callback: (tickValue, idx, ticks) => {
                const total = labels.length;
                const slots = 7;
                const indicesToShow = new Set(Array.from({ length: slots }, (_, i) => Math.round((i * (total - 1)) / (slots - 1))));
                const days = ["Mon 15", "Tue 16", "Wed 17", "Thu 18", "Fri 19", "Sat 20", "Sun 21"];
                return indicesToShow.has(idx) ? days[Array.from(indicesToShow).indexOf(idx)] || "" : "";
              },
              color: "rgba(0,0,0,0.18)",
              autoSkip: false,
              maxRotation: 0,
              minRotation: 0,
              padding: 8,
              font: { size: 12 },
            },
            border: { display: false },
          },
          y: {
            display: true,
            grid: {
              display: true,
              drawBorder: false,
              color: "rgba(15,23,42,0.08)",
              lineWidth: 1,
              drawOnChartArea: true,
            },
            ticks: {
              display: false,
            },
            border: {
              display: false,
            },
            beginAtZero: true,
            suggestedMin: 0,
            suggestedMax: Math.max(...dataPoints) + 5,
          },
        },
        elements: {
          line: {
            borderJoinStyle: "round",
            borderCapStyle: "round",
          },
        },
        animation: {
          duration: 900,
          easing: "cubicBezier(0.2, 0.8, 0.2, 1)",
        },
        normalized: true,
      },
      plugins: [
        {
          id: "areaGradientSetter",
          beforeDatasetsDraw(chart, args, options) {
            const chartArea = chart.chartArea;
            if (!chartArea) return;
            const ds = chart.data.datasets[0];
            ds.backgroundColor = createGradient(chart.ctx, chartArea);
          },
        },
      ],
    });
  }

  /**
   * Initialize more challenges toggle functionality
   */
  initMoreChallengesToggle() {
    const moreChallengesBtn = document.querySelector(".more_challenges_btn");
    const moreChallengeBckBtn = document.querySelector(".more_challenge_back_tooltip");
    this.moreChallengesContainer = document.getElementById("moreChallengesContainer");
    this.initialView = document.querySelector(".initialChallengeView");

    if (moreChallengesBtn && this.moreChallengesContainer) {
      moreChallengesBtn.addEventListener("click", () => this.toggleMoreChallenges(moreChallengesBtn));
    }

    moreChallengeBckBtn.addEventListener("click", () => {
      this.moreChallengesContainer.classList.add("challenge-hidden");
      this.initialView.classList.remove("challenge-hidden");
      moreChallengesBtn.textContent = "More Challenges";
    });
  }

  /**
   * Toggle between initial view and more challenges view
   */
  toggleMoreChallenges(button) {
    if (this.moreChallengesContainer.classList.contains("challenge-hidden")) {
      this.moreChallengesContainer.classList.remove("challenge-hidden");
      this.initialView.classList.add("challenge-hidden");
      button.textContent = "Back to Overview";
    } else {
      this.moreChallengesContainer.classList.add("challenge-hidden");
      this.initialView.classList.remove("challenge-hidden");
      button.textContent = "More Challenges";
    }
  }

  /**
   * Initialize advanced filters functionality
   */
  initAdvancedFilters() {
    const advancedFiltersBtn = document.getElementById("advancedFiltersBtn");
    this.advancedFiltersDropdown = document.getElementById("advancedFiltersDropdown");
    this.filterTagsContainer = document.querySelector(".filter_tags");

    if (advancedFiltersBtn && this.advancedFiltersDropdown) {
      this.setupFilterDropdown(advancedFiltersBtn);
      this.setupSectionToggles();
      this.setupFilterInputs();
      this.setDefaultSelections();
      this.updateFilterTags();
    }
  }

  /**
   * Setup filter dropdown toggle functionality
   */
  setupFilterDropdown(button) {
    // Toggle dropdown
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      this.advancedFiltersDropdown.classList.toggle("challenge-hidden");
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (!this.advancedFiltersDropdown.contains(e.target) && !button.contains(e.target)) {
        this.advancedFiltersDropdown.classList.add("challenge-hidden");
      }
    });
  }

  /**
   * Setup section toggle functionality
   */
  setupSectionToggles() {
    document.querySelectorAll(".filter_section_header").forEach((header) => {
      header.addEventListener("click", () => {
        const section = header.parentElement;
        section.classList.toggle("collapsed");
      });
    });
  }

  /**
   * Setup filter input change handlers
   */
  setupFilterInputs() {
    const filterInputs = this.advancedFiltersDropdown.querySelectorAll("input");
    filterInputs.forEach((input) => {
      input.addEventListener("change", () => this.updateFilterTags());
    });
  }

  /**
   * Update filter tags based on selections
   */
  updateFilterTags() {
    // Clear existing tags
    this.filterTagsContainer.innerHTML = "";

    // Get selected categories (checkboxes)
    const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked')).map((input) => input.value);

    // Get selected popularity (radio)
    const selectedPopularity = document.querySelector('input[name="popularity"]:checked');

    // Get selected region (radio)
    const selectedRegion = document.querySelector('input[name="region"]:checked');

    // Get selected time period (radio)
    const selectedTimePeriod = document.querySelector('input[name="time_period"]:checked');

    // Create category tag if categories selected
    if (selectedCategories.length > 0) {
      const categoryTag = this.createFilterTag(selectedCategories.length === 1 ? selectedCategories[0] : selectedCategories.join(", "), "category", this.getIconSvg("category"));
      this.filterTagsContainer.appendChild(categoryTag);
    }

    // Create popularity tag
    if (selectedPopularity) {
      const popularityTag = this.createFilterTag(selectedPopularity.value, "popularity", this.getIconSvg("popularity"));
      this.filterTagsContainer.appendChild(popularityTag);
    }

    // Create region tag
    if (selectedRegion) {
      const regionTag = this.createFilterTag(selectedRegion.value, "region", this.getIconSvg("region"));
      this.filterTagsContainer.appendChild(regionTag);
    }

    // Create time period tag
    if (selectedTimePeriod) {
      const timePeriodTag = this.createFilterTag(selectedTimePeriod.value, "time_period", this.getIconSvg("time_period"));
      this.filterTagsContainer.appendChild(timePeriodTag);
    }
  }

  /**
   * Get the correct icon SVG for each filter type
   */
  getIconSvg(type) {
    const icons = {
      category: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M16.24 7.76L14.12 14.12L7.76 16.24L9.88 9.88L16.24 7.76Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`,
      popularity: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 20V10M18 20V4M6 20V16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`,
      region: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 12C22 17.5228 17.5228 22 12 22M22 12C22 6.47715 17.5228 2 12 2M22 12H2M12 22C6.47715 22 2 17.5228 2 12M12 22C14.5013 19.2616 15.9228 15.708 16 12C15.9228 8.29203 14.5013 4.73835 12 2M12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2M2 12C2 6.47715 6.47715 2 12 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`,
      time_period: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 2V6M8 2V6M3 10H21M5 4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`,
    };
    return icons[type] || icons.category;
  }

  /**
   * Create a filter tag element
   */
  createFilterTag(text, type, iconSvg) {
    const tag = document.createElement("span");
    tag.className = "filter_tag";
    tag.innerHTML = `
      ${iconSvg}
      ${text}
      <button class="remove_tag" data-filter-type="${type}">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity="0.6"><path d="M5 15L15 5M15 15L5 5" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" /></g></svg>
      </button>
    `;

    // Add remove functionality
    const removeBtn = tag.querySelector(".remove_tag");
    removeBtn.addEventListener("click", () => this.removeFilterTag(type, tag));

    return tag;
  }

  /**
   * Remove a filter tag and uncheck corresponding inputs
   */
  removeFilterTag(filterType, tagElement) {
    // Uncheck corresponding inputs
    if (filterType === "category") {
      document.querySelectorAll('input[name="category"]:checked').forEach((input) => {
        input.checked = false;
      });
    } else {
      const input = document.querySelector(`input[name="${filterType}"]:checked`);
      if (input) input.checked = false;
    }

    // Remove tag
    tagElement.remove();
  }

  /**
   * Set default selections to match initial tags
   */
  setDefaultSelections() {
    const defaults = [
      { name: "category", value: "Creative" },
      { name: "category", value: "Dance" },
      { name: "category", value: "Fitness" },
      { name: "popularity", value: "Rising Trend" },
      { name: "region", value: "Africa" },
      { name: "time_period", value: "Past Week" },
    ];

    defaults.forEach(({ name, value }) => {
      const input = document.querySelector(`input[name="${name}"][value="${value}"]`);
      if (input) input.checked = true;
    });
  }
}

// Initialize the challenges manager when the script loads
new ChallengesManager();
