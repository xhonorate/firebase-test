/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cylinder975: THREE.Mesh
    Cylinder975_1: THREE.Mesh
    Cylinder975_2: THREE.Mesh
  }
  materials: {
    Green: THREE.MeshStandardMaterial
    BrownDark: THREE.MeshStandardMaterial
    White: THREE.MeshStandardMaterial
  }
}

export default function HexForestTransitionB(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/assets/kaykit/Models/tiles/hex/gltf/hex_forest_transitionB.gltf.glb') as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cylinder975.geometry} material={materials.Green} />
      <mesh geometry={nodes.Cylinder975_1.geometry} material={materials.BrownDark} />
      <mesh geometry={nodes.Cylinder975_2.geometry} material={materials.White} />
    </group>
  )
}

useGLTF.preload('/assets/kaykit/Models/tiles/hex/gltf/hex_forest_transitionB.gltf.glb')
