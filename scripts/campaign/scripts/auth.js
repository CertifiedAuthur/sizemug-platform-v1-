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
  state ? el.setAttribute(attr, '') : el.removeAttribute(attr);
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

//#region Header section
/** @type {HTMLDivElement} */
const navMenu = getElement('#nav-menu');
/** @type {HTMLDivElement} */
const navToggle = getElement('#nav-toggle');
/** @type {HTMLDivElement} */
const header = getElement('header');

/** Toggle navbar style on scrolled */
const addNavbarScrolledClass = () => {
  // header.setAttribute('data-scrolled', window.scrollY > 50);
};
window.addEventListener('scroll', addNavbarScrolledClass);
window.addEventListener('load', addNavbarScrolledClass);

// Event listeners
// navToggle.addEventListener('click', () => {
//   const isActive = navMenu.getAttribute('aria-expanded') === 'true';
//   navMenu.setAttribute('aria-expanded', !isActive);
// });
//#endregion

//#region Modal components
/** @type {HTMLDialogElement} */
getElements('[data-toggle="modal"]').forEach((el) => {
  el.addEventListener('click', (e) => {
    const target = e.currentTarget?.getAttribute('data-target');
    if (target) openModal(getElement(target));
  });
});

getElements('dialog').forEach((dialog) => {
  // close on clicking close button
  const closeBtn = dialog.querySelector('button[data-modal-close]');
  closeBtn?.addEventListener('click', () => {
    dialog.close();
  });
  // close on clicking outside bounds
  dialog.addEventListener('click', (e) => {
    if (e.currentTarget === e.target) dialog.close();
  });

  dialog.addEventListener('close', (e) => {
    setTabsInitialState(e.target);
  });
});

/** @param {HTMLDialogElement} target */
const openModal = (target) => {
  // close all other modals if opened
  getElements('dialog').forEach((dialog) => {
    if (dialog.open) dialog.close();
  });
  // close header nav menu
  // document
  //   .querySelector('#header .nav__menu')
  //   .setAttribute('aria-expanded', 'false');
  if (!target) return;
  target.showModal();
};

const exitFullscreen = () => {
  document.fullscreenElement !== null && document.exitFullscreen();
};
getElements('.panel-container .panel__image').forEach((el) => {
  const btn = el.querySelector('button');
  const img = el.querySelector('img');
  btn.addEventListener('click', () => img.requestFullscreen());
  img.addEventListener('click', () => exitFullscreen());
});
window.addEventListener('resize', () => {
  if (window.width <= 640) exitFullscreen();
});

//#endregion

//#region Tab toggle
getElements('.tab__content').forEach((el) => {
  if (el.getAttribute('data-tab-initial') === '') {
    el.setAttribute('data-active', '');
  }
});

getElements('[data-toggle="tab"]').forEach((el) => {
  /** @type {HTMLElement} */
  const target = el.getAttribute('data-target');
  const targetEl = getElement(target);
  const parent = getParent(el, '.tabs');
  if (targetEl?.getAttribute('data-active') === '') {
    setBooleanAttribute(el, 'data-target-active', true);
  }
  el.addEventListener('click', (e) => {
    parent?.querySelectorAll('[data-toggle="tab"]').forEach((btn) => {
      setBooleanAttribute(btn, 'data-target-active', e.target === btn);
    });
    showTab(targetEl);
  });
});

const demoSectionTitle = getElement('.demo-sec__title>h2>em');
getElements('.demo-sec__tabs>ul>li>button').forEach((el) => {
  el.addEventListener('click', (e) => {
    const title = e.target.getAttribute('data-title');
    demoSectionTitle.textContent = title;
  });
});

/** @param {HTMLElement} target */
const showTab = (target) => {
  if (!target) return;
  const parent = target.parentElement;
  parent.querySelectorAll('.tab__content').forEach((el) => {
    el === target
      ? el.setAttribute('data-active', '')
      : el.removeAttribute('data-active');
  });
};

/** @param {HTMLElement} parent */
const setTabsInitialState = (parent) => {
  parent?.querySelectorAll('.tab__content').forEach((el) => {
    el.getAttribute('data-tab-initial') === ''
      ? el.setAttribute('data-active', '')
      : el.removeAttribute('data-active');
  });
};
//#endregion

//#region Input fields
/** @type {NodeListOf<HTMLInputElement>} */
const otpInputs = getElements('.input_otp');
otpInputs.forEach((el) => {
  const maxLength = parseInt(el.getAttribute('data-length') || '4');
  /** @type {HTMLInputElement[]} */
  const units = [];
  // create input units
  for (let i = 0; i < maxLength; i++) {
    const unit = document.createElement('input');
    unit.type = 'number';
    unit.pattern = /\d/;
    unit.maxLength = 1;
    unit.placeholder = '0';
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
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
        case 'e':
          e.preventDefault();
          break;
        case 'Backspace':
          unit.value = '';
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
    unit.addEventListener('keydown', onKeyPress);
    unit.addEventListener('keyup', onKeyPress);
    unit.addEventListener('input', onInput);
    unit.addEventListener('paste', (e) => {
      const text = e.clipboardData.getData('text');
      const otp = text && String(parseInt(text));
      if (otp) e.preventDefault();
      otp.split('').forEach((num, i) => {
        if (i < units.length) units[i].value = num;
      });
    });
  });
});
//#endregion
