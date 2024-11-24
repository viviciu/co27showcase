import React from 'react';
import ReactDOM from 'react-dom/client';
import ForceGraph3D from 'react-force-graph-3d'
import SpriteText from "three-spritetext";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import data from "./data.json";

const root = ReactDOM.createRoot(document.getElementById('graph'));
root.render(
  <React.StrictMode>
    <ForceGraph3D
      graphData={data}
      nodeAutoColorBy="group"
      nodeThreeObject={(node) => {
        const sprite = new SpriteText(node.id);
        sprite.color = node.color;
        sprite.textHeight = 8;
        return sprite;
      }}
    />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
