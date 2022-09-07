/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useEffect, useMemo, useRef } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import { GroupProps, useGraph } from '@react-three/fiber'
import { SkeletonUtils } from 'three-stdlib';

type GLTFResult = GLTF & {
  nodes: {
    PrototypePete: THREE.SkinnedMesh
    Body: THREE.Bone
  }
  materials: {
    PrototypePete: THREE.MeshStandardMaterial
  }
  animations: GLTFAction[];
}

export type ActionName =
  | 'Attack(1h)'
  | 'AttackCombo'
  | 'AttackSpinning'
  | 'BasePose'
  | 'Block'
  | 'Cheer'
  | 'Climbing'
  | 'Dance'
  | 'DashBack'
  | 'DashFront'
  | 'DashLeft'
  | 'DashRight'
  | 'Defeat'
  | 'HeavyAttack'
  | 'Hop'
  | 'Idle'
  | 'Interact'
  | 'Jump'
  | 'LayingDownIdle'
  | 'PickUp'
  | 'Roll'
  | 'Run'
  | 'Shoot(1h)'
  | 'Shoot(2h)'
  | 'Shoot(2h)Bow'
  | 'Shooting(1h)'
  | 'Shooting(2h)'
  | 'Throw'
  | 'Walk'
  | 'Wave'
  
interface GLTFAction extends THREE.AnimationClip {
  name: ActionName;
}

interface AnimatedProps extends GroupProps {
  anim: ActionName | null
}

export default function AnimatedPrototype({anim, ...props}: AnimatedProps) {
  const group = useRef<THREE.Group>()
  const action = useRef<ActionName>(null);

  const { scene, materials, animations } = useGLTF('/assets/kaykit/Models/characters/AnimatedCharacter.gltf.glb') as any
  // TODO: Maybe need to clone skeleton (https://codesandbox.io/s/react-three-fiber-wildlife-nrbnq?file=/src/Model.js)
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes }: { nodes: any } = useGraph(clone)

  const { actions } = useAnimations<GLTFAction>(animations, group)

  useEffect(() => {
    if (!!anim) {
      if (action.current) {
        actions[action.current].stop();
      } 
      actions[anim].play();
      action.current = anim;
    }
  }, [anim, actions]) 

  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={nodes.Body} />
      <skinnedMesh geometry={nodes.PrototypePete.geometry} material={materials.PrototypePete} skeleton={nodes.PrototypePete.skeleton} />
    </group>
  )
}

useGLTF.preload('/assets/kaykit/Models/characters/AnimatedCharacter.gltf.glb')
