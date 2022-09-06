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
    White: THREE.MeshStandardMaterial
    Black: THREE.MeshStandardMaterial
    WoodDark: THREE.MeshStandardMaterial
    Stone: THREE.MeshStandardMaterial
    PurpleDark: THREE.MeshStandardMaterial
    White: THREE.MeshStandardMaterial
    Black: THREE.MeshStandardMaterial
    Glow: THREE.MeshStandardMaterial
  }
}

export default function CharacterSkeletonMage(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/assets/kaykit/Models/characters/skeletons/character_skeleton_mage.gltf') as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Cube7682.geometry} material={materials.BrownDark} />
      <mesh geometry={nodes.Cube7682_1.geometry} material={nodes.Cube7682_1.material} />
      <mesh geometry={nodes.Cube7682_2.geometry} material={nodes.Cube7682_2.material} />
      <mesh geometry={nodes.Cube7682_3.geometry} material={nodes.Cube7682_3.material} />
      <group position={[0.2, 0.63, 0]}>
        <mesh geometry={nodes.Cube7683.geometry} material={nodes.Cube7683.material} />
        <mesh geometry={nodes.Cube7683_1.geometry} material={nodes.Cube7683_1.material} />
        <mesh geometry={nodes.Cube7683_2.geometry} material={nodes.Cube7683_2.material} />
      </group>
      <group position={[-0.2, 0.63, 0]}>
        <mesh geometry={nodes.Cube7686.geometry} material={nodes.Cube7686.material} />
        <mesh geometry={nodes.Cube7686_1.geometry} material={nodes.Cube7686_1.material} />
        <mesh geometry={nodes.Cube7686_2.geometry} material={nodes.Cube7686_2.material} />
      </group>
      <mesh
        geometry={nodes.character_skeleton_mage_cloak.geometry}
        material={nodes.character_skeleton_mage_cloak.material}
        position={[0, 0.7, 0]}
      />
      <group position={[0, 0.7, 0]}>
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
      </group>
    </group>
  )
}

useGLTF.preload('/assets/kaykit/Models/characters/skeletons/character_skeleton_mage.gltf')