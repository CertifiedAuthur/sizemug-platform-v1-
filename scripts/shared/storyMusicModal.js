/* Story Music modal (reusable)
   Extracted from scripts/explore/addStoryModal.js, but kept self-contained.
*/

(function () {
  function escapeHtml(str) {
    if (typeof str !== "string") return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function initStoryMusicModalUi() {
    const modalRoot = document.getElementById("storyMusicModal");
    if (!modalRoot) return null;

    if (modalRoot.dataset.storyMusicInitialized === "true" && window.StoryMusicModal) {
      return window.StoryMusicModal;
    }
    modalRoot.dataset.storyMusicInitialized = "true";

    // Ensure the modal overlay is not trapped inside a transformed/stacking-context container.
    if (modalRoot.parentElement && modalRoot.parentElement !== document.body) {
      document.body.appendChild(modalRoot);
    }

    const backdrop = modalRoot.querySelector(".story-music-modal__backdrop");

    // --- Local library (repo audio) ---
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
      const lower = title.toLowerCase();
      const generic = ["sec", "cool down", "running", "thinking", "water"].some((k) => lower.includes(k));
      if (generic) return "Sizemug Sounds";

      const sepMatch = title.match(/^(.*?)\s+-\s+/);
      if (sepMatch?.[1]) return sepMatch[1].trim();

      const featMatch = title.match(/^(.*?)\s+feat\b/i);
      if (featMatch?.[1]) return featMatch[1].trim();

      const first = title.split(" ").slice(0, 2).join(" ").trim();
      return first || "Sizemug Sounds";
    }

    function inferFeaturedArtistNamesFromTitle(title) {
      const raw = String(title || "");
      const m = raw.match(/\b(?:feat|ft|featuring)\.?\s+(.+)$/i);
      if (!m?.[1]) return [];

      let tail = m[1]
        .replace(/\b(vistanaij|official|video|audio|remix|mix|edit)\b.*$/i, "")
        .trim();
      if (!tail) return [];

      const parts = tail
        .split(/\s*(?:,|&|\+|x|\band\b)\s*/i)
        .map((p) => p.replace(/[()\[\]]/g, "").trim())
        .filter(Boolean);

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

    function coverForFile(file) {
      const base = String(file || "").replace(/\.mp3$/i, "");
      const KNOWN_COVER_BASES = new Set([
        "Asake_-_MMS_feat_Wizkid__Vistanaij",
        "Davido_feat_someone",
        "Wizkid-Bad-Girl-feat-Asake",
        "Wizkid-Manya-feat-Mut4y",
        "Wizkid_-_Piece_Of_My_Heart_feat_Brent_Faiyaz__Vistanaij",
      ]);

      if (base && KNOWN_COVER_BASES.has(base)) return `./images/${base}.jpg`;
      return "./images/stories/story_image_10.jpg";
    }

    function artistAssetByName(name) {
      const n = String(name || "").toLowerCase();

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
        artistName,
        featuredArtistIds,
        duration,
        posts,
        likes,
        categoryId,
        audioSrc: `./music/${file}`,
        coverSrc: coverForFile(file),
      };
    });

    const musicLibrary = {
      categories: CATEGORY_DEFS,
      artists: Array.from(artistMap.values()),
      tracks: tracksLocal,
    };

    const state = {
      activeTab: "for-you",
      viewByTab: {
        "for-you": (document.getElementById("storyMusicViewToggle")?.getAttribute("data-view") || "list").toLowerCase(),
        "categories": "list",
        "artists": "list",
        "favorites": "list"
      },
      query: "",
      favorites: new Set(),
      favoriteArtists: new Set(),
      route: { mode: "root", type: null, id: null },
      playingTrackId: null,
      isPlaying: false,
      favoritesSort: "music",
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

      const hideTopToggle =
        state.activeTab === "categories" ||
        state.activeTab === "artists" ||
        state.route.mode === "category" ||
        state.route.mode === "artist";
      btn.style.display = hideTopToggle ? "none" : "";

      const toListIcon =
        '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z"/></svg>';
      const toGridIcon =
        '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/></svg>';

      const currentView = state.viewByTab[state.activeTab];
      if (!hideTopToggle) {
        btn.innerHTML = currentView === "grid" ? toListIcon : toGridIcon;
        btn.setAttribute("aria-label", currentView === "grid" ? "Switch to list" : "Switch to grid");
      }

      modalRoot.querySelectorAll(".story-music-view-toggle-btn").forEach((drillBtn) => {
        drillBtn.setAttribute("data-view", currentView);
      });
    }

    const elForYouList = document.getElementById("storyMusicForYouList");
    const elCategoriesGrid = document.getElementById("storyMusicCategoriesGrid");
    const elArtistsList = document.getElementById("storyMusicArtistsList");
    const elFavoritesList = document.getElementById("storyMusicFavoritesList");
    const elFavoritesEmpty = document.getElementById("storyMusicFavoritesEmpty");
    const elFavControls = document.getElementById("storyMusicFavControls");

    const audio = new Audio();
    audio.preload = "none";

    const artistById = (id) => musicLibrary.artists.find((a) => a.id === id);
    const categoryById = (id) => musicLibrary.categories.find((c) => c.id === id);

    const escapeAttr = (v) => String(v ?? "").replace(/&/g, "&amp;").replace(/"/g, "&quot;");

    function imgOnErrorHide(el) {
      if (!el) return;
      el.style.display = "none";
      const parent = el.parentElement;
      if (parent) parent.classList.add("is-fallback");
    }
    window.imgOnErrorHide = imgOnErrorHide;

    function safeAudioSrc(src) {
      const s = String(src || "").trim();
      if (!s) return "";
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
      const featuredNames = (track.featuredArtistIds || [])
        .map((id) => artistById(id)?.name || "")
        .join(" ");
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
            if (aMain !== bMain) return aMain ? -1 : 1;
            return String(a.title || "").localeCompare(String(b.title || ""));
          });
      }

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
      if (state.route.mode === "category") return elCategoriesGrid;
      if (state.route.mode === "artist") return elArtistsList;
      return elForYouList;
    }

    function applySearchFilterToHost(host) {
      if (!host) return;
      const term = String(state.query || "").toLowerCase().trim();
      host.querySelectorAll("[data-track-id]").forEach((el) => {
        const hay = (el.getAttribute("data-search") || el.textContent || "").toLowerCase();
        el.style.display = !term || hay.includes(term) ? "" : "none";
      });
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

      if (state.playingTrackId && state.playingTrackId !== trackId) {
        stopPlayback();
      }

      if (!state.playingTrackId) {
        state.playingTrackId = trackId;
        audio.src = safeAudioSrc(track.audioSrc);
        try {
          audio.load();
        } catch {
          // ignore
        }
        audio.currentTime = 0;
      }

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
          .catch(() => {
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
      stopPlayback();
      render();
    });

    function toggleFavorite(trackId) {
      const id = String(trackId);
      if (state.favorites.has(id)) state.favorites.delete(id);
      else state.favorites.add(id);
      persistFavorites();
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
      const listHost =
        state.route.mode === "category" ? elCategoriesGrid : state.route.mode === "artist" ? elArtistsList : elForYouList;

      if (!listHost) return;

      const tracks = getRouteTracks();

      let headerHtml = "";
      if (state.route.mode === "category") {
        const cat = categoryById(state.route.id);
        const searchValueAttr = escapeAttr(state.query || "");
        const searchPlaceholderAttr = escapeAttr(`Search in ${cat?.name || "Category"}...`);
        const iconEmoji = escapeHtml(cat?.icon || "");
        headerHtml = `
        <div class="story-music-detail-hero story-music-detail-hero--full story-music-detail-hero--category" style="--hero-bg:${escapeAttr(
          cat?.gradient || "linear-gradient(135deg,#fb7185,#f97316)"
        )}">
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
            <button type="button" class="story-music-modal__icon-btn story-music-view-toggle-btn" data-view="${escapeAttr(state.viewByTab[state.activeTab])}" aria-label="Toggle view" title="Toggle list/grid view">
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
        <div class="story-music-detail-hero story-music-detail-hero--artist story-music-detail-hero--full" style="--hero-bg: linear-gradient(135deg,#111827,#6d28d9); --hero-img:url(\"${escapeAttr(
          a?.banner || ""
        )}\")">
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
            <button type="button" class="story-music-modal__icon-btn story-music-view-toggle-btn" data-view="${escapeAttr(state.viewByTab[state.activeTab])}" aria-label="Toggle view" title="Toggle list/grid view">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" class="view-icon-list" aria-hidden="true"><path fill="currentColor" d="M3 4h18v2H3zm0 7h18v2H3zm0 7h18v2H3z"/></svg>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" class="view-icon-grid" aria-hidden="true"><path fill="currentColor" d="M4 4h6v6H4zm0 10h6v6H4zm10-10h6v6h-6zm0 10h6v6h-6z"/></svg>
            </button>
          </div>
        </div>
      `;
      }

      const useGrid =
        state.viewByTab[state.activeTab] === "grid" &&
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
            <div class="story-music-grid-card ${isActive ? "is-active" : ""} ${isPlaying ? "is-playing" : ""}" data-track-id="${escapeAttr(
              t.id
            )}" data-search="${escapeAttr(searchHay)}">
              <div class="story-music-grid-card__cover">
                <img src="${escapeAttr(t.coverSrc)}" alt="" loading="lazy" onerror="imgOnErrorHide(this)" />
                <div class="story-music-wave" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span></div>
                <div class="story-music-grid-card__overlay">
                  <button type="button" class="story-music-action-btn is-primary" data-action="play" data-track-id="${escapeAttr(
                    t.id
                  )}">${playIcon}</button>
                  <button type="button" class="story-music-action-btn" data-action="favorite" data-track-id="${escapeAttr(
                    t.id
                  )}">${heartIcon}</button>
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
          <div class="story-music-item ${isActive ? "is-active" : ""} ${isPlaying ? "is-playing" : ""}" data-track-id="${escapeAttr(
            t.id
          )}" data-search="${escapeAttr(searchHay)}">
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
              <button type="button" class="story-music-action-btn is-primary" data-action="play" data-track-id="${escapeAttr(
                t.id
              )}" aria-label="${isPlaying ? "Pause" : "Play"}">${playIcon}</button>
              <button type="button" class="story-music-action-btn" data-action="favorite" data-track-id="${escapeAttr(
                t.id
              )}" aria-label="${isFav ? "Remove from favorites" : "Add to favorites"}">${heartIcon}</button>
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

      // Some page-level stylesheets can wipe borders in drill-down contexts.
      // Force the bordered-card look inline (with !important) for Category/Artist drill-down track rows.
      if (state.route.mode === "category" || state.route.mode === "artist") {
        // Ensure the list wrapper has padding for spacing from modal walls
        const listWrapper = listHost.querySelector(".story-music-list, .story-music-grid");
        if (listWrapper) {
          listWrapper.style.setProperty("padding", "14px", "important");
        }
        
        const trackElements = listHost.querySelectorAll(".story-music-item[data-track-id], .story-music-grid-card[data-track-id]");
        console.log(`[StoryMusicModal] Enforcing borders on ${trackElements.length} drill-down track rows in ${state.route.mode} mode`);
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

      applySearchFilterToHost(listHost);

      listHost.querySelectorAll("[data-story-music-back]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const target = btn.getAttribute("data-story-music-back");
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
        counts.set(t.artistId, (counts.get(t.artistId) || 0) + 1);
        (t.featuredArtistIds || []).forEach((id) => counts.set(id, (counts.get(id) || 0) + 1));
      });

      const uniqueArtists = Array.from(new Map((musicLibrary.artists || []).map((a) => [a?.id || a?.name, a])).values());

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
              <button type="button" class="story-music-action-btn" data-action="favorite-artist" data-artist-id="${escapeAttr(
                a.id
              )}" aria-label="${isFav ? "Remove from favorites" : "Add to favorites"}">${heartIcon}</button>
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

      if (elFavoritesList) {
        elFavoritesList.classList.toggle("explore-hidden", !hasFav);
      }

      if (elFavControls) {
        elFavControls.classList.toggle("explore-hidden", !hasFav);
      }
    }

    function renderFavoritesArtists() {
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
      if (!state.activeTab) state.activeTab = "for-you";
      render();
    };

    const closeModal = () => {
      modalRoot.classList.add("explore-hidden");
      modalRoot.setAttribute("aria-hidden", "true");
      document.body.classList.remove("story-music-modal-open");
      stopPlayback();
    };

    if (backdrop) {
      backdrop.addEventListener("click", closeModal);
    }

    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if (modalRoot.classList.contains("explore-hidden")) return;
      closeModal();
    });

    const tabButtons = [...modalRoot.querySelectorAll(".story-music-tab")];
    const panels = [...modalRoot.querySelectorAll(".story-music-panel")];

    const activateTab = (name) => {
      if (state.activeTab !== name) state.query = "";
      state.activeTab = name;

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

    modalRoot.querySelectorAll('[data-story-music-go="for-you"]').forEach((btn) => {
      btn.addEventListener("click", () => activateTab("for-you"));
    });

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

    modalRoot.querySelectorAll(".story-music-modal-search").forEach((input) => {
      input.addEventListener("input", () => {
        state.query = input.value || "";
        applySearchFilterToHost(getCurrentTracksHost());
      });

      const stop = (e) => e.stopPropagation();
      input.addEventListener("click", stop);
      input.addEventListener("mousedown", stop);
      input.addEventListener("pointerdown", stop);
    });

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

    modalRoot.addEventListener(
      "click",
      (e) => {
        const input = e.target && e.target.closest && e.target.closest(".story-music-modal-search");
        if (input) e.stopPropagation();
      },
      true
    );

    modalRoot.addEventListener(
      "mousedown",
      (e) => {
        const input = e.target && e.target.closest && e.target.closest(".story-music-modal-search");
        if (input) e.stopPropagation();
      },
      true
    );

    modalRoot.addEventListener(
      "pointerdown",
      (e) => {
        const input = e.target && e.target.closest && e.target.closest(".story-music-modal-search");
        if (input) e.stopPropagation();
      },
      true
    );

    const viewToggle = document.getElementById("storyMusicViewToggle");
    if (viewToggle) {
      viewToggle.addEventListener("click", () => {
        const next = (viewToggle.getAttribute("data-view") || "list") === "list" ? "grid" : "list";
        viewToggle.setAttribute("data-view", next);
        state.viewByTab[state.activeTab] = next;
        render();
      });
    }

    modalRoot.addEventListener("click", (e) => {
      const viewToggleBtn = e.target.closest(".story-music-view-toggle-btn");
      if (viewToggleBtn) {
        const current = viewToggleBtn.getAttribute("data-view") || "list";
        const next = current === "list" ? "grid" : "list";
        state.viewByTab[state.activeTab] = next;
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
        e.preventDefault();
        e.stopPropagation();
        if (action === "play") togglePlay(trackId);
        if (action === "favorite") toggleFavorite(trackId);
        return;
      }

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
        state.query = "";
        state.route = { mode: "category", type: "category", id: categoryId };
        render();
        return;
      }

      const artistRow = e.target.closest("[data-artist-id]");
      if (artistRow && state.activeTab === "artists") {
        const artistId = artistRow.getAttribute("data-artist-id");
        if (!artistId) return;
        state.query = "";
        state.route = { mode: "artist", type: "artist", id: artistId };
        render();
        return;
      }
    });

    // In Post, users expect a single-click to preview/play.
    // To avoid accidental selection, selection is only emitted on double-click.
    modalRoot.addEventListener("dblclick", (e) => {
      const trackContainer = e.target.closest("[data-track-id]");
      if (!trackContainer) return;
      const trackId = trackContainer.getAttribute("data-track-id");
      if (!trackId) return;
      const selected = musicLibrary.tracks.find((t) => t.id === trackId);
      if (!selected) return;
      window.dispatchEvent(new CustomEvent("storymusic:select", { detail: selected }));
    });

    function render() {
      setViewToggleIcon();
      const isDrillDown = state.route.mode === "category" || state.route.mode === "artist";

      const hadFocus = document.activeElement?.classList.contains("story-music-modal-search");

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

      modalRoot.querySelectorAll(".story-music-modal-search").forEach((inp) => {
        if (inp.value !== state.query) inp.value = state.query;
      });

      const activeInput = getActiveSearchInput();
      if (activeInput) {
        activeInput.placeholder = isDrillDown
          ? drillPlaceholder
          : defaultPlaceholderByPanel[activePanelName()] || "Search music...";
      }

      const activeRow = getActiveSearchRow();
      if (activeRow) {
        const hidePanelRow = state.route.mode === "category" || state.route.mode === "artist";
        if (hidePanelRow) activeRow.classList.add("explore-hidden");
        else if (isDrillDown) activeRow.classList.remove("explore-hidden");
        activeRow.classList.toggle("is-drill", isDrillDown);
      }

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

      renderCategories();
      renderArtists();

      if (state.activeTab === "for-you" || state.activeTab === "favorites" || isDrillDown) {
        renderForYouOrListContext();
      }

      renderFavoritesEmptyState();

      if (state.activeTab === "favorites") {
        if (state.favoritesSort === "artists") {
          renderFavoritesArtists();
        } else {
          const tracks = getVisibleTracks();
          if (tracks.length) {
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
                    <div class="story-music-item ${isActive ? "is-active" : ""} ${isPlaying ? "is-playing" : ""}" data-track-id="${escapeAttr(
                    t.id
                  )}">
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
                        <button type="button" class="story-music-action-btn is-primary" data-action="play" data-track-id="${escapeAttr(
                          t.id
                        )}">${playIcon}</button>
                        <button type="button" class="story-music-action-btn" data-action="favorite" data-track-id="${escapeAttr(
                          t.id
                        )}">${heartIcon}</button>
                      </div>
                    </div>
                  `;
                })
                .join("")}</div>`;
            }
            elFavoritesEmpty?.classList.add("explore-hidden");
          }
        }
      }

      if (hadFocus) {
        const newActiveInput =
          state.route.mode === "category"
            ? elCategoriesGrid?.querySelector(".story-music-modal__search--injected .story-music-modal-search")
            : state.route.mode === "artist"
              ? elArtistsList?.querySelector(".story-music-modal__search--injected .story-music-modal-search")
              : getActiveSearchInput();
        if (newActiveInput && document.activeElement !== newActiveInput) {
          Promise.resolve().then(() => {
            newActiveInput.focus();
            if (newActiveInput.value) {
              newActiveInput.setSelectionRange(newActiveInput.value.length, newActiveInput.value.length);
            }
          });
        }
      }
    }

    render();

    const api = {
      open: openModal,
      close: closeModal,
      getTrackById: (id) => musicLibrary.tracks.find((t) => t.id === id) || null,
      getTracks: () => [...musicLibrary.tracks],
    };

    window.StoryMusicModal = api;
    return api;
  }

  document.addEventListener("DOMContentLoaded", () => {
    initStoryMusicModalUi();
  });

  window.initStoryMusicModalUi = initStoryMusicModalUi;
})();
