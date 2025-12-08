// D3.js World Map with Dotted Pattern
const mapContainer = document.getElementById("modernWorldMap");
let mapTooltip = document.getElementById("mapTooltip");

if (!mapContainer) {
  console.error("World map container not found");
}

// Function to get tooltip with retry
function getMapTooltip() {
  if (!mapTooltip) {
    mapTooltip = document.getElementById("mapTooltip");
  }
  return mapTooltip;
}

if (!mapTooltip) {
  console.error("Map tooltip not found initially");
} else {
  console.log("Map tooltip found successfully");
}

// Country data with coordinates (longitude, latitude)
const countryData = [
  {
    name: "Nigeria",
    flag: "🇳🇬",
    coords: [8.6753, 9.082],
    total: 200554,
    male: 49345,
    female: 159345,
    color: "#8B5CF6",
  },
  {
    name: "United States",
    flag: "🇺🇸",
    coords: [-95.7129, 37.0902],
    total: 543345,
    male: 271672,
    female: 271673,
    color: "#3B82F6",
  },
  {
    name: "United Kingdom",
    flag: "🇬🇧",
    coords: [-3.435973, 55.378051],
    total: 423156,
    male: 211578,
    female: 211578,
    color: "#3B82F6",
  },
  {
    name: "Brazil",
    flag: "🇧🇷",
    coords: [-51.9253, -14.235],
    total: 312445,
    male: 156222,
    female: 156223,
    color: "#8B5CF6",
  },
  {
    name: "India",
    flag: "🇮🇳",
    coords: [78.9629, 20.5937],
    total: 654321,
    male: 327160,
    female: 327161,
    color: "#3B82F6",
  },
  {
    name: "Australia",
    flag: "🇦🇺",
    coords: [133.7751, -25.2744],
    total: 234567,
    male: 117283,
    female: 117284,
    color: "#3B82F6",
  },
  {
    name: "Japan",
    flag: "🇯🇵",
    coords: [138.2529, 36.2048],
    total: 445678,
    male: 222839,
    female: 222839,
    color: "#3B82F6",
  },
  {
    name: "South Africa",
    flag: "🇿🇦",
    coords: [22.9375, -30.5595],
    total: 187654,
    male: 93827,
    female: 93827,
    color: "#3B82F6",
  },
];

// Connection pairs
const connections = [
  [1, 2], // US to UK
  [2, 4], // UK to India
  [4, 6], // India to Japan
  [6, 5], // Japan to Australia
  [0, 3], // Nigeria to Brazil
  [0, 7], // Nigeria to South Africa
];

class D3WorldMap {
  constructor(container) {
    console.log("Creating D3WorldMap instance...");
    this.container = container;
    this.width = container.clientWidth || 800; // fallback width
    this.height = Math.min(this.width * 0.5, 450);
    this.animationProgress = 0;
    this.tooltipPinned = false;
    this.currentTooltipMarker = null;
    this.currentTooltipDot = null;

    console.log(`Map dimensions: ${this.width}x${this.height}`);

    this.setupSVG();
    this.setupProjection();
    this.setupClickAwayHandler();
    this.loadAndRender();
  }

  setupSVG() {
    // Preserve the tooltip before clearing
    const existingTooltip = this.container.querySelector(".map-tooltip-large");
    let tooltipHTML = "";
    if (existingTooltip) {
      tooltipHTML = existingTooltip.outerHTML;
    }

    // // Clear existing content (but preserve tooltip)
    // const svgElements = this.container.querySelectorAll("svg");
    // svgElements.forEach((svg) => svg.remove());

    // Create SVG
    this.svg = d3.select(this.container).append("svg").attr("width", this.width).attr("height", this.height).style("background", "transparent");

    // Create groups for layering
    this.mapGroup = this.svg.append("g").attr("class", "map-group");
    this.connectionsGroup = this.svg.append("g").attr("class", "connections-group");
    this.markersGroup = this.svg.append("g").attr("class", "markers-group");

    // Restore tooltip if it was removed
    if (tooltipHTML && !this.container.querySelector(".map-tooltip-large")) {
      this.container.insertAdjacentHTML("beforeend", tooltipHTML);
    }
  }

