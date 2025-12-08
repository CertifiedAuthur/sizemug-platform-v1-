/**
 * Smooth Anchor Scrolling Script
 * Handles smooth scrolling between anchors with accurate active state management
 * Supports both forward and reverse scrolling with proper intersection detection
 */

class SmoothAnchorScroll {
  constructor(options = {}) {
    this.options = {
      // Smooth scrolling behavior
      behavior: "smooth",
      block: "start",
      inline: "nearest",

      // Offset from top when scrolling (useful for fixed headers)
      offset: options.offset || 20,

      // Active class for current anchor
      activeClass: options.activeClass || "active",

      // Selectors
      anchorContainer: options.anchorContainer || ".anchors",
      anchorLinks: options.anchorLinks || ".anchor-item a",

      // Intersection observer options
      rootMargin: options.rootMargin || "-10% 0px -80% 0px",
      threshold: options.threshold || [0, 0.1, 0.5, 1],

      // Debounce delay for scroll events
      debounceDelay: options.debounceDelay || 10,

      ...options,
    };

    this.anchorElements = [];
    this.anchorLinks = [];
    this.currentActive = null;
    this.isScrolling = false;
    this.scrollTimeout = null;
    this.observer = null;
    this.lastScrollY = 0;
    this.scrollDirection = "down";

    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    this.collectAnchors();
    this.setupIntersectionObserver();
    this.bindEvents();
    this.updateActiveAnchor();

    console.log("SmoothAnchorScroll initialized with", this.anchorElements.length, "anchors");
  }

