import { Box } from '@chakra-ui/react';
import { MapControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Bloom, DepthOfField, EffectComposer } from '@react-three/postprocessing';
import React from 'react';
import Test from '../components/main/three/Units/Test';

export default function Dev() {
  return <Box border={'2px solid blue'} w={'100px'} h={'100px'}>
    <Box w={"full"} h={"full"}>
          <Canvas
            orthographic={true}
            camera={{
              fov: 100,
              near: -100,
              far: 1000,
              position: [0, 5, 10],
              zoom: 10
            }}
          >
            { /* due to some issues with react, we must use a second provider inside of the canvas to pass props down */ }
            <ambientLight intensity={0.3} />
            <pointLight position={[10,10,10]} />

            <Test scale={2} color={null} />

            { /*
            <RandomizedLight castShadow mapSize={20} radius={20} intensity={0.7} amount={8} position={[0, 10, 0]} />
            */ }
            {/* <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} /> */}
            <MapControls target={[0, 0, 0]} maxZoom={100} minZoom={5} />

            { /* <EffectComposer>
              <DepthOfField focusDistance={0.1} focalLength={0.12} bokehScale={4} height={500} />
              <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={500} />
            </EffectComposer> */ }
          </Canvas>
        </Box>


  </Box>
}