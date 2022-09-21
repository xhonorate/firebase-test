import React, {
  Ref,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button, Box } from "@chakra-ui/react";
import Board, { BoardState } from "./Board";
import HostControl from "./HostControl";
import HUD from "./hud";
import { LobbyContext } from "../cloudFirestore/GameLobby";
import { UnitData, Units } from "./Units";
import useHax from "./helpers/useHax";
import SceneWrapper from "./three/SceneWrapper";
import { deleteRoom, intitializeRoom, updateRoom } from "../realtimeDatabase/roomFunctions";
import FX from "./three/FX/FX";
import { useTargetWrapper } from './MouseEvents';
import HoverGrid from './three/UI/HoverGrid';

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
  units?: { [uid: string]: UnitData };
  players: PlayerState[];
  turn: number;
  paused?: boolean;
  winner?: string;
}

/*
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

type StaticTileData = Partial<TileData> & { ref: any };
export const TilesContext = React.createContext<StaticTileData[]>(null);
*/

export default function Room() {
  const { id, settings, participants, playerIndex, paused, updateGame } =
    useContext(LobbyContext);

  // Konami code
  //useHax('arrowuparrowdownarrowuparrowdownarrowleftarrowrightarrowleftarrowrightba', () => console.log("AYYY"));
  // TODO: remove hax...
  const [visible, setVisible] = useState(true);
  
  const { target, hovered, TargetWrapper } = useTargetWrapper(id);

  useHax([
    [
      "gimmegold",
      () => updateRoom(id, { ["/players/" + playerIndex + "/resources/Gold"]: 9999 }),
    ],
    ["h", () => setVisible(false)],
    ["s", () => setVisible(true)],
  ]);

  const togglePaused = useCallback(() => {
    try {
      updateGame({
        paused: !paused
      })
    }
    catch (e) {
      console.warn(e);
    }
  }, [paused, updateGame]);

  const returnToLobby = useCallback(() => {
    try {
      updateGame({
        started: false,
      });
      deleteRoom(id);
    } catch (e) {
      console.warn(e);
    }
  }, [id, updateGame]);

  /*
  // Pieces of tile data that do not change, pass down through context to prevent need to listen to all data
  const [staticTiles, setStaticTiles] = useState<StaticTileData[]>(null);
  const boardRef = useRef(null);

  useEffect(() => {
    /*
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
*/
  const board = useMemo(() => <Board id={id} size={settings.boardSize} />, [id, settings.boardSize]);
  const units = useMemo(() => <Units id={id} playerIndex={playerIndex} />, [id, playerIndex]);
  return (
    <>
      {playerIndex === 0 && visible && (
        // Host only //
        <>
          <Button onClick={returnToLobby}>Back to Lobby</Button>
          <Button onClick={() => intitializeRoom(id, settings, participants)}>Restart</Button>
          <Button onClick={togglePaused}>
            {paused ? "Unpause" : "Pause"}
          </Button>
          <HostControl />
        </>
      )}
      <Box
        w={"650px"}
        h={"650px"}
        visibility={visible ? "visible" : "hidden"}
        border={"1px solid darkblue"}
        bg={"gray.800"}
        color={"gray.100"}
      >
        <HUD w={"650px"} h={"650px"} target={target} />
        <Box w={"full"} h={"full"}>
          <SceneWrapper>
            <TargetWrapper>
              {board}
              {units}
              <HoverGrid id={id} playerIndex={playerIndex} hovered={hovered} target={target} />
            </TargetWrapper>
            <FX hovered={hovered} target={target} />
          </SceneWrapper>
        </Box>
      </Box>
    </>
  );
}
