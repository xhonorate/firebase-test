/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cube032: THREE.Mesh
    Cube032_1: THREE.Mesh
    Cube032_2: THREE.Mesh
  }
  materials: {
    WoodDark: THREE.MeshStandardMaterial
    Beige: THREE.MeshStandardMaterial
    Stone: THREE.MeshStandardMaterial
  }
}

export default function Spellbook(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF(require('../../../../../public/assets/kaykit/Models/items/skeleton_items/spellbook.gltf.glb')) as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cube032.geometry} material={materials.WoodDark} />
      <mesh geometry={nodes.Cube032_1.geometry} material={materials.Beige} />
      <mesh geometry={nodes.Cube032_2.geometry} material={materials.Stone} />
    </group>
  )
}

//useGLTF.preload(require('../../../../../public/assets/kaykit/Models/items/skeleton_items/spellbook.gltf.glb'))
