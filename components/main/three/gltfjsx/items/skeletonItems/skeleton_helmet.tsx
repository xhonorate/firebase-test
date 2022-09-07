/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cube024: THREE.Mesh
    Cube024_1: THREE.Mesh
    Cube024_2: THREE.Mesh
  }
  materials: {
    White: THREE.MeshStandardMaterial
    Stone: THREE.MeshStandardMaterial
    BrownDark: THREE.MeshStandardMaterial
  }
}

export default function SkeletonHelmet(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/assets/kaykit/Models/items/skeleton_items/skeleton_helmet.gltf.glb') as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cube024.geometry} material={materials.White} />
      <mesh geometry={nodes.Cube024_1.geometry} material={materials.Stone} />
      <mesh geometry={nodes.Cube024_2.geometry} material={materials.BrownDark} />
    </group>
  )
}

useGLTF.preload('/assets/kaykit/Models/items/skeleton_items/skeleton_helmet.gltf.glb')