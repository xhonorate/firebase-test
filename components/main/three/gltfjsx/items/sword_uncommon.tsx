/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cube4514: THREE.Mesh
    Cube4514_1: THREE.Mesh
    Cube4514_2: THREE.Mesh
  }
  materials: {
    Metal: THREE.MeshStandardMaterial
    BrownDark: THREE.MeshStandardMaterial
    Stone: THREE.MeshStandardMaterial
  }
}

export default function SwordUncommon(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF(require('../../../../../public/assets/kaykit/Models/items/sword_uncommon.gltf.glb')) as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cube4514.geometry} material={materials.Metal} />
      <mesh geometry={nodes.Cube4514_1.geometry} material={materials.BrownDark} />
      <mesh geometry={nodes.Cube4514_2.geometry} material={materials.Stone} />
    </group>
  )
}

//useGLTF.preload(require('../../../../../public/assets/kaykit/Models/items/sword_uncommon.gltf.glb'))
