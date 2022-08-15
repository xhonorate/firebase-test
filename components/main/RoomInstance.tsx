import React, { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useRealtime } from "../realtimeDatabase/Hooks/useRealtime";
import { useEffect } from "react";
import { Button, Box } from "@chakra-ui/react";
import { Board, BoardProps, generateBoard } from "./Board";
import { MapControls, Stars, RandomizedLight } from '@react-three/drei';
import HostControl from "./HostControl";
import HUD from "./hud";
import { tileTypes } from "./three/Tile";
import { Bloom, DepthOfField, EffectComposer, Outline, Selection, SelectiveBloom } from "@react-three/postprocessing";

/* eslint-disable react-hooks/exhaustive-deps */

export interface ResourceStates {
  gold: number;
  wood: number;
  brick: number;
  ore: number;
  wheat: number;
  sheep: number;
}

export interface PlayerState {
  id: string;
  resources: ResourceStates;
}

export interface GameState {
  board: BoardProps;
  players: PlayerState[];
  turn: number;
}

export interface GameContextProps {
  data: GameState;
  set: (data: object) => any;
  update: (data: object) => any;
  paused: boolean;
}

export const GameContext = React.createContext<GameContextProps>({
  data: null,
  set: null,
  update: null,
  paused: false,
});

export default function Room({
  id,
  settings = { size: 6, spawnRates: [0, 1, 1, 1, 1, 1, 7] },
  playerIndex,
  participants,
}) {
  /// TODO: I would like this to act like swr
  // is this triggering full refresh on every change?
  // or is it like a ref and i can useEffect on specific child elements in the json??
  const { data, set, update, loading, unsubscribe } = useRealtime<GameState>(
    `rooms/${id}`
  );

  const [paused, setPaused] = useState(false);
  const [target, setTarget] = useState(null);

  useEffect(() => {
    // If no data is present, need to create new RTDB entry for room
    if (!data && !loading && playerIndex === 0) {
      set({
        board: generateBoard({
          numPlayers: participants.length,
          size: settings.size,
          spawnRates: settings.spawnRates, // spawn rates of different tiles
        }),
        players: participants.map((player) => {
          return {
            id: player.id,
            resources: tileTypes.reduce(
              (a, v) => (v.name === "Water" ? a : { ...a, [v.name]: 0 }),
              {}
            ),
          };
        }),
        turn: 0,
      });
      console.log("Initializing Room!");
    }
  }, [loading]);

  return (
    <GameContext.Provider value={{ data, set, update, paused }}>
      {playerIndex === 0 && (
        <>
          <Button
            onClick={() =>
              update({
                board: generateBoard({
                  numPlayers: participants.length,
                  size: settings.size,
                  spawnRates: settings.spawnRates,
                }),
              })
            }
          >
            Regenerate
          </Button>
          <Button onClick={() => setPaused(!paused)}>
            {paused ? "Unpause" : "Pause"}
          </Button>
          <HostControl />
        </>
      )}
      <Box w={"650px"} h={"650px"} border={"1px solid darkblue"} bg={'gray.800'} color={'gray.100'}>
        <HUD
          participants={participants}
          playerIndex={playerIndex}
          w={"650px"}
          h={"650px"}
          target={target}
        />
        <Box w={"full"} h={"full"}>
          <Canvas
            orthographic={true}
            camera={{
              fov: 100,
              near: -100,
              far: 1000,
              position: [0, 5, 10],
              zoom: 1
            }}
          >
            { /* due to some issues with react, we must use a second provider inside of the canvas to pass props down */ }
            <GameContext.Provider value={{ data, set, update, paused }}>
              <ambientLight intensity={0.3} />
              <pointLight position={[10,10,10]} />
              { /*
              <RandomizedLight castShadow mapSize={20} radius={20} intensity={0.7} amount={8} position={[0, 10, 0]} />
              */ }
              {!!data?.board && <Board {...data.board} onSelect={setTarget} />}
              {/* data?.count > 0 && [...Array(data?.count)].map((nan, idx) => {
                return <Box key={idx} position={[-2 + idx/2, 1, 0]} />
              }) */}
              {/* <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} /> */}
              <MapControls target={[0, 0, 0]} maxZoom={100} minZoom={5} />
            </GameContext.Provider>
            <EffectComposer autoClear={false}>
              <DepthOfField focusDistance={0.1} focalLength={0.05} bokehScale={2} height={500} />
              <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={500} />
            </EffectComposer>
          </Canvas>
        </Box>
      </Box>
    </GameContext.Provider>
  );
}
