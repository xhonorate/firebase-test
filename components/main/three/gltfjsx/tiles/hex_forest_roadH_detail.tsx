/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cylinder963: THREE.Mesh
    Cylinder963_1: THREE.Mesh
    Cylinder963_2: THREE.Mesh
  }
  materials: {
    Green: THREE.MeshStandardMaterial
    BrownDark: THREE.MeshStandardMaterial
    Beige: THREE.MeshStandardMaterial
  }
}

export default function HexForestRoadHDetail(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF(require('../../../../../public/assets/kaykit/Models/tiles/hex/gltf/hex_forest_roadH_detail.gltf.glb')) as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cylinder963.geometry} material={materials.Green} />
      <mesh geometry={nodes.Cylinder963_1.geometry} material={materials.BrownDark} />
      <mesh geometry={nodes.Cylinder963_2.geometry} material={materials.Beige} />
    </group>
  )
}

//useGLTF.preload(require('../../../../../public/assets/kaykit/Models/tiles/hex/gltf/hex_forest_roadH_detail.gltf.glb'))
