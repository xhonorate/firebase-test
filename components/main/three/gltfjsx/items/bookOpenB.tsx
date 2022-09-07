/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cube4419: THREE.Mesh
    Cube4419_1: THREE.Mesh
    Cube4419_2: THREE.Mesh
  }
  materials: {
    Brown: THREE.MeshStandardMaterial
    White: THREE.MeshStandardMaterial
    Metal: THREE.MeshStandardMaterial
  }
}

export default function BookOpenB(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/assets/kaykit/Models/items/bookOpenB.gltf.glb') as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cube4419.geometry} material={materials.Brown} />
      <mesh geometry={nodes.Cube4419_1.geometry} material={materials.White} />
      <mesh geometry={nodes.Cube4419_2.geometry} material={materials.Metal} />
    </group>
  )
}

useGLTF.preload('/assets/kaykit/Models/items/bookOpenB.gltf.glb')
