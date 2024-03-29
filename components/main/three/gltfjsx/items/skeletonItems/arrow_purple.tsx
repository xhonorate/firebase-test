/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cylinder014: THREE.Mesh
    Cylinder014_1: THREE.Mesh
    Cylinder014_2: THREE.Mesh
  }
  materials: {
    Metal: THREE.MeshStandardMaterial
    BrownDark: THREE.MeshStandardMaterial
    PurpleDark: THREE.MeshStandardMaterial
  }
}

export default function ArrowPurple(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/assets/kaykit/Models/items/skeleton_items/arrow_purple.gltf.glb') as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cylinder014.geometry} material={materials.Metal} />
      <mesh geometry={nodes.Cylinder014_1.geometry} material={materials.BrownDark} />
      <mesh geometry={nodes.Cylinder014_2.geometry} material={materials.PurpleDark} />
    </group>
  )
}

useGLTF.preload('/assets/kaykit/Models/items/skeleton_items/arrow_purple.gltf.glb')
