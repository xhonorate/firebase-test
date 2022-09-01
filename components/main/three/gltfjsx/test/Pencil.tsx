/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Pencil: THREE.Mesh
  }
  materials: {
    PrototypePete: THREE.MeshStandardMaterial
  }
}

export default function Pencil(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/assets/kaykit/Models/characters/Pencil.gltf.glb') as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Pencil.geometry} material={materials.PrototypePete} />
    </group>
  )
}

useGLTF.preload('/assets/kaykit/Models/characters/Pencil.gltf.glb')
