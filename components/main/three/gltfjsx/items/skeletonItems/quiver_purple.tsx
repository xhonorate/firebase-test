/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cube022: THREE.Mesh
    Cube022_1: THREE.Mesh
  }
  materials: {
    PurpleDark: THREE.MeshStandardMaterial
    WoodDark: THREE.MeshStandardMaterial
  }
}

export default function QuiverPurple(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF(require('../../../../../public/assets/kaykit/Models/items/skeleton_items/quiver_purple.gltf.glb')) as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cube022.geometry} material={materials.PurpleDark} />
      <mesh geometry={nodes.Cube022_1.geometry} material={materials.WoodDark} />
    </group>
  )
}

//useGLTF.preload(require('../../../../../public/assets/kaykit/Models/items/skeleton_items/quiver_purple.gltf.glb'))
