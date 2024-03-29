/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cube4551: THREE.Mesh
    Cube4551_1: THREE.Mesh
    Cube4551_2: THREE.Mesh
  }
  materials: {
    Stone: THREE.MeshStandardMaterial
    StoneDark: THREE.MeshStandardMaterial
    Black: THREE.MeshStandardMaterial
  }
}

export default function WallGateDoor(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/assets/kaykit/Models/items/wall_gateDoor.gltf.glb') as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cube4551.geometry} material={materials.Stone} />
      <mesh geometry={nodes.Cube4551_1.geometry} material={materials.StoneDark} />
      <mesh geometry={nodes.Cube4551_2.geometry} material={materials.Black} />
    </group>
  )
}

useGLTF.preload('/assets/kaykit/Models/items/wall_gateDoor.gltf.glb')
