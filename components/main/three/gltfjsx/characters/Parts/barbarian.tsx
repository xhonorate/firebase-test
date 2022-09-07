/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cube020: THREE.Mesh
    Cube020_1: THREE.Mesh
    Cube020_2: THREE.Mesh
    Cube002: THREE.Mesh
    Cube002_1: THREE.Mesh
    Cube002_2: THREE.Mesh
    Cube002_3: THREE.Mesh
    Cube002_4: THREE.Mesh
    Cube010: THREE.Mesh
    Cube010_1: THREE.Mesh
    Cube010_2: THREE.Mesh
    Cube010_3: THREE.Mesh
    Cube010_4: THREE.Mesh
    Cube009: THREE.Mesh
    Cube009_1: THREE.Mesh
    Cube009_2: THREE.Mesh
    Cube009_3: THREE.Mesh
    Cube009_4: THREE.Mesh
    Cube014: THREE.Mesh
    Cube014_1: THREE.Mesh
    Cube014_2: THREE.Mesh
  }
  materials: {
    Black: THREE.MeshStandardMaterial
    WoodDark: THREE.MeshStandardMaterial
    White: THREE.MeshStandardMaterial
    BrownDark: THREE.MeshStandardMaterial
    BlueDark: THREE.MeshStandardMaterial
    Metal: THREE.MeshStandardMaterial
    Mud: THREE.MeshStandardMaterial
    PinkLight: THREE.MeshStandardMaterial
  }
}

export default function barbarianParts({ nodes, materials } : GLTFResult) {
  return {
    body: 
      <>
        <mesh geometry={nodes.Cube002.geometry} material={nodes.Cube002.material} />
        <mesh geometry={nodes.Cube002_1.geometry} material={nodes.Cube002_1.material} />
        <mesh geometry={nodes.Cube002_2.geometry} material={nodes.Cube002_2.material} />
        <mesh geometry={nodes.Cube002_3.geometry} material={nodes.Cube002_3.material} />
        <mesh geometry={nodes.Cube002_4.geometry} material={nodes.Cube002_4.material} />
      </>,

    head:
      <>
        <group position={[0, 0.7, 0]}>
          <mesh geometry={nodes.Cube020.geometry} material={nodes.Cube020.material} />
          <mesh geometry={nodes.Cube020_1.geometry} material={nodes.Cube020_1.material} />
          <mesh geometry={nodes.Cube020_2.geometry} material={nodes.Cube020_2.material} />
        </group>
        <group>
          <mesh geometry={nodes.Cube014.geometry} material={materials.PinkLight} />
          <mesh geometry={nodes.Cube014_1.geometry} material={nodes.Cube014_1.material} />
          <mesh geometry={nodes.Cube014_2.geometry} material={nodes.Cube014_2.material} />
        </group>
      </>,

    armLeft:
      <>
        <mesh geometry={nodes.Cube010.geometry} material={nodes.Cube010.material} />
        <mesh geometry={nodes.Cube010_1.geometry} material={nodes.Cube010_1.material} />
        <mesh geometry={nodes.Cube010_2.geometry} material={nodes.Cube010_2.material} />
        <mesh geometry={nodes.Cube010_3.geometry} material={nodes.Cube010_3.material} />
        <mesh geometry={nodes.Cube010_4.geometry} material={nodes.Cube010_4.material} />
      </>,

    armRight: 
      <>
        <mesh geometry={nodes.Cube009.geometry} material={nodes.Cube009.material} />
        <mesh geometry={nodes.Cube009_1.geometry} material={nodes.Cube009_1.material} />
        <mesh geometry={nodes.Cube009_2.geometry} material={nodes.Cube009_2.material} />
        <mesh geometry={nodes.Cube009_3.geometry} material={nodes.Cube009_3.material} />
        <mesh geometry={nodes.Cube009_4.geometry} material={nodes.Cube009_4.material} />
      </>
  }
}

useGLTF.preload('/assets/kaykit/Models/characters/character_barbarian.gltf')