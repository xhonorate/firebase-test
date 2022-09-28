/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cube1020: THREE.Mesh
    Cube1020_1: THREE.Mesh
    Cube1020_2: THREE.Mesh
    Cube1020_3: THREE.Mesh
    Cube1020_4: THREE.Mesh
  }
  materials: {
    Brown: THREE.MeshStandardMaterial
    Stone: THREE.MeshStandardMaterial
    White: THREE.MeshStandardMaterial
    BrownDark: THREE.MeshStandardMaterial
    Metal: THREE.MeshStandardMaterial
  }
}

export default function Lumbermill(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF(require('../../../../../public/assets/kaykit/Models/objects/gltf/lumbermill.gltf.glb')) as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cube1020.geometry} material={materials.Brown} />
      <mesh geometry={nodes.Cube1020_1.geometry} material={materials.Stone} />
      <mesh geometry={nodes.Cube1020_2.geometry} material={materials.White} />
      <mesh geometry={nodes.Cube1020_3.geometry} material={materials.BrownDark} />
      <mesh geometry={nodes.Cube1020_4.geometry} material={materials.Metal} />
    </group>
  )
}

//useGLTF.preload(require('../../../../../public/assets/kaykit/Models/objects/gltf/lumbermill.gltf.glb'))
