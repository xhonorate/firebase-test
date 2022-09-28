/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cylinder270: THREE.Mesh
    Cylinder270_1: THREE.Mesh
  }
  materials: {
    Gold: THREE.MeshStandardMaterial
    Red: THREE.MeshStandardMaterial
  }
}

export default function Artifact(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF(require('../../../../../public/assets/kaykit/Models/items/artifact.gltf.glb')) as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cylinder270.geometry} material={materials.Gold} />
      <mesh geometry={nodes.Cylinder270_1.geometry} material={materials.Red} />
    </group>
  )
}

//useGLTF.preload(require('../../../../../public/assets/kaykit/Models/items/artifact.gltf.glb'))
