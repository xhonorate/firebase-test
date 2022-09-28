/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cylinder998: THREE.Mesh
    Cylinder998_1: THREE.Mesh
  }
  materials: {
    Brown: THREE.MeshStandardMaterial
    Beige: THREE.MeshStandardMaterial
  }
}

export default function HexRockRoadE(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF(require('../../../../../public/assets/kaykit/Models/tiles/hex/gltf/hex_rock_roadE.gltf.glb')) as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cylinder998.geometry} material={materials.Brown} />
      <mesh geometry={nodes.Cylinder998_1.geometry} material={materials.Beige} />
    </group>
  )
}

//useGLTF.preload(require('../../../../../public/assets/kaykit/Models/tiles/hex/gltf/hex_rock_roadE.gltf.glb'))
