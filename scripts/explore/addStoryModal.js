/* ---------- Small helpers ---------- */
function escapeHtml(str) {
  if (typeof str !== "string") return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightMatches(text, query) {
  if (!query) return escapeHtml(text);
  try {
    const regex = new RegExp("(" + escapeRegExp(query) + ")", "ig");
    // escape original text first, then replace on the escaped text is tricky,
    // so we'll do safe replace by splitting on matches in a case-insensitive way:
    let idx = 0;
    const parts = [];
    const lower = text.toLowerCase();
    while (idx < text.length) {
      const matchIndex = lower.indexOf(query.toLowerCase(), idx);
      if (matchIndex === -1) {
        parts.push(escapeHtml(text.slice(idx)));
        break;
      }
      // push before match
      if (matchIndex > idx) {
        parts.push(escapeHtml(text.slice(idx, matchIndex)));
      }
      // push match wrapped in <mark>
      const matched = text.slice(matchIndex, matchIndex + query.length);
      parts.push(`<mark>${escapeHtml(matched)}</mark>`);
      idx = matchIndex + query.length;
    }
    return parts.join("");
  } catch (err) {
    return escapeHtml(text);
  }
}

/* ---------- small helpers ---------- */
function clamp(v, a, b) {
  return Math.min(b, Math.max(a, v));
}

/* ------------------------- INTERACT.JS: make overlays movable + resizable - requires interact.js included in the page ---------------------------*/
// class Interactive {
//   _makeInteractive(el) {
//     if (!window.interact) {
//       console.warn("interact.js not loaded");
//       return;
//     }

//     // Ensure pointer events allowed
//     el.style.pointerEvents = "auto";

//     // Parent restriction: the container that holds the element (must be position: relative/absolute)
//     const parent = el.parentElement;
//     if (!parent) return;

//     // Ensure parent is positioned (so absolute children are contained)
//     const parentStyle = getComputedStyle(parent);
//     if (parentStyle.position === "static") {
//       parent.style.position = "relative";
//     }

//     // Force a reflow to measure
//     const parentRect = parent.getBoundingClientRect();
//     const elRect = el.getBoundingClientRect();

//     // --- Initialize position: center the element inside parent (pixel coordinates)
//     // Compute centered left/top inside parent (in px)
//     const centeredLeft = Math.round((parentRect.width - elRect.width) / 2);
//     const centeredTop = Math.round((parentRect.height - elRect.height) / 2);

//     // Apply pixel left/top and remove percent-based transforms so dragging uses predictable coords
//     el.style.position = "absolute";
//     el.style.left = `${centeredLeft}px`;
//     el.style.top = `${centeredTop}px`;
//     el.style.transform = `translate(0px, 0px)`; // translate is used only for accumulated drag offsets
//     // initialize data-x/y if not present
//     if (!el.hasAttribute("data-x")) el.setAttribute("data-x", "0");
//     if (!el.hasAttribute("data-y")) el.setAttribute("data-y", "0");

//     // Draggable + Resizable
//     interact(el).draggable({
//       inertia: true,
//       modifiers: [
//         interact.modifiers.restrictRect({
//           // restrict movement to the parent's inside area
//           restriction: parent,
//           endOnly: true,
//         }),
//       ],
//       listeners: {
//         move: (event) => this._dragMoveListener(event),
//       },
//     });

//     // Disable dragging while editing content (if element becomes contentEditable elsewhere)
//     el.addEventListener("focusin", () => interact(el).draggable(false));
//     el.addEventListener("focusout", () => interact(el).draggable(true));
//   }

//   /* drag move listener uses data-x / data-y to accumulate translation */
//   _dragMoveListener(event) {
//     const target = event.target;
//     // parse previous translation (in px)
//     const prevX = parseFloat(target.getAttribute("data-x")) || 0;
//     const prevY = parseFloat(target.getAttribute("data-y")) || 0;

//     // event.dx and event.dy are provided by interact.js and are the reliable deltas
//     const dx = event.dx || 0;
//     const dy = event.dy || 0;

//     const newX = prevX + dx;
//     const newY = prevY + dy;

//     // apply translation (using transform so left/top remains the base "anchor")
//     target.style.transform = `translate(${newX}px, ${newY}px)`;

//     // store the accumulated offsets
//     target.setAttribute("data-x", String(newX));
//     target.setAttribute("data-y", String(newY));
//   }

//   /* resize listener: adjust width/height and preserve translation */
//   _resizeMoveListener(event) {
//     const target = event.target;
//     // current accumulated translation
//     let x = parseFloat(target.getAttribute("data-x")) || 0;
//     let y = parseFloat(target.getAttribute("data-y")) || 0;

//     // update the element's size to the new rect dimensions
//     target.style.width = `${Math.round(event.rect.width)}px`;
//     target.style.height = `${Math.round(event.rect.height)}px`;

//     // When resizing from top/left edges the element's bounding box shifts:
//     x += event.deltaRect.left;
//     y += event.deltaRect.top;

//     target.style.transform = `translate(${x}px, ${y}px)`;

//     target.setAttribute("data-x", String(x));
//     target.setAttribute("data-y", String(y));
//   }

//   /* Helper to get final rectangle (left/top + accumulated translate) relative to parent
//    Use this when compositing onto a canvas or exporting.
// */
//   getFinalRectForExport(el, parent) {
//     // base left/top (px) from style
//     const left = parseFloat(el.style.left) || 0;
//     const top = parseFloat(el.style.top) || 0;

//     // accumulated translate offsets stored in data-x/y
//     const dx = parseFloat(el.getAttribute("data-x")) || 0;
//     const dy = parseFloat(el.getAttribute("data-y")) || 0;

//     const x = left + dx;
//     const y = top + dy;
//     const width = el.offsetWidth;
//     const height = el.offsetHeight;

//     // clip values to parent bounds if needed (optional)
//     const parentRect = parent.getBoundingClientRect();
//     return {
//       x: Math.max(0, Math.min(x, parentRect.width - width)),
//       y: Math.max(0, Math.min(y, parentRect.height - height)),
//       width,
//       height,
//     };
//   }
// }

class Interactive {
  _makeInteractive(el, options = {}) {
    if (!window.interact) {
      console.warn("interact.js not loaded");
      return;
    }

    // Default options
    const { resizable = false } = options;

    // Ensure pointer events allowed
    el.style.pointerEvents = "auto";

    // Parent restriction: the container that holds the element (must be position: relative/absolute)
    const parent = el.parentElement;
    if (!parent) return;

    // Ensure parent is positioned (so absolute children are contained)
    const parentStyle = getComputedStyle(parent);
    if (parentStyle.position === "static") {
      parent.style.position = "relative";
    }

    // Force a reflow to measure
    const parentRect = parent.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();

    // --- Initialize position: center the element inside parent (pixel coordinates)
    // Compute centered left/top inside parent (in px)
    const centeredLeft = Math.round((parentRect.width - elRect.width) / 2);
    const centeredTop = Math.round((parentRect.height - elRect.height) / 2);

    // Apply pixel left/top and remove percent-based transforms so dragging uses predictable coords
    el.style.position = "absolute";
    el.style.left = `${centeredLeft}px`;
    el.style.top = `${centeredTop}px`;
    el.style.transform = `translate(0px, 0px)`; // translate is used only for accumulated drag offsets
    // initialize data-x/y if not present
    if (!el.hasAttribute("data-x")) el.setAttribute("data-x", "0");
    if (!el.hasAttribute("data-y")) el.setAttribute("data-y", "0");

    // Configure interact.js
    const interactInstance = interact(el);

    // Draggable
    interactInstance.draggable({
      inertia: true,
      modifiers: [
        interact.modifiers.restrictRect({
          // restrict movement to the parent's inside area
          restriction: parent,
          endOnly: true,
        }),
      ],
      listeners: {
        move: (event) => this._dragMoveListener(event),
      },
    });

    // Add resizable if requested
    if (resizable) {
      interactInstance.resizable({
        edges: { left: true, right: true, bottom: true, top: true },
        listeners: {
          move: (event) => this._resizeMoveListener(event),
        },
        modifiers: [
          // minimum size
          interact.modifiers.restrictSize({
            min: { width: 20, height: 20 },
          }),
          // keep the element within the parent bounds
          interact.modifiers.restrictRect({
            restriction: parent,
          }),
        ],
      });
    }

    // Disable dragging while editing content (if element becomes contentEditable elsewhere)
    el.addEventListener("focusin", () => interactInstance.draggable(false));
    el.addEventListener("focusout", () => interactInstance.draggable(true));
  }

  /* drag move listener uses data-x / data-y to accumulate translation */
  _dragMoveListener(event) {
    const target = event.target;
    // parse previous translation (in px)
    const prevX = parseFloat(target.getAttribute("data-x")) || 0;
    const prevY = parseFloat(target.getAttribute("data-y")) || 0;

    // event.dx and event.dy are provided by interact.js and are the reliable deltas
    const dx = event.dx || 0;
    const dy = event.dy || 0;

    const newX = prevX + dx;
    const newY = prevY + dy;

    // apply translation (using transform so left/top remains the base "anchor")
    target.style.transform = `translate(${newX}px, ${newY}px)`;

    // store the accumulated offsets
    target.setAttribute("data-x", String(newX));
    target.setAttribute("data-y", String(newY));
  }

  /* resize listener: adjust width/height and preserve translation */
  _resizeMoveListener(event) {
    const target = event.target;
    // current accumulated translation
    let x = parseFloat(target.getAttribute("data-x")) || 0;
    let y = parseFloat(target.getAttribute("data-y")) || 0;

    // update the element's size to the new rect dimensions
    target.style.width = `${Math.round(event.rect.width)}px`;
    target.style.height = `${Math.round(event.rect.height)}px`;

    // When resizing from top/left edges the element's bounding box shifts:
    x += event.deltaRect.left;
    y += event.deltaRect.top;

    target.style.transform = `translate(${x}px, ${y}px)`;

    target.setAttribute("data-x", String(x));
    target.setAttribute("data-y", String(y));
  }

  /* Helper to get final rectangle (left/top + accumulated translate) relative to parent use this when compositing onto a canvas or exporting. */
  getFinalRectForExport(el, parent) {
    // base left/top (px) from style
    const left = parseFloat(el.style.left) || 0;
    const top = parseFloat(el.style.top) || 0;

    // accumulated translate offsets stored in data-x/y
    const dx = parseFloat(el.getAttribute("data-x")) || 0;
    const dy = parseFloat(el.getAttribute("data-y")) || 0;

    const x = left + dx;
    const y = top + dy;
    const width = el.offsetWidth;
    const height = el.offsetHeight;

    // clip values to parent bounds if needed (optional)
    const parentRect = parent.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(x, parentRect.width - width)),
      y: Math.max(0, Math.min(y, parentRect.height - height)),
      width,
      height,
    };
  }
}

/* -------------------------
   Story Music Modal (UI only)
   Opens from the "Music & Sound" tool.
   ------------------------- */
