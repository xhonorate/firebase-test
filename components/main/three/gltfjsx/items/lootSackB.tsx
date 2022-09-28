/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Sphere005: THREE.Mesh
    Sphere005_1: THREE.Mesh
  }
  materials: {
    Beige: THREE.MeshStandardMaterial
    BrownDark: THREE.MeshStandardMaterial
  }
}

export default function LootSackB(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF(require('../../../../../public/assets/kaykit/Models/items/lootSackB.gltf.glb')) as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Sphere005.geometry} material={materials.Beige} />
      <mesh geometry={nodes.Sphere005_1.geometry} material={materials.BrownDark} />
    </group>
  )
}

//useGLTF.preload(require('../../../../../public/assets/kaykit/Models/items/lootSackB.gltf.glb'))
