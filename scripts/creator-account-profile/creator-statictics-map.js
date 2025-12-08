// Global variables
let pausedTooltip = false;
let focusedCountry = null;
const reachedCountryName = document.getElementById("reachedCountryName");
const reachedCountryCount = document.getElementById("reachedCountryCount");
const mapTooltip = document.getElementById("mapTooltip");

// D3 map setup
const width = 2000;
const height = 857;

const projection = d3
  .geoMercator()
  .scale(318)
  .translate([width / 2, height / 2])
  .center([0, 0]);

const path = d3.geoPath().projection(projection);

const svg = d3.select("#allSvg");

d3.json("https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson")
  .then(function (data) {
    // Render all countries
    const countries = svg
      .selectAll("path")
      .data(data.features)
      .enter()
      .append("path")
      .attr("class", (d) => `allPaths ${d.properties.ADMIN.replace(/\s+/g, "")}`)
      .attr("d", path)
      .attr("id", (d) => d.properties.ADMIN.replace(/\s+/g, ""))
      // Add custom data attributes
      .attr("data-audience", 250)
      .attr("data-age-range", "18-40")
      .attr("data-male", "180")
      .attr("data-female", "360");

    // Add event listeners
    countries.each(function (d) {
      const e = d3.select(this).node();

      // Mouseover
      e.addEventListener("mouseover", function () {
        if (pausedTooltip) return;

        window.onmousemove = function (j) {
          mapTooltip.style.top = `${j.clientY - 60}px`;
          mapTooltip.style.left = `${j.clientX + 10}px`;
        };

        const classes = e.className.baseVal.replace(/ /g, ".").replace(/'/g, "\\'").replace(/"/g, '\\"');
        document.querySelectorAll(`.${classes}`).forEach((country) => {
          country.style.fill = "#8837E9";
        });

        mapTooltip.style.opacity = 1;
        document.getElementById("mapTooltipCountry").innerText = e.id;
      });

      // Mouseleave
      e.addEventListener("mouseleave", function () {
        if (pausedTooltip) return;

        const classes = e.className.baseVal.replace(/ /g, ".").replace(/'/g, "\\'").replace(/"/g, '\\"');
        document.querySelectorAll(`.${classes}`).forEach((country) => {
          country.style.fill = "#ececec"; // Match default fill
        });

        mapTooltip.style.opacity = 0;
      });

      // Click
      e.addEventListener("click", function (event) {
        document.querySelectorAll(".allPaths").forEach((path) => {
          if (path.style.fill === "rgb(136, 55, 233)" || path.style.fill === "#8837E9") {
            path.style.fill = "#ececec";
          }
        });

        focusedCountry = e.id;
        const classes = e.className.baseVal.replace(/ /g, ".").replace(/'/g, "\\'").replace(/"/g, '\\"');
        document.querySelectorAll(`.${classes}`).forEach((country) => {
          country.style.fill = "#8837E9";
        });

        mapTooltip.style.top = `${event.clientY - 60}px`;
        mapTooltip.style.left = `${event.clientX + 10}px`;
        mapTooltip.style.opacity = 1;
        document.getElementById("mapTooltipCountry").innerText = e.id;

        pausedTooltip = true;
        window.onmousemove = null;

        // Analytics update (placeholder; adjust as needed)
        if (location.pathname === "/analytics.html") {
          const people = usersData ? usersData.filter((user) => user.id % 2 === 0) : [];
          // updateAnalyticsOverlayUserLists(people); // Uncomment if defined
          reachedCountryName.textContent = e.id;
          reachedCountryCount.textContent = people.length;
        }
      });
    });

    // Handle clicks outside SVG
    document.addEventListener("click", (event) => {
      if (!event.target.closest("#allSvg")) {
        if (focusedCountry) {
          const prevCountryElement = document.querySelector(`#${focusedCountry}`);
          if (prevCountryElement) {
            const prevClasses = prevCountryElement.className.baseVal.replace(/ /g, ".").replace(/'/g, "\\'").replace(/"/g, '\\"');
            document.querySelectorAll(`.${prevClasses}`).forEach((country) => {
              country.style.fill = "#ececec";
            });
          }
          focusedCountry = null;
        }
        pausedTooltip = false;
        mapTooltip.style.opacity = 0;
      }
    });

    // Highlight Nigeria by default
    function highlightNigeriaByDefault() {
      const nigeriaElement = document.getElementById("Nigeria");
      if (nigeriaElement) {
        focusedCountry = "Nigeria";
        const classes = nigeriaElement.className.baseVal.replace(/ /g, ".").replace(/'/g, "\\'").replace(/"/g, '\\"');
        document.querySelectorAll(`.${classes}`).forEach((country) => {
          country.style.fill = "#8837E9";
        });

        mapTooltip.style.opacity = 1;
        document.getElementById("mapTooltipCountry").innerText = "Nigeria";
        mapTooltip.style.top = "100px";
        mapTooltip.style.left = "200px";

        pausedTooltip = true;
        window.onmousemove = null;

        if (location.pathname === "/analytics.html") {
          const people = usersData ? usersData.filter((user) => user.id % 2 === 0) : [];
          // updateAnalyticsOverlayUserLists(people); // Uncomment if defined
          reachedCountryName.textContent = "Nigeria";
          reachedCountryCount.textContent = people.length;
        }
      } else {
        console.error("Nigeria element not found in the SVG.");
      }
    }

    // Run on DOM load
    document.addEventListener("DOMContentLoaded", highlightNigeriaByDefault);
  })
  .catch(function (error) {
    console.error("Error loading GeoJSON:", error);
  });
