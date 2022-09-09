import React, { useCallback, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useRealtime } from "../realtimeDatabase/Hooks/useRealtime";
import { useEffect } from "react";
import { Button, Box, useEventListener } from "@chakra-ui/react";
import { Board, generateBoard, BoardState } from "./Board";
import { MapControls, Stars, RandomizedLight } from "@react-three/drei";
import HostControl from "./HostControl";
import HUD from "./hud";
import { resourceTypes } from "./three/Tiles/Resource";
import {
  Bloom,
  DepthOfField,
  EffectComposer,
} from "@react-three/postprocessing";
import { Participant } from "../cloudFirestore/GameLobby";
import { UnitData, Units } from "./Units";

export interface ResourceStates {
  wood: number;
  ore: number;
  food: number;
  gold: number;
}

export interface PlayerState {
  id: string;
  resources: ResourceStates;
  points: number;
}

export interface GameState {
  board: BoardState;
  units?: UnitData[];
  players: PlayerState[];
  turn: number;
  paused?: boolean;
  winner?: string;
}

export interface GameContextProps {
  data: GameState;
  set: (data: object) => any;
  update: (data: object) => any;
}

export type Target = { type: string; val: any };

export const GameContext = React.createContext<GameContextProps>({
  data: null,
  set: null,
  update: null,
});

export default function Room({
  id,
  settings,
  updateGame,
  playerIndex,
  participants,
}) {
  /// TODO: I would like this to act like swr
  // is this triggering full refresh on every change?
  // or is it like a ref and i can useEffect on specific child elements in the json??
  const { data, set, update, loading, unsubscribe, deleteReference } =
    useRealtime<GameState>(`rooms/${id}`);

  const [target, setTarget] = useState<Target>(null);

  // Deselect Tile on Escape key press
  // TODO: add pause menu
  useEventListener("keyup", (e: KeyboardEvent) => {
    if (["27", "Escape"].includes(String(e.key))) {
      setTarget(null);
    }
  });

  const togglePaused = useCallback(
    () => update({ paused: !(data?.paused ?? false) }),
    [data?.paused, update]
  );

  const intitializeGame = useCallback(() => {
    set({
      board: generateBoard(settings),
      players: participants.map((player: Participant) => {
        return {
          id: player.id,
          resources: resourceTypes.reduce(
            (a, v) => (v.name === "None" ? a : { ...a, [v.name]: 1 }),
            {}
          ),
          points: 1,
        };
      }),
      turn: 0,
    });
  }, [participants, set, settings]);

  const returnToLobby = useCallback(() => {
    try {
      updateGame({
        started: false,
      });
      unsubscribe();
      deleteReference(); //Delete game lobby -- force regeneration on next instance
    } catch (e) {
      console.warn(e);
    }
  }, [deleteReference, unsubscribe, updateGame]);

  useEffect(() => {
    // If no data is present, need to create new RTDB entry for room
    if (!data && !loading && playerIndex === 0) {
      intitializeGame();
      console.log("Initializing Room!");
    }
  }, [data, intitializeGame, loading, playerIndex]);

  return (
    <GameContext.Provider value={{ data, set, update }}>
      {playerIndex === 0 && (
        // Host only //
        <>
          <Button onClick={returnToLobby}>Back to Lobby</Button>
          <Button onClick={intitializeGame}>Restart</Button>
          <Button onClick={togglePaused}>
            {data?.paused ? "Unpause" : "Pause"}
          </Button>
          <HostControl {...settings} />
        </>
      )}
      <Box
        w={"650px"}
        h={"650px"}
        border={"1px solid darkblue"}
        bg={"gray.800"}
        color={"gray.100"}
      >
        <HUD
          w={"650px"}
          h={"650px"}
          participants={participants}
          playerIndex={playerIndex}
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
              zoom: 10,
            }}
          >
            {/* due to some issues with react, we must use a second provider inside of the canvas to pass props down */}
            <ambientLight intensity={0.3} />
            <pointLight position={[10, 10, 10]} />

            {/*
            <RandomizedLight castShadow mapSize={20} radius={20} intensity={0.7} amount={8} position={[0, 10, 0]} />
            */}
            <GameContext.Provider value={{ data, set, update }}>
              {!!data?.board && (
                <>
                  <Board {...data.board} onSelect={setTarget} />

                  {!!data?.units && (
                    <Units {...data.board} units={data.units} onSelect={setTarget} />
                  )}
                </>
              )}

              {/* data?.count > 0 && [...Array(data?.count)].map((nan, idx) => {
                return <Box key={idx} position={[-2 + idx/2, 1, 0]} />
              }) */}
            </GameContext.Provider>
            {/* <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} /> */}
            <MapControls target={[0, 0, 0]} maxZoom={100} minZoom={5} />
            {/* TODO: Effects settings -- save to user account */}
            <EffectComposer>
              <DepthOfField
                focusDistance={0.1}
                focalLength={0.12}
                bokehScale={4}
                height={500}
              />
              <Bloom
                luminanceThreshold={0}
                luminanceSmoothing={0.9}
                height={500}
              />
            </EffectComposer>
          </Canvas>
        </Box>
      </Box>
    </GameContext.Provider>
  );
}
