import React, { useMemo } from "react";
import { GroupProps } from '@react-three/fiber'
import House from "./gltfjsx/objects/house";
import Watchtower from './gltfjsx/objects/watchtower';
import Castle from './gltfjsx/objects/castle';

interface SettlementProps extends GroupProps {
  level: number,
  color: string,
}

// TODO: Import mesh, for now, just using different number of vertexies
export default function Settlement(
  {level, color, ...props}: SettlementProps
) {
  const BuildingModel = level === 1 ? House : level === 2 ? Watchtower : Castle;
  return <group {...props}>
    <BuildingModel />
  </group>
}