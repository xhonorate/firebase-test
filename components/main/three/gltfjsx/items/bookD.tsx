/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cube4415: THREE.Mesh
    Cube4415_1: THREE.Mesh
  }
  materials: {
    WoodDark: THREE.MeshStandardMaterial
    White: THREE.MeshStandardMaterial
  }
}

export default function BookD(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/assets/kaykit/Models/items/bookD.gltf.glb') as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cube4415.geometry} material={materials.WoodDark} />
      <mesh geometry={nodes.Cube4415_1.geometry} material={materials.White} />
    </group>
  )
}

useGLTF.preload('/assets/kaykit/Models/items/bookD.gltf.glb')