function initStoryMusicModalUi() {
  const modalRoot = document.getElementById("storyMusicModal");
  if (!modalRoot) return;

  // Ensure the modal overlay is not trapped inside a transformed/stacking-context
  // container (common in the story editor). If it is, `position: fixed` backdrops
  // won't cover the global sticky header.
  if (modalRoot.parentElement && modalRoot.parentElement !== document.body) {
    document.body.appendChild(modalRoot);
  }

  const backdrop = modalRoot.querySelector(".story-music-modal__backdrop");
  const dialog = modalRoot.querySelector(".story-music-modal");

  // --- Local library (repo audio) ---
  // This repo already ships playable MP3s under /music, so the modal can be
  // populated with “real” audio previews without any API.
  const LOCAL_MUSIC_FILES = [
    "Asake_-_MMS_feat_Wizkid__Vistanaij.mp3",
    "cool_down.mp3",
    "Davido_feat_someone.mp3",
    "running_chinese.mp3",
    "Salam-Alaikum.mp3",
    "sec.mp3",
    "thinking_droplet.mp3",
    "water.mp3",
    "Wizkid-Bad-Girl-feat-Asake.mp3",
    "Wizkid-Manya-feat-Mut4y.mp3",
    "Wizkid_-_Piece_Of_My_Heart_feat_Brent_Faiyaz__Vistanaij.mp3",
  ];

  const CATEGORY_DEFS = [
    {
      id: "pop-vibes",
      name: "Pop Vibes",
      description: "Catchy beats and feel-good tunes",
      icon: "🛸",
      gradient: "linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)",
    },
    {
      id: "hiphop-rap",
      name: "Hip-Hop & Rap",
      description: "Bold lyrics and urban energy.",
      icon: "👑",
      gradient: "linear-gradient(135deg, #fb923c 0%, #ef4444 100%)",
    },
    {
      id: "rock-alt",
      name: "Rock & Alternative",
      description: "Guitars, drums, and passion.",
      icon: "🔥",
      gradient: "linear-gradient(135deg, #fde68a 0%, #f59e0b 100%)",
    },
    {
      id: "electronic-dance",
      name: "Electronic & Dance",
      description: "High-energy party tracks.",
      icon: "⚡",
      gradient: "linear-gradient(135deg, #86efac 0%, #22c55e 100%)",
    },
    {
      id: "afrobeats-world",
      name: "Afrobeats & World",
      description: "Rhythmic global grooves.",
      icon: "🚀",
      gradient: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)",
    },
    {
      id: "rnb-soul",
      name: "R&B & Soul",
      description: "Smooth and heartfelt melodies.",
      icon: "⭐",
      gradient: "linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)",
    },
    {
      id: "chill-lofi",
      name: "Chill & Lo-Fi",
      description: "Relaxing and mellow beats.",
      icon: "🥤",
      gradient: "linear-gradient(135deg, #fb7185 0%, #ef4444 100%)",
    },
    {
      id: "gospel",
      name: "Gospel",
      description: "Songs of hope and faith.",
      icon: "🎤",
      gradient: "linear-gradient(135deg, #f472b6 0%, #d946ef 100%)",
    },
    {
      id: "classical",
      name: "Classical",
      description: "Elegant and timeless sounds.",
      icon: "▶️",
      gradient: "linear-gradient(135deg, #67e8f9 0%, #3b82f6 100%)",
    },
    {
      id: "soundtracks",
      name: "Soundtracks",
      description: "Music from films and games.",
      icon: "🔊",
      gradient: "linear-gradient(135deg, #93c5fd 0%, #60a5fa 100%)",
    },
  ];

  const categoryByIdLocal = new Map(CATEGORY_DEFS.map((c) => [c.id, c]));

  function prettyFromFilename(file) {
    const base = String(file || "")
      .replace(/\.mp3$/i, "")
      .replace(/__/g, " ")
      .replace(/_/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return base || "Untitled";
  }

  function slugify(v) {
    return String(v || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60);
  }

  function inferArtistNameFromTitle(title) {
    // Heuristic: many files include "Artist - Track" or "Artist feat X".
    // Fallback to "Sizemug Sounds" for generic SFX.
    const lower = title.toLowerCase();
    const generic = ["sec", "cool down", "running", "thinking", "water"].some((k) => lower.includes(k));
    if (generic) return "Sizemug Sounds";

    // Split on common separators.
    const sepMatch = title.match(/^(.*?)\s+-\s+/);
    if (sepMatch?.[1]) return sepMatch[1].trim();

    // If it contains "feat" keep the first token as "Artist".
    const featMatch = title.match(/^(.*?)\s+feat\b/i);
    if (featMatch?.[1]) return featMatch[1].trim();

    // Otherwise use first word chunk as artist-ish.
    const first = title.split(" ").slice(0, 2).join(" ").trim();
    return first || "Sizemug Sounds";
  }

  function inferFeaturedArtistNamesFromTitle(title) {
    // Extract featured artists from patterns like:
    // - "... feat Wizkid"
    // - "... ft. Wizkid"
    // - "... featuring Wizkid"
    // We keep this permissive because filenames vary.
    const raw = String(title || "");
    const m = raw.match(/\b(?:feat|ft|featuring)\.?\s+(.+)$/i);
    if (!m?.[1]) return [];

    // Stop on common filename suffix noise.
    let tail = m[1]
      .replace(/\b(vistanaij|official|video|audio|remix|mix|edit)\b.*$/i, "")
      .trim();
    if (!tail) return [];

    // Split multiple featured names:
    // "Wizkid, Burna Boy" | "Wizkid & Burna Boy" | "Wizkid x Burna Boy"
    const parts = tail
      .split(/\s*(?:,|&|\+|x|\band\b)\s*/i)
      .map((p) => p.replace(/[()\[\]]/g, "").trim())
      .filter(Boolean);

    // Dedupe while preserving order
    const seen = new Set();
    return parts.filter((p) => {
      const k = p.toLowerCase();
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  }

  function inferCategoryId(title) {
    const t = String(title || "").toLowerCase();
    if (/(wizkid|davido|asake)/.test(t)) return "afrobeats-world";
    if (/(cool|chill|droplet|thinking)/.test(t)) return "chill-lofi";
    if (/(running|mode|bad girl|manya|sec|water)/.test(t)) return "electronic-dance";
    return "pop-vibes";
  }

  // Build artists and tracks from the local mp3 list.
  // NOTE: The repo does not contain `images/stories/music/demo/*`, so we use
  // existing assets under `/images` + lightweight fallbacks.
  function coverForFile(file) {
    // Covers exist in `/images` with the same base name as the mp3.
    // Example: `Davido_feat_someone.mp3` -> `/images/Davido_feat_someone.jpg`
    const base = String(file || "").replace(/\.mp3$/i, "");
    // Only some of the repository's mp3 files have matching jpg covers.
    // Avoid generating guaranteed 404s by whitelisting known covers, otherwise fallback.
    const KNOWN_COVER_BASES = new Set([
      "Asake_-_MMS_feat_Wizkid__Vistanaij",
      "Davido_feat_someone",
      "Wizkid-Bad-Girl-feat-Asake",
      "Wizkid-Manya-feat-Mut4y",
      "Wizkid_-_Piece_Of_My_Heart_feat_Brent_Faiyaz__Vistanaij",
    ]);

    if (base && KNOWN_COVER_BASES.has(base)) return `./images/${base}.jpg`;
    // Existing asset fallback (prevents 404 noise)
    return "./images/stories/story_image_10.jpg";
  }

  function artistAssetByName(name) {
    const n = String(name || "").toLowerCase();

    // Use image files in `/images` that already exist and roughly match the artist.
    if (n.includes("wizkid")) {
      return {
        avatar: "./images/Wizkid-Manya-feat-Mut4y.jpg",
        banner: "./images/Wizkid_-_Piece_Of_My_Heart_feat_Brent_Faiyaz__Vistanaij.jpg",
      };
    }
    if (n.includes("davido")) {
      return {
        avatar: "./images/Davido_feat_someone.jpg",
        banner: "./images/Davido_feat_someone.jpg",
      };
    }
    if (n.includes("asake")) {
      return {
        avatar: "./images/Asake_-_MMS_feat_Wizkid__Vistanaij.jpg",
        banner: "./images/Asake_-_MMS_feat_Wizkid__Vistanaij.jpg",
      };
    }

    // Generic fallback images that are known to exist.
    return {
      avatar: "./images/stories/story_image_10.jpg",
      banner: "./images/stories/story_image_10.jpg",
    };
  }

  function hashToInt(str) {
    const s = String(str || "");
    let h = 0;
    for (let i = 0; i < s.length; i++) {
      h = (h * 31 + s.charCodeAt(i)) >>> 0;
    }
    return h;
  }

  function formatK(n) {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return String(n);
  }

  const artistMap = new Map();
  const tracksLocal = LOCAL_MUSIC_FILES.map((file, idx) => {
    const title = prettyFromFilename(file);
    const artistName = inferArtistNameFromTitle(title);
    const artistId = slugify(artistName) || `artist-${idx}`;
    if (!artistMap.has(artistId)) {
      const artAsset = artistAssetByName(artistName);
      artistMap.set(artistId, {
        id: artistId,
        name: artistName,
        avatar: artAsset.avatar,
        banner: artAsset.banner,
      });
    }

    // Featured artists (create artist entries too so they show in the Artists tab)
    const featuredNames = inferFeaturedArtistNamesFromTitle(title);
    const featuredArtistIds = featuredNames
      .map((n) => ({ name: n, id: slugify(n) }))
      .filter((x) => x.id && x.id !== artistId)
      .map((x) => {
        if (!artistMap.has(x.id)) {
          const artAsset = artistAssetByName(x.name);
          artistMap.set(x.id, {
            id: x.id,
            name: x.name,
            avatar: artAsset.avatar,
            banner: artAsset.banner,
          });
        }
        return x.id;
      });

    const categoryId = inferCategoryId(title);
    const seed = hashToInt(file);
    const min = 18;
    const max = 59;
    const seconds = min + (seed % (max - min + 1));
    const duration = `0:${String(seconds).padStart(2, "0")}`;
    const posts = formatK(1200 + (seed % 35000));
    const likes = formatK(20000 + (seed % 1800000));
    return {
      id: `local-${slugify(file) || idx}`,
      title,
      artistId,
      featuredArtistIds,
      duration,
      posts,
      likes,
      categoryId,
      audioSrc: `./music/${file}`,
      // Prefer a cover image that exists in `/images` (same basename as mp3).
      // If missing, onerror handler + CSS fallback will keep the UI clean.
      coverSrc: coverForFile(file),
    };
  });

  const musicLibrary = {
    categories: CATEGORY_DEFS,
    artists: Array.from(artistMap.values()),
    tracks: tracksLocal,
  };

  const state = {
    activeTab: "for-you", // for-you | categories | artists | favorites
    view: (document.getElementById("storyMusicViewToggle")?.getAttribute("data-view") || "list").toLowerCase(),
    query: "",
    favorites: new Set(),
    favoriteArtists: new Set(),
    route: { mode: "root", type: null, id: null }, // root | category | artist
    playingTrackId: null,
    isPlaying: false,
    favoritesSort: "music", // music | artists
  };

  const STORY_MUSIC_STORAGE = {
    favorites: "sizemug_story_music_favorites_v1",
    favoriteArtists: "sizemug_story_music_favorite_artists_v1",
    favoritesSort: "sizemug_story_music_favorites_sort_v1",
  };

  function readJsonStorage(key, fallback) {
    try {
      const raw = window.localStorage ? window.localStorage.getItem(key) : null;
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  }

  function writeJsonStorage(key, value) {
    try {
      if (!window.localStorage) return;
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore storage failures (privacy mode / quota)
    }
  }

  function persistFavorites() {
    writeJsonStorage(STORY_MUSIC_STORAGE.favorites, Array.from(state.favorites));
    writeJsonStorage(STORY_MUSIC_STORAGE.favoriteArtists, Array.from(state.favoriteArtists));
    writeJsonStorage(STORY_MUSIC_STORAGE.favoritesSort, state.favoritesSort);
  }

  function hydrateFavoritesFromStorage() {
    const validTrackIds = new Set(musicLibrary.tracks.map((t) => String(t.id)));
    const validArtistIds = new Set(musicLibrary.artists.map((a) => String(a.id)));

    const storedFavs = readJsonStorage(STORY_MUSIC_STORAGE.favorites, []);
    if (Array.isArray(storedFavs)) {
      state.favorites = new Set(storedFavs.map((id) => String(id)).filter((id) => validTrackIds.has(id)));
    }

    const storedArtists = readJsonStorage(STORY_MUSIC_STORAGE.favoriteArtists, []);
    if (Array.isArray(storedArtists)) {
      state.favoriteArtists = new Set(storedArtists.map((id) => String(id)).filter((id) => validArtistIds.has(id)));
    }

    const storedSort = readJsonStorage(STORY_MUSIC_STORAGE.favoritesSort, null);
    if (storedSort === "music" || storedSort === "artists") {
      state.favoritesSort = storedSort;
    }
  }

  hydrateFavoritesFromStorage();

  function setViewToggleIcon() {
    const btn = document.getElementById("storyMusicViewToggle");
    if (!btn) return;

    // Hide the top-right toggle when it doesn't apply:
    // - Categories root uses a fixed grid of category cards.
    // - Category drill-down uses the injected toggle in the search bar.
    const hideTopToggle =
      state.activeTab === "categories" ||
      state.activeTab === "artists" ||
      state.route.mode === "category" ||
      state.route.mode === "artist";
    btn.style.display = hideTopToggle ? "none" : "";

    // Requirement: when the list is in grid form, the icon should change to the horizontal line icon.
    // We render the icon as the "switch to" indicator.
    const toListIcon =
      '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z"/></svg>';
    const toGridIcon =
      '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/></svg>';

    if (!hideTopToggle) {
      btn.innerHTML = state.view === "grid" ? toListIcon : toGridIcon;
      btn.setAttribute("aria-label", state.view === "grid" ? "Switch to list" : "Switch to grid");
    }

    // Also update drill-down view toggle buttons (if any)
    modalRoot.querySelectorAll(".story-music-view-toggle-btn").forEach((drillBtn) => {
      drillBtn.setAttribute("data-view", state.view);
    });
  }

  const elForYouList = document.getElementById("storyMusicForYouList");
  const elCategoriesGrid = document.getElementById("storyMusicCategoriesGrid");
  const elArtistsList = document.getElementById("storyMusicArtistsList");
  const elFavoritesList = document.getElementById("storyMusicFavoritesList");
  const elFavoritesEmpty = document.getElementById("storyMusicFavoritesEmpty");
  const elSearchInput = document.getElementById("storyMusicModalSearch");
  const elFavControls = document.getElementById("storyMusicFavControls");

  // Single audio element
  const audio = new Audio();
  audio.preload = "none";

  const artistById = (id) => musicLibrary.artists.find((a) => a.id === id);
  const categoryById = (id) => musicLibrary.categories.find((c) => c.id === id);

  const escapeAttr = (v) => String(v ?? "").replace(/&/g, "&amp;").replace(/"/g, "&quot;");

  // When an image fails to load we hide it; CSS provides a neutral fallback background.
  function imgOnErrorHide(el) {
    if (!el) return;
    el.style.display = "none";
    const parent = el.parentElement;
    if (parent) parent.classList.add("is-fallback");
  }

  // Inline `onerror="imgOnErrorHide(this)"` requires this function to exist on `window`.
  // Without it, the ReferenceError can prevent other UI logic from running.
  window.imgOnErrorHide = imgOnErrorHide;

  function safeAudioSrc(src) {
    const s = String(src || "").trim();
    if (!s) return "";
    // Encode spaces/special characters in filenames (e.g., "Piece_Of_My_Heart..." is fine,
    // but some files may contain spaces or other characters in the future).
    // Always resolve relative URLs against the current document so nested routes
    // (or a different base path) can't break audio fetching.
    try {
      const encoded = encodeURI(s);
      return new URL(encoded, window.location.href).toString();
    } catch {
      return s;
    }
  }

  function trackMatchesQuery(track, q) {
    if (!q) return true;
    const a = artistById(track.artistId);
    const featuredNames = (track.featuredArtistIds || []).map((id) => artistById(id)?.name || "").join(" ");
    const hay = `${track.title} ${a?.name ?? ""} ${featuredNames}`.toLowerCase();
    return hay.includes(q.toLowerCase());
  }

  function getRouteTracks() {
    let tracks = [...musicLibrary.tracks];

    if (state.route.mode === "category" && state.route.id) {
      tracks = tracks.filter((t) => t.categoryId === state.route.id);
    }

    if (state.route.mode === "artist" && state.route.id) {
      const artistId = state.route.id;
      tracks = tracks
        .filter((t) => t.artistId === artistId || (t.featuredArtistIds || []).includes(artistId))
        .sort((a, b) => {
          const aMain = a.artistId === artistId;
          const bMain = b.artistId === artistId;
          if (aMain !== bMain) return aMain ? -1 : 1; // main songs first
          return String(a.title || "").localeCompare(String(b.title || ""));
        });
    }

    // Favorites tab always filters to the favorites set.
    if (state.activeTab === "favorites") {
      tracks = tracks.filter((t) => state.favorites.has(t.id));
    }

    return tracks;
  }

  function getVisibleTracks() {
    const q = state.query;
    return getRouteTracks().filter((t) => trackMatchesQuery(t, q));
  }

  function getCurrentTracksHost() {
    // Matches the routing logic in renderForYouOrListContext.
    if (state.route.mode === "category") return elCategoriesGrid;
    if (state.route.mode === "artist") return elArtistsList;
    return elForYouList;
  }

  function applySearchFilterToHost(host) {
    if (!host) return;
    const term = String(state.query || "").toLowerCase().trim();
    // Only applies to track lists/grids.
    host.querySelectorAll("[data-track-id]").forEach((el) => {
      const hay = (el.getAttribute("data-search") || el.textContent || "").toLowerCase();
      el.style.display = !term || hay.includes(term) ? "" : "none";
    });
  }

  function setRoute(route) {
    state.route = route;
    // Drill-down stays within the current tab (Categories/Artists) and reuses the list renderer.
    render();
  }

  function stopPlayback() {
    audio.pause();
    audio.currentTime = 0;
    state.playingTrackId = null;
    state.isPlaying = false;
  }

  function togglePlay(trackId) {
    const track = musicLibrary.tracks.find((t) => t.id === trackId);
    if (!track) return;

    // If switching track
    if (state.playingTrackId && state.playingTrackId !== trackId) {
      stopPlayback();
    }

    if (!state.playingTrackId) {
      state.playingTrackId = trackId;
      const safeSrc = safeAudioSrc(track.audioSrc);
      audio.src = safeSrc;
      // Ensure the browser actually loads the new source before play().
      // (Helps when switching sources quickly and when served from static servers.)
      try {
        audio.load();
      } catch (loadErr) {
        // Ignore load errors; they'll be caught by audio.addEventListener("error")
      }
      audio.currentTime = 0;
    }

    // Missing/empty src: keep UI stable.
    if (!audio.src) {
      state.isPlaying = false;
      render();
      return;
    }

    if (audio.paused) {
      audio
        .play()
        .then(() => {
          state.isPlaying = true;
          render();
        })
        .catch((err) => {
          console.error("[StoryMusicModal] Audio play() failed", {
            src: audio.src,
            track,
            err,
          });
          // If file missing/autoplay blocked, keep UI stable
          state.isPlaying = false;
          render();
        });
    } else {
      audio.pause();
      state.isPlaying = false;
      render();
    }
  }

  audio.addEventListener("ended", () => {
    stopPlayback();
    render();
  });

  audio.addEventListener("error", () => {
    // If audio can't be loaded, reset playback state (e.g., missing file)
    console.error("[StoryMusicModal] Audio element error", {
      src: audio.src,
      code: audio?.error?.code,
      message: audio?.error?.message,
    });
    stopPlayback();
    render();
  });

  function toggleFavorite(trackId) {
    const id = String(trackId);
    if (state.favorites.has(id)) state.favorites.delete(id);
    else state.favorites.add(id);
    persistFavorites();
    // Ensure empty-state and lists update immediately even if currently on another tab.
    render();
  }

  function toggleFavoriteArtist(artistId) {
    const id = String(artistId);
    if (state.favoriteArtists.has(id)) state.favoriteArtists.delete(id);
    else state.favoriteArtists.add(id);
    persistFavorites();
    render();
  }

  function renderForYouOrListContext() {
    // Decide where the track list should render.
    // - Root For You + Favorites use the For You list host.
    // - Drill-down from Categories should render inside Categories panel.
    // - Drill-down from Artists should render inside Artists panel.
    const listHost =
      state.route.mode === "category"
        ? elCategoriesGrid
        : state.route.mode === "artist"
          ? elArtistsList
          : elForYouList;

    if (!listHost) return;

    // Build the full list based on route (search is applied via DOM filter to keep typing smooth).
    const tracks = getRouteTracks();

    // Optional banner header for category/artist drill-down
    let headerHtml = "";
    if (state.route.mode === "category") {
      const cat = categoryById(state.route.id);
      const searchValueAttr = escapeAttr(state.query || "");
      const searchPlaceholderAttr = escapeAttr(`Search in ${cat?.name || "Category"}...`);
      const iconEmoji = escapeHtml(cat?.icon || "");
      headerHtml = `
        <div class="story-music-detail-hero story-music-detail-hero--full story-music-detail-hero--category" style="--hero-bg:${escapeAttr(cat?.gradient || "linear-gradient(135deg,#fb7185,#f97316)")}">
          <div class="story-music-detail-hero__category-icon story-music-detail-hero__category-icon--left" aria-hidden="true">${iconEmoji}</div>
          <div class="story-music-detail-hero__category-icon story-music-detail-hero__category-icon--right" aria-hidden="true">${iconEmoji}</div>
          <div class="story-music-detail-hero__category">
            <h2>${escapeHtml(cat?.name || "Category")}</h2>
            <p>${escapeHtml(cat?.description || "")}</p>
            <button class="story-music-back story-music-back--center" data-story-music-back="categories" type="button" aria-label="Back to Categories">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M15.41 7.41L14 6l-6 6l6 6l1.41-1.41L10.83 12z"/></svg>
              <span>Back to Categories</span>
            </button>
          </div>
        </div>
        <div class="story-music-modal__search story-music-modal__search--injected is-drill" data-story-music-search-row="categories">
          <div class="story-music-search">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21l-4.343-4.343m0 0A8 8 0 1 0 5.343 5.343a8 8 0 0 0 11.314 11.314"/></svg>
            <input type="text" class="story-music-modal-search" placeholder="${searchPlaceholderAttr}" value="${searchValueAttr}" autocomplete="off" />
            <button type="button" class="story-music-modal__icon-btn story-music-view-toggle-btn" data-view="${escapeAttr(state.view)}" aria-label="Toggle view" title="Toggle list/grid view">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" class="view-icon-list" aria-hidden="true"><path fill="currentColor" d="M3 4h18v2H3zm0 7h18v2H3zm0 7h18v2H3z"/></svg>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" class="view-icon-grid" aria-hidden="true"><path fill="currentColor" d="M4 4h6v6H4zm0 10h6v6H4zm10-10h6v6h-6zm0 10h6v6h-6z"/></svg>
            </button>
          </div>
        </div>
      `;
    } else if (state.route.mode === "artist") {
      const a = artistById(state.route.id);

      const artistTrackCount = musicLibrary.tracks.filter((t) => t.artistId === state.route.id).length;
      const searchValueAttr = escapeAttr(state.query || "");
      const searchPlaceholderAttr = escapeAttr(`Search in ${a?.name || "Artist"}...`);

      headerHtml = `
        <div class="story-music-detail-hero story-music-detail-hero--artist story-music-detail-hero--full" style="--hero-bg: linear-gradient(135deg,#111827,#6d28d9); --hero-img:url(\"${escapeAttr(a?.banner || "")}\")">
          <div class="story-music-artist-hero">
            <div class="story-music-artist-hero__left">
              <h2>${escapeHtml(a?.name || "Artist")}</h2>
              <p>${escapeHtml(String(artistTrackCount))} songs</p>
              <button class="story-music-back story-music-back--ghost" data-story-music-back="artists" type="button" aria-label="Back to Artists">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M15.41 7.41L14 6l-6 6l6 6l1.41-1.41L10.83 12z"/></svg>
                <span>Back to Artists</span>
              </button>
            </div>
            <div class="story-music-artist-hero__right" aria-hidden="true">
              <div class="story-music-artist-hero__img">
                <img src="${escapeAttr(a?.banner || "")}" alt="" loading="lazy" onerror="imgOnErrorHide(this)" />
              </div>
            </div>
          </div>
        </div>
        <div class="story-music-modal__search story-music-modal__search--injected is-drill" data-story-music-search-row="artists">
          <div class="story-music-search">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21l-4.343-4.343m0 0A8 8 0 1 0 5.343 5.343a8 8 0 0 0 11.314 11.314"/></svg>
            <input type="text" class="story-music-modal-search" placeholder="${searchPlaceholderAttr}" value="${searchValueAttr}" autocomplete="off" />
            <button type="button" class="story-music-modal__icon-btn story-music-view-toggle-btn" data-view="${escapeAttr(state.view)}" aria-label="Toggle view" title="Toggle list/grid view">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" class="view-icon-list" aria-hidden="true"><path fill="currentColor" d="M3 4h18v2H3zm0 7h18v2H3zm0 7h18v2H3z"/></svg>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" class="view-icon-grid" aria-hidden="true"><path fill="currentColor" d="M4 4h6v6H4zm0 10h6v6H4zm10-10h6v6h-6zm0 10h6v6h-6z"/></svg>
            </button>
          </div>
        </div>
      `;
    }

    // Grid view is supported in For You root and in drill-down lists (Category/Artist).
    const useGrid =
      state.view === "grid" &&
      ((state.route.mode === "root" && state.activeTab === "for-you") ||
        state.route.mode === "category" ||
        state.route.mode === "artist");
    const wrapperClass = useGrid ? "story-music-grid" : "story-music-list";

    const itemsHtml = tracks
      .map((t) => {
        const a = artistById(t.artistId);
        const featuredNamesList = (t.featuredArtistIds || []).map((id) => artistById(id)?.name).filter(Boolean);
        const featuredSuffix = featuredNamesList.length ? ` feat ${featuredNamesList.join(", ")}` : "";
        const searchHay = `${t.title || ""} ${a?.name || ""} ${featuredNamesList.join(" ")}`.toLowerCase();
        const isFav = state.favorites.has(t.id);
        const isActive = state.playingTrackId === t.id;
        const isPlaying = isActive && state.isPlaying;
        const playIcon = isPlaying
          ? '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M6 5h4v14H6V5zm8 0h4v14h-4V5z"/></svg>'
          : '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>';
        const heartIcon = isFav
          ? '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="#f06b6b" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54z"/></svg>'
          : '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3C4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5C22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1l-.1-.1C7.14 14.24 4 11.39 4 8.5C4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5C18.5 5 20 6.5 20 8.5c0 2.89-3.14 5.74-7.9 10.05z"/></svg>';

        if (useGrid) {
          return `
            <div class="story-music-grid-card ${isActive ? "is-active" : ""} ${isPlaying ? "is-playing" : ""}" data-track-id="${escapeAttr(t.id)}" data-search="${escapeAttr(searchHay)}">
              <div class="story-music-grid-card__cover">
                <img src="${escapeAttr(t.coverSrc)}" alt="" loading="lazy" onerror="imgOnErrorHide(this)" />
                <div class="story-music-wave" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span></div>
                <div class="story-music-grid-card__overlay">
                  <button type="button" class="story-music-action-btn is-primary" data-action="play" data-track-id="${escapeAttr(t.id)}">${playIcon}</button>
                  <button type="button" class="story-music-action-btn" data-action="favorite" data-track-id="${escapeAttr(t.id)}">${heartIcon}</button>
                </div>
                <div class="story-music-grid-card__duration">${escapeHtml(t.duration)}</div>
              </div>
              <div class="story-music-grid-card__title">${escapeHtml(t.title)}</div>
              <div class="story-music-grid-card__sub">${escapeHtml(a?.name || "")}</div>
              <div class="story-music-grid-card__meta">
                <span>${escapeHtml(t.posts)} posts</span>
                <span>•</span>
                <span>${escapeHtml(t.likes)} likes</span>
              </div>
            </div>
          `;
        }

        return `
          <div class="story-music-item ${isActive ? "is-active" : ""} ${isPlaying ? "is-playing" : ""}" data-track-id="${escapeAttr(t.id)}" data-search="${escapeAttr(searchHay)}">
            <div class="story-music-item__cover">
              <img src="${escapeAttr(t.coverSrc)}" alt="" loading="lazy" onerror="imgOnErrorHide(this)" />
              <div class="story-music-wave" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span></div>
            </div>
            <div class="story-music-item__meta">
              <div class="story-music-item__title">${escapeHtml(t.title)}</div>
              <div class="story-music-item__sub">
                <span class="story-music-artist-chip">
                  <span class="story-music-artist-chip__avatar">
                    <img src="${escapeAttr(a?.avatar || "")}" alt="" loading="lazy" onerror="imgOnErrorHide(this)" />
                  </span>
                  <span class="story-music-artist-chip__name">${escapeHtml(a?.name || "")}</span>
                </span>
                ${featuredSuffix ? `<span class="story-music-artist-featured">${escapeHtml(featuredSuffix)}</span>` : ""}
                <span>•</span>
                <span>${escapeHtml(t.duration)}</span>
                <span>•</span>
                <span>${escapeHtml(t.posts)} posts</span>
                <span>•</span>
                <span>${escapeHtml(t.likes)} likes</span>
              </div>
            </div>
            <div class="story-music-item__actions">
              <button type="button" class="story-music-action-btn is-primary" data-action="play" data-track-id="${escapeAttr(t.id)}" aria-label="${isPlaying ? "Pause" : "Play"}">${playIcon}</button>
              <button type="button" class="story-music-action-btn" data-action="favorite" data-track-id="${escapeAttr(t.id)}" aria-label="${isFav ? "Remove from favorites" : "Add to favorites"}">${heartIcon}</button>
            </div>
          </div>
        `;
      })
      .join("");

    const hostModeClass =
      state.route.mode === "category"
        ? "story-music-host--category"
        : state.route.mode === "artist"
          ? "story-music-host--artist"
          : "story-music-host--root";

    listHost.innerHTML = `<div class="story-music-host ${hostModeClass}">${headerHtml}<div class="${wrapperClass}">${itemsHtml}</div></div>`;

    // Some global stylesheets can still wipe borders in drill-down contexts.
    // Force the bordered-card look inline (with !important) for Category/Artist drill-down track rows.
    if (state.route.mode === "category" || state.route.mode === "artist") {
      // Ensure the list wrapper has padding for spacing from modal walls
      const listWrapper = listHost.querySelector(".story-music-list, .story-music-grid");
      if (listWrapper) {
        listWrapper.style.setProperty("padding", "14px", "important");
      }
      
      const trackElements = listHost.querySelectorAll(".story-music-item[data-track-id], .story-music-grid-card[data-track-id]");
      console.log(`[StoryMusic] Enforcing borders on ${trackElements.length} drill-down track rows in ${state.route.mode} mode`);
      trackElements.forEach((el) => {
        el.style.setProperty("border-width", "1px", "important");
        el.style.setProperty("border-style", "solid", "important");
        el.style.setProperty("border-color", "#eef0f3", "important");
        el.style.setProperty("border-radius", "14px", "important");
        el.style.setProperty("background-color", "#fff", "important");
        el.style.setProperty("box-shadow", "0 0 0 1px #eef0f3 inset", "important");
        el.style.setProperty("outline", "1px solid #eef0f3", "important");
        el.style.setProperty("outline-offset", "-1px");
      });
    }

  // Apply the current search term without re-rendering (Boost-style).
  applySearchFilterToHost(listHost);

    // wire back buttons if present
    listHost.querySelectorAll("[data-story-music-back]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-story-music-back");
        // Leaving drill-down should clear any drill-down search.
        state.query = "";
        if (target === "categories") {
          state.route = { mode: "root", type: null, id: null };
          state.activeTab = "categories";
        } else if (target === "artists") {
          state.route = { mode: "root", type: null, id: null };
          state.activeTab = "artists";
        }
        render();
      });
    });

  }

  function renderCategories() {
    if (!elCategoriesGrid) return;
    // Root categories grid
    const cards = musicLibrary.categories
      .map(
        (c) => `
        <div class="story-music-category-card" data-category-id="${escapeAttr(c.id)}" style="background:${escapeAttr(c.gradient)}">
          <div class="story-music-category-card__meta">
            <h4>${escapeHtml(c.name)}</h4>
            <p>${escapeHtml(c.description)}</p>
          </div>
          <div class="story-music-category-card__icon" aria-hidden="true">${escapeHtml(c.icon || "")}</div>
        </div>
      `
      )
      .join("");

    elCategoriesGrid.innerHTML = cards;
  }

  function renderArtists() {
    if (!elArtistsList) return;
    const counts = new Map();
    musicLibrary.tracks.forEach((t) => {
      // main artist
      counts.set(t.artistId, (counts.get(t.artistId) || 0) + 1);
      // featured artists
      (t.featuredArtistIds || []).forEach((id) => counts.set(id, (counts.get(id) || 0) + 1));
    });

    // Defensive: ensure the Artists list is unique (some track-derived libraries can accidentally
    // duplicate artist objects when multiple songs exist for the same artist).
    const uniqueArtists = Array.from(
      new Map((musicLibrary.artists || []).map((a) => [a?.id || a?.name, a])).values()
    );

    elArtistsList.innerHTML = uniqueArtists
      .map((a) => {
        const count = counts.get(a.id) || 0;
        const isFav = state.favoriteArtists.has(a.id);
        const heartIcon = isFav
          ? '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="#f06b6b" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54z"/></svg>'
          : '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3C4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5C22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1l-.1-.1C7.14 14.24 4 11.39 4 8.5C4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5C18.5 5 20 6.5 20 8.5c0 2.89-3.14 5.74-7.9 10.05z"/></svg>';
        return `
          <div class="story-music-artist" data-artist-id="${escapeAttr(a.id)}">
            <div class="story-music-artist__left">
              <div class="story-music-artist__avatar">
                <img src="${escapeAttr(a.avatar)}" alt="" loading="lazy" onerror="imgOnErrorHide(this)" />
              </div>
              <div>
                <span class="story-music-artist__name">${escapeHtml(a.name)}</span>
                <span class="story-music-artist__count">(${count})</span>
              </div>
            </div>
            <div class="story-music-artist__actions">
              <button type="button" class="story-music-action-btn" data-action="favorite-artist" data-artist-id="${escapeAttr(a.id)}" aria-label="${isFav ? 'Remove from favorites' : 'Add to favorites'}">${heartIcon}</button>
            </div>
          </div>
        `;
      })
      .join("");
  }

  function renderFavoritesEmptyState() {
    if (!elFavoritesEmpty) return;
    const hasFav =
      state.favoritesSort === "artists"
        ? state.favorites.size > 0 || state.favoriteArtists.size > 0
        : state.favorites.size > 0;
    elFavoritesEmpty.classList.toggle("explore-hidden", hasFav);

    // hide the list host when empty
    if (elFavoritesList) {
      elFavoritesList.classList.toggle("explore-hidden", !hasFav);
    }

    // hide sort controls when empty (matches empty-state mockup feel)
    if (elFavControls) {
      elFavControls.classList.toggle("explore-hidden", !hasFav);
    }
  }

  function renderFavoritesArtists() {
    // Render artist-only list inside the Favorites panel.
    if (!elFavoritesList) return;

    const favoriteTracks = musicLibrary.tracks.filter((t) => state.favorites.has(t.id));
    const byArtist = new Map();
    favoriteTracks.forEach((t) => {
      const arr = byArtist.get(t.artistId) || [];
      arr.push(t);
      byArtist.set(t.artistId, arr);
    });

    const union = new Set();
    [...byArtist.keys()].forEach((id) => union.add(String(id)));
    [...state.favoriteArtists].forEach((id) => union.add(String(id)));

    const q = String(state.query || "").toLowerCase().trim();
    const artistIds = [...union]
      .filter((id) => !!artistById(id))
      .filter((id) => {
        if (!q) return true;
        const a = artistById(id);
        const name = String(a?.name || "").toLowerCase();
        if (name.includes(q)) return true;
        const tracks = byArtist.get(id) || [];
        return tracks.some((t) => trackMatchesQuery(t, q));
      })
      .sort((aId, bId) => {
        const a = artistById(aId)?.name || "";
        const b = artistById(bId)?.name || "";
        return a.localeCompare(b);
      });

    const items = artistIds
      .map((artistId) => {
        const a = artistById(artistId);
        const savedCount = (byArtist.get(artistId) || []).length;
        const isFav = state.favoriteArtists.has(artistId);
        const heartIcon = isFav
          ? '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="#f06b6b" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54z"/></svg>'
          : '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3C4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5C22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1l-.1-.1C7.14 14.24 4 11.39 4 8.5C4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5C18.5 5 20 6.5 20 8.5c0 2.89-3.14 5.74-7.9 10.05z"/></svg>';
        const savedCountHtml = savedCount > 0 ? `<span class="story-music-artist__count">(${escapeHtml(String(savedCount))})</span>` : "";
        return `
          <div class="story-music-artist" data-artist-id="${escapeAttr(artistId)}">
            <div class="story-music-artist__left">
              <div class="story-music-artist__avatar">
                <img src="${escapeAttr(a?.avatar || "")}" alt="" loading="lazy" onerror="imgOnErrorHide(this)" />
              </div>
              <div>
                <span class="story-music-artist__name">${escapeHtml(a?.name || "Artist")}</span>
                ${savedCountHtml}
              </div>
            </div>
            <div class="story-music-artist__actions">
              <button type="button" class="story-music-action-btn" data-action="favorite-artist" data-artist-id="${escapeAttr(
                artistId
              )}" aria-label="${isFav ? "Remove from favorites" : "Add to favorites"}">${heartIcon}</button>
            </div>
          </div>
        `;
      })
      .join("");

    elFavoritesList.innerHTML = `<div class="story-music-fav-artists">${items || ""}</div>`;
  }

  const openModal = () => {
    modalRoot.classList.remove("explore-hidden");
    modalRoot.setAttribute("aria-hidden", "false");
    document.body.classList.add("story-music-modal-open");

    // reset to For you on open
    if (!state.activeTab) state.activeTab = "for-you";
    render();
  };

  const closeModal = () => {
    modalRoot.classList.add("explore-hidden");
    modalRoot.setAttribute("aria-hidden", "true");
    document.body.classList.remove("story-music-modal-open");

    stopPlayback();
  };

  // Open from tools list
  document.addEventListener(
    "click",
    (e) => {
      const btn = e.target.closest('button.tool-item[data-tool-target="music-sound"]');
      if (!btn) return;

      // Don't switch sidebar tool panel; open modal instead.
      e.preventDefault();
      e.stopPropagation();
      openModal();
    },
    true
  );

  // Close by clicking outside
  if (backdrop) {
    backdrop.addEventListener("click", closeModal);
  }

  // Prevent dialog clicks from bubbling to backdrop handlers
  // REMOVED: dialog.addEventListener("click", (e) => e.stopPropagation());
  // This was blocking all clicks inside the modal from reaching our delegated handlers!
  // Instead, we'll stop propagation only on the backdrop, which already has its own listener.

  // ESC closes
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (modalRoot.classList.contains("explore-hidden")) return;
    closeModal();
  });

  // Tabs switching
  const tabButtons = [...modalRoot.querySelectorAll(".story-music-tab")];
  const panels = [...modalRoot.querySelectorAll(".story-music-panel")];

  const activateTab = (name) => {
    // Switching tabs should reset any search query so filters don't leak across screens.
    if (state.activeTab !== name) state.query = "";
    state.activeTab = name;

    // Reset drill-down when leaving Categories/Artists, but keep it when entering.
    // This prevents the UI from jumping back to For you when selecting a category/artist.
    if (name !== "categories" && name !== "artists") {
      state.route = { mode: "root", type: null, id: null };
    }

    tabButtons.forEach((b) => {
      const active = b.getAttribute("data-story-music-tab") === name;
      b.classList.toggle("is-active", active);
      b.setAttribute("aria-selected", active ? "true" : "false");
    });

    panels.forEach((p) => {
      const active = p.getAttribute("data-story-music-panel") === name;
      p.classList.toggle("is-active", active);
      p.setAttribute("aria-hidden", active ? "false" : "true");
    });

    render();
  };

  tabButtons.forEach((b) => {
    b.addEventListener("click", () => activateTab(b.getAttribute("data-story-music-tab")));
  });

  // Favorites sort toggle (Music / Artists)
  if (elFavControls) {
    elFavControls.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-fav-sort]");
      if (!btn) return;
      const next = btn.getAttribute("data-fav-sort");
      if (next !== "music" && next !== "artists") return;
      state.favoritesSort = next;
      persistFavorites();

      elFavControls.querySelectorAll("[data-fav-sort]").forEach((b) => {
        const active = b.getAttribute("data-fav-sort") === next;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-selected", active ? "true" : "false");
      });

      render();
    });
  }

  // Favorites empty CTA back to For you
  modalRoot.querySelectorAll('[data-story-music-go="for-you"]').forEach((btn) => {
    btn.addEventListener("click", () => activateTab("for-you"));
  });

  // Search row toggle
  const searchToggle = document.getElementById("storyMusicSearchToggle");

  function activePanelName() {
    return state.activeTab || "for-you";
  }

  function getActiveSearchRow() {
    return modalRoot.querySelector(`[data-story-music-search-row="${CSS.escape(activePanelName())}"]`);
  }

  function getActiveSearchInput() {
    const row = getActiveSearchRow();
    return row ? row.querySelector(".story-music-modal-search") : null;
  }

  if (searchToggle) {
    searchToggle.addEventListener("click", () => {
      const row = getActiveSearchRow();
      const input = getActiveSearchInput();
      if (!row) return;
      row.classList.toggle("explore-hidden");
      if (!row.classList.contains("explore-hidden")) {
        setTimeout(() => input && input.focus(), 0);
      }
    });
  }

  // Search input filtering
  // Search inputs (one per panel) share the same state.query
  modalRoot.querySelectorAll(".story-music-modal-search").forEach((input) => {
    input.addEventListener("input", () => {
      state.query = input.value || "";
      applySearchFilterToHost(getCurrentTracksHost());
    });
    
    // Prevent search interactions from being treated as an outside-click (like boost modal)
    // Some pages attach global click listeners for menus/popovers.
    const stop = (e) => e.stopPropagation();
    input.addEventListener("click", stop);
    input.addEventListener("mousedown", stop);
    input.addEventListener("pointerdown", stop);
  });

  // When drill-down content is re-rendered, the injected search input is recreated.
  // The handler above only binds to elements present at init time, so we also
  // delegate input events to keep search working in drill-down.
  modalRoot.addEventListener(
    "input",
    (e) => {
      const input = e.target && e.target.closest && e.target.closest(".story-music-modal-search");
      if (!input) return;
      state.query = input.value || "";
      applySearchFilterToHost(getCurrentTracksHost());
    },
    true
  );
  
  // Prevent clicks on search inputs from closing the modal (including injected drill-down inputs)
  modalRoot.addEventListener(
    "click",
    (e) => {
      const input = e.target && e.target.closest && e.target.closest(".story-music-modal-search");
      if (input) {
        e.stopPropagation();
      }
    },
    true
  );

  // Also stop pointer/mouse down events for injected inputs (covers cases where outer handlers
  // close UI on mousedown instead of click).
  modalRoot.addEventListener(
    "mousedown",
    (e) => {
      const input = e.target && e.target.closest && e.target.closest(".story-music-modal-search");
      if (input) {
        e.stopPropagation();
      }
    },
    true
  );

  modalRoot.addEventListener(
    "pointerdown",
    (e) => {
      const input = e.target && e.target.closest && e.target.closest(".story-music-modal-search");
      if (input) {
        e.stopPropagation();
      }
    },
    true
  );

  // Rendering on every keystroke can recreate injected drill-down DOM (banner/search)
  // and cause the input to lose focus. Use a tiny RAF scheduler so typing stays smooth
  // while still providing live-search behavior.
  let renderRaf = 0;
  function scheduleRender() {
    if (renderRaf) return;
    renderRaf = requestAnimationFrame(() => {
      renderRaf = 0;
      render();
    });
  }

  // View toggle list/grid
  const viewToggle = document.getElementById("storyMusicViewToggle");
  if (viewToggle) {
    viewToggle.addEventListener("click", () => {
      const next = (viewToggle.getAttribute("data-view") || "list") === "list" ? "grid" : "list";
      viewToggle.setAttribute("data-view", next);
      state.view = next;
      render();
    });
  }

  // Delegated interactions (play/favorite/category/artist/view-toggle)
  modalRoot.addEventListener("click", (e) => {
    // Handle drill-down view toggle button (injected dynamically)
    const viewToggleBtn = e.target.closest(".story-music-view-toggle-btn");
    if (viewToggleBtn) {
      const current = viewToggleBtn.getAttribute("data-view") || "list";
      const next = current === "list" ? "grid" : "list";
      state.view = next;
      render();
      return;
    }

    const actionBtn = e.target.closest("[data-action]");
    if (actionBtn) {
      const action = actionBtn.getAttribute("data-action");
      
      if (action === "favorite-artist") {
        const artistId = actionBtn.getAttribute("data-artist-id");
        if (!artistId) return;
        e.preventDefault();
        e.stopPropagation();
        toggleFavoriteArtist(artistId);
        return;
      }
      
      const trackId = actionBtn.getAttribute("data-track-id");
      if (!trackId) return;
      // Prevent action button clicks from also triggering row/card click-to-play.
      e.preventDefault();
      e.stopPropagation();
      if (action === "play") togglePlay(trackId);
      if (action === "favorite") toggleFavorite(trackId);
      return;
    }

    // Clicking anywhere on a track row/card toggles playback.
    // (Icons are hidden until playing, so the row itself acts as the control.)
    const trackContainer = e.target.closest("[data-track-id]");
    if (trackContainer) {
      const trackId = trackContainer.getAttribute("data-track-id");
      if (trackId) {
        togglePlay(trackId);
        return;
      }
    }

    const categoryCard = e.target.closest("[data-category-id]");
    if (categoryCard && state.activeTab === "categories") {
      const categoryId = categoryCard.getAttribute("data-category-id");
      if (!categoryId) return;

      // Stay in Categories tab; drill-down renders into the Categories panel.
      state.query = "";
      state.route = { mode: "category", type: "category", id: categoryId };
      render();
      return;
    }

    const artistRow = e.target.closest("[data-artist-id]");
    if (artistRow && state.activeTab === "artists") {
      const artistId = artistRow.getAttribute("data-artist-id");
      if (!artistId) return;

      // Stay in Artists tab; list renderer can show drill-down content.
      state.query = "";
      state.route = { mode: "artist", type: "artist", id: artistId };
      render();
      return;
    }
  });

  function render() {
    setViewToggleIcon();
    // When drilling down into a Category/Artist, keep search visible so it appears
    // immediately under the banner (outside the banner, per mockups).
    const isDrillDown = state.route.mode === "category" || state.route.mode === "artist";

    // Store which input had focus before re-rendering
    const hadFocus = document.activeElement?.classList.contains("story-music-modal-search");

    // Contextual search placeholders
    const defaultPlaceholderByPanel = {
      "for-you": "Search music...",
      categories: "Search categories...",
      artists: "Search artists...",
      favorites: "Search favorites...",
    };
    let drillPlaceholder = "Search music...";
    if (state.route.mode === "category") {
      const cat = categoryById(state.route.id);
      drillPlaceholder = `Search in ${cat?.name || "Category"}...`;
    } else if (state.route.mode === "artist") {
      const a = artistById(state.route.id);
      drillPlaceholder = `Search in ${a?.name || "Artist"} music...`;
    }

    // Keep all search inputs in sync with the shared query
    modalRoot.querySelectorAll(".story-music-modal-search").forEach((inp) => {
      if (inp.value !== state.query) inp.value = state.query;
    });

    // Apply placeholder to the active panel's search input
    const activeInput = getActiveSearchInput();
    if (activeInput) {
      activeInput.placeholder = isDrillDown
        ? drillPlaceholder
        : defaultPlaceholderByPanel[activePanelName()] || "Search music...";
    }

    // In drill-down we often inject a banner + search block into the panel's content
    // (so the banner can render before the search like the mockups).
    // Hide the panel-level search row for Categories drill-down to avoid the search
    // appearing above the banner.
    const activeRow = getActiveSearchRow();
    if (activeRow) {
      const hidePanelRow = state.route.mode === "category" || state.route.mode === "artist";
      if (hidePanelRow) activeRow.classList.add("explore-hidden");
      else if (isDrillDown) activeRow.classList.remove("explore-hidden");
      activeRow.classList.toggle("is-drill", isDrillDown);
    }

    // Hide the top-right view toggle button on Categories/Artists tabs and during drill-down
    // (we show the toggle in the drill-down search bar instead)
    if (viewToggle) {
      if (
        state.activeTab === "categories" ||
        state.activeTab === "artists" ||
        state.route.mode === "category" ||
        state.route.mode === "artist"
      ) {
        viewToggle.classList.add("explore-hidden");
      } else {
        viewToggle.classList.remove("explore-hidden");
      }
    }

    // Panels always exist; ensure correct tab/panel visibility
    // (activateTab already does this, but render can be called independently)
    tabButtons.forEach((b) => {
      const name = b.getAttribute("data-story-music-tab");
      const active = name === state.activeTab;
      b.classList.toggle("is-active", active);
      b.setAttribute("aria-selected", active ? "true" : "false");
    });

    panels.forEach((p) => {
      const name = p.getAttribute("data-story-music-panel");
      const active = name === state.activeTab;
      p.classList.toggle("is-active", active);
      p.setAttribute("aria-hidden", active ? "false" : "true");
    });

    // Render roots
    renderCategories();
    renderArtists();

    // Render list hosts
    // - For You tab renders the main list.
    // - Favorites tab renders into the For You host (existing markup pattern).
    // - Drill-down views render into their source tab container (Categories/Artists).
    // Render list hosts
    if (state.activeTab === "for-you" || state.activeTab === "favorites" || isDrillDown) {
      renderForYouOrListContext();
    }

    // Favorites empty/filled
    renderFavoritesEmptyState();

    // If favorites tab has items, show list using the For you list host
    if (state.activeTab === "favorites") {
      if (state.favoritesSort === "artists") {
        renderFavoritesArtists();
      } else {
        const tracks = getVisibleTracks();
        if (tracks.length) {
          // Music list (default)
          if (elFavoritesList) {
            elFavoritesList.innerHTML = `<div class="story-music-list">${tracks
              .map((t) => {
                const a = artistById(t.artistId);
                const isFav = state.favorites.has(t.id);
                const isActive = state.playingTrackId === t.id;
                const isPlaying = isActive && state.isPlaying;
                const playIcon = isPlaying
                  ? '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M6 5h4v14H6V5zm8 0h4v14h-4V5z"/></svg>'
                  : '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>';
                const heartIcon = isFav
                  ? '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="#f06b6b" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54z"/></svg>'
                  : '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3C4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5C22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1l-.1-.1C7.14 14.24 4 11.39 4 8.5C4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5C18.5 5 20 6.5 20 8.5c0 2.89-3.14 5.74-7.9 10.05z"/></svg>';
                return `
                    <div class="story-music-item ${isActive ? "is-active" : ""} ${isPlaying ? "is-playing" : ""}" data-track-id="${escapeAttr(t.id)}">
                      <div class="story-music-item__cover">
                        <img src="${escapeAttr(t.coverSrc)}" alt="" loading="lazy" onerror="imgOnErrorHide(this)" />
                        <div class="story-music-wave" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span></div>
                      </div>
                      <div class="story-music-item__meta">
                        <div class="story-music-item__title">${escapeHtml(t.title)}</div>
                        <div class="story-music-item__sub">
                          <span>${escapeHtml(a?.name || "")}</span>
                          <span>•</span>
                          <span>${escapeHtml(t.duration)}</span>
                        </div>
                      </div>
                      <div class="story-music-item__actions">
                        <button type="button" class="story-music-action-btn is-primary" data-action="play" data-track-id="${escapeAttr(t.id)}">${playIcon}</button>
                        <button type="button" class="story-music-action-btn" data-action="favorite" data-track-id="${escapeAttr(t.id)}">${heartIcon}</button>
                      </div>
                    </div>
                  `;
              })
              .join("")}</div>`;
          }
        }
      }
    }

    // Restore focus to search input if it had focus before rendering
    // (prevents losing typing position in drill-down search)
    if (hadFocus) {
      const newActiveInput =
        state.route.mode === "category"
          ? elCategoriesGrid?.querySelector(".story-music-modal__search--injected .story-music-modal-search")
          : state.route.mode === "artist"
            ? elArtistsList?.querySelector(".story-music-modal__search--injected .story-music-modal-search")
            : getActiveSearchInput();
      if (newActiveInput && document.activeElement !== newActiveInput) {
        // Use microtask to ensure DOM is fully updated before focusing
        Promise.resolve().then(() => {
          newActiveInput.focus();
          // Restore cursor to end of input
          if (newActiveInput.value) {
            newActiveInput.setSelectionRange(newActiveInput.value.length, newActiveInput.value.length);
          }
        });
      }
    }
  }

  // First render
  render();
}