  setupProjection() {
    // Use Mercator projection
    this.projection = d3
      .geoMercator()
      .scale(this.width / 6.5)
      .translate([this.width / 2, this.height / 1.5]);

    this.path = d3.geoPath().projection(this.projection);
  }

  setupClickAwayHandler() {
    // Add click-away handler to hide tooltip
    document.addEventListener("click", (event) => {
      if (!event.target.closest(".modern-world-map") && !event.target.closest(".map-tooltip-large")) {
        this.hideTooltip();
        this.tooltipPinned = false;
        this.currentTooltipMarker = null;
        this.currentTooltipDot = null;
      }
    });
  }

  async loadAndRender() {
    // Start with fallback map immediately for better UX
    console.log("Rendering offline world map...");
    this.renderOfflineWorldMap();
    this.renderConnections();
    this.renderMarkers();
    this.animateConnections();

    // Try to load detailed map in background (optional enhancement)
    try {
      console.log("Attempting to load detailed world map data...");
      const world = await d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json");
      const countries = topojson.feature(world, world.objects.countries);

      console.log("Detailed world map data loaded, upgrading map...");
      // Clear existing dots and render detailed map
      this.mapGroup.selectAll("*").remove();
      this.renderDottedMap(countries);
    } catch (error) {
      console.log("Detailed map loading failed, using offline version:", error.message);
      // Keep the offline map - no action needed
    }
  }

  renderDottedMap(countries) {
    const dotSpacing = 6;

    countries.features.forEach((feature) => {
      const bounds = this.path.bounds(feature);
      const [[x0, y0], [x1, y1]] = bounds;

      // Generate dots in a grid pattern
      for (let x = x0; x < x1; x += dotSpacing) {
        for (let y = y0; y < y1; y += dotSpacing) {
          const point = [x, y];
          const geoPoint = this.projection.invert(point);

          // Check if point is inside the country
          if (d3.geoContains(feature, geoPoint)) {
            const dot = this.mapGroup.append("circle").attr("cx", x).attr("cy", y).attr("r", 1.2).attr("fill", "#C7C7C7").attr("opacity", 0.8).style("cursor", "pointer").datum({ feature, coords: geoPoint });

            // Add click event to dots
            dot.on("click", (event, d) => {
              event.stopPropagation();
              this.showCountryTooltipAtPosition(event, d.feature, [x, y]);
              this.currentTooltipDot = dot;
            });

            // Add hover effect
            dot
              .on("mouseenter", function () {
                d3.select(this).attr("r", 2).attr("fill", "#3B82F6").attr("opacity", 1);
              })
              .on("mouseleave", function () {
                d3.select(this).attr("r", 1.2).attr("fill", "#C7C7C7").attr("opacity", 0.8);
              });
          }
        }
      }
    });
  }

