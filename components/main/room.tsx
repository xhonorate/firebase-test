import React from 'react'
import { Canvas } from '@react-three/fiber'
import Box from './three/Box';
import { useRealtime } from '../realtimeDatabase/Hooks/useRealtime';

export default function Room({id}) {
  const {data, set, unsubscribe} = useRealtime(`rooms/${id}`);

  return (
    <Canvas orthographic={false} camera={{fov: 100, near: 0.1, far: 1000, position: [0, 0, 5]}}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />
    </Canvas>
  )
}