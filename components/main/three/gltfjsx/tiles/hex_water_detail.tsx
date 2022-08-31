/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cylinder1115: THREE.Mesh
    Cylinder1115_1: THREE.Mesh
  }
  materials: {
    BrownDark: THREE.MeshStandardMaterial
    Water: THREE.MeshStandardMaterial
  }
}

export default function HexWaterDetail(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/assets/kaykit/Models/tiles/hex/gltf/hex_water_detail.gltf.glb') as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cylinder1115.geometry} material={materials.BrownDark} />
      <mesh geometry={nodes.Cylinder1115_1.geometry} /* material-opacity={0.8} material-transparency={true} */ material={materials.Water} />
    </group>
  )
}

useGLTF.preload('/assets/kaykit/Models/tiles/hex/gltf/hex_water_detail.gltf.glb')