// boot
document.addEventListener("DOMContentLoaded", () => {
  initStoryMusicModalUi();
});

let currentStoryEditingMedia = null; // {id: 1, type: '', media: "" }
let activeEditingTool = null; //

class PhotoStoryInterface {
  constructor() {
    this.uploadInterface = document.getElementById("upload-interface");
    this.editingInterface = document.getElementById("editing-interface");
    this.textStoryInterface = document.getElementById("text-story-interface");
    this.photoUpload = document.getElementById("photo-upload");
    this.photoStoryBtn = document.getElementById("photo-story-btn");
    this.headerStart = document.getElementById("multipleHeader");
    this.textStoryBtn = document.getElementById("text-story-btn");
    this.slider = document.getElementById("zoomSlider");
    this.galleryContainers = document.querySelectorAll(".galleryContainer");
    this.closeStoryModal = document.getElementById("closeStoryModal");
    this.backStoryModalInitial = document.getElementById("backStoryModalInitial");
    this.toolsContainerSidebars = document.querySelectorAll(".tools-container-story-item");

    this.hideStoryEditingGallery = document.getElementById("hideStoryEditingGallery");

    this.canvasWrap = document.getElementById("canvasWrap");
    this.canvasControllerFit = document.getElementById("canvasControllerFit");
    this.rotateStoryCanvas = document.getElementById("rotateStoryCanvas");

    // Current active tool
    this.currentTool = "main";
    // this.currentFilter = "all";
    this.isTransitioning = false;
    // this.currentMode = "location";

    this.storyEditingItems = [
      {
        id: 1,
        type: "", // 'image' | 'video'
        media: "",
        poll: {
          title: "",
          options: ["", ""],
          fillColor: null, // "#ffffff"
        },
      },
    ];

    this.currentSettingsEditing = "settings"; // settings | visibility | duration | interaction | audio
    
    // Track item being edited for edit functionality
    this.currentEditingItem = null;

    this.initializeEventListeners();
  }

