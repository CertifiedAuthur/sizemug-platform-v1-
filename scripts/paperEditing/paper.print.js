document.addEventListener("DOMContentLoaded", () => {
  const sizemugPrintBtn = document.getElementById("sizemug_print--btn");
  const printDocumentElement = document.querySelector(".print_document_element");

  // Check if button exists before adding listener
  if (sizemugPrintBtn) {
    [printDocumentElement, sizemugPrintBtn].forEach((button) => {
      button.addEventListener("click", () => {
        handlePrint();
        closeDropdownBar(); // close all dropdown
      });
    });
  }
});

function handlePrint() {
  // Check if paperEditors exists
  if (typeof paperEditors === "undefined") {
    console.error("paperEditors is not defined");
    return;
  }

  const pageWrapper = document.createElement("div");
  pageWrapper.classList.add("print-page");

  // Safely iterate through editors
  paperEditors.forEach((editor, index) => {
    if (editor && editor.root) {
      const editorContent = editor.root.innerHTML;

      const container = document.createElement("div");
      container.classList.add("paper", "paper-editor");
      container.innerHTML = editorContent;

      pageWrapper.appendChild(container);
    } else {
      console.warn(`Editor at index ${index} is invalid`);
    }
  });

  // Only proceed if we have content to print
  if (pageWrapper.children.length > 0) {
    printCustomContent(pageWrapper);
  } else {
    console.warn("No valid content to print");
  }
}

// Function to print specific content
function printCustomContent(content) {
  // Remove any existing print frames
  const existingFrame = document.querySelector("#print-frame");
  if (existingFrame) {
    document.body.removeChild(existingFrame);
  }

  // Create a hidden iframe
  const printFrame = document.createElement("iframe");
  printFrame.id = "print-frame"; // Add ID for easy reference
  printFrame.style.position = "fixed";
  printFrame.style.right = "0";
  printFrame.style.bottom = "0";
  printFrame.style.width = "0";
  printFrame.style.height = "0";
  printFrame.style.border = "0";
  printFrame.style.visibility = "hidden"; // Hide frame properly

  document.body.appendChild(printFrame);

  // Get the iframe's document
  const frameDoc = printFrame.contentWindow.document;

  // Write the custom content with styles
  frameDoc.write(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Print</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                padding: 20px;
                margin: 0;
            }
            
            .print-page {
                max-width: 100%;
                margin: 0 auto;
            }

            .paper {
                page-break-inside: avoid;
                margin-bottom: 20px;
            }
            
            table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 1em;
            }
            
            th, td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
            }
            
            th {
                background-color: #f5f5f5;
            }
            
            @media print {
                @page {
                    margin: 1cm;
                }
                
                body {
                    padding: 0;
                }
            }
        </style>
    </head>
    <body>${content.outerHTML}</body>
    </html>
  `);

  frameDoc.close();

  // Wait for iframe to load before printing
  printFrame.onload = function () {
    try {
      printFrame.contentWindow.focus();
      printFrame.contentWindow.print();

      // Remove the iframe after printing with a delay
      setTimeout(() => {
        if (document.body.contains(printFrame)) {
          document.body.removeChild(printFrame);
        }
      }, 1000);
    } catch (error) {
      console.error("Print operation failed:", error);
      // Clean up the frame if printing fails
      if (document.body.contains(printFrame)) {
        document.body.removeChild(printFrame);
      }
    }
  };
}
