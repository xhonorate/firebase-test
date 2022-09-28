/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cube4431: THREE.Mesh
    Cube4431_1: THREE.Mesh
  }
  materials: {
    Stone: THREE.MeshStandardMaterial
    WoodDark: THREE.MeshStandardMaterial
  }
}

export default function ChestTopCommonEmpty(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF(require('../../../../../public/assets/kaykit/Models/items/chestTop_common_empty.gltf.glb')) as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cube4431.geometry} material={materials.Stone} />
      <mesh geometry={nodes.Cube4431_1.geometry} material={materials.WoodDark} />
    </group>
  )
}

//useGLTF.preload(require('../../../../../public/assets/kaykit/Models/items/chestTop_common_empty.gltf.glb'))
