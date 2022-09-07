/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cube7712: THREE.Mesh
    Cube7712_1: THREE.Mesh
    eyes_broken: THREE.Mesh
    jaw_broken: THREE.Mesh
  }
  materials: {
    White: THREE.MeshStandardMaterial
    Black: THREE.MeshStandardMaterial
    Glow: THREE.MeshStandardMaterial
  }
}

export default function SkullBroken(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/skull_broken.glb') as unknown as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh
        name="Cube7712"
        geometry={nodes.Cube7712.geometry}
        material={nodes.Cube7712.material}
        morphTargetDictionary={nodes.Cube7712.morphTargetDictionary}
        morphTargetInfluences={nodes.Cube7712.morphTargetInfluences}
      />
      <mesh
        name="Cube7712_1"
        geometry={nodes.Cube7712_1.geometry}
        material={materials.Black}
        morphTargetDictionary={nodes.Cube7712_1.morphTargetDictionary}
        morphTargetInfluences={nodes.Cube7712_1.morphTargetInfluences}
      />
      <mesh geometry={nodes.eyes_broken.geometry} material={materials.Glow} position={[0, 0.42, 0.26]} />
      <mesh geometry={nodes.jaw_broken.geometry} material={nodes.jaw_broken.material} position={[0, 0.13, 0.04]} />
    </group>
  )
}

useGLTF.preload('/skull_broken.glb')
