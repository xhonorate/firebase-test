/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cube4523: THREE.Mesh
    Cube4523_1: THREE.Mesh
    Cube4523_2: THREE.Mesh
  }
  materials: {
    Stone: THREE.MeshStandardMaterial
    Mud: THREE.MeshStandardMaterial
    WoodDark: THREE.MeshStandardMaterial
  }
}

export default function TileBrickBLargeCrackedB(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/assets/kaykit/Models/items/tileBrickB_largeCrackedB.gltf.glb') as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cube4523.geometry} material={materials.Stone} />
      <mesh geometry={nodes.Cube4523_1.geometry} material={materials.Mud} />
      <mesh geometry={nodes.Cube4523_2.geometry} material={materials.WoodDark} />
    </group>
  )
}

useGLTF.preload('/assets/kaykit/Models/items/tileBrickB_largeCrackedB.gltf.glb')