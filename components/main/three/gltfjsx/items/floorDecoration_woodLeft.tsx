/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    floorDecoration_woodLeft: THREE.Mesh
  }
  materials: {
    WoodDark: THREE.MeshStandardMaterial
  }
}

export default function FloorDecorationWoodLeft(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/assets/kaykit/Models/items/floorDecoration_woodLeft.gltf.glb') as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.floorDecoration_woodLeft.geometry} material={materials.WoodDark} />
    </group>
  )
}

useGLTF.preload('/assets/kaykit/Models/items/floorDecoration_woodLeft.gltf.glb')
