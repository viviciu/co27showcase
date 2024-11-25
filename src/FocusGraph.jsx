import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { useRef, useEffect } from "react";

export default function FocusGraph(){
  const fgRef = useRef();

  useEffect(() => {
    const bloomPass = new UnrealBloomPass();
    bloomPass.strength = 0.5;
    bloomPass.radius = 1;
    bloomPass.threshold = 0;
    fgRef.current.postProcessingComposer().addPass(bloomPass);
  }, []);

  return (
    <ForceGraph3D
      ref={fgRef}
      backgroundColor="#000003"
      graphData={data}
      nodeAutoColorBy="group"
      // nodeThreeObject={(node) => {
      //   const sprite = new SpriteText(node.id);
      //   sprite.color = node.color;
      //   sprite.textHeight = 8;
      //   return sprite;
      // }}

      nodeLabel={(node) => `${node.description}`} // SENIOR QUOTES
      nodeThreeObjectExtend={true}
      // nodeThreeObject={(node) => {
      //   // extend link with text sprite
      //   const sprite = new SpriteText(`${node.id}`);
      //   sprite.color = "lightgrey";
      //   sprite.textHeight = 5;
      //   // Adjust the position of the sprite to be below the node
      //   sprite.position.y -= 10; // Adjust this value as needed
      //   return sprite;
      // }}
      nodeThreeObject={(node) => {
        const imgTexture = new THREE.TextureLoader().load(node.img);
        console.log(node.img);
        imgTexture.colorSpace = THREE.SRGBColorSpace;
        const material = new THREE.SpriteMaterial({ map: imgTexture });
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(12, 12);

        return sprite;
      }}
    />
  );
};
