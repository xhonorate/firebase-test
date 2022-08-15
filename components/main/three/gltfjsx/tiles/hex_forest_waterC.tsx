/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cylinder982: THREE.Mesh
    Cylinder982_1: THREE.Mesh
  }
  materials: {
    Green: THREE.MeshStandardMaterial
    Water: THREE.MeshStandardMaterial
  }
}

export default function HexForestWaterC(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/assets/kaykit/Models/tiles/hex/gltf/hex_forest_waterC.gltf.glb') as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cylinder982.geometry} material={materials.Green} />
      <mesh geometry={nodes.Cylinder982_1.geometry} material={materials.Water} />
    </group>
  )
}

useGLTF.preload('/assets/kaykit/Models/tiles/hex/gltf/hex_forest_waterC.gltf.glb')
