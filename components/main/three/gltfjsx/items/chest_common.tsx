/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cube4436: THREE.Mesh
    Cube4436_1: THREE.Mesh
    Cube4436_2: THREE.Mesh
    Cube4436_3: THREE.Mesh
  }
  materials: {
    Stone: THREE.MeshStandardMaterial
    WoodDark: THREE.MeshStandardMaterial
    Gold: THREE.MeshStandardMaterial
    Red: THREE.MeshStandardMaterial
  }
}

export default function ChestCommon(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF(require('../../../../../public/assets/kaykit/Models/items/chest_common.gltf.glb')) as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cube4436.geometry} material={materials.Stone} />
      <mesh geometry={nodes.Cube4436_1.geometry} material={materials.WoodDark} />
      <mesh geometry={nodes.Cube4436_2.geometry} material={materials.Gold} />
      <mesh geometry={nodes.Cube4436_3.geometry} material={materials.Red} />
    </group>
  )
}

//useGLTF.preload(require('../../../../../public/assets/kaykit/Models/items/chest_common.gltf.glb'))
