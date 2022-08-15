/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cylinder1057: THREE.Mesh
    Cylinder1057_1: THREE.Mesh
    Cylinder1057_2: THREE.Mesh
  }
  materials: {
    Beige: THREE.MeshStandardMaterial
    BrownDark: THREE.MeshStandardMaterial
    Brown: THREE.MeshStandardMaterial
  }
}

export default function HexSandRoadMDetail(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/assets/kaykit/Models/tiles/hex/gltf/hex_sand_roadM_detail.gltf.glb') as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cylinder1057.geometry} material={materials.Beige} />
      <mesh geometry={nodes.Cylinder1057_1.geometry} material={materials.BrownDark} />
      <mesh geometry={nodes.Cylinder1057_2.geometry} material={materials.Brown} />
    </group>
  )
}

useGLTF.preload('/assets/kaykit/Models/tiles/hex/gltf/hex_sand_roadM_detail.gltf.glb')