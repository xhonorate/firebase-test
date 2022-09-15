import { MapControls, useContextBridge } from "@react-three/drei"
import { GameContext, TilesContext } from '../RoomInstance';
import { Canvas } from '@react-three/fiber';
import React from "react";
import { TargetContext } from '../MouseEvents';
import FX from "./FX/FX";

// Wrapper for canvas, passes context to children inside of canvas
export default function SceneWrapper({children}) {
  // bridge any number of contexts
  // Note: These contexts must be provided by something above this SceneWrapper component
  //       You cannot render the providers for these contexts inside this component
  const ContextBridge = useContextBridge(GameContext, TargetContext, TilesContext);
  return (
    <Canvas
      orthographic={true}
      camera={{
        fov: 100,
        near: -100,
        far: 1000,
        position: [0, 5, 10],
        zoom: 10,
      }}
    >
      {/* due to some issues with react, we must use a second provider inside of the canvas to pass props down */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} />
        <ContextBridge>
          {children}

          { /* FX MUST BE INSIDE OF TARGET SELECTION TO CONSUME CONTEXT */ }
          <FX />
          {/* TODO: Effects settings -- save to user account */}
        </ContextBridge>


      {/* <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} /> */}
      <MapControls target={[0, 0, 0]} maxZoom={100} minZoom={5} />
    </Canvas>
  )
}