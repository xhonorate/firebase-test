/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cube7627: THREE.Mesh
    Cube7627_1: THREE.Mesh
    Cube7627_2: THREE.Mesh
    Cube7627_3: THREE.Mesh
    Cube7627_4: THREE.Mesh
    Cube7627_5: THREE.Mesh
    Cube7626: THREE.Mesh
    Cube7626_1: THREE.Mesh
    Cube7626_2: THREE.Mesh
    Cube7626_3: THREE.Mesh
    Cube7628: THREE.Mesh
    Cube7628_1: THREE.Mesh
    Cube7628_2: THREE.Mesh
    Cube7628_3: THREE.Mesh
    Cube7628_4: THREE.Mesh
    Cube7623: THREE.Mesh
    Cube7623_1: THREE.Mesh
    character_skeleton_warrior_eyes_broken: THREE.Mesh
    Cube7629: THREE.Mesh
    Cube7629_1: THREE.Mesh
    Cube7629_2: THREE.Mesh
    Cube7629_3: THREE.Mesh
    Cube7629_4: THREE.Mesh
    Cube7629_5: THREE.Mesh
    character_skeleton_warrior_jaw_broken: THREE.Mesh
  }
  materials: {
    Stone: THREE.MeshStandardMaterial
    BrownDark: THREE.MeshStandardMaterial
    White: THREE.MeshStandardMaterial
    Black: THREE.MeshStandardMaterial
    Metal: THREE.MeshStandardMaterial
    GreenDark: THREE.MeshStandardMaterial
    Glow: THREE.MeshStandardMaterial
    Stone2: THREE.MeshStandardMaterial
    WoodDark: THREE.MeshStandardMaterial
  }
}

export default function skeletonWarriorBrokenParts({ nodes, materials }: GLTFResult) {
  return {
    body: <> 
      <mesh geometry={nodes.Cube7627.geometry} material={nodes.Cube7627.material} />
      <mesh geometry={nodes.Cube7627_1.geometry} material={nodes.Cube7627_1.material} />
      <mesh geometry={nodes.Cube7627_2.geometry} material={nodes.Cube7627_2.material} />
      <mesh geometry={nodes.Cube7627_3.geometry} material={nodes.Cube7627_3.material} />
      <mesh geometry={nodes.Cube7627_4.geometry} material={materials.Metal} />
      <mesh geometry={nodes.Cube7627_5.geometry} material={nodes.Cube7627_5.material} />
    </>,

    head: <>
      <mesh
        name="Cube7623"
        geometry={nodes.Cube7623.geometry}
        material={nodes.Cube7623.material}
        morphTargetDictionary={nodes.Cube7623.morphTargetDictionary}
        morphTargetInfluences={nodes.Cube7623.morphTargetInfluences}
      />
      <mesh
        name="Cube7623_1"
        geometry={nodes.Cube7623_1.geometry}
        material={nodes.Cube7623_1.material}
        morphTargetDictionary={nodes.Cube7623_1.morphTargetDictionary}
        morphTargetInfluences={nodes.Cube7623_1.morphTargetInfluences}
      />
      <mesh
        geometry={nodes.character_skeleton_warrior_eyes_broken.geometry}
        material={materials.Glow}
        position={[0, 0.42, 0.26]}
      />
      <group position={[0, 0.52, 0]}>
        <mesh geometry={nodes.Cube7629.geometry} material={nodes.Cube7629.material} />
        <mesh geometry={nodes.Cube7629_1.geometry} material={nodes.Cube7629_1.material} />
        <mesh geometry={nodes.Cube7629_2.geometry} material={nodes.Cube7629_2.material} />
        <mesh geometry={nodes.Cube7629_3.geometry} material={materials.Stone2} />
        <mesh geometry={nodes.Cube7629_4.geometry} material={materials.WoodDark} />
        <mesh geometry={nodes.Cube7629_5.geometry} material={nodes.Cube7629_5.material} />
      </group>
      <mesh
        geometry={nodes.character_skeleton_warrior_jaw_broken.geometry}
        material={nodes.character_skeleton_warrior_jaw_broken.material}
        position={[0, 0.13, 0.04]}
      />
    </>,

    armLeft: <>
      <mesh geometry={nodes.Cube7626.geometry} material={nodes.Cube7626.material} />
      <mesh geometry={nodes.Cube7626_1.geometry} material={nodes.Cube7626_1.material} />
      <mesh geometry={nodes.Cube7626_2.geometry} material={nodes.Cube7626_2.material} />
      <mesh geometry={nodes.Cube7626_3.geometry} material={nodes.Cube7626_3.material} />
    </>,

    armRight: <>
      <mesh geometry={nodes.Cube7628.geometry} material={nodes.Cube7628.material} />
      <mesh geometry={nodes.Cube7628_1.geometry} material={nodes.Cube7628_1.material} />
      <mesh geometry={nodes.Cube7628_2.geometry} material={nodes.Cube7628_2.material} />
      <mesh geometry={nodes.Cube7628_3.geometry} material={nodes.Cube7628_3.material} />
      <mesh geometry={nodes.Cube7628_4.geometry} material={nodes.Cube7628_4.material} />
    </>    
  }
}

////useGLTF.preload(require('../../../../../public/assets/kaykit/Models/characters/skeletons/character_skeleton_warrior_broken.gltf')
