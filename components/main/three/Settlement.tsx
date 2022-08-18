import React, { useMemo } from "react";
import { GroupProps } from '@react-three/fiber'
import House from "./gltfjsx/objects/house";
import Watchtower from './gltfjsx/objects/watchtower';
import Castle from './gltfjsx/objects/castle';
import { randomInt } from '../Board';

const borderGeometry = {

}

interface SettlementProps extends GroupProps {
  level: number,
  color: string,
}

// TODO: Import mesh, for now, just using different number of vertexies
export default function Settlement(
  {level, color, ...props}: SettlementProps
) {
  const BuildingModel = level === 1 ? House : level === 2 ? Watchtower : Castle;
  // TODO: Add ring to designate control
  return <group {...props}>
    
    <mesh>
      <cylinderGeometry args={[1.16, 1.16, 0.2, 6]} />
      <meshStandardMaterial
        opacity={0.5}
        transparent={true}
        color={color}
      />
    </mesh>
    <BuildingModel />
  </group>
}