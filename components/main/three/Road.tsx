import * as THREE from "three";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { CatmullRomLine, Edges } from "@react-three/drei";
import { GameContext } from "../RoomInstance";
import { HexCoords, cubeToPos } from "./Tile";
import { hexToIndex, cubeRing, cubeDirection, cubeScale, cubeAdd } from '../Board';
import { MeshProps } from '@react-three/fiber'

interface RoadProps extends MeshProps {
  hex: HexCoords,
  color: string,
}

// TODO: may be a better way to render all roads at once, put in board fn
const width = 0.15;

// Point on edge of hex in given direction,
// offset by offsetDir to make room for road size
function sidePoint (dir: number, offsetDir: number): [ number, number, number ] {
  const centerEdge = cubeToPos(cubeScale(cubeDirection(dir), 0.5));
  
  return [centerEdge[0] - offsetDir * width * centerEdge[2], 0, -centerEdge[2] - offsetDir * width * centerEdge[0]];
}

// shape.moveTo function but for [x, y, z] position vector as param
function moveToVector(shape: THREE.Shape, vector: [number, number, number]) {
  shape.moveTo(vector[0], vector[2]);
}

// shape.lineTo function but for [x, y, z] position vector as param
function lineToVector(shape: THREE.Shape, vector: [number, number, number]) {
  shape.lineTo(vector[0], vector[2]);
}

// shape.quadraticCurveTo function but for [x, y, z] position vector as param
function curveToVector(shape: THREE.Shape, vector: [number, number, number]) {
  shape.quadraticCurveTo(0, 0, vector[0], vector[2]);
}

// TODO: Import mesh
export default function Road(
  {hex, color, ...props}: RoadProps
) {
  const { data } = useContext(GameContext);
  const [directions, setDirections] = useState([]);

  useEffect(() => {
    // Check for tile changes to update number of connection points
    const connections = [];
    
    cubeRing(hex, 1).forEach((neighborHex, idx) => {
      const type = data?.board?.tiles?.[hexToIndex(neighborHex)]?.obj?.type;
      if (!!type && (type === "Road" || type === "Settlement")) {
        connections.push(idx);        
      }
    });

    if (connections.length === 1) {
      // If there is only one connection, add a point at opposite side
      connections.push((connections[0] + 3) % 6)
    }

    setDirections(connections);
  },[data?.board?.tiles, hex])

  // Only update points (re-run calculations) if connection points have changed
  const shapes = useMemo(() => {
    // If there are no points return
    if (!directions.length) return null;

    const shape = new THREE.Shape();
    // Start at first point
    moveToVector(shape, (sidePoint(directions[0], -1)));
    
    for (let i = 1; i < directions.length; i++) {
      // move to edge, both offsets by width
      curveToVector(shape, (sidePoint(directions[i], 1)));
      lineToVector(shape, (sidePoint(directions[i], -1)));

      if (i === directions.length - 1) {
        // After last point is added, curve back to start (at other offset)
        curveToVector(shape, (sidePoint(directions[0], 1)));
      }
    }

    return shape;
  }, [directions]);

  return (
    !!shapes && <mesh rotation={[-Math.PI/2, 0, 0]} {...props}> 
      <extrudeGeometry
        args={[shapes, {
          steps: 2,
          depth: 0.05,
          bevelEnabled: false,
          bevelThickness: 0,
          bevelSize: 0.1,
          bevelOffset: 0,
          bevelSegments: 10
        }]}
      />
      <Edges scale={1} color={"black"} />
      <meshStandardMaterial color={color} />
      { /* <boxGeometry args={[1, 0.3, 0.3]} /> */ }
    </mesh>
  );
}
