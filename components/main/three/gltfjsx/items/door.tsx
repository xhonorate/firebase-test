/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cube4453: THREE.Mesh
    Cube4453_1: THREE.Mesh
  }
  materials: {
    BrownDark: THREE.MeshStandardMaterial
    Metal: THREE.MeshStandardMaterial
  }
}

export default function Door(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/assets/kaykit/Models/items/door.gltf.glb') as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cube4453.geometry} material={materials.BrownDark} />
      <mesh geometry={nodes.Cube4453_1.geometry} material={materials.Metal} />
    </group>
  )
}

useGLTF.preload('/assets/kaykit/Models/items/door.gltf.glb')