  renderOfflineWorldMap() {
    // Enhanced offline world map with better continent shapes
    const dotSpacing = 4;
    const continentShapes = [
      // North America (more detailed)
      { x: 0.08, y: 0.15, width: 0.25, height: 0.35, density: 0.7, name: "North America" },
      // South America
      { x: 0.22, y: 0.5, width: 0.12, height: 0.35, density: 0.8, name: "South America" },
      // Europe
      { x: 0.45, y: 0.18, width: 0.12, height: 0.18, density: 0.9, name: "Europe" },
      // Africa
      { x: 0.48, y: 0.35, width: 0.15, height: 0.4, density: 0.85, name: "Africa" },
      // Asia (larger and more detailed)
      { x: 0.55, y: 0.1, width: 0.35, height: 0.45, density: 0.75, name: "Asia" },
      // Australia
      { x: 0.75, y: 0.65, width: 0.12, height: 0.15, density: 0.9, name: "Australia" },
      // Greenland
      { x: 0.25, y: 0.05, width: 0.08, height: 0.12, density: 0.6, name: "Greenland" },
    ];

    continentShapes.forEach((shape) => {
      const startX = shape.x * this.width;
      const startY = shape.y * this.height;
      const endX = startX + shape.width * this.width;
      const endY = startY + shape.height * this.height;

      // Create more organic shapes using different patterns
      for (let x = startX; x < endX; x += dotSpacing) {
        for (let y = startY; y < endY; y += dotSpacing) {
          // Use distance from center to create more realistic continent shapes
          const centerX = startX + (shape.width * this.width) / 2;
          const centerY = startY + (shape.height * this.height) / 2;
          const distanceFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
          const maxDistance = Math.min(shape.width * this.width, shape.height * this.height) / 2;
          const edgeFactor = 1 - distanceFromCenter / maxDistance;

          // Vary dot probability based on distance from center and shape density
          const probability = shape.density * edgeFactor * (0.7 + Math.random() * 0.3);

          if (Math.random() < probability) {
            const dot = this.mapGroup
              .append("circle")
              .attr("cx", x)
              .attr("cy", y)
              .attr("r", 1.2)
              .attr("fill", "#C7C7C7")
              .attr("opacity", 0.8)
              .style("cursor", "pointer")
              .datum({ continent: shape.name, coords: [x, y] });

            // Add hover effect to dots
            dot
              .on("mouseenter", function () {
                d3.select(this).attr("r", 2).attr("fill", "#3B82F6").attr("opacity", 1);
              })
              .on("mouseleave", function () {
                d3.select(this).attr("r", 1.2).attr("fill", "#C7C7C7").attr("opacity", 0.8);
              })
              .on("click", (event, d) => {
                event.stopPropagation();
                this.showContinentTooltip(event, d);
                this.currentTooltipDot = dot;
              });
          }
        }
      }
    });
  }

  renderFallbackMap() {
    // Keep the old fallback as backup
    this.renderOfflineWorldMap();
  }

  renderConnections() {
    connections.forEach(([fromIdx, toIdx]) => {
      const from = countryData[fromIdx];
      const to = countryData[toIdx];

      const [x1, y1] = this.projection(from.coords);
      const [x2, y2] = this.projection(to.coords);

      // Calculate control point for curved line
      const midX = (x1 + x2) / 2;
      const midY = Math.min(y1, y2) - 80;

      // Create path data for quadratic curve
      const pathData = `M ${x1},${y1} Q ${midX},${midY} ${x2},${y2}`;

      // Draw connection line
      const path = this.connectionsGroup.append("path").attr("d", pathData).attr("fill", "none").attr("stroke", "rgba(59, 130, 246, 0.4)").attr("stroke-width", 2.5).attr("stroke-linecap", "round");

      // Add animated dot
      const dot = this.connectionsGroup
        .append("circle")
        .attr("r", 4)
        .attr("fill", "#3B82F6")
        .attr("class", "connection-dot")
        .datum({ path: path.node(), from: [x1, y1], to: [x2, y2], midX, midY });
    });
  }

