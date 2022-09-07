/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cube4407: THREE.Mesh
    Cube4407_1: THREE.Mesh
    Cube4407_2: THREE.Mesh
  }
  materials: {
    Metal: THREE.MeshStandardMaterial
    BrownDark: THREE.MeshStandardMaterial
    Stone: THREE.MeshStandardMaterial
  }
}

export default function AxeDoubleUncommon(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/assets/kaykit/Models/items/axeDouble_uncommon.gltf.glb') as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cube4407.geometry} material={materials.Metal} />
      <mesh geometry={nodes.Cube4407_1.geometry} material={materials.BrownDark} />
      <mesh geometry={nodes.Cube4407_2.geometry} material={materials.Stone} />
    </group>
  )
}

useGLTF.preload('/assets/kaykit/Models/items/axeDouble_uncommon.gltf.glb')