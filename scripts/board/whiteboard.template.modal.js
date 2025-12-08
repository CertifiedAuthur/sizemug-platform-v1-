class TemplateModal {
  constructor() {
    this.templateButton = document.getElementById("templateModalbutton");
    this.templateModal = document.getElementById("templateModal");
    this.closeButton = this.templateModal?.querySelector(".close-btn");
    this.searchInput = this.templateModal?.querySelector(".search-input");
    this.sidebarItems = this.templateModal?.querySelectorAll(".sidebar-section li");
    this.useTemplateButtons = this.templateModal?.querySelectorAll(".use-template-btn");
    this.previewButtons = this.templateModal?.querySelectorAll(".preview-btn");
    this.templateCards = this.templateModal?.querySelectorAll(".template-card");
    this.addUsersButton = this.templateModal?.querySelector(".add-users");
    this.userTemplatesSection = this.templateModal?.querySelector(".user-templates-list");

    // Add users popup state
    this.addUsersPopup = null;
    this.addedUsers = new Set();
    this.currentView = "All-templates";
    this.selectedUser = null;

    // Template data arrays
    this.allTemplates = [
      {
        id: 13,
        name: "Simple Mind Map",
        category: "Ideation & Brainstorming",
        categoryClass: "ideation",
        author: {
          name: "Catherine Zhang",
          initials: "CZ",
          hasImage: false,
        },
      },
      {
        id: 14,
        name: "Lunch Decision Map",
        category: "Ideation & Brainstorming",
        categoryClass: "ideation",
        author: {
          name: "David Kim",
          initials: "DK",
          hasImage: false,
        },
      },
      {
        id: 15,
        name: "E-commerce User Flow",
        category: "Diagramming & Mapping",
        categoryClass: "diagramming",
        author: {
          name: "Catherine Smith",
          initials: "CS",
          hasImage: false,
        },
      },
      {
        id: 16,
        name: "Footballing Tactics",
        category: "Ideation & Brainstorming",
        categoryClass: "ideation",
        author: {
          name: "David Kim",
          initials: "DK",
          hasImage: false,
        },
      },
      {
        id: 17,
        name: "Restaurant Service Flow",
        category: "Diagramming & Mapping",
        categoryClass: "diagramming",
        author: {
          name: "Catherine Smith",
          initials: "CS",
          hasImage: false,
        },
      },
      {
        id: 18,
        name: "Meeting Notes - White",
        category: "Meetings & Workshops",
        categoryClass: "meetings",
        author: {
          name: "Amy Stacy",
          initials: "AS",
          hasImage: true,
          imageUrl: "https://images.unsplash.com/photo-1541752171745-4176eee47556?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGZpbmUlMjBtYWxlJTIwcHJvZmlsZSUyMHdpdGglMjBicmVhc3R8ZW58MHx8MHx8fDA%3D",
        },
      },
      {
        id: 19,
        name: "Meeting Notes - Purple",
        category: "Meetings & Workshops",
        categoryClass: "meetings",
        author: {
          name: "Amy Stacy",
          initials: "AS",
          hasImage: true,
          imageUrl: "https://images.unsplash.com/photo-1541752171745-4176eee47556?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGZpbmUlMjBtYWxlJTIwcHJvZmlsZSUyMHdpdGglMjBicmVhc3R8ZW58MHx8MHx8fDA%3D",
        },
      },
      {
        id: 20,
        name: "Discussion Topic Frame - Blue",
        category: "Meetings & Workshops",
        categoryClass: "meetings",
        author: {
          name: "David Kim",
          initials: "DK",
          hasImage: false,
        },
      },
      {
        id: 21,
        name: "Meeting Agenda - White",
        category: "Meetings & Workshops",
        categoryClass: "meetings",
        author: {
          name: "David Kim",
          initials: "DK",
          hasImage: false,
        },
      },
      {
        id: 22,
        name: "Meeting Agenda - Yellow",
        category: "Meetings & Workshops",
        categoryClass: "meetings",
        author: {
          name: "David Kim",
          initials: "DK",
          hasImage: false,
        },
      },
      {
        id: 23,
        name: "Daily Standup Board",
        category: "Agile Workflows",
        categoryClass: "agile",
        author: {
          name: "Brian Lee",
          initials: "BL",
          hasImage: false,
        },
      },
    ];

    // Custom templates for Sizemug
    this.customTemplates = [
      {
        id: 101,
        name: "Sizemug Brand Guidelines",
        category: "Strategy & Planning",
        categoryClass: "strategy",
        author: {
          name: "Sizemug",
          initials: "ST",
          hasImage: true,
          imageUrl: "./logo-black.svg",
        },
        isCustom: true,
        templateImage: "./sizemug_template_1.svg",
      },
      {
        id: 102,
        name: "Product Launch Checklist",
        category: "Strategy & Planning",
        categoryClass: "strategy",
        author: {
          name: "Sizemug",
          initials: "ST",
          hasImage: true,
          imageUrl: "./logo-black.svg",
        },
        isCustom: true,
        templateImage: "./sizemug_temp_2.svg",
      },
      {
        id: 103,
        name: "Team Onboarding Flow",
        category: "Meetings & Workshops",
        categoryClass: "meetings",
        author: {
          name: "Sizemug",
          initials: "ST",
          hasImage: true,
          imageUrl: "./logo-black.svg",
        },
        isCustom: true,
        templateImage: "./sizemug_temp_3.svg",
      },
      {
        id: 104,
        name: "Feature Request Template",
        category: "Agile Workflows",
        categoryClass: "agile",
        author: {
          name: "Sizemug",
          initials: "ST",
          hasImage: true,
          imageUrl: "./logo-black.svg",
        },
        isCustom: true,
        templateImage: "./sizemug_temp_4.svg",
      },
      {
        id: 105,
        name: "Sizemug Brand Guidelines",
        category: "Strategy & Planning",
        categoryClass: "strategy",
        author: {
          name: "Sizemug",
          initials: "ST",
          hasImage: true,
          imageUrl: "./logo-black.svg",
        },
        isCustom: true,
        templateImage: "./sizemug_temp_5.svg",
      },
      {
        id: 106,
        name: "Product Launch Checklist",
        category: "Strategy & Planning",
        categoryClass: "strategy",
        author: {
          name: "Sizemug",
          initials: "ST",
          hasImage: true,
          imageUrl: "./logo-black.svg",
        },
        isCustom: true,
        templateImage: "./sizemug_temp_6.svg",
      },
      {
        id: 107,
        name: "Team Onboarding Flow",
        category: "Meetings & Workshops",
        categoryClass: "meetings",
        author: {
          name: "Sizemug",
          initials: "ST",
          hasImage: true,
          imageUrl: "./logo-black.svg",
        },
        isCustom: true,
        templateImage: "./sizemug_temp_7.svg",
      },
      {
        id: 108,
        name: "Feature Request Template",
        category: "Agile Workflows",
        categoryClass: "agile",
        author: {
          name: "Sizemug",
          initials: "ST",
          hasImage: true,
          imageUrl: "./logo-black.svg",
        },
        isCustom: true,
        templateImage: "./sizemug_temp_8.svg",
      },
      {
        id: 109,
        name: "Sizemug Brand Guidelines",
        category: "Strategy & Planning",
        categoryClass: "strategy",
        author: {
          name: "Sizemug",
          initials: "ST",
          hasImage: true,
          imageUrl: "./logo-black.svg",
        },
        isCustom: true,
        templateImage: "./sizemug_temp_9.svg",
      },
      {
        id: 110,
        name: "Product Launch Checklist",
        category: "Strategy & Planning",
        categoryClass: "strategy",
        author: {
          name: "Sizemug",
          initials: "ST",
          hasImage: true,
          imageUrl: "./logo-black.svg",
        },
        isCustom: true,
        templateImage: "./sizemug_temp_10.svg",
      },
      {
        id: 111,
        name: "Team Onboarding Flow",
        category: "Meetings & Workshops",
        categoryClass: "meetings",
        author: {
          name: "Sizemug",
          initials: "ST",
          hasImage: true,
          imageUrl: "./logo-black.svg",
        },
        isCustom: true,
        templateImage: "./sizemug_temp_11.svg",
      },
      {
        id: 112,
        name: "Feature Request Template",
        category: "Agile Workflows",
        categoryClass: "agile",
        author: {
          name: "Sizemug",
          initials: "ST",
          hasImage: true,
          imageUrl: "./logo-black.svg",
        },
        isCustom: true,
        templateImage: "./sizemug_temp_12.svg",
      },
    ];

    // Sample user data
    this.availableUsers = [
      {
        id: 1,
        name: "Amy Stacy",
        initials: "AS",
        isPopular: true,
        isFollowing: false,
        profileImage: "https://randomuser.me/api/portraits/women/21.jpg",
      },
      {
        id: 2,
        name: "Brian Lee",
        initials: "BL",
        isPopular: false,
        isFollowing: true,
        profileImage: "https://randomuser.me/api/portraits/men/22.jpg",
      },
      {
        id: 3,
        name: "Catherine Zhang",
        initials: "CZ",
        isPopular: true,
        isFollowing: false,
        profileImage: "https://randomuser.me/api/portraits/women/23.jpg",
      },
      {
        id: 4,
        name: "David Kim",
        initials: "DK",
        isPopular: false,
        isFollowing: true,
        profileImage: "https://randomuser.me/api/portraits/men/24.jpg",
      },
      {
        id: 5,
        name: "Catherine Smith",
        initials: "CS",
        isPopular: true,
        isFollowing: false,
        profileImage: "https://randomuser.me/api/portraits/women/25.jpg",
      },
    ];

    // Sample user templates data
    this.userTemplates = {
      1: [
        // Amy Stacy
        {
          name: "Product Roadmap",
          category: "Meetings & Workshops",
          categoryClass: "meetings",
          description: "A comprehensive template to outline strategic product milestones, feature releases, and timeline dependencies, enabling cross-functional teams to align on long-term vision.",
        },
        {
          name: "Sprint Planning",
          category: "Agile Workflows",
          categoryClass: "agile",
        },
      ],
      2: [
        // Brian Lee
        {
          name: "UX Research Canvas",
          category: "Agile Workflows",
          categoryClass: "agile",
        },
      ],
    };

    this.bindEvents();
  }

  // Create a single template card HTML
  createTemplateCardHTML(template) {
    const authorHTML = template.author.hasImage ? `<img src="${template.author.imageUrl}" alt="${template.author.name}" />` : template.author.initials;

    return `
      <div class="template-card" data-template-id="${template.id}">
        <div class="author">
          <div class="avatar">
            ${authorHTML}
          </div>
          <span>${template.author.name}</span>
        </div>
        <div class="card-image">
          <div class="placeholder-image">
            ${template.isCustom ? `<img src="${template.templateImage}" alt="${template.name} Template" />` : `<canvas class="template-card-canvas" data-template-id="${template.id}"></canvas>`}
          </div>
          <div class="card-actions">
            <div class="star-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#ffffff" d="m12 17.275l-4.15 2.5q-.275.175-.575.15t-.525-.2t-.35-.437t-.05-.588l1.1-4.725L3.775 10.8q-.25-.225-.312-.513t.037-.562t.3-.45t.55-.225l4.85-.425l1.875-4.45q.125-.3.388-.45t.537-.15t.537.15t.388.45l1.875 4.45l4.85.425q.35.05.55.225t.3.45t.038.563t-.313.512l-3.675 3.175l1.1 4.725q.075.325-.05.588t-.35.437t-.525.2t-.575-.15z"/></svg>
            </div>
            <div class="use-preview-buttons">
              <button class="use-template-btn">Use Template</button>
              <button class="preview-btn">Preview</button>
            </div>
          </div>
        </div>
        <div class="card-content">
          <h4>${template.name}</h4>
          <span class="category ${template.categoryClass}">${template.category}</span>
        </div>
      </div>
    `;
  }

  // Generate templates HTML from array
  createTemplatesHTML(templates) {
    return templates.map((template) => this.createTemplateCardHTML(template)).join("");
  }

  // Filter templates by category
  getTemplatesByCategory(category) {
    switch (category.toLowerCase()) {
      case "meetings & workshops":
        return this.allTemplates.filter((t) => t.category === "Meetings & Workshops");
      case "ideation & brainstorming":
        return this.allTemplates.filter((t) => t.category === "Ideation & Brainstorming");
      case "research & design":
        return this.allTemplates.filter((t) => t.category === "Research & Design");
      case "agile workflows":
        return this.allTemplates.filter((t) => t.category === "Agile Workflows");
      case "strategy & planning":
        return this.allTemplates.filter((t) => t.category === "Strategy & Planning");
      case "diagramming & mapping":
        return this.allTemplates.filter((t) => t.category === "Diagramming & Mapping");
      default:
        return this.allTemplates;
    }
  }

  // Show all templates
  showAllTemplates() {
    this.currentView = "all-templates";
    this.selectedUser = null;
    const mainContent = this.templateModal.querySelector(".main-content");
    if (!mainContent) return;

    mainContent.innerHTML = `
      <h2>All Templates</h2>
      <div class="templates-grid">
        ${this.createTemplatesHTML(this.allTemplates)}
      </div>
    `;

    this.refreshTemplateCards();
  }

  // Show templates by category
  showTemplatesByCategory(category) {
    this.currentView = "category-templates";
    this.selectedUser = null;
    const mainContent = this.templateModal.querySelector(".main-content");
    if (!mainContent) return;

    const filteredTemplates = this.getTemplatesByCategory(category);

    mainContent.innerHTML = `
      <h2>${category}</h2>
      <div class="templates-grid">
        ${this.createTemplatesHTML(filteredTemplates)}
      </div>
    `;

    this.refreshTemplateCards();
  }

  // Show custom templates (Sizemug Custom)
  showCustomTemplates() {
    this.currentView = "custom-templates";
    this.selectedUser = null;
    const mainContent = this.templateModal.querySelector(".main-content");
    if (!mainContent) return;

    mainContent.innerHTML = `
      <h2>Sizemug Custom Templates</h2>
      <div class="templates-grid">
        ${this.createTemplatesHTML(this.customTemplates)}
      </div>
    `;

    this.refreshTemplateCards();
  }

  // Show recent templates
  showRecentTemplates() {
    this.currentView = "recent-templates";
    this.selectedUser = null;
    const mainContent = this.templateModal.querySelector(".main-content");
    if (!mainContent) return;

    // Get last 6 templates as "recent"
    const recentTemplates = this.allTemplates.slice(-6);

    mainContent.innerHTML = `
      <h2>Recent Templates</h2>
      <div class="templates-grid">
        ${this.createTemplatesHTML(recentTemplates)}
      </div>
    `;

    this.refreshTemplateCards();
  }

  // Show favourite templates
  showFavouriteTemplates() {
    this.currentView = "favourite-templates";
    this.selectedUser = null;
    const mainContent = this.templateModal.querySelector(".main-content");
    if (!mainContent) return;

    // Get first 4 templates as "favourites" for demo
    const favouriteTemplates = this.allTemplates.slice(0, 4);

    mainContent.innerHTML = `
      <h2>Favourite Templates</h2>
      <div class="templates-grid">
        ${this.createTemplatesHTML(favouriteTemplates)}
      </div>
    `;

    this.refreshTemplateCards();
  }

  // Handle sidebar clicks
  handleSidebarClick(clickedItem) {
    // Remove active class from all items
    this.sidebarItems?.forEach((item) => {
      item.classList.remove("active");
    });

    // Add active class to clicked item
    clickedItem.classList.add("active");

    // Handle different sidebar sections
    const itemText = clickedItem.textContent.trim();

    switch (itemText) {
      case "All Templates":
        this.showAllTemplates();
        break;
      case "Recents":
        this.showRecentTemplates();
        break;
      case "Meetings & Workshops":
        this.showTemplatesByCategory("Meetings & Workshops");
        break;
      case "Ideation & Brainstorming":
        this.showTemplatesByCategory("Ideation & Brainstorming");
        break;
      case "Research & Design":
        this.showTemplatesByCategory("Research & Design");
        break;
      case "Agile Workflows":
        this.showTemplatesByCategory("Agile Workflows");
        break;
      case "Strategy & Planning":
        this.showTemplatesByCategory("Strategy & Planning");
        break;
      case "Diagramming & Mapping":
        this.showTemplatesByCategory("Diagramming & Mapping");
        break;
      case "Sizemug Custom":
        this.showCustomTemplates();
        break;
      case "Favourite":
        this.showFavouriteTemplates();
        break;
      default:
        this.showAllTemplates();
        break;
    }
  }

  // Remove the old createOriginalTemplatesHTML method since we're using the new dynamic approach

  bindEvents() {
    // Open modal
    if (this.templateButton) {
      this.templateButton.addEventListener("click", () => {
        this.showTemplateModal();
      });
    }

    // Close modal
    if (this.closeButton) {
      this.closeButton.addEventListener("click", () => {
        this.hideTemplateModal();
      });
    }

    // Close modal when clicking outside
    if (this.templateModal) {
      this.templateModal.addEventListener("click", (e) => {
        if (e.target === this.templateModal) {
          this.hideTemplateModal();
        }
      });
    }

    // Close modal with Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isModalVisible()) {
        this.hideTemplateModal();
      }
    });

    // Add Users button
    if (this.addUsersButton) {
      this.addUsersButton.addEventListener("click", (e) => {
        e.stopPropagation();
        this.showAddUsersPopup();
      });
    }

    // Sidebar navigation
    this.sidebarItems?.forEach((item) => {
      item.addEventListener("click", () => {
        this.handleSidebarClick(item);
      });
    });

    // Search functionality
    if (this.searchInput) {
      this.searchInput.addEventListener("input", (e) => {
        this.handleSearch(e.target.value);
      });
    }

    // Close popup when clicking outside
    document.addEventListener("click", (e) => {
      if (this.addUsersPopup && !this.addUsersPopup.contains(e.target) && !this.addUsersButton?.contains(e.target)) {
        this.hideAddUsersPopup();
      }
    });

    // Bind custom dropdown
    this.bindCustomDropdown();
  }

  // Load template into whiteboard
  useTemplate(templateId) {
    const templateData = this.getTemplateData(templateId);
    if (!templateData) {
      console.error("Template not found:", templateId);
      return;
    }

    // Clear current whiteboard
    if (window.app) {
      this.clearWhiteboard();

      // Load template data
      this.loadTemplateData(templateData);

      // Close modal
      this.hideTemplateModal();

      // Show success message
      this.showNotification(`Template "${templateData.name}" loaded successfully!`);
    }
  }

  toggleFavourite(templateId, starIcon) {
    // Toggle the favorite state
    const isFavorite = starIcon.classList.toggle("active");

    // Update the star icon color
    const starPath = starIcon.querySelector("path");
    if (starPath) {
      starPath.setAttribute("fill", isFavorite ? "#FFD700" : "#ffffff");
    }

    const templateData = this.getTemplateData(templateId);
    if (templateData) {
      this.handleAddToFavourite(templateData.name);
    }
  }

  // Preview template (could open in new tab or show preview modal)
  previewTemplate(templateId) {
    const templateData = this.getTemplateData(templateId);
    if (!templateData) {
      console.error("Template not found:", templateId);
      return;
    }

    this.showPreviewModal(templateData);
  }

  // Show preview modal with template preview
  showPreviewModal(templateData) {
    // Create preview modal
    const previewModal = document.createElement("div");
    previewModal.className = "template-preview-modal";
    previewModal.innerHTML = `
      <div class="preview-modal-content">
        <div class="preview-header">
          <h2>${templateData.name}</h2>
          <button class="preview-close-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        <div class="preview-canvas-container">
          <canvas id="templatePreviewCanvas"></canvas>
        </div>
        <div class="preview-actions">
          <button class="preview-use-btn">Use This Template</button>
        </div>
      </div>
    `;

    document.body.appendChild(previewModal);

    // Add styles
    this.addPreviewModalStyles();

    // Render preview
    setTimeout(() => {
      this.renderTemplatePreview(templateData);
    }, 100);

    // Bind events
    const closeBtn = previewModal.querySelector(".preview-close-btn");
    const useBtn = previewModal.querySelector(".preview-use-btn");

    closeBtn.addEventListener("click", () => {
      previewModal.remove();
    });

    useBtn.addEventListener("click", () => {
      previewModal.remove();
      this.useTemplate(templateData.id);
    });

    previewModal.addEventListener("click", (e) => {
      if (e.target === previewModal) {
        previewModal.remove();
      }
    });
  }

  // Render template preview on canvas
  renderTemplatePreview(templateData) {
    const canvas = document.getElementById("templatePreviewCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const container = canvas.parentElement;

    // Set canvas size
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    // Clear canvas
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate scale to fit content
    const scale = 0.8;
    const offsetX = 50;
    const offsetY = 50;

    const data = templateData.data;

    try {
      // Draw shapes
      if (data.shapes) {
        data.shapes.forEach((shape) => {
          ctx.save();
          ctx.fillStyle = shape.attrs.fill || "#e0e0e0";
          ctx.strokeStyle = shape.attrs.stroke || "#000000";
          ctx.lineWidth = shape.attrs["stroke-width"] || 1;

          const x = shape.x * scale + offsetX;
          const y = shape.y * scale + offsetY;
          const width = shape.attrs.width * scale;
          const height = shape.attrs.height * scale;

          if (shape.type === "rectangle") {
            const rx = (shape.attrs.rx || 0) * scale;
            if (rx > 0) {
              this.drawRoundedRect(ctx, x, y, width, height, rx);
            } else {
              ctx.fillRect(x, y, width, height);
              ctx.strokeRect(x, y, width, height);
            }
          } else if (shape.type === "circle") {
            const radius = (shape.attrs.r || 50) * scale;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          }
          ctx.restore();
        });
      }

      // Draw texts
      if (data.texts) {
        data.texts.forEach((text) => {
          ctx.save();
          const fontSize = parseInt(text.style?.fontSize || "16px") * scale;
          ctx.font = `${text.style?.fontWeight || "normal"} ${fontSize}px Arial`;
          ctx.fillStyle = text.style?.color || "#000000";
          ctx.fillText(text.content, text.x * scale + offsetX, text.y * scale + offsetY);
          ctx.restore();
        });
      }

      // Draw notes
      if (data.notes) {
        data.notes.forEach((note) => {
          ctx.save();
          const x = note.x * scale + offsetX;
          const y = note.y * scale + offsetY;
          const width = 120 * scale;
          const height = 100 * scale;

          // Note background
          ctx.fillStyle = note.color || "#fef3c7";
          ctx.fillRect(x, y, width, height);
          ctx.strokeStyle = "#d97706";
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, width, height);

          // Note text
          ctx.fillStyle = "#000000";
          ctx.font = `${12 * scale}px Arial`;
          const lines = note.content.split("\n");
          lines.forEach((line, i) => {
            ctx.fillText(line, x + 10, y + 20 + i * 15 * scale, width - 20);
          });
          ctx.restore();
        });
      }

      // Draw cards
      if (data.cards) {
        data.cards.forEach((card) => {
          ctx.save();
          const x = card.x * scale + offsetX;
          const y = card.y * scale + offsetY;
          const width = 150 * scale;
          const height = 100 * scale;

          // Card background
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(x, y, width, height);
          ctx.strokeStyle = "#e5e7eb";
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, width, height);

          // Card text
          ctx.fillStyle = "#000000";
          ctx.font = `${12 * scale}px Arial`;
          const lines = card.content.split("\n");
          lines.forEach((line, i) => {
            ctx.fillText(line, x + 10, y + 20 + i * 15 * scale, width - 20);
          });
          ctx.restore();
        });
      }

      // Draw arrows
      if (data.arrows) {
        data.arrows.forEach((arrow) => {
          ctx.save();
          ctx.strokeStyle = arrow.color || "#0284c7";
          ctx.lineWidth = (arrow.width || 2) * scale;
          ctx.beginPath();
          arrow.points.forEach((point, i) => {
            const x = point.x * scale + offsetX;
            const y = point.y * scale + offsetY;
            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          });
          ctx.stroke();
          ctx.restore();
        });
      }

      // Draw mind map nodes
      if (data.mindmap?.nodes) {
        data.mindmap.nodes.forEach((node) => {
          ctx.save();
          const x = node.x * scale + offsetX;
          const y = node.y * scale + offsetY;
          const width = 100 * scale;
          const height = 40 * scale;

          // Node background
          ctx.fillStyle = "#dbeafe";
          this.drawRoundedRect(ctx, x - width / 2, y - height / 2, width, height, 8 * scale);
          ctx.strokeStyle = "#0284c7";
          ctx.lineWidth = 2;
          ctx.stroke();

          // Node text
          ctx.fillStyle = "#000000";
          ctx.font = `${12 * scale}px Arial`;
          ctx.textAlign = "center";
          ctx.fillText(node.text, x, y + 5);
          ctx.restore();
        });
      }
    } catch (error) {
      console.error("Error rendering preview:", error);
      ctx.fillStyle = "#000000";
      ctx.font = "16px Arial";
      ctx.fillText("Preview not available", canvas.width / 2 - 80, canvas.height / 2);
    }
  }

  // Helper to draw rounded rectangles
  drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  // Add preview modal styles
  addPreviewModalStyles() {
    if (document.getElementById("preview-modal-styles")) return;

    const style = document.createElement("style");
    style.id = "preview-modal-styles";
    style.textContent = `
      .template-preview-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.2s ease;
      }

      .preview-modal-content {
        background: white;
        border-radius: 12px;
        width: 90%;
        max-width: 1200px;
        height: 80vh;
        display: flex;
        flex-direction: column;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      }

      .preview-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 24px;
        border-bottom: 1px solid #e5e7eb;
      }

      .preview-header h2 {
        margin: 0;
        font-size: 24px;
        font-weight: 600;
      }

      .preview-close-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 8px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s;
      }

      .preview-close-btn:hover {
        background: #f3f4f6;
      }

      .preview-canvas-container {
        flex: 1;
        padding: 24px;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f9fafb;
      }

      #templatePreviewCanvas {
        max-width: 100%;
        max-height: 100%;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        background: white;
      }

      .preview-actions {
        padding: 20px 24px;
        border-top: 1px solid #e5e7eb;
        display: flex;
        justify-content: flex-end;
        gap: 12px;
      }

      .preview-use-btn {
        background: #0284c7;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.2s;
      }

      .preview-use-btn:hover {
        background: #0369a1;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Clear whiteboard
  clearWhiteboard() {
    if (!window.app) return;

    try {
      // Clear ink strokes
      if (window.app.ink?.clear) {
        window.app.ink.clear();
      }

      // Clear arrows
      if (window.app.arrows?.clear) {
        window.app.arrows.clear();
      }

      // Clear shapes
      if (window.app.shapes?.clear) {
        window.app.shapes.clear();
      }

      // Clear texts
      if (window.app.texts?.items) {
        const textIds = Array.from(window.app.texts.items.keys());
        textIds.forEach((id) => window.app.texts.remove(id));
      }

      // Clear notes
      if (window.app.notes?.items) {
        const noteIds = Array.from(window.app.notes.items.keys());
        noteIds.forEach((id) => window.app.notes.remove(id));
      }

      // Clear cards
      if (window.app.cards?.items) {
        const cardIds = Array.from(window.app.cards.items.keys());
        cardIds.forEach((id) => window.app.cards.remove(id));
      }

      // Clear flip cards
      if (window.app.flipcards?.items) {
        const flipcardIds = Array.from(window.app.flipcards.items.keys());
        flipcardIds.forEach((id) => window.app.flipcards.remove(id));
      }

      // Clear code blocks
      if (window.app.codeblocks?.items) {
        const codeblockIds = Array.from(window.app.codeblocks.items.keys());
        codeblockIds.forEach((id) => window.app.codeblocks.remove(id));
      }

      // Clear frames
      if (window.app.frames?.items) {
        const frameIds = Array.from(window.app.frames.items.keys());
        frameIds.forEach((id) => window.app.frames.remove(id));
      }

      // Clear people
      if (window.app.people?.items) {
        const peopleIds = Array.from(window.app.people.items.keys());
        peopleIds.forEach((id) => window.app.people.remove(id));
      }

      // Clear grid tables
      if (window.app.gridtables?.items) {
        const tableIds = Array.from(window.app.gridtables.items.keys());
        tableIds.forEach((id) => window.app.gridtables.remove(id));
      }

      // Clear mind map nodes
      if (window.app.mindmap?.nodes) {
        const nodeIds = Array.from(window.app.mindmap.nodes.keys());
        nodeIds.forEach((id) => window.app.mindmap.remove(id));
      }

      // Clear comments
      if (window.app.comments?.clear) {
        window.app.comments.clear();
      }

      // Clear stickers
      if (window.app.stickers?.clear) {
        window.app.stickers.clear();
      }

      // Clear emojis
      if (window.app.emojis?.clear) {
        window.app.emojis.clear();
      }

      // Redraw canvas
      if (window.app.redrawCanvas) {
        window.app.redrawCanvas();
      }
    } catch (error) {
      console.error("Error clearing whiteboard:", error);
    }
  }

  // Load template data into whiteboard
  loadTemplateData(templateData) {
    if (!window.app || !templateData.data) return;

    try {
      const { texts, notes, cards, shapes, arrows, ink, mindmap } = templateData.data;

      // Load texts
      if (texts && window.app.texts?.create) {
        texts.forEach((text) => {
          try {
            const id = window.app.texts.create(text.x, text.y, text.content || "");
            const item = window.app.texts.items?.get(id);
            if (item?.wrap && text.style) {
              Object.assign(item.wrap.style, text.style);
            }
          } catch (e) {
            console.warn("Error loading text:", e);
          }
        });
      }

      // Load notes
      if (notes && window.app.notes?.create) {
        notes.forEach((note) => {
          try {
            window.app.notes.create(note.x, note.y, note.content || "", note.color);
          } catch (e) {
            console.warn("Error loading note:", e);
          }
        });
      }

      // Load cards
      if (cards && window.app.cards?.create) {
        cards.forEach((card) => {
          try {
            window.app.cards.create(card.x, card.y, card.content || "");
          } catch (e) {
            console.warn("Error loading card:", e);
          }
        });
      }

      // Load shapes
      if (shapes && window.app.shapes?.create) {
        shapes.forEach((shape) => {
          try {
            window.app.shapes.create(shape.type, { x: shape.x, y: shape.y }, shape.attrs);
          } catch (e) {
            console.warn("Error loading shape:", e);
          }
        });
      }

      // Load arrows
      if (arrows && window.app.arrows) {
        arrows.forEach((arrow) => {
          try {
            const arrowObj = {
              id: "arrow-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9),
              points: arrow.points,
              color: arrow.color || "#000000",
              width: arrow.width || 3,
              type: arrow.type || "straight",
              bounds: null,
            };
            window.app.arrows.arrows.push(arrowObj);
          } catch (e) {
            console.warn("Error loading arrow:", e);
          }
        });
      }

      // Load ink strokes
      if (ink && window.app.ink?.addStroke) {
        ink.forEach((stroke) => {
          try {
            window.app.ink.addStroke(stroke);
          } catch (e) {
            console.warn("Error loading ink stroke:", e);
          }
        });
      }

      // Load mind map
      if (mindmap?.nodes && window.app.mindmap?.createNode) {
        mindmap.nodes.forEach((node) => {
          try {
            window.app.mindmap.createNode(node.x, node.y, node.text, node.parentId);
          } catch (e) {
            console.warn("Error loading mind map node:", e);
          }
        });
      }

      // Redraw everything
      if (window.app.redrawCanvas) {
        window.app.redrawCanvas();
      }
    } catch (error) {
      console.error("Error loading template data:", error);
    }
  }

  // Show notification
  showNotification(message) {
    const notification = document.createElement("div");
    notification.className = "template-notification";
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = "slideOut 0.3s ease";
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  showTemplateModal() {
    if (this.templateModal) {
      this.templateModal.classList.remove(HIDDEN);
      this.templateModal.classList.add("active");
      document.body.style.overflow = "hidden";

      // Initialize with all templates if not already showing content
      if (this.currentView === "All-templates") {
        this.showAllTemplates();
      }
    }
  }

  hideTemplateModal() {
    if (this.templateModal) {
      this.templateModal.classList.add(HIDDEN);
      this.templateModal.classList.remove("active");
      document.body.style.overflow = "auto";
      this.hideAddUsersPopup();
    }
  }

  isModalVisible() {
    return this.templateModal && !this.templateModal.classList.contains(HIDDEN);
  }

  bindCustomDropdown() {
    const dropdown = this.templateModal?.querySelector("#customDropdown");
    if (!dropdown) return;

    const toggle = dropdown.querySelector(".dropdown-toggle");
    const menu = dropdown.querySelector(".dropdown-menu");
    const options = dropdown.querySelectorAll("li");
    const selected = dropdown.querySelector(".selected-option");

    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.classList.toggle("open");
    });

    options.forEach((option) => {
      option.addEventListener("click", () => {
        selected.textContent = option.dataset.value;
        // Mark active item
        options.forEach((o) => o.classList.remove("active"));
        option.classList.add("active");
        dropdown.classList.remove("open");
        // Optionally filter templates based on selected sort
        this.filterTemplatesBySort(option.dataset.value);
      });
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove("open");
      }
    });
  }

  showAddUsersPopup() {
    this.hideAddUsersPopup(); // Remove existing popup if any
    const sidebar = document.querySelector(".modal-content");

    const popup = document.createElement("div");
    popup.className = "add-users-popup";
    popup.innerHTML = this.createAddUsersPopupHTML();

    // Position the popup
    const rect = this.addUsersButton.getBoundingClientRect();
    const modalRect = this.templateModal.getBoundingClientRect();

    popup.style.position = "absolute";
    popup.style.left = `200px`;
    popup.style.top = `60px`;
    popup.style.zIndex = "1001";

    sidebar.appendChild(popup);
    this.addUsersPopup = popup;

    this.bindAddUsersPopupEvents();
  }

  hideAddUsersPopup() {
    if (this.addUsersPopup) {
      this.addUsersPopup.remove();
      this.addUsersPopup = null;
    }
  }

  createAddUsersPopupHTML() {
    return `
      <div class="add-users-content">
        <div class="add-users-header">
          <h3>Add Users</h3>
        </div>
        <div class="add-users-tabs">
          <button class="tab-btn active" data-tab="all">All</button>
          <button class="tab-btn" data-tab="popular">Popular</button>
          <button class="tab-btn" data-tab="followers">Followers</button>
          <button class="tab-btn" data-tab="following">Following</button>
        </div>
          <div class="user-search-container">
            <input type="text" placeholder="Search" class="search-input" />
            <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="#9CA3AF" stroke-width="2" />
              <path d="m21 21-4.35-4.35" stroke="#9CA3AF" stroke-width="2" />
            </svg>
          </div>
        <div class="add-users-list">
          ${this.createUserListHTML("all")}
        </div>
      </div>
    `;
  }

  createUserListHTML(filter) {
    let filteredUsers = this.availableUsers;

    switch (filter) {
      case "popular":
        filteredUsers = this.availableUsers.filter((user) => user.isPopular);
        break;
      case "following":
        filteredUsers = this.availableUsers.filter((user) => user.isFollowing);
        break;
      case "followers":
        filteredUsers = this.availableUsers;
        break;
    }

    return filteredUsers
      .map(
        (user) => `
    <div class="user-item" data-user-id="${user.id}">
      <div class="user-avatar">
        <img src="${user.profileImage}" alt="${user.name}" />
      </div>
      <span class="user-name">${user.name}</span>
      <button class="add-user-btn" ${this.addedUsers.has(user.id) ? "disabled" : ""}>
        ${this.addedUsers.has(user.id) ? "Added" : "+ Add"}
      </button>
    </div>
  `
      )
      .join("");
  }

  bindAddUsersPopupEvents() {
    if (!this.addUsersPopup) return;

    // Tab switching
    const tabButtons = this.addUsersPopup.querySelectorAll(".tab-btn");
    tabButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        tabButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const tab = btn.dataset.tab;
        const usersList = this.addUsersPopup.querySelector(".add-users-list");
        usersList.innerHTML = this.createUserListHTML(tab);
        this.bindUserItemEvents();
      });
    });

    this.bindUserItemEvents();
  }

  bindUserItemEvents() {
    if (!this.addUsersPopup) return;

    const addButtons = this.addUsersPopup.querySelectorAll(".add-user-btn");
    addButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const userItem = btn.closest(".user-item");
        const userId = Number.parseInt(userItem.dataset.userId);
        this.addUser(userId);
        btn.textContent = "Added";
        btn.disabled = true;
      });
    });
  }

  addUser(userId) {
    const user = this.availableUsers.find((u) => u.id === userId);
    if (!user || this.addedUsers.has(userId)) return;

    this.addedUsers.add(userId);
    this.updateUserTemplatesSection();
    this.hideAddUsersPopup();
  }

  updateUserTemplatesSection() {
    const userTemplatesSection = this.templateModal.querySelector(".user-templates-list");
    if (!userTemplatesSection) return;

    const addedUsersArray = Array.from(this.addedUsers)
      .map((id) => this.availableUsers.find((u) => u.id === id))
      .filter(Boolean);

    userTemplatesSection.innerHTML = addedUsersArray
      .map(
        (user) => `
      <li class="user-template-item" data-user-id="${user.id}">
        <div class="added-user">
          <div class="user-avatar small"> <img src="${user.profileImage}" alt="${user.name}" /></div>
          <span class="added-user-name">${user.name}</span>
          <div class="user-status-dot"></div>
        </div>
      </li>
    `
      )
      .join("");

    // Bind click events for user template items
    const userItems = userTemplatesSection.querySelectorAll(".user-template-item");
    userItems.forEach((item) => {
      item.addEventListener("click", () => {
        const userId = Number.parseInt(item.dataset.userId);
        this.showUserTemplates(userId);
        // Update active state
        userItems.forEach((i) => i.classList.remove("active"));
        item.classList.add("active");
      });
    });
  }

  showUserTemplates(userId) {
    const user = this.availableUsers.find((u) => u.id === userId);
    const templates = this.userTemplates[userId] || [];

    this.selectedUser = user;
    this.currentView = "user-templates";

    const mainContent = this.templateModal.querySelector(".main-content");
    if (!mainContent) return;

    if (templates.length === 0) {
      mainContent.innerHTML = `
        <div class="user-templates-view">
          <div class="user-header">
            <button class="back-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="#000" d="M8.293 12.707a1 1 0 0 1 0-1.414l5.657-5.657a1 1 0 1 1 1.414 1.414L10.414 12l4.95 4.95a1 1 0 0 1-1.414 1.414z"/>
              </svg>
            </button>
            <div class="user-info-header">
              <div class="user-avatar"><img src="${user.profileImage}"/></div>
              <span class="user-name">${user.name}</span>
            </div>
          </div>
          <p>No templates available from this user.</p>
        </div>
      `;
    } else {
      const featuredTemplate = templates[0];
      const featuredTemplateId = this.findTemplateIdByName(featuredTemplate.name);
      const otherTemplates = templates.slice(1);

      mainContent.innerHTML = `
        <div class="user-templates-view">
          <div class="user-header">
            <button class="back-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#000" d="M8.293 12.707a1 1 0 0 1 0-1.414l5.657-5.657a1 1 0 1 1 1.414 1.414L10.414 12l4.95 4.95a1 1 0 0 1-1.414 1.414z"/></svg>
            </button>
            <div class="user-info-header">
              <div class="user-avatar"><img src="${user.profileImage}"/></div>
              <span class="user-name">${user.name}</span>
            </div>
          </div>
          
          <div class="featured-template">
            <div class="featured-template-left">
              <div class="template-category">${featuredTemplate.category}</div>
              <h2>${featuredTemplate.name}</h2>
              ${featuredTemplate.description ? `<p class="template-description">${featuredTemplate.description}</p>` : ""}
              <div class="template-actions">
                <button class="use-template-btn primary" data-template-id="${featuredTemplateId}">Use Template</button>
                <button class="add-to-favourite-btn">Add to Favourite</button>
              </div>
            </div>
            <div class="featured-template-preview">
              <canvas id="featuredTemplateCanvas" data-template-id="${featuredTemplateId}"></canvas>
            </div>
          </div>

          ${
            otherTemplates.length > 0
              ? `
            <div class="more-from-user">
              <h3>More from ${user.name}</h3>
              <div class="user-templates-grid">
                ${otherTemplates
                  .map((template) => {
                    const templateId = this.findTemplateIdByName(template.name);
                    return `
                  <div class="user-template-card" data-template-id="${templateId}">
                    <div class="card-image">
                      <canvas class="user-template-canvas" data-template-id="${templateId}"></canvas>
                    </div>
                    <div class="card-content">
                      <h4>${template.name}</h4>
                      <span class="category ${template.categoryClass}">${template.category}</span>
                    </div>
                  </div>
                `;
                  })
                  .join("")}
              </div>
            </div>
          `
              : ""
          }
        </div>
      `;
    }

    // Bind back button
    const backBtn = mainContent.querySelector(".back-btn");
    if (backBtn) {
      backBtn.addEventListener("click", () => {
        this.showAllTemplates();
      });
    }

    // Bind use template button
    const useBtn = mainContent.querySelector(".use-template-btn.primary");
    if (useBtn) {
      useBtn.addEventListener("click", () => {
        const templateId = parseInt(useBtn.dataset.templateId);
        if (templateId) {
          this.useTemplate(templateId);
        }
      });
    }

    // Bind add to favourite button
    const favBtn = mainContent.querySelector(".add-to-favourite-btn");
    if (favBtn) {
      favBtn.addEventListener("click", () => {
        this.handleAddToFavourite(featuredTemplate.name);
      });
    }

    // Render previews after DOM is ready
    setTimeout(() => {
      this.renderUserTemplatesPreviews(featuredTemplateId, otherTemplates);
    }, 100);

    // Make other template cards clickable
    const otherCards = mainContent.querySelectorAll(".user-template-card");
    otherCards.forEach((card) => {
      card.addEventListener("click", () => {
        const templateId = parseInt(card.dataset.templateId);
        if (templateId) {
          this.previewTemplate(templateId);
        }
      });
      card.style.cursor = "pointer";
    });
  }

  // Helper to find template ID by name
  findTemplateIdByName(name) {
    const template = this.allTemplates.find((t) => t.name === name);
    return template ? template.id : null;
  }

  // Render previews for user templates view
  renderUserTemplatesPreviews(featuredTemplateId, otherTemplates) {
    // Render featured template preview
    if (featuredTemplateId) {
      const featuredCanvas = document.getElementById("featuredTemplateCanvas");
      if (featuredCanvas) {
        const templateData = this.getTemplateData(featuredTemplateId);
        if (templateData) {
          this.renderTemplateOnCanvas(featuredCanvas, templateData, 0.6);
        }
      }
    }

    // Render other template previews
    const otherCanvases = document.querySelectorAll(".user-template-canvas");
    otherCanvases.forEach((canvas) => {
      const templateId = parseInt(canvas.dataset.templateId);
      if (templateId) {
        const templateData = this.getTemplateData(templateId);
        if (templateData) {
          this.renderTemplateOnCanvas(canvas, templateData, 0.3);
        }
      }
    });
  }

  // Render template on a specific canvas
  renderTemplateOnCanvas(canvas, templateData, scale = 0.8) {
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const container = canvas.parentElement;

    // Set canvas size with device pixel ratio for crisp rendering
    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    canvas.width = (rect.width || 400) * dpr;
    canvas.height = (rect.height || 300) * dpr;
    canvas.style.width = `${rect.width || 400}px`;
    canvas.style.height = `${rect.height || 300}px`;

    // Scale context for device pixel ratio
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const offsetX = 10 * scale;
    const offsetY = 10 * scale;
    const data = templateData.data;

    try {
      // Draw shapes
      if (data.shapes) {
        data.shapes.forEach((shape) => {
          ctx.save();
          ctx.fillStyle = shape.attrs.fill || "#e0e0e0";
          ctx.strokeStyle = shape.attrs.stroke || "#000000";
          ctx.lineWidth = (shape.attrs["stroke-width"] || 1) * scale;

          const x = shape.x * scale + offsetX;
          const y = shape.y * scale + offsetY;
          const width = shape.attrs.width * scale;
          const height = shape.attrs.height * scale;

          if (shape.type === "rectangle") {
            const rx = (shape.attrs.rx || 0) * scale;
            if (rx > 0) {
              this.drawRoundedRect(ctx, x, y, width, height, rx);
            } else {
              ctx.fillRect(x, y, width, height);
              ctx.strokeRect(x, y, width, height);
            }
          } else if (shape.type === "circle") {
            const radius = (shape.attrs.r || 50) * scale;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          }
          ctx.restore();
        });
      }

      // Draw texts
      if (data.texts) {
        data.texts.forEach((text) => {
          ctx.save();
          const fontSize = parseInt(text.style?.fontSize || "16px") * scale;
          ctx.font = `${text.style?.fontWeight || "normal"} ${fontSize}px Arial`;
          ctx.fillStyle = text.style?.color || "#000000";
          ctx.fillText(text.content, text.x * scale + offsetX, text.y * scale + offsetY);
          ctx.restore();
        });
      }

      // Draw notes
      if (data.notes) {
        data.notes.forEach((note) => {
          ctx.save();
          const x = note.x * scale + offsetX;
          const y = note.y * scale + offsetY;
          const width = 120 * scale;
          const height = 100 * scale;

          ctx.fillStyle = note.color || "#fef3c7";
          ctx.fillRect(x, y, width, height);
          ctx.strokeStyle = "#d97706";
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, width, height);

          ctx.fillStyle = "#000000";
          ctx.font = `${10 * scale}px Arial`;
          const lines = note.content.split("\n").slice(0, 3);
          lines.forEach((line, i) => {
            ctx.fillText(line.substring(0, 15), x + 5, y + 15 + i * 12 * scale, width - 10);
          });
          ctx.restore();
        });
      }

      // Draw cards
      if (data.cards) {
        data.cards.forEach((card) => {
          ctx.save();
          const x = card.x * scale + offsetX;
          const y = card.y * scale + offsetY;
          const width = 150 * scale;
          const height = 100 * scale;

          ctx.fillStyle = "#ffffff";
          ctx.fillRect(x, y, width, height);
          ctx.strokeStyle = "#e5e7eb";
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, width, height);

          ctx.fillStyle = "#000000";
          ctx.font = `${10 * scale}px Arial`;
          const lines = card.content.split("\n").slice(0, 3);
          lines.forEach((line, i) => {
            ctx.fillText(line.substring(0, 15), x + 5, y + 15 + i * 12 * scale, width - 10);
          });
          ctx.restore();
        });
      }

      // Draw arrows
      if (data.arrows) {
        data.arrows.forEach((arrow) => {
          ctx.save();
          ctx.strokeStyle = arrow.color || "#0284c7";
          ctx.lineWidth = (arrow.width || 2) * scale;
          ctx.beginPath();
          arrow.points.forEach((point, i) => {
            const x = point.x * scale + offsetX;
            const y = point.y * scale + offsetY;
            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          });
          ctx.stroke();
          ctx.restore();
        });
      }

      // Draw mind map nodes
      if (data.mindmap?.nodes) {
        data.mindmap.nodes.forEach((node) => {
          ctx.save();
          const x = node.x * scale + offsetX;
          const y = node.y * scale + offsetY;
          const width = 80 * scale;
          const height = 30 * scale;

          ctx.fillStyle = "#dbeafe";
          this.drawRoundedRect(ctx, x - width / 2, y - height / 2, width, height, 6 * scale);
          ctx.strokeStyle = "#0284c7";
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.fillStyle = "#000000";
          ctx.font = `${10 * scale}px Arial`;
          ctx.textAlign = "center";
          ctx.fillText(node.text.substring(0, 10), x, y + 3);
          ctx.restore();
        });
      }
    } catch (error) {
      console.error("Error rendering canvas preview:", error);
    }
  }

  handleSearch(searchTerm) {
    if (this.currentView !== "all-templates" && this.currentView !== "category-templates" && this.currentView !== "custom-templates") return;

    const term = searchTerm.toLowerCase();
    this.templateCards?.forEach((card) => {
      const title = card.querySelector("h4")?.textContent.toLowerCase() || "";
      const category = card.querySelector(".category")?.textContent.toLowerCase() || "";

      if (title.includes(term) || category.includes(term)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  }

  handleUseTemplate(button, templateName = null) {
    const name = templateName || button.closest(".template-card")?.querySelector("h4")?.textContent || "Unknown Template";

    console.log(`Using template: ${name}`);

    // Close the modal
    this.hideTemplateModal();

    // Dispatch custom event for template usage
    this.dispatchTemplateEvent("template-used", { templateName: name });
  }

  handlePreviewTemplate(button) {
    const templateCard = button.closest(".template-card");
    const templateName = templateCard?.querySelector("h4")?.textContent || "Unknown Template";

    console.log(`Previewing template: ${templateName}`);

    // Dispatch custom event for template preview
    this.dispatchTemplateEvent("template-previewed", { templateName });
  }

  handleAddToFavourite(templateName) {
    console.log(`Adding to favourites: ${templateName}`);

    // Dispatch custom event for adding to favourites
    this.dispatchTemplateEvent("template-favourited", { templateName });
  }

  dispatchTemplateEvent(eventType, detail) {
    const event = new CustomEvent(eventType, {
      detail: detail,
      bubbles: true,
    });
    document.dispatchEvent(event);
  }

  refreshTemplateCards() {
    // Small delay to ensure DOM is updated
    setTimeout(() => {
      this.templateCards = this.templateModal?.querySelectorAll(".template-card");
      this.useTemplateButtons = this.templateModal?.querySelectorAll(".use-template-btn");
      this.previewButtons = this.templateModal?.querySelectorAll(".preview-btn");
      this.starIcons = this.templateModal?.querySelectorAll(".star-icon");

      // Re-bind events for new elements
      this.bindTemplateCardEvents();

      // Render canvas previews for non-custom templates
      this.renderAllTemplateCardPreviews();
    }, 0);
  }

  // Render previews for all template cards in the grid
  renderAllTemplateCardPreviews() {
    const canvases = this.templateModal?.querySelectorAll(".template-card-canvas");
    if (!canvases) return;

    canvases.forEach((canvas) => {
      const templateId = parseInt(canvas.dataset.templateId);
      if (templateId) {
        const templateData = this.getTemplateData(templateId);
        if (templateData) {
          // Use a smaller scale for grid cards
          this.renderTemplateOnCanvas(canvas, templateData, 0.2);
        }
      }
    });
  }

  bindTemplateCardEvents() {
    console.log("Binding events to", this.useTemplateButtons?.length, "use buttons");
    console.log("Binding events to", this.previewButtons?.length, "preview buttons");

    this.useTemplateButtons?.forEach((btn) => {
      // Remove any existing listeners by cloning
      const newBtn = btn.cloneNode(true);
      btn.parentNode?.replaceChild(newBtn, btn);

      newBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();

        const card = newBtn.closest(".template-card");
        const templateId = parseInt(card?.dataset.templateId);

        if (templateId) {
          this.useTemplate(templateId);
        }
      });
    });

    this.previewButtons?.forEach((btn) => {
      // Remove any existing listeners by cloning
      const newBtn = btn.cloneNode(true);
      btn.parentNode?.replaceChild(newBtn, btn);

      newBtn.addEventListener("click", (e) => {
        console.log("Preview clicked!");
        e.stopPropagation();
        e.preventDefault();

        const card = newBtn.closest(".template-card");
        const templateId = parseInt(card?.dataset.templateId);

        if (templateId) {
          this.previewTemplate(templateId);
        }
      });
    });

    this.starIcons.forEach((icon) => {
      // Remove any existing listeners by cloning
      const newIcon = icon.cloneNode(true);
      icon.parentNode?.replaceChild(newIcon, icon);

      newIcon.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();

        const card = newIcon.closest(".template-card");
        const templateId = parseInt(card?.dataset.templateId);

        if (templateId) {
          this.toggleFavourite(templateId, newIcon);
        }
      });
    });

    // Update references after cloning
    this.useTemplateButtons = this.templateModal?.querySelectorAll(".use-template-btn");
    this.previewButtons = this.templateModal?.querySelectorAll(".preview-btn");
  }

  filterTemplatesBySort(sortValue) {
    // Implementation for sorting templates
    console.log(`Sorting templates by: ${sortValue}`);
  }

  // Get template data by ID
  getTemplateData(templateId) {
    return this.templateDefinitions[templateId] || null;
  }

  // Template definitions with actual whiteboard data
  templateDefinitions = {
    // 1. Product Roadmap
    1: {
      id: 1,
      name: "Product Roadmap",
      data: {
        texts: [
          { x: 100, y: 100, content: "Q1 2024", style: { fontSize: "24px", fontWeight: "bold" } },
          { x: 400, y: 100, content: "Q2 2024", style: { fontSize: "24px", fontWeight: "bold" } },
          { x: 700, y: 100, content: "Q3 2024", style: { fontSize: "24px", fontWeight: "bold" } },
        ],
        cards: [
          { x: 80, y: 180, content: "Feature A\nUser authentication" },
          { x: 80, y: 320, content: "Feature B\nDashboard redesign" },
          { x: 380, y: 180, content: "Feature C\nAPI integration" },
          { x: 380, y: 320, content: "Feature D\nMobile app" },
          { x: 680, y: 180, content: "Feature E\nAnalytics" },
        ],
        shapes: [
          { type: "rectangle", x: 50, y: 150, attrs: { width: 250, height: 300, fill: "#e0f2fe", stroke: "#0284c7", "stroke-width": 2 } },
          { type: "rectangle", x: 350, y: 150, attrs: { width: 250, height: 300, fill: "#fef3c7", stroke: "#f59e0b", "stroke-width": 2 } },
          { type: "rectangle", x: 650, y: 150, attrs: { width: 250, height: 300, fill: "#dcfce7", stroke: "#10b981", "stroke-width": 2 } },
        ],
      },
    },

    // 2. Sprint Planning
    2: {
      id: 2,
      name: "Sprint Planning",
      data: {
        texts: [
          { x: 100, y: 80, content: "Sprint Goals", style: { fontSize: "28px", fontWeight: "bold" } },
          { x: 100, y: 300, content: "Backlog", style: { fontSize: "24px", fontWeight: "bold" } },
          { x: 500, y: 300, content: "In Progress", style: { fontSize: "24px", fontWeight: "bold" } },
          { x: 900, y: 300, content: "Done", style: { fontSize: "24px", fontWeight: "bold" } },
        ],
        notes: [
          { x: 100, y: 140, content: "Improve user onboarding flow", color: "#fef3c7" },
          { x: 300, y: 140, content: "Fix critical bugs", color: "#fee2e2" },
        ],
        cards: [
          { x: 80, y: 360, content: "Task 1: Design mockups" },
          { x: 80, y: 480, content: "Task 2: API endpoints" },
          { x: 480, y: 360, content: "Task 3: Frontend dev" },
          { x: 880, y: 360, content: "Task 4: Testing" },
        ],
      },
    },

    // 3. Mind Map
    3: {
      id: 3,
      name: "Mind Map",
      data: {
        mindmap: {
          nodes: [
            { x: 500, y: 300, text: "Central Idea", parentId: null },
            { x: 300, y: 200, text: "Branch 1", parentId: 0 },
            { x: 300, y: 400, text: "Branch 2", parentId: 0 },
            { x: 700, y: 200, text: "Branch 3", parentId: 0 },
            { x: 700, y: 400, text: "Branch 4", parentId: 0 },
            { x: 150, y: 150, text: "Sub-idea 1.1", parentId: 1 },
            { x: 150, y: 250, text: "Sub-idea 1.2", parentId: 1 },
          ],
        },
      },
    },

    // 4. UX Research Canvas
    4: {
      id: 4,
      name: "UX Research Canvas",
      data: {
        texts: [
          { x: 100, y: 80, content: "User Research", style: { fontSize: "32px", fontWeight: "bold" } },
          { x: 100, y: 180, content: "Goals", style: { fontSize: "20px", fontWeight: "bold" } },
          { x: 450, y: 180, content: "Methods", style: { fontSize: "20px", fontWeight: "bold" } },
          { x: 800, y: 180, content: "Insights", style: { fontSize: "20px", fontWeight: "bold" } },
        ],
        notes: [
          { x: 80, y: 240, content: "Understand user pain points", color: "#dbeafe" },
          { x: 80, y: 360, content: "Identify feature priorities", color: "#dbeafe" },
          { x: 430, y: 240, content: "User interviews", color: "#fef3c7" },
          { x: 430, y: 360, content: "Surveys", color: "#fef3c7" },
          { x: 780, y: 240, content: "Users want faster checkout", color: "#dcfce7" },
          { x: 780, y: 360, content: "Mobile experience needs work", color: "#dcfce7" },
        ],
      },
    },

    // 5. Workshop Agenda
    5: {
      id: 5,
      name: "Workshop Agenda",
      data: {
        texts: [
          { x: 100, y: 80, content: "Workshop Agenda", style: { fontSize: "32px", fontWeight: "bold" } },
          { x: 100, y: 160, content: "9:00 AM - Welcome & Intro", style: { fontSize: "18px" } },
          { x: 100, y: 220, content: "9:30 AM - Icebreaker Activity", style: { fontSize: "18px" } },
          { x: 100, y: 280, content: "10:00 AM - Main Session", style: { fontSize: "18px" } },
          { x: 100, y: 340, content: "11:30 AM - Group Discussion", style: { fontSize: "18px" } },
          { x: 100, y: 400, content: "12:00 PM - Wrap Up", style: { fontSize: "18px" } },
        ],
        shapes: [
          { type: "rectangle", x: 80, y: 150, attrs: { width: 400, height: 50, fill: "#e0f2fe", stroke: "#0284c7", "stroke-width": 2 } },
          { type: "rectangle", x: 80, y: 210, attrs: { width: 400, height: 50, fill: "#fef3c7", stroke: "#f59e0b", "stroke-width": 2 } },
          { type: "rectangle", x: 80, y: 270, attrs: { width: 400, height: 50, fill: "#dcfce7", stroke: "#10b981", "stroke-width": 2 } },
          { type: "rectangle", x: 80, y: 330, attrs: { width: 400, height: 50, fill: "#fce7f3", stroke: "#ec4899", "stroke-width": 2 } },
          { type: "rectangle", x: 80, y: 390, attrs: { width: 400, height: 50, fill: "#ede9fe", stroke: "#8b5cf6", "stroke-width": 2 } },
        ],
      },
    },

    // 6. Investor Pitch Deck
    6: {
      id: 6,
      name: "Investor Pitch Deck",
      data: {
        texts: [
          { x: 100, y: 100, content: "Problem", style: { fontSize: "24px", fontWeight: "bold" } },
          { x: 400, y: 100, content: "Solution", style: { fontSize: "24px", fontWeight: "bold" } },
          { x: 700, y: 100, content: "Market", style: { fontSize: "24px", fontWeight: "bold" } },
          { x: 100, y: 350, content: "Business Model", style: { fontSize: "24px", fontWeight: "bold" } },
          { x: 400, y: 350, content: "Traction", style: { fontSize: "24px", fontWeight: "bold" } },
          { x: 700, y: 350, content: "Ask", style: { fontSize: "24px", fontWeight: "bold" } },
        ],
        cards: [
          { x: 80, y: 160, content: "Current pain points\nin the market" },
          { x: 380, y: 160, content: "Our innovative\napproach" },
          { x: 680, y: 160, content: "$10B TAM\nGrowing 20% YoY" },
          { x: 80, y: 410, content: "SaaS subscription\nmodel" },
          { x: 380, y: 410, content: "100+ customers\n$500K ARR" },
          { x: 680, y: 410, content: "Seeking $2M\nSeed round" },
        ],
      },
    },

    // 7. Customer Journey Map
    7: {
      id: 7,
      name: "Customer Journey Map",
      data: {
        texts: [
          { x: 100, y: 80, content: "Customer Journey", style: { fontSize: "32px", fontWeight: "bold" } },
          { x: 100, y: 160, content: "Awareness", style: { fontSize: "20px", fontWeight: "bold" } },
          { x: 300, y: 160, content: "Consideration", style: { fontSize: "20px", fontWeight: "bold" } },
          { x: 550, y: 160, content: "Purchase", style: { fontSize: "20px", fontWeight: "bold" } },
          { x: 750, y: 160, content: "Retention", style: { fontSize: "20px", fontWeight: "bold" } },
        ],
        notes: [
          { x: 80, y: 220, content: "Social media ads", color: "#dbeafe" },
          { x: 280, y: 220, content: "Compare features", color: "#fef3c7" },
          { x: 530, y: 220, content: "Easy checkout", color: "#dcfce7" },
          { x: 730, y: 220, content: "Email campaigns", color: "#fce7f3" },
        ],
        arrows: [
          {
            points: [
              { x: 200, y: 250 },
              { x: 280, y: 250 },
            ],
            color: "#0284c7",
            width: 3,
          },
          {
            points: [
              { x: 450, y: 250 },
              { x: 530, y: 250 },
            ],
            color: "#0284c7",
            width: 3,
          },
          {
            points: [
              { x: 650, y: 250 },
              { x: 730, y: 250 },
            ],
            color: "#0284c7",
            width: 3,
          },
        ],
      },
    },

    // 8. Design Critique Board
    8: {
      id: 8,
      name: "Design Critique Board",
      data: {
        texts: [
          { x: 100, y: 80, content: "Design Critique", style: { fontSize: "32px", fontWeight: "bold" } },
          { x: 100, y: 180, content: "What Works", style: { fontSize: "24px", fontWeight: "bold", color: "#10b981" } },
          { x: 500, y: 180, content: "What Needs Work", style: { fontSize: "24px", fontWeight: "bold", color: "#ef4444" } },
        ],
        notes: [
          { x: 80, y: 250, content: "Clean layout", color: "#dcfce7" },
          { x: 80, y: 350, content: "Good color contrast", color: "#dcfce7" },
          { x: 80, y: 450, content: "Clear CTAs", color: "#dcfce7" },
          { x: 480, y: 250, content: "Navigation confusing", color: "#fee2e2" },
          { x: 480, y: 350, content: "Text too small", color: "#fee2e2" },
          { x: 480, y: 450, content: "Loading too slow", color: "#fee2e2" },
        ],
      },
    },

    // 9. Brainstorming Session
    9: {
      id: 9,
      name: "Brainstorming Session",
      data: {
        texts: [{ x: 100, y: 80, content: "Brainstorming: New Features", style: { fontSize: "28px", fontWeight: "bold" } }],
        notes: [
          { x: 100, y: 180, content: "Dark mode", color: "#fef3c7" },
          { x: 250, y: 180, content: "Collaboration tools", color: "#dbeafe" },
          { x: 450, y: 180, content: "Templates library", color: "#dcfce7" },
          { x: 100, y: 300, content: "Export to PDF", color: "#fce7f3" },
          { x: 250, y: 300, content: "Real-time sync", color: "#ede9fe" },
          { x: 450, y: 300, content: "Mobile app", color: "#fed7aa" },
          { x: 100, y: 420, content: "Comments system", color: "#fecaca" },
          { x: 250, y: 420, content: "Version history", color: "#bfdbfe" },
          { x: 450, y: 420, content: "Integrations", color: "#d9f99d" },
        ],
      },
    },

    // 10. Team Retrospective
    10: {
      id: 10,
      name: "Team Retrospective",
      data: {
        texts: [
          { x: 100, y: 80, content: "Sprint Retrospective", style: { fontSize: "32px", fontWeight: "bold" } },
          { x: 100, y: 180, content: "What Went Well", style: { fontSize: "24px", fontWeight: "bold", color: "#10b981" } },
          { x: 450, y: 180, content: "What To Improve", style: { fontSize: "24px", fontWeight: "bold", color: "#f59e0b" } },
          { x: 800, y: 180, content: "Action Items", style: { fontSize: "24px", fontWeight: "bold", color: "#0284c7" } },
        ],
        notes: [
          { x: 80, y: 250, content: "Good team communication", color: "#dcfce7" },
          { x: 80, y: 350, content: "Met all deadlines", color: "#dcfce7" },
          { x: 430, y: 250, content: "Better documentation", color: "#fef3c7" },
          { x: 430, y: 350, content: "More code reviews", color: "#fef3c7" },
          { x: 780, y: 250, content: "Schedule weekly docs time", color: "#dbeafe" },
          { x: 780, y: 350, content: "Pair programming sessions", color: "#dbeafe" },
        ],
      },
    },

    // 11. User Flow Diagram
    11: {
      id: 11,
      name: "User Flow Diagram",
      data: {
        texts: [{ x: 100, y: 80, content: "User Flow: Sign Up", style: { fontSize: "28px", fontWeight: "bold" } }],
        shapes: [
          { type: "rectangle", x: 100, y: 150, attrs: { width: 150, height: 60, fill: "#dbeafe", stroke: "#0284c7", "stroke-width": 2, rx: 8 } },
          { type: "rectangle", x: 100, y: 280, attrs: { width: 150, height: 60, fill: "#fef3c7", stroke: "#f59e0b", "stroke-width": 2, rx: 8 } },
          { type: "rectangle", x: 100, y: 410, attrs: { width: 150, height: 60, fill: "#dcfce7", stroke: "#10b981", "stroke-width": 2, rx: 8 } },
          { type: "rectangle", x: 100, y: 540, attrs: { width: 150, height: 60, fill: "#fce7f3", stroke: "#ec4899", "stroke-width": 2, rx: 8 } },
        ],
        texts: [
          { x: 175, y: 180, content: "Landing Page", style: { fontSize: "16px", textAlign: "center" } },
          { x: 175, y: 310, content: "Sign Up Form", style: { fontSize: "16px", textAlign: "center" } },
          { x: 175, y: 440, content: "Email Verify", style: { fontSize: "16px", textAlign: "center" } },
          { x: 175, y: 570, content: "Dashboard", style: { fontSize: "16px", textAlign: "center" } },
        ],
        arrows: [
          {
            points: [
              { x: 175, y: 210 },
              { x: 175, y: 280 },
            ],
            color: "#0284c7",
            width: 2,
          },
          {
            points: [
              { x: 175, y: 340 },
              { x: 175, y: 410 },
            ],
            color: "#0284c7",
            width: 2,
          },
          {
            points: [
              { x: 175, y: 470 },
              { x: 175, y: 540 },
            ],
            color: "#0284c7",
            width: 2,
          },
        ],
      },
    },

    // 12. Creative Brief Template
    12: {
      id: 12,
      name: "Creative Brief Template",
      data: {
        texts: [
          { x: 100, y: 80, content: "Creative Brief", style: { fontSize: "32px", fontWeight: "bold" } },
          { x: 100, y: 160, content: "Project:", style: { fontSize: "20px", fontWeight: "bold" } },
          { x: 100, y: 240, content: "Objective:", style: { fontSize: "20px", fontWeight: "bold" } },
          { x: 100, y: 340, content: "Target Audience:", style: { fontSize: "20px", fontWeight: "bold" } },
          { x: 100, y: 440, content: "Key Message:", style: { fontSize: "20px", fontWeight: "bold" } },
          { x: 100, y: 540, content: "Deliverables:", style: { fontSize: "20px", fontWeight: "bold" } },
        ],
        cards: [
          { x: 250, y: 150, content: "Brand Campaign 2024" },
          { x: 250, y: 230, content: "Increase brand awareness\nby 30%" },
          { x: 250, y: 330, content: "Millennials 25-40\nUrban professionals" },
          { x: 250, y: 430, content: "Innovation meets\nsustainability" },
          { x: 250, y: 530, content: "• Social media assets\n• Landing page\n• Email campaign" },
        ],
      },
    },

    // 13. Simple Mind Map
    13: {
      id: 13,
      name: "Simple Mind Map",
      data: {
        shapes: [
          { type: "rectangle", x: 80, y: 280, attrs: { width: 260, height: 60, fill: "#f3f4f6", stroke: "#e5e7eb", "stroke-width": 1, rx: 4 } },
          { type: "rectangle", x: 620, y: 195, attrs: { width: 270, height: 50, fill: "#f9fafb", stroke: "#e5e7eb", "stroke-width": 1, rx: 4 } },
          { type: "rectangle", x: 620, y: 285, attrs: { width: 270, height: 50, fill: "#f9fafb", stroke: "#e5e7eb", "stroke-width": 1, rx: 4 } },
          { type: "rectangle", x: 620, y: 375, attrs: { width: 270, height: 50, fill: "#f9fafb", stroke: "#e5e7eb", "stroke-width": 1, rx: 4 } },
        ],
        texts: [
          { x: 210, y: 315, content: "Any question or topic", style: { fontSize: "20px", fontWeight: "600", fontFamily: "Inter, -apple-system, sans-serif" } },
          { x: 755, y: 225, content: "A concept", style: { fontSize: "18px", fontStyle: "italic", fontFamily: "Georgia, serif" } },
          { x: 755, y: 315, content: "An idea", style: { fontSize: "18px", fontStyle: "italic", fontFamily: "Georgia, serif" } },
          { x: 755, y: 405, content: "A thought", style: { fontSize: "18px", fontStyle: "italic", fontFamily: "Georgia, serif" } },
        ],
        arrows: [
          {
            points: [
              { x: 340, y: 310 },
              { x: 380, y: 300 },
              { x: 430, y: 280 },
              { x: 480, y: 255 },
              { x: 530, y: 235 },
              { x: 580, y: 222 },
              { x: 620, y: 218 },
            ],
            color: "#9ca3af",
            width: 2,
          },
          {
            points: [
              { x: 340, y: 310 },
              { x: 400, y: 310 },
              { x: 460, y: 310 },
              { x: 520, y: 310 },
              { x: 580, y: 310 },
              { x: 620, y: 310 },
            ],
            color: "#9ca3af",
            width: 2,
          },
          {
            points: [
              { x: 340, y: 310 },
              { x: 380, y: 320 },
              { x: 430, y: 340 },
              { x: 480, y: 365 },
              { x: 530, y: 385 },
              { x: 580, y: 398 },
              { x: 620, y: 402 },
            ],
            color: "#9ca3af",
            width: 2,
          },
        ],
      },
    },

    // 14. Lunch Decision Map
    14: {
      id: 14,
      name: "Lunch Decision Map",
      data: {
        texts: [
          // Main topic
          { x: 175, y: 395, content: "Lunch...", style: { fontSize: "22px", fontWeight: "bold", fontFamily: "Inter, sans-serif" } },

          // First level branches
          { x: 360, y: 260, content: "Sandwich 🥪", style: { fontSize: "18px", fontWeight: "600", fontFamily: "Inter, sans-serif" } },
          { x: 335, y: 395, content: "Soup 🍜", style: { fontSize: "18px", fontWeight: "600", fontFamily: "Inter, sans-serif" } },
          { x: 335, y: 525, content: "Bowl 🥗", style: { fontSize: "18px", fontWeight: "600", fontFamily: "Inter, sans-serif" } },

          // Second level - Sandwich branch
          { x: 490, y: 225, content: "PB&J", style: { fontSize: "16px", fontWeight: "500", fontFamily: "Inter, sans-serif" } },
          { x: 490, y: 290, content: "Burrito", style: { fontSize: "16px", fontWeight: "500", fontFamily: "Inter, sans-serif" } },

          // Second level - Soup branch
          { x: 490, y: 360, content: "Chili", style: { fontSize: "16px", fontWeight: "500", fontFamily: "Inter, sans-serif" } },
          { x: 490, y: 425, content: "Ramen", style: { fontSize: "16px", fontWeight: "500", fontFamily: "Inter, sans-serif" } },

          // Second level - Bowl branch (green)
          { x: 490, y: 495, content: "Plantains & rice", style: { fontSize: "16px", fontWeight: "500", fontFamily: "Inter, sans-serif", color: "#10b981" } },
          { x: 490, y: 560, content: "Poke bowl", style: { fontSize: "16px", fontWeight: "500", fontFamily: "Inter, sans-serif" } },

          // Third level - Comments
          { x: 685, y: 225, content: "Too simple.", style: { fontSize: "15px", fontStyle: "italic", fontFamily: "Georgia, serif" } },
          { x: 685, y: 290, content: "Food coma!", style: { fontSize: "15px", fontStyle: "italic", fontFamily: "Georgia, serif" } },
          { x: 685, y: 360, content: "Feels like dinner.", style: { fontSize: "15px", fontStyle: "italic", fontFamily: "Georgia, serif" } },
          { x: 685, y: 425, content: "Same as above!", style: { fontSize: "15px", fontStyle: "italic", fontFamily: "Georgia, serif" } },
          { x: 685, y: 495, content: "Mmm.", style: { fontSize: "15px", fontStyle: "italic", fontFamily: "Georgia, serif", color: "#10b981" } },
          { x: 685, y: 560, content: "No wait! I'm vegetarian.", style: { fontSize: "15px", fontStyle: "italic", fontFamily: "Georgia, serif" } },
        ],
        arrows: [
          // Main to Sandwich (gray curve up)
          {
            points: [
              { x: 250, y: 390 },
              { x: 270, y: 380 },
              { x: 290, y: 360 },
              { x: 310, y: 330 },
              { x: 330, y: 290 },
              { x: 345, y: 270 },
            ],
            color: "#9ca3af",
            width: 2.5,
          },
          // Main to Soup (gray straight)
          {
            points: [
              { x: 250, y: 395 },
              { x: 280, y: 395 },
              { x: 310, y: 395 },
            ],
            color: "#9ca3af",
            width: 2.5,
          },
          // Main to Bowl (green curve down)
          {
            points: [
              { x: 250, y: 400 },
              { x: 270, y: 420 },
              { x: 290, y: 450 },
              { x: 310, y: 485 },
              { x: 325, y: 510 },
            ],
            color: "#10b981",
            width: 3,
          },

          // Sandwich to PB&J
          {
            points: [
              { x: 445, y: 255 },
              { x: 460, y: 245 },
              { x: 475, y: 235 },
            ],
            color: "#9ca3af",
            width: 2,
          },
          // Sandwich to Burrito
          {
            points: [
              { x: 445, y: 265 },
              { x: 460, y: 278 },
              { x: 475, y: 285 },
            ],
            color: "#9ca3af",
            width: 2,
          },

          // Soup to Chili
          {
            points: [
              { x: 410, y: 390 },
              { x: 440, y: 375 },
              { x: 470, y: 365 },
            ],
            color: "#9ca3af",
            width: 2,
          },
          // Soup to Ramen
          {
            points: [
              { x: 410, y: 400 },
              { x: 440, y: 412 },
              { x: 470, y: 420 },
            ],
            color: "#9ca3af",
            width: 2,
          },

          // Bowl to Plantains (green)
          {
            points: [
              { x: 410, y: 520 },
              { x: 440, y: 508 },
              { x: 470, y: 500 },
            ],
            color: "#10b981",
            width: 2.5,
          },
          // Bowl to Poke bowl
          {
            points: [
              { x: 410, y: 530 },
              { x: 440, y: 545 },
              { x: 470, y: 555 },
            ],
            color: "#9ca3af",
            width: 2,
          },

          // PB&J to comment
          {
            points: [
              { x: 540, y: 225 },
              { x: 600, y: 225 },
              { x: 660, y: 225 },
            ],
            color: "#d1d5db",
            width: 1.5,
          },
          // Burrito to comment
          {
            points: [
              { x: 560, y: 290 },
              { x: 610, y: 290 },
              { x: 660, y: 290 },
            ],
            color: "#d1d5db",
            width: 1.5,
          },
          // Chili to comment
          {
            points: [
              { x: 540, y: 360 },
              { x: 600, y: 360 },
              { x: 660, y: 360 },
            ],
            color: "#d1d5db",
            width: 1.5,
          },
          // Ramen to comment
          {
            points: [
              { x: 560, y: 425 },
              { x: 610, y: 425 },
              { x: 660, y: 425 },
            ],
            color: "#d1d5db",
            width: 1.5,
          },
          // Plantains to comment (green)
          {
            points: [
              { x: 620, y: 495 },
              { x: 650, y: 495 },
              { x: 680, y: 495 },
            ],
            color: "#86efac",
            width: 1.5,
          },
          // Poke bowl to comment
          {
            points: [
              { x: 580, y: 560 },
              { x: 620, y: 560 },
              { x: 660, y: 560 },
            ],
            color: "#d1d5db",
            width: 1.5,
          },
        ],
      },
    },

    // 15. E-commerce User Flow
    15: {
      id: 15,
      name: "E-commerce User Flow",
      data: {
        shapes: [
          // Start - Yellow circle
          { type: "circle", x: 417, y: 140, attrs: { r: 50, fill: "#fef3c7", stroke: "#f59e0b", "stroke-width": 2 } },

          // Blue rectangles (process steps)
          { type: "rectangle", x: 370, y: 230, attrs: { width: 95, height: 60, fill: "#bfdbfe", stroke: "#3b82f6", "stroke-width": 2, rx: 4 } },
          { type: "rectangle", x: 230, y: 335, attrs: { width: 100, height: 60, fill: "#bfdbfe", stroke: "#3b82f6", "stroke-width": 2, rx: 4 } },
          { type: "rectangle", x: 370, y: 335, attrs: { width: 95, height: 60, fill: "#bfdbfe", stroke: "#3b82f6", "stroke-width": 2, rx: 4 } },
          { type: "rectangle", x: 510, y: 335, attrs: { width: 130, height: 60, fill: "#bfdbfe", stroke: "#3b82f6", "stroke-width": 2, rx: 4 } },
          { type: "rectangle", x: 370, y: 445, attrs: { width: 95, height: 60, fill: "#bfdbfe", stroke: "#3b82f6", "stroke-width": 2, rx: 4 } },
          { type: "rectangle", x: 370, y: 545, attrs: { width: 95, height: 60, fill: "#bfdbfe", stroke: "#3b82f6", "stroke-width": 2, rx: 4 } },
          { type: "rectangle", x: 370, y: 785, attrs: { width: 95, height: 60, fill: "#bfdbfe", stroke: "#3b82f6", "stroke-width": 2, rx: 4 } },
          { type: "rectangle", x: 370, y: 890, attrs: { width: 95, height: 60, fill: "#bfdbfe", stroke: "#3b82f6", "stroke-width": 2, rx: 4 } },

          // Purple diamond (decision point)
          { type: "rectangle", x: 367, y: 665, attrs: { width: 100, height: 100, fill: "#e9d5ff", stroke: "#a855f7", "stroke-width": 2, rx: 4 } },
        ],
        texts: [
          // Start
          { x: 417, y: 145, content: "Enter website", style: { fontSize: "13px", fontWeight: "500", textAlign: "center" } },

          // Process steps
          { x: 417, y: 263, content: "Go to product list\npage", style: { fontSize: "12px", textAlign: "center", lineHeight: "1.4" } },
          { x: 280, y: 368, content: "Search for items", style: { fontSize: "12px", textAlign: "center" } },
          { x: 417, y: 363, content: "Review\nrecommended\nitem", style: { fontSize: "11px", textAlign: "center", lineHeight: "1.3" } },
          { x: 575, y: 358, content: "Use the menu button and\nnavigate to the category", style: { fontSize: "11px", textAlign: "center", lineHeight: "1.3" } },
          { x: 417, y: 473, content: "Identify item for\npurchase", style: { fontSize: "12px", textAlign: "center", lineHeight: "1.4" } },
          { x: 417, y: 573, content: "Add item to\nshopping cart", style: { fontSize: "12px", textAlign: "center", lineHeight: "1.4" } },
          { x: 417, y: 813, content: "Checkout process", style: { fontSize: "12px", textAlign: "center" } },
          { x: 417, y: 918, content: "Login/signup page", style: { fontSize: "12px", textAlign: "center" } },

          // Decision diamond
          { x: 417, y: 715, content: "More items?", style: { fontSize: "13px", fontWeight: "500", textAlign: "center" } },

          // Yes label
          { x: 673, y: 478, content: "Yes", style: { fontSize: "12px" } },
        ],
        arrows: [
          // Start to product list
          {
            points: [
              { x: 417, y: 190 },
              { x: 417, y: 230 },
            ],
            color: "#6b7280",
            width: 2,
          },
          // Product list to review
          {
            points: [
              { x: 417, y: 290 },
              { x: 417, y: 335 },
            ],
            color: "#6b7280",
            width: 2,
          },
          // Review to search (left)
          {
            points: [
              { x: 370, y: 365 },
              { x: 330, y: 365 },
            ],
            color: "#6b7280",
            width: 2,
          },
          // Review to menu (right)
          {
            points: [
              { x: 465, y: 365 },
              { x: 510, y: 365 },
            ],
            color: "#6b7280",
            width: 2,
          },
          // Search back to review (loop)
          {
            points: [
              { x: 280, y: 395 },
              { x: 280, y: 430 },
              { x: 350, y: 430 },
              { x: 370, y: 420 },
              { x: 380, y: 395 },
            ],
            color: "#6b7280",
            width: 2,
          },
          // Menu back to review (loop)
          {
            points: [
              { x: 640, y: 365 },
              { x: 673, y: 365 },
              { x: 673, y: 260 },
              { x: 465, y: 260 },
            ],
            color: "#6b7280",
            width: 2,
          },
          // Review to identify
          {
            points: [
              { x: 417, y: 395 },
              { x: 417, y: 445 },
            ],
            color: "#6b7280",
            width: 2,
          },
          // Identify to add to cart
          {
            points: [
              { x: 417, y: 505 },
              { x: 417, y: 545 },
            ],
            color: "#6b7280",
            width: 2,
          },
          // Add to cart to decision
          {
            points: [
              { x: 417, y: 605 },
              { x: 417, y: 665 },
            ],
            color: "#6b7280",
            width: 2,
          },
          // Decision to checkout
          {
            points: [
              { x: 417, y: 765 },
              { x: 417, y: 785 },
            ],
            color: "#6b7280",
            width: 2,
          },
          // Checkout to login
          {
            points: [
              { x: 417, y: 845 },
              { x: 417, y: 890 },
            ],
            color: "#6b7280",
            width: 2,
          },
          // Decision Yes loop back
          {
            points: [
              { x: 467, y: 715 },
              { x: 673, y: 715 },
              { x: 673, y: 475 },
              { x: 465, y: 475 },
            ],
            color: "#6b7280",
            width: 2,
          },
        ],
      },
    },

    // 16. Footballing Tactics
    16: {
      id: 16,
      name: "Footballing Tactics",
      data: {
        texts: [
          // Central topic with emojis
          { x: 425, y: 210, content: "⚽ Footballing tactics ⚽", style: { fontSize: "18px", fontWeight: "bold", fontFamily: "Inter, sans-serif" } },

          // Left side - Green branch (Defensive)
          { x: 77, y: 125, content: "Parking the bus", style: { fontSize: "14px", fontFamily: "Inter, sans-serif" } },
          { x: 77, y: 168, content: "Low block", style: { fontSize: "14px", fontFamily: "Inter, sans-serif" } },
          { x: 225, y: 145, content: "Bunkering", style: { fontSize: "14px", fontWeight: "500", fontFamily: "Inter, sans-serif" } },
          { x: 335, y: 168, content: "Safe", style: { fontSize: "14px", fontWeight: "500", fontFamily: "Inter, sans-serif" } },
          { x: 198, y: 210, content: "Counter-attacking", style: { fontSize: "14px", fontFamily: "Inter, sans-serif" } },

          // Bottom left - Orange branch (Risky)
          { x: 232, y: 252, content: "High press", style: { fontSize: "14px", fontFamily: "Inter, sans-serif" } },
          { x: 330, y: 274, content: "Risky", style: { fontSize: "14px", fontWeight: "500", fontFamily: "Inter, sans-serif" } },
          { x: 207, y: 295, content: "Sweeper keeper", style: { fontSize: "14px", fontFamily: "Inter, sans-serif" } },

          // Right side - Purple branch (Beautiful)
          { x: 757, y: 125, content: "Tiki-taka", style: { fontSize: "14px", fontFamily: "Inter, sans-serif" } },
          { x: 785, y: 168, content: "Totaalvoetbal", style: { fontSize: "14px", fontFamily: "Inter, sans-serif" } },
          { x: 663, y: 168, content: "Beautiful", style: { fontSize: "14px", fontWeight: "500", fontFamily: "Inter, sans-serif" } },
          { x: 758, y: 210, content: "(Anything Messi does)", style: { fontSize: "13px", fontStyle: "italic", fontFamily: "Georgia, serif" } },

          // Bottom right - Blue branch (Inventive)
          { x: 758, y: 252, content: "Anti-positional football", style: { fontSize: "14px", fontFamily: "Inter, sans-serif" } },
          { x: 910, y: 252, content: "Relationism", style: { fontSize: "14px", fontFamily: "Inter, sans-serif" } },
          { x: 690, y: 274, content: "Inventive", style: { fontSize: "14px", fontWeight: "500", fontFamily: "Inter, sans-serif" } },
          { x: 758, y: 295, content: "Reverting the pyramid", style: { fontSize: "14px", fontFamily: "Inter, sans-serif" } },
        ],
        arrows: [
          // Green branch - Left top (Defensive/Safe)
          {
            points: [
              { x: 150, y: 125 },
              { x: 180, y: 130 },
              { x: 210, y: 140 },
            ],
            color: "#10b981",
            width: 2.5,
          },
          {
            points: [
              { x: 150, y: 168 },
              { x: 180, y: 160 },
              { x: 210, y: 152 },
            ],
            color: "#10b981",
            width: 2.5,
          },
          {
            points: [
              { x: 290, y: 145 },
              { x: 315, y: 155 },
              { x: 335, y: 165 },
            ],
            color: "#10b981",
            width: 2.5,
          },
          {
            points: [
              { x: 365, y: 175 },
              { x: 385, y: 185 },
              { x: 405, y: 195 },
            ],
            color: "#10b981",
            width: 2.5,
          },
          {
            points: [
              { x: 290, y: 210 },
              { x: 330, y: 210 },
              { x: 370, y: 210 },
            ],
            color: "#10b981",
            width: 2.5,
          },

          // Orange branch - Left bottom (Risky)
          {
            points: [
              { x: 300, y: 252 },
              { x: 320, y: 260 },
              { x: 335, y: 268 },
            ],
            color: "#f97316",
            width: 2.5,
          },
          {
            points: [
              { x: 365, y: 274 },
              { x: 385, y: 260 },
              { x: 405, y: 235 },
            ],
            color: "#f97316",
            width: 2.5,
          },
          {
            points: [
              { x: 290, y: 295 },
              { x: 320, y: 285 },
              { x: 345, y: 278 },
            ],
            color: "#f97316",
            width: 2.5,
          },

          // Purple branch - Right top (Beautiful)
          {
            points: [
              { x: 570, y: 210 },
              { x: 600, y: 200 },
              { x: 630, y: 180 },
            ],
            color: "#a855f7",
            width: 2.5,
          },
          {
            points: [
              { x: 720, y: 125 },
              { x: 695, y: 140 },
              { x: 680, y: 155 },
            ],
            color: "#a855f7",
            width: 2.5,
          },
          {
            points: [
              { x: 720, y: 168 },
              { x: 700, y: 168 },
            ],
            color: "#a855f7",
            width: 2.5,
          },
          {
            points: [
              { x: 680, y: 210 },
              { x: 650, y: 210 },
              { x: 620, y: 210 },
            ],
            color: "#a855f7",
            width: 2.5,
          },

          // Blue branch - Right bottom (Inventive)
          {
            points: [
              { x: 570, y: 210 },
              { x: 600, y: 225 },
              { x: 630, y: 250 },
            ],
            color: "#3b82f6",
            width: 2.5,
          },
          {
            points: [
              { x: 680, y: 252 },
              { x: 700, y: 252 },
              { x: 720, y: 252 },
            ],
            color: "#3b82f6",
            width: 2.5,
          },
          {
            points: [
              { x: 870, y: 252 },
              { x: 890, y: 252 },
            ],
            color: "#3b82f6",
            width: 2.5,
          },
          {
            points: [
              { x: 665, y: 268 },
              { x: 665, y: 280 },
            ],
            color: "#3b82f6",
            width: 2.5,
          },
          {
            points: [
              { x: 680, y: 295 },
              { x: 700, y: 285 },
              { x: 720, y: 278 },
            ],
            color: "#3b82f6",
            width: 2.5,
          },
        ],
      },
    },

    // 17. Restaurant Service Flow
    17: {
      id: 17,
      name: "Restaurant Service Flow",
      data: {
        shapes: [
          // Start - Yellow circle
          { type: "circle", x: 322, y: 80, attrs: { r: 45, fill: "#fef3c7", stroke: "#f59e0b", "stroke-width": 2 } },

          // Blue rectangles (actions)
          { type: "rectangle", x: 270, y: 165, attrs: { width: 105, height: 50, fill: "#bfdbfe", stroke: "#3b82f6", "stroke-width": 2, rx: 4 } },
          { type: "rectangle", x: 270, y: 255, attrs: { width: 105, height: 50, fill: "#bfdbfe", stroke: "#3b82f6", "stroke-width": 2, rx: 4 } },
          { type: "rectangle", x: 270, y: 338, attrs: { width: 105, height: 50, fill: "#bfdbfe", stroke: "#3b82f6", "stroke-width": 2, rx: 4 } },
          { type: "rectangle", x: 270, y: 420, attrs: { width: 105, height: 50, fill: "#bfdbfe", stroke: "#3b82f6", "stroke-width": 2, rx: 4 } },
          { type: "rectangle", x: 430, y: 215, attrs: { width: 105, height: 50, fill: "#bfdbfe", stroke: "#3b82f6", "stroke-width": 2, rx: 4 } },
          { type: "rectangle", x: 595, y: 338, attrs: { width: 105, height: 50, fill: "#bfdbfe", stroke: "#3b82f6", "stroke-width": 2, rx: 4 } },
          { type: "rectangle", x: 712, y: 485, attrs: { width: 105, height: 50, fill: "#bfdbfe", stroke: "#3b82f6", "stroke-width": 2, rx: 4 } },
          { type: "rectangle", x: 582, y: 615, attrs: { width: 105, height: 50, fill: "#bfdbfe", stroke: "#3b82f6", "stroke-width": 2, rx: 4 } },

          // Purple diamonds (decisions)
          { type: "rectangle", x: 445, y: 318, attrs: { width: 75, height: 75, fill: "#e9d5ff", stroke: "#a855f7", "stroke-width": 2, rx: 4 } },
          { type: "rectangle", x: 730, y: 333, attrs: { width: 75, height: 75, fill: "#e9d5ff", stroke: "#a855f7", "stroke-width": 2, rx: 4 } },
          { type: "rectangle", x: 595, y: 485, attrs: { width: 105, height: 75, fill: "#e9d5ff", stroke: "#a855f7", "stroke-width": 2, rx: 4 } },

          // End - Yellow circle
          { type: "circle", x: 634, y: 755, attrs: { r: 50, fill: "#fef3c7", stroke: "#f59e0b", "stroke-width": 2 } },

          // Key legend shapes
          { type: "rectangle", x: 258, y: 685, attrs: { width: 105, height: 40, fill: "#bfdbfe", stroke: "#3b82f6", "stroke-width": 2, rx: 4 } },
          { type: "rectangle", x: 277, y: 755, attrs: { width: 65, height: 65, fill: "#e9d5ff", stroke: "#a855f7", "stroke-width": 2, rx: 4 } },
        ],
        texts: [
          // Start
          { x: 322, y: 82, content: "Waiting for\ncustomers", style: { fontSize: "11px", textAlign: "center", lineHeight: "1.3" } },

          // Process steps
          { x: 322, y: 192, content: "Welcoming the customers", style: { fontSize: "11px", textAlign: "center", lineHeight: "1.3" } },
          { x: 322, y: 282, content: "Seat the customers", style: { fontSize: "11px", textAlign: "center", lineHeight: "1.3" } },
          { x: 322, y: 365, content: "Come back to take orders", style: { fontSize: "11px", textAlign: "center", lineHeight: "1.3" } },
          { x: 322, y: 447, content: "Deliver orders to the\nkitchen", style: { fontSize: "11px", textAlign: "center", lineHeight: "1.3" } },
          { x: 482, y: 242, content: "Serve the drink", style: { fontSize: "11px", textAlign: "center", lineHeight: "1.3" } },
          { x: 647, y: 365, content: "Check on customers' needs", style: { fontSize: "11px", textAlign: "center", lineHeight: "1.3" } },
          { x: 764, y: 512, content: "Serve food", style: { fontSize: "11px", textAlign: "center", lineHeight: "1.3" } },
          { x: 634, y: 642, content: "Prepare the bill", style: { fontSize: "11px", textAlign: "center", lineHeight: "1.3" } },

          // Decision diamonds
          { x: 482, y: 358, content: "Do\ncustomers\nneed\ndrinks?", style: { fontSize: "10px", textAlign: "center", lineHeight: "1.2" } },
          { x: 767, y: 370, content: "Is the food\nready?", style: { fontSize: "10px", textAlign: "center", lineHeight: "1.2" } },
          { x: 647, y: 525, content: "Do\ncustomers\norder more?", style: { fontSize: "10px", textAlign: "center", lineHeight: "1.2" } },

          // End
          { x: 634, y: 757, content: "Serve the bill and take\nthe payment", style: { fontSize: "11px", textAlign: "center", lineHeight: "1.3" } },

          // Decision labels
          { x: 477, y: 293, content: "Yes", style: { fontSize: "10px" } },
          { x: 557, y: 358, content: "No", style: { fontSize: "10px" } },
          { x: 617, y: 418, content: "No", style: { fontSize: "10px" } },
          { x: 422, y: 512, content: "Yes", style: { fontSize: "10px" } },
          { x: 628, y: 582, content: "No", style: { fontSize: "10px" } },

          // Key legend
          { x: 308, y: 660, content: "Key", style: { fontSize: "14px", fontWeight: "600" } },
          { x: 310, y: 707, content: "Action", style: { fontSize: "12px", textAlign: "center" } },
          { x: 309, y: 787, content: "Decision", style: { fontSize: "12px", textAlign: "center" } },
        ],
        arrows: [
          // Start to welcoming
          {
            points: [
              { x: 322, y: 125 },
              { x: 322, y: 165 },
            ],
            color: "#6b7280",
            width: 2,
          },
          // Welcoming to seat
          {
            points: [
              { x: 322, y: 215 },
              { x: 322, y: 255 },
            ],
            color: "#6b7280",
            width: 2,
          },
          // Seat to take orders
          {
            points: [
              { x: 322, y: 305 },
              { x: 322, y: 338 },
            ],
            color: "#6b7280",
            width: 2,
          },
          // Take orders to deliver
          {
            points: [
              { x: 322, y: 388 },
              { x: 322, y: 420 },
            ],
            color: "#6b7280",
            width: 2,
          },
          // Deliver to drinks decision
          {
            points: [
              { x: 375, y: 445 },
              { x: 410, y: 445 },
              { x: 445, y: 393 },
            ],
            color: "#6b7280",
            width: 2,
          },
          // Decision Yes to serve drink
          {
            points: [
              { x: 482, y: 318 },
              { x: 482, y: 265 },
            ],
            color: "#6b7280",
            width: 2,
          },
          // Serve drink back to decision
          {
            points: [
              { x: 482, y: 215 },
              { x: 482, y: 180 },
              { x: 640, y: 180 },
              { x: 640, y: 245 },
              { x: 535, y: 245 },
            ],
            color: "#6b7280",
            width: 2,
          },
          // Decision No to check needs
          {
            points: [
              { x: 520, y: 355 },
              { x: 595, y: 363 },
            ],
            color: "#6b7280",
            width: 2,
          },
          // Check needs to food ready decision
          {
            points: [
              { x: 700, y: 363 },
              { x: 730, y: 370 },
            ],
            color: "#6b7280",
            width: 2,
          },
          // Food ready No - loop back
          {
            points: [
              { x: 767, y: 333 },
              { x: 767, y: 300 },
              { x: 647, y: 300 },
              { x: 647, y: 338 },
            ],
            color: "#6b7280",
            width: 2,
          },
          // Food ready Yes to serve food
          {
            points: [
              { x: 767, y: 408 },
              { x: 767, y: 445 },
              { x: 764, y: 485 },
            ],
            color: "#6b7280",
            width: 2,
          },
          // Serve food to order more decision
          {
            points: [
              { x: 764, y: 535 },
              { x: 764, y: 560 },
              { x: 700, y: 522 },
            ],
            color: "#6b7280",
            width: 2,
          },
          // Order more Yes - loop back
          {
            points: [
              { x: 595, y: 522 },
              { x: 260, y: 522 },
              { x: 260, y: 363 },
              { x: 270, y: 363 },
            ],
            color: "#6b7280",
            width: 2,
          },
          // Order more No to prepare bill
          {
            points: [
              { x: 647, y: 560 },
              { x: 634, y: 615 },
            ],
            color: "#6b7280",
            width: 2,
          },
          // Prepare bill to end
          {
            points: [
              { x: 634, y: 665 },
              { x: 634, y: 705 },
            ],
            color: "#6b7280",
            width: 2,
          },
        ],
      },
    },

    // 18. Meeting Notes - White
    18: {
      id: 18,
      name: "Meeting Notes - White",
      data: {
        texts: [
          { x: 228, y: 55, content: "NEXT STEPS", style: { fontSize: "18px", fontWeight: "bold", fontFamily: "Inter, sans-serif" } },
          { x: 228, y: 585, content: "OTHER NOTES", style: { fontSize: "18px", fontWeight: "bold", fontFamily: "Inter, sans-serif" } },
        ],
        shapes: [
          // Horizontal divider line
          { type: "rectangle", x: 228, y: 558, attrs: { width: 560, height: 1, fill: "#d1d5db", stroke: "none" } },
        ],
        notes: [
          // Next steps section - white/light gray notes
          { x: 228, y: 90, content: "", color: "#f3f4f6" },

          // Other notes section - white/light gray notes
          { x: 228, y: 620, content: "", color: "#f3f4f6" },
          { x: 342, y: 620, content: "", color: "#f3f4f6" },
        ],
      },
    },

    // 19. Meeting Notes - Purple
    19: {
      id: 19,
      name: "Meeting Notes - Purple",
      data: {
        texts: [
          { x: 228, y: 55, content: "NEXT STEPS", style: { fontSize: "18px", fontWeight: "bold", fontFamily: "Inter, sans-serif" } },
          { x: 228, y: 585, content: "OTHER NOTES", style: { fontSize: "18px", fontWeight: "bold", fontFamily: "Inter, sans-serif" } },
        ],
        shapes: [
          // Horizontal divider line
          { type: "rectangle", x: 228, y: 558, attrs: { width: 560, height: 1, fill: "#d1d5db", stroke: "none" } },
        ],
        notes: [
          // Next steps section - light purple notes
          { x: 228, y: 90, content: "", color: "#f3e8ff" },

          // Other notes section - light purple notes
          { x: 228, y: 620, content: "", color: "#f3e8ff" },
          { x: 342, y: 620, content: "", color: "#f3e8ff" },
        ],
      },
    },

    // 20. Discussion Topic Frame - Blue
    20: {
      id: 20,
      name: "Discussion Topic Frame - Blue",
      data: {
        shapes: [
          // Main light sky blue frame/container
          { type: "rectangle", x: 130, y: 60, attrs: { width: 760, height: 660, fill: "#e0f2fe", stroke: "#bae6fd", "stroke-width": 2, rx: 8 } },

          // Bottom lighter blue section
          { type: "rectangle", x: 130, y: 700, attrs: { width: 760, height: 20, fill: "#f0f9ff", stroke: "none", rx: 0 } },
        ],
        texts: [
          { x: 150, y: 100, content: "DISCUSSION TOPIC 1", style: { fontSize: "22px", fontWeight: "bold", fontFamily: "Inter, sans-serif" } },
          { x: 812, y: 100, content: "5 MIN", style: { fontSize: "22px", fontWeight: "bold", fontFamily: "Inter, sans-serif" } },
        ],
        notes: [
          // One sky blue sticky note for discussion points
          { x: 150, y: 140, content: "", color: "#bae6fd" },
        ],
      },
    },

    // 21. Meeting Agenda - White
    21: {
      id: 21,
      name: "Meeting Agenda - White",
      data: {
        shapes: [
          // Main white frame/container
          { type: "rectangle", x: 100, y: 80, attrs: { width: 830, height: 880, fill: "#ffffff", stroke: "#e5e7eb", "stroke-width": 2, rx: 8 } },

          // Date input box
          { type: "rectangle", x: 140, y: 140, attrs: { width: 290, height: 50, fill: "#ffffff", stroke: "#d1d5db", "stroke-width": 2, rx: 4 } },

          // Horizontal dividers (gray lines)
          { type: "rectangle", x: 140, y: 220, attrs: { width: 750, height: 2, fill: "#d1d5db", stroke: "none" } },
          { type: "rectangle", x: 140, y: 465, attrs: { width: 750, height: 2, fill: "#d1d5db", stroke: "none" } },
        ],
        texts: [
          { x: 140, y: 105, content: "TODAY's DATE", style: { fontSize: "20px", fontWeight: "bold", fontFamily: "Inter, sans-serif" } },
          { x: 147, y: 168, content: "ENTER DATE HERE", style: { fontSize: "16px", fontWeight: "500", fontFamily: "Inter, sans-serif", color: "#6b7280" } },
          { x: 140, y: 265, content: "WHO's HERE?", style: { fontSize: "20px", fontWeight: "bold", fontFamily: "Inter, sans-serif" } },
          { x: 140, y: 510, content: "ADD DISCUSSION TOPICS", style: { fontSize: "20px", fontWeight: "bold", fontFamily: "Inter, sans-serif" } },
        ],
        notes: [
          // Discussion topic notes - light gray
          { x: 140, y: 550, content: "", color: "#e5e7eb" },
          { x: 268, y: 550, content: "", color: "#e5e7eb" },
          { x: 433, y: 550, content: "", color: "#e5e7eb" },
        ],
      },
    },

    // 22. Meeting Agenda - Yellow
    22: {
      id: 22,
      name: "Meeting Agenda - Yellow",
      data: {
        shapes: [
          // Main light yellow frame/container
          { type: "rectangle", x: 100, y: 80, attrs: { width: 830, height: 880, fill: "#fefce8", stroke: "#fde047", "stroke-width": 2, rx: 8 } },

          // Date input box
          { type: "rectangle", x: 140, y: 140, attrs: { width: 290, height: 50, fill: "#ffffff", stroke: "#d1d5db", "stroke-width": 2, rx: 4 } },

          // Horizontal dividers (yellow/orange lines)
          { type: "rectangle", x: 140, y: 220, attrs: { width: 750, height: 2, fill: "#fbbf24", stroke: "none" } },
          { type: "rectangle", x: 140, y: 465, attrs: { width: 750, height: 2, fill: "#fbbf24", stroke: "none" } },
        ],
        texts: [
          { x: 140, y: 105, content: "TODAY's DATE", style: { fontSize: "20px", fontWeight: "bold", fontFamily: "Inter, sans-serif" } },
          { x: 147, y: 168, content: "ENTER DATE HERE", style: { fontSize: "16px", fontWeight: "500", fontFamily: "Inter, sans-serif", color: "#6b7280" } },
          { x: 140, y: 265, content: "WHO's HERE?", style: { fontSize: "20px", fontWeight: "bold", fontFamily: "Inter, sans-serif" } },
          { x: 140, y: 510, content: "ADD DISCUSSION TOPICS", style: { fontSize: "20px", fontWeight: "bold", fontFamily: "Inter, sans-serif" } },
        ],
        notes: [
          // Discussion topic notes - yellow
          { x: 140, y: 550, content: "", color: "#fde68a" },
          { x: 268, y: 550, content: "", color: "#fde68a" },
          { x: 433, y: 550, content: "", color: "#fde68a" },
        ],
      },
    },

    // 23. Daily Standup Board
    23: {
      id: 23,
      name: "Daily Standup Board",
      data: {
        texts: [
          // Column headers
          { x: 200, y: 165, content: "YESTERDAY", style: { fontSize: "16px", fontWeight: "bold", fontFamily: "Inter, sans-serif" } },
          { x: 410, y: 165, content: "TODAY", style: { fontSize: "16px", fontWeight: "bold", fontFamily: "Inter, sans-serif" } },
          { x: 610, y: 165, content: "BLOCKERS", style: { fontSize: "16px", fontWeight: "bold", fontFamily: "Inter, sans-serif" } },
          { x: 795, y: 165, content: "ACTION ITEMS", style: { fontSize: "16px", fontWeight: "bold", fontFamily: "Inter, sans-serif" } },
        ],

        notes: [
          // Yesterday column - Softer Blue notes
          { x: 155, y: 200, content: "Type...", color: "#a7c7e7" },
          { x: 155, y: 365, content: "Type...", color: "#a7c7e7" },

          // Today column - Softer Purple notes
          { x: 360, y: 200, content: "Type...", color: "#d1c4e9" },
          { x: 360, y: 365, content: "Type...", color: "#d1c4e9" },

          // Blockers column - Softer Red/Coral notes
          { x: 565, y: 200, content: "Type...", color: "#ffab91" },
          { x: 565, y: 365, content: "Type...", color: "#ffab91" },

          // Action Items column - Softer Green notes
          { x: 770, y: 200, content: "Type...", color: "#c8e6c9" },
          { x: 770, y: 365, content: "Type...", color: "#c8e6c9" },
        ],
      },
    },
  };
}

new TemplateModal();

// Add CSS for notification animation
const style = document.createElement("style");
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Initialize template modal
document.addEventListener("DOMContentLoaded", () => {
  new TemplateModal();
});
