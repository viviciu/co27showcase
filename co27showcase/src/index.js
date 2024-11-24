import React from 'react';
import ReactDOM from 'react-dom/client';
import ForceGraph3D from 'react-force-graph-3d'
import SpriteText from "three-spritetext";
import './index.css';
import reportWebVitals from './reportWebVitals';
import data from "./data.json";
import * as THREE from 'three';


const root = ReactDOM.createRoot(document.getElementById('graph'));



root.render(
  <React.StrictMode>
    <ForceGraph3D
      backgroundColor="#000003"
      graphData={data}
      nodeLabel={(node) => `${node.description}`} // SENIOR QUOTES
      linkColor={() => "white"}
      
      // PORTFOLIO LINKS
      onNodeClick={(node) => {
        if (node.url) {
          window.open(node.url, "_blank");
        }
      }}

      // FORCE
      // d3Force="link"
      d3AlphaDecay={0.05}
      d3VelocityDecay={0.2}
      d3ForceLink={(link) => {
        link.distance = 30; // Adjust this value to make links shorter
      }}
      d3ForceCharge={(charge) => {
        charge.strength = -50; // Adjust this value to make nodes attract each other more
      }}
      
      // IMGS
      nodeThreeObject={(node) => {
        const group = new THREE.Group();

        // Create image sprite
        const imgTexture = new THREE.TextureLoader().load(node.img);
        const material = new THREE.SpriteMaterial({ map: imgTexture });
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(12, 12);
        group.add(sprite);

        // Create text sprite
        const textSprite = new SpriteText(node.name);
        textSprite.color = "#ffffff";
        textSprite.textHeight = 5;
        textSprite.position.set(0, -15, 0); // Position text below the image
        group.add(textSprite);

        return group;
      }}
    />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
