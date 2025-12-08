class WhiteboardSearchTools {
  constructor() {
    this.searchModal = document.getElementById("searchModal");
    this.searchToolbarButton = document.getElementById("searchToolbarButton");
    this.searchInput = document.getElementById("toolSearchInput");
    this.searchContents = document.getElementById("searchContents");
    this.dynamicToolBar = document.getElementById("dynamicToolBar");

    // this.sidebar
    this.mainContent = document.getElementById("searchMainContent");
    this.shapesContent = document.getElementById("shapesContent");
    this.emojisContent = document.getElementById("emojisContent");

    this.currentView = "main";
    this.init();

    //  keydown section
    // document.addEventListener("keydown", (e) => {
    //   // Only if not in text editing mode
    //   const activeElement = document.activeElement;
    //   if (activeElement.tagName !== "INPUT" && activeElement.tagName !== "TEXTAREA" && !activeElement.isContentEditable) {
    //     const key = e.key.toLowerCase();

    //     if (key === "m" || (key === "M" && !e.ctrlKey && !e.metaKey && !e.altKey)) {
    //       // Handle the tool selection
    //       this.handleToolSelection("card", document.querySelector('.search-tool-item[data-tool="card"]'));
    //     } else if (key === "j" || (key === "J" && !e.ctrlKey && !e.metaKey && !e.altKey)) {
    //       this.handleToolSelection("code_block", document.querySelector('.search-tool-item[data-tool="code_block"]'));
    //     } else if (key === "d" || (key === "D" && !e.ctrlKey && !e.metaKey && !e.altKey)) {
    //       this.handleToolSelection("dot_voting", document.querySelector('.search-tool-item[data-tool="dot_voting"]'));
    //     } else if (key === "q" || (key === "Q" && !e.ctrlKey && !e.metaKey && !e.altKey)) {
    //       this.handleToolSelection("flip_card", document.querySelector('.search-tool-item[data-tool="flip_card"]'));
    //     } else if (key === "f" || (key === "F" && !e.ctrlKey && !e.metaKey && !e.altKey)) {
    //       this.handleToolSelection("frame", document.querySelector('.search-tool-item[data-tool="frame"]'));
    //     }
    //   }
    // });

    this.init();
  }

  init() {
    this.dynamicToolBar.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    //
    this.searchToolbarButton.addEventListener("click", () => {
      this.searchModal.classList.remove(HIDDEN);
      // Focus on search input when modal opens
      setTimeout(() => this.searchInput.focus(), 100);
    });

    //
    this.searchModal.addEventListener("click", (e) => {
      if (e.target === this.searchModal) {
        this.searchModal.classList.add(HIDDEN);
        this.clearSearch();
      }
    });

    // Add search functionality
    this.searchInput.addEventListener("input", (e) => {
      this.performSearch(e.target.value);
    });

    // Add keyboard support
    this.searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.searchModal.classList.add(HIDDEN);
        this.clearSearch();
      }
    });

    // Handle tool selection from search
    this.searchContents.addEventListener("click", (e) => {
      e.stopImmediatePropagation();

      const searchToolItem = e.target.closest(".search-tool-item");

      if (!searchToolItem) return;
      const searchTool = searchToolItem.getAttribute("data-tool");

      if (!searchTool) return;

      // Handle the tool selection
      this.handleToolSelection(searchTool, searchToolItem);

      this.clearSearch();
    });

    // Add back button handlers
    this.addBackButtonHandlers();

    // Add emoji tab handlers
    this.addEmojiTabHandlers();
    this.addSectionToggleHandlers();
    this.addEmojiClickHandlers();
    this.addSeeMoreHandlers();
  }

  //
  addBackButtonHandlers() {
    const backButtons = document.querySelectorAll("[data-back]");
    backButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const backTo = button.getAttribute("data-back");
        if (backTo === "main") {
          this.showMainContent();
        }
      });
    });
  }

  //
  addEmojiTabHandlers() {
    const emojiTabs = document.querySelectorAll(".emoji-tab");
    const tabContents = document.querySelectorAll(".emoji-tab-content");

    emojiTabs.forEach((tab) => {
      tab.addEventListener("click", (e) => {
        // Remove active class from all tabs
        emojiTabs.forEach((t) => t.classList.remove("active"));
        // Add active class to clicked tab
        tab.classList.add("active");

        const tabType = tab.getAttribute("data-tab");

        // Hide all tab contents
        tabContents.forEach((content) => content.classList.add(HIDDEN));

        // Show selected tab content
        const activeContent = document.getElementById(`${tabType}MediaContainer`);
        if (activeContent) {
          activeContent.classList.remove(HIDDEN);
        }
      });
    });
  }

  //
  addSectionToggleHandlers() {
    const sectionHeaders = document.querySelectorAll(".section-header");

    sectionHeaders.forEach((header) => {
      header.addEventListener("click", (e) => {
        const toggle = header.querySelector(".section-toggle");
        const content = header.nextElementSibling;

        if (toggle && content) {
          // Toggle the collapsed state
          const isCollapsed = content.classList.contains("collapsed");

          if (isCollapsed) {
            // Expand
            content.classList.remove("collapsed");
            toggle.classList.remove("collapsed");
          } else {
            // Collapse
            content.classList.add("collapsed");
            toggle.classList.add("collapsed");
          }

          const sectionName = header.getAttribute("data-section") || "unknown";
          console.log(`Section ${sectionName} ${isCollapsed ? "expanded" : "collapsed"}`);
        }
      });
    });
  }

  //
  addEmojiClickHandlers() {
    const emojiItems = document.querySelectorAll(".emoji-item");

    emojiItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        const emoji = item.textContent.trim();
        console.log("Emoji clicked:", emoji);

        // Add visual feedback
        item.style.transform = "scale(1.2)";
        setTimeout(() => {
          item.style.transform = "scale(1)";
        }, 150);

        // Here you can add logic to insert the emoji into a text field
        // or perform any other action with the selected emoji
        this.onEmojiSelected(emoji);
      });
    });
  }

  //
  addSeeMoreHandlers() {
    const seeMoreButtons = document.querySelectorAll(".see-more");

    seeMoreButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        console.log("See more clicked");
        // Here you can add logic to load more emojis/stickers
        // For example, expand the grid or load from an API
        this.loadMoreContent(button);
      });
    });
  }

  //
  onEmojiSelected(emoji) {
    // Callback function when an emoji is selected
    // You can customize this based on your needs
    console.log(`Selected emoji: ${emoji}`);

    // Example: Copy to clipboard
    if (navigator.clipboard) {
      navigator.clipboard.writeText(emoji).then(() => {
        console.log("Emoji copied to clipboard");
      });
    }

    // Example: Dispatch custom event
    const event = new CustomEvent("emojiSelected", {
      detail: { emoji: emoji },
    });
    document.dispatchEvent(event);
  }

  //
  loadMoreContent(button) {
    // Function to load more content
    // This is where you'd typically make an API call or expand the current grid
    console.log("Loading more content...");

    // Example: Add loading state
    const originalText = button.innerHTML;
    button.innerHTML = "<span>Loading...</span>";

    // Simulate loading delay
    setTimeout(() => {
      button.innerHTML = originalText;
      console.log("More content loaded");
    }, 1000);
  }

  // Public method to programmatically select a tab
  selectTab(tabName) {
    const tab = document.querySelector(`[data-tab="${tabName}"]`);
    if (tab) {
      tab.click();
    }
  }

  // Public method to toggle a section
  toggleSection(sectionName) {
    const header = document.querySelector(`[data-section="${sectionName}"]`);
    if (header) {
      header.click();
    }
  }

  //
  showMainContent() {
    this.hideAllContent();
    this.mainContent.classList.remove(HIDDEN);
    this.currentView = "main";
  }

  //
  hideAllContent() {
    this.mainContent.classList.add(HIDDEN);
    this.shapesContent.classList.add(HIDDEN);
    this.emojisContent.classList.add(HIDDEN);
  }

  performSearch(query) {
    const searchItems = document.querySelectorAll(".search-tool-item");
    const normalizedQuery = query.toLowerCase().trim();

    searchItems.forEach((item) => {
      const toolTitle = item.querySelector(".tool-title");
      const toolDescription = item.querySelector(".tool-description");

      if (!toolTitle || !toolDescription) return;

      const titleText = toolTitle.textContent.toLowerCase();
      const descriptionText = toolDescription.textContent.toLowerCase();

      // Check if query matches title or description
      const titleMatch = titleText.includes(normalizedQuery);
      const descriptionMatch = descriptionText.includes(normalizedQuery);
      const hasMatch = titleMatch || descriptionMatch;

      if (normalizedQuery === "" || hasMatch) {
        item.style.display = "flex";

        // Highlight matches if query is not empty
        if (normalizedQuery !== "") {
          this.highlightText(toolTitle, normalizedQuery);
          this.highlightText(toolDescription, normalizedQuery);
        } else {
          // Clear highlights when search is empty
          this.clearHighlight(toolTitle);
          this.clearHighlight(toolDescription);
        }
      } else {
        item.style.display = "none";
      }
    });
  }

  highlightText(element, query) {
    const originalText = element.getAttribute("data-original-text") || element.textContent;

    // Store original text if not already stored
    if (!element.getAttribute("data-original-text")) {
      element.setAttribute("data-original-text", originalText);
    }

    // Create highlighted version
    const regex = new RegExp(`(${this.escapeRegex(query)})`, "gi");
    const highlightedText = originalText.replace(regex, '<mark class="search-highlight">$1</mark>');

    element.innerHTML = highlightedText;
  }

  clearHighlight(element) {
    const originalText = element.getAttribute("data-original-text");
    if (originalText) {
      element.textContent = originalText;
      element.removeAttribute("data-original-text");
    }
  }

  escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  clearSearch() {
    const searchInput = document.getElementById("toolSearchInput");
    if (searchInput) {
      searchInput.value = "";
      this.performSearch("");
    }
  }

  /**
   * Handle tool selection from search modal
   * Maps search tool names to whiteboard tools and activates them
   */
  handleToolSelection(searchTool, searchToolItem) {
    // Map search tool names to whiteboard tool names
    const toolMapping = {
      card: "card",
      code_block: "codeblock", // Use card for code blocks for now
      dot_voting: "dot-voting", // Use card for voting elements
      flip_card: "flipcard", // Use card for flip cards
      frame: "frame", // Use shape tool for frames
      grid: "grid", // Grid is more of a view option
      "mind-map": "mind-map", // Use card for mind map nodes
      people: "people", // People tool doesn't change drawing mode
      lines: "lines",
      emoji: "emoji", // Emoji insertion doesn't change tool
      sticky: "sticky",
      templates: "templates", // Template selection doesn't change tool
    };

    const whiteboardTool = toolMapping[searchTool];

    if (!whiteboardTool) {
      console.warn(`No whiteboard tool mapping found for: ${searchTool}`);
      return;
    }

    // Shapes/Lines Option
    if (whiteboardTool === "lines") {
      //
      this.hideAllContent();

      this.shapesContent.classList.remove(HIDDEN);
      this.currentView = "shapes";
      return;
    }

    if (whiteboardTool === "emoji") {
      //
      this.hideAllContent();

      this.emojisContent.classList.remove(HIDDEN);
      this.currentView = "emojis";
      return;
    }

    // Close the search modal
    this.searchModal.classList.add(HIDDEN);

    // Template Modal
    if (searchTool === "templates") {
      this.dynamicToolBar.classList.add(HIDDEN);
      document.getElementById("templateModal").classList.remove(HIDDEN);
      document.getElementById("templateModalbutton").classList.add("active");
      this.searchModal.classList.add(HIDDEN);
      return;
    }

    // Doy Voting
    if (whiteboardTool === "dot-voting") {
      document.getElementById("dotVotingContainer").classList.remove(HIDDEN);
      return;
    }

    // Sticky Note
    if (whiteboardTool === "sticky") {
      document.getElementById("noteToolbarButton").click();
      return;
    }

    // Set the tool in the whiteboard app
    if (window.app && typeof window.app.setTool === "function") {
      window.app.setTool(whiteboardTool);

      // Update UI to reflect the selected tool
      this.updateToolbarUI(whiteboardTool);

      // Show relevant tool-specific UI
      this.showToolSpecificUI(searchTool, whiteboardTool);

      //
      this.dynamicToolBar.classList.remove(HIDDEN);
      this.dynamicToolBar.classList.add("active");
      this.dynamicToolBar.innerHTML = searchToolItem.querySelector(".tool-icon").innerHTML;
      this.dynamicToolBar.setAttribute("data-tool", searchTool);
      this.dynamicToolBar.setAttribute("data-tippy-content", searchToolItem.querySelector(".tool-title").textContent);
      this.dynamicToolBar.setAttribute("data-aria-label", searchToolItem.querySelector(".tool-description").textContent);

      // Grid Option
      if (whiteboardTool === "grid") {
        this.searchModal.classList.add(HIDDEN);
        this.dynamicToolBar.click();
        return;
      }
    } else {
      console.warn("Whiteboard app not found or setTool method not available");
    }
  }

  /**
   * Update the main toolbar UI to reflect the selected tool
   */
  updateToolbarUI(whiteboardTool) {
    // Clear all active states
    document.querySelectorAll('.toolbar button, [id$="ToolbarButton"]').forEach((btn) => {
      btn.classList.remove("active");
    });

    // Map whiteboard tools to their UI button IDs
    const buttonMapping = {
      select: "pointerToolbarButton",
      pen: "penToolbarButton",
      card: "cardToolbarButton",
      text: "textToolbarButton",
      shape: "shapeToolbarButton",
      note: "noteToolbarButton",
      arrow: "arrowToolbarButton",
    };

    const buttonId = buttonMapping[whiteboardTool];
    if (buttonId) {
      const button = document.getElementById(buttonId);
      if (button) {
        button.classList.add("active");
      }
    }
  }

  /**
   * Show tool-specific UI elements when a tool is selected
   */
  showToolSpecificUI(searchTool, whiteboardTool) {
    // Hide all tool-specific containers first
    document.querySelectorAll('[id$="ManagerContainer"]').forEach((container) => {
      container.classList.remove("active");
    });

    // Show relevant tool containers
    const containerMapping = {
      card: "cardManagerContainer",
      pen: "penManagerContainer",
      shapes: "shapeManagerContainer",
      "sticky-notes": "noteManagerContainer",
    };

    const containerId = containerMapping[searchTool];
    if (containerId) {
      const container = document.getElementById(containerId);
      if (container) {
        container.classList.add("active");
      }
    }

    // Handle special cases
    switch (searchTool) {
      case "grid":
        // Toggle grid visibility
        if (window.app && window.app.grid && typeof window.app.grid.toggle === "function") {
          window.app.grid.toggle();
        }
        break;

      case "people":
        // Show people/collaboration panel
        const peoplePanel = document.getElementById("peoplePanel");
        if (peoplePanel) {
          peoplePanel.classList.remove(HIDDEN);
        }
        break;

      case "templates":
        // Show template selection modal
        const templateModal = document.getElementById("templateModal");
        if (templateModal) {
          templateModal.classList.remove(HIDDEN);
        }
        break;
    }
  }
}

new WhiteboardSearchTools();
