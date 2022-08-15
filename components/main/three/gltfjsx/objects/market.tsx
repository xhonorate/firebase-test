/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cube1021: THREE.Mesh
    Cube1021_1: THREE.Mesh
    Cube1021_2: THREE.Mesh
    Cube1021_3: THREE.Mesh
    Cube1021_4: THREE.Mesh
  }
  materials: {
    Beige: THREE.MeshStandardMaterial
    Stone: THREE.MeshStandardMaterial
    White: THREE.MeshStandardMaterial
    BrownDark: THREE.MeshStandardMaterial
    Brown: THREE.MeshStandardMaterial
  }
}

export default function Market(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/assets/kaykit/Models/objects/gltf/market.gltf.glb') as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cube1021.geometry} material={materials.Beige} />
      <mesh geometry={nodes.Cube1021_1.geometry} material={materials.Stone} />
      <mesh geometry={nodes.Cube1021_2.geometry} material={materials.White} />
      <mesh geometry={nodes.Cube1021_3.geometry} material={materials.BrownDark} />
      <mesh geometry={nodes.Cube1021_4.geometry} material={materials.Brown} />
    </group>
  )
}

useGLTF.preload('/assets/kaykit/Models/objects/gltf/market.gltf.glb')
