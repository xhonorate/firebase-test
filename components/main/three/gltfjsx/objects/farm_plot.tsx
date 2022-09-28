/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cube398: THREE.Mesh
    Cube398_1: THREE.Mesh
    Cube398_2: THREE.Mesh
    farm_wheat: THREE.Mesh
  }
  materials: {
    Brown: THREE.MeshStandardMaterial
    Beige: THREE.MeshStandardMaterial
    BrownDark: THREE.MeshStandardMaterial
    Yellow: THREE.MeshStandardMaterial
  }
}

export default function FarmPlot(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF(require('../../../../../public/assets/kaykit/Models/objects/gltf/farm_plot.gltf.glb')) as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cube398.geometry} material={materials.Brown} />
      <mesh geometry={nodes.Cube398_1.geometry} material={materials.Beige} />
      <mesh geometry={nodes.Cube398_2.geometry} material={materials.BrownDark} />
      <mesh geometry={nodes.farm_wheat.geometry} material={materials.Yellow} />
    </group>
  )
}

//useGLTF.preload(require('../../../../../public/assets/kaykit/Models/objects/gltf/farm_plot.gltf.glb'))
