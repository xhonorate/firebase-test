/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cube3528: THREE.Mesh
    Cube3528_1: THREE.Mesh
    rogueHairC: THREE.Mesh
  }
  materials: {
    Beige: THREE.MeshStandardMaterial
    Black: THREE.MeshStandardMaterial
    WoodDark: THREE.MeshStandardMaterial
  }
}

export default function RogueHeadC(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/assets/kaykit/Models/characters/extra_heads/rogueHeadC.gltf') as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cube3528.geometry} material={materials.Beige} />
      <mesh geometry={nodes.Cube3528_1.geometry} material={materials.Black} />
      <mesh geometry={nodes.rogueHairC.geometry} material={materials.WoodDark} />
    </group>
  )
}

useGLTF.preload('/assets/kaykit/Models/characters/extra_heads/rogueHeadC.gltf')