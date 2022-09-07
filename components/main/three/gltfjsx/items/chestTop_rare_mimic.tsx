/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cube4433: THREE.Mesh
    Cube4433_1: THREE.Mesh
    Cube4433_2: THREE.Mesh
  }
  materials: {
    Gold: THREE.MeshStandardMaterial
    White: THREE.MeshStandardMaterial
    Black: THREE.MeshStandardMaterial
  }
}

export default function ChestTopRareMimic(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/assets/kaykit/Models/items/chestTop_rare_mimic.gltf.glb') as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cube4433.geometry} material={materials.Gold} />
      <mesh geometry={nodes.Cube4433_1.geometry} material={materials.White} />
      <mesh geometry={nodes.Cube4433_2.geometry} material={materials.Black} />
    </group>
  )
}

useGLTF.preload('/assets/kaykit/Models/items/chestTop_rare_mimic.gltf.glb')
