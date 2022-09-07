/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cube4409: THREE.Mesh
    Cube4409_1: THREE.Mesh
    Cube4409_2: THREE.Mesh
    Cube4409_3: THREE.Mesh
  }
  materials: {
    White: THREE.MeshStandardMaterial
    Metal: THREE.MeshStandardMaterial
    Gold: THREE.MeshStandardMaterial
    Red: THREE.MeshStandardMaterial
  }
}

export default function AxeRare(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/assets/kaykit/Models/items/axe_rare.gltf.glb') as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cube4409.geometry} material={materials.White} />
      <mesh geometry={nodes.Cube4409_1.geometry} material={materials.Metal} />
      <mesh geometry={nodes.Cube4409_2.geometry} material={materials.Gold} />
      <mesh geometry={nodes.Cube4409_3.geometry} material={materials.Red} />
    </group>
  )
}

useGLTF.preload('/assets/kaykit/Models/items/axe_rare.gltf.glb')