/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cube4443: THREE.Mesh
    Cube4443_1: THREE.Mesh
  }
  materials: {
    WoodDark: THREE.MeshStandardMaterial
    Stone: THREE.MeshStandardMaterial
  }
}

export default function CrateDark(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/assets/kaykit/Models/items/crateDark.gltf.glb') as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cube4443.geometry} material={materials.WoodDark} />
      <mesh geometry={nodes.Cube4443_1.geometry} material={materials.Stone} />
    </group>
  )
}

useGLTF.preload('/assets/kaykit/Models/items/crateDark.gltf.glb')
