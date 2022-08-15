/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cylinder1006: THREE.Mesh
    Cylinder1006_1: THREE.Mesh
  }
  materials: {
    Brown: THREE.MeshStandardMaterial
    Beige: THREE.MeshStandardMaterial
  }
}

export default function HexRockRoadI(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/assets/kaykit/Models/tiles/hex/gltf/hex_rock_roadI.gltf.glb') as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cylinder1006.geometry} material={materials.Brown} />
      <mesh geometry={nodes.Cylinder1006_1.geometry} material={materials.Beige} />
    </group>
  )
}

useGLTF.preload('/assets/kaykit/Models/tiles/hex/gltf/hex_rock_roadI.gltf.glb')
