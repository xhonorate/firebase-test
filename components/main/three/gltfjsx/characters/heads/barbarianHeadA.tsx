/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cube3995: THREE.Mesh
    Cube3995_1: THREE.Mesh
    Cube3995_2: THREE.Mesh
  }
  materials: {
    BrownDark: THREE.MeshStandardMaterial
    Black: THREE.MeshStandardMaterial
    WoodDark: THREE.MeshStandardMaterial
  }
}

export default function BarbarianHeadA(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/assets/kaykit/Models/characters/extra_heads/barbarianHeadA.gltf.glb') as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cube3995.geometry} material={materials.BrownDark} />
      <mesh geometry={nodes.Cube3995_1.geometry} material={materials.Black} />
      <mesh geometry={nodes.Cube3995_2.geometry} material={materials.WoodDark} />
    </group>
  )
}

useGLTF.preload('/assets/kaykit/Models/characters/extra_heads/barbarianHeadA.gltf.glb')
