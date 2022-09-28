/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cylinder1027: THREE.Mesh
    Cylinder1027_1: THREE.Mesh
  }
  materials: {
    Brown: THREE.MeshStandardMaterial
    Water: THREE.MeshStandardMaterial
  }
}

export default function HexRockWaterD(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF(require('../../../../../public/assets/kaykit/Models/tiles/hex/gltf/hex_rock_waterD.gltf.glb')) as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cylinder1027.geometry} material={materials.Brown} />
      <mesh geometry={nodes.Cylinder1027_1.geometry} material={materials.Water} />
    </group>
  )
}

//useGLTF.preload(require('../../../../../public/assets/kaykit/Models/tiles/hex/gltf/hex_rock_waterD.gltf.glb'))
