/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    mountain: THREE.Mesh
  }
  materials: {
    Stone: THREE.MeshStandardMaterial
  }
}

export default function Mountain(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/assets/kaykit/Models/objects/gltf/mountain.gltf.glb') as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.mountain.geometry} material={materials.Stone} />
    </group>
  )
}

useGLTF.preload('/assets/kaykit/Models/objects/gltf/mountain.gltf.glb')
