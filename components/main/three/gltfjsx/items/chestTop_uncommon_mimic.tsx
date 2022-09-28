/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cube4435: THREE.Mesh
    Cube4435_1: THREE.Mesh
    Cube4435_2: THREE.Mesh
    Cube4435_3: THREE.Mesh
  }
  materials: {
    Metal: THREE.MeshStandardMaterial
    BrownDark: THREE.MeshStandardMaterial
    Black: THREE.MeshStandardMaterial
    White: THREE.MeshStandardMaterial
  }
}

export default function ChestTopUncommonMimic(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF(require('../../../../../public/assets/kaykit/Models/items/chestTop_uncommon_mimic.gltf.glb')) as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cube4435.geometry} material={materials.Metal} />
      <mesh geometry={nodes.Cube4435_1.geometry} material={materials.BrownDark} />
      <mesh geometry={nodes.Cube4435_2.geometry} material={materials.Black} />
      <mesh geometry={nodes.Cube4435_3.geometry} material={materials.White} />
    </group>
  )
}

//useGLTF.preload(require('../../../../../public/assets/kaykit/Models/items/chestTop_uncommon_mimic.gltf.glb'))
