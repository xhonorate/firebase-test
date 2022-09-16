import React, { Ref, useCallback, useMemo, useRef, useState } from "react";
import { useRealtime } from "../realtimeDatabase/Hooks/useRealtime";
import { useEffect } from "react";
import { Button, Box, useEventListener } from "@chakra-ui/react";
import Board, { generateBoard, BoardState } from "./Board";
import HostControl from "./HostControl";
import HUD from "./hud";
import { resourceTypes } from "./three/Tiles/Resource";
import { Participant } from "../cloudFirestore/GameLobby";
import { UnitData, Units } from "./Units";
import useHax from "./helpers/useHax";
import SceneWrapper from "./three/SceneWrapper";
import TargetWrapper from './MouseEvents';
import { TileData } from './three/Tiles/Tile';

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
  units?: { [uid: string]: UnitData};
  players: PlayerState[];
  turn: number;
  paused?: boolean;
  winner?: string;
}

export interface GameContextProps {
  data: GameState;
  set: (data: object) => any;
  update: (data: object) => any;
  playerIndex: number;
}

export const GameContext = React.createContext<GameContextProps>({
  data: null,
  set: null,
  update: null,
  playerIndex: null,
});

type StaticTileData = Partial<TileData> & { ref: any }
export const TilesContext = React.createContext<StaticTileData[]>(null);

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

  // Konami code
  //useHax('arrowuparrowdownarrowuparrowdownarrowleftarrowrightarrowleftarrowrightba', () => console.log("AYYY"));
  // TODO: remove hax...
  const [visible, setVisible] = useState(true);

  useHax([
    [
      "gimmegold",
      () => update({ ["/players/" + playerIndex + "/resources/Gold"]: 9999 }),
    ],
    [
      "h",
      () => setVisible(false)
    ],
    [
      "s",
      () => setVisible(true)
    ],
  ]);

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

  // Pieces of tile data that do not change, pass down through context to prevent need to listen to all data
  const [staticTiles, setStaticTiles] = useState<StaticTileData[]>(null);
  const boardRef = useRef(null);

  useEffect(() => {
    // If no data is present, need to create new RTDB entry for room
    if (!data && !loading && playerIndex === 0) {
      intitializeGame();
      console.log("Initializing Room!");
    }

    // If data was updated, disect into seperate providers
    if (data) {
      // Only set once if not yet set
      if (!staticTiles && boardRef.current) {
        setStaticTiles(data.board.tiles.map((tile: TileData, idx: number) => {
          return {
            index: idx,
            hex: tile.hex,
            height: tile.height,
            biome: tile.biome,
            adjIdxs: tile.adjIdxs, // Expensive, so only calculate here
            ref: boardRef.current.children[idx],
          }
        }));
      }

    }
  }, [data, intitializeGame, loading, playerIndex, staticTiles]);

  return (
    <GameContext.Provider value={{ data, set, update, playerIndex }}>
      <TilesContext.Provider value={staticTiles}>
        {playerIndex === 0 && visible && (
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
          visibility={visible ? 'visible' : 'hidden'}
          border={"1px solid darkblue"}
          bg={"gray.800"}
          color={"gray.100"}
        >      
          <TargetWrapper>
            <HUD
              w={"650px"}
              h={"650px"}
              participants={participants}
            />
            <Box w={"full"} h={"full"}>
              <SceneWrapper>
                <Board ref={boardRef} tiles={data?.board?.tiles} />
                <Units />
              </SceneWrapper>
            </Box>
          </TargetWrapper>
        </Box>
      </TilesContext.Provider>
    </GameContext.Provider>
  );
}
