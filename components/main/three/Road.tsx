import * as THREE from "three";
import React, { useContext, useMemo } from "react";
import { Edges } from "@react-three/drei";
import { GameContext } from "../Room";
import { HexCoords, cubeToPos } from "./Tile";
import { hexToIndex, cubeRing, cubeDirection } from "../Board";
import { MeshProps } from '@react-three/fiber'

interface RoadProps extends MeshProps {
  hex: HexCoords,
  color: string,
}

// TODO: Import mesh
export default function Road(
  {hex, color, ...props}: RoadProps
) {
  const { data } = useContext(GameContext);

  // Get array of directions road should connect to
  const shapes = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    cubeRing(hex, 1).forEach((neighborHex, idx) => {
      const type = data?.board?.tiles?.[hexToIndex(neighborHex)]?.obj?.type;
      console.log(type); // NOT CONSUMING CONEXT, CHECK STRUCTURE IN ROOM

      if (
        !!type &&
        (type === "Road" || type === "Settlement" || type === "City")
      ) {
        const [x, y, z] = cubeToPos(cubeDirection(idx));
        shape.lineTo(x, z);
      }
    });

    return shape;
  }, [data?.board?.tiles, hex]);

  return (
    <mesh {...props}>
      {/* TODO: <extrudeGeometry args={[shapes, {
        steps: 2,
        depth: 1,
        bevelEnabled: true,
        bevelThickness: 1,
        bevelSize: 1,
        bevelOffset: 0,
        bevelSegments: 1
      }]} /> */}
      <boxGeometry args={[1, 0.3, 0.3]} />

      <Edges scale={1} color={"black"} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
