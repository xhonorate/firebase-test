/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    PrototypePete_body: THREE.Mesh
    PrototypePete_armLeft: THREE.Mesh
    PrototypePete_armRight: THREE.Mesh
    PrototypePete_head: THREE.Mesh
  }
  materials: {
    PrototypePete: THREE.MeshStandardMaterial
  }
}

export default function prototypePeteParts({ nodes, materials }: GLTFResult) {
  return {
    body: <mesh name={'Body'} geometry={nodes.PrototypePete_body.geometry} material={nodes.PrototypePete_body.material} />,
    
    head: <mesh
      name={'Head'}
      geometry={nodes.PrototypePete_head.geometry}
      material={nodes.PrototypePete_head.material}
    />,

    armLeft: <mesh
      name={'armLeft'}
      geometry={nodes.PrototypePete_armLeft.geometry}
      material={nodes.PrototypePete_armLeft.material}
    />,

    armRight: <mesh
      name={'armRight'}
      geometry={nodes.PrototypePete_armRight.geometry}
      material={nodes.PrototypePete_armRight.material}
    />
  }
}

useGLTF.preload('/assets/kaykit/Models/characters/PrototypePete.gltf')
