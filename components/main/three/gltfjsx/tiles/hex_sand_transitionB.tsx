/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cylinder1059: THREE.Mesh
    Cylinder1059_1: THREE.Mesh
    Cylinder1059_2: THREE.Mesh
  }
  materials: {
    Beige: THREE.MeshStandardMaterial
    BrownDark: THREE.MeshStandardMaterial
    Brown: THREE.MeshStandardMaterial
  }
}

export default function HexSandTransitionB(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/assets/kaykit/Models/tiles/hex/gltf/hex_sand_transitionB.gltf.glb') as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cylinder1059.geometry} material={materials.Beige} />
      <mesh geometry={nodes.Cylinder1059_1.geometry} material={materials.BrownDark} />
      <mesh geometry={nodes.Cylinder1059_2.geometry} material={materials.Brown} />
    </group>
  )
}

useGLTF.preload('/assets/kaykit/Models/tiles/hex/gltf/hex_sand_transitionB.gltf.glb')
