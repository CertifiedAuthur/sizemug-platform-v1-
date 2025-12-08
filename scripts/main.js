/**
 * Querry single element by css selector
 *
 * @param {string} sel
 * @returns {HTMLElement}
 */
const getElement = (sel) => document.querySelector(sel);
/**
 * Querry multiple element by css selector
 *
 * @param {string} sel
 * @returns {NodeListOf<HTMLElement>}
 */
const getElements = (sel) => document.querySelectorAll(sel);
/**
 * Toggle a boolean attribute
 *
 * @param {HTMLElement} el - Target HTML elemen
 * @param {string} attr - Attribute to toggle
 * @param {boolean | null} [state] - Conditional statement
 */
const setBooleanAttribute = (el, attr, state) => {
  state ? el.setAttribute(attr, "") : el.removeAttribute(attr);
};

/**
 * Get parent with query selector
 *
 * @param {HTMLElement} el - Target element
 * @param {string} selector - Parent selector
 */
const getParent = (el, selector) => {
  let parent = el.parentNode;
  while (parent) {
    if (document.querySelector(selector) === parent) return parent;
    parent = parent?.parentNode;
  }
};

// #region Header section
/** @type {HTMLDivElement} */
const navMenu = getElement("#nav-menu");
/** @type {HTMLDivElement} */
const navToggle = getElement("#nav-toggle");
/** @type {HTMLDivElement} */
const header = getElement("#header");

/** Toggle navbar style on scrolled */
const addNavbarScrolledClass = () => {
  header?.setAttribute("data-scrolled", window.scrollY > 50);
};
window.addEventListener("scroll", addNavbarScrolledClass);
window.addEventListener("load", addNavbarScrolledClass);

// Event listeners
navToggle?.addEventListener("click", () => {
  const isActive = navMenu.getAttribute("aria-expanded") === "true";
  navMenu.setAttribute("aria-expanded", !isActive);
});
//#endregion

//#region Modal components
/** @type {HTMLDialogElement} */
getElements('[data-toggle="modal"]').forEach((el) => {
  el.addEventListener("click", (e) => {
    const target = e.currentTarget?.getAttribute("data-target");
    if (target) openModal(getElement(target));
  });
});

getElements("dialog").forEach((dialog) => {
  // close on clicking close button
  const closeBtn = dialog.querySelector("button[data-modal-close]");
  closeBtn?.addEventListener("click", () => {
    dialog.close();
  });
  // close on clicking outside bounds
  dialog.addEventListener("click", (e) => {
    if (e.currentTarget === e.target) dialog.close();
  });

  dialog.addEventListener("close", (e) => {
    setTabsInitialState(e.target);
  });
});

/** @param {HTMLDialogElement} target */
const openModal = (target) => {
  // close all other modals if opened
  getElements(".auth_modal").forEach((modal) => {
    modal.classList.add("auth--hidden");
  });
  // close header nav menu
  document.querySelector("#header .nav__menu")?.setAttribute("aria-expanded", "false");
  if (!target) return;
  target.classList.remove("auth--hidden");
};

const exitFullscreen = () => {
  document.fullscreenElement !== null && document.exitFullscreen();
};
getElements(".panel-container .panel__image").forEach((el) => {
  const btn = el.querySelector("button");
  const img = el.querySelector("img");
  btn.addEventListener("click", () => img.requestFullscreen());
  img.addEventListener("click", () => exitFullscreen());
});
window.addEventListener("resize", () => {
  if (window.width <= 640) exitFullscreen();
});

//#endregion

//#region Tab toggle
getElements(".tab__content").forEach((el) => {
  if (el.getAttribute("data-tab-initial") === "") {
    el.setAttribute("data-active", "");
  }
});

getElements('[data-toggle="tab"]').forEach((el) => {
  /** @type {HTMLElement} */
  const target = el.getAttribute("data-target");
  const targetEl = getElement(target);
  const parent = getParent(el, ".tabs");
  if (targetEl?.getAttribute("data-active") === "") {
    setBooleanAttribute(el, "data-target-active", true);
  }
  el.addEventListener("click", (e) => {
    parent?.querySelectorAll('[data-toggle="tab"]').forEach((btn) => {
      setBooleanAttribute(btn, "data-target-active", e.target === btn);
    });
    showTab(targetEl);
  });
});

