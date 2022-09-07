/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cube4438: THREE.Mesh
    Cube4438_1: THREE.Mesh
  }
  materials: {
    Gold: THREE.MeshStandardMaterial
    White: THREE.MeshStandardMaterial
  }
}

export default function ChestRare(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/assets/kaykit/Models/items/chest_rare.gltf.glb') as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cube4438.geometry} material={materials.Gold} />
      <mesh geometry={nodes.Cube4438_1.geometry} material={materials.White} />
    </group>
  )
}

useGLTF.preload('/assets/kaykit/Models/items/chest_rare.gltf.glb')
