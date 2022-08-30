import React, { useMemo } from "react";
import { GroupProps } from '@react-three/fiber'
import MarketMesh from '../gltfjsx/objects/market'

// TODO: Import mesh, for now, just using different number of vertexies
export default function Market(props: GroupProps) {
  return <group {...props}>
    <MarketMesh />
  </group>
}