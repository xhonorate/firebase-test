/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cube007: THREE.Mesh
    Cube007_1: THREE.Mesh
    Cube007_2: THREE.Mesh
    Cube007_3: THREE.Mesh
    Cube013: THREE.Mesh
    Cube013_1: THREE.Mesh
    Cube013_2: THREE.Mesh
    Cube012: THREE.Mesh
    Cube012_1: THREE.Mesh
    Cube019: THREE.Mesh
    Cube019_1: THREE.Mesh
    character_rogueHair: THREE.Mesh
  }
  materials: {
    GreenDark: THREE.MeshStandardMaterial
    BrownDark: THREE.MeshStandardMaterial
    Brown: THREE.MeshStandardMaterial
    Metal: THREE.MeshStandardMaterial
    PinkLight: THREE.MeshStandardMaterial
    Black: THREE.MeshStandardMaterial
  }
}

export default function rogueParts({ nodes, materials }: GLTFResult) {
  return {
    body: <>
      <mesh geometry={nodes.Cube007.geometry} material={nodes.Cube007.material} />
      <mesh geometry={nodes.Cube007_1.geometry} material={nodes.Cube007_1.material} />
      <mesh geometry={nodes.Cube007_2.geometry} material={nodes.Cube007_2.material} />
      <mesh geometry={nodes.Cube007_3.geometry} material={materials.Metal} />
    </>,

    head: <>
      <mesh geometry={nodes.Cube019.geometry} material={materials.PinkLight} />
      <mesh geometry={nodes.Cube019_1.geometry} material={materials.Black} />
      <mesh
        geometry={nodes.character_rogueHair.geometry}
        material={nodes.character_rogueHair.material}
      />
    </>,

    armLeft: <>
      <mesh geometry={nodes.Cube013.geometry} material={nodes.Cube013.material} />
      <mesh geometry={nodes.Cube013_1.geometry} material={nodes.Cube013_1.material} />
      <mesh geometry={nodes.Cube013_2.geometry} material={nodes.Cube013_2.material} />
    </>,

    armRight: <>
      <mesh geometry={nodes.Cube012.geometry} material={nodes.Cube012.material} />
      <mesh geometry={nodes.Cube012_1.geometry} material={nodes.Cube012_1.material} />
    </>    
  }
}

useGLTF.preload('/assets/kaykit/Models/characters/character_rogue.gltf')
