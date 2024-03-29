/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    chair: THREE.Mesh
  }
  materials: {
    BrownDark: THREE.MeshStandardMaterial
  }
}

export default function Chair(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/assets/kaykit/Models/items/chair.gltf.glb') as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.chair.geometry} material={materials.BrownDark} />
    </group>
  )
}

useGLTF.preload('/assets/kaykit/Models/items/chair.gltf.glb')
