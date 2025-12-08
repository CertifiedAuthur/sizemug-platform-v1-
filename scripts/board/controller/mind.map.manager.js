class MindMapManager {
  constructor(svgSelection, getTransform, app) {
    this.svgSelection = svgSelection; // This is the d3 SVG selection
    this.getTransform = getTransform;
    this.app = app || window.app;

    // Fallback for HIDDEN constant
    this._HIDDEN = typeof HIDDEN !== "undefined" ? HIDDEN : "board--hidden";

    // State
    this.counter = 0;
    this.nodes = new Map(); // id -> node data
    this.connections = new Map(); // id -> connection data
    this.selectedNodeId = null;
    this.active = false;
    this.drawingEnabled = false;

    // Interaction state
    this._activeDrag = null;
    this._previewNode = null; // For hover preview
    this._currentEditingInput = null; // Current text editing input
    this._currentEditingNode = null; // Node being edited
    this._currentEditingIndicator = null; // Visual indicator during editing

    // Visual defaults
    this.defaults = {
      nodeWidth: 160,
      nodeHeight: 80,
      nodeRadius: 50,
      fontSize: 16,
      nodeFill: "#7dd3fc",
      nodeStroke: "#a855f7",
      strokeWidth: 2,
      textColor: "#1e293b",
      connectionStroke: "#a855f7",
      connectionWidth: 2,
      plusButtonSize: 28,
      plusButtonColor: "#a855f7",
      spacing: 180,
      previewOpacity: 0.4,
      connectorType: "curved", // Default connector type
      connectorSource: "center", // Default connector source: "center", "edge", "smart"
    };

    // SVG groups for organized rendering
    this.svg = svgSelection; // Use the passed SVG selection directly

    // Use the existing svgGroup from the app (created in whiteboard.app.js)
    this.svgGroup = this.svg.select("g#svgGroup");
    if (this.svgGroup.empty()) {
      console.error("MindMapManager: svgGroup not found - app may not be initialized");
      return;
    }
    this.connectionsGroup = this.svgGroup.append("g").attr("class", "mindmap-connections");
    this.nodesGroup = this.svgGroup.append("g").attr("class", "mindmap-nodes");

    // Event handlers will be bound when defined

    // Subscribe to tool changes
    if (this.app && this.app.toolManager) {
      if (typeof this.app.toolManager.onChange === "function") {
        this._unsubTool = this.app.toolManager.onChange(({ tool }) => this._onAppToolChange(tool));
      } else {
        this._onToolChangeHandler = (e) => this._onAppToolChange(e.detail.tool);
        this.app.toolManager.addEventListener("change", this._onToolChangeHandler);
      }
    }

    this._mindMapEditorEl = document.getElementById("whiteboardMindMapEditorContainer");

    // Initialize Interact.js support
    this._initializeInteract();

    // Make globally accessible for debugging
    this._makeGloballyAccessible();

    //
    this._editorEvents();

    // Initialize connector source button state
    this._updateConnectorSourceButtonState(this.defaults.connectorSource);
  }

  _editorEvents() {
    if (this._mindMapEditorEl) {
      // Mind Map Background Node Color
      const nodeBackgroundColorChange = document.getElementById("nodeBackgroundColorChange");
      const nodeBgInput = nodeBackgroundColorChange.querySelector("input");

      nodeBackgroundColorChange.addEventListener("click", () => {
        nodeBgInput.click();
      });

      nodeBgInput.addEventListener("change", (e) => {
        const color = e.target.value;
        this._updateNodeBackgroundColor(color);
      });

      // Mind Map Border Node Color Editor
      const nodeBorderColorChange = document.getElementById("nodeBorderColorChange");
      const nodeBorderInput = nodeBorderColorChange.querySelector("input");

      nodeBorderColorChange.addEventListener("click", () => {
        nodeBorderInput.click();
      });

      nodeBorderInput.addEventListener("change", (e) => {
        const color = e.target.value;
        this._updateNodeBorderColor(color);
      });

      // Mind Map Shape Node Editor
      const nodeShapeChangeBtn = document.getElementById("nodeShapeChangeBtn");
      const nodeShapeChangeDropdown = document.getElementById("nodeShapeChangeDropdown");

      nodeShapeChangeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        nodeShapeChangeDropdown.classList.remove(this._HIDDEN);
        nodeShapeChangeDropdown.classList.remove("board--hidden");
      });

      // Close dropdown when clicking outside
      document.addEventListener("click", (e) => {
        if (!nodeShapeChangeBtn.contains(e.target) && !nodeShapeChangeDropdown.contains(e.target)) {
          nodeShapeChangeDropdown.classList.add(this._HIDDEN);
          nodeShapeChangeDropdown.classList.add("board--hidden");
        }
      });

      nodeShapeChangeDropdown.addEventListener("click", (e) => {
        const shape = e.target.closest(".mind-map-dropdown-item");

        if (shape) {
          const shapeType = shape.dataset.shapeType;
          this._updateNodeShape(shapeType);

          // Hide dropdown after selection
          nodeShapeChangeDropdown.classList.add(this._HIDDEN);
          nodeShapeChangeDropdown.classList.add("board--hidden");

          // Update active state
          nodeShapeChangeDropdown.querySelectorAll(".mind-map-dropdown-item").forEach((item) => {
            item.classList.remove("active");
          });
          shape.classList.add("active");
        }
      });

      // Mind Map Dash Border Toggle
      const dashBorderToggle = document.getElementById("nodeDashBorderToggle");
      if (dashBorderToggle) {
        dashBorderToggle.addEventListener("click", () => {
          this._toggleNodeDashBorder();
        });
      }

      // Connector Line Type Dropdown
      const connectorLineTypeBtn = document.getElementById("connectorLineTypeBtn");
      const connectorLineTypeDropdown = document.getElementById("connectorLineTypeDropdown");

      if (connectorLineTypeBtn && connectorLineTypeDropdown) {
        connectorLineTypeBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          connectorLineTypeDropdown.classList.remove(this._HIDDEN);
          connectorLineTypeDropdown.classList.remove("board--hidden");
        });

        // Close dropdown when clicking outside
        document.addEventListener("click", (e) => {
          if (!connectorLineTypeBtn.contains(e.target) && !connectorLineTypeDropdown.contains(e.target)) {
            connectorLineTypeDropdown.classList.add(this._HIDDEN);
            connectorLineTypeDropdown.classList.add("board--hidden");
          }
        });

        connectorLineTypeDropdown.addEventListener("click", (e) => {
          const connectorItem = e.target.closest(".mind-map-dropdown-item");

          if (connectorItem) {
            const connectorType = connectorItem.dataset.connectorType;
            this._updateConnectorLineType(connectorType);

            // Hide dropdown after selection
            connectorLineTypeDropdown.classList.add(this._HIDDEN);
            connectorLineTypeDropdown.classList.add("board--hidden");

            // Update active state
            connectorLineTypeDropdown.querySelectorAll(".mind-map-dropdown-item").forEach((item) => {
              item.classList.remove("active");
            });
            connectorItem.classList.add("active");
          }
        });
      }

      // Connector Line Thickness Dropdown
      const connectorLineThicknessBtn = document.getElementById("connectorLineThicknessBtn");
      const connectorLineThicknessDropdown = document.getElementById("connectorLineThicknessDropdown");

      if (connectorLineThicknessBtn && connectorLineThicknessDropdown) {
        connectorLineThicknessBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          connectorLineThicknessDropdown.classList.remove(this._HIDDEN);
          connectorLineThicknessDropdown.classList.remove("board--hidden");
        });

        // Close dropdown when clicking outside
        document.addEventListener("click", (e) => {
          if (!connectorLineThicknessBtn.contains(e.target) && !connectorLineThicknessDropdown.contains(e.target)) {
            connectorLineThicknessDropdown.classList.add(this._HIDDEN);
            connectorLineThicknessDropdown.classList.add("board--hidden");
          }
        });

        connectorLineThicknessDropdown.addEventListener("click", (e) => {
          const thicknessItem = e.target.closest(".mind-map-dropdown-item");

          if (thicknessItem) {
            const thickness = parseInt(thicknessItem.dataset.thickness);
            this._updateConnectorLineThickness(thickness);

            // Hide dropdown after selection
            connectorLineThicknessDropdown.classList.add(this._HIDDEN);
            connectorLineThicknessDropdown.classList.add("board--hidden");

            // Update active state
            connectorLineThicknessDropdown.querySelectorAll(".mind-map-dropdown-item").forEach((item) => {
              item.classList.remove("active");
            });
            thicknessItem.classList.add("active");
          }
        });
      }

      // Connector Source Toggle
      const connectorSourceBtn = document.getElementById("mindMapConnectorSource");
      if (connectorSourceBtn) {
        connectorSourceBtn.addEventListener("click", () => {
          this._toggleConnectorSource();
        });
      }
    }
  }

  _initializeInteract() {
    if (typeof interact === "undefined") {
      console.warn("MindMapManager: Interact.js library not found.");
      this.interactAvailable = false;
      return;
    }
    this.interactAvailable = true;
  }

  _onAppToolChange(tool) {
    if (tool === "mind-map") {
      this.setActive(true);
      this.drawingEnabled = true;
    } else {
      this.setActive(false);
      this.drawingEnabled = false;
    }
  }

  setActive(on) {
    this.active = !!on;
  }

  attach() {
    this._boundStagePointerDown = this._onStagePointerDown.bind(this);
    // Attach to the SVG element - layer manager will handle pointer events
    const svgElement = this.svg.node();
    if (svgElement) {
      svgElement.addEventListener("pointerdown", this._boundStagePointerDown);
    }
  }

  detach() {
    if (this._boundStagePointerDown) {
      const svgElement = this.svg.node();
      if (svgElement) {
        svgElement.removeEventListener("pointerdown", this._boundStagePointerDown);
      }
    }
  }

  _worldPoint(clientX, clientY) {
    const t = this.getTransform();
    return {
      x: (clientX - t.x) / t.k,
      y: (clientY - t.y) / t.k,
    };
  }

  _onStagePointerDown(e) {
    if (!this.active || !this.drawingEnabled) return;
    if (e.button && e.button !== 0) return;

    // Ignore clicks on existing nodes or UI elements
    if (e.target.closest(".mindmap-node") || e.target.closest(".mindmap-plus-button")) return;
    if (e.target.closest(".toolbar, .ui-panel, input, textarea, .manager_containers")) return;

    const worldPoint = this._worldPoint(e.clientX, e.clientY);

    // Create root node
    this.createNode(worldPoint.x, worldPoint.y, "Central Idea", null);

    // Switch back to select tool after creating root node
    if (this.app && this.app.setTool) {
      this.app.setTool("select");
    }

    e.stopPropagation();
    e.preventDefault();
  }

  createNode(x, y, text = "Node", parentId = null) {
    const id = ++this.counter;

    const node = {
      id,
      x,
      y,
      text,
      parentId,
      childIds: [],
      locked: false,
    };

    this.nodes.set(id, node);

    // Add to parent's children if applicable
    if (parentId !== null && this.nodes.has(parentId)) {
      const parent = this.nodes.get(parentId);
      parent.childIds.push(id);

      // Create connection
      this._createConnection(parentId, id);
    }

    this._renderNode(node);
    this._updateAllConnections();

    // Record creation for undo/redo
    if (typeof HistoryManager !== "undefined") {
      HistoryManager.recordOperation("create", "mindmap", "create", {
        id,
        x,
        y,
        text,
        parentId,
      });
    }

    // Select the newly created node
    this._selectNode(node);

    return id;
  }

  _createConnection(fromId, toId) {
    const connId = `conn-${fromId}-${toId}`;
    this.connections.set(connId, { fromId, toId });
  }

  _renderNode(node) {
    const t = this.getTransform();

    // Create node group
    const nodeGroup = this.nodesGroup.append("g").attr("class", "mindmap-node").attr("data-id", node.id).attr("transform", `translate(${node.x}, ${node.y})`).style("cursor", "move");

    // Create node shape using the new shape system
    const fillColor = node.backgroundColor || this.defaults.nodeFill;
    const strokeColor = node.borderColor || this.defaults.nodeStroke;
    this._createNodeShape(nodeGroup, node, fillColor, strokeColor);

    // Text
    nodeGroup.append("text").attr("class", "mindmap-node-text").attr("text-anchor", "middle").attr("dominant-baseline", "middle").attr("fill", this.defaults.textColor).attr("font-size", this.defaults.fontSize).attr("font-weight", "500").text(node.text).style("pointer-events", "none").style("user-select", "none");

    // Add plus buttons around the node
    this._addPlusButtons(nodeGroup, node);

    // Make node draggable
    this._makeNodeDraggable(nodeGroup, node);

    // Single click to select node and show plus buttons
    nodeGroup.on("click", (event) => {
      event.stopPropagation();
      this._selectNode(node);
    });

    // Double-click to edit text
    nodeGroup.on("dblclick", (event) => {
      event.stopPropagation();

      if (node.locked) return;
      this._editNodeText(node);
    });

    // Animate entry
    nodeGroup.style("opacity", 0).transition().duration(300).style("opacity", 1);
  }

  _addPlusButtons(nodeGroup, node) {
    const positions = [
      { x: 0, y: -70, direction: "top" },
      { x: 90, y: 0, direction: "right" },
      { x: 0, y: 70, direction: "bottom" },
      { x: -90, y: 0, direction: "left" },
    ];

    positions.forEach((pos) => {
      const plusGroup = nodeGroup.append("g").attr("class", "mindmap-plus-button").attr("data-direction", pos.direction).attr("transform", `translate(${pos.x}, ${pos.y})`).style("cursor", "pointer").style("opacity", "0").style("transition", "opacity 0.2s ease");

      // Plus button circle with glow effect
      plusGroup
        .append("circle")
        .attr("class", "plus-button-bg")
        .attr("r", this.defaults.plusButtonSize / 2)
        .attr("fill", this.defaults.plusButtonColor)
        .attr("stroke", "white")
        .attr("stroke-width", 2)
        .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.1))")
        .style("transition", "all 0.2s ease");

      // Plus icon
      plusGroup.append("path").attr("d", "M-7,0 L7,0 M0,-7 L0,7").attr("stroke", "white").attr("stroke-width", 2.5).attr("stroke-linecap", "round").style("pointer-events", "none");

      // Hover effects with preview
      plusGroup
        .on("mouseenter", () => {
          plusGroup
            .select(".plus-button-bg")
            .transition()
            .duration(200)
            .attr("r", this.defaults.plusButtonSize / 2 + 2)
            .style("filter", "drop-shadow(0 4px 8px rgba(168, 85, 247, 0.3))");

          // Show preview node
          this._showPreviewNode(node, pos.direction);
        })
        .on("mouseleave", () => {
          plusGroup
            .select(".plus-button-bg")
            .transition()
            .duration(200)
            .attr("r", this.defaults.plusButtonSize / 2)
            .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.1))");

          // Hide preview node
          this._hidePreviewNode();
        })
        .on("click", (event) => {
          event.stopPropagation();
          this._onPlusButtonClick(node.id, pos.direction);
        });
    });

    // Show plus buttons on node hover (only if not selected and not locked)
    nodeGroup
      .on("mouseenter", () => {
        if (node.locked || this.selectedNodeId === node.id) return;
        nodeGroup.selectAll(".mindmap-plus-button").transition().duration(200).style("opacity", "1");
      })
      .on("mouseleave", () => {
        if (node.locked || this.selectedNodeId === node.id) return;
        nodeGroup.selectAll(".mindmap-plus-button").transition().duration(200).style("opacity", "0");
      });
  }

  _showPreviewNode(parentNode, direction) {
    // Remove any existing preview
    this._hidePreviewNode();

    // Calculate position for preview
    let offsetX = 0;
    let offsetY = 0;

    switch (direction) {
      case "top":
        offsetY = -this.defaults.spacing;
        break;
      case "right":
        offsetX = this.defaults.spacing;
        break;
      case "bottom":
        offsetY = this.defaults.spacing;
        break;
      case "left":
        offsetX = -this.defaults.spacing;
        break;
    }

    const previewX = parentNode.x + offsetX;
    const previewY = parentNode.y + offsetY;

    // Create preview group
    this._previewNode = this.nodesGroup.append("g").attr("class", "mindmap-preview-node").attr("transform", `translate(${previewX}, ${previewY})`).style("pointer-events", "none");

    // Preview shape - inherit parent's shape structure
    const parentShape = this._getNodeShape(parentNode);

    if (parentShape === "rectangle") {
      // Preview as rounded rectangle
      const width = this.defaults.nodeWidth * 0.8;
      const height = this.defaults.nodeHeight * 0.8;

      this._previewNode
        .append("rect")
        .attr("x", -width / 2)
        .attr("y", -height / 2)
        .attr("width", width)
        .attr("height", height)
        .attr("rx", 10)
        .attr("ry", 10)
        .attr("fill", this.defaults.nodeFill)
        .attr("stroke", this.defaults.nodeStroke)
        .attr("stroke-width", this.defaults.strokeWidth)
        .attr("stroke-dasharray", "5,5")
        .style("opacity", this.defaults.previewOpacity);
    } else {
      // Preview as ellipse
      this._previewNode
        .append("ellipse")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("rx", this.defaults.nodeRadius * 0.9)
        .attr("ry", this.defaults.nodeRadius * 0.6)
        .attr("fill", this.defaults.nodeFill)
        .attr("stroke", this.defaults.nodeStroke)
        .attr("stroke-width", this.defaults.strokeWidth)
        .attr("stroke-dasharray", "5,5")
        .style("opacity", this.defaults.previewOpacity);
    }

    // Preview text - show what the actual node text will be
    const previewText = this._generateChildNodeText(parentNode);
    this._previewNode.append("text").attr("text-anchor", "middle").attr("dominant-baseline", "middle").attr("fill", this.defaults.textColor).attr("font-size", this.defaults.fontSize).attr("font-weight", "500").text(previewText).style("opacity", this.defaults.previewOpacity);

    // Preview connection
    const previewFromNode = { x: parentNode.x, y: parentNode.y };
    const previewToNode = { x: previewX, y: previewY };
    const previewPathData = this._createConnectionPath(previewFromNode, previewToNode);

    this.connectionsGroup.append("path").attr("class", "mindmap-preview-connection").attr("d", previewPathData).attr("stroke", this.defaults.connectionStroke).attr("stroke-width", this.defaults.connectionWidth).attr("stroke-dasharray", "5,5").attr("fill", "none").attr("stroke-linecap", "round").style("opacity", this.defaults.previewOpacity);

    // Fade in animation
    this._previewNode.style("opacity", 0).transition().duration(200).style("opacity", 1);
  }

  _hidePreviewNode() {
    if (this._previewNode) {
      this._previewNode.transition().duration(200).style("opacity", 0).remove();
      this._previewNode = null;
    }

    // Remove preview connection
    this.connectionsGroup.selectAll(".mindmap-preview-connection").transition().duration(200).style("opacity", 0).remove();
  }

  _onPlusButtonClick(nodeId, direction) {
    const parent = this.nodes.get(nodeId);
    if (!parent || parent.locked) return;

    // Hide preview before creating actual node
    this._hidePreviewNode();

    // Calculate position for new node based on direction
    let offsetX = 0;
    let offsetY = 0;

    switch (direction) {
      case "top":
        offsetY = -this.defaults.spacing;
        break;
      case "right":
        offsetX = this.defaults.spacing;
        break;
      case "bottom":
        offsetY = this.defaults.spacing;
        break;
      case "left":
        offsetX = -this.defaults.spacing;
        break;
    }

    const newX = parent.x + offsetX;
    const newY = parent.y + offsetY;

    // Generate contextual text based on parent
    const childText = this._generateChildNodeText(parent);

    this.createNode(newX, newY, childText, nodeId);
  }

  _generateChildNodeText(parentNode) {
    // Generate more meaningful child node text based on parent
    const parentText = parentNode.text.toLowerCase();

    // Count existing children to create unique names
    const childCount = parentNode.childIds.length + 1;

    // Generate contextual suggestions based on parent content
    if (parentText.includes("idea") || parentText.includes("central")) {
      const suggestions = ["Concept", "Theme", "Topic", "Branch", "Element"];
      return suggestions[childCount % suggestions.length] + ` ${childCount}`;
    } else if (parentText.includes("project") || parentText.includes("plan")) {
      const suggestions = ["Task", "Phase", "Goal", "Step", "Milestone"];
      return suggestions[childCount % suggestions.length] + ` ${childCount}`;
    } else if (parentText.includes("problem") || parentText.includes("issue")) {
      const suggestions = ["Solution", "Approach", "Method", "Strategy", "Option"];
      return suggestions[childCount % suggestions.length] + ` ${childCount}`;
    } else if (parentText.includes("research") || parentText.includes("study")) {
      const suggestions = ["Finding", "Data", "Analysis", "Result", "Insight"];
      return suggestions[childCount % suggestions.length] + ` ${childCount}`;
    } else {
      // Generic contextual names
      const suggestions = ["Subtopic", "Detail", "Point", "Aspect", "Item"];
      return suggestions[childCount % suggestions.length] + ` ${childCount}`;
    }
  }

  _getNodeShape(node) {
    // Helper method to determine the shape of a node
    const nodeGroup = this.nodesGroup.select(`[data-id="${node.id}"]`);
    const shapeElement = nodeGroup.select(".mindmap-node-shape");
    return shapeElement.attr("data-shape") || (node.parentId === null ? "rectangle" : "ellipse");
  }

  _makeNodeDraggable(nodeGroup, node) {
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let activePointerId = null;

    nodeGroup.on("pointerdown", (event) => {
      // Use the PointerEvents API via the original DOM event
      // in D3 v6+ the handler's argument is the native event
      if (node.locked) return;

      // clicking on plus buttons should not start a drag
      const domTarget = event.target;
      if (domTarget && domTarget.closest && domTarget.closest(".mindmap-plus-button")) return;

      event.stopPropagation();
      event.preventDefault();

      isDragging = true;
      activePointerId = event.pointerId;

      const worldPos = this._worldPoint(event.clientX, event.clientY);
      startX = worldPos.x;
      startY = worldPos.y;

      // set pointer capture so we continue to receive pointermove/up
      try {
        if (typeof domTarget.setPointerCapture === "function") domTarget.setPointerCapture(activePointerId);
      } catch (err) {
        // ignore browsers that don't support setPointerCapture on SVG elements
      }

      const onMove = (e) => {
        if (!isDragging || e.pointerId !== activePointerId) return;

        const currentWorld = this._worldPoint(e.clientX, e.clientY);
        const dx = currentWorld.x - startX;
        const dy = currentWorld.y - startY;

        node.x += dx;
        node.y += dy;

        startX = currentWorld.x;
        startY = currentWorld.y;

        this._updateNodePosition(node);
        this._updateAllConnections();

        if (this.selectedNodeId === node.id) {
          this._positionMindMapToolbar(nodeGroup.node());
        }
      };

      const onUp = (e) => {
        if (e.pointerId !== activePointerId) return;
        isDragging = false;
        activePointerId = null;
        try {
          if (typeof domTarget.releasePointerCapture === "function") domTarget.releasePointerCapture(e.pointerId);
        } catch (err) {}
        document.removeEventListener("pointermove", onMove, { passive: false });
        document.removeEventListener("pointerup", onUp, { passive: false });
      };

      document.addEventListener("pointermove", onMove, { passive: false });
      document.addEventListener("pointerup", onUp, { passive: false });
    });

    // fallback for older browsers: still leave touchstart/mousedown removing but pointer events should be primary
  }

  _updateNodePosition(node) {
    const nodeGroup = this.nodesGroup.select(`[data-id="${node.id}"]`);
    nodeGroup.attr("transform", `translate(${node.x}, ${node.y})`);
  }

  _updateAllConnections() {
    this.connectionsGroup.selectAll("path:not(.mindmap-preview-connection)").remove();

    this.connections.forEach(({ fromId, toId }) => {
      const fromNode = this.nodes.get(fromId);
      const toNode = this.nodes.get(toId);

      if (!fromNode || !toNode) return;

      // Create connection path based on connector type
      const pathData = this._createConnectionPath(fromNode, toNode);

      this.connectionsGroup.append("path").attr("d", pathData).attr("stroke", this.defaults.connectionStroke).attr("stroke-width", this.defaults.connectionWidth).attr("fill", "none").attr("stroke-linecap", "round");
    });
  }

  _createConnectionPath(fromNode, toNode) {
    const connectorType = this.defaults.connectorType;

    switch (connectorType) {
      case "curved":
        return this._createCurvedPath(fromNode, toNode);
      case "elbow":
        return this._createElbowPath(fromNode, toNode);
      default:
        return this._createCurvedPath(fromNode, toNode);
    }
  }

  _createCurvedPath(fromNode, toNode) {
    // Calculate connection points based on connector source mode
    const fromPoint = this._calculateConnectionPoint(fromNode, toNode);
    const toPoint = this._calculateConnectionPoint(toNode, fromNode);

    // Create curved path using quadratic bezier
    const midX = (fromPoint.x + toPoint.x) / 2;
    const midY = (fromPoint.y + toPoint.y) / 2;
    const path = `M${fromPoint.x},${fromPoint.y} Q${midX},${midY} ${toPoint.x},${toPoint.y}`;
    return path;
  }

  _createElbowPath(fromNode, toNode) {
    // Calculate connection points based on connector source mode
    const fromPoint = this._calculateConnectionPoint(fromNode, toNode);
    const toPoint = this._calculateConnectionPoint(toNode, fromNode);

    // Create elbow path with right angles
    const dx = toPoint.x - fromPoint.x;
    const dy = toPoint.y - fromPoint.y;

    // Create a more pronounced elbow path
    // Always go horizontal first, then vertical for consistency
    const elbowX = fromPoint.x + dx * 0.5; // Go halfway horizontally
    const elbowY = fromPoint.y; // Stay at same Y level

    // Then go to the target
    const path = `M${fromPoint.x},${fromPoint.y} L${elbowX},${elbowY} L${elbowX},${toPoint.y} L${toPoint.x},${toPoint.y}`;
    return path;
  }

  _updateNodeBackgroundColor(color) {
    if (!this.selectedNodeId) {
      console.warn("No node selected for background color update");
      return;
    }

    const node = this.nodes.get(this.selectedNodeId);
    if (!node) {
      console.warn("Selected node not found");
      return;
    }

    // Update the node's background color
    const nodeGroup = this.nodesGroup.select(`[data-id="${this.selectedNodeId}"]`);
    const nodeShape = nodeGroup.select(".mindmap-node-shape");

    nodeShape.transition().duration(200).attr("fill", color);

    // Store the color in the node data for persistence
    node.backgroundColor = color;

    // Record change for undo/redo
    if (typeof HistoryManager !== "undefined") {
      HistoryManager.recordOperation("modify", "mindmap", "updateBackgroundColor", {
        id: this.selectedNodeId,
        color: color,
      });
    }
  }

  _updateNodeBorderColor(color) {
    if (!this.selectedNodeId) {
      console.warn("No node selected for border color update");
      return;
    }

    const node = this.nodes.get(this.selectedNodeId);
    if (!node) {
      console.warn("Selected node not found");
      return;
    }

    // Update the node's border color
    const nodeGroup = this.nodesGroup.select(`[data-id="${this.selectedNodeId}"]`);
    const nodeShape = nodeGroup.select(".mindmap-node-shape");

    nodeShape.transition().duration(200).attr("stroke", color);

    // Store the color in the node data for persistence
    node.borderColor = color;

    // Record change for undo/redo
    if (typeof HistoryManager !== "undefined") {
      HistoryManager.recordOperation("modify", "mindmap", "updateBorderColor", {
        id: this.selectedNodeId,
        color: color,
      });
    }
  }

  _updateNodeShape(shapeType) {
    if (!this.selectedNodeId) {
      console.warn("No node selected for shape update");
      return;
    }

    const node = this.nodes.get(this.selectedNodeId);
    if (!node) {
      console.warn("Selected node not found");
      return;
    }

    // Store the old shape for undo/redo
    const oldShape = node.shapeType || this._getDefaultShapeForNode(node);

    // Update the node's shape type
    node.shapeType = shapeType;

    // Re-render the node with new shape
    this._rerenderNodeShape(node);

    // Record change for undo/redo
    if (typeof HistoryManager !== "undefined") {
      HistoryManager.recordOperation("modify", "mindmap", "updateShape", {
        id: this.selectedNodeId,
        oldShape: oldShape,
        newShape: shapeType,
      });
    }
  }

  _getDefaultShapeForNode(node) {
    // Default shape logic based on hierarchy
    return node.parentId === null ? "square" : "circle";
  }

  _rerenderNodeShape(node) {
    const nodeGroup = this.nodesGroup.select(`[data-id="${node.id}"]`);

    // Remove existing shape
    nodeGroup.select(".mindmap-node-shape").remove();

    // Get current colors
    const fillColor = node.backgroundColor || this.defaults.nodeFill;
    const strokeColor = node.borderColor || this.defaults.nodeStroke;

    // Create new shape based on type
    this._createNodeShape(nodeGroup, node, fillColor, strokeColor);

    // Ensure the node remains selected visually
    if (this.selectedNodeId === node.id) {
      nodeGroup
        .select(".mindmap-node-shape")
        .attr("stroke-width", this.defaults.strokeWidth + 1)
        .style("filter", "drop-shadow(0 4px 12px rgba(168, 85, 247, 0.3))");
    }
  }

  _createNodeShape(nodeGroup, node, fillColor, strokeColor) {
    const shapeType = node.shapeType || this._getDefaultShapeForNode(node);

    switch (shapeType) {
      case "square":
        this._createRectangleShape(nodeGroup, node, fillColor, strokeColor);
        break;
      case "circle":
        this._createCircleShape(nodeGroup, node, fillColor, strokeColor);
        break;
      case "rotate-rect":
        this._createDiamondShape(nodeGroup, node, fillColor, strokeColor);
        break;
      case "triangle":
        this._createTriangleShape(nodeGroup, node, fillColor, strokeColor);
        break;
      default:
        this._createRectangleShape(nodeGroup, node, fillColor, strokeColor);
    }
  }

  _createRectangleShape(nodeGroup, node, fillColor, strokeColor) {
    const width = node.parentId === null ? this.defaults.nodeWidth : this.defaults.nodeWidth * 0.8;
    const height = node.parentId === null ? this.defaults.nodeHeight : this.defaults.nodeHeight * 0.8;

    const shape = nodeGroup
      .append("rect")
      .attr("class", "mindmap-node-shape")
      .attr("data-shape", "rectangle")
      .attr("x", -width / 2)
      .attr("y", -height / 2)
      .attr("width", width)
      .attr("height", height)
      .attr("rx", 10)
      .attr("ry", 10)
      .attr("fill", fillColor)
      .attr("stroke", strokeColor)
      .attr("stroke-width", this.defaults.strokeWidth)
      .style("transition", "all 0.3s ease");

    // Apply dash border if enabled
    if (node.hasDashBorder) {
      shape.attr("stroke-dasharray", "6,3");
    }
  }

  _createCircleShape(nodeGroup, node, fillColor, strokeColor) {
    const radius = node.parentId === null ? this.defaults.nodeRadius : this.defaults.nodeRadius * 0.8;

    const shape = nodeGroup.append("circle").attr("class", "mindmap-node-shape").attr("data-shape", "circle").attr("cx", 0).attr("cy", 0).attr("r", radius).attr("fill", fillColor).attr("stroke", strokeColor).attr("stroke-width", this.defaults.strokeWidth).style("transition", "all 0.3s ease");

    // Apply dash border if enabled
    if (node.hasDashBorder) {
      shape.attr("stroke-dasharray", "6,3");
    }
  }

  _createDiamondShape(nodeGroup, node, fillColor, strokeColor) {
    const size = node.parentId === null ? this.defaults.nodeRadius : this.defaults.nodeRadius * 0.8;

    const shape = nodeGroup
      .append("rect")
      .attr("class", "mindmap-node-shape")
      .attr("data-shape", "diamond")
      .attr("x", -size / 2)
      .attr("y", -size / 2)
      .attr("width", size)
      .attr("height", size)
      .attr("transform", "rotate(45)")
      .attr("fill", fillColor)
      .attr("stroke", strokeColor)
      .attr("stroke-width", this.defaults.strokeWidth)
      .style("transition", "all 0.3s ease");

    // Apply dash border if enabled
    if (node.hasDashBorder) {
      shape.attr("stroke-dasharray", "6,3");
    }
  }

  _createTriangleShape(nodeGroup, node, fillColor, strokeColor) {
    const size = node.parentId === null ? this.defaults.nodeRadius : this.defaults.nodeRadius * 0.8;
    const height = size * 0.866; // Triangle height

    const points = [
      [0, -height / 2], // Top point
      [-size / 2, height / 2], // Bottom left
      [size / 2, height / 2], // Bottom right
    ];

    const pathData = `M${points[0][0]},${points[0][1]} L${points[1][0]},${points[1][1]} L${points[2][0]},${points[2][1]} Z`;

    const shape = nodeGroup.append("path").attr("class", "mindmap-node-shape").attr("data-shape", "triangle").attr("d", pathData).attr("fill", fillColor).attr("stroke", strokeColor).attr("stroke-width", this.defaults.strokeWidth).style("transition", "all 0.3s ease");

    // Apply dash border if enabled
    if (node.hasDashBorder) {
      shape.attr("stroke-dasharray", "6,3");
    }
  }

  _toggleNodeDashBorder() {
    if (!this.selectedNodeId) {
      console.warn("No node selected for dash border toggle");
      return;
    }

    const node = this.nodes.get(this.selectedNodeId);
    if (!node) {
      console.warn("Selected node not found");
      return;
    }

    // Toggle the dash border state
    node.hasDashBorder = !node.hasDashBorder;

    // Update the node's border style
    const nodeGroup = this.nodesGroup.select(`[data-id="${this.selectedNodeId}"]`);
    const nodeShape = nodeGroup.select(".mindmap-node-shape");

    if (node.hasDashBorder) {
      nodeShape.transition().duration(200).attr("stroke-dasharray", "6,3");
    } else {
      nodeShape.transition().duration(200).attr("stroke-dasharray", "none");
    }

    // Update button visual state
    this._updateDashBorderButtonState(node.hasDashBorder);

    // Record change for undo/redo
    if (typeof HistoryManager !== "undefined") {
      HistoryManager.recordOperation("modify", "mindmap", "toggleDashBorder", {
        id: this.selectedNodeId,
        hasDashBorder: node.hasDashBorder,
      });
    }
  }

  _updateDashBorderButtonState(hasDashBorder) {
    const dashBorderToggle = document.getElementById("nodeDashBorderToggle");
    if (dashBorderToggle) {
      if (hasDashBorder) {
        dashBorderToggle.classList.add("active");
        dashBorderToggle.style.background = "var(--primary-color, #8b5cf6)";
      } else {
        dashBorderToggle.classList.remove("active");
        dashBorderToggle.style.background = "";
      }
    }
  }

  _updateConnectorLineType(connectorType) {
    // Update the global connector type
    this.defaults.connectorType = connectorType;

    // Re-render all connections with the new type
    this._updateAllConnections();

    // Record change for undo/redo
    if (typeof HistoryManager !== "undefined") {
      HistoryManager.recordOperation("modify", "mindmap", "updateConnectorType", {
        connectorType: connectorType,
      });
    }
  }

  _updateConnectorLineThickness(thickness) {
    // Update the global connection width
    this.defaults.connectionWidth = thickness;

    // Re-render all connections with the new thickness
    this._updateAllConnections();

    // Record change for undo/redo
    if (typeof HistoryManager !== "undefined") {
      HistoryManager.recordOperation("modify", "mindmap", "updateConnectorThickness", {
        thickness: thickness,
      });
    }
  }

  // Test method for debugging - can be called from console
  testConnectorType(type) {
    this._updateConnectorLineType(type);
  }

  testConnectorThickness(thickness) {
    this._updateConnectorLineThickness(thickness);
  }

  _toggleConnectorSource() {
    const modes = ["center", "edge", "smart"];
    const currentIndex = modes.indexOf(this.defaults.connectorSource);
    const nextIndex = (currentIndex + 1) % modes.length;
    const newMode = modes[nextIndex];

    // Update the connector source mode
    this.defaults.connectorSource = newMode;

    // Update button visual state
    this._updateConnectorSourceButtonState(newMode);

    // Re-render all connections with new source points
    this._updateAllConnections();

    // Record change for undo/redo
    if (typeof HistoryManager !== "undefined") {
      HistoryManager.recordOperation("modify", "mindmap", "updateConnectorSource", {
        connectorSource: newMode,
      });
    }
  }

  _updateConnectorSourceButtonState(mode) {
    const connectorSourceBtn = document.getElementById("mindMapConnectorSource");
    if (connectorSourceBtn) {
      // Remove all mode classes
      connectorSourceBtn.classList.remove("source-center", "source-edge", "source-smart");

      // Add current mode class
      connectorSourceBtn.classList.add(`source-${mode}`);

      // Update button appearance based on mode
      switch (mode) {
        case "center":
          connectorSourceBtn.style.background = "";
          connectorSourceBtn.title = "Connector Source: Center";
          break;
        case "edge":
          connectorSourceBtn.style.background = "rgba(139, 92, 246, 0.3)";
          connectorSourceBtn.title = "Connector Source: Edge";
          break;
        case "smart":
          connectorSourceBtn.style.background = "var(--primary-color, #8b5cf6)";
          connectorSourceBtn.title = "Connector Source: Smart";
          break;
      }
    }
  }

  _calculateConnectionPoint(node, targetNode, mode = null) {
    const sourceMode = mode || this.defaults.connectorSource;

    switch (sourceMode) {
      case "center":
        return { x: node.x, y: node.y };

      case "edge":
        return this._calculateEdgeConnectionPoint(node, targetNode);

      case "smart":
        return this._calculateSmartConnectionPoint(node, targetNode);

      default:
        return { x: node.x, y: node.y };
    }
  }

  _calculateEdgeConnectionPoint(fromNode, toNode) {
    // Calculate the point on the node's edge closest to the target
    const dx = toNode.x - fromNode.x;
    const dy = toNode.y - fromNode.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance === 0) return { x: fromNode.x, y: fromNode.y };

    // Normalize direction
    const dirX = dx / distance;
    const dirY = dy / distance;

    // Get node dimensions based on shape
    const nodeShape = this._getNodeShapeType(fromNode);
    let radius;

    switch (nodeShape) {
      case "circle":
        radius = fromNode.parentId === null ? this.defaults.nodeRadius : this.defaults.nodeRadius * 0.8;
        return {
          x: fromNode.x + dirX * radius,
          y: fromNode.y + dirY * radius,
        };

      case "rectangle":
      case "diamond":
      case "triangle":
      default:
        // For rectangular shapes, calculate intersection with rectangle bounds
        const width = fromNode.parentId === null ? this.defaults.nodeWidth : this.defaults.nodeWidth * 0.8;
        const height = fromNode.parentId === null ? this.defaults.nodeHeight : this.defaults.nodeHeight * 0.8;

        // Calculate intersection with rectangle
        const halfWidth = width / 2;
        const halfHeight = height / 2;

        // Find which edge the line intersects
        const tX = Math.abs(dirX) < 0.001 ? Infinity : halfWidth / Math.abs(dirX);
        const tY = Math.abs(dirY) < 0.001 ? Infinity : halfHeight / Math.abs(dirY);

        const t = Math.min(tX, tY);

        return {
          x: fromNode.x + dirX * t,
          y: fromNode.y + dirY * t,
        };
    }
  }

  _calculateSmartConnectionPoint(fromNode, toNode) {
    // Smart mode: choose the best connection point based on relative positions
    const dx = toNode.x - fromNode.x;
    const dy = toNode.y - fromNode.y;

    // Determine primary direction
    const isHorizontal = Math.abs(dx) > Math.abs(dy);

    if (isHorizontal) {
      // Connect from left or right edge
      const side = dx > 0 ? 1 : -1;
      const width = fromNode.parentId === null ? this.defaults.nodeWidth : this.defaults.nodeWidth * 0.8;
      return {
        x: fromNode.x + side * (width / 2),
        y: fromNode.y,
      };
    } else {
      // Connect from top or bottom edge
      const side = dy > 0 ? 1 : -1;
      const height = fromNode.parentId === null ? this.defaults.nodeHeight : this.defaults.nodeHeight * 0.8;
      return {
        x: fromNode.x,
        y: fromNode.y + side * (height / 2),
      };
    }
  }

  _getNodeShapeType(node) {
    // Get the shape type for connection calculations
    return node.shapeType || this._getDefaultShapeForNode(node);
  }

  testConnectorSource(mode) {
    this.defaults.connectorSource = mode;
    this._updateConnectorSourceButtonState(mode);
    this._updateAllConnections();
  }

  // Make this instance globally accessible for debugging
  _makeGloballyAccessible() {
    if (typeof window !== "undefined") {
      window.mindMapManager = this;
    }
  }

  _editNodeText(node) {
    const nodeGroup = this.nodesGroup.select(`[data-id="${node.id}"]`);
    const textEl = nodeGroup.select(".mindmap-node-text");
    const currentText = textEl.text();

    // Hide the original text while editing
    textEl.style("opacity", "0");

    // Get node shape and calculate editor bounds
    const nodeShape = this._getNodeShape(node);
    const t = this.getTransform();

    // Get the actual node bounds in screen coordinates
    const nodeElement = nodeGroup.node();
    const nodeBounds = nodeElement.getBoundingClientRect();

    // Calculate editor dimensions with padding
    const padding = 12;
    let editorWidth, editorHeight;

    if (nodeShape === "rectangle") {
      editorWidth = nodeBounds.width - padding * 2;
      editorHeight = nodeBounds.height - padding * 2;
    } else {
      // For ellipse, use a smaller area to fit nicely inside
      editorWidth = nodeBounds.width * 0.7;
      editorHeight = nodeBounds.height * 0.6;
    }

    // Create contenteditable container that fits inside the node
    const editorContainer = document.createElement("div");
    editorContainer.className = "mindmap-text-editor-overlay";
    editorContainer.contentEditable = "true";
    editorContainer.textContent = currentText;

    editorContainer.style.cssText = `
      position: fixed;
      left: ${nodeBounds.left + nodeBounds.width / 2}px;
      top: ${nodeBounds.top + nodeBounds.height / 2}px;
      width: ${editorWidth}px;
      min-height: ${Math.min(editorHeight, 24)}px;
      max-height: ${editorHeight}px;
      transform: translate(-50%, -50%);
      font-size: ${this.defaults.fontSize * t.k}px;
      font-weight: 500;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: ${this.defaults.textColor};
      text-align: center;
      background: transparent;
      border: none;
      outline: none;
      z-index: 10001;
      overflow: hidden;
      word-wrap: break-word;
      line-height: 1.2;
      padding: 4px;
      box-sizing: border-box;
      resize: none;
      white-space: pre-wrap;
      overflow-wrap: break-word;
    `;

    // Add visual indicator (subtle background)
    const indicator = document.createElement("div");
    indicator.className = "mindmap-edit-indicator";
    indicator.style.cssText = `
      position: fixed;
      left: ${nodeBounds.left}px;
      top: ${nodeBounds.top}px;
      width: ${nodeBounds.width}px;
      height: ${nodeBounds.height}px;
      background: rgba(139, 92, 246, 0.1);
      border: 2px solid rgba(139, 92, 246, 0.3);
      border-radius: ${nodeShape === "rectangle" ? "10px" : "50%"};
      z-index: 10000;
      pointer-events: none;
    `;

    document.body.appendChild(indicator);
    document.body.appendChild(editorContainer);

    // Store references
    this._currentEditingInput = editorContainer;
    this._currentEditingNode = node;
    this._currentEditingIndicator = indicator;

    // Keep the toolbar visible and positioned correctly during editing
    this._showMindMapToolbar(nodeElement);

    // Add event handler to reposition toolbar if needed during editing
    const repositionToolbar = () => {
      if (this._currentEditingInput) {
        this._positionMindMapToolbar(nodeElement);
      }
    };

    // Store the handler for cleanup
    editorContainer._repositionHandler = repositionToolbar;

    // Focus and select all text
    editorContainer.focus();

    // Select all text content
    setTimeout(() => {
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(editorContainer);
      selection.removeAllRanges();
      selection.addRange(range);
    }, 0);

    const finishEdit = () => {
      const newText = editorContainer.textContent.trim() || "Node";
      node.text = newText;
      textEl.text(newText);

      // Show original text and cleanup
      textEl.style("opacity", "1");
      editorContainer.remove();
      indicator.remove();

      // Keep toolbar visible and reposition it for the updated node
      this._showMindMapToolbar(nodeElement);

      // Clear editing references
      this._currentEditingInput = null;
      this._currentEditingNode = null;
      this._currentEditingIndicator = null;
    };

    const cancelEdit = () => {
      // Show original text and cleanup
      textEl.style("opacity", "1");
      editorContainer.remove();
      indicator.remove();

      // Keep toolbar visible and reposition it
      this._showMindMapToolbar(nodeElement);

      // Clear editing references
      this._currentEditingInput = null;
      this._currentEditingNode = null;
      this._currentEditingIndicator = null;
    };

    // Handle keyboard events
    const handleKeyDown = (e) => {
      e.stopPropagation();

      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        finishEdit();
      } else if (e.key === "Escape") {
        e.preventDefault();
        cancelEdit();
      }
      // Allow formatting shortcuts
      else if (e.ctrlKey || e.metaKey) {
        // Let browser handle Ctrl+B, Ctrl+I, etc.
        return;
      }
    };

    // Handle input to auto-resize
    const handleInput = () => {
      // Auto-adjust height based on content
      editorContainer.style.height = "auto";
      const scrollHeight = editorContainer.scrollHeight;
      const maxHeight = editorHeight;
      editorContainer.style.height = Math.min(scrollHeight, maxHeight) + "px";
    };

    editorContainer.addEventListener("blur", finishEdit);
    editorContainer.addEventListener("keydown", handleKeyDown);
    editorContainer.addEventListener("input", handleInput);

    // Prevent event bubbling
    editorContainer.addEventListener("mousedown", (e) => {
      e.stopPropagation();
    });

    editorContainer.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    // Listen for viewport changes (zoom/pan) to hide the editor
    const viewport = this.app?.viewportNode || document.getElementById("viewport");
    if (viewport) {
      const onViewportChange = () => {
        if (this._currentEditingInput) {
          cancelEdit();
        }
      };

      // Listen for wheel events (zoom)
      viewport.addEventListener("wheel", onViewportChange, { once: true });

      // Listen for pointer events that might indicate panning
      viewport.addEventListener("pointerdown", onViewportChange, { once: true });
    }
  }

  _selectNode(node) {
    this.clearSelection();

    this.selectedNodeId = node.id;
    const locked = node.locked;

    // Highlight selected node
    const nodeGroup = this.nodesGroup.select(`[data-id="${node.id}"]`);
    nodeGroup
      .select(".mindmap-node-shape")
      .transition()
      .duration(200)
      .attr("stroke-width", this.defaults.strokeWidth + 1)
      .style("filter", "drop-shadow(0 4px 12px rgba(168, 85, 247, 0.3))");

    // Show plus buttons for selected node (if not locked)
    if (!locked) {
      nodeGroup.selectAll(".mindmap-plus-button").transition().duration(200).style("opacity", "1");
    }

    // Show mind map toolbar positioned above the node
    this._showMindMapToolbar(nodeGroup.node());

    // Update toolbar state based on selected node
    this._updateToolbarForNode(node);
  }

  _positionMindMapEditorWrapper(nodeElement = null) {
    const editor = this._mindMapEditorEl;
    const viewport = this.app?.viewportNode || document.getElementById("viewport");

    if (!editor || !viewport) return;

    const gap = 8;
    let left, top;

    if (nodeElement) {
      const vpRect = viewport.getBoundingClientRect();
      const nodeRect = nodeElement.getBoundingClientRect();

      left = nodeRect.left + nodeRect.width / 2 - editor.offsetWidth / 2;
      const candidateTop = nodeRect.top - editor.offsetHeight - gap;

      if (candidateTop >= gap) {
        top = candidateTop;
      } else {
        top = nodeRect.bottom + gap;
      }

      left = Math.max(gap, Math.min(left, window.innerWidth - editor.offsetWidth - gap));
      top = Math.max(gap, Math.min(top, window.innerHeight - editor.offsetHeight - gap));
    } else {
      left = window.innerWidth / 2 - editor.offsetWidth / 2;
      top = gap;
    }

    editor.style.position = "fixed";
    editor.style.left = `${Math.round(left)}px`;
    editor.style.top = `${Math.round(top)}px`;
  }

  _showMindMapToolbar(nodeElement) {
    const toolbar = this._mindMapEditorEl;
    if (!toolbar) {
      console.warn("Mind map editor element not found");
      return;
    }

    // Remove hidden classes (try both possible class names)
    toolbar.classList.remove(this._HIDDEN);
    toolbar.classList.remove("board--hidden");

    // Add event handlers to prevent toolbar interactions from affecting node selection
    if (!toolbar._mindMapEventHandlersAdded) {
      toolbar.addEventListener("pointerdown", (e) => {
        const interactive = e.target.closest("select, input, button, textarea, label, [contenteditable], [role=button]");
        if (interactive) return;
        e.preventDefault();
        e.stopPropagation();
      });
      toolbar.addEventListener("click", (e) => e.stopPropagation());
      toolbar._mindMapEventHandlersAdded = true;
    }

    this._positionMindMapToolbar(nodeElement);
  }

  _hideMindMapToolbar() {
    const toolbar = this._mindMapEditorEl;
    if (!toolbar) return;

    // Add hidden classes
    toolbar.classList.add(this._HIDDEN);
    toolbar.classList.add("board--hidden");
  }

  _positionMindMapToolbar(nodeElement = null) {
    const toolbar = this._mindMapEditorEl;
    const viewport = this.app?.viewportNode || document.getElementById("viewport");

    if (!toolbar || !viewport) {
      console.warn("Toolbar or viewport element not found for positioning");
      return;
    }

    // Ensure toolbar is attached to body to avoid clipping issues (like text manager)
    if (toolbar.parentElement !== document.body) {
      document.body.appendChild(toolbar);
      toolbar.style.position = "fixed";
      toolbar.style.zIndex = "10002";
    }

    const gap = 10;
    let centerXClient, topClient;

    if (nodeElement) {
      const nodeRect = nodeElement.getBoundingClientRect();
      const vpRect = viewport.getBoundingClientRect();

      // Position toolbar above the node, centered horizontally
      centerXClient = nodeRect.left + nodeRect.width / 2;
      topClient = nodeRect.top - (toolbar.offsetHeight || 60) - gap;

      // If toolbar would go off-screen at the top, position it below the node
      if (topClient < 6) {
        topClient = nodeRect.bottom + gap;
      }

      // Keep toolbar within viewport horizontally
      // Since we use translateX(-50%), we need to account for half the toolbar width
      const toolbarWidth = toolbar.offsetWidth || 300;
      const halfWidth = toolbarWidth / 2;
      const minCenterX = halfWidth + 6; // Left edge constraint
      const maxCenterX = window.innerWidth - halfWidth - 6; // Right edge constraint

      centerXClient = Math.max(minCenterX, Math.min(centerXClient, maxCenterX));
      topClient = Math.max(6, Math.min(topClient, window.innerHeight - (toolbar.offsetHeight || 60) - 6));
    } else {
      // Fallback positioning - center of screen
      centerXClient = window.innerWidth / 2;
      topClient = 100;
    }

    // Apply positioning (similar to text manager)
    toolbar.style.position = "fixed";
    toolbar.style.left = Math.round(centerXClient) + "px";
    toolbar.style.top = Math.round(topClient) + "px";
    toolbar.style.zIndex = "10002";
  }

  _showMindMapEditorWrapper(nodeElement) {
    // This method is kept for backward compatibility but now just calls the toolbar method
    this._showMindMapToolbar(nodeElement);
  }

  _hideMindMapEditorWrapper() {
    this._hideMindMapToolbar();
  }

  _updateToolbarForNode(node) {
    if (!this._mindMapEditorEl) return;

    // Update node type display
    const nodeTypeBtn = this._mindMapEditorEl.querySelector(".node_type_lists span:last-child");
    if (nodeTypeBtn) {
      nodeTypeBtn.textContent = node.parentId === null ? "Parent" : "Child";
    }

    // Update colors based on node
    const bgColorPicker = this._mindMapEditorEl.querySelector(".current_picker_color");
    if (bgColorPicker) {
      bgColorPicker.style.background = node.backgroundColor || this.defaults.nodeFill;
    }

    const borderColorPicker = this._mindMapEditorEl.querySelector(".current_picker_color_border");
    if (borderColorPicker) {
      borderColorPicker.style.background = node.borderColor || this.defaults.nodeStroke;
    }

    // Update color input values to match current node colors
    const bgInput = this._mindMapEditorEl.querySelector("#nodeBackgroundColorChange input");
    if (bgInput) {
      bgInput.value = node.backgroundColor || this.defaults.nodeFill;
    }

    const borderInput = this._mindMapEditorEl.querySelector("#nodeBorderColorChange input");
    if (borderInput) {
      borderInput.value = node.borderColor || this.defaults.nodeStroke;
    }

    // Update shape dropdown active state
    const currentShape = node.shapeType || this._getDefaultShapeForNode(node);
    const shapeDropdown = this._mindMapEditorEl.querySelector("#nodeShapeChangeDropdown");
    if (shapeDropdown) {
      // Remove active class from all items
      shapeDropdown.querySelectorAll(".mind-map-dropdown-item").forEach((item) => {
        item.classList.remove("active");
      });

      // Add active class to current shape
      const activeShapeItem = shapeDropdown.querySelector(`[data-shape-type="${currentShape}"]`);
      if (activeShapeItem) {
        activeShapeItem.classList.add("active");
      }
    }

    // Update dash border button state
    this._updateDashBorderButtonState(node.hasDashBorder || false);

    // Update connector line type dropdown active state
    const connectorDropdown = this._mindMapEditorEl.querySelector("#connectorLineTypeDropdown");
    if (connectorDropdown) {
      // Remove active class from all items
      connectorDropdown.querySelectorAll(".mind-map-dropdown-item").forEach((item) => {
        item.classList.remove("active");
      });

      // Add active class to current connector type
      const activeConnectorItem = connectorDropdown.querySelector(`[data-connector-type="${this.defaults.connectorType}"]`);
      if (activeConnectorItem) {
        activeConnectorItem.classList.add("active");
      }
    }

    // Update connector line thickness dropdown active state
    const thicknessDropdown = this._mindMapEditorEl.querySelector("#connectorLineThicknessDropdown");
    if (thicknessDropdown) {
      // Remove active class from all items
      thicknessDropdown.querySelectorAll(".mind-map-dropdown-item").forEach((item) => {
        item.classList.remove("active");
      });

      // Add active class to current thickness
      const activeThicknessItem = thicknessDropdown.querySelector(`[data-thickness="${this.defaults.connectionWidth}"]`);
      if (activeThicknessItem) {
        activeThicknessItem.classList.add("active");
      }
    }

    // Update connector source button state
    this._updateConnectorSourceButtonState(this.defaults.connectorSource);

    // Update lock button state
    const lockBtn = this._mindMapEditorEl.querySelector(".lockFlipCard");
    if (lockBtn) {
      const lockText = lockBtn.querySelector("span:last-child");
      if (lockText) {
        lockText.textContent = node.locked ? "Unlock" : "Lock";
      }
    }
  }

  _cancelTextEditing() {
    if (this._currentEditingInput) {
      // Show original text
      if (this._currentEditingNode) {
        const nodeGroup = this.nodesGroup.select(`[data-id="${this._currentEditingNode.id}"]`);
        const textEl = nodeGroup.select(".mindmap-node-text");
        textEl.style("opacity", "1");

        // Keep toolbar visible and reposition it
        this._showMindMapToolbar(nodeGroup.node());
      }

      // Remove editor and indicator
      this._currentEditingInput.remove();
      if (this._currentEditingIndicator) {
        this._currentEditingIndicator.remove();
      }

      // Clear references
      this._currentEditingInput = null;
      this._currentEditingNode = null;
      this._currentEditingIndicator = null;
    }
  }

  clearSelection() {
    if (this.selectedNodeId !== null) {
      const nodeGroup = this.nodesGroup.select(`[data-id="${this.selectedNodeId}"]`);
      nodeGroup.select(".mindmap-node-shape").transition().duration(200).attr("stroke-width", this.defaults.strokeWidth).style("filter", "none");

      // Hide plus buttons when deselecting
      nodeGroup.selectAll(".mindmap-plus-button").transition().duration(200).style("opacity", "0");
    }

    this.selectedNodeId = null;

    // Only hide toolbar if not currently editing
    if (!this._currentEditingInput) {
      this._hideMindMapToolbar();
    }

    window.dispatchEvent(new CustomEvent("board-selection-changed", { detail: { type: null } }));
  }

  refreshScreenPositions() {
    // Cancel any active text editing when viewport changes
    this._cancelTextEditing();

    // SVG elements use world coordinates, so we don't need to update positions
    // Just update connections in case transform changed
    this._updateAllConnections();

    // Update toolbar position if a node is selected
    if (this.selectedNodeId !== null) {
      const nodeGroup = this.nodesGroup.select(`[data-id="${this.selectedNodeId}"]`);
      if (!nodeGroup.empty()) {
        this._positionMindMapToolbar(nodeGroup.node());
      }
    }
  }

  remove(nodeId) {
    const node = this.nodes.get(nodeId);
    if (!node) return;

    // Record deletion for undo/redo before removing
    if (typeof HistoryManager !== "undefined") {
      HistoryManager.recordOperation("delete", "mindmap", "remove", {
        id: nodeId,
        x: node.x,
        y: node.y,
        text: node.text,
        parentId: node.parentId,
        childIds: [...node.childIds], // copy the array
      });
    }

    // Remove all children recursively
    node.childIds.forEach((childId) => {
      this.remove(childId);
    });

    // Remove connections
    this.connections.forEach((conn, connId) => {
      if (conn.fromId === nodeId || conn.toId === nodeId) {
        this.connections.delete(connId);
      }
    });

    // Remove from parent's children
    if (node.parentId !== null) {
      const parent = this.nodes.get(node.parentId);
      if (parent) {
        parent.childIds = parent.childIds.filter((id) => id !== nodeId);
      }
    }

    // Remove from DOM with animation
    const nodeGroup = this.nodesGroup.select(`[data-id="${nodeId}"]`);
    nodeGroup.transition().duration(300).style("opacity", 0).remove();

    // Remove from map
    this.nodes.delete(nodeId);

    this._updateAllConnections();

    if (this.selectedNodeId === nodeId) {
      this.clearSelection();
    }
  }

  toggleLockById(nodeId) {
    const node = this.nodes.get(nodeId);
    if (!node) return false;

    node.locked = !node.locked;

    const nodeGroup = this.nodesGroup.select(`[data-id="${nodeId}"]`);

    if (node.locked) {
      nodeGroup.style("cursor", "default");
      // Add visual lock indicator if desired
    } else {
      nodeGroup.style("cursor", "move");
    }

    window.dispatchEvent(
      new CustomEvent("mindmap-lock-changed", {
        detail: { id: nodeId, locked: node.locked },
      })
    );

    return node.locked;
  }

  getSelectionBoxScreenRect() {
    if (this.selectedNodeId === null) return null;

    const nodeGroup = this.nodesGroup.select(`[data-id="${this.selectedNodeId}"]`);
    if (nodeGroup.empty()) return null;

    const nodeElement = nodeGroup.node();
    return nodeElement.getBoundingClientRect();
  }

  // Method to recreate a node from data (for undo/redo)
  createFromData(data) {
    const node = {
      id: data.id,
      x: data.x,
      y: data.y,
      text: data.text,
      parentId: data.parentId,
      childIds: data.childIds || [],
      locked: false,
    };

    this.nodes.set(data.id, node);

    // Update counter to avoid ID conflicts
    if (data.id >= this.counter) {
      this.counter = data.id;
    }

    // Add to parent's children if applicable
    if (data.parentId !== null && this.nodes.has(data.parentId)) {
      const parent = this.nodes.get(data.parentId);
      if (!parent.childIds.includes(data.id)) {
        parent.childIds.push(data.id);
      }

      // Create connection
      this._createConnection(data.parentId, data.id);
    }

    this._renderNode(node);
    this._updateAllConnections();

    return data.id;
  }

  // Method to update toolbar position for selected node (called from app)
  updateToolbarPosition() {
    if (this.selectedNodeId !== null) {
      const nodeGroup = this.nodesGroup.select(`[data-id="${this.selectedNodeId}"]`);
      if (!nodeGroup.empty()) {
        this._positionMindMapToolbar(nodeGroup.node());
      }
    }
  }

  // Test method to manually show toolbar
  testShowToolbar() {
    if (this._mindMapEditorEl) {
      this._mindMapEditorEl.classList.remove("board--hidden");
      this._mindMapEditorEl.style.position = "fixed";
      this._mindMapEditorEl.style.top = "100px";
      this._mindMapEditorEl.style.left = "100px";
      this._mindMapEditorEl.style.zIndex = "10002";
    } else {
      console.log("Toolbar element NOT found");
    }
  }

  destroy() {
    this.detach();

    // Cancel any active text editing
    this._cancelTextEditing();

    if (this._unsubTool) this._unsubTool();
    if (this._onToolChangeHandler && this.app?.toolManager) {
      this.app.toolManager.removeEventListener("change", this._onToolChangeHandler);
    }

    this.connectionsGroup.remove();
    this.nodesGroup.remove();
    this.nodes.clear();
    this.connections.clear();
  }
}