  initializeEventListeners() {
    document.querySelectorAll("[data-story-panel-button]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const panel = btn.dataset.storyPanelButton;
        console.log(panel);

        if (!panel) new Error(`No panel found for ${btn}`);
        console.log(panel);

        this.switchSidebarPanel(panel);
      });
    });

    // Back
    document.querySelectorAll("[data-story-panel-back]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const panel = btn.dataset.textPanelBack;
        this.switchSidebarPanel(panel, false);
      });
    });

    // Photo story button click
    this.photoStoryBtn?.addEventListener("click", () => {
      this.photoUpload.click();
    });

    // File upload change
    this.photoUpload?.addEventListener("change", (e) => {
      this.handleFileUpload(e);
    });

    // text story interface
    this.textStoryBtn?.addEventListener("click", () => {
      this.switchTextStory();
    });

    // Gallery Container :)
    this.hideStoryEditingGallery.addEventListener("click", () => {
      this._closeRightGalleries();
    });

    // Toggle Canvas Fit :)
    this.canvasControllerFit.addEventListener("click", () => {
      const canvasFit = this.canvasWrap.getAttribute("data-canvas-fit") === "true";
      this.canvasWrap.setAttribute("data-canvas-fit", !canvasFit);
      this.canvasControllerFit.classList.toggle("active");
    });

    // Toggle
    this.rotateStoryCanvas.addEventListener("click", (e) => {
      const isRotated = this.rotateStoryCanvas.classList.contains("active");

      if (isRotated) {
        this.rotateStoryCanvas.classList.remove("active");
        this.canvasWrap.classList.remove("rotate-state");
      } else {
        this.rotateStoryCanvas.classList.add("active");
        this.canvasWrap.classList.add("rotate-state");
      }
    });

    // Tool Tab switching :)
    this.initializeToolSwitching();

    // Gallery interactions
    this.initializeGalleryInteractions();

    // Canvas controls
    this.initializeCanvasControls();

    // Bottom actions
    this.initializeBottomActions();

    // setting
    this.initializeSettingsPanel();
  }

  //
  switchSidebarPanel(panel) {
    if (!panel) return;

    const sidebarPanels = document.querySelectorAll(".tool-content [data-setting-content]");
    const currentPanel = document.querySelector(`.tool-content [data-setting-content="${panel}"]`);
    const mediaEditingSettingTitle = document.getElementById("media_editing_setting_title");

    if (!currentPanel) return;

    this.currentSettingsEditing = panel;

    if (panel === "visibility") {
      mediaEditingSettingTitle.textContent = "Visibility";
    } else if (panel === "duration") {
      mediaEditingSettingTitle.textContent = "Duration";
    } else if (panel === "interaction") {
      mediaEditingSettingTitle.textContent = "Interaction & controls";
    } else if (panel === "audio") {
      mediaEditingSettingTitle.textContent = "Audio & Sound";
    } else {
      mediaEditingSettingTitle.textContent = "Settings";
    }

    sidebarPanels.forEach((sidebar) => sidebar.classList.add(HIDDEN));
    currentPanel.classList.remove(HIDDEN);

    return new Promise((resolve) => {
      currentPanel.style.transform = "translateX(100%)";
      currentPanel.style.transition = "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)";

      // Force reflow
      currentPanel.offsetHeight;

      requestAnimationFrame(() => {
        currentPanel.style.transform = "translateX(0)";
      });

      setTimeout(() => {
        resolve();
      }, 300);
    });
  }

  // Close right galleries
  _closeRightGalleries() {
    this.galleryContainers.forEach((gallery) => {
      gallery.classList.toggle(HIDDEN);
    });
  }

  // Add this to your initializeEventListeners method
  initializeSettingsPanel() {
    // Settings button clicks
    document.querySelectorAll(".storySetting").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const currentToolElement = e.target.closest(".tool-interface");
        const toolName = currentToolElement ? currentToolElement.dataset.tool : "main";
        this.showSettings(toolName);
      });
    });

    // Settings option clicks
    document.addEventListener("click", (e) => {
      if (e.target.closest(".setting-option")) {
        const settingOption = e.target.closest(".setting-option").dataset.settingOption;
        this.showSettingOption(settingOption);
      }

      // Settings back button
      if (e.target.closest(".settings-back-btn")) {
        this.hideSettings();
      }

      // Setting option back button
      if (e.target.closest(".setting-option-back-btn")) {
        this.showSettingsList();
      }

      // Theme selection
      if (e.target.closest(".theme-option")) {
        document.querySelectorAll(".theme-option").forEach((el) => el.classList.remove("active"));
        e.target.closest(".theme-option").classList.add("active");
      }

      // Position selection
      if (e.target.closest(".position-btn")) {
        document.querySelectorAll(".position-btn").forEach((el) => el.classList.remove("active"));
        e.target.closest(".position-btn").classList.add("active");
      }

      // Animation selection
      if (e.target.closest(".animation-option")) {
        const parent = e.target.closest(".animation-options");
        parent.querySelectorAll(".animation-option").forEach((el) => el.classList.remove("active"));
        e.target.closest(".animation-option").classList.add("active");
      }
    });

    // Toggle controls
    document.addEventListener("change", (e) => {
      if (e.target.id === "shadow-toggle") {
        const shadowControls = document.querySelector(".shadow-controls");
        shadowControls.style.display = e.target.checked ? "block" : "none";
      }

      if (e.target.id === "border-toggle") {
        const borderControls = document.querySelector(".border-controls");
        borderControls.style.display = e.target.checked ? "block" : "none";
      }
    });

    // Slider value updates
    document.addEventListener("input", (e) => {
      if (e.target.type === "range") {
        const valueSpan = document.getElementById(e.target.id.replace("-slider", "-value"));
        if (valueSpan) {
          const value = e.target.value;
          let unit = "";

          // Add appropriate units
          if (e.target.id.includes("opacity") || e.target.id.includes("width") || e.target.id.includes("height")) {
            unit = "%";
          } else if (e.target.id.includes("rotation")) {
            unit = "°";
          } else if (e.target.id.includes("duration") || e.target.id.includes("delay")) {
            unit = "s";
          } else if (e.target.id.includes("blur") || e.target.id.includes("shadow") || e.target.id.includes("border-width")) {
            unit = "px";
          }

          valueSpan.textContent = value + unit;
        }
      }
    });
  }

  showSettings(toolName) {
    this.currentSetting = toolName;

    // Hide current tool interface
    document.querySelectorAll(".tool-interface, .tool-sidebar-wrapper").forEach((el) => {
      el.style.display = "none";
    });

    // Show settings interface
    const settingsInterface = document.querySelector('[data-tool="settings"]');
    if (settingsInterface) {
      settingsInterface.style.display = "block";
      this.updateSettingsContent(toolName);
    }
  }

  hideSettings() {
    // Hide settings interface
    const settingsInterface = document.querySelector('[data-tool="settings"]');
    if (settingsInterface) {
      settingsInterface.style.display = "none";
    }

    // Show previous tool
    this.switchToTool(this.currentSetting || "main");
    this.currentSetting = null;
  }

  showSettingOption(optionName) {
    this.currentSettingOption = optionName;

    // Hide settings list
    const settingsList = document.querySelector(".settings-list");
    if (settingsList) {
      settingsList.style.display = "none";
    }

    // Show setting option content
    const optionContent = document.querySelector(`[data-setting-content="${optionName}"]`);
    if (optionContent) {
      optionContent.style.display = "block";
    }

    // Update header
    const settingsTitle = document.querySelector(".settings-title");
    if (settingsTitle) {
      settingsTitle.textContent = this.getSettingOptionTitle(optionName);
    }

    // Show back button for setting option
    const settingOptionBackBtn = document.querySelector(".setting-option-back-btn");
    const settingsBackBtn = document.querySelector(".settings-back-btn");
    if (settingOptionBackBtn && settingsBackBtn) {
      settingOptionBackBtn.style.display = "block";
      settingsBackBtn.style.display = "none";
    }
  }

  showSettingsList() {
    // Hide all setting option contents
    document.querySelectorAll(".setting-option-content").forEach((el) => {
      el.style.display = "none";
    });

    // Show settings list
    const settingsList = document.querySelector(".settings-list");
    if (settingsList) {
      settingsList.style.display = "block";
    }

    // Update header
    const settingsTitle = document.querySelector(".settings-title");
    if (settingsTitle) {
      settingsTitle.textContent = `${this.getToolDisplayName(this.currentSetting)} Settings`;
    }

    // Hide setting option back button, show settings back button
    const settingOptionBackBtn = document.querySelector(".setting-option-back-btn");
    const settingsBackBtn = document.querySelector(".settings-back-btn");
    if (settingOptionBackBtn && settingsBackBtn) {
      settingOptionBackBtn.style.display = "none";
      settingsBackBtn.style.display = "block";
    }
  }

  updateSettingsContent(toolName) {
    const settingsTitle = document.querySelector(".settings-title");
    if (settingsTitle) {
      settingsTitle.textContent = `${this.getToolDisplayName(toolName)} Settings`;
    }

    // Show settings list, hide all option contents
    this.showSettingsList();
  }

  getToolDisplayName(toolName) {
    const toolNames = {
      main: "General",
      "text-typography": "Text & Typography",
      "stickers-gifs": "Stickers & GIFs",
      "drawing-scribbles": "Drawing & Scribbles",
      "polls-quizzes": "Polls & Quizzes",
      countdown: "Countdown",
      "music-sound": "Music & Sound",
      "location-tags": "Location & Tags",
      tasks: "Tasks",
      "board-mode": "Board Mode",
    };
    return toolNames[toolName] || "Settings";
  }

  getSettingOptionTitle(optionName) {
    const optionTitles = {
      appearance: "Visibility & privacy",
      animation: "Interaction controls",
      position: "Duration",
      effects: "Audio & playback",
    };
    return optionTitles[optionName] || "Setting";
  }

  _setStoryAsideToInitial() {
    this.toolsContainerSidebars.forEach((container) => container.classList.add(HIDDEN));
    document.querySelector('[data-tool-container="main"]').classList.remove(HIDDEN);

    activeEditingTool = null;

    // HID
    window.audioStoryLogic.audioOnScreenTools.classList.add(HIDDEN);
    window.audioStoryLogic.audioOnScreenTools.classList.remove("editing-mode");

    //
    this.switchStoryHeaderModalControllerButtons();
  }

  initializeToolSwitching() {
    const mainToolContainer = document.getElementById("mainToolContainer");

    // Main Tool Container :)
    mainToolContainer.addEventListener("click", (e) => {
      const toolItem = e.target.closest("button.tool-item");

      if (toolItem) {
        const dataset = toolItem.getAttribute("data-tool-target");
        const container = document.querySelector(`[data-tool-container="${dataset}"]`);

        if (!container) throw new Error("data-tool-container cannot be found :) 😥");

        activeEditingTool = dataset;

        mainToolContainer.querySelectorAll("button.tool-item").forEach((btn) => btn.classList.remove("active"));
        toolItem.classList.add("active");

        this.toolsContainerSidebars.forEach((container) => container.classList.add(HIDDEN));
        container.classList.remove(HIDDEN);
        this.currentTool = dataset;

        //
        this.switchStoryHeaderModalControllerButtons("back");

        // Animate in the font family container :)
        if (window.textStoryLogic && this.currentTool === "text-typography") {
          window.textStoryLogic._animateIn(document.querySelector(`[data-typography-content="family"]`));
          window.textStoryLogic.textOnScreenTools.classList.remove(HIDDEN);
          return;
        }

        // Initialize `all` stickers :)
        if (window.stickerStoryLogic && this.currentTool === "stickers-gifs") {
          window.stickerStoryLogic._loadStickerCategory("all");
        }

        // Drawing
        if (this.currentTool === "drawing-scribbles") {
          if (!window.freehandDrawing) {
            window.freehandDrawing = new window.FreehandDrawing();
            console.log(window.freehandDrawing);
          }
        }
      }
    });

    // Back Story Modal Initial :)
    this.backStoryModalInitial.addEventListener("click", () => {
      if (this.currentSettingsEditing === "settings") {
        this._setStoryAsideToInitial();
      } else {
        this.switchSidebarPanel("settings"); // Go back to settings home
      }
    });

    // Close Story Modal :)
    this.closeStoryModal.addEventListener("click", () => {
      this.closeInterface();
    });
  }

  // state = close | back  ------- 🤨
  switchStoryHeaderModalControllerButtons(state = "close") {
    if (state === "close") {
      this.backStoryModalInitial.classList.add(HIDDEN);
      this.closeStoryModal.classList.remove(HIDDEN);
      // Hide Text On Screen Display 😂 :)
      window.textStoryLogic.textOnScreenTools.classList.add(HIDDEN);
    } else if (state === "back") {
      this.closeStoryModal.classList.add(HIDDEN);
      this.backStoryModalInitial.classList.remove(HIDDEN);
    }
  }

  switchToTool(toolName) {
    // Hide all tool interfaces
    document.querySelectorAll("[data-tool]").forEach((tool) => {
      tool.style.display = "none";
    });

    // Show target tool interface
    const targetTool = document.querySelector(`[data-tool="${toolName}"]`);
    if (targetTool) {
      targetTool.style.display = "block";
      this.currentTool = toolName;
    }
  }

  // Enhanced option selection with micro-animations
  selectOption(optionElement, siblingSelector) {
    // Remove active from siblings
    document.querySelectorAll(siblingSelector).forEach((option) => {
      option.classList.remove("active");
      option.style.transform = "scale(1)";
    });

    // Add active to selected option with animation
    optionElement.classList.add("active");

    // Micro bounce animation
    optionElement.style.transform = "scale(0.95)";
    setTimeout(() => {
      optionElement.style.transform = "scale(1.05)";
      setTimeout(() => {
        optionElement.style.transform = "scale(1)";
      }, 100);
    }, 50);
  }

  switchType(type) {
    this.currentType = type;

    // Update toggle buttons
    const toggleBtns = document.querySelectorAll(".toggle-btn");
    toggleBtns.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.type === type);
    });

    // Show/hide correct option section
    const correctOptionSection = document.querySelector(".correct-option-section");
    if (type === "quiz") {
      correctOptionSection.style.display = "block";
      this.updateCorrectOptions();
    } else {
      correctOptionSection.style.display = "none";
    }

    console.log("Switched to:", type);
  }

  selectColor(color) {
    this.selectedColor = color;

    // Update active color
    const colorOptions = document.querySelectorAll(".color-option");
    colorOptions.forEach((option) => {
      option.classList.toggle("active", option.dataset.color === color);
    });

    console.log("Selected color:", color);
  }

  selectColor(color) {
    this.selectedColor = color;

    // Update active color
    const colorOptions = document.querySelectorAll(".color-option");
    colorOptions.forEach((option) => {
      option.classList.toggle("active", option.dataset.color === color);
    });

    console.log("Selected color:", color);
  }

  getCurrentTrackData() {
    if (!this.currentTrack) return null;

    const trackItem = document.querySelector(`[data-track="${this.currentTrack}"]`);
    if (!trackItem) return null;

    return {
      id: this.currentTrack,
      name: trackItem.querySelector(".track-name").textContent,
      artist: trackItem.querySelector(".artist-name").textContent,
      duration: trackItem.querySelector(".track-duration").textContent,
      isPlaying: this.isPlaying,
    };
  }

  initializeCanvasControls() {
    document.querySelectorAll(".canvas-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.handleCanvasControl(e.target);
      });
    });
  }

  initializeBottomActions() {
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.deleteCurrentImage();
      });
    });
  }

  initializeGalleryInteractions() {
    const addPhotoBtn = document.querySelector(".add-photo");
    
    // Remove any existing event listeners by cloning and replacing the button
    if (addPhotoBtn) {
      const newAddPhotoBtn = addPhotoBtn.cloneNode(true);
      addPhotoBtn.parentNode.replaceChild(newAddPhotoBtn, addPhotoBtn);
      
      // Add the click listener only once
      newAddPhotoBtn.addEventListener("click", () => {
        this.photoUpload.click();
      });
    }

    const galleryItems = document.querySelectorAll(".gallery-item:not(.add-photo)");
    galleryItems.forEach((item) => {
      const newItem = item.cloneNode(true);
      item.parentNode.replaceChild(newItem, item);

      newItem.addEventListener("click", () => {
        this.selectGalleryItem(newItem);
      });
      
      // Re-add edit and delete button listeners after cloning
      const editBtn = newItem.querySelector('.edit-btn');
      const deleteBtn = newItem.querySelector('.delete-btn');
      
      if (editBtn) {
        editBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.currentEditingItem = newItem;
          this.photoUpload.click();
        });
      }
      
      if (deleteBtn) {
        deleteBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          
          const confirmed = confirm('Are you sure you want to delete this photo?');
          
          if (confirmed) {
            const img = newItem.querySelector('img');
            const imageSrc = img?.src;
            
            newItem.remove();
            
            if (imageSrc) {
              const canvasContainers = document.querySelectorAll('.canvas_editor_container');
              canvasContainers.forEach(container => {
                const canvasImg = container.querySelector('img, video');
                if (canvasImg && canvasImg.src === imageSrc) {
                  container.remove();
                }
              });
            }
          }
        });
      }
    });
  }

  addTag(tagText) {
    const tagsList = document.getElementById("tags-list");
    if (!tagsList) return;

    const tagElement = document.createElement("span");
    tagElement.className = "tag-item";
    tagElement.innerHTML = `${tagText} <button onclick="this.parentElement.remove()">×</button>`;
    tagsList.appendChild(tagElement);
  }

  // Keep all your existing methods...
  handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const type = file.type || "";

    // If it's neither image nor video -> reject
    if (!type.startsWith("image/") && !type.startsWith("video/")) {
      alert("Please select an image or video file.");
      return;
    }

    // Determine category
    const cat = type.startsWith("image/") ? "image" : "video";

    // File greater than 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert("File size too large. Please select an image under 5MB.");
      return;
    }

    // this.showLoadingState();

    const reader = new FileReader();
    reader.onload = (e) => {
      const path = e.target.result;

      // Check if we're editing an existing item
      if (this.currentEditingItem) {
        // Replace the image in the gallery item
        const img = this.currentEditingItem.querySelector('img');
        if (img) {
          const oldSrc = img.src;
          img.src = path;
          
          // Update the canvas container with the same image
          const canvasContainers = document.querySelectorAll('.canvas_editor_container');
          canvasContainers.forEach(container => {
            const canvasImg = container.querySelector('img, video');
            if (canvasImg && canvasImg.src === oldSrc) {
              if (cat === 'image') {
                canvasImg.src = path;
              } else {
                // Replace img with video
                const video = document.createElement('video');
                video.src = path;
                video.classList.add('canvas_editor_video_media');
                video.setAttribute('data-media-id', canvasImg.getAttribute('data-media-id'));
                video.setAttribute('data-media-type', 'video');
                container.replaceChild(video, canvasImg);
              }
            }
          });
        }
        
        // Clear the editing state
        this.currentEditingItem = null;
      } else {
        // Normal upload - add new item
        const newMedia = {
          id: new Date().getTime(),
          type: cat,
          media: path,
        };

        this.storyEditingItems.push(newMedia);
        this.displayUploadedImage(newMedia);
        this.switchToEditingInterface();
      }
    };

    reader.onerror = () => {
      alert("Error reading file. Please try again.");
      this.hideLoadingState();
    };

    reader.readAsDataURL(file);
    
    // Reset the file input so the same file can be selected again
    event.target.value = '';
  }

  // showLoadingState() {
  //   console.log("Loading image...");
  // }

  hideLoadingState() {
    console.log("Loading complete");
  }

  //
  displayUploadedImage(object) {
    let mediaElement;

    // Images ✌️
    if (object.type === "image") {
      const media = document.createElement("img");
      media.src = object.media;
      media.classList.add("canvas_editor_image_media");
      media.alt = `Uploaded image ${object.id}`;
      media.setAttribute("data-media-id", object.id);
      media.setAttribute("data-media-type", "image");
      mediaElement = media;
    } else {
      // Videos ✌️
      const media = document.createElement("video");
      media.src = object.media;
      media.classList.add("canvas_editor_video_media");
      media.alt = `Uploaded video ${object.id}`;
      media.setAttribute("data-media-id", object.id);
      media.setAttribute("data-media-type", "video");
      mediaElement = media;
    }

    const canvasEditorContainer = document.createElement("div");
    canvasEditorContainer.classList.add("canvas_editor_container");
    canvasEditorContainer.setAttribute("data-canvas-media-id", object.id);

    canvasEditorContainer.appendChild(mediaElement);
    this.canvasWrap.appendChild(canvasEditorContainer);

    currentStoryEditingMedia = object;

    this.addImageToGallery(object.media);
  }

  addImageToGallery(imageSrc) {
    const galleryGrid = document.querySelector("#editing-interface .right-gallery .story-gallery-grid");
    const addPhotoBtn = document.querySelector(".add-photo");

    if (galleryGrid && addPhotoBtn) {
      const newGalleryItem = document.createElement("div");
      newGalleryItem.className = "gallery-item";
      newGalleryItem.innerHTML = `
        <div class="gallery-img-wrapper">
          <img src="${imageSrc}" alt="Gallery image">
          <div class="gallery-actions">
            <button class="edit-btn" title="Edit">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83l3.75 3.75l1.83-1.83z"/>
              </svg>
            </button>
            <button class="delete-btn" title="Delete">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z"/>
              </svg>
            </button>
          </div>
        </div>
      `;
      galleryGrid.insertBefore(newGalleryItem, addPhotoBtn);
      
      // Add event listeners for edit and delete buttons
      const editBtn = newGalleryItem.querySelector('.edit-btn');
      const deleteBtn = newGalleryItem.querySelector('.delete-btn');
      
      // Edit button: Open file picker to replace the image
      if (editBtn) {
        editBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          
          // Store reference to the item being edited
          this.currentEditingItem = newGalleryItem;
          
          // Open file picker
          this.photoUpload.click();
        });
      }
      
      // Delete button: Show confirmation and delete
      if (deleteBtn) {
        deleteBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          
          // Show confirmation dialog
          const confirmed = confirm('Are you sure you want to delete this photo?');
          
          if (confirmed) {
            // Find the corresponding canvas container
            const img = newGalleryItem.querySelector('img');
            const imageSrc = img?.src;
            
            // Remove from gallery
            newGalleryItem.remove();
            
            // Remove from canvas
            if (imageSrc) {
              const canvasContainers = document.querySelectorAll('.canvas_editor_container');
              canvasContainers.forEach(container => {
                const canvasImg = container.querySelector('img, video');
                if (canvasImg && canvasImg.src === imageSrc) {
                  container.remove();
                }
              });
            }
          }
        });
      }
      
      this.initializeGalleryInteractions();
    }

    const allDots = document.querySelectorAll(".dots-btn");
    const allDropdowns = document.querySelectorAll(".gallery-dropdown");

    allDots.forEach((dot, i) => {
      dot.addEventListener("click", (e) => {
        e.stopPropagation();
        const dropdown = dot.nextElementSibling;
        allDropdowns.forEach((d) => d.classList.add(HIDDEN)); // Close others
        dropdown.classList.toggle(HIDDEN);
      });
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", () => {
      allDropdowns.forEach((d) => d.classList.add(HIDDEN));
    });
  }

  switchTextStory() {
    // this.uploadInterface.style.opacity = "0";
    setTimeout(() => {
      this.uploadInterface.classList.remove("active");
      this.textStoryInterface.classList.add("active");

      // this.textStoryInterface.style.opacity = "0";
      setTimeout(() => {
        // this.textStoryInterface.style.opacity = "1";
      }, 50);
    }, 300);
  }

  switchToEditingInterface() {
    // this.uploadInterface.style.opacity = "0";

    setTimeout(() => {
      this.uploadInterface.classList.remove("active");
      this.editingInterface.classList.add("active");

      // this.editingInterface.style.opacity = "0";
      setTimeout(() => {
        // this.editingInterface.style.opacity = "1";
      }, 50);
    }, 300);
  }

  switchToUploadInterface() {
    // this.editingInterface.style.opacity = "0";
    // this.textStoryInterface.style.opacity = "0";

    setTimeout(() => {
      this.editingInterface.classList.remove("active");
      this.textStoryInterface.classList.remove("active");

      this.uploadInterface.classList.add("active");

      // Reset to main tool
      this.switchToTool("main");

      this.photoUpload.value = "";

      // this.uploadInterface.style.opacity = "0";
      setTimeout(() => {
        // this.uploadInterface.style.opacity = "1";
      }, 50);
    }, 300);
  }

  selectGalleryItem(item) {
    document.querySelectorAll(".gallery-item").forEach((i) => {
      i.classList.remove("selected");
    });

    item.classList.add("selected");

    const img = item.querySelector("img");
    if (img && img.src) {
      // this.uploadedImage.src = img.src;
      // this.uploadedImage.classList.add("visible");
    }
  }

  handleCanvasControl(button) {
    const buttonText = button.textContent;
    if (buttonText === "📱") {
      console.log("Toggle mobile view");
    } else if (buttonText === "🔄") {
      console.log("Rotate image");
      this.rotateImage();
    }
  }

  rotateImage() {
    const img = this.uploadedImage;
    if (img.src) {
      const currentRotation = img.style.transform || "rotate(0deg)";
      const currentDegrees = Number.parseInt(currentRotation.match(/\d+/) || [0])[0];
      const newDegrees = (currentDegrees + 90) % 360;
      img.style.transform = `rotate(${newDegrees}deg)`;
      img.style.transition = "transform 0.3s ease";
    }
  }

  deleteCurrentImage() {
    if (confirm("Are you sure you want to delete this story?")) {
      this.switchToUploadInterface();
    }
  }

  closeInterface() {
    this.switchToUploadInterface();
  }
}

