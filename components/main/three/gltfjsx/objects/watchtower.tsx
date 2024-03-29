/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cylinder1309: THREE.Mesh
    Cylinder1309_1: THREE.Mesh
    Cylinder1309_2: THREE.Mesh
    Cylinder1309_3: THREE.Mesh
  }
  materials: {
    Stone: THREE.MeshStandardMaterial
    BrownDark: THREE.MeshStandardMaterial
    StoneDark: THREE.MeshStandardMaterial
    Beige: THREE.MeshStandardMaterial
  }
}

export default function Watchtower(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/assets/kaykit/Models/objects/gltf/watchtower.gltf.glb') as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cylinder1309.geometry} material={materials.Stone} />
      <mesh geometry={nodes.Cylinder1309_1.geometry} material={materials.BrownDark} />
      <mesh geometry={nodes.Cylinder1309_2.geometry} material={materials.StoneDark} />
      <mesh geometry={nodes.Cylinder1309_3.geometry} material={materials.Beige} />
    </group>
  )
}

useGLTF.preload('/assets/kaykit/Models/objects/gltf/watchtower.gltf.glb')
