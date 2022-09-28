/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cylinder1005: THREE.Mesh
    Cylinder1005_1: THREE.Mesh
    Cylinder1005_2: THREE.Mesh
  }
  materials: {
    Brown: THREE.MeshStandardMaterial
    BrownDark: THREE.MeshStandardMaterial
    Beige: THREE.MeshStandardMaterial
  }
}

export default function HexRockRoadHDetail(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF(require('../../../../../public/assets/kaykit/Models/tiles/hex/gltf/hex_rock_roadH_detail.gltf.glb')) as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cylinder1005.geometry} material={materials.Brown} />
      <mesh geometry={nodes.Cylinder1005_1.geometry} material={materials.BrownDark} />
      <mesh geometry={nodes.Cylinder1005_2.geometry} material={materials.Beige} />
    </group>
  )
}

//useGLTF.preload(require('../../../../../public/assets/kaykit/Models/tiles/hex/gltf/hex_rock_roadH_detail.gltf.glb'))
