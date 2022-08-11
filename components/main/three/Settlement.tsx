import * as THREE from "three";
import React, { useRef } from "react";
import { Edges } from "@react-three/drei";
import { MeshProps } from '@react-three/fiber'

interface SettlementProps extends MeshProps {
  level: number,
  color: string,
}

// TODO: Import mesh, for now, just using different number of vertexies
export default function Settlement(
  {level, color, ...props}: SettlementProps
) {
  return (
    <mesh {...props}>
      <cylinderGeometry args={[0.5, 0.5, 0.5*level, 2 + level]} />
      <Edges scale={1} color={"black"} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}