/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    bookcaseWide: THREE.Mesh
  }
  materials: {
    BrownDark: THREE.MeshStandardMaterial
  }
}

export default function BookcaseWide(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/assets/kaykit/Models/items/bookcaseWide.gltf.glb') as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.bookcaseWide.geometry} material={materials.BrownDark} />
    </group>
  )
}

useGLTF.preload('/assets/kaykit/Models/items/bookcaseWide.gltf.glb')