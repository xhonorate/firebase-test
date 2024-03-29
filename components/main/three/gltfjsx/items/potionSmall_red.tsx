/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cylinder296: THREE.Mesh
    Cylinder296_1: THREE.Mesh
    Cylinder296_2: THREE.Mesh
  }
  materials: {
    Glass: THREE.MeshStandardMaterial
    Beige: THREE.MeshStandardMaterial
    Red: THREE.MeshStandardMaterial
  }
}

export default function PotionSmallRed(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/assets/kaykit/Models/items/potionSmall_red.gltf.glb') as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cylinder296.geometry} material={materials.Glass} />
      <mesh geometry={nodes.Cylinder296_1.geometry} material={materials.Beige} />
      <mesh geometry={nodes.Cylinder296_2.geometry} material={materials.Red} />
    </group>
  )
}

useGLTF.preload('/assets/kaykit/Models/items/potionSmall_red.gltf.glb')
