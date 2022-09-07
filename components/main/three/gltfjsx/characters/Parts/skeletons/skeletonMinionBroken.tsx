/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cube7644: THREE.Mesh
    Cube7644_1: THREE.Mesh
    Cube7644_2: THREE.Mesh
    Cube7644_3: THREE.Mesh
    Cube7644_4: THREE.Mesh
    Cube7645: THREE.Mesh
    Cube7645_1: THREE.Mesh
    Cube7645_2: THREE.Mesh
    Cube7645_3: THREE.Mesh
    Cube7643: THREE.Mesh
    Cube7643_1: THREE.Mesh
    Cube7646: THREE.Mesh
    Cube7646_1: THREE.Mesh
    Cube7646_2: THREE.Mesh
    Cube7646_3: THREE.Mesh
    Cube7646_4: THREE.Mesh
    Cube7646_5: THREE.Mesh
    Cube7646_6: THREE.Mesh
    character_skeleton_minion_eyes_broken: THREE.Mesh
    character_skeleton_minion_jaw_broken: THREE.Mesh
  }
  materials: {
    BrownDark: THREE.MeshStandardMaterial
    White: THREE.MeshStandardMaterial
    Black: THREE.MeshStandardMaterial
    Metal: THREE.MeshStandardMaterial
    GreenDark: THREE.MeshStandardMaterial
    WoodDark: THREE.MeshStandardMaterial
    Stone2: THREE.MeshStandardMaterial
    Glow: THREE.MeshStandardMaterial
  }
}

export default function skeletonMinionBrokenParts({ nodes, materials }: GLTFResult) {
  return {
    body: <>
      <mesh geometry={nodes.Cube7644.geometry} material={nodes.Cube7644.material} />
      <mesh geometry={nodes.Cube7644_1.geometry} material={nodes.Cube7644_1.material} />
      <mesh geometry={nodes.Cube7644_2.geometry} material={nodes.Cube7644_2.material} />
      <mesh geometry={nodes.Cube7644_3.geometry} material={materials.Metal} />
      <mesh geometry={nodes.Cube7644_4.geometry} material={nodes.Cube7644_4.material} />
    </>,

    head: <>
      <mesh
        name="Cube7646"
        geometry={nodes.Cube7646.geometry}
        material={nodes.Cube7646.material}
        morphTargetDictionary={nodes.Cube7646.morphTargetDictionary}
        morphTargetInfluences={nodes.Cube7646.morphTargetInfluences}
      />
      <mesh
        name="Cube7646_1"
        geometry={nodes.Cube7646_1.geometry}
        material={nodes.Cube7646_1.material}
        morphTargetDictionary={nodes.Cube7646_1.morphTargetDictionary}
        morphTargetInfluences={nodes.Cube7646_1.morphTargetInfluences}
      />
      <mesh
        name="Cube7646_2"
        geometry={nodes.Cube7646_2.geometry}
        material={nodes.Cube7646_2.material}
        morphTargetDictionary={nodes.Cube7646_2.morphTargetDictionary}
        morphTargetInfluences={nodes.Cube7646_2.morphTargetInfluences}
      />
      <mesh
        name="Cube7646_3"
        geometry={nodes.Cube7646_3.geometry}
        material={materials.WoodDark}
        morphTargetDictionary={nodes.Cube7646_3.morphTargetDictionary}
        morphTargetInfluences={nodes.Cube7646_3.morphTargetInfluences}
      />
      <mesh
        name="Cube7646_4"
        geometry={nodes.Cube7646_4.geometry}
        material={materials.Stone2}
        morphTargetDictionary={nodes.Cube7646_4.morphTargetDictionary}
        morphTargetInfluences={nodes.Cube7646_4.morphTargetInfluences}
      />
      <mesh
        name="Cube7646_5"
        geometry={nodes.Cube7646_5.geometry}
        material={nodes.Cube7646_5.material}
        morphTargetDictionary={nodes.Cube7646_5.morphTargetDictionary}
        morphTargetInfluences={nodes.Cube7646_5.morphTargetInfluences}
      />
      <mesh
        name="Cube7646_6"
        geometry={nodes.Cube7646_6.geometry}
        material={nodes.Cube7646_6.material}
        morphTargetDictionary={nodes.Cube7646_6.morphTargetDictionary}
        morphTargetInfluences={nodes.Cube7646_6.morphTargetInfluences}
      />
      <mesh
        geometry={nodes.character_skeleton_minion_eyes_broken.geometry}
        material={materials.Glow}
        position={[0, 0.42, 0.26]}
      />
      <mesh
        geometry={nodes.character_skeleton_minion_jaw_broken.geometry}
        material={nodes.character_skeleton_minion_jaw_broken.material}
        position={[0, 0.13, 0.04]}
      />
    </>,

    armLeft: <>
      <mesh geometry={nodes.Cube7645.geometry} material={nodes.Cube7645.material} />
      <mesh geometry={nodes.Cube7645_1.geometry} material={nodes.Cube7645_1.material} />
      <mesh geometry={nodes.Cube7645_2.geometry} material={nodes.Cube7645_2.material} />
      <mesh geometry={nodes.Cube7645_3.geometry} material={nodes.Cube7645_3.material} />
    </>,

    armRight: <>
      <mesh geometry={nodes.Cube7643.geometry} material={nodes.Cube7643.material} />
      <mesh geometry={nodes.Cube7643_1.geometry} material={nodes.Cube7643_1.material} />
    </>    
  }
}

useGLTF.preload('/assets/kaykit/Models/characters/skeletons/character_skeleton_minion_broken.gltf')
