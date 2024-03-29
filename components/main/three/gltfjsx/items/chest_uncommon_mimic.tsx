/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cube4441: THREE.Mesh
    Cube4441_1: THREE.Mesh
    Cube4441_2: THREE.Mesh
    Cube4441_3: THREE.Mesh
  }
  materials: {
    Metal: THREE.MeshStandardMaterial
    BrownDark: THREE.MeshStandardMaterial
    Black: THREE.MeshStandardMaterial
    White: THREE.MeshStandardMaterial
  }
}

export default function ChestUncommonMimic(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/assets/kaykit/Models/items/chest_uncommon_mimic.gltf.glb') as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cube4441.geometry} material={materials.Metal} />
      <mesh geometry={nodes.Cube4441_1.geometry} material={materials.BrownDark} />
      <mesh geometry={nodes.Cube4441_2.geometry} material={materials.Black} />
      <mesh geometry={nodes.Cube4441_3.geometry} material={materials.White} />
    </group>
  )
}

useGLTF.preload('/assets/kaykit/Models/items/chest_uncommon_mimic.gltf.glb')
