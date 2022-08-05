import * as THREE from 'three'
import React, { useRef } from 'react'
import { Edges } from '@react-three/drei';

// TODO: Import mesh
export default function Settlement(props: JSX.IntrinsicElements['mesh'] & { color: string }) {
  const ref = useRef<THREE.Mesh>(null!)
  return (
    <mesh
      {...props}
      ref={ref}>
      <boxGeometry args={[1, 1, 1]} />
      <Edges 
        scale={1}
        color={'black'}
      />
      <meshStandardMaterial color={props.color} />
    </mesh>
  )
}