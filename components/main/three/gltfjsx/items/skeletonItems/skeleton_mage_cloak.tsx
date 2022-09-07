/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    skeleton_mage_cloak: THREE.Mesh
  }
  materials: {
    PurpleDark: THREE.MeshStandardMaterial
  }
}

export default function SkeletonMageCloak(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/assets/kaykit/Models/items/skeleton_items/skeleton_mage_cloak.gltf.glb') as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.skeleton_mage_cloak.geometry} material={materials.PurpleDark} />
    </group>
  )
}

useGLTF.preload('/assets/kaykit/Models/items/skeleton_items/skeleton_mage_cloak.gltf.glb')