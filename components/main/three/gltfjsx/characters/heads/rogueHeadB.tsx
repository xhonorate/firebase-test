/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cube3524: THREE.Mesh
    Cube3524_1: THREE.Mesh
    rogueHairB: THREE.Mesh
  }
  materials: {
    Brown: THREE.MeshStandardMaterial
    Black: THREE.MeshStandardMaterial
    Beige: THREE.MeshStandardMaterial
  }
}

export default function RogueHeadB(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/assets/kaykit/Models/characters/extra_heads/rogueHeadB.gltf') as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cube3524.geometry} material={materials.Brown} />
      <mesh geometry={nodes.Cube3524_1.geometry} material={materials.Black} />
      <mesh geometry={nodes.rogueHairB.geometry} material={materials.Beige} />
    </group>
  )
}

useGLTF.preload('/assets/kaykit/Models/characters/extra_heads/rogueHeadB.gltf')
