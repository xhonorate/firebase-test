/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cube4000: THREE.Mesh
    Cube4000_1: THREE.Mesh
    Cube4000_2: THREE.Mesh
  }
  materials: {
    Beige: THREE.MeshStandardMaterial
    Black: THREE.MeshStandardMaterial
  }
}

export default function KnightHeadC(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF(require('../../../../../public/assets/kaykit/Models/characters/extra_heads/knightHeadC.gltf.glb')) as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cube4000.geometry} material={materials.Beige} />
      <mesh geometry={nodes.Cube4000_1.geometry} material={nodes.Cube4000_1.material} />
      <mesh geometry={nodes.Cube4000_2.geometry} material={nodes.Cube4000_2.material} />
    </group>
  )
}

//useGLTF.preload(require('../../../../../public/assets/kaykit/Models/characters/extra_heads/knightHeadC.gltf.glb'))
