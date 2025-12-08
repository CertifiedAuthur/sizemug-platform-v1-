import EmbedPDF from "https://snippet.embedpdf.com/embedpdf.js";

class DocumentPreview {
  constructor(container, opts = {}) {
    this.container = container;
    this.opts = opts;
    this.instance = null;
  }

  async load(src) {
    try {
      // Show loading state
      this._showLoading();

      const fileType = this._detectType(src);

      if (fileType === "pdf") {
        await this._renderPDF(src);
      } else if (fileType === "docx") {
        await this._renderDOCX(src);
      } else if (fileType === "doc") {
        this._renderFallback(src, "DOC files require conversion. DOCX preview is available.");
      } else {
        this._renderFallback(src, "Preview not available. Click to download.");
      }
    } catch (err) {
      console.error("Preview error:", err);
      this._renderError(err.message || "Preview failed.", src);
    }
  }

  _showLoading() {
    this.container.innerHTML = '<div class="doc-loading">Loading document...</div>';
  }

  async _renderPDF(src) {
    // Reset container for PDF
    this.container.innerHTML = "";

    this.instance = await EmbedPDF.init({
      type: "container",
      target: this.container,
      src,
      width: "100%",
      height: "600px",
    });

    if (this.container.querySelector(".header")) {
      this.container.querySelector(".header").style.display = "none";
    }
  }

  async _renderDOCX(src) {
    try {
      // Check if mammoth is available
      if (typeof mammoth === "undefined") {
        throw new Error("Mammoth.js is required for DOCX preview. Include it in your HTML.");
      }

      // Fetch the DOCX file
      const response = await fetch(src);
      if (!response.ok) {
        throw new Error(`Failed to fetch document: ${response.status} ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();

      // Convert DOCX to HTML using mammoth
      const result = await mammoth.convertToHtml(
        { arrayBuffer: arrayBuffer },
        {
          styleMap: ["p[style-name='Title'] => h1:fresh", "p[style-name='Heading 1'] => h1:fresh", "p[style-name='Heading 2'] => h2:fresh", "p[style-name='Heading 3'] => h3:fresh", "p[style-name='Heading 4'] => h4:fresh", "r[style-name='Strong'] => strong", "r[style-name='Emphasis'] => em"],
          convertImage: mammoth.images.imgElement(function (image) {
            return image.read("base64").then(function (imageBuffer) {
              return {
                src: "data:" + image.contentType + ";base64," + imageBuffer,
              };
            });
          }),
        }
      );

      // Clear container and add the converted content
      this.container.innerHTML = "";

      const contentDiv = document.createElement("div");
      contentDiv.className = "docx-content";
      contentDiv.innerHTML = result.value;

      this.container.appendChild(contentDiv);

      // Log any conversion warnings
      if (result.messages.length > 0) {
        console.warn("DOCX conversion warnings:", result.messages);
      }
    } catch (error) {
      console.error("DOCX rendering error:", error);
      throw new Error(`Failed to render DOCX: ${error.message}`);
    }
  }

  _renderFallback(src, message) {
    const wrapper = document.createElement("div");
    wrapper.className = "doc-fallback";
    wrapper.innerHTML = `
      <p>${message} <a href="${src}" target="_blank" download>Download document</a></p>
    `;
    this.container.innerHTML = "";
    this.container.appendChild(wrapper);
  }

  _renderError(message, src) {
    const wrapper = document.createElement("div");
    wrapper.className = "doc-error";
    wrapper.innerHTML = `
      <p style="color: #d63384;">⚠️ ${message}</p>
      ${src ? `<a href="${src}" target="_blank" download>Try downloading instead</a>` : ""}
    `;
    this.container.innerHTML = "";
    this.container.appendChild(wrapper);
  }

  _detectType(src) {
    if (typeof src === "string") {
      const lowerSrc = src.toLowerCase();
      if (lowerSrc.endsWith(".pdf")) return "pdf";
      if (lowerSrc.endsWith(".doc")) return "doc";
      if (lowerSrc.endsWith(".docx")) return "docx";
    }
    return "unknown";
  }

  // Method to destroy current instance
  destroy() {
    if (this.instance && typeof this.instance.destroy === "function") {
      this.instance.destroy();
    }
    this.container.innerHTML = "";
  }
}

// Example usage:
const sizemugDocPreviewContainer = document.getElementById("sizemugDocPreviewContainer");
window.docPreview = new DocumentPreview(sizemugDocPreviewContainer);

// Your existing usage will now work with DOCX preview:
// docPreview.load("http://127.0.0.1:5506/assets/documents/book-generator.pdf");
// docPreview.load("http://127.0.0.1:5506/assets/documents/microsoft.docx");
