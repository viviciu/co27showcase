import React, { useRef, useEffect } from "react";
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
//textcomment
// Preload images
preloadImages(data.nodes);


// VERSION 1

// const nodePaint = (node, ctx, globalScale) => {
//   const img = imageCache[node.img];
//   const size = (node.val || 30) / globalScale; // Adjust the size as needed

//   if (img) {
//     ctx.drawImage(img, node.x - size / 2, node.y - size / 2, size, size);
//   }

//   node.__bckgDimensions = [size, size]; // to re-use in nodePointerAreaPaint
// };

// VERSION 1.1

// const nodePaint = (node, ctx, globalScale) => {
//   const img = imageCache[node.img];
//   const size = (node.val / 4); // Adjust the size as needed

//   if (img) {
//     ctx.drawImage(img, node.x - size / 2, node.y - size / 2, size, size);
//   }

//   node.__bckgDimensions = [size, size]; // to re-use in nodePointerAreaPaint
// };


// VERSION 2

// const nodePaint = (node, ctx, globalScale) => {
//   const img = imageCache[node.img];
//   if (img) {
//     const width = (img.naturalWidth || 12) / globalScale; // Use natural width if available, otherwise default to 12
//     const height = (img.naturalHeight || 12) / globalScale; // Use natural height if available, otherwise default to 12

//     ctx.drawImage(img, node.x - width / 2, node.y - height / 2, width, height);

//     node.__bckgDimensions = [width, height]; // to re-use in nodePointerAreaPaint
//   }
// };


// VERSION 3
const nodePaint = (node, ctx, globalScale) => {
  const img = imageCache[node.img];
  if (img) {
    let scaleFactor = 0.1; // Default scale factor for images

    // Adjust scale factor for nodes in the "TRACK" group
    if (node.group === "TRACK") {
      scaleFactor = 0.6; // Increase the scale factor for "TRACK" nodes
    }
    const width = (img.naturalWidth * scaleFactor) / 5;
    const height = (img.naturalHeight * scaleFactor) / 5;

    ctx.drawImage(img, node.x - width / 2, node.y - height / 2, width, height);

    node.__bckgDimensions = [width, height]; // to re-use in nodePointerAreaPaint
  }
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
    ctx.fillText(label, node.x, node.y + 15); // Adjust the position as needed
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

const FocusGraph = () => {
  const fgRef = useRef();

  useEffect(() => {
    if (fgRef.current) {
      fgRef.current.zoom(4.5); // Set the initial zoom level (2x zoom)
    }
  }, []);

  return (
    <ForceGraph2D
      ref={fgRef}
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
      d3Force="charge"
      d3AlphaDecay={0.05}
      d3VelocityDecay={0.2}
      d3ForceCharge={(charge) => {
        charge.strength(-30); // Adjust this value to reduce the repelling force
      }}
      d3ForceLink={(link) => {
        link.distance = 50; // Adjust this value to change the link length
      }}
    />
  );
};

root.render(
  <React.StrictMode>
    <FocusGraph />
    {/* <ForceGraph2D
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
    /> */}
  </React.StrictMode>
);

reportWebVitals();