// Initialize the interface when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new PhotoStoryInterface();
});

/**
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 * Text Story Logic Only 😎 :)
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */
// put this inside your initialize function (close over `this` if needed)
const MIN_PX = 12;
const MAX_PX = 48;
const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;

// small debounce helper
function debounce(fn, wait = 150) {
  let t;
  return function (...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

// map slider (0..100) -> px with quadratic curve for nicer perception
function sliderValueToPx(sliderValue) {
  const pct = sliderValue / 100; // 0..1
  const pctQuad = Math.pow(pct, 1.6); // tweak exponent (1.2-2) to taste
  return MIN_PX + pctQuad * (MAX_PX - MIN_PX);
}

// Convert px to rem for better accessibility
function pxToRem(px) {
  return px / rootFontSize;
}

// requestAnimationFrame guard for smooth UI updates during dragging
let rafId = null;
function applyFontSizeImmediate(el, px) {
  // set CSS variable or direct style; using rem so user scaling works
  el.style.fontSize = pxToRem(px) + "rem";
  // set aria text for screen readers
  el.setAttribute("aria-valuetext", `${Math.round(px)}px`);
}

// Debounced expensive adjustment
const adjustDebounced = debounce((el, ctx) => {
  // call your instance method; ensure correct `this` context
  // if inside class, use something like: this._adjustTextDimensions
  if (typeof ctx._adjustTextDimensions === "function") {
    ctx._adjustTextDimensions(el);
  } else {
    // fallback: measure and nudge
    // console.warn("_adjustTextDimensions not found on context");
  }
}, 120);

class TextStoryLogic {
  constructor() {
    this.typographyTabItem = document.querySelectorAll("button.typography-tab-item");
    this.storyCanvasobjects = document.getElementById("storyCanvasobjects");
    this.storyFontFamilyOptions = document.getElementById("storyFontFamilyOptions");
    this.storyTextColorOptions = document.getElementById("storyTextColorOptions");
    this.textAlignmentPanel = document.getElementById("textAlignmentPanel");
    this.textForeground = document.getElementById("textForeground");
    this.textOnScreenTools = document.getElementById("textOnScreenTools");

    this.isTransitioning = false;
    this.currentTypographyAction = "family";
    this.textStyles = [];

    this._init();
  }

  _init() {
    this._initializeTextTool();
  }

  // Typography
  _initializeTextTool() {
    // Typography Tab - handle all typography action buttons
    document.querySelectorAll("button[data-typography-action]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (this.isTransitioning) return;
        const action = btn.dataset.typographyAction;
        this.switchTypographyAction(action, btn);
      });
    });

    // Initialize all font action content handlers
    this.initializeColorPickerHandlers();
    this.initializeBoldHandlers();
    this.initializeItalicHandlers();
    this.initializeUnderlineHandlers();
    this.initializeStrikethroughHandlers();
    this.initializeLinkHandlers();
    this._initializeTextOnScreenTools();

    // Text input change :)
    const storyTextInput = document.getElementById("storyTextInput");
    storyTextInput.addEventListener("input", (e) => {
      const text = e.target.value;
      this.textOnScreenTools.classList.remove(HIDDEN);
      this.handleTextChange(text);
    });

    // Font Option
    this.storyFontFamilyOptions.addEventListener("click", (e) => {
      const fontOption = e.target.closest("button.font-option");

      if (fontOption) {
        const font = fontOption.dataset.font;
        const { textElement } = this._getActiveTextElement();

        this._handleFontFamily(font, textElement);
        storyFontFamilyOptions.querySelectorAll("button.font-option").forEach((btn) => btn.classList.remove("active"));
        fontOption.classList.add("active");
      }
    });

    // Text Color Option
    this.storyTextColorOptions.addEventListener("click", (e) => {
      const colorOption = e.target.closest("button.color-option");

      if (colorOption) {
        const color = colorOption.dataset.color;

        const { textElement } = this._getActiveTextElement();

        this._handleTextColorChange(color, textElement);
        storyTextColorOptions.querySelectorAll("button.color-option").forEach((btn) => btn.classList.remove("active"));
        colorOption.classList.add("active");
      }
    });

    // Alignment Options
    this.textAlignmentPanel.addEventListener("click", (e) => {
      const alignBtn = e.target.closest("button.font-option");

      if (alignBtn) {
        const { align } = alignBtn.dataset;

        const { textElement } = this._getActiveTextElement();

        this.textAlignmentPanel.querySelectorAll("button").forEach((btn) => btn.classList.remove("active"));
        this._handleTextAlignment(align, textElement);
        alignBtn.classList.add("active");
      }
    });

    // Text Foreground
    this.textForeground.addEventListener("click", (e) => {
      const button = e.target.closest("button.color-option");

      if (button) {
        const { color } = button.dataset;

        const { textElement } = this._getActiveTextElement();

        this.textForeground.querySelectorAll("button").forEach((btn) => btn.classList.remove("active"));
        this._handleTextForeground(color, textElement);
        button.classList.add("active");
      }
    });

    // Initialize first panel
    this.initializeFontActionPanels();
  }

  _getActiveTextElement() {
    const canvasEditorContainer = document.querySelector(`[data-canvas-media-id="${currentStoryEditingMedia.id}"]`);
    let textElement = canvasEditorContainer.querySelector(".story_text_input");
    return { textElement, canvasEditorContainer };
  }

  // Switch Typography Action :)
  async switchTypographyAction(action, btn) {
    // Don't switch if already on this action
    if (this.currentTypographyAction === action) return;

    this.isTransitioning = true;

    // Update button states for typography tab items only
    this.typographyTabItem.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    // Get current and target panels
    const currentPanel = document.querySelector(`[data-typography-content="${this.currentTypographyAction}"]`);
    const targetPanel = document.querySelector(`[data-typography-content="${action}"]`);

    // Update current action
    this.currentTypographyAction = action;

    console.log(action);

    // Handle text styling actions
    if (["bold", "italic", "underline"].includes(action)) {
      const { textElement } = this._getActiveTextElement();

      if (currentPanel) {
        await this._animateOut(currentPanel);
      }
      if (textElement) {
        if (action === "bold") {
          if (this.textStyles.includes(action)) {
            // Remove bold
            this.textStyles = this.textStyles.filter((style) => style !== action);
            btn.classList.remove("active");
            textElement.style.fontWeight = "normal";
            console.log("Removed bold");
          } else {
            // Add bold
            this.textStyles.push(action);
            btn.classList.add("active");
            textElement.style.fontWeight = "bold";
            console.log("Added bold");
          }
        } else if (action === "italic") {
          if (this.textStyles.includes(action)) {
            // Remove italic
            this.textStyles = this.textStyles.filter((style) => style !== action);
            btn.classList.remove("active");
            textElement.style.fontStyle = "normal";
            console.log("Removed italic");
          } else {
            // Add italic
            this.textStyles.push(action);
            btn.classList.add("active");
            textElement.style.fontStyle = "italic";
            console.log("Added italic");
          }
        } else if (action === "underline") {
          if (this.textStyles.includes(action)) {
            // Remove underline
            this.textStyles = this.textStyles.filter((style) => style !== action);
            btn.classList.remove("active");
            textElement.style.textDecoration = "none";
            console.log("Removed underline");
          } else {
            // Add underline
            this.textStyles.push(action);
            btn.classList.add("active");
            textElement.style.textDecoration = "underline";
            console.log("Added underline");
          }
        }

        // Recalculate width after style changes
        // this._adjustTextDimensions(storyTextInput);
      }

      console.log("Current text styles:", this.textStyles);
      this.isTransitioning = false;
      return; // Don't proceed with panel switching for style actions
    }

    console.log(this.currentTypographyAction);

    if (!targetPanel) {
      if (currentPanel) await this._animateOut(currentPanel);
      this.isTransitioning = false;
      return;
    }

    // Animate out current panel if it exists
    if (currentPanel) {
      await this._animateOut(currentPanel);
    }

    // Animate in target panel
    await this._animateIn(targetPanel);

    this.isTransitioning = false;
    console.log("Switched to Typography:", action);
  }

  _animateOut(panel) {
    return new Promise((resolve) => {
      // Add transition
      panel.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";

      // Animate out
      panel.style.opacity = "0";
      panel.style.transform = "translateX(-20px)";

      setTimeout(() => {
        panel.style.display = "none";
        resolve();
      }, 300);
    });
  }

  _animateIn(panel) {
    return new Promise((resolve) => {
      // Set initial state
      panel.style.display = "block";
      panel.style.opacity = "0";
      panel.style.transform = "translateX(20px)";
      panel.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";

      // Force reflow
      panel.offsetHeight;

      // Animate in
      requestAnimationFrame(() => {
        panel.style.opacity = "1";
        panel.style.transform = "translateX(0)";
      });

      setTimeout(() => {
        resolve();
      }, 300);
    });
  }

  // Enhanced Color Picker Handlers with animations
  initializeColorPickerHandlers() {
    // Predefined color options
    document.querySelectorAll('[data-font-content="colorpicker"] .color-option').forEach((color) => {
      color.addEventListener("click", () => {
        // Remove selection from all colors with animation
        document.querySelectorAll('[data-font-content="colorpicker"] .color-option').forEach((c) => {
          c.classList.remove("selected");
          c.style.transform = "scale(1)";
        });

        // Add selection to clicked color with bounce animation
        color.classList.add("selected");
        color.style.transform = "scale(0.9)";
        setTimeout(() => {
          color.style.transform = "scale(1.2)";
          setTimeout(() => {
            color.style.transform = "scale(1.1)";
          }, 100);
        }, 50);

        const selectedColor = color.dataset.color;
        console.log("Selected color:", selectedColor);
        // this.applyTextColor(selectedColor);
        const { textElement } = this._getActiveTextElement();
        this._handleTextColorChange(selectedColor, textElement);
      });
    });

    // Custom color picker
    const customColorPicker = document.getElementById("custom-color-picker");
    const triggerBtn = document.getElementById("color-trigger");

    const triggerTextBgCustomColor = document.getElementById("triggerTextBgCustomColor");
    const textBgCustomColorPicker = document.getElementById("textBgCustomColorPicker");

    triggerBtn.addEventListener("click", () => {
      customColorPicker.click(); // Open the native color picker
    });

    triggerTextBgCustomColor.addEventListener("click", () => {
      textBgCustomColorPicker.click(); // Open the native color picker
    });

    // COLOR
    customColorPicker?.addEventListener("change", (e) => {
      const customColor = e.target.value;
      console.log("Selected custom color:", customColor);
      const { textElement } = this._getActiveTextElement();
      this._handleTextColorChange(customColor, textElement);

      // Add a subtle glow effect
      customColorPicker.style.boxShadow = `0 0 20px ${customColor}40`;
      setTimeout(() => {
        customColorPicker.style.boxShadow = "none";
      }, 1000);
    });

    // BG
    textBgCustomColorPicker?.addEventListener("change", (e) => {
      const customColor = e.target.value;
      const { textElement } = this._getActiveTextElement();
      this._handleTextForeground(customColor, textElement);
    });
  }

  // Enhanced handlers for other font actions
  initializeBoldHandlers() {
    document.querySelectorAll(".weight-option").forEach((option) => {
      option.addEventListener("click", () => {
        this.selectOption(option, ".weight-option");

        const weight = option.dataset.weight;
        console.log("Selected font weight:", weight);
        this.applyFontWeight(weight);
      });
    });
  }

  initializeItalicHandlers() {
    document.querySelectorAll(".style-option").forEach((option) => {
      option.addEventListener("click", () => {
        this.selectOption(option, ".style-option");

        const style = option.dataset.style;
        console.log("Selected font style:", style);
        this.applyFontStyle(style);
      });
    });
  }

  initializeUnderlineHandlers() {
    document.querySelectorAll(".decoration-option").forEach((option) => {
      option.addEventListener("click", () => {
        this.selectOption(option, ".decoration-option");

        const decoration = option.dataset.decoration;
        console.log("Selected text decoration:", decoration);
        this.applyTextDecoration(decoration);
      });
    });
  }

  initializeStrikethroughHandlers() {
    document.querySelectorAll(".strike-option").forEach((option) => {
      option.addEventListener("click", () => {
        this.selectOption(option, ".strike-option");

        const strike = option.dataset.strike;
        console.log("Selected strikethrough:", strike);
        this.applyStrikethrough(strike);
      });
    });
  }

  initializeLinkHandlers() {
    // Link style options
    document.querySelectorAll(".link-style").forEach((style) => {
      style.addEventListener("click", () => {
        this.selectOption(style, ".link-style");

        const linkStyle = style.dataset.linkStyle;
        console.log("Selected link style:", linkStyle);
      });
    });

    // Apply link button with loading animation
    const applyLinkBtn = document.querySelector(".apply-link-btn");
    applyLinkBtn?.addEventListener("click", () => {
      console.log("link");
    });
  }

  initializeFontActionPanels() {
    // Set initial states for all panels
    const panels = document.querySelectorAll(".font-action-content");

    panels.forEach((panel) => {
      if (panel.dataset.fontContent === "family") {
        panel.style.display = "block";
        panel.style.opacity = "1";
        panel.style.transform = "translateX(0)";
      } else {
        panel.style.display = "none";
        panel.style.opacity = "0";
        panel.style.transform = "translateX(20px)";
      }
    });
  }

  _initializeTextOnScreenTools() {
    const thumb = document.getElementById("textOnScreenThumb");
    const track = document.getElementById("textOnScreenTrack");
    const trackInner = document.getElementById("textOnScreenTrackInner");
    const filled = document.getElementById("textOnScreenFilled");
    const sliderWrap = document.getElementById("textOnScreenSlider");
    const deleteCurrentText = document.getElementById("deleteCurrentText");

    const MIN = 0;
    const MAX = 100;
    const STEP = 1; // keyboard step

    let value = 40; // initial value (0-100)
    setUIFromValue(value);

    // utility: clamp
    const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

    // convert clientX to value (0..100) relative to trackInner
    function pointerEventToValue(clientX) {
      const rect = trackInner.getBoundingClientRect();
      const x = clamp(clientX - rect.left, 0, rect.width);
      const pct = rect.width === 0 ? 0 : x / rect.width;
      return Math.round(pct * (MAX - MIN) + MIN);
    }

    function setValue(newValue, { emitEvent = true } = {}) {
      value = clamp(Math.round(newValue), MIN, MAX);
      setUIFromValue(value);
      if (emitEvent) {
        // custom event so outer code can react
        sliderWrap.dispatchEvent(new CustomEvent("sliderchange", { detail: { value } }));
      }
    }

    function setUIFromValue(val) {
      const pct = ((val - MIN) / (MAX - MIN)) * 100;
      thumb.style.left = pct + "%";
      filled.style.width = pct + "%";
      thumb.setAttribute("aria-valuenow", String(val));
      // also update a label if you add one later
    }

    /* ---------- Pointer events: drag + clicking ---------- */
    let dragging = false;

    // pointerdown on thumb -> start dragging
    thumb.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      e.stopPropagation();

      thumb.setPointerCapture(e.pointerId);
      dragging = true;
      document.body.classList.add("dragging");
    });

    // pointermove on document while dragging
    document.addEventListener("pointermove", (e) => {
      if (!dragging) return;

      if (activeEditingTool === "text-typography") {
        // compute new value from clientX and set it
        const newVal = pointerEventToValue(e.clientX);
        setValue(newVal);
      } else if (activeEditingTool === "stickers-gifs") {
        window.stickerStoryLogic._handleStickerSize(e.clientX);
      } else if (activeEditingTool === "drawing-scribbles") {
      }
    });

    // pointerup -> stop dragging
    document.addEventListener("pointerup", (e) => {
      if (!dragging) return;

      dragging = false;
      document.body.classList.remove("dragging");
      try {
        thumb.releasePointerCapture(e.pointerId);
      } catch (_) {}
      // you could dispatch a 'sliderchangeend' event here if needed
    });

    // clicking/tapping the track should move the thumb there
    trackInner.addEventListener("pointerdown", (e) => {
      // If user clicked the thumb earlier, pointerdown on thumb already handled.
      // For click on track, jump the value and optionally start dragging.
      const newVal = pointerEventToValue(e.clientX);
      setValue(newVal);
      // start dragging if they clicked and held
      thumb.focus();
      // capture further pointer moves so the user can drag from the clicked point
      thumb.setPointerCapture(e.pointerId);
      dragging = true;
      document.body.classList.add("dragging");
    });

    // keyboard support: when thumb focused, move with arrows
    thumb.addEventListener("keydown", (e) => {
      let handled = true;
      switch (e.key) {
        case "ArrowLeft":
          setValue(value - STEP);
          break;
        case "ArrowRight":
          setValue(value + STEP);
          break;
        case "Home":
          setValue(MIN);
          break;
        case "End":
          setValue(MAX);
          break;
        case "PageUp":
          setValue(value + 10);
          break;
        case "PageDown":
          setValue(value - 10);
          break;
        default:
          handled = false;
      }
      if (handled) {
        e.preventDefault();
        // short announce could happen here (aria-live elsewhere)
      }
    });

    // expose a small API on the DOM node if you want to control it externally
    sliderWrap.setValue = (v) => setValue(v);
    sliderWrap.getValue = () => value;

    // example: listen to changes
    sliderWrap.addEventListener("sliderchange", (ev) => {
      const { textElement } = this._getActiveTextElement();
      this._handleFontSizeChange(ev.detail.value, thumb, textElement);
    });

    /* handle window resize so thumb stays correct — not strictly required */
    window.addEventListener("resize", () => setUIFromValue(value));

    // Delete
    deleteCurrentText.addEventListener("click", () => {
      const { textElement } = this._getActiveTextElement();

      storyTextInput.value = "";
      textElement.remove();
      this.textOnScreenTools.classList.add(HIDDEN);
    });
  }

  // font family selection
  _handleFontFamily(font, textElement) {
    if (textElement) {
      textElement.style.fontFamily = font;
    }
  }

  _handleTextColorChange(color, textElement) {
    if (textElement) {
      textElement.style.color = color;
    }
  }

  _handleTextAlignment(align, textElement) {
    if (textElement) {
      textElement.style.textAlign = align;
    }
  }

  _handleTextForeground(color, textElement) {
    if (textElement) {
      textElement.style.backgroundColor = color;
    }
  }

  handleTextChange(text) {
    let { textElement, canvasEditorContainer } = this._getActiveTextElement();

    if (!textElement) {
      textElement = this._createElement("div", "story_text_input");
      // textElement.contentEditable = "true";
      textElement.style.border = "none";
      textElement.style.outline = "none";
      textElement.style.background = "transparent";
      textElement.style.fontSize = "16px";
      textElement.style.fontWeight = "normal";
      textElement.style.fontFamily = "Inter";
      textElement.style.color = "#000000";
      textElement.style.textAlign = "center";
      textElement.style.minWidth = "50px";
      textElement.style.maxWidth = "300px"; // Set maximum width for wrapping
      textElement.style.width = "auto";
      textElement.style.padding = "0px 10px";
      textElement.style.boxSizing = "border-box";
      textElement.style.userSelect = "none";
      // textElement.style.position = "relative";
      textElement.style.pointerEvents = "auto";
      textElement.style.whiteSpace = "pre-wrap"; // Allow line breaks and wrapping
      textElement.style.wordWrap = "break-word"; // Break long words if needed
      textElement.style.overflow = "hidden";
      textElement.style.display = "inline-block";
      textElement.style.cursor = "text";
      textElement.style.lineHeight = "1.4"; // Better line spacing
      textElement.style.fontStyle = "normal"; // Ensure initial font style
      textElement.style.textDecoration = "none"; // Ensure initial text decoration
      textElement.style.position = "absolute";
      textElement.style.zIndex = "3";
      textElement.style.left = "10%";
      textElement.style.top = "10%";
      textElement.style.transform = "translate(-50%, -50%)";

      // Add the element to the canvas
      if (canvasEditorContainer) {
        canvasEditorContainer.appendChild(textElement);
        new Interactive()._makeInteractive(textElement); // make it draggable
        this._updateButtonStates();
      } else {
        new Error("Error occured 🚨");
      }
    }

    // Set the content
    if (text && text.trim() !== "") {
      textElement.textContent = text;
      textElement.classList.remove("empty");
    } else {
      textElement.textContent = "";
      textElement.classList.add("empty");
    }
  }

  _updateButtonStates() {
    const { textElement } = this._getActiveTextElement();

    if (!textElement) return;

    // Update bold button state
    const boldBtn = document.querySelector('button[data-typography-action="bold"]');
    if (boldBtn) {
      if (textElement.style.fontWeight === "bold") {
        boldBtn.classList.add("active");
        if (!this.textStyles.includes("bold")) {
          this.textStyles.push("bold");
        }
      } else {
        boldBtn.classList.remove("active");
        this.textStyles = this.textStyles.filter((style) => style !== "bold");
      }
    }

    // Update italic button state
    const italicBtn = document.querySelector('button[data-typography-action="italic"]');
    if (italicBtn) {
      if (textElement.style.fontStyle === "italic") {
        italicBtn.classList.add("active");
        if (!this.textStyles.includes("italic")) {
          this.textStyles.push("italic");
        }
      } else {
        italicBtn.classList.remove("active");
        this.textStyles = this.textStyles.filter((style) => style !== "italic");
      }
    }

    // Update underline button state
    const underlineBtn = document.querySelector('button[data-typography-action="underline"]');
    if (underlineBtn) {
      if (textElement.style.textDecoration === "underline") {
        underlineBtn.classList.add("active");
        if (!this.textStyles.includes("underline")) {
          this.textStyles.push("underline");
        }
      } else {
        underlineBtn.classList.remove("active");
        this.textStyles = this.textStyles.filter((style) => style !== "underline");
      }
    }
  }

  _handlePlaceholder(element) {
    if (element.textContent.trim() === "") {
      element.classList.add("empty");
      if (!element.querySelector(".placeholder")) {
        const placeholder = document.createElement("span");
        placeholder.className = "placeholder";
        placeholder.textContent = "Type here...";
        placeholder.style.color = "#999";
        placeholder.style.pointerEvents = "none";
        placeholder.style.position = "absolute";
        placeholder.style.top = "50%";
        placeholder.style.left = "50%";
        placeholder.style.transform = "translate(-50%, -50%)";
        placeholder.style.whiteSpace = "nowrap";
        placeholder.style.zIndex = "-1";
        element.appendChild(placeholder);
      }
    } else {
      element.classList.remove("empty");
      const placeholder = element.querySelector(".placeholder");
      if (placeholder) {
        placeholder.remove();
      }
    }
  }

  _handleFontSizeChange(fz, thumb, textElement) {
    if (!textElement) return;

    const sliderVal = Number(fz); // 0..100
    const px = sliderValueToPx(sliderVal);

    // Smooth UI update using rAF to avoid layout thrash while dragging
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      applyFontSizeImmediate(textElement, px);
    });

    // For accessibility show immediate numeric feedback in aria-label or a visible label
    thumb.setAttribute("aria-valuetext", `${Math.round(px)}px`);
  }

  _createElement(element, className = "", id = "") {
    const el = document.createElement(element);
    el.className = className;
    el.id = id;
    el.style.touchAction = "none";
    return el;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.textStoryLogic = new TextStoryLogic();
});

