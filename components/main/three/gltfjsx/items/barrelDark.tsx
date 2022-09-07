/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cylinder272: THREE.Mesh
    Cylinder272_1: THREE.Mesh
    Cylinder272_2: THREE.Mesh
  }
  materials: {
    WoodDark: THREE.MeshStandardMaterial
    Beige: THREE.MeshStandardMaterial
    Stone: THREE.MeshStandardMaterial
  }
}

export default function BarrelDark(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/assets/kaykit/Models/items/barrelDark.gltf.glb') as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cylinder272.geometry} material={materials.WoodDark} />
      <mesh geometry={nodes.Cylinder272_1.geometry} material={materials.Beige} />
      <mesh geometry={nodes.Cylinder272_2.geometry} material={materials.Stone} />
    </group>
  )
}

useGLTF.preload('/assets/kaykit/Models/items/barrelDark.gltf.glb')