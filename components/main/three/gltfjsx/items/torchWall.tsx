/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cylinder300: THREE.Mesh
    Cylinder300_1: THREE.Mesh
    Cylinder300_2: THREE.Mesh
    Cylinder300_3: THREE.Mesh
  }
  materials: {
    BrownDark: THREE.MeshStandardMaterial
    Metal: THREE.MeshStandardMaterial
    WoodDark: THREE.MeshStandardMaterial
    StoneDark: THREE.MeshStandardMaterial
  }
}

export default function TorchWall(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF(require('../../../../../public/assets/kaykit/Models/items/torchWall.gltf.glb')) as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cylinder300.geometry} material={materials.BrownDark} />
      <mesh geometry={nodes.Cylinder300_1.geometry} material={materials.Metal} />
      <mesh geometry={nodes.Cylinder300_2.geometry} material={materials.WoodDark} />
      <mesh geometry={nodes.Cylinder300_3.geometry} material={materials.StoneDark} />
    </group>
  )
}

//useGLTF.preload(require('../../../../../public/assets/kaykit/Models/items/torchWall.gltf.glb'))