  collectAnchors() {
    const anchorContainer = document.querySelector(this.options.anchorContainer);
    if (!anchorContainer) {
      console.warn("Anchor container not found:", this.options.anchorContainer);
      return;
    }

    this.anchorLinks = Array.from(anchorContainer.querySelectorAll(this.options.anchorLinks));
    this.anchorElements = [];

    this.anchorLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          this.anchorElements.push({
            id: targetId,
            element: targetElement,
            link: link,
            position: this.getElementPosition(targetElement),
          });
        }
      }
    });

    // Sort anchors by their position on the page
    this.anchorElements.sort((a, b) => a.position - b.position);
  }

  getElementPosition(element) {
    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return rect.top + scrollTop;
  }

  setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: this.options.rootMargin,
      threshold: this.options.threshold,
    };

    this.observer = new IntersectionObserver((entries) => {
      this.handleIntersection(entries);
    }, options);

    // Observe all anchor elements
    this.anchorElements.forEach((anchor) => {
      this.observer.observe(anchor.element);
    });
  }

  handleIntersection(entries) {
    if (this.isScrolling) return;

    const visibleAnchors = [];

    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const anchorData = this.anchorElements.find((a) => a.element === entry.target);
        if (anchorData) {
          visibleAnchors.push({
            ...anchorData,
            ratio: entry.intersectionRatio,
            boundingRect: entry.boundingClientRect,
          });
        }
      }
    });

    if (visibleAnchors.length > 0) {
      this.determineActiveAnchor(visibleAnchors);
    }
  }

  determineActiveAnchor(visibleAnchors) {
    let activeAnchor = null;

    if (this.scrollDirection === "down") {
      // When scrolling down, select the first visible anchor
      activeAnchor = visibleAnchors.reduce((prev, current) => {
        return prev.position < current.position ? prev : current;
      });
    } else {
      // When scrolling up, select the last visible anchor
      activeAnchor = visibleAnchors.reduce((prev, current) => {
        return prev.position > current.position ? prev : current;
      });
    }

    // Additional logic for more accurate selection
    if (visibleAnchors.length > 1) {
      // If multiple anchors are visible, choose based on intersection ratio and position
      const bestAnchor = visibleAnchors.reduce((best, current) => {
        const currentTop = current.boundingRect.top;
        const bestTop = best.boundingRect.top;

        // Prefer anchors closer to the top of the viewport
        if (Math.abs(currentTop) < Math.abs(bestTop)) {
          return current;
        }

        // If positions are similar, prefer higher intersection ratio
        if (Math.abs(currentTop - bestTop) < 50) {
          return current.ratio > best.ratio ? current : best;
        }

        return best;
      });

      activeAnchor = bestAnchor;
    }

    if (activeAnchor && activeAnchor.id !== this.currentActive) {
      this.setActiveAnchor(activeAnchor.id);
    }
  }

  setActiveAnchor(anchorId) {
    // Remove active class from all links
    this.anchorLinks.forEach((link) => {
      link.classList.remove(this.options.activeClass);
    });

    // Add active class to current link
    const activeAnchor = this.anchorElements.find((a) => a.id === anchorId);
    if (activeAnchor) {
      activeAnchor.link.classList.add(this.options.activeClass);
      this.currentActive = anchorId;
    }
  }

  bindEvents() {
    // Handle anchor link clicks
    this.anchorLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const href = link.getAttribute("href");
        if (href && href.startsWith("#")) {
          const targetId = href.substring(1);
          this.scrollToAnchor(targetId);
        }
      });
    });

    // Track scroll direction
    let ticking = false;

    const updateScrollDirection = () => {
      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;

      if (Math.abs(currentScrollY - this.lastScrollY) > 5) {
        this.scrollDirection = currentScrollY > this.lastScrollY ? "down" : "up";
        this.lastScrollY = currentScrollY;
      }

      ticking = false;
    };

    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(updateScrollDirection);
          ticking = true;
        }
      },
      { passive: true }
    );

    // Handle manual scroll end detection
    let scrollTimer = null;
    window.addEventListener(
      "scroll",
      () => {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
          this.isScrolling = false;
          this.updateActiveAnchor();
        }, 150);
      },
      { passive: true }
    );

    // Handle resize events
    window.addEventListener(
      "resize",
      this.debounce(() => {
        this.updateAnchorPositions();
      }, 250)
    );
  }

  scrollToAnchor(anchorId) {
    const anchor = this.anchorElements.find((a) => a.id === anchorId);
    if (!anchor) return;

    this.isScrolling = true;

    // Calculate scroll position with offset
    const targetPosition = anchor.position - this.options.offset;

    // Smooth scroll to position
    window.scrollTo({
      top: Math.max(0, targetPosition),
      behavior: this.options.behavior,
    });

    // Set active immediately for better UX
    this.setActiveAnchor(anchorId);

    // Reset scrolling flag after animation
    setTimeout(() => {
      this.isScrolling = false;
    }, 1000);
  }

  updateActiveAnchor() {
    if (this.isScrolling) return;

    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Handle edge cases
    if (scrollY <= 10) {
      // At the top of the page
      if (this.anchorElements.length > 0) {
        this.setActiveAnchor(this.anchorElements[0].id);
      }
      return;
    }

    if (scrollY + windowHeight >= documentHeight - 10) {
      // At the bottom of the page
      if (this.anchorElements.length > 0) {
        this.setActiveAnchor(this.anchorElements[this.anchorElements.length - 1].id);
      }
      return;
    }

    // Find the anchor that should be active based on scroll position
    let activeAnchor = null;
    const threshold = windowHeight * 0.3; // 30% of viewport height

    for (let i = 0; i < this.anchorElements.length; i++) {
      const anchor = this.anchorElements[i];
      const anchorTop = anchor.position - this.options.offset;

      if (scrollY >= anchorTop - threshold) {
        activeAnchor = anchor;
      } else {
        break;
      }
    }

    if (activeAnchor && activeAnchor.id !== this.currentActive) {
      this.setActiveAnchor(activeAnchor.id);
    }
  }

  updateAnchorPositions() {
    this.anchorElements.forEach((anchor) => {
      anchor.position = this.getElementPosition(anchor.element);
    });

    // Re-sort anchors
    this.anchorElements.sort((a, b) => a.position - b.position);

    // Update active anchor
    this.updateActiveAnchor();
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Public methods
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }

    this.anchorLinks.forEach((link) => {
      link.classList.remove(this.options.activeClass);
    });

    console.log("SmoothAnchorScroll destroyed");
  }

  refresh() {
    this.collectAnchors();
    this.updateAnchorPositions();
    this.updateActiveAnchor();
  }

  scrollToTop() {
    this.scrollToAnchor(this.anchorElements[0]?.id);
  }

  scrollToBottom() {
    this.scrollToAnchor(this.anchorElements[this.anchorElements.length - 1]?.id);
  }
}

// Initialize the script
let anchorScroll = null;

// Auto-initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  anchorScroll = new SmoothAnchorScroll({
    offset: 20,
    activeClass: "active",
    rootMargin: "-10% 0px -70% 0px",
  });
});

// Expose to global scope for manual control
window.SmoothAnchorScroll = SmoothAnchorScroll;
window.anchorScroll = anchorScroll;

// Re-initialize function for PJAX or dynamic content
window.initAnchorScroll = function () {
  if (anchorScroll) {
    anchorScroll.destroy();
  }

  anchorScroll = new SmoothAnchorScroll({
    offset: 20,
    activeClass: "active",
    rootMargin: "-10% 0px -70% 0px",
  });

  window.anchorScroll = anchorScroll;
};
