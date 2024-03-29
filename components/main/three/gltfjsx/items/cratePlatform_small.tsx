/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cube4446: THREE.Mesh
    Cube4446_1: THREE.Mesh
  }
  materials: {
    WoodDark: THREE.MeshStandardMaterial
    Stone: THREE.MeshStandardMaterial
  }
}

export default function CratePlatformSmall(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/assets/kaykit/Models/items/cratePlatform_small.gltf.glb') as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cube4446.geometry} material={materials.WoodDark} />
      <mesh geometry={nodes.Cube4446_1.geometry} material={materials.Stone} />
    </group>
  )
}

useGLTF.preload('/assets/kaykit/Models/items/cratePlatform_small.gltf.glb')
