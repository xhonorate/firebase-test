/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cylinder291: THREE.Mesh
    Cylinder291_1: THREE.Mesh
    Cylinder291_2: THREE.Mesh
  }
  materials: {
    Glass: THREE.MeshStandardMaterial
    Beige: THREE.MeshStandardMaterial
    Blue: THREE.MeshStandardMaterial
  }
}

export default function PotionMediumBlue(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/assets/kaykit/Models/items/potionMedium_blue.gltf.glb') as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cylinder291.geometry} material={materials.Glass} />
      <mesh geometry={nodes.Cylinder291_1.geometry} material={materials.Beige} />
      <mesh geometry={nodes.Cylinder291_2.geometry} material={materials.Blue} />
    </group>
  )
}

useGLTF.preload('/assets/kaykit/Models/items/potionMedium_blue.gltf.glb')