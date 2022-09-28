/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cube4531: THREE.Mesh
    Cube4531_1: THREE.Mesh
  }
  materials: {
    Stone: THREE.MeshStandardMaterial
    StoneDark: THREE.MeshStandardMaterial
  }
}

export default function WallCorner(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF(require('../../../../../public/assets/kaykit/Models/items/wallCorner.gltf.glb')) as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cube4531.geometry} material={materials.Stone} />
      <mesh geometry={nodes.Cube4531_1.geometry} material={materials.StoneDark} />
    </group>
  )
}

//useGLTF.preload(require('../../../../../public/assets/kaykit/Models/items/wallCorner.gltf.glb'))
