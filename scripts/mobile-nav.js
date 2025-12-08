
(() => {
	const HAMBURGER  = document.querySelector('.menu-icon');
	const SIDEBAR    = document.querySelector('.side-nav');
	const OVERLAY    = document.createElement('div');
	OVERLAY.className = 'mobile-overlay';
	document.body.appendChild(OVERLAY);

	if (!HAMBURGER || !SIDEBAR || !OVERLAY) {
		console.warn('MobileNav: Missing required elements.');
		return;
	}

	let isOpen = false;
	let resizeTimeout;

	// Open sidebar
	function openMenu() {
		if (isOpen) return;
		isOpen = true;
		document.body.classList.add('menu-open');
		HAMBURGER.classList.add('open');
		SIDEBAR.classList.add('open');
		OVERLAY.classList.add('open');
	}

	// Close sidebar
	function closeMenu() {
		if (!isOpen) return;
		isOpen = false;
		document.body.classList.remove('menu-open');
		HAMBURGER.classList.remove('open');
		SIDEBAR.classList.remove('open');
		OVERLAY.classList.remove('open');
	}

	// Toggle on hamburger click
	HAMBURGER.addEventListener('click', e => {
		e.stopPropagation();
		requestAnimationFrame(() => (isOpen ? closeMenu() : openMenu()));
	});

	// Click outside to close
	OVERLAY.addEventListener('click', closeMenu);
	document.addEventListener('click', e => {
		if (!isOpen) return;
		if (!SIDEBAR.contains(e.target) && e.target !== HAMBURGER) {
			closeMenu();
		}
	});

	// Escape key to close
	document.addEventListener('keydown', e => {
		if (e.key === 'Escape' && isOpen) {
			closeMenu();
		}
	});

	// Close when resizing above mobile breakpoint
	window.addEventListener('resize', () => {
		clearTimeout(resizeTimeout);
		resizeTimeout = setTimeout(() => {
			if (window.innerWidth > 768 && isOpen) {
				closeMenu();
			}
		}, 200);
	});

	window.mobileNav = { openMenu, closeMenu, isOpen: () => isOpen };
})();
