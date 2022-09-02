import * as THREE from 'three'
import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import AnimatedCharacter, { ActionName } from '../gltfjsx/characters/AnimatedChar';

export default function Test(props: JSX.IntrinsicElements['group'] & { color: string }) {
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);
  const [anim, setAnim] = useState<ActionName>('Jump');
  return (
    <AnimatedCharacter {...props} anim={anim} onClick={() => setAnim('Dance')} />
  )
}