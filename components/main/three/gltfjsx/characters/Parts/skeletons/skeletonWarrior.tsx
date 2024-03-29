/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cube7637: THREE.Mesh
    Cube7637_1: THREE.Mesh
    Cube7637_2: THREE.Mesh
    Cube7637_3: THREE.Mesh
    Cube7637_4: THREE.Mesh
    Cube7636: THREE.Mesh
    Cube7636_1: THREE.Mesh
    Cube7636_2: THREE.Mesh
    Cube7636_3: THREE.Mesh
    Cube7638: THREE.Mesh
    Cube7638_1: THREE.Mesh
    Cube7638_2: THREE.Mesh
    Cube7638_3: THREE.Mesh
    Cube7633: THREE.Mesh
    Cube7633_1: THREE.Mesh
    character_skeleton_warrior_eyes: THREE.Mesh
    Cube7639: THREE.Mesh
    Cube7639_1: THREE.Mesh
    Cube7639_2: THREE.Mesh
    Cube7639_3: THREE.Mesh
    character_skeleton_warrior_jaw: THREE.Mesh
  }
  materials: {
    Stone: THREE.MeshStandardMaterial
    BrownDark: THREE.MeshStandardMaterial
    White: THREE.MeshStandardMaterial
    Black: THREE.MeshStandardMaterial
    Metal: THREE.MeshStandardMaterial
    Glow: THREE.MeshStandardMaterial
    Stone2: THREE.MeshStandardMaterial
  }
}

export default function skeletonWarriorParts({ nodes, materials }: GLTFResult) {
  return {
    body: <>
      <mesh geometry={nodes.Cube7637.geometry} material={nodes.Cube7637.material} />
      <mesh geometry={nodes.Cube7637_1.geometry} material={nodes.Cube7637_1.material} />
      <mesh geometry={nodes.Cube7637_2.geometry} material={nodes.Cube7637_2.material} />
      <mesh geometry={nodes.Cube7637_3.geometry} material={nodes.Cube7637_3.material} />
      <mesh geometry={nodes.Cube7637_4.geometry} material={materials.Metal} />
    </>,

    head: <>
      <mesh
        name="Cube7633"
        geometry={nodes.Cube7633.geometry}
        material={nodes.Cube7633.material}
        morphTargetDictionary={nodes.Cube7633.morphTargetDictionary}
        morphTargetInfluences={nodes.Cube7633.morphTargetInfluences}
      />
      <mesh
        name="Cube7633_1"
        geometry={nodes.Cube7633_1.geometry}
        material={nodes.Cube7633_1.material}
        morphTargetDictionary={nodes.Cube7633_1.morphTargetDictionary}
        morphTargetInfluences={nodes.Cube7633_1.morphTargetInfluences}
      />
      <mesh
        geometry={nodes.character_skeleton_warrior_eyes.geometry}
        material={materials.Glow}
        position={[0, 0.42, 0.26]}
      />
      <group position={[0, 0.52, 0]}>
        <mesh geometry={nodes.Cube7639.geometry} material={nodes.Cube7639.material} />
        <mesh geometry={nodes.Cube7639_1.geometry} material={nodes.Cube7639_1.material} />
        <mesh geometry={nodes.Cube7639_2.geometry} material={nodes.Cube7639_2.material} />
        <mesh geometry={nodes.Cube7639_3.geometry} material={materials.Stone2} />
      </group>
      <mesh
        geometry={nodes.character_skeleton_warrior_jaw.geometry}
        material={nodes.character_skeleton_warrior_jaw.material}
        position={[0, 0.13, 0.04]}
      />
    </>,

    armLeft: <>
      <mesh geometry={nodes.Cube7636.geometry} material={nodes.Cube7636.material} />
      <mesh geometry={nodes.Cube7636_1.geometry} material={nodes.Cube7636_1.material} />
      <mesh geometry={nodes.Cube7636_2.geometry} material={nodes.Cube7636_2.material} />
      <mesh geometry={nodes.Cube7636_3.geometry} material={nodes.Cube7636_3.material} />
    </>,

    armRight: <>
      <mesh geometry={nodes.Cube7638.geometry} material={nodes.Cube7638.material} />
      <mesh geometry={nodes.Cube7638_1.geometry} material={nodes.Cube7638_1.material} />
      <mesh geometry={nodes.Cube7638_2.geometry} material={nodes.Cube7638_2.material} />
      <mesh geometry={nodes.Cube7638_3.geometry} material={nodes.Cube7638_3.material} />
    </>    
  }
}

useGLTF.preload('/assets/kaykit/Models/characters/skeletons/character_skeleton_warrior.gltf')
