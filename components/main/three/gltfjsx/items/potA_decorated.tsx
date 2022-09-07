/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cylinder283: THREE.Mesh
    Cylinder283_1: THREE.Mesh
  }
  materials: {
    Beige: THREE.MeshStandardMaterial
    Brown: THREE.MeshStandardMaterial
  }
}

export default function PotADecorated(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/assets/kaykit/Models/items/potA_decorated.gltf.glb') as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cylinder283.geometry} material={materials.Beige} />
      <mesh geometry={nodes.Cylinder283_1.geometry} material={materials.Brown} />
    </group>
  )
}

useGLTF.preload('/assets/kaykit/Models/items/potA_decorated.gltf.glb')