  renderMarkers() {
    countryData.forEach((country) => {
      const [x, y] = this.projection(country.coords);

      // Create marker group
      const markerGroup = this.markersGroup.append("g").attr("class", "marker").attr("transform", `translate(${x}, ${y})`).style("cursor", "pointer");

      // Glow effect
      const defs = this.svg.append("defs");
      const filter = defs
        .append("filter")
        .attr("id", `glow-${country.name.replace(/\s/g, "")}`)
        .attr("x", "-50%")
        .attr("y", "-50%")
        .attr("width", "200%")
        .attr("height", "200%");

      filter.append("feGaussianBlur").attr("stdDeviation", "4").attr("result", "coloredBlur");

      const feMerge = filter.append("feMerge");
      feMerge.append("feMergeNode").attr("in", "coloredBlur");
      feMerge.append("feMergeNode").attr("in", "SourceGraphic");

      // Outer glow circle
      markerGroup.append("circle").attr("r", 20).attr("fill", country.color).attr("opacity", 0.2).attr("class", "marker-glow");

      // Main marker circle
      markerGroup.append("circle").attr("r", 7).attr("fill", country.color).attr("class", "marker-outer");

      // Inner white circle
      markerGroup.append("circle").attr("r", 3.5).attr("fill", "white").attr("class", "marker-inner");

      // Add hover and click events
      markerGroup
        .on("mouseenter", (event) => {
          markerGroup.select(".marker-glow").transition().duration(200).attr("r", 30).attr("opacity", 0.3);
          markerGroup.select(".marker-outer").transition().duration(200).attr("r", 9);
          markerGroup.select(".marker-inner").transition().duration(200).attr("r", 4.5);
        })
        .on("mouseleave", () => {
          if (!this.tooltipPinned) {
            this.hideTooltip();
          }
          markerGroup.select(".marker-glow").transition().duration(200).attr("r", 20).attr("opacity", 0.2);
          markerGroup.select(".marker-outer").transition().duration(200).attr("r", 7);
          markerGroup.select(".marker-inner").transition().duration(200).attr("r", 3.5);
        })
        .on("click", (event) => {
          event.stopPropagation();
          this.showTooltip(event, country);
          this.tooltipPinned = true;
          this.currentTooltipMarker = markerGroup;
        });
    });
  }

  animateConnections() {
    const animate = () => {
      this.animationProgress += 0.01;
      if (this.animationProgress > 1) this.animationProgress = 0;

      this.connectionsGroup.selectAll(".connection-dot").attr("transform", (d) => {
        const t = this.animationProgress;
        const x = (1 - t) * (1 - t) * d.from[0] + 2 * (1 - t) * t * d.midX + t * t * d.to[0];
        const y = (1 - t) * (1 - t) * d.from[1] + 2 * (1 - t) * t * d.midY + t * t * d.to[1];
        return `translate(${x}, ${y})`;
      });

      requestAnimationFrame(animate);
    };

    animate();
  }

  showTooltip(event, country) {
    const tooltip = getMapTooltip();
    if (!tooltip) {
      console.error("Map tooltip container not found");
      return;
    }

    // Try to find elements within the tooltip container first
    const tooltipFlag = tooltip.querySelector("#tooltipFlag") || document.getElementById("tooltipFlag");
    const tooltipCountry = tooltip.querySelector("#tooltipCountry") || document.getElementById("tooltipCountry");
    const tooltipTotalValue = tooltip.querySelector("#tooltipTotalValue") || document.getElementById("tooltipTotalValue");
    const tooltipMale = tooltip.querySelector("#tooltipMale") || document.getElementById("tooltipMale");
    const tooltipFemale = tooltip.querySelector("#tooltipFemale") || document.getElementById("tooltipFemale");

    // Check if all elements exist
    if (!tooltipFlag || !tooltipCountry || !tooltipTotalValue || !tooltipMale || !tooltipFemale) {
      console.error("Tooltip elements not found:", {
        tooltipFlag: !!tooltipFlag,
        tooltipCountry: !!tooltipCountry,
        tooltipTotalValue: !!tooltipTotalValue,
        tooltipMale: !!tooltipMale,
        tooltipFemale: !!tooltipFemale,
      });
      return;
    }

    // Update tooltip content
    tooltipFlag.textContent = country.flag || "🌍";
    tooltipCountry.textContent = country.name || "Unknown";
    tooltipTotalValue.textContent = (country.total || 0).toLocaleString();
    tooltipMale.textContent = (country.male || 0).toLocaleString();
    tooltipFemale.textContent = (country.female || 0).toLocaleString();

    // Show tooltip with animation
    tooltip.style.display = "block";
    tooltip.style.opacity = "0";
    tooltip.style.transform = "translateY(10px)";

    this.updateTooltipPosition(event);

    // Animate in
    setTimeout(() => {
      tooltip.style.transition = "opacity 0.2s ease, transform 0.2s ease";
      tooltip.style.opacity = "1";
      tooltip.style.transform = "translateY(0)";
    }, 10);
  }

