import * as THREE from 'three'
import React, { useRef, useState } from 'react'
import { GroupProps } from '@react-three/fiber'
import AnimatedCharacter, { ActionName } from '../gltfjsx/characters/AnimatedChar';
import AnimatedPrototype from '../gltfjsx/characters/AnimatedPrototype';
import useParts from '../gltfjsx/characters/Parts/useParts';
import { CharacterType } from '../gltfjsx/characters/Parts/useParts';

interface TestProps extends GroupProps {
  character: CharacterType,
  anim: ActionName
}

export default function Test({character, anim, ...props}: TestProps) {
  return (
    <>
      <AnimatedPrototype {...props} position={[2,0,0]} anim={anim} />
    </>
  )
}