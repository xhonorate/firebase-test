/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cube3522: THREE.Mesh
    Cube3522_1: THREE.Mesh
    rogueHairA: THREE.Mesh
  }
  materials: {
    BrownDark: THREE.MeshStandardMaterial
    Black: THREE.MeshStandardMaterial
  }
}

export default function RogueHeadA(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/assets/kaykit/Models/characters/extra_heads/rogueHeadA.gltf') as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cube3522.geometry} material={materials.BrownDark} />
      <mesh geometry={nodes.Cube3522_1.geometry} material={nodes.Cube3522_1.material} />
      <mesh geometry={nodes.rogueHairA.geometry} material={nodes.rogueHairA.material} />
    </group>
  )
}

useGLTF.preload('/assets/kaykit/Models/characters/extra_heads/rogueHeadA.gltf')