/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cylinder299: THREE.Mesh
    Cylinder299_1: THREE.Mesh
    Cylinder299_2: THREE.Mesh
  }
  materials: {
    BrownDark: THREE.MeshStandardMaterial
    Metal: THREE.MeshStandardMaterial
    WoodDark: THREE.MeshStandardMaterial
  }
}

export default function Torch(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/assets/kaykit/Models/items/torch.gltf.glb') as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cylinder299.geometry} material={materials.BrownDark} />
      <mesh geometry={nodes.Cylinder299_1.geometry} material={materials.Metal} />
      <mesh geometry={nodes.Cylinder299_2.geometry} material={materials.WoodDark} />
    </group>
  )
}

useGLTF.preload('/assets/kaykit/Models/items/torch.gltf.glb')