  updateTooltipPosition(event) {
    const tooltip = getMapTooltip();
    if (!tooltip || tooltip.style.display === "none") return;

    const rect = this.container.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    let left = event.clientX - rect.left + 15;
    let top = event.clientY - rect.top + 15;

    if (left + tooltipRect.width > rect.width) {
      left = event.clientX - rect.left - tooltipRect.width - 15;
    }
    if (top + tooltipRect.height > rect.height) {
      top = event.clientY - rect.top - tooltipRect.height - 15;
    }

    tooltip.style.left = left + "px";
    tooltip.style.top = top + "px";
  }

  hideTooltip() {
    const tooltip = getMapTooltip();
    if (tooltip && !this.tooltipPinned) {
      tooltip.style.transition = "opacity 0.2s ease, transform 0.2s ease";
      tooltip.style.opacity = "0";
      tooltip.style.transform = "translateY(10px)";

      setTimeout(() => {
        if (!this.tooltipPinned) {
          tooltip.style.display = "none";
        }
      }, 200);
    }
  }

  showCountryTooltipAtPosition(event, feature, position) {
    if (!mapTooltip) return;

    // Get country name from feature
    const countryName = feature.properties.name;

    // Check if we have data for this country
    const countryInfo = countryData.find((c) => c.name === countryName);

    if (countryInfo) {
      // Show tooltip with our data
      this.showTooltip(event, countryInfo);
      this.tooltipPinned = true;
    } else {
      // Show generic tooltip for countries without specific data
      const genericData = {
        name: countryName,
        flag: this.getCountryFlag(countryName),
        total: Math.floor(Math.random() * 500000) + 50000,
        male: Math.floor(Math.random() * 250000) + 25000,
        female: Math.floor(Math.random() * 250000) + 25000,
      };
      genericData.male = Math.floor(genericData.total * 0.48);
      genericData.female = genericData.total - genericData.male;

      this.showTooltip(event, genericData);
      this.tooltipPinned = true;
    }
  }

  showContinentTooltip(event, data) {
    if (!mapTooltip) return;

    // Generate sample data for continent
    const continentData = {
      name: data.continent,
      flag: this.getContinentFlag(data.continent),
      total: Math.floor(Math.random() * 2000000) + 500000,
      male: 0,
      female: 0,
    };
    continentData.male = Math.floor(continentData.total * 0.48);
    continentData.female = continentData.total - continentData.male;

    this.showTooltip(event, continentData);
    this.tooltipPinned = true;
  }

  getContinentFlag(continentName) {
    const continentFlags = {
      "North America": "🌎",
      "South America": "🌎",
      Europe: "🌍",
      Africa: "🌍",
      Asia: "🌏",
      Australia: "🌏",
      Greenland: "🏔️",
    };
    return continentFlags[continentName] || "🌍";
  }

