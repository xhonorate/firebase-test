/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cube4437: THREE.Mesh
    Cube4437_1: THREE.Mesh
    Cube4437_2: THREE.Mesh
    Cube4437_3: THREE.Mesh
  }
  materials: {
    Stone: THREE.MeshStandardMaterial
    WoodDark: THREE.MeshStandardMaterial
    White: THREE.MeshStandardMaterial
    Black: THREE.MeshStandardMaterial
  }
}

export default function ChestCommonEmpty(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/assets/kaykit/Models/items/chest_common_empty.gltf.glb') as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cube4437.geometry} material={materials.Stone} />
      <mesh geometry={nodes.Cube4437_1.geometry} material={materials.WoodDark} />
      <mesh geometry={nodes.Cube4437_2.geometry} material={materials.White} />
      <mesh geometry={nodes.Cube4437_3.geometry} material={materials.Black} />
    </group>
  )
}

useGLTF.preload('/assets/kaykit/Models/items/chest_common_empty.gltf.glb')