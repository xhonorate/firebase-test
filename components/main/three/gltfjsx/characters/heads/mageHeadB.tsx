/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cube3535: THREE.Mesh
    Cube3535_1: THREE.Mesh
    Cube3535_2: THREE.Mesh
    Cube3534: THREE.Mesh
    Cube3534_1: THREE.Mesh
  }
  materials: {
    Brown: THREE.MeshStandardMaterial
    Black: THREE.MeshStandardMaterial
    BrownDark: THREE.MeshStandardMaterial
    Red: THREE.MeshStandardMaterial
  }
}

export default function MageHeadB(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/assets/kaykit/Models/characters/extra_heads/mageHeadB.gltf') as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cube3535.geometry} material={materials.Brown} />
      <mesh geometry={nodes.Cube3535_1.geometry} material={materials.Black} />
      <mesh geometry={nodes.Cube3535_2.geometry} material={nodes.Cube3535_2.material} />
      <mesh geometry={nodes.Cube3534.geometry} material={nodes.Cube3534.material} />
      <mesh geometry={nodes.Cube3534_1.geometry} material={materials.Red} />
    </group>
  )
}

useGLTF.preload('/assets/kaykit/Models/characters/extra_heads/mageHeadB.gltf')