const demoSectionTitle = getElement(".demo-sec__title>h2>em");
getElements(".demo-sec__tabs>ul>li>button").forEach((el) => {
  el.addEventListener("click", (e) => {
    const title = e.target.getAttribute("data-title");
    demoSectionTitle.textContent = title;
  });
});

/** @param {HTMLElement} target */
const showTab = (target) => {
  if (!target) return;
  const parent = target.parentElement;
  parent.querySelectorAll(".tab__content").forEach((el) => {
    el === target ? el.setAttribute("data-active", "") : el.removeAttribute("data-active");
  });
};

/** @param {HTMLElement} parent */
const setTabsInitialState = (parent) => {
  parent?.querySelectorAll(".tab__content").forEach((el) => {
    el.getAttribute("data-tab-initial") === "" ? el.setAttribute("data-active", "") : el.removeAttribute("data-active");
  });
};
//#endregion

//#region Input fields
/** @type {NodeListOf<HTMLInputElement>} */
const otpInputs = getElements(".input_otp");
otpInputs.forEach((el) => {
  const maxLength = parseInt(el.getAttribute("data-length") || "4");
  /** @type {HTMLInputElement[]} */
  const units = [];
  // create input units
  for (let i = 0; i < maxLength; i++) {
    const unit = document.createElement("input");
    unit.type = "number";
    unit.pattern = /\d/;
    unit.maxLength = 1;
    unit.placeholder = "0";
    // append to the parent
    units[i] = unit;
    el.appendChild(unit);
  }

  units.forEach((unit, i) => {
    const prev = units[i - 1];
    const next = units[i + 1];
    /** @type {(e: KeyboardEvent) => void} */
    const onKeyPress = (e) => {
      switch (e.key) {
        case "ArrowUp":
        case "ArrowDown":
        case "ArrowLeft":
        case "ArrowRight":
        case "e":
          e.preventDefault();
          break;
        case "Backspace":
          unit.value = "";
          prev?.focus();
          break;
      }
    };
    /** @type {(e: Event) => void} */
    const onInput = (e) => {
      const val = e.target.value;
      e.currentTarget.value = val[0];
      if (val.length >= 1 && next) {
        next.value = val.slice(1);
        next.focus();
      }
    };
    unit.addEventListener("keydown", onKeyPress);
    unit.addEventListener("keyup", onKeyPress);
    unit.addEventListener("input", onInput);
    unit.addEventListener("paste", (e) => {
      const text = e.clipboardData.getData("text");
      const otp = text && String(parseInt(text));
      if (otp) e.preventDefault();
      otp.split("").forEach((num, i) => {
        if (i < units.length) units[i].value = num;
      });
    });
  });
});
//#endregion

/**
 *
 *
 * Register Events
 *
 *
 *
 */
//#login event
/** @type {NodeListOf<HTMLButtonElement>} */
const registerBtn = getElement("#register_btn");
const allRegisterInputs = getElements("#registerForm input");
const registerFlashAuth = getElement("#registerFlashAuth");

allRegisterInputs.forEach((input) => {
  input.addEventListener("input", () => {
    registerFlashAuth.style.display = "none";
  });
});

