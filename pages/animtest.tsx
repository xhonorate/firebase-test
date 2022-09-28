import { Div, Select, Button, Text, SelectRef } from "react-native-magnus";import { Bloom, DepthOfField, EffectComposer } from "@react-three/postprocessing";
import React, { useRef, useState } from "react";
import { ActionName } from "../components/main/three/gltfjsx/characters/AnimatedPrototype";
import {
  CharacterType,
  characterParts,
} from "../components/main/three/gltfjsx/characters/Parts/useParts";
import AnimatedCharacter from "../components/main/three/gltfjsx/characters/AnimatedChar";
import AnimatedPrototype from "../components/main/three/gltfjsx/characters/AnimatedPrototype";
import SwordCommon from "../components/main/three/gltfjsx/items/sword_common";
import SceneWrapper from '../components/main/three/SceneWrapper';

export default function AnimTest() {
  const animSelectRef = useRef<SelectRef>();
  const charSelectRef = useRef<SelectRef>();
  const [char, setChar] = useState<CharacterType>(null);
  const [anim, setAnim] = useState<ActionName>("Idle");

  return (
    <Div borderWidth={2} borderColor={"blue500"} w={"100%"} h={"100%"}>
      <Button
        w={"100%"}
        borderWidth={1}
        bg="white"
        color="gray900"
        borderColor="gray300"
        onPress={() => {
          if (animSelectRef.current) {
            animSelectRef.current.open();
          }
        }}
      >
        <Text>{"Animation: " + anim}</Text>
      </Button>

      <Select
        onSelect={(val) => setAnim(val)}
        ref={animSelectRef}
        value={anim}
        multiple={false}
        title={"Select Animation"}
        mt="md"
        pb="2xl"
        roundedTop="xl"
        data={[
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
        ]}
        renderItem={(item, index) => (
          <Select.Option value={item} py="md" px={"lg"}>
            <Text>{item}</Text>
          </Select.Option>
        )}
      />

      <Button
        w={"100%"}
        borderWidth={1}
        bg="white"
        color="gray900"
        borderColor="gray300"
        onPress={() => {
          if (animSelectRef.current) {
            animSelectRef.current.open();
          }
        }}
      >
        <Text>{"Character: " + (char ?? "default")}</Text>
      </Button>

      <Select
        onSelect={(val) => setChar(val)}
        ref={charSelectRef}
        value={char ?? "default"}
        multiple={false}
        title={"Select Character"}
        mt="md"
        pb="2xl"
        roundedTop="xl"
        data={Object.keys(characterParts)}
        renderItem={(item, index) => (
          <Select.Option value={item} py="md" px={"lg"}>
            <Text>{item}</Text>
          </Select.Option>
        )}
      />

      <Div w={"100%"} h={"100%"}>
        <SceneWrapper>
          <AnimatedCharacter
            scale={2}
            character={char}
            equipment={{
              handSlotRight: <SwordCommon />,
            }}
            position={[-2, 0, 0]}
            anim={anim}
          />
          {/* <AnimatedPrototype scale={2} position={[2, 0, 0]} anim={anim} /> */}
        </SceneWrapper>
      </Div>
    </Div>
  );
}
