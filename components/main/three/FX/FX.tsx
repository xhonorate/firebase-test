import {
  Bloom,
  DepthOfField,
  EffectComposer,
  Outline,
} from "@react-three/postprocessing";
import React, { useContext } from "react";
import { TargetContext } from '../../MouseEvents';

// Convert array of items / groups into flat array of meshes (since groups cannot use outlines)
function getMeshes (item: THREE.Mesh | THREE.Group) {
  if (Array.isArray(item)) {
    return item.flatMap(getMeshes);
  }
  if (item?.type === 'Mesh') {
    return item;
  } else if (item?.children?.length) {
    return item.children.flatMap(getMeshes);
  }
  return [];
}

// BE SURE TO PLACE INSIDE OF TARGET SELECTION TO USE CONTEXT!
const FX = () => {
  const { target, hovered } = useContext(TargetContext)
  return (
    <EffectComposer multisampling={8} autoClear={false}>
      <Outline 
        blur
        edgeStrength={100}
        height={500}
        // @ts-ignore
        visibleEdgeColor={'gray'}
        selection={getMeshes(hovered)} 
      />
      <Outline 
        blur
        edgeStrength={100}
        height={500}
        // @ts-ignore
        visibleEdgeColor={'white'}
        selection={getMeshes(target?.ref)} 
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
