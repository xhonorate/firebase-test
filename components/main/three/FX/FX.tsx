import {
  Bloom,
  DepthOfField,
  EffectComposer,
  Outline,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import React, { useContext, useMemo } from "react";
import { TargetContext } from "../../MouseEvents";

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
  //const  { target, hovered } = useContext(TargetContext);

  /*
  const { data, playerIndex } = useContext(GameContext);
  const staticTiles = useContext(TilesContext);

  // TODO: move to another function
  // ALSO add better ui for popups (billboards)
  const toBeHighlighted = useMemo(() => {
    if (!hovered || !hovered.ref || hovered.ref === target?.ref) {
      // Do not higlight target clicked on for hover as well
      return null;
    } else {
      if (target && target.type === "unit" && staticTiles !== null) {
        // Highlight pathfinding path
        const hoveredIdx = hovered.type === 'tile' ? hovered.val.index : hovered.val.hexIdx
        const path = pathfindTo(data, target.val.hexIdx, hoveredIdx, playerIndex);
        if (path) {
          return getMeshes(path.map((pathIdx: number) => staticTiles[pathIdx].ref));
        } else {
          // TODO: pathfind to closest point, maybe highlight issue?
          return null;
        }
      }
      // By default highlight mesh of target
      return getMeshes(hovered.ref);
    }
  }, [hovered, target, staticTiles, data, playerIndex]);
  */

  const toBeTargeted = useMemo(() => {
    if (!target || !target?.ref) {
      return null;
    } else {
      return getMeshes(target.ref);
    }
  }, [target]);

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
        selection={toBeTargeted}
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
