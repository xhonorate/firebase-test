/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cube7674: THREE.Mesh
    Cube7674_1: THREE.Mesh
    Cube7674_2: THREE.Mesh
    Cube7674_3: THREE.Mesh
    Cube7674_4: THREE.Mesh
    Cube7675: THREE.Mesh
    Cube7675_1: THREE.Mesh
    Cube7675_2: THREE.Mesh
    Cube7675_3: THREE.Mesh
    Cube7675_4: THREE.Mesh
    Cube7678: THREE.Mesh
    Cube7678_1: THREE.Mesh
    Cube7678_2: THREE.Mesh
    character_skeleton_mage_cloak_broken: THREE.Mesh
    Cube7691: THREE.Mesh
    Cube7691_1: THREE.Mesh
    Cube7691_2: THREE.Mesh
    Cube7691_3: THREE.Mesh
    character_skeleton_mage_cowl_broken: THREE.Mesh
    character_skeleton_mage_eyes_broken: THREE.Mesh
    character_skeleton_mage_jaw_broken: THREE.Mesh
  }
  materials: {
    BrownDark: THREE.MeshStandardMaterial
    White: THREE.MeshStandardMaterial
    Black: THREE.MeshStandardMaterial
    WoodDark: THREE.MeshStandardMaterial
    GreenDark: THREE.MeshStandardMaterial
    Stone: THREE.MeshStandardMaterial
    PurpleDark: THREE.MeshStandardMaterial
    Glow: THREE.MeshStandardMaterial
  }
}

export default function skeletonMageBrokenParts({ nodes, materials }: GLTFResult) {
  return {
    body: <>
      <mesh geometry={nodes.Cube7674.geometry} material={nodes.Cube7674.material} />
      <mesh geometry={nodes.Cube7674_1.geometry} material={nodes.Cube7674_1.material} />
      <mesh geometry={nodes.Cube7674_2.geometry} material={nodes.Cube7674_2.material} />
      <mesh geometry={nodes.Cube7674_3.geometry} material={nodes.Cube7674_3.material} />
      <mesh geometry={nodes.Cube7674_4.geometry} material={nodes.Cube7674_4.material} />
    </>,

    head: <>
      <mesh
        name="Cube7691"
        geometry={nodes.Cube7691.geometry}
        material={nodes.Cube7691.material}
        morphTargetDictionary={nodes.Cube7691.morphTargetDictionary}
        morphTargetInfluences={nodes.Cube7691.morphTargetInfluences}
      />
      <mesh
        name="Cube7691_1"
        geometry={nodes.Cube7691_1.geometry}
        material={nodes.Cube7691_1.material}
        morphTargetDictionary={nodes.Cube7691_1.morphTargetDictionary}
        morphTargetInfluences={nodes.Cube7691_1.morphTargetInfluences}
      />
      <mesh
        name="Cube7691_2"
        geometry={nodes.Cube7691_2.geometry}
        material={nodes.Cube7691_2.material}
        morphTargetDictionary={nodes.Cube7691_2.morphTargetDictionary}
        morphTargetInfluences={nodes.Cube7691_2.morphTargetInfluences}
      />
      <mesh
        name="Cube7691_3"
        geometry={nodes.Cube7691_3.geometry}
        material={nodes.Cube7691_3.material}
        morphTargetDictionary={nodes.Cube7691_3.morphTargetDictionary}
        morphTargetInfluences={nodes.Cube7691_3.morphTargetInfluences}
      />
      <mesh
        geometry={nodes.character_skeleton_mage_cowl_broken.geometry}
        material={nodes.character_skeleton_mage_cowl_broken.material}
      />
      <mesh
        geometry={nodes.character_skeleton_mage_eyes_broken.geometry}
        material={materials.Glow}
        position={[0, 0.42, 0.26]}
      />
      <mesh
        geometry={nodes.character_skeleton_mage_jaw_broken.geometry}
        material={nodes.character_skeleton_mage_jaw_broken.material}
        position={[0, 0.13, 0.04]}
      />

      <mesh
        geometry={nodes.character_skeleton_mage_cloak_broken.geometry}
        material={nodes.character_skeleton_mage_cloak_broken.material} />
    </>,

    armLeft: <>
      <mesh geometry={nodes.Cube7675.geometry} material={nodes.Cube7675.material} />
      <mesh geometry={nodes.Cube7675_1.geometry} material={nodes.Cube7675_1.material} />
      <mesh geometry={nodes.Cube7675_2.geometry} material={nodes.Cube7675_2.material} />
      <mesh geometry={nodes.Cube7675_3.geometry} material={nodes.Cube7675_3.material} />
      <mesh geometry={nodes.Cube7675_4.geometry} material={nodes.Cube7675_4.material} />
    </>,

    armRight: <>
      <mesh geometry={nodes.Cube7678.geometry} material={nodes.Cube7678.material} />
      <mesh geometry={nodes.Cube7678_1.geometry} material={nodes.Cube7678_1.material} />
      <mesh geometry={nodes.Cube7678_2.geometry} material={nodes.Cube7678_2.material} />
    </>    
  }
}

useGLTF.preload('/assets/kaykit/Models/characters/skeletons/character_skeleton_mage_broken.gltf')