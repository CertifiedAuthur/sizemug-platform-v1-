///////////////////////////////////
///////////////////////////////////
///////////////////////////////////
///////////////////////////////////
///////////////////////////////////
///////////////////////////////////
///////////////////////////////////
// Render Theme Color
const chatGradientsColors = [
  "linear-gradient(to right, #D32F2F, #FF5733)", // Red to Orange
  "linear-gradient(to right, #C2185B, #E91E63)", // Deep Pink
  "linear-gradient(to right, #7B1FA2, #BA68C8)", // Purple Blend
  "linear-gradient(to right, #512DA8, #673AB7)", // Dark Purple
  "linear-gradient(to right, #303F9F, #3F51B5)", // Blue
  "linear-gradient(to right, #1976D2, #64B5F6)", // Light Blue
  "linear-gradient(to right, #0288D1, #26C6DA)", // Cyan
  "linear-gradient(to right, #0097A7, #80DEEA)", // Teal Blue
  "linear-gradient(to right, #00796B, #4DB6AC)", // Dark Green
  "linear-gradient(to right, #388E3C, #81C784)", // Forest Green
  "linear-gradient(to right, #689F38, #AED581)", // Lime Green
  "linear-gradient(to right, #AFB42B, #CDDC39)", // Yellow-Green
  "linear-gradient(to right, #FBC02D, #FFEB3B)", // Yellow
  "linear-gradient(to right, #FFA000, #FF9800)", // Orange
  "linear-gradient(to right, #F57C00, #FF5722)", // Deep Orange
  "linear-gradient(to right, #E64A19, #D84315)", // Burnt Orange
  "linear-gradient(to right, #5D4037, #8D6E63)", // Brown
  "linear-gradient(to right, #616161, #9E9E9E)", // Grey
  "linear-gradient(to right, #455A64, #78909C)", // Cool Grey
  "linear-gradient(to right, #000000, #424242)", // Black to Dark Grey
];

const chatColorThemeGrid = document.getElementById("chatColorThemeGrid");
const chatColorTheme = document.getElementById("chatColorTheme");

function renderThemeColor(gradients) {
  chatColorThemeGrid.innerHTML = "";

  gradients.forEach((gradient) => {
    const markup = `
        <div class="theme_grid_item" data-theme="${gradient}">
            <div style="background: ${gradient}">
              <button class="select_theme" aria-selected="false">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#fff" d="M9 16.17L5.53 12.7a.996.996 0 1 0-1.41 1.41l4.18 4.18c.39.39 1.02.39 1.41 0L20.29 7.71a.996.996 0 1 0-1.41-1.41z" /></svg>
              </button>
            </div>

            <span class="item_name">Monosora</span>
        </div>
    `;

    chatColorThemeGrid.insertAdjacentHTML("beforeend", markup);
  });
}
renderThemeColor(chatGradientsColors);

// Self click
chatColorTheme.addEventListener("click", function (e) {
  if (e.target.id === "chatColorTheme") {
    this.classList.add(HIDDEN);
  }
});

///////////////////////////////////
///////////////////////////////////
///////////////////////////////////
///////////////////////////////////
///////////////////////////////////
///////////////////////////////////
///////////////////////////////////
// Render Theme Color
const chatWallpapers = [
  {
    id: 1,
    name: "Sunset Glow",
    image: "https://plus.unsplash.com/premium_photo-1686729237226-0f2edb1e8970?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8d2FsbHBhcGVyfGVufDB8fDB8fHww",
  },
  {
    id: 2,
    name: "Ocean Breeze",
    image: "https://images.unsplash.com/photo-1511300636408-a63a89df3482?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2FsbHBhcGVyfGVufDB8fDB8fHww",
  },
  {
    id: 3,
    name: "Mountain Peaks",
    image: "https://images.unsplash.com/photo-1491466424936-e304919aada7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8d2FsbHBhcGVyfGVufDB8fDB8fHww",
  },
  {
    id: 4,
    name: "City Lights",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8d2FsbHBhcGVyfGVufDB8fDB8fHww",
  },
  {
    id: 5,
    name: "Forest Mist",
    image: "https://images.unsplash.com/photo-1554147090-e1221a04a025?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8d2FsbHBhcGVyfGVufDB8fDB8fHww",
  },
  {
    id: 6,
    name: "Galaxy Dream",
    image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8d2FsbHBhcGVyfGVufDB8fDB8fHww",
  },
  {
    id: 7,
    name: "Golden Hour",
    image: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8d2FsbHBhcGVyfGVufDB8fDB8fHww",
  },
  {
    id: 8,
    name: "Abstract Waves",
    image: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8d2FsbHBhcGVyfGVufDB8fDB8fHww",
  },
  {
    id: 9,
    name: "Dark Matter",
    image: "https://plus.unsplash.com/premium_photo-1661277738780-34bfa7383ec5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8d2FsbHBhcGVyfGVufDB8fDB8fHww",
  },
  {
    id: 10,
    name: "Neon Vibes",
    image: "https://images.unsplash.com/photo-1477346611705-65d1883cee1e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHdhbGxwYXBlcnxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: 11,
    name: "Autumn Leaves",
    image: "https://plus.unsplash.com/premium_photo-1676478746576-a3e1a9496c23?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8d2FsbHBhcGVyfGVufDB8fDB8fHww",
  },
  {
    id: 12,
    name: "Frozen Lake",
    image: "https://images.unsplash.com/photo-1554034483-04fda0d3507b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHdhbGxwYXBlcnxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: 13,
    name: "Tropical Paradise",
    image: "https://images.unsplash.com/photo-1481833761820-0509d3217039?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHdhbGxwYXBlcnxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: 14,
    name: "Cyberpunk Glow",
    image: "https://images.unsplash.com/photo-1485470733090-0aae1788d5af?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHdhbGxwYXBlcnxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: 15,
    name: "Minimalist Art",
    image: "https://images.unsplash.com/photo-1512850183-6d7990f42385?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHdhbGxwYXBlcnxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: 16,
    name: "Space Nebula",
    image: "https://images.unsplash.com/photo-1563387852576-964bc31b73af?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHdhbGxwYXBlcnxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: 17,
    name: "Desert Dunes",
    image: "https://images.unsplash.com/photo-1580137189272-c9379f8864fd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHdhbGxwYXBlcnxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: 18,
    name: "Lush Greenery",
    image: "https://images.unsplash.com/photo-1501696461415-6bd6660c6742?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHdhbGxwYXBlcnxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: 19,
    name: "Watercolor Dreams",
    image: "https://plus.unsplash.com/premium_photo-1676009551532-c73be6605e3a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjV8fHdhbGxwYXBlcnxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: 20,
    name: "Futuristic Grid",
    image: "https://plus.unsplash.com/premium_photo-1723983556172-ee1932896694?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fHdhbGxwYXBlcnxlbnwwfHwwfHx8MA%3D%3D",
  },
];

