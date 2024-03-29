/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cube3537: THREE.Mesh
    Cube3537_1: THREE.Mesh
    Cube3537_2: THREE.Mesh
    Cube3536: THREE.Mesh
    Cube3536_1: THREE.Mesh
  }
  materials: {
    Beige: THREE.MeshStandardMaterial
    Black: THREE.MeshStandardMaterial
    Red: THREE.MeshStandardMaterial
  }
}

export default function MageHeadC(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/assets/kaykit/Models/characters/extra_heads/mageHeadC.gltf') as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cube3537.geometry} material={materials.Beige} />
      <mesh geometry={nodes.Cube3537_1.geometry} material={nodes.Cube3537_1.material} />
      <mesh geometry={nodes.Cube3537_2.geometry} material={nodes.Cube3537_2.material} />
      <mesh geometry={nodes.Cube3536.geometry} material={nodes.Cube3536.material} />
      <mesh geometry={nodes.Cube3536_1.geometry} material={materials.Red} />
    </group>
  )
}

useGLTF.preload('/assets/kaykit/Models/characters/extra_heads/mageHeadC.gltf')
