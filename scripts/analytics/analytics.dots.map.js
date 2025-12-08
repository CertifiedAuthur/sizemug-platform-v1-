document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("dotMap");

  // Function to initialize and draw the map
  const drawMap = () => {
    const width = container.offsetWidth || 300; // Default to 300 if width is not set
    const height = container.offsetHeight || 200; // Default to 200 if height is not set

    // Clear any existing SVG
    d3.select("#dotMap").select("svg").remove();

    // Append new SVG to the element with dotMap id
    const svg = d3.select("#dotMap").append("svg").attr("width", width).attr("height", height);

    // Load GeoJSON data (world map)
    d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
      .then((data) => {
        // Calculate bounds and scale dynamically
        const projection = d3.geoMercator();
        const path = d3.geoPath().projection(projection);

        // Get the bounds of the entire map
        const bounds = d3.geoBounds(data); // [ [minLng, minLat], [maxLng, maxLat] ]
        const [[minLng, minLat], [maxLng, maxLat]] = bounds;

        // Calculate the center of the map
        const center = [(minLng + maxLng) / 2, (minLat + maxLat) / 2];

        // Adjust the projection to fit the map within the container
        const scale = Math.min(width / (maxLng - minLng), height / (maxLat - minLat)) * 85; // Scale factor to adjust size (tweak as needed)

        projection
          .scale(scale)
          .center(center) // Set the center of the map
          .translate([width / 2, height / 2]); // Center the map in the SVG

        // Draw countries
        svg.selectAll("path").data(data.features).join("path").attr("d", path).attr("fill", "#ffffff").attr("stroke", "#ffffff");

        // Add dots for land areas
        const gridSpacing = 10; // Space between dots (adjust for density)

        for (let x = 0; x < width; x += gridSpacing) {
          for (let y = 0; y < height; y += gridSpacing) {
            const [lng, lat] = projection.invert([x, y]) || []; // Convert screen coords to geographic coords
            if (lng && lat) {
              const isLand = data.features.some((feature) => {
                return d3.geoContains(feature, [lng, lat]); // Check if the point is on land
              });

              if (isLand) {
                svg.append("circle").attr("cx", x).attr("cy", y).attr("r", 2).attr("fill", "#a67cf5");
              }
            }
          }
        }
      })
      .catch((err) => {
        console.error("Error loading GeoJSON data:", err);
      });
  };

  // Initial draw
  drawMap();

  // Redraw the map on window resize
  window.addEventListener("resize", drawMap);
});