/**
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 * Stickers Story Logic Only 😎 :)
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */
class StickerStoryLogic {
  constructor() {
    this.stickerTabs = document.getElementById("stickerTabs");
    this.stickerGrid = document.getElementById("stickerGrid");
    this.stickerTabsBtns = this.stickerTabs.querySelectorAll("button.sticker-tab");
    this.textOnScreenTools = document.getElementById("textOnScreenTools");

    this.TENOR_KEY = "AIzaSyDafY_In1u-AtYUT-dNsDFE0W9FSzuUzz0";
    this.stickersData = []; // { key: "", value: [] },

    this._init();
  }

  //
  _init() {
    this.initializeStickersTool();

    //
    this.stickerGrid.addEventListener("click", (e) => {
      const stickerEl = e.target.closest(".sticker-item");

      if (stickerEl) {
        const sticker = stickerEl.getAttribute("data-sticker");
        this._addStickerToCanvas(sticker);
      }
    });
  }

  //
  async _fetchStickers(query = "all") {
    const res = await fetch(`https://tenor.googleapis.com/v2/search` + `?key=${this.TENOR_KEY}` + `&q=${encodeURIComponent(query)}` + `&limit=30`);
    if (!res.ok) throw new Error(`Tenor API HTTP ${res.status}`);
    const { results } = await res.json();
    return results;
  }

  //
  _getActiveStickerElement() {
    const canvasEditorContainer = document.querySelector(`[data-canvas-media-id="${currentStoryEditingMedia.id}"]`);
    const stickerElement = canvasEditorContainer.querySelector("img.story_sticker_image.active");
    return { stickerElement, canvasEditorContainer };
  }

  //
  _renderStickers(container, stickers = []) {
    container.innerHTML = "";

    stickers.forEach((sticker) => {
      const gifFmt = sticker.media_formats?.gif;
      if (!gifFmt) return; // skip if no gif format

      // pick a stable thumbnail (fall back to the gif itself if necessary)
      const thumbUrl = gifFmt.max_200w?.url || gifFmt.preview_gif?.url || gifFmt.url || null;
      if (!thumbUrl) return; // skip if we really have nothing

      const markup = `
        <div class="sticker-item" data-sticker="${thumbUrl}" role="button" tabindex="0">
          <img src="${thumbUrl}" alt="${sticker.content_description || "sticker"}" style="width: 100%; height: 100%; object-fit: cover; " />
        </div>
      `;
      this.stickerGrid.insertAdjacentHTML("beforeend", markup);
    });
  }

  _renderStickerSkeleton() {
    Array.from({ length: 20 }, (_, i) => i + 1).map(() => {
      this.stickerGrid.insertAdjacentHTML("beforeend", `<div class="skeleton__loading"></div>`);
    });
  }

  //
  initializeStickersTool() {
    // Sticker category tabs 🤨
    this.stickerTabs.addEventListener("click", async (e) => {
      const button = e.target.closest("button.sticker-tab");

      if (button) {
        const { stickerCategory } = button.dataset;
        this._loadStickerCategory(stickerCategory);
      }
    });
  }

  // Tool-specific handler methods
  async _loadStickerCategory(category) {
    this.stickerTabsBtns.forEach((t) => t.classList.remove("active"));
    const button = document.querySelector(`button[data-sticker-category="${category}"]`);
    button.classList.add("active");

    let stickers;

    const stickerCategoryObject = this.stickersData.find((data) => data.key === category);
    if (stickerCategoryObject) {
      stickers = stickerCategoryObject ? stickerCategoryObject.value : [];
    }

    // 🏃 Fetch Stickers 😤 :)
    if (!stickers) {
      console.log("Fetching Stickers 🏃...");
      this._renderStickerSkeleton();
      stickers = await this._fetchStickers(category);
      console.log("Arrived :)");

      // Invalidate Sticker Data 🧑‍💻 :)
      this.stickersData.push({ key: category, value: stickers });
    }

    this._renderStickers(this.stickerGrid, stickers);
  }

  //
  _addStickerToCanvas(sticker) {
    const { canvasEditorContainer } = this._getActiveStickerElement();

    const stickerItem = document.createElement("img");
    stickerItem.src = sticker;
    stickerItem.alt = "Sticker Item";
    stickerItem.classList.add("story_sticker_image", "active");

    canvasEditorContainer.appendChild(stickerItem);
    new Interactive()._makeInteractive(stickerItem, { resizable: true }); // Make element both draggable and resizable
    this.textOnScreenTools.classList.remove(HIDDEN);
  }

  // inside your AddStories class
  _handleStickerSize(clientX) {
    // throttle with RAF to avoid flooding repaints during pointermove
    if (this.__stickerResizeRaf) return;
    this.__stickerResizeRaf = requestAnimationFrame(() => {
      this.__stickerResizeRaf = null;

      // read slider value (0..100)
      const sliderWrap = document.getElementById("textOnScreenSlider");
      const sliderVal =
        sliderWrap && typeof sliderWrap.getValue === "function"
          ? Number(sliderWrap.getValue())
          : (() => {
              const thumb = document.getElementById("textOnScreenThumb");
              return thumb ? Number(thumb.getAttribute("aria-valuenow") || 0) : 0;
            })();

      // sensible config: map slider to scale factor
      const SCALE_MIN = 0.25; // 25% of original
      const SCALE_MAX = 3.0; // 300% of original

      // find active sticker element (try several common patterns)
      const { stickerElement: sticker } = this._getActiveStickerElement();

      if (!sticker) return; // nothing selected

      // ensure the sticker is measurable and positioned relative to an offset parent
      const computed = getComputedStyle(sticker);

      // Record original (natural) dimensions once so scale is always relative to original size
      if (!sticker.dataset.origW || !sticker.dataset.origH) {
        const rect = sticker.getBoundingClientRect();
        sticker.dataset.origW = rect.width;
        sticker.dataset.origH = rect.height;
        // store original position so we could restore if needed
        sticker.dataset.origLeft = sticker.style.left || "";
        sticker.dataset.origTop = sticker.style.top || "";
      }

      const origW = parseFloat(sticker.dataset.origW) || 100;
      const origH = parseFloat(sticker.dataset.origH) || origW;

      // compute new scale from slider (linear mapping)
      const t = Math.max(0, Math.min(100, Number(sliderVal))) / 100;
      const scale = SCALE_MIN + t * (SCALE_MAX - SCALE_MIN);

      const newW = Math.round(origW * scale);
      const newH = Math.round(origH * scale);

      // preserve center: compute center in page coords then set left/top relative to offsetParent
      const rect = sticker.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // offset parent may be container used for capturing; fallback to offsetParent or parentElement
      const offsetParent = sticker.offsetParent || sticker.parentElement || document.body;
      const parentRect = offsetParent.getBoundingClientRect();

      const relLeft = Math.round(centerX - parentRect.left - newW / 2);
      const relTop = Math.round(centerY - parentRect.top - newH / 2);

      // Apply size and position. If sticker uses transforms instead of width/height, adapt accordingly.
      // We prefer changing width/height because it's simpler to serialize; adjust if your stickers use CSS transforms.
      sticker.style.width = newW + "px";
      sticker.style.height = newH + "px";

      // If element is absolutely positioned inside its offset parent, update left/top.
      // Otherwise keep it as-is (some stickers may be in a flow layout).
      const pos = computed.position;
      if (pos === "absolute" || pos === "fixed" || pos === "relative") {
        // for 'relative' we might prefer translate; but absolute is most common for stickers
        sticker.style.left = relLeft + "px";
        sticker.style.top = relTop + "px";
      }

      // keep transform origin centered for better resize behavior
      sticker.style.transformOrigin = "center center";

      // persist current visual values on dataset for later use (save/serialize)
      sticker.dataset.width = newW;
      sticker.dataset.height = newH;
      sticker.dataset.scale = scale.toFixed(3);

      // update any selection UI (handles, bounding box) if you have a helper
      if (typeof this._updateStickerHandles === "function") {
        this._updateStickerHandles(sticker);
      } else {
        // if you keep a selection overlay, try to reposition it quickly:
        const sel = document.querySelector(".sticker-selection");
        if (sel) {
          sel.style.width = newW + "px";
          sel.style.height = newH + "px";
          sel.style.left = relLeft + "px";
          sel.style.top = relTop + "px";
        }
      }
    });

    // Slider :)
    const trackInner = document.getElementById("audioOnScreenTrackInner");
    const sliderWrap = document.getElementById("textOnScreenSlider");
    const MIN = 0;
    const MAX = 100;
    const STEP = 1; // keyboard step

    const rect = trackInner.getBoundingClientRect();
    const x = clamp(clientX - rect.left, 0, rect.width);
    const pct = rect.width === 0 ? 0 : x / rect.width;
    const newValue = Math.round(pct * (MAX - MIN) + MIN);

    let value = clamp(Math.round(newValue), MIN, MAX);
    //  const pct = ((val - MIN) / (MAX - MIN)) * 100;
    //       thumb.style.left = pct + "%";
    //       filled.style.width = pct + "%";
    //       thumb.setAttribute("aria-valuenow", String(val));
    sliderWrap.dispatchEvent(new CustomEvent("sliderchange", { detail: { value } }));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.stickerStoryLogic = new StickerStoryLogic();
});

/**
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 * Audio Story Logic Only 😎 :)
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */
class CircularAudioPlayer {
  constructor({ playerId = "player", progressId = "progress", centerBtnId = "centerBtn", duration = 6.0, radius = 44, musicPath = null } = {}) {
    this.player = document.getElementById(playerId);
    this.progressEl = document.getElementById(progressId);
    this.centerBtn = document.getElementById(centerBtnId);
    this.ringSvg = document.getElementById(progressId.replace("progress", "svg"));
    this.musicPath = musicPath;

    if (!this.player || !this.progressEl || !this.centerBtn) {
      return; // Elements not present; safely no-op
    }

    this.DURATION = duration;
    this.RADIUS = radius;
    this.CIRCUMFERENCE = 2 * Math.PI * this.RADIUS;

    this.audioCtx = null;
    this.audioElement = null;
    this.source = null;
    this.playing = false;
    this.startTime = 0;
    this.offset = 0;
    this.rafId = null;
    this.loadingAudio = false;

    this.progressEl.setAttribute("stroke-dasharray", String(this.CIRCUMFERENCE));
    this._setProgressDash(0);
    this.progressEl.style.transition = "stroke-dashoffset 0.12s linear";

    this._bindEvents();
    this._updateUI();
  }

