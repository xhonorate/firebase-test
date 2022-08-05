import React, { useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { useRealtime } from '../realtimeDatabase/Hooks/useRealtime';
import { useEffect } from 'react';
import { Button, Box } from '@chakra-ui/react';
import { Board, BoardProps, generateBoard } from './Board';
import { MapControls, Stars } from '@react-three/drei';
import HostControl from './HostControl';
import HUD from './hud';
import { tileTypes } from './three/Tile';

/* eslint-disable react-hooks/exhaustive-deps */

export interface ResourceStates {
  gold: number,
  wood: number,
  brick: number,
  ore: number,
  wheat: number,
  sheep: number
}

export interface PlayerState {
  resources: ResourceStates
}

export interface GameState {
  board: BoardProps,
  players: PlayerState[],
  turn: number,
}

export interface GameContextProps {
  data: GameState,
  set: (data: object) => any,
  update: (data: object) => any,
  paused: boolean
}

export const GameContext = React.createContext<GameContextProps>({
  data: null,
  set: null,
  update: null,
  paused: false
});

export default function Room({id, settings={size: 6}, playerIndex, participants}) {
  /// TODO: I would like this to act like swr
  // is this triggering full refresh on every change? 
  // or is it like a ref and i can useEffect on specific child elements in the json??
  const {data, set, update, loading, unsubscribe} = useRealtime<GameState>(`rooms/${id}`);

  const [paused, setPaused] = useState(false);
  const [target, setTarget] = useState(null);

  useEffect(() => {
    // If no data is present, need to create new RTDB entry for room
    if (!data && !loading && playerIndex === 0) {
      set({
        board: generateBoard({numPlayers: participants.length, size: settings.size, seed: ''}),
        players: participants.map((player) => { 
          return {
            id: player.id,
            resources: tileTypes.reduce((a, v) => ({ ...a, [v.name]: 0}), {})
          }
        }),
        turn: 0,
      });
      console.log('Initializing Room!');
    } 
  }, [loading])

  return (
    <GameContext.Provider value={{data, set, update, paused}}>
      { playerIndex === 0 && <>
        <Button onClick={() => update({ board: generateBoard({numPlayers: participants.length, size: settings.size, seed: ''})})}>Regenerate</Button>
        <Button onClick={() => setPaused(!paused)}>{paused ? 'Unpause' : 'Pause'}</Button>
        <HostControl />
      </> }
      <Box w={'500px'} h={'500px'} border={'1px solid darkblue'}>
        <HUD playerIndex={playerIndex} w={'500px'} h={'500px'} target={target} />
        <Canvas orthographic={true} camera={{fov: 100, near: 0.1, far: 1000, position: [0, 5, 10], zoom: 100}}>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          { !!data?.board && <Board {...data.board} onSelect={setTarget} /> }
          { /* data?.count > 0 && [...Array(data?.count)].map((nan, idx) => {
            return <Box key={idx} position={[-2 + idx/2, 1, 0]} />
          }) */ }
          { /* <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} /> */ }
          <MapControls target={[-18,0,0]} maxZoom={100} minZoom={5} />
        </Canvas>
      </Box>
    </GameContext.Provider>
  )
}