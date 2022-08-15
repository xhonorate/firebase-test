/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cylinder973: THREE.Mesh
    Cylinder973_1: THREE.Mesh
    Cylinder973_2: THREE.Mesh
  }
  materials: {
    Green: THREE.MeshStandardMaterial
    BrownDark: THREE.MeshStandardMaterial
    Beige: THREE.MeshStandardMaterial
  }
}

export default function HexForestRoadMDetail(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/assets/kaykit/Models/tiles/hex/gltf/hex_forest_roadM_detail.gltf.glb') as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cylinder973.geometry} material={materials.Green} />
      <mesh geometry={nodes.Cylinder973_1.geometry} material={materials.BrownDark} />
      <mesh geometry={nodes.Cylinder973_2.geometry} material={materials.Beige} />
    </group>
  )
}

useGLTF.preload('/assets/kaykit/Models/tiles/hex/gltf/hex_forest_roadM_detail.gltf.glb')
