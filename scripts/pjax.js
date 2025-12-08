/**
 * pjax.js v2.1.0
 * Seamless in-app navigation for Sizemug
 */
(() => {
	const MAIN_CONTENT_SELECTOR = 'main.main-content';
	const ASIDE_ANCHORS_SELECTOR = 'aside.anchors';
	const PROGRESS_BAR_SELECTOR = '.progress-bar .progress';

	const progress = document.querySelector(PROGRESS_BAR_SELECTOR);
	const body = document.body;

	let isLoading = false;
	let currentAbortController = null;
	const pageCache = new Map();
	const preloadThrottle = new Set();

	if (!progress) {
		console.warn('PJAX: Progress bar not found. PJAX functionality will be limited.');
	}

	function normalizeUrl(href) {
		try {
			const url = new URL(href, location.origin);
			if (url.origin !== location.origin) {
				return null;
			}
			if (url.pathname.endsWith('/') && url.pathname !== '/') {
				url.pathname = url.pathname.slice(0, -1);
			}
			return url;
		} catch (e) {
			console.error('PJAX: Invalid URL for normalization:', href, e);
			return null;
		}
	}

	function shouldPjax(hrefOrUrl) {
		const url = typeof hrefOrUrl === 'string' ? normalizeUrl(hrefOrUrl) : hrefOrUrl;

		if (!url) {
			return false;
		}

		if (url.pathname === location.pathname && url.search === location.search) {
			if (url.hash && url.hash !== location.hash) {
				return false;
			}
			return false;
		}

		if (/\.(pdf|zip|docx?|xlsx?|pptx?)$/i.test(url.pathname)) {
			return false;
		}

		if (/^\/(?:api|download)\//.test(url.pathname)) {
			return false;
		}

		return true;
	}

	function setProgress(pct) {
		if (!progress) return;

		requestAnimationFrame(() => {
			progress.style.transition = pct === 0 ? 'none' : 'width 0.3s ease-out';
			progress.style.width = `${Math.min(pct, 100)}%`;
		});
	}

	function fadeOut(el) {
		if (!el) return;
		el.style.transition = 'opacity 0.15s ease-out';
		el.style.opacity = '0';
	}

	function fadeIn(el) {
		if (!el) return;
		el.style.transition = 'opacity 0.15s ease-in';
		el.style.opacity = '1';
	}

	function swapContent(newMain, newAside, oldMain, oldAside, newTitle, urlHref, hasHash) {
		if (newTitle) {
			document.title = newTitle;
		}

		fadeOut(oldMain);
		if (oldAside) {
			fadeOut(oldAside);
		}

		setTimeout(() => {
			oldMain.replaceWith(newMain);
			if (newAside && oldAside) {
				oldAside.replaceWith(newAside);
			} else if (newAside && !oldAside) {
				console.warn('PJAX: New aside element found, but no existing aside to replace. Consider appending logic if needed.');
			} else if (!newAside && oldAside) {
				oldAside.remove();
			}

			fadeIn(newMain);
			if (newAside) {
				fadeIn(newAside);
			}

			window.initProgress?.();
			window.initLibraries?.();

			document.dispatchEvent(new CustomEvent('pjax:complete', { 
				detail: { url: urlHref, time: Date.now(), hasHash: hasHash } 
			}));

			if (window.initAnchorScroll) {
				window.initAnchorScroll();
				if (hasHash && window.anchorScroll) {
					const targetId = new URL(urlHref).hash.substring(1);
					console.log('PJAX: Triggering SmoothAnchorScroll to', targetId);
					window.anchorScroll.scrollToAnchor(targetId, false);
				} else {
					window.scrollTo(0, 0);
				}
			} else {
				window.scrollTo(0, 0);
			}
		}, 150);
	}

	async function loadPage(href, push = true, initialScrollY = 0) {
		const url = normalizeUrl(href);

		if (!shouldPjax(url)) {
			if (url && url.pathname === location.pathname && url.search === location.search && url.hash && url.hash !== location.hash) {
				console.log('PJAX: Same page, only hash changed. Delegating to SmoothAnchorScroll.');
				if (window.anchorScroll && typeof window.anchorScroll.scrollToAnchor === 'function') {
					window.anchorScroll.scrollToAnchor(url.hash.substring(1), push);
					return;
				}
			}

			console.log('PJAX: Falling back to full page load for', href);
			window.location.href = href;
			return;
		}

		if (isLoading && currentAbortController) {
			currentAbortController.abort();
		}

		isLoading = true;
		body.classList.add('pjax-loading');
		setProgress(10);

		const abortController = new AbortController();
		currentAbortController = abortController;

		try {
			setProgress(25);
			let response;

			if (pageCache.has(url.href)) {
				response = await pageCache.get(url.href).then(res => res.clone());
				if (!response.ok) {
					pageCache.delete(url.href);
					throw new Error(`Cached response not OK: HTTP ${response.status}`);
				}
				console.log('PJAX: Using cached response for', url.href);
			} else {
				const fetchTimeout = setTimeout(() => abortController.abort(), 15000);
				response = await fetch(url.href, {
					signal: abortController.signal,
					credentials: 'same-origin',
					headers: { 'X-Requested-With': 'XMLHttpRequest' }
				});
				clearTimeout(fetchTimeout);

				if (!response.ok) {
					throw new Error(`HTTP Error: ${response.status} for ${url.href}`);
				}

				pageCache.set(url.href, response.clone());
				if (pageCache.size > 10) {
					const firstKey = pageCache.keys().next().value;
					pageCache.delete(firstKey);
				}
			}

			setProgress(50);
			const html = await response.text();
			setProgress(70);

			const parser = new DOMParser();
			const doc = parser.parseFromString(html, 'text/html');

			const newMain = doc.querySelector(MAIN_CONTENT_SELECTOR);
			const newAside = doc.querySelector(ASIDE_ANCHORS_SELECTOR);
			const newTitle = doc.querySelector('title')?.textContent || 'Sizemug';

			if (!newMain) {
				throw new Error('PJAX: New main content element not found in response.');
			}

			const oldMain = document.querySelector(MAIN_CONTENT_SELECTOR);
			const oldAside = document.querySelector(ASIDE_ANCHORS_SELECTOR);

			if (!oldMain) {
				console.error('PJAX: Existing main content element not found, falling back to full reload.');
				window.location.href = href;
				return;
			}

			const hasHash = !!url.hash;
			swapContent(newMain, newAside, oldMain, oldAside, newTitle, url.href, hasHash);

			if (push) {
				history.pushState({ url: url.href, scrollY: initialScrollY }, newTitle, url.href);
			} else {
				history.replaceState({ url: url.href, scrollY: initialScrollY }, newTitle, url.href);
			}

			setProgress(100);
			setTimeout(() => setProgress(0), 300);

		} catch (err) {
			console.error('PJAX: Load error:', err);
			if (err.name === 'AbortError') {
				console.info('PJAX: Request aborted (user cancelled or timeout).');
			} else {
				console.warn('PJAX: Encountered an unrecoverable error, performing full page reload.');
				window.location.href = href;
			}
			setProgress(0);
		} finally {
			isLoading = false;
			currentAbortController = null;
			body.classList.remove('pjax-loading');
		}
	}

	document.body.addEventListener('click', e => {
		const anchor = e.target.closest('a');

		if (!anchor || anchor.hasAttribute('data-no-pjax') || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) {
			return;
		}

		const href = anchor.getAttribute('href');
		if (!href) return;

		const targetUrl = normalizeUrl(href);
		if (targetUrl && targetUrl.pathname === location.pathname && targetUrl.search === location.search && targetUrl.hash) {
			console.log('PJAX: Clicked same-page hash link. Allowing SmoothAnchorScroll to handle.');
			return;
		}

		if (!shouldPjax(href)) {
			return;
		}

		e.preventDefault();
		loadPage(href);
	});

	window.addEventListener('popstate', e => {
		const stateUrl = e.state?.url || location.href;
		const scrollY = e.state?.scrollY || 0;

		if (isLoading && currentAbortController && currentAbortController.url === stateUrl) {
			return;
		}

		loadPage(stateUrl, false, scrollY);
	});

	document.body.addEventListener('mouseover', e => {
		const anchor = e.target.closest('a');
		if (!anchor) return;

		const href = anchor.href;
		const url = normalizeUrl(href);

		if (!shouldPjax(url) || (url && url.pathname === location.pathname && url.search === location.search && url.hash) || pageCache.has(url.href) || preloadThrottle.has(url.href)) {
			return;
		}

		preloadThrottle.add(url.href);
		setTimeout(() => preloadThrottle.delete(url.href), 30000);

		const preloadPromise = fetch(url.href, {
			credentials: 'same-origin',
			headers: { 'X-Requested-With': 'XMLHttpRequest' }
		}).then(response => {
			if (!response.ok) {
				console.warn('PJAX: Preload failed for', url.href, 'Status:', response.status);
				pageCache.delete(url.href);
				throw new Error(`Preload failed: HTTP ${response.status}`);
			}
			return response.clone();
		}).catch(error => {
			console.error('PJAX: Preload error for', url.href, error);
			pageCache.delete(url.href);
		});

		pageCache.set(url.href, preloadPromise);

		if (pageCache.size > 10) {
			const firstKey = pageCache.keys().next().value;
			if (firstKey !== url.href) {
				pageCache.delete(firstKey);
			}
		}
	}, { passive: true });

	window.pjax = {
		loadPage: loadPage,
		abortCurrentRequest: () => {
			if (currentAbortController) {
				currentAbortController.abort('PJAX cleanup requested');
				currentAbortController = null;
			}
		},
		isLoading: () => isLoading,
		version: '2.1.0'
	};

	history.replaceState({ url: location.href, scrollY: window.scrollY }, document.title, location.href);

	document.dispatchEvent(new CustomEvent('pjax:ready', { 
		detail: { url: location.href, time: Date.now() } 
	}));
})();