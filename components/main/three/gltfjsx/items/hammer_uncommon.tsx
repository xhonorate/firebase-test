/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cube4463: THREE.Mesh
    Cube4463_1: THREE.Mesh
    Cube4463_2: THREE.Mesh
  }
  materials: {
    Metal: THREE.MeshStandardMaterial
    BrownDark: THREE.MeshStandardMaterial
    Stone: THREE.MeshStandardMaterial
  }
}

export default function HammerUncommon(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF(require('../../../../../public/assets/kaykit/Models/items/hammer_uncommon.gltf.glb')) as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cube4463.geometry} material={materials.Metal} />
      <mesh geometry={nodes.Cube4463_1.geometry} material={materials.BrownDark} />
      <mesh geometry={nodes.Cube4463_2.geometry} material={materials.Stone} />
    </group>
  )
}

//useGLTF.preload(require('../../../../../public/assets/kaykit/Models/items/hammer_uncommon.gltf.glb'))
