/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cube031: THREE.Mesh
    Cube031_1: THREE.Mesh
    Cube031_2: THREE.Mesh
  }
  materials: {
    White: THREE.MeshStandardMaterial
    ForestGreen: THREE.MeshStandardMaterial
    PurpleDark: THREE.MeshStandardMaterial
  }
}

export default function SkeletonStaffBroken(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/assets/kaykit/Models/items/skeleton_items/skeleton_staff_broken.gltf.glb') as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cube031.geometry} material={materials.White} />
      <mesh geometry={nodes.Cube031_1.geometry} material={materials.ForestGreen} />
      <mesh geometry={nodes.Cube031_2.geometry} material={materials.PurpleDark} />
    </group>
  )
}

useGLTF.preload('/assets/kaykit/Models/items/skeleton_items/skeleton_staff_broken.gltf.glb')