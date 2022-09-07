/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cube4464: THREE.Mesh
    Cube4464_1: THREE.Mesh
  }
  materials: {
    Stone: THREE.MeshStandardMaterial
    StoneDark: THREE.MeshStandardMaterial
  }
}

export default function Pillar(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/assets/kaykit/Models/items/pillar.gltf.glb') as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cube4464.geometry} material={materials.Stone} />
      <mesh geometry={nodes.Cube4464_1.geometry} material={materials.StoneDark} />
    </group>
  )
}

useGLTF.preload('/assets/kaykit/Models/items/pillar.gltf.glb')