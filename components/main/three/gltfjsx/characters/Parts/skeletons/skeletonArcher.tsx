/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cube7661: THREE.Mesh
    Cube7661_1: THREE.Mesh
    Cube7661_2: THREE.Mesh
    Cube7661_3: THREE.Mesh
    Cube7661_4: THREE.Mesh
    Cube7661_5: THREE.Mesh
    Cube7661_6: THREE.Mesh
    Cube7662: THREE.Mesh
    Cube7662_1: THREE.Mesh
    Cube7662_2: THREE.Mesh
    Cube7662_3: THREE.Mesh
    Cube7663: THREE.Mesh
    Cube7663_1: THREE.Mesh
    Cube7658: THREE.Mesh
    Cube7658_1: THREE.Mesh
    character_skeleton_archer_eyes: THREE.Mesh
    character_skeleton_archer_hood: THREE.Mesh
    character_skeleton_archer_jaw: THREE.Mesh
    character_skeleton_archer_mask: THREE.Mesh
  }
  materials: {
    Stone: THREE.MeshStandardMaterial
    BrownDark: THREE.MeshStandardMaterial
    White: THREE.MeshStandardMaterial
    Black: THREE.MeshStandardMaterial
    Metal: THREE.MeshStandardMaterial
    PurpleDark: THREE.MeshStandardMaterial
    WoodDark: THREE.MeshStandardMaterial
    Glow: THREE.MeshStandardMaterial
  }
}

export default function skeletonArcherParts({ nodes, materials }: GLTFResult) {
  return {
    body: <>
      <mesh geometry={nodes.Cube7661.geometry} material={nodes.Cube7661.material} />
      <mesh geometry={nodes.Cube7661_1.geometry} material={nodes.Cube7661_1.material} />
      <mesh geometry={nodes.Cube7661_2.geometry} material={nodes.Cube7661_2.material} />
      <mesh geometry={nodes.Cube7661_3.geometry} material={nodes.Cube7661_3.material} />
      <mesh geometry={nodes.Cube7661_4.geometry} material={materials.Metal} />
      <mesh geometry={nodes.Cube7661_5.geometry} material={nodes.Cube7661_5.material} />
      <mesh geometry={nodes.Cube7661_6.geometry} material={materials.WoodDark} />
    </>,

    head: <>
      <mesh
        name="Cube7658"
        geometry={nodes.Cube7658.geometry}
        material={nodes.Cube7658.material}
        morphTargetDictionary={nodes.Cube7658.morphTargetDictionary}
        morphTargetInfluences={nodes.Cube7658.morphTargetInfluences}
      />
      <mesh
        name="Cube7658_1"
        geometry={nodes.Cube7658_1.geometry}
        material={nodes.Cube7658_1.material}
        morphTargetDictionary={nodes.Cube7658_1.morphTargetDictionary}
        morphTargetInfluences={nodes.Cube7658_1.morphTargetInfluences}
      />
      <mesh
        geometry={nodes.character_skeleton_archer_eyes.geometry}
        material={materials.Glow}
        position={[0, 0.42, 0.26]}
      />
      <mesh
        geometry={nodes.character_skeleton_archer_hood.geometry}
        material={nodes.character_skeleton_archer_hood.material}
      />
      <mesh
        geometry={nodes.character_skeleton_archer_jaw.geometry}
        material={nodes.character_skeleton_archer_jaw.material}
        position={[0, 0.13, 0.04]}
      />
      <mesh
        geometry={nodes.character_skeleton_archer_mask.geometry}
        material={nodes.character_skeleton_archer_mask.material}
      />
    </>,

    armLeft: <>
      <mesh geometry={nodes.Cube7662.geometry} material={nodes.Cube7662.material} />
      <mesh geometry={nodes.Cube7662_1.geometry} material={nodes.Cube7662_1.material} />
      <mesh geometry={nodes.Cube7662_2.geometry} material={nodes.Cube7662_2.material} />
      <mesh geometry={nodes.Cube7662_3.geometry} material={nodes.Cube7662_3.material} />
    </>,

    armRight: <>
      <mesh geometry={nodes.Cube7663.geometry} material={nodes.Cube7663.material} />
      <mesh geometry={nodes.Cube7663_1.geometry} material={nodes.Cube7663_1.material} />
    </>    
  }
}

useGLTF.preload('/assets/kaykit/Models/characters/skeletons/character_skeleton_archer.gltf')
