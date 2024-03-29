/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cube7682: THREE.Mesh
    Cube7682_1: THREE.Mesh
    Cube7682_2: THREE.Mesh
    Cube7682_3: THREE.Mesh
    Cube7683: THREE.Mesh
    Cube7683_1: THREE.Mesh
    Cube7683_2: THREE.Mesh
    Cube7686: THREE.Mesh
    Cube7686_1: THREE.Mesh
    Cube7686_2: THREE.Mesh
    character_skeleton_mage_cloak: THREE.Mesh
    Cube7687: THREE.Mesh
    Cube7687_1: THREE.Mesh
    character_skeleton_mage_cowl: THREE.Mesh
    character_skeleton_mage_eyes: THREE.Mesh
    character_skeleton_mage_jaw: THREE.Mesh
  }
  materials: {
    BrownDark: THREE.MeshStandardMaterial
    WoodDark: THREE.MeshStandardMaterial
    Stone: THREE.MeshStandardMaterial
    PurpleDark: THREE.MeshStandardMaterial
    White: THREE.MeshStandardMaterial
    Black: THREE.MeshStandardMaterial
    Glow: THREE.MeshStandardMaterial
  }
}

export default function skeletonMageParts({ nodes, materials }: GLTFResult) {
  return {
    body: <> 
      <mesh geometry={nodes.Cube7682.geometry} material={materials.BrownDark} />
      <mesh geometry={nodes.Cube7682_1.geometry} material={nodes.Cube7682_1.material} />
      <mesh geometry={nodes.Cube7682_2.geometry} material={nodes.Cube7682_2.material} />
      <mesh geometry={nodes.Cube7682_3.geometry} material={nodes.Cube7682_3.material} />
    </>,

    head: <>
      <mesh
        name="Cube7687"
        geometry={nodes.Cube7687.geometry}
        material={nodes.Cube7687.material}
        morphTargetDictionary={nodes.Cube7687.morphTargetDictionary}
        morphTargetInfluences={nodes.Cube7687.morphTargetInfluences}
      />
      <mesh
        name="Cube7687_1"
        geometry={nodes.Cube7687_1.geometry}
        material={nodes.Cube7687_1.material}
        morphTargetDictionary={nodes.Cube7687_1.morphTargetDictionary}
        morphTargetInfluences={nodes.Cube7687_1.morphTargetInfluences}
      />
      <mesh
        geometry={nodes.character_skeleton_mage_cowl.geometry}
        material={nodes.character_skeleton_mage_cowl.material}
      />
      <mesh
        geometry={nodes.character_skeleton_mage_eyes.geometry}
        material={materials.Glow}
        position={[0, 0.42, 0.26]}
      />
      <mesh
        geometry={nodes.character_skeleton_mage_jaw.geometry}
        material={nodes.character_skeleton_mage_jaw.material}
        position={[0, 0.13, 0.04]}
      />

      <mesh
        geometry={nodes.character_skeleton_mage_cloak.geometry}
        material={nodes.character_skeleton_mage_cloak.material}
      />
    </>,

    armLeft: <>
      <mesh geometry={nodes.Cube7683.geometry} material={nodes.Cube7683.material} />
      <mesh geometry={nodes.Cube7683_1.geometry} material={nodes.Cube7683_1.material} />
      <mesh geometry={nodes.Cube7683_2.geometry} material={nodes.Cube7683_2.material} />
    </>,

    armRight: <>
      <mesh geometry={nodes.Cube7686.geometry} material={nodes.Cube7686.material} />
      <mesh geometry={nodes.Cube7686_1.geometry} material={nodes.Cube7686_1.material} />
      <mesh geometry={nodes.Cube7686_2.geometry} material={nodes.Cube7686_2.material} />
    </>    
  }
}

useGLTF.preload('/assets/kaykit/Models/characters/skeletons/character_skeleton_mage.gltf')
