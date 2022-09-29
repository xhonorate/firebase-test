import { MapControls, OrthographicCamera } from "@react-three/drei/native";
import { Canvas } from "@react-three/fiber/native";
import React, { Suspense } from "react";
import { THREE } from "expo-three";
import { PresentationControls } from "@react-three/drei";

// Wrapper for canvas, passes context to children inside of canvas
export default function SceneWrapper({ children }) {
  global.THREE = global.THREE || THREE;
  // bridge any number of contexts
  // Note: These contexts must be provided by something above this SceneWrapper component
  //       You cannot render the providers for these contexts inside this component

  return (
    <Canvas>
      <OrthographicCamera makeDefault near={-100} far={1000} position={[0, 5, 10]} zoom={10}>
        {/* due to some issues with react, we must use a second provider inside of the canvas to pass props down */}
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} />

        <Suspense fallback={null}>
          {/*Environment here... */}
          <PresentationControls
            global={false} // Spin globally or by dragging the model
            cursor={true} // Whether to toggle cursor style on drag
            snap={false} // Snap-back to center (can also be a spring config)
            speed={1} // Speed factor
            zoom={1} // Zoom factor when half the polar-max is reached
            rotation={[Math.PI / 6, 0, 0]} // Default rotation
            polar={[0, Math.PI / 2]} // Vertical limits
            azimuth={[-Infinity, Infinity]} // Horizontal limits
            config={{ mass: 1, tension: 170, friction: 26 }}
          >
            {children}
          </PresentationControls>
        </Suspense>
        {/* <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} /> */}
        {/* <AdaptiveEvents /> */}
        {/* <DeviceOrientationControls /> */}
        {/* <MapControls target={[0, 0, 0]} maxZoom={100} minZoom={5} /> */}
      </OrthographicCamera>
    </Canvas>
  );
}
