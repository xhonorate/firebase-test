import * as THREE from 'three'
import React, { useContext, useMemo } from 'react'
import { Edges } from '@react-three/drei';
import { GameContext } from '../room';
import { HexCoords, cubeToPos } from './Tile';
import { hexToIndex, cubeRing, cubeDirection } from '../Board';

// TODO: Import mesh
export default function Road(props: JSX.IntrinsicElements['mesh'] & { color: string, hex: HexCoords }) {
  const { data } = useContext(GameContext);
  
  // Get array of directions road should connect to
  const shapes = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0,0);
    cubeRing(props.hex, 1).forEach((hex, idx) => {
      const type = data?.board?.tiles?.[hexToIndex(hex)]?.obj?.type;

      if (!!type && (type === 'Road' || type === 'Settlement' || type === 'City')) {
        console.log("YO");
        const [x, y, z] = cubeToPos(cubeDirection(idx));
        shape.lineTo(x, z);
      };
    });

    return shape;
  }, [data?.board?.tiles]);

  return (
    <mesh
      {...props}>
      { /* TODO: <extrudeGeometry args={[shapes, {
        steps: 2,
        depth: 1,
        bevelEnabled: true,
        bevelThickness: 1,
        bevelSize: 1,
        bevelOffset: 0,
        bevelSegments: 1
      }]} /> */ }
            <boxGeometry args={[1, 0.3, 0.3]} />

      <Edges
        scale={1}
        color={'black'}
      />
      <meshStandardMaterial color={props.color} />
    </mesh>
  )
}