const chatImageThemeGrid = document.getElementById("chatImageThemeGrid");
const chatBgImageTheme = document.getElementById("chatBgImageTheme");

function renderChatWallpapers(wallpapers) {
  chatImageThemeGrid.innerHTML = "";

  wallpapers.forEach((wall) => {
    const { name, image } = wall;

    const markup = `
        <div class="theme_grid_item" data-theme="${image}">
            <div>
              <img src="${image}" alt="${name}" />
              <button class="select_theme" aria-selected="false">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#fff" d="M9 16.17L5.53 12.7a.996.996 0 1 0-1.41 1.41l4.18 4.18c.39.39 1.02.39 1.41 0L20.29 7.71a.996.996 0 1 0-1.41-1.41z" /></svg>
              </button>
            </div>

            <span class="item_name">${name}</span>
        </div>
    `;

    chatImageThemeGrid.insertAdjacentHTML("beforeend", markup);
  });
}

renderChatWallpapers(chatWallpapers);

// Self click
chatBgImageTheme.addEventListener("click", function (e) {
  if (e.target.id === "chatBgImageTheme") {
    this.classList.add(HIDDEN);
  }
});

// Event Listener
const changeChatColors = document.querySelectorAll(".changeChatColor");
const changeChatBgImages = document.querySelectorAll(".changeChatBgImage");

changeChatColors.forEach((button) => {
  button.addEventListener("click", () => {
    chatColorTheme.classList.remove(HIDDEN);
  });
});

changeChatBgImages.forEach((button) => {
  button.addEventListener("click", () => {
    chatBgImageTheme.classList.remove(HIDDEN);
  });
});

// Path: scripts/chat/chat.color-wallpaper.js
chatColorThemeGrid.addEventListener("click", (e) => {
  const selectTheme = e.target.closest(".select_theme");

  const chattingAreaContainer = document.querySelector(`.chatting_area_container[data-id="${currentOpenedUser.id}"]`);

  if (!selectTheme) return;

  const themeItem = selectTheme.closest(".theme_grid_item");
  const { theme } = themeItem.dataset;

  hideAllSelectedThemes();

  selectTheme.setAttribute("aria-selected", true);
  chattingAreaContainer.style.background = theme;
});

chatImageThemeGrid.addEventListener("click", (e) => {
  const selectTheme = e.target.closest(".select_theme");

  const chattingAreaContainer = document.querySelector(`.chatting_area_container[data-id="${currentOpenedUser.id}"]`);

  if (!selectTheme) return;

  const themeItem = selectTheme.closest(".theme_grid_item");
  const { theme } = themeItem.dataset;

  hideAllSelectedThemes();

  selectTheme.setAttribute("aria-selected", true);
  chattingAreaContainer.style.background = `url(${theme})`;
  chattingAreaContainer.style.backgroundRepeat = "no-repeat";
  chattingAreaContainer.style.backgroundSize = "cover";
  chattingAreaContainer.style.backgroundPosition = "center";
});

function hideAllSelectedThemes() {
  const selectedThemes = document.querySelectorAll(".select_theme");

  selectedThemes.forEach((theme) => {
    theme.setAttribute("aria-selected", false);
  });
}
