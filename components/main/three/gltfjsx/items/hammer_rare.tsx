/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cube4462: THREE.Mesh
    Cube4462_1: THREE.Mesh
    Cube4462_2: THREE.Mesh
  }
  materials: {
    White: THREE.MeshStandardMaterial
    Gold: THREE.MeshStandardMaterial
    Red: THREE.MeshStandardMaterial
  }
}

export default function HammerRare(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/assets/kaykit/Models/items/hammer_rare.gltf.glb') as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cube4462.geometry} material={materials.White} />
      <mesh geometry={nodes.Cube4462_1.geometry} material={materials.Gold} />
      <mesh geometry={nodes.Cube4462_2.geometry} material={materials.Red} />
    </group>
  )
}

useGLTF.preload('/assets/kaykit/Models/items/hammer_rare.gltf.glb')