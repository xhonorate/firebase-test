/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cube4467: THREE.Mesh
    Cube4467_1: THREE.Mesh
    Cube4467_2: THREE.Mesh
  }
  materials: {
    BrownDark: THREE.MeshStandardMaterial
    Metal: THREE.MeshStandardMaterial
    GreenDark: THREE.MeshStandardMaterial
  }
}

export default function QuiverFull(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/assets/kaykit/Models/items/quiver_full.gltf.glb') as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cube4467.geometry} material={materials.BrownDark} />
      <mesh geometry={nodes.Cube4467_1.geometry} material={materials.Metal} />
      <mesh geometry={nodes.Cube4467_2.geometry} material={materials.GreenDark} />
    </group>
  )
}

useGLTF.preload('/assets/kaykit/Models/items/quiver_full.gltf.glb')