/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cylinder271: THREE.Mesh
    Cylinder271_1: THREE.Mesh
    Cylinder271_2: THREE.Mesh
  }
  materials: {
    BrownDark: THREE.MeshStandardMaterial
    Beige: THREE.MeshStandardMaterial
    Metal: THREE.MeshStandardMaterial
  }
}

export default function Barrel(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF(require('../../../../../public/assets/kaykit/Models/items/barrel.gltf.glb')) as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cylinder271.geometry} material={materials.BrownDark} />
      <mesh geometry={nodes.Cylinder271_1.geometry} material={materials.Beige} />
      <mesh geometry={nodes.Cylinder271_2.geometry} material={materials.Metal} />
    </group>
  )
}

//useGLTF.preload(require('../../../../../public/assets/kaykit/Models/items/barrel.gltf.glb'))
