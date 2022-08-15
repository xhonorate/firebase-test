/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cube1015: THREE.Mesh
    Cube1015_1: THREE.Mesh
  }
  materials: {
    BrownDark: THREE.MeshStandardMaterial
    GreenDark: THREE.MeshStandardMaterial
  }
}

export default function DetailTreeC(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/assets/kaykit/Models/objects/gltf/detail_treeC.gltf.glb') as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cube1015.geometry} material={materials.BrownDark} />
      <mesh geometry={nodes.Cube1015_1.geometry} material={materials.GreenDark} />
    </group>
  )
}

useGLTF.preload('/assets/kaykit/Models/objects/gltf/detail_treeC.gltf.glb')