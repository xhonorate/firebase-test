import { Box, Select } from "@chakra-ui/react";
import { MapControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import {
  Bloom,
  DepthOfField,
  EffectComposer,
} from "@react-three/postprocessing";
import React, { useState } from "react";
import { ActionName } from "../components/main/three/gltfjsx/characters/AnimatedPrototype";
import {
  CharacterType,
  characterParts,
} from "../components/main/three/gltfjsx/characters/Parts/useParts";
import AnimatedCharacter from "../components/main/three/gltfjsx/characters/AnimatedChar";
import AnimatedPrototype from "../components/main/three/gltfjsx/characters/AnimatedPrototype";
import SwordCommon from "../components/main/three/gltfjsx/items/sword_common";

export default function Dev() {
  const [char, setChar] = useState<CharacterType>(null);
  const [anim, setAnim] = useState<ActionName>("Idle");

  return (
    <Box border={"2px solid blue"} w={"200px"} h={"200px"}>
      <Select
        value={anim}
        onChange={(e) => setAnim(e.target.value as ActionName)}
      >
        {[
          "Attack(1h)",
          "AttackCombo",
          "AttackSpinning",
          "BasePose",
          "Block",
          "Cheer",
          "Climbing",
          "Dance",
          "DashBack",
          "DashFront",
          "DashLeft",
          "DashRight",
          "Defeat",
          "HeavyAttack",
          "Hop",
          "Idle",
          "Interact",
          "Jump",
          "LayingDownIdle",
          "PickUp",
          "Roll",
          "Run",
          "Shoot(1h)",
          "Shoot(2h)",
          "Shoot(2h)Bow",
          "Shooting(1h)",
          "Shooting(2h)",
          "Throw",
          "Walk",
          "Wave",
        ].map((val) => (
          <option key={val} value={val}>
            {val}
          </option>
        ))}
      </Select>
      <Select
        value={char ?? "default"}
        onChange={(e) => setChar(e.target.value as CharacterType)}
      >
        {Object.keys(characterParts).map((val) => (
          <option key={val} value={val}>
            {val}
          </option>
        ))}
      </Select>
      <Box w={"full"} h={"full"}>
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

          <AnimatedCharacter
            scale={2}
            character={char}
            equipment={{
              handSlotRight: <SwordCommon />
            }}
            position={[-2, 0, 0]}
            anim={anim}
          />
          <AnimatedPrototype scale={2} position={[2, 0, 0]} anim={anim} />

          {/*
            <RandomizedLight castShadow mapSize={20} radius={20} intensity={0.7} amount={8} position={[0, 10, 0]} />
            */}
          {/* <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} /> */}
          <MapControls target={[0, 0, 0]} maxZoom={100} minZoom={5} />

          {/* <EffectComposer>
              <DepthOfField focusDistance={0.1} focalLength={0.12} bokehScale={4} height={500} />
              <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={500} />
            </EffectComposer> */}
        </Canvas>
      </Box>
    </Box>
  );
}
