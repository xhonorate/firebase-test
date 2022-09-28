/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cylinder993: THREE.Mesh
    Cylinder993_1: THREE.Mesh
    Cylinder993_2: THREE.Mesh
  }
  materials: {
    Brown: THREE.MeshStandardMaterial
    BrownDark: THREE.MeshStandardMaterial
    Beige: THREE.MeshStandardMaterial
  }
}

export default function HexRockRoadBDetail(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF(require('../../../../../public/assets/kaykit/Models/tiles/hex/gltf/hex_rock_roadB_detail.gltf.glb')) as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cylinder993.geometry} material={materials.Brown} />
      <mesh geometry={nodes.Cylinder993_1.geometry} material={materials.BrownDark} />
      <mesh geometry={nodes.Cylinder993_2.geometry} material={materials.Beige} />
    </group>
  )
}

//useGLTF.preload(require('../../../../../public/assets/kaykit/Models/tiles/hex/gltf/hex_rock_roadB_detail.gltf.glb'))
