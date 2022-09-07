/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cube4418: THREE.Mesh
    Cube4418_1: THREE.Mesh
    Cube4418_2: THREE.Mesh
  }
  materials: {
    GreenDark: THREE.MeshStandardMaterial
    White: THREE.MeshStandardMaterial
    Metal: THREE.MeshStandardMaterial
  }
}

export default function BookOpenA(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/assets/kaykit/Models/items/bookOpenA.gltf.glb') as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cube4418.geometry} material={materials.GreenDark} />
      <mesh geometry={nodes.Cube4418_1.geometry} material={materials.White} />
      <mesh geometry={nodes.Cube4418_2.geometry} material={materials.Metal} />
    </group>
  )
}

useGLTF.preload('/assets/kaykit/Models/items/bookOpenA.gltf.glb')
