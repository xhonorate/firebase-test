/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    scaffold_low_cornerRight: THREE.Mesh
  }
  materials: {
    WoodDark: THREE.MeshStandardMaterial
  }
}

export default function ScaffoldLowCornerRight(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/assets/kaykit/Models/items/scaffold_low_cornerRight.gltf.glb') as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.scaffold_low_cornerRight.geometry} material={materials.WoodDark} />
    </group>
  )
}

useGLTF.preload('/assets/kaykit/Models/items/scaffold_low_cornerRight.gltf.glb')
