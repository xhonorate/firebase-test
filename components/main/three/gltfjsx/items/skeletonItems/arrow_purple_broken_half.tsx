/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cylinder016: THREE.Mesh
    Cylinder016_1: THREE.Mesh
  }
  materials: {
    BrownDark: THREE.MeshStandardMaterial
    PurpleDark: THREE.MeshStandardMaterial
  }
}

export default function ArrowPurpleBrokenHalf(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/assets/kaykit/Models/items/skeleton_items/arrow_purple_broken_half.gltf.glb') as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cylinder016.geometry} material={materials.BrownDark} />
      <mesh geometry={nodes.Cylinder016_1.geometry} material={materials.PurpleDark} />
    </group>
  )
}

useGLTF.preload('/assets/kaykit/Models/items/skeleton_items/arrow_purple_broken_half.gltf.glb')
