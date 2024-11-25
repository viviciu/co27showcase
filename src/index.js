import React from "react";
import ReactDOM from "react-dom/client";
import ForceGraph2D from "react-force-graph-2d";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import data from "./data.json";

const root = ReactDOM.createRoot(document.getElementById("graph"));

// Preload images and store them in a cache
const imageCache = {};

const preloadImages = (nodes) => {
  nodes.forEach((node) => {
    if (node.img && !imageCache[node.img]) {
      const img = new Image();
      img.src = node.img;
      imageCache[node.img] = img;
    }
  });
};

// Preload images
preloadImages(data.nodes);

const nodePaint = (node, ctx, globalScale) => {
  const img = imageCache[node.img];
  const size = (node.val || 30) / globalScale; // Adjust the size as needed

  if (img) {
    ctx.drawImage(img, node.x - size / 2, node.y - size / 2, size, size);
  }

  node.__bckgDimensions = [size, size]; // to re-use in nodePointerAreaPaint
};
// TEST COMMENT
const nodeLabelPaint = (node, ctx, globalScale) => {
  if (node.group === "TRACK") {
    // Draws label only for TRACK nodes
    const label = node.description;
    const fontSize = 12 / globalScale;
    ctx.font = `${fontSize}px Sans-Serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "black"; // Change this to your desired text color
    ctx.fillText(label, node.x, node.y + 20); // Adjust the position as needed
  }
};

const nodePointerAreaPaint = (node, color, ctx) => {
  ctx.fillStyle = color;
  const bckgDimensions = node.__bckgDimensions;
  bckgDimensions &&
    ctx.fillRect(
      node.x - bckgDimensions[0] / 2,
      node.y - bckgDimensions[1] / 2,
      ...bckgDimensions
    );
};

root.render(
  <React.StrictMode>
    <ForceGraph2D
      backgroundColor="#ffffff"
      graphData={data}
      nodeLabel={(node) => (node.group !== "TRACK" ? `${node.id}` : "")} // SENIOR QUOTES: set node.description. NAMES: set node.id. if node is not a track
      linkColor={() => "black"}
      onNodeClick={(node) => {
        if (node.url) {
          window.open(node.url, "_blank");
        }
      }}
      nodeCanvasObject={(node, ctx, globalScale) => {
        nodePaint(node, ctx, globalScale);
        nodeLabelPaint(node, ctx, globalScale); // labels underneath items
      }}
      nodePointerAreaPaint={nodePointerAreaPaint}
      d3Force="link"
      d3AlphaDecay={0.05}
      d3VelocityDecay={0.2}
      d3ForceLink={(link) => {
        link.distance = 100; // Adjust this value to change the link length
      }}
    />
  </React.StrictMode>
);

reportWebVitals();
