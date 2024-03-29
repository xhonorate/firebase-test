/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cube4421: THREE.Mesh
    Cube4421_1: THREE.Mesh
    Cube4421_2: THREE.Mesh
    Cube4421_3: THREE.Mesh
    Cube4421_4: THREE.Mesh
    Cube4421_5: THREE.Mesh
    Cube4421_6: THREE.Mesh
    Cube4421_7: THREE.Mesh
  }
  materials: {
    BrownDark: THREE.MeshStandardMaterial
    PurpleDark: THREE.MeshStandardMaterial
    White: THREE.MeshStandardMaterial
    Metal: THREE.MeshStandardMaterial
    BlueDark: THREE.MeshStandardMaterial
    GreenDark: THREE.MeshStandardMaterial
    WoodDark: THREE.MeshStandardMaterial
    Black: THREE.MeshStandardMaterial
  }
}

export default function BookcaseFilled(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/assets/kaykit/Models/items/bookcaseFilled.gltf.glb') as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cube4421.geometry} material={materials.BrownDark} />
      <mesh geometry={nodes.Cube4421_1.geometry} material={materials.PurpleDark} />
      <mesh geometry={nodes.Cube4421_2.geometry} material={materials.White} />
      <mesh geometry={nodes.Cube4421_3.geometry} material={materials.Metal} />
      <mesh geometry={nodes.Cube4421_4.geometry} material={materials.BlueDark} />
      <mesh geometry={nodes.Cube4421_5.geometry} material={materials.GreenDark} />
      <mesh geometry={nodes.Cube4421_6.geometry} material={materials.WoodDark} />
      <mesh geometry={nodes.Cube4421_7.geometry} material={materials.Black} />
    </group>
  )
}

useGLTF.preload('/assets/kaykit/Models/items/bookcaseFilled.gltf.glb')
