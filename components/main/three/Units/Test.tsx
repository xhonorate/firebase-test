import React from 'react'
import { GroupProps } from '@react-three/fiber'
import { ActionName } from '../gltfjsx/characters/AnimatedChar';
import AnimatedPrototype from '../gltfjsx/characters/AnimatedPrototype';
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