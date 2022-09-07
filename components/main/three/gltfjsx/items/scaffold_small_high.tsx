/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    scaffold_small_high: THREE.Mesh
  }
  materials: {
    WoodDark: THREE.MeshStandardMaterial
  }
}

export default function ScaffoldSmallHigh(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/assets/kaykit/Models/items/scaffold_small_high.gltf.glb') as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.scaffold_small_high.geometry} material={materials.WoodDark} />
    </group>
  )
}

useGLTF.preload('/assets/kaykit/Models/items/scaffold_small_high.gltf.glb')
