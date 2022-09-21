import {
  Bloom,
  DepthOfField,
  EffectComposer,
  Outline,
} from "@react-three/postprocessing";
import React, { useContext, useMemo } from "react";

// Convert array of items / groups into flat array of meshes (since groups cannot use outlines)
function getMeshes(item: THREE.Object3D | THREE.Object3D[]) {
  if (Array.isArray(item)) {
    return item.flatMap(getMeshes);
  } else {
    if (item?.type === "Mesh") {
      return item;
    } else if (item?.children?.length) {
      return item.children.flatMap(getMeshes);
    }
  }
  return [];
}

// BE SURE TO PLACE INSIDE OF TARGET SELECTION TO USE CONTEXT!
const FX = ({ target, hovered }) => {
  const highlighted = useMemo(() => {
    if (target && target.ref) {
      // if target is clicked, highlight it
      return getMeshes(target.ref);
    } else {
      if (hovered && hovered.ref) {
        return getMeshes(hovered.ref);
      } else {
        return null;
      }
    }
  }, [target, hovered]);

  return (
    <EffectComposer multisampling={8} autoClear={false}>
      <Outline
        blur
        edgeStrength={100}
        height={500}
        // blendFunction={BlendFunction.ALPHA}
        // @ts-ignore
        visibleEdgeColor={"white"}
        // @ts-ignore
        hiddenEdgeColor={"white"}
        selection={highlighted}
        // TODO: ^^^ not this, switch to just targeted, and use something else for highlights
      />
      <DepthOfField
        focusDistance={0.1}
        focalLength={0.12}
        bokehScale={4}
        height={500}
      />
      <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={500} />
    </EffectComposer>
  );
};

export default FX;
