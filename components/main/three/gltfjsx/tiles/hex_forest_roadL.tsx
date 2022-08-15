/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cylinder970: THREE.Mesh
    Cylinder970_1: THREE.Mesh
  }
  materials: {
    Green: THREE.MeshStandardMaterial
    Beige: THREE.MeshStandardMaterial
  }
}

export default function HexForestRoadL(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/assets/kaykit/Models/tiles/hex/gltf/hex_forest_roadL.gltf.glb') as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cylinder970.geometry} material={materials.Green} />
      <mesh geometry={nodes.Cylinder970_1.geometry} material={materials.Beige} />
    </group>
  )
}

useGLTF.preload('/assets/kaykit/Models/tiles/hex/gltf/hex_forest_roadL.gltf.glb')
