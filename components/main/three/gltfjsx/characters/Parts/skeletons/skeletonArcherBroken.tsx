/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cube7669: THREE.Mesh
    Cube7669_1: THREE.Mesh
    Cube7669_2: THREE.Mesh
    Cube7669_3: THREE.Mesh
    Cube7669_4: THREE.Mesh
    Cube7669_5: THREE.Mesh
    Cube7669_6: THREE.Mesh
    Cube7669_7: THREE.Mesh
    Cube7669_8: THREE.Mesh
    Cube7670: THREE.Mesh
    Cube7670_1: THREE.Mesh
    Cube7670_2: THREE.Mesh
    Cube7670_3: THREE.Mesh
    Cube7671: THREE.Mesh
    Cube7671_1: THREE.Mesh
    Cube7671_2: THREE.Mesh
    Cube7671_3: THREE.Mesh
    Cube7666: THREE.Mesh
    Cube7666_1: THREE.Mesh
    character_skeleton_archer_eyes_broken: THREE.Mesh
    Cube7664: THREE.Mesh
    Cube7664_1: THREE.Mesh
    Cube7664_2: THREE.Mesh
    character_skeleton_archer_jaw_broken: THREE.Mesh
    character_skeleton_archer_mask_broken: THREE.Mesh
  }
  materials: {
    Stone: THREE.MeshStandardMaterial
    BrownDark: THREE.MeshStandardMaterial
    Metal: THREE.MeshStandardMaterial
    PurpleDark: THREE.MeshStandardMaterial
    WoodDark: THREE.MeshStandardMaterial
    Stone2: THREE.MeshStandardMaterial
    GreenDark: THREE.MeshStandardMaterial
    White: THREE.MeshStandardMaterial
    Black: THREE.MeshStandardMaterial
    Glow: THREE.MeshStandardMaterial
  }
}

export default function skeletonArcherBrokenParts({ nodes, materials }: GLTFResult) {
  return {
    body: <>
      <mesh geometry={nodes.Cube7669.geometry} material={nodes.Cube7669.material} />
      <mesh geometry={nodes.Cube7669_1.geometry} material={nodes.Cube7669_1.material} />
      <mesh geometry={nodes.Cube7669_2.geometry} material={nodes.Cube7669_2.material} />
      <mesh geometry={nodes.Cube7669_3.geometry} material={nodes.Cube7669_3.material} />
      <mesh geometry={nodes.Cube7669_4.geometry} material={materials.Metal} />
      <mesh geometry={nodes.Cube7669_5.geometry} material={nodes.Cube7669_5.material} />
      <mesh geometry={nodes.Cube7669_6.geometry} material={materials.WoodDark} />
      <mesh geometry={nodes.Cube7669_7.geometry} material={materials.Stone2} />
      <mesh geometry={nodes.Cube7669_8.geometry} material={nodes.Cube7669_8.material} />
    </>,

    head: <>
      <mesh
        name="Cube7666"
        geometry={nodes.Cube7666.geometry}
        material={nodes.Cube7666.material}
        morphTargetDictionary={nodes.Cube7666.morphTargetDictionary}
        morphTargetInfluences={nodes.Cube7666.morphTargetInfluences}
      />
      <mesh
        name="Cube7666_1"
        geometry={nodes.Cube7666_1.geometry}
        material={nodes.Cube7666_1.material}
        morphTargetDictionary={nodes.Cube7666_1.morphTargetDictionary}
        morphTargetInfluences={nodes.Cube7666_1.morphTargetInfluences}
      />
      <mesh
        geometry={nodes.character_skeleton_archer_eyes_broken.geometry}
        material={materials.Glow}
        position={[0, 0.42, 0.26]}
      />
      <mesh geometry={nodes.Cube7664.geometry} material={nodes.Cube7664.material} />
      <mesh geometry={nodes.Cube7664_1.geometry} material={nodes.Cube7664_1.material} />
      <mesh geometry={nodes.Cube7664_2.geometry} material={nodes.Cube7664_2.material} />
      <mesh
        geometry={nodes.character_skeleton_archer_jaw_broken.geometry}
        material={nodes.character_skeleton_archer_jaw_broken.material}
        position={[0, 0.13, 0.04]}
      />
      <mesh
        geometry={nodes.character_skeleton_archer_mask_broken.geometry}
        material={nodes.character_skeleton_archer_mask_broken.material}
      />
    </>,

    armLeft: <>
      <mesh geometry={nodes.Cube7670.geometry} material={nodes.Cube7670.material} />
      <mesh geometry={nodes.Cube7670_1.geometry} material={nodes.Cube7670_1.material} />
      <mesh geometry={nodes.Cube7670_2.geometry} material={nodes.Cube7670_2.material} />
      <mesh geometry={nodes.Cube7670_3.geometry} material={nodes.Cube7670_3.material} />
    </>,

    armRight: <>
      <mesh geometry={nodes.Cube7671.geometry} material={nodes.Cube7671.material} />
      <mesh geometry={nodes.Cube7671_1.geometry} material={nodes.Cube7671_1.material} />
      <mesh geometry={nodes.Cube7671_2.geometry} material={nodes.Cube7671_2.material} />
      <mesh geometry={nodes.Cube7671_3.geometry} material={nodes.Cube7671_3.material} />
    </>    
  }
}

////useGLTF.preload(require('../../../../../public/assets/kaykit/Models/characters/skeletons/character_skeleton_archer_broken.gltf')
