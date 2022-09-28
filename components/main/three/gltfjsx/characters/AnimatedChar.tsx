/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useEffect, useMemo, useRef } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei/native'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import { GroupProps, useGraph } from '@react-three/fiber'
import { SkeletonUtils } from 'three-stdlib';
import { CharacterType } from './Parts/useParts';
import useParts from './Parts/useParts';

type GLTFResult = GLTF & {
  nodes: {
    PrototypePete: THREE.SkinnedMesh
    Body: THREE.Bone,
    Head: THREE.Bone,
    armLeft: THREE.Bone,
    armRight: THREE.Bone,
    handSlotLeft: THREE.Bone,
    handSlotRight: THREE.Bone,
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

interface Equipment {
  head?: JSX.Element,
  body?: JSX.Element,
  armLeft?: JSX.Element,
  armRight?: JSX.Element,
  handSlotLeft?: JSX.Element,
  handSlotRight?: JSX.Element
}

interface AnimatedProps extends GroupProps {
  character: CharacterType,
  equipment?: Equipment, //Optionally pass equiment, such as helmet, sword, etc. in respective parts slots
  anim: ActionName | null
}

export default function AnimatedCharacter({character, equipment, anim, ...props}: AnimatedProps) {
  const group = useRef<THREE.Group>()
  const action = useRef<ActionName>(null);

  const parts = useParts(character);

  const { scene, animations } = useGLTF(require('../../../../../public/assets/kaykit/Models/characters/AnimatedCharacter.gltf.glb')) as any as GLTFResult

  // Clone skeleton (https://codesandbox.io/s/react-three-fiber-wildlife-nrbnq?file=/src/Model.js)
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene])
  // TODO: try to clone just what is neccessary (not the whole skinned mesh)
  const { nodes: bones } = useGraph(clone)

  const { actions } = useAnimations<GLTFAction>(animations, group)
  
  useEffect(() => {
    if (!!anim && anim !== action.current) {
      if (action.current) {
        // TODO: Animation blending depending on which two are being interpolated 
        actions[action.current].crossFadeTo(actions[anim], 1, true).play();
      }
      actions[anim].play();
      action.current = anim;
    }
  }, [anim, actions]) 

  // Import Parts for character type, then place them within respective bone primatives
  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={bones.Body}>
        {parts.body}
        {equipment?.body}
        
        <primitive object={bones.Head}>
          {parts.head}
          {equipment?.head}
          {/* TODO: custom heads! just include <KnightHeadA /> here */}
        </primitive>

        <primitive object={bones.armLeft}>
          <group position={[0,0.1,-0.03]} rotation={[0, 3 * Math.PI / 2, 0.85 * Math.PI]}>
            {parts.armLeft}
            {equipment?.armLeft}
          </group>

          <primitive object={bones.handSlotLeft}>
            {equipment?.handSlotLeft}
          </primitive>
        </primitive>

        <primitive object={bones.armRight}>
          <group position={[0,0.1,0.03]} rotation={[0, 3 * Math.PI / 2, -0.85 * Math.PI]}>
            {parts.armRight}
            {equipment?.armRight}
          </group>
          
          <primitive object={bones.handSlotRight}>
            {equipment?.handSlotRight}
          </primitive>
        </primitive>
      </primitive>
    </group>
  )
}

////useGLTF.preload(require('../../../../../public/assets/kaykit/Models/characters/AnimatedCharacter.gltf.glb'))