  getCountryFlag(countryName) {
    // Map of country names to flag emojis
    const flagMap = {
      Nigeria: "🇳🇬",
      "United States of America": "🇺🇸",
      "United Kingdom": "🇬🇧",
      Brazil: "🇧🇷",
      India: "🇮🇳",
      Australia: "🇦🇺",
      Japan: "🇯🇵",
      "South Africa": "🇿🇦",
      Canada: "🇨🇦",
      Mexico: "🇲🇽",
      Germany: "🇩🇪",
      France: "🇫🇷",
      Spain: "🇪🇸",
      Italy: "🇮🇹",
      China: "🇨🇳",
      Russia: "🇷🇺",
      Argentina: "🇦🇷",
      Egypt: "🇪🇬",
      Kenya: "🇰🇪",
      Ghana: "🇬🇭",
      Indonesia: "🇮🇩",
      Thailand: "🇹🇭",
      Philippines: "🇵🇭",
      "South Korea": "🇰🇷",
      Vietnam: "🇻🇳",
      Turkey: "🇹🇷",
      Poland: "🇵🇱",
      Netherlands: "🇳🇱",
      Belgium: "🇧🇪",
      Sweden: "🇸🇪",
      Norway: "🇳🇴",
      Denmark: "🇩🇰",
      Finland: "🇫🇮",
      Portugal: "🇵🇹",
      Greece: "🇬🇷",
      Switzerland: "🇨🇭",
      Austria: "🇦🇹",
      "New Zealand": "🇳🇿",
      Singapore: "🇸🇬",
      Malaysia: "🇲🇾",
      "Saudi Arabia": "🇸🇦",
      "United Arab Emirates": "🇦🇪",
      Israel: "🇮🇱",
      Pakistan: "🇵🇰",
      Bangladesh: "🇧🇩",
      Colombia: "🇨🇴",
      Chile: "🇨🇱",
      Peru: "🇵🇪",
      Venezuela: "🇻🇪",
      Ukraine: "🇺🇦",
      Romania: "🇷🇴",
      "Czech Republic": "🇨🇿",
      Hungary: "🇭🇺",
      Ireland: "🇮🇪",
      Morocco: "🇲🇦",
      Algeria: "🇩🇿",
      Tunisia: "🇹🇳",
      Ethiopia: "🇪🇹",
      Tanzania: "🇹🇿",
      Uganda: "🇺🇬",
    };

    return flagMap[countryName] || "🌍";
  }
}

// Initialize map when D3 and TopoJSON are loaded
function initD3Map() {
  console.log("Initializing D3 World Map...");

  if (typeof d3 === "undefined") {
    console.error("D3.js not loaded. Please include D3.js library.");
    return;
  }

  if (typeof topojson === "undefined") {
    console.error("TopoJSON not loaded. Please include TopoJSON library.");
    return;
  }

  if (mapContainer) {
    console.log("Map container found, creating world map...");

    // Double-check tooltip exists
    const tooltip = document.getElementById("mapTooltip");
    if (!tooltip) {
      console.error("Tooltip not found, waiting a bit more...");
      setTimeout(() => {
        const retryTooltip = document.getElementById("mapTooltip");
        if (retryTooltip) {
          console.log("Tooltip found on retry, creating map...");
          new D3WorldMap(mapContainer);
        } else {
          console.error("Tooltip still not found after retry");
        }
      }, 100);
    } else {
      console.log("Tooltip found, creating map...");
      new D3WorldMap(mapContainer);
    }
  } else {
    console.error("Map container not found!");
  }
}

// Wait for libraries to load with retry mechanism
function waitForLibrariesAndInit() {
  let attempts = 0;
  const maxAttempts = 50; // 5 seconds max wait

  const checkLibraries = () => {
    attempts++;

    if (typeof d3 !== "undefined" && typeof topojson !== "undefined") {
      console.log("Libraries loaded successfully, initializing map...");
      initD3Map();
    } else if (attempts < maxAttempts) {
      console.log(`Waiting for libraries... attempt ${attempts}/${maxAttempts}`);
      setTimeout(checkLibraries, 100);
    } else {
      console.error("Libraries failed to load after maximum attempts. Creating basic map...");
      // Create a very basic map without D3
      createBasicMap();
    }
  };

  checkLibraries();
}

// Basic map fallback if D3 fails completely
function createBasicMap() {
  if (!mapContainer) return;

  mapContainer.innerHTML = `
    <div style="
      width: 100%; 
      height: 450px; 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 18px;
      text-align: center;
      position: relative;
    ">
      <div>
        <div style="font-size: 48px; margin-bottom: 16px;">🌍</div>
        <div>Global Audience Map</div>
        <div style="font-size: 14px; opacity: 0.8; margin-top: 8px;">
          Interactive map loading...
        </div>
      </div>
    </div>
  `;
}

// Wait for libraries to load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", waitForLibrariesAndInit);
} else {
  waitForLibrariesAndInit();
}
