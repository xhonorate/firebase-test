/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cylinder1034: THREE.Mesh
    Cylinder1034_1: THREE.Mesh
  }
  materials: {
    Beige: THREE.MeshStandardMaterial
    Brown: THREE.MeshStandardMaterial
  }
}

export default function HexSandRoadB(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF(require('../../../../../public/assets/kaykit/Models/tiles/hex/gltf/hex_sand_roadB.gltf.glb')) as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cylinder1034.geometry} material={materials.Beige} />
      <mesh geometry={nodes.Cylinder1034_1.geometry} material={materials.Brown} />
    </group>
  )
}

//useGLTF.preload(require('../../../../../public/assets/kaykit/Models/tiles/hex/gltf/hex_sand_roadB.gltf.glb'))