  _ensureAudio() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (!this.audioElement && this.musicPath) {
      this.audioElement = new Audio(this.musicPath);
      this.audioElement.preload = "metadata";

      // Update duration when metadata is loaded
      this.audioElement.addEventListener("loadedmetadata", () => {
        this.loadingAudio = false;
        this.DURATION = this.audioElement.duration;
        this.CIRCUMFERENCE = 2 * Math.PI * this.RADIUS;
        this.progressEl.setAttribute("stroke-dasharray", String(this.CIRCUMFERENCE));
        console.log(`Audio loaded: ${this.musicPath}, Duration: ${this.DURATION}s`);
      });

      // Handle audio end
      this.audioElement.addEventListener("ended", () => {
        this.playing = false;
        this.offset = 0;
        this._updateUI();
        cancelAnimationFrame(this.rafId);
        this._setProgressDash(1);
      });

      // Handle time updates for progress
      this.audioElement.addEventListener("timeupdate", () => {
        if (this.playing) {
          this._updateProgressVisual();
        }
      });

      // Handle loading errors
      this.audioElement.addEventListener("error", (error) => {
        console.error(`Error loading audio ${this.musicPath}:`, error);
        // Show error state in UI
        this.centerBtn.setAttribute("aria-label", "Error loading audio");
        this.centerBtn.classList.add("error");
      });

      // Handle loading start
      this.audioElement.addEventListener("loadstart", () => {
        this.loadingAudio = true;
        console.log(`Loading audio: ${this.musicPath}`);
      });
    }
  }

  _createSource(startOffset = 0) {
    if (!this.audioElement) return null;

    // Set the current time to the offset
    this.audioElement.currentTime = startOffset;

    // Create audio source from the audio element
    const src = this.audioCtx.createMediaElementSource(this.audioElement);
    src.connect(this.audioCtx.destination);

    return src;
  }

  _play() {
    if (this.loadingAudio) return;

    // Stop all other tracks first
    this._stopAllOtherTracks();

    this._ensureAudio();
    if (this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }

    if (this.audioElement) {
      // Create source if not exists
      if (!this.source) {
        this.source = this._createSource(this.offset);
      }

      // Play the audio
      this.audioElement
        .play()
        .then(() => {
          this.playing = true;
          this.startTime = this.audioElement.currentTime - this.offset;
          this.centerBtn.classList.remove("paused");
          this.centerBtn.classList.add("playing");
          this.centerBtn.setAttribute("aria-pressed", "true");
          this.centerBtn.setAttribute("aria-label", "Pause");

          // Update track playing state
          const musicItem = this.player.closest(".music-item");
          if (musicItem) {
            musicItem.setAttribute("data-playing", "true");
          }

          this._tick();
        })
        .catch((error) => {
          console.error("Error playing audio:", error);
        });
    }
  }

  _stopAllOtherTracks() {
    // Find all other CircularAudioPlayer instances and stop them
    const allMusicItems = document.querySelectorAll(".music-item");
    allMusicItems.forEach((item) => {
      if (item.trackPlayer && item.trackPlayer !== this) {
        item.trackPlayer.pause();
        // Reset UI state
        item.trackPlayer.centerBtn.classList.remove("playing");
        item.trackPlayer.centerBtn.classList.add("paused");
        item.trackPlayer.centerBtn.setAttribute("aria-pressed", "false");
        item.trackPlayer.centerBtn.setAttribute("aria-label", "Play");
        // Update track playing state
        item.setAttribute("data-playing", "false");
      }
    });
  }

  pause() {
    if (!this.audioElement || !this.playing) return;

    try {
      this.audioElement.pause();
      this.offset = this.audioElement.currentTime;
      this.playing = false;
      this.centerBtn.classList.remove("playing");
      this.centerBtn.classList.add("paused");
      this.centerBtn.setAttribute("aria-pressed", "false");
      this.centerBtn.setAttribute("aria-label", "Play");

      // Update track playing state
      const musicItem = this.player.closest(".music-item");
      if (musicItem) {
        musicItem.setAttribute("data-playing", "false");
      }

      cancelAnimationFrame(this.rafId);
      this._updateProgressVisual();
    } catch (error) {
      console.error("Error pausing audio:", error);
    }
  }

  _togglePlay() {
    if (!this.audioCtx) {
      this._play();
      return;
    }
    if (this.playing) this.pause();
    else this._play();
  }

  _setProgressDash(progress) {
    const offsetVal = this.CIRCUMFERENCE * (1 - Math.max(0, Math.min(1, progress)));
    this.progressEl.style.strokeDashoffset = String(offsetVal);
  }

  _updateProgressVisual() {
    let p = 0;
    if (this.playing && this.audioElement) {
      p = Math.min(1, this.audioElement.currentTime / this.DURATION);
    } else {
      p = Math.min(1, this.offset / this.DURATION);
    }
    this._setProgressDash(p);
  }

  _tick() {
    this._updateProgressVisual();
    if (this.playing) {
      this.rafId = requestAnimationFrame(() => this._tick());
    }
  }

  _updateUI() {
    this._updateProgressVisual();
    if (!this.playing) {
      this.centerBtn.classList.remove("playing");
      this.centerBtn.classList.add("paused");
      this.centerBtn.setAttribute("aria-pressed", "false");
      this.centerBtn.setAttribute("aria-label", "Play");
    } else {
      this.centerBtn.classList.remove("paused");
      this.centerBtn.classList.add("playing");
      this.centerBtn.setAttribute("aria-pressed", "true");
      this.centerBtn.setAttribute("aria-label", "Pause");
    }
  }

  _bindEvents() {
    this.centerBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!this.audioCtx) this._ensureAudio();
      this._togglePlay();
    });

    this.centerBtn.addEventListener("keydown", (e) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        this._togglePlay();
      }
    });

    this.player.addEventListener("click", (e) => {
      // Only toggle when clicking the outer ring SVG (not the center button or its icons)
      if (e.target === this.progressEl || (this.ringSvg && e.target.closest("#" + this.ringSvg.id))) {
        if (!this.audioCtx) this._ensureAudio();
        this._togglePlay();
      }
    });
  }
}

class AudioStoryLogic {
  constructor() {
    this.circularPlayer = new CircularAudioPlayer({
      playerId: "player",
      progressId: "progress",
      centerBtnId: "centerBtn",
      duration: 6.0,
      radius: 44,
    });
    this.audioLists = document.getElementById("audioLists");
    this.audioOnScreenTools = document.getElementById("audioOnScreenTools");
    this.audioOnScreenToolsHeader = this.audioOnScreenTools.querySelector("header");

    // Get audios from the helper method
    const audios = this._getOriginalAudios();

    // Shuffle the array and generate random names
    this.shuffledAudios = this._shuffleAndRandomizeNames(audios);
    // Add Category
    this.shuffledAudios = this._assignDefaultCategories(this.shuffledAudios);

    // Search helpers
    this._searchDebounceTimer = null;
    this._debounceDelay = 200; // ms

    this._renderAudios(this.shuffledAudios)
      .catch((error) => {
        console.error("Error rendering audios:", error);
      })
      .then(() => {
        // index after rendering
        this._indexTracks();
      });

    this._bindEvents();
    this._initVolumeControl();
    this._initCategoryFilters();
  }

  _getOriginalAudios() {
    return [
      {
        id: 0,
        name: "Long Life",
        author: "Desmond Okechuku",
        musicPath: "/music/sec.mp3",
        category: "recent",
      },
      {
        id: 1,
        name: "Die For Me",
        author: "Musa Bako",
        musicPath: "/music/cool_down.mp3",
        category: "recommended",
      },
      {
        id: 2,
        name: "Salam Alaikum",
        author: "Baaki Abdullah",
        musicPath: "/music/Salam-Alaikum.mp3",
        category: "popular",
      },
      {
        id: 3,
        name: "Long Life",
        author: "Haneefah Abdullah",
        musicPath: "/music/running_chinese.mp3",
      },
      {
        id: 4,
        name: "Long Life",
        author: "Haneefah Abdullah",
        musicPath: "/music/Asake_-_MMS_feat_Wizkid__Vistanaij.mp3",
      },
      {
        id: 5,
        name: "Long Life",
        author: "Haneefah Abdullah",
        musicPath: "/music/thinking_droplet.mp3",
      },
      {
        id: 6,
        name: "Long Life",
        author: "Haneefah Abdullah",
        musicPath: "/music/water.mp3",
      },
      {
        id: 7,
        name: "Long Life",
        author: "Haneefah Abdullah",
        musicPath: "/music/Asake_-_MMS_feat_Wizkid__Vistanaij.mp3",
      },
      {
        id: 8,
        name: "Long Life",
        author: "Haneefah Abdullah",
        musicPath: "/music/Wizkid_-_Piece_Of_My_Heart_feat_Brent_Faiyaz__Vistanaij.mp3",
      },
      {
        id: 9,
        name: "Long Life",
        author: "Haneefah Abdullah",
        musicPath: "/music/Wizkid-Bad-Girl-feat-Asake.mp3",
      },
      {
        id: 10,
        name: "Long Life",
        author: "Haneefah Abdullah",
        musicPath: "/music/Wizkid-Manya-feat-Mut4y.mp3",
      },
      {
        id: 11,
        name: "Long Life",
        author: "Haneefah Abdullah",
        musicPath: "/music/Davido_feat_someone.mp3",
      },
      {
        id: 12,
        name: "Long Life",
        author: "Haneefah Abdullah",
        musicPath: "/music/Asake_-_MMS_feat_Wizkid__Vistanaij.mp3",
      },
    ];
  }

  _assignDefaultCategories(audios) {
    // simple heuristics: last 4 are "recent", first 4 "popular", others "recommended"
    const total = audios.length;
    return audios.map((a, idx) => {
      if (a.category) return a; // keep existing
      if (idx < 4) a.category = "popular";
      else if (idx >= total - 4) a.category = "recent";
      else a.category = ["recommended", "all"][0]; // recommended by default
      return a;
    });
  }

  _shuffleAndRandomizeNames(audios) {
    // Create a copy to avoid mutating the original
    const shuffled = [...audios];

    // Fisher-Yates shuffle algorithm
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Random track names
    const trackNames = ["Midnight Dreams", "Ocean Waves", "City Lights", "Mountain Echo", "Desert Wind", "Forest Whisper", "Starlight", "Golden Hour", "Silver Lining", "Crystal Clear", "Deep Blue", "Emerald Sky", "Crimson Dawn", "Amber Glow", "Violet Night", "Azure Day", "Golden Sunset", "Silver Moon", "Copper Sunrise", "Platinum Rain"];

    // Random artist names
    const artistNames = ["Alex Rivera", "Maya Chen", "Jordan Blake", "Sofia Rodriguez", "Kai Nakamura", "Zara Thompson", "Liam O'Connor", "Aisha Patel", "Marcus Johnson", "Elena Silva", "Noah Williams", "Isabella Kim", "Gabriel Santos", "Luna Anderson", "Xavier Brown", "Chloe Davis", "Rafael Martinez", "Nova Wilson", "Sebastian Lee", "Aurora Garcia"];

    // Assign random names to shuffled tracks
    return shuffled.map((audio, index) => ({
      ...audio,
      id: index,
      name: trackNames[index % trackNames.length],
      author: artistNames[index % artistNames.length],
    }));
  }

  async _renderAudios(audios = []) {
    this.audioLists.innerHTML = "";

    // Empty Audio found 😥 :)
    if (!audios.length) {
      this.audioLists.insertAdjacentHTML("beforeend", `<h1>No Audio found 😥 :)</h1>`);
      return;
    }

    // Render tracks with actual durations
    for (let index = 0; index < audios.length; index++) {
      const audio = audios[index];

      // Get actual duration or fallback to random
      let duration;
      try {
        duration = await this._getAudioDuration(audio.musicPath);
      } catch (error) {
        duration = this._getRandomDuration();
      }

      // store originals in data attributes for later highlighting / restore
      const markup = `
        <div class="music-item" data-track="${audio.id}" data-playing="false" data-category="${escapeHtml(audio.category || "all")}" data-original-name="${escapeHtml(audio.name)}" data-original-artist="${escapeHtml(audio.author)}" data-search="${escapeHtml((audio.name + " " + audio.author).toLowerCase())}">
          <div class="checked_container">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#8837e9" d="m10.6 13.8l-2.15-2.15q-.275-.275-.7-.275t-.7.275t-.275.7t.275.7L9.9 15.9q.3.3.7.3t.7-.3l5.65-5.65q.275-.275.275-.7t-.275-.7t-.7-.275t-.7.275zM12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22" /></svg>
          </div>

          <div class="track-artwork">
            <div class="artwork-placeholder">
              <!-- prettier-ignore -->
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" /><path fill="#b1b1b1" d="M18.671 3.208A2 2 0 0 1 21 5.18V17a4 4 0 1 1-2-3.465V9.18L9 10.847V18q0 .09-.015.174A3.5 3.5 0 1 1 7 15.337v-8.49a2 2 0 0 1 1.671-1.973zM9 8.82l10-1.667V5.18L9 6.847z" /></g></svg>
            </div>
          </div>

          <div class="track-info">
            <div class="track-name">${escapeHtml(audio.name)}</div>
            <div class="name-duration">
              <div class="artist-name">${escapeHtml(audio.author)}</div>
              <div class="track-duration">${duration}</div>
            </div>
          </div>

          <div class="global_circular_player" id="player-${audio.id}" aria-label="Audio player">
            <!-- SVG circles: one background, one progress -->
            <!-- prettier-ignore -->
            <svg viewBox="0 0 100 100" id="svg-${audio.id}"><circle class="ring-bg" cx="50" cy="50" r="44"></circle><circle class="ring-progress" id="progress-${audio.id}" cx="50" cy="50" r="44" stroke-dasharray="276.4601535159016" stroke-dashoffset="276.4601535159016"></circle></svg>
            <div class="center paused" id="centerBtn-${audio.id}" role="button" tabindex="0" aria-pressed="false" aria-label="Play">
              <span class="icon">
                <svg class="pause-bar" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#8837e9" d="M14 19h4V5h-4M6 19h4V5H6z" /></svg>
                <svg class="play-triangle" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#8837e9" d="M8 5.14v14l11-7z" /></svg>
              </span>
            </div>
          </div>
        </div>
      `;
      this.audioLists.insertAdjacentHTML("beforeend", markup);
    }

    // Initialize play/pause functionality for all tracks
    this._initializeTrackControls();
  }

