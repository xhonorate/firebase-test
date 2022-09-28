/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cube4440: THREE.Mesh
    Cube4440_1: THREE.Mesh
    Cube4440_2: THREE.Mesh
    Cube4440_3: THREE.Mesh
  }
  materials: {
    Metal: THREE.MeshStandardMaterial
    BrownDark: THREE.MeshStandardMaterial
    Gold: THREE.MeshStandardMaterial
    Red: THREE.MeshStandardMaterial
  }
}

export default function ChestUncommon(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF(require('../../../../../public/assets/kaykit/Models/items/chest_uncommon.gltf.glb')) as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cube4440.geometry} material={materials.Metal} />
      <mesh geometry={nodes.Cube4440_1.geometry} material={materials.BrownDark} />
      <mesh geometry={nodes.Cube4440_2.geometry} material={materials.Gold} />
      <mesh geometry={nodes.Cube4440_3.geometry} material={materials.Red} />
    </group>
  )
}

//useGLTF.preload(require('../../../../../public/assets/kaykit/Models/items/chest_uncommon.gltf.glb'))
