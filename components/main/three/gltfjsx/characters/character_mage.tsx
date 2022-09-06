/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cube021: THREE.Mesh
    Cube021_1: THREE.Mesh
    Cube021_2: THREE.Mesh
    Cube008: THREE.Mesh
    Cube008_1: THREE.Mesh
    Cube008_2: THREE.Mesh
    Cube008_3: THREE.Mesh
    Cube008_4: THREE.Mesh
    Cube011: THREE.Mesh
    Cube011_1: THREE.Mesh
    Cube011_2: THREE.Mesh
    Cube3976: THREE.Mesh
    Cube3976_1: THREE.Mesh
    Cube3976_2: THREE.Mesh
    Cube016: THREE.Mesh
    Cube016_1: THREE.Mesh
    Cube016_2: THREE.Mesh
    Cube017: THREE.Mesh
    Cube017_1: THREE.Mesh
  }
  materials: {
    PurpleDark: THREE.MeshStandardMaterial
    BrownDark: THREE.MeshStandardMaterial
    Metal: THREE.MeshStandardMaterial
    Purple: THREE.MeshStandardMaterial
    WoodDark: THREE.MeshStandardMaterial
    PinkLight: THREE.MeshStandardMaterial
    Black: THREE.MeshStandardMaterial
    Red: THREE.MeshStandardMaterial
  }
}

export default function CharacterMage(props: JSX.IntrinsicElements['group']) {
  const ref = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/assets/kaykit/Models/characters/character_mage.gltf') as unknown as GLTFResult
  return (
    <group ref={ref} {...props} dispose={null}>
      <group position={[0, 1.49, -0.02]}>
        <mesh geometry={nodes.Cube021.geometry} material={nodes.Cube021.material} />
        <mesh geometry={nodes.Cube021_1.geometry} material={nodes.Cube021_1.material} />
        <mesh geometry={nodes.Cube021_2.geometry} material={nodes.Cube021_2.material} />
      </group>
      <mesh geometry={nodes.Cube008.geometry} material={nodes.Cube008.material} />
      <mesh geometry={nodes.Cube008_1.geometry} material={materials.Purple} />
      <mesh geometry={nodes.Cube008_2.geometry} material={nodes.Cube008_2.material} />
      <mesh geometry={nodes.Cube008_3.geometry} material={nodes.Cube008_3.material} />
      <mesh geometry={nodes.Cube008_4.geometry} material={nodes.Cube008_4.material} />
      <group position={[-0.2, 0.63, 0]}>
        <mesh geometry={nodes.Cube011.geometry} material={nodes.Cube011.material} />
        <mesh geometry={nodes.Cube011_1.geometry} material={nodes.Cube011_1.material} />
        <mesh geometry={nodes.Cube011_2.geometry} material={nodes.Cube011_2.material} />
      </group>
      <group position={[0.2, 0.63, 0]}>
        <mesh geometry={nodes.Cube3976.geometry} material={nodes.Cube3976.material} />
        <mesh geometry={nodes.Cube3976_1.geometry} material={nodes.Cube3976_1.material} />
        <mesh geometry={nodes.Cube3976_2.geometry} material={nodes.Cube3976_2.material} />
      </group>
      <group position={[0, 0.7, 0]}>
        <mesh geometry={nodes.Cube016.geometry} material={materials.PinkLight} />
        <mesh geometry={nodes.Cube016_1.geometry} material={nodes.Cube016_1.material} />
        <mesh geometry={nodes.Cube016_2.geometry} material={nodes.Cube016_2.material} />
      </group>
      <group position={[0, 0.7, 0]}>
        <mesh geometry={nodes.Cube017.geometry} material={nodes.Cube017.material} />
        <mesh geometry={nodes.Cube017_1.geometry} material={materials.Red} />
      </group>
    </group>
  )
}

useGLTF.preload('/assets/kaykit/Models/characters/character_mage.gltf')
