/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cylinder1064: THREE.Mesh
    Cylinder1064_1: THREE.Mesh
    Cylinder1064_2: THREE.Mesh
  }
  materials: {
    Beige: THREE.MeshStandardMaterial
    BrownDark: THREE.MeshStandardMaterial
    Water: THREE.MeshStandardMaterial
  }
}

export default function HexSandWaterBDetail(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF(require('../../../../../public/assets/kaykit/Models/tiles/hex/gltf/hex_sand_waterB_detail.gltf.glb')) as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cylinder1064.geometry} material={materials.Beige} />
      <mesh geometry={nodes.Cylinder1064_1.geometry} material={materials.BrownDark} />
      <mesh geometry={nodes.Cylinder1064_2.geometry} material={materials.Water} />
    </group>
  )
}

//useGLTF.preload(require('../../../../../public/assets/kaykit/Models/tiles/hex/gltf/hex_sand_waterB_detail.gltf.glb'))