registerBtn.addEventListener("click", async function (e) {
  e.preventDefault();

  const registerFirstInput = getElement("#registerFirstInput").value;
  const registerLastInput = getElement("#registerLastInput").value;
  const registerEmailInput = getElement("#registerEmailInput").value;
  const registerUsernameInput = getElement("#registerUsernameInput").value;
  const registerPasswordInput = getElement("#registerPasswordInput").value;
  const registerInviteCodeInput = getElement("#registerInviteCodeInput").value;
  const registerLoading = document.getElementById("register_loading");

  // If there are all neccessary fields
  if (!registerFirstInput || !registerEmailInput || !registerLastInput || !registerPasswordInput || !registerUsernameInput) {
    return registerFlashAuth.classList.remove("auth--hidden");
  }

  // Check for valid email address
  const testEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(registerEmailInput);

  if (!testEmail) {
    registerFlashAuth.querySelector("p").textContent = "Invalid email address";
    registerFlashAuth.classList.remove("auth--hidden");
    return;
  }

  try {
    registerLoading.classList.remove("auth--hidden");
    this.setAttribute("disabled", true);

    // https://sizemug-server.onrender.com/api/signup
    // http://localhost:3000/api/signup
    const response = await fetch("https://sizemug-backend-server.vercel.app/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: registerFirstInput,
        lastName: registerLastInput,
        username: registerUsernameInput,
        email: registerEmailInput,
        password: registerPasswordInput,
        referralCode: registerInviteCodeInput || "",
      }),
    });

    registerLoading.classList.add("auth--hidden");
    this.removeAttribute("disabled");

    const data = await response.json();

    if (response.ok) {
      // Store non-sensitive data in localStorage
      localStorage.setItem("sizemugUserInfo", JSON.stringify(data.user));
      localStorage.setItem("sizemugUserToken", JSON.stringify(data.token));

      handleAuth("mid-start");
    } else {
      registerFlashAuth.querySelector("p").textContent = data.message;
      registerFlashAuth.classList.remove("auth--hidden");
    }
  } catch (error) {
    console.log(error.message);
    registerLoading.classList.add("auth--hidden");
  }
});

function handleAuth(value) {
  localStorage.setItem("sizemug_status", value);
  window.location = "/dashboard.html";
}

/**
 *
 *
 * Login Events
 *
 *
 *
 */
const loginBtn = getElement("#login_btn");
const allLoginInputs = getElements("#login_modal input");
const loginFlashAuth = getElement("#loginFlashAuth");

allLoginInputs.forEach((input) => {
  input.addEventListener("input", () => {
    loginFlashAuth.style.display = "none";
  });
});

loginBtn.addEventListener("click", async function (e) {
  e.preventDefault();

  const loginUsernameInput = getElement("#loginUsernameInput").value;
  const loginPasswordInput = getElement("#loginPasswordInput").value;
  const loginLoading = document.getElementById("login_loading");

  // If there are all neccessary fields
  if (!loginUsernameInput || !loginPasswordInput) {
    return loginFlashAuth.classList.remove("auth--hidden");
  }

  try {
    loginLoading.style.display = "inline";
    this.setAttribute("disabled", true);

    // https://sizemug-server.onrender.com/api/login
    // http://localhost:3000/api/login
    const response = await fetch("https://sizemug-backend-server.vercel.app/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: loginUsernameInput,
        password: loginPasswordInput,
      }),
    });

    loginLoading.style.display = "none";
    this.removeAttribute("disabled");

    const data = await response.json();

    if (response.ok) {
      // Store non-sensitive data in localStorage
      localStorage.setItem("sizemugUserInfo", JSON.stringify(data.user));
      localStorage.setItem("sizemugUserToken", JSON.stringify(data.token));

      handleAuth("old");
    } else {
      loginFlashAuth.querySelector("p").textContent = data.message;
      loginFlashAuth.style.display = "flex";
    }
  } catch (error) {
    console.log(error.message);
    loginLoading.style.display = "none";
  }
});

// Self clicked
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("auth_modal")) {
    e.target.closest(".auth_modal").classList.add("auth--hidden");
  }
});

//
const eyeTrackers = document.querySelectorAll(".eyeTracker");
eyeTrackers.forEach((eye) => {
  eye.addEventListener("click", (e) => {
    e.preventDefault();

    const state = eye.getAttribute("data-state");
    const multiple = e.target.closest(".auth_input_extra_wrap").querySelector("input");

    if (state === "on") {
      eye.setAttribute("data-state", "off");
      multiple.type = "text";
    } else {
      eye.setAttribute("data-state", "on");
      multiple.type = "password";
    }
  });
});