  _getRandomDuration() {
    const minutes = Math.floor(Math.random() * 4) + 1; // 1-4 minutes
    const seconds = Math.floor(Math.random() * 60); // 0-59 seconds
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  _getAudioDuration(audioPath) {
    return new Promise((resolve) => {
      const audio = new Audio();
      audio.addEventListener("loadedmetadata", () => {
        const duration = audio.duration;
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        resolve(`${minutes}:${seconds.toString().padStart(2, "0")}`);
      });
      audio.addEventListener("error", () => {
        // Fallback to random duration if audio fails to load
        resolve(this._getRandomDuration());
      });
      audio.src = audioPath;
    });
  }

  _initializeTrackControls() {
    // Get all music items
    const musicItems = this.audioLists.querySelectorAll(".music-item");

    musicItems.forEach((item) => {
      const trackId = item.dataset.track;
      const centerBtn = item.querySelector(`#centerBtn-${trackId}`);
      const player = item.querySelector(`#player-${trackId}`);
      const progressEl = item.querySelector(`#progress-${trackId}`);
      const ringSvg = item.querySelector(`#svg-${trackId}`);

      if (!centerBtn || !player || !progressEl || !ringSvg) return;

      // Find the corresponding audio data to get the music path
      const audioData = this._getAudioDataById(trackId);
      if (!audioData) return;

      // Create individual audio player for this track
      const trackPlayer = new CircularAudioPlayer({
        playerId: `player-${trackId}`,
        progressId: `progress-${trackId}`,
        centerBtnId: `centerBtn-${trackId}`,
        duration: 6.0,
        radius: 44,
        musicPath: audioData.musicPath,
      });

      // Store reference to track player
      item.trackPlayer = trackPlayer;

      // immediately try to apply stored volume to this freshly created player
      this._applyVolumeToPlayerIfReady(trackPlayer);

      // Add click event for track selection
      item.addEventListener("click", (e) => {
        // Don't trigger if clicking on player controls
        if (e.target.closest(".global_circular_player")) return;

        this._selectTrack(item);
      });
    });
  }

  _getAudioDataById(trackId) {
    // Use the stored shuffled array so we don't reshuffle each call
    if (!this.shuffledAudios) return null;
    return this.shuffledAudios.find((audio) => audio.id == trackId);
  }

  _indexTracks() {
    // Build a quick index to speed up searches and avoid repeated DOM traversals
    this._trackIndex = Array.from(this.audioLists.querySelectorAll(".music-item")).map((item) => ({
      item,
      text: item.dataset.search || "",
      nameEl: item.querySelector(".track-name"),
      artistEl: item.querySelector(".artist-name"),
      originalName: item.dataset.originalName || item.querySelector(".track-name").textContent,
      originalArtist: item.dataset.originalArtist || item.querySelector(".artist-name").textContent,
    }));
  }

  _selectTrack(trackItem) {
    // Remove selection from all tracks
    document.querySelectorAll(".music-item").forEach((item) => item.classList.remove("selected"));
    // Add selection to clicked track
    trackItem.classList.add("selected");

    const trackName = trackItem.querySelector(".track-name").textContent;
    const artistName = trackItem.querySelector(".artist-name").textContent;

    // this.audioOnScreenTools.classList.add("editing-mode");
    audioOnScreenTools.classList.remove(HIDDEN);
    audioOnScreenTools.querySelector("h3").textContent = trackName;
  }

  // Method to get currently playing track
  getCurrentlyPlayingTrack() {
    const playingItem = document.querySelector('.music-item[data-playing="true"]');
    if (playingItem) {
      return {
        id: playingItem.dataset.track,
        name: playingItem.querySelector(".track-name").textContent,
        author: playingItem.querySelector(".artist-name").textContent,
        duration: playingItem.querySelector(".track-duration").textContent,
      };
    }
    return null;
  }

  // Method to stop all tracks
  stopAllTracks() {
    document.querySelectorAll(".music-item").forEach((item) => {
      if (item.trackPlayer) {
        item.trackPlayer.pause();
      }
      item.setAttribute("data-playing", "false");
    });
  }

  // Debounced search entry point
  _debouncedSearch(query) {
    clearTimeout(this._searchDebounceTimer);
    this._searchDebounceTimer = setTimeout(() => {
      this._searchMusicNow(query.trim());
    }, this._debounceDelay);
  }

  // Immediate search implementation (no debounce)
  _searchMusicNow(query) {
    // Ensure index exists
    if (!this._trackIndex) this._indexTracks();

    const q = (query || "").toLowerCase();

    // Remove any previous "no-results" message
    const existingMsg = document.getElementById("no-results-message");
    if (existingMsg) existingMsg.remove();

    let visibleCount = 0;

    this._trackIndex.forEach((entry) => {
      const { item, text, nameEl, artistEl, originalName, originalArtist } = entry;

      if (!q) {
        // show everything and remove highlights
        item.style.display = "flex";
        nameEl.innerHTML = escapeHtml(originalName);
        artistEl.innerHTML = escapeHtml(originalArtist);
        visibleCount++;
        return;
      }

      if (text.includes(q)) {
        // show and highlight matches
        item.style.display = "flex";
        nameEl.innerHTML = highlightMatches(originalName, q);
        artistEl.innerHTML = highlightMatches(originalArtist, q);
        visibleCount++;
      } else {
        item.style.display = "none";
      }
    });

    if (visibleCount === 0) {
      // show no results
      const msg = document.createElement("div");
      msg.id = "no-results-message";
      msg.className = "no-results";
      msg.textContent = `No results for "${query}"`;
      this.audioLists.appendChild(msg);
    }

    // after search logic finishes:
    if (this._currentCategory && this._currentCategory !== "all") {
      this._applyCategoryFilter(this._currentCategory);
    }
  }

  _searchMusic(query) {
    // store the current search so category filtering can reuse it
    this._currentSearchQuery = query || "";
    // public wrapper kept for backward compatibility
    this._debouncedSearch(query);
  }

  _bindEvents() {
    // Search functionality
    const musicSearch = document.getElementById("musicSearch");
    if (musicSearch) {
      musicSearch.addEventListener("input", (e) => {
        this._debouncedSearch(e.target.value);
      });

      // Enter selects and plays first visible item
      musicSearch.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          const firstVisible = this.audioLists.querySelector(".music-item:not([style*='display: none'])");
          if (firstVisible) {
            // select it
            this._selectTrack(firstVisible);
            // try to play if trackPlayer exists
            if (firstVisible.trackPlayer && typeof firstVisible.trackPlayer.play === "function") {
              firstVisible.trackPlayer.play();
              firstVisible.setAttribute("data-playing", "true");
            } else {
              // fallback: simulate click on its center button
              const center = firstVisible.querySelector(".global_circular_player .center");
              if (center) center.click();
            }
          }
        }
      });
    }

    // Optional clear button with id="musicSearchClear"
    const clearBtn = document.getElementById("musicSearchClear");
    if (clearBtn && musicSearch) {
      clearBtn.addEventListener("click", () => {
        musicSearch.value = "";
        this._searchMusicNow("");
      });
    }

    this.audioOnScreenToolsHeader.addEventListener("click", () => {
      this.audioOnScreenTools.classList.toggle("editing-mode");
    });
  }

  /* ---------- Category filtering helpers ---------- */
  _initCategoryFilters() {
    // container of buttons
    this._categoryWrap = document.getElementById("musicCategory");
    if (!this._categoryWrap) return;

    // current selected category
    this._currentCategory = "all";

    // set ARIA role to be more accessible (tablist)
    this._categoryWrap.setAttribute("role", "tablist");

    // attach click handler to buttons (event delegation)
    this._categoryWrap.addEventListener("click", (e) => {
      const btn = e.target.closest(".music-category");
      if (!btn) return;

      // determine category
      const category = btn.dataset.musicCategory || btn.getAttribute("data-music-category");
      if (!category) return;

      // update UI & apply filter
      this._setActiveCategoryButton(btn);
      this._applyCategoryFilter(category);
    });

    // keyboard accessibility: left/right to move between buttons, Enter/Space to activate
    this._categoryWrap.addEventListener("keydown", (e) => {
      const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
      if (!keys.includes(e.key)) return;
      e.preventDefault();

      const buttons = Array.from(this._categoryWrap.querySelectorAll(".music-category"));
      if (!buttons.length) return;

      let idx = buttons.findIndex((b) => b.classList.contains("active"));
      if (idx === -1) idx = 0;

      if (e.key === "ArrowLeft") idx = Math.max(0, idx - 1);
      if (e.key === "ArrowRight") idx = Math.min(buttons.length - 1, idx + 1);
      if (e.key === "Home") idx = 0;
      if (e.key === "End") idx = buttons.length - 1;

      const target = buttons[idx];
      if (target) {
        target.focus();
        target.click(); // reuse click handling
      }
    });

    // Ensure initial active button is respected
    const initial = this._categoryWrap.querySelector(".music-category.active");
    if (initial) {
      this._setActiveCategoryButton(initial);
      this._currentCategory = initial.dataset.musicCategory || initial.getAttribute("data-music-category") || "all";
    } else {
      // pick first button as default
      const first = this._categoryWrap.querySelector(".music-category");
      if (first) {
        this._setActiveCategoryButton(first);
        this._currentCategory = first.dataset.musicCategory || first.getAttribute("data-music-category") || "all";
      }
    }
  }

  /* updates the active class for the tab buttons (ARIA + visual) */
  _setActiveCategoryButton(btn) {
    const buttons = Array.from(this._categoryWrap.querySelectorAll(".music-category"));
    buttons.forEach((b) => {
      b.classList.toggle("active", b === btn);
      b.setAttribute("aria-pressed", String(b === btn));
      b.setAttribute("tabindex", b === btn ? "0" : "-1");
    });
  }

  /* Applies the category filter and respects any current search query */
  _applyCategoryFilter(category) {
    this._currentCategory = category || "all";

    // If we have a search query active, reuse it; else empty string
    const currentSearch = this._currentSearchQuery || "";

    // iterate items and show/hide based on both category + search
    const items = Array.from(this.audioLists.querySelectorAll(".music-item"));
    let visibleCount = 0;
    items.forEach((item) => {
      const itemCategory = item.dataset.category || "all";
      const matchesCategory = this._currentCategory === "all" || itemCategory === this._currentCategory;

      // search check: reuse the existing per-item data-search attribute (lowercased name+author)
      const q = (currentSearch || "").trim().toLowerCase();
      const text = item.dataset.search || "";
      const matchesSearch = !q || text.includes(q);

      if (matchesCategory && matchesSearch) {
        item.style.display = "flex";
        visibleCount++;
      } else {
        item.style.display = "none";
      }
    });

    // optionally show "no results" UI (reuse existing pattern)
    const existingMsg = document.getElementById("no-results-message");
    if (existingMsg) existingMsg.remove();

    if (visibleCount === 0) {
      const msg = document.createElement("div");
      msg.id = "no-results-message";
      msg.className = "no-results";
      msg.textContent = `No tracks in "${this._currentCategory}"${currentSearch ? ` matching "${currentSearch}"` : ""}`;
      this.audioLists.appendChild(msg);
    }
  }

  /**
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   * Audio Handlers
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   */
  _initVolumeControl() {
    // DOM elements (from your provided markup)
    this._vol = {
      wrap: document.querySelector(".audio_on_screen_slider_wrap"),
      slider: document.getElementById("audioOnScreenSlider"),
      track: document.getElementById("audioOnScreenTrack"),
      trackInner: document.getElementById("audioOnScreenTrackInner"),
      filled: document.getElementById("audioOnScreenFilled"),
      thumb: document.getElementById("audioOnScreenThumb"),
    };

    if (!this._vol.slider || !this._vol.track || !this._vol.filled || !this._vol.thumb) {
      // DOM not ready — bail quietly
      return;
    }

    // configuration
    this._volumeKey = "audioVolume";
    this._volumeStep = 0.05; // keyboard step
    this._min = 0;
    this._max = 1;

    // Load saved volume or default to 0.8
    const saved = parseFloat(localStorage.getItem(this._volumeKey));
    this._currentVolume = !Number.isNaN(saved) ? clamp(saved, 0, 1) : 0.8;
    // initialize UI
    this._updateVolumeUI(this._currentVolume);
    // apply volume to any already-created track players
    this._applyVolumeToAllPlayers(this._currentVolume);

    // pointer and keyboard handling
    this._isPointerDown = false;

    // Pointer down on thumb
    // this._vol.thumb.addEventListener("pointerdown", (ev) => {
    //   ev.preventDefault();
    //   this._isPointerDown = true;
    //   this._vol.thumb.setPointerCapture(ev.pointerId);
    //   this._onVolumePointerMove(ev);
    // });

    // // pointer move on track (drag or click)
    // this._vol.track.addEventListener("pointermove", (ev) => {
    //   if (!this._isPointerDown) return;
    //   this._onVolumePointerMove(ev);
    // });

    // // pointer up (anywhere on document to release)
    // document.addEventListener("pointerup", (ev) => {
    //   if (!this._isPointerDown) return;
    //   this._isPointerDown = false;
    //   try {
    //     this._vol.thumb.releasePointerCapture(ev.pointerId);
    //   } catch (e) {}
    //   // commit to storage already done in _setVolume
    // });

    // --- drag bindings that work reliably across browsers ---
    // create bound handlers so we can add/remove them
    this._onPointerMoveBound = this._onVolumePointerMove.bind(this);
    this._onDocumentPointerUpBound = (ev) => {
      if (!this._isPointerDown) return;
      this._isPointerDown = false;

      // release pointer capture if possible
      try {
        if (typeof this._activePointerId !== "undefined") {
          this._vol.thumb.releasePointerCapture(this._activePointerId);
          delete this._activePointerId;
        }
      } catch (e) {}

      // remove listeners added during drag
      document.removeEventListener("pointermove", this._onPointerMoveBound);
      document.removeEventListener("pointerup", this._onDocumentPointerUpBound);
    };

    // start dragging from the thumb
    this._vol.thumb.addEventListener("pointerdown", (ev) => {
      ev.preventDefault();
      this._isPointerDown = true;
      this._activePointerId = ev.pointerId;
      try {
        this._vol.thumb.setPointerCapture(ev.pointerId);
      } catch (e) {
        // ignore if not supported
      }

      // ensure we get pointermove events regardless of which element is under the pointer
      document.addEventListener("pointermove", this._onPointerMoveBound);
      document.addEventListener("pointerup", this._onDocumentPointerUpBound);

      // handle immediate move (so clicking the thumb also positions)
      this._onVolumePointerMove(ev);
    });

    // pointermove on track is still useful for clicks, but dragging is handled above
    this._vol.track.addEventListener("pointermove", (ev) => {
      // only handle when pointer isn't dragging the thumb (optional)
      if (this._isPointerDown) return;
      // no-op: dragging handled by document listener; we keep this for hover/cursor reasons
    });

    // pointerclick on track remains unchanged (jump to position)
    this._vol.track.addEventListener("click", (ev) => {
      this._onVolumePointerMove(ev);
    });

    // keyboard navigation (thumb has role=slider in your markup)
    this._vol.thumb.addEventListener("keydown", (ev) => {
      let changed = false;
      if (ev.key === "ArrowLeft" || ev.key === "ArrowDown") {
        this._setVolume(clamp(this._currentVolume - this._volumeStep, 0, 1));
        changed = true;
      } else if (ev.key === "ArrowRight" || ev.key === "ArrowUp") {
        this._setVolume(clamp(this._currentVolume + this._volumeStep, 0, 1));
        changed = true;
      } else if (ev.key === "Home") {
        this._setVolume(0);
        changed = true;
      } else if (ev.key === "End") {
        this._setVolume(1);
        changed = true;
      } else if (ev.key === "PageDown") {
        this._setVolume(clamp(this._currentVolume - this._volumeStep * 5, 0, 1));
        changed = true;
      } else if (ev.key === "PageUp") {
        this._setVolume(clamp(this._currentVolume + this._volumeStep * 5, 0, 1));
        changed = true;
      }

      if (changed) {
        ev.preventDefault();
        // keep thumb in focus; aria-valuenow updated in _updateVolumeUI
      }
    });

    // When user selects a track we sync UI with its actual audio volume (if present)
    // Hook into your select logic: _selectTrack already exists — we'll wrap it here
    const originalSelect = this._selectTrack?.bind(this) ?? null;
    this._selectTrack = (trackItem) => {
      // call original behavior
      if (originalSelect) originalSelect(trackItem);
      // then sync volume with current track if audio exists
      this._syncVolumeWithCurrentTrack();
    };

    // Also observe when new track players are initialized and set their volume
    // (assumes your code sets item.trackPlayer)
    const observer = new MutationObserver(() => {
      // whenever DOM changes, apply stored volume to players that might have been created
      this._applyVolumeToAllPlayers(this._currentVolume);
    });
    observer.observe(this.audioLists, { childList: true, subtree: true });

    // expose helper so other code can call it
    this._syncVolumeWithCurrentTrack();
  }

  /* Called whenever we want to make the slider reflect the currently selected/playing audio element */
  _syncVolumeWithCurrentTrack() {
    const audioEl = this._getAudioElementForCurrentTrack();
    if (audioEl) {
      // if audio element exists use its volume; otherwise use stored
      const vol = clamp(parseFloat(audioEl.volume), 0, 1);
      this._currentVolume = Number.isFinite(vol) ? vol : this._currentVolume;
      this._updateVolumeUI(this._currentVolume);
      // ensure we persist the current audio's volume (so next tracks inherit)
      localStorage.setItem(this._volumeKey, String(this._currentVolume));
    } else {
      // nothing found — just update UI from stored value
      this._updateVolumeUI(this._currentVolume);
    }
  }

  /* Try to find an HTMLAudioElement for the currently selected/playing track */
  /* Try to find an HTMLAudioElement for the currently selected/playing track */
  _getAudioElementForCurrentTrack() {
    // prefer the item which has data-playing="true"
    const playingItem = document.querySelector('.music-item[data-playing="true"]') || document.querySelector(".music-item.selected");
    if (!playingItem) return null;

    // If the trackPlayer reference was stored on item, use it
    const player = playingItem.trackPlayer;
    if (player) {
      // support multiple possible property names (audio, _audio, audioElement)
      if (player.audio instanceof HTMLMediaElement) return player.audio;
      if (player._audio instanceof HTMLMediaElement) return player._audio;
      if (player.audioElement instanceof HTMLMediaElement) return player.audioElement; // <- important
      // some impls keep a container element exposing <audio>
      if (player.el && player.el.querySelector) {
        const a = player.el.querySelector("audio");
        if (a) return a;
      }
    }

    // final fallback: look inside the DOM for an audio element attached to this track
    const audioEl = playingItem.querySelector("audio");
    if (audioEl) return audioEl;

    return null;
  }

  /* Apply a volume value to all track players that expose an audio element */
  _applyVolumeToAllPlayers(volume) {
    // store to localStorage
    localStorage.setItem(this._volumeKey, String(volume));
    this._currentVolume = volume;

    // apply to existing .music-item elements' trackPlayer.audio if present
    document.querySelectorAll(".music-item").forEach((item) => {
      const p = item.trackPlayer;
      if (!p) return;
      // look for all common property names including audioElement
      const a = p.audio || p._audio || p.audioElement || (p.el && p.el.querySelector && p.el.querySelector("audio"));
      if (a && a instanceof HTMLMediaElement) {
        try {
          a.volume = volume;
        } catch (e) {}
      }
    });
  }

  /* Set volume from UI interactions */
  _setVolume(volume) {
    volume = clamp(Number(volume), 0, 1);
    this._currentVolume = volume;
    // update UI
    this._updateVolumeUI(volume);
    // apply to current audio element (if any) and all future players
    const activeAudio = this._getAudioElementForCurrentTrack();
    if (activeAudio) {
      try {
        activeAudio.volume = volume;
      } catch (e) {}
    }
    // also apply to all players so background players stay in sync
    this._applyVolumeToAllPlayers(volume);
  }

  /* Update the slider/fill/thumb/aria */
  _updateVolumeUI(volume) {
    const pct = Math.round(volume * 100);
    if (!this._vol || !this._vol.filled || !this._vol.thumb) return;
    // set width of fill and thumb position
    this._vol.filled.style.width = pct + "%";
    this._vol.thumb.style.left = `calc(${pct}%)`; // 8px to center thumb; adjust if your thumb size differs
    // update aria on thumb
    this._vol.thumb.setAttribute("aria-valuenow", String(pct));
    this._vol.thumb.setAttribute("aria-valuetext", `${pct}%`);
  }

  /* Convert pointer event to volume and set it */
  _onVolumePointerMove(ev) {
    const rect = this._vol.track.getBoundingClientRect();
    const clientX = ev.clientX ?? (ev.touches && ev.touches[0] && ev.touches[0].clientX) ?? 0;
    const x = clamp(clientX - rect.left, 0, rect.width);
    const pct = rect.width > 0 ? x / rect.width : 0;
    // debug:
    this._setVolume(pct);
  }

  /* Utility: apply stored volume when a brand new trackPlayer is created */
  _applyVolumeToPlayerIfReady(trackPlayer) {
    if (!trackPlayer) return;
    const a = trackPlayer.audio || trackPlayer._audio || trackPlayer.audioElement || (trackPlayer.el && trackPlayer.el.querySelector && trackPlayer.el.querySelector("audio"));
    if (a && a instanceof HTMLMediaElement) {
      try {
        a.volume = this._currentVolume;
      } catch (e) {}
      // optional: listen for its volume changes to reflect in UI
      // a.addEventListener('volumechange', () => this._updateVolumeUI(a.volume));
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.audioStoryLogic = new AudioStoryLogic();
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class AddStories {
  constructor() {
    this._init();
  }

  _init() {
    // Export Media :)
    const addMediaCanvasToStory = document.getElementById("addMediaCanvasToStory");
    addMediaCanvasToStory.addEventListener("click", () => {
      const storyEditingCanvasOverlays = document.querySelectorAll(".story_editing_canvas_overlay");

      storyEditingCanvasOverlays.forEach((overlay) => {
        overlay.classList.add(HIDDEN);
      });

      const output = this._exportAllManual();

      console.log(output);
    });
  }

  // helper: wrap text with simple word-wrap
  drawWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(/\s+/);
    let line = "";
    let testLine;
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
      testLine = line + (line ? " " : "") + words[n];
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && line) {
        ctx.fillText(line, x, currentY);
        currentY += lineHeight;
        line = words[n];
      } else {
        line = testLine;
      }
    }
    if (line) ctx.fillText(line, x, currentY);
    return currentY;
  }

  async exportContainerManually(container) {
    const containerRect = container.getBoundingClientRect();
    const outW = Math.round(containerRect.width);
    const outH = Math.round(containerRect.height);

    const off = document.createElement("canvas");
    off.width = outW;
    off.height = outH;
    const ctx = off.getContext("2d");

    // 1) draw background (optional)
    const bg = window.getComputedStyle(container).backgroundColor;
    if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, outW, outH);
    }

    // 2) draw the base image (assume first media child is img or video)
    const imgEl = container.querySelector('img[data-media-type="image"], img.canvas_editor_image_media, img');
    if (imgEl) {
      // ensure image is loaded and CORS-safe
      if (!imgEl.complete) await new Promise((res) => (imgEl.onload = res));
      // Draw image scaled to container
      // If you need object-fit behavior, compute fit/cover logic here.
      ctx.drawImage(imgEl, 0, 0, outW, outH);
    } else {
      // if video or no media, you could draw a placeholder
    }

    // 3) draw overlay images (stickers etc). We'll select by class .sticker or any img.overlay
    const overlayImgs = container.querySelectorAll("img.sticker, img.overlay, .sticker img");
    for (const o of overlayImgs) {
      if (!o.complete) await new Promise((res) => (o.onload = res));
      const r = o.getBoundingClientRect();
      const x = Math.round(r.left - containerRect.left);
      const y = Math.round(r.top - containerRect.top);
      const w = Math.round(r.width);
      const h = Math.round(r.height);
      ctx.drawImage(o, x, y, w, h);
    }

    // 4) draw text overlays (your .story_text_input nodes)
    const textEls = container.querySelectorAll(".story_text_input");
    for (const te of textEls) {
      const r = te.getBoundingClientRect();
      const x = r.left - containerRect.left;
      const y = r.top - containerRect.top;

      const cs = getComputedStyle(te);

      // set font
      const fontSize = parseFloat(cs.fontSize) || 16;
      const fontFamily = cs.fontFamily || "sans-serif";
      const fontWeight = cs.fontWeight || "normal";
      const fontStyle = cs.fontStyle || "normal";
      ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;

      // fill style
      ctx.fillStyle = cs.color || "#000";

      // background if any
      if (cs.backgroundColor && cs.backgroundColor !== "rgba(0, 0, 0, 0)" && cs.backgroundColor !== "transparent") {
        ctx.fillStyle = cs.backgroundColor;
        ctx.fillRect(x, y, r.width, r.height);
        // reset fillStyle back to text color
        ctx.fillStyle = cs.color || "#000";
      }

      // alignment
      const align = cs.textAlign || "left";
      if (align === "center") ctx.textAlign = "center";
      else if (align === "right") ctx.textAlign = "right";
      else ctx.textAlign = "left";

      // vertical baseline - we'll use top to make wrapping easier
      ctx.textBaseline = "top";

      // wrapping / multi-line
      const paddingLeft = parseFloat(cs.paddingLeft) || 0;
      const paddingTop = parseFloat(cs.paddingTop) || 0;
      const textX = x + paddingLeft + (ctx.textAlign === "center" ? r.width / 2 : 0);
      const textY = y + paddingTop;
      const maxWidth = r.width - (paddingLeft + (parseFloat(cs.paddingRight) || 0));
      const lineHeight = parseFloat(cs.lineHeight) || fontSize * 1.2;
      ctx.fillStyle = cs.color || "#000";

      // if you have explicit newlines:
      const textContent = te.textContent || "";
      // draw wrapped text
      this.drawWrappedText(ctx, textContent, textX, textY, maxWidth, lineHeight);
    }

    // return blob or dataUrl
    const blob = await new Promise((res) => off.toBlob(res, "image/png"));
    const dataUrl = off.toDataURL("image/png");
    return { blob, dataUrl, width: outW, height: outH };
  }

  async exportAllContainersWithHtml2Canvas() {
    const containers = document.querySelectorAll("#canvasWrap .canvas_editor_container");
    const results = []; // {id, blob, dataUrl}

    for (const c of containers) {
      // optionally hide UI controls (buttons etc) before capture
      const id = c.getAttribute("data-canvas-media-id") || Date.now();

      // force any overlays visible/hidden toggles you want here

      const canvas = await html2canvas(c, {
        useCORS: true, // try to avoid tainting for remote images
        logging: false,
        scale: window.devicePixelRatio || 1,
      });
      const dataUrl = canvas.toDataURL("image/png");
      // convert to blob if needed
      const blob = await new Promise((res) => canvas.toBlob(res, "image/png"));
      results.push({ id, blob, dataUrl });
    }

    // example: download them one-by-one
    results.forEach((r, i) => this.downloadBlob(r.blob, `story-${r.id || i}.png`));
    // or return results for further processing
    return results;
  }

  downloadBlob(blob, filename) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async _exportAllManual() {
    const containers = document.querySelectorAll("#canvasWrap .canvas_editor_container");
    const outputs = [];

    for (const c of containers) {
      // const exported = await this.exportContainerManually(c);
      const exported = await this.exportAllContainersWithHtml2Canvas();

      outputs.push({ id: c.dataset.canvasMediaId || Date.now(), ...exported });
      // optional: download immediately:
      // this.downloadBlob(exported.blob, `story-${c.dataset.canvasMediaId || Date.now()}.png`);
    }
    return outputs;
  }
}

new AddStories();
