/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cylinder298: THREE.Mesh
    Cylinder298_1: THREE.Mesh
    Cylinder298_2: THREE.Mesh
  }
  materials: {
    BrownDark: THREE.MeshStandardMaterial
    Stone: THREE.MeshStandardMaterial
    White: THREE.MeshStandardMaterial
  }
}

export default function ShieldCommon(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/assets/kaykit/Models/items/shield_common.gltf.glb') as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cylinder298.geometry} material={materials.BrownDark} />
      <mesh geometry={nodes.Cylinder298_1.geometry} material={materials.Stone} />
      <mesh geometry={nodes.Cylinder298_2.geometry} material={materials.White} />
    </group>
  )
}

useGLTF.preload('/assets/kaykit/Models/items/shield_common.gltf.glb')
