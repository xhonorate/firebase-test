import {
  Text,
  Div,
  Button,
  DivProps,
} from "react-native-magnus";
import { useContext, useRef, useMemo, useCallback } from "react";
import { GameState } from '../RoomInstance';
import { BuildAction } from "./Tiles/buildOptions";
import TileControls from "./Tiles/TileControls";
import ResourceDisplay from "./ResourceDisplay";
import TileInfo from "./Tiles/TileInfo";
import { playerColors } from "../three/Tiles/Tile";
import { LobbyContext } from '../../cloudFirestore/GameLobby';
import UnitInfo from "./Units/UnitInfo";
import UnitControls from "./Units/UnitControls";
import { useRealtime } from '../../realtimeDatabase/Hooks/useRealtime';
import { UnitAction } from "./Units/unitOptions";
import { Target } from "../MouseEvents";

const HUDContainer = ({ children, ...props }) => (
  <Div
    //pointerEvents={"box-only"}
    /* backdropFilter={"blur(10px) brightness(0.75);"} */
    borderBottomWidth={1}
    borderColor={"whiteAlpha.500"}
    bg={"gray700"/*"whiteAlpha.200"*/}
    py={2}
    justifyContent={"space-evenly"}
    {...props}
  >
    {children}
  </Div>
);

export interface HUDProps extends DivProps {
  target: Target;
}

export default function HUD({target, ...props}: HUDProps) {
  const hasPendingActions = useRef(false);
  const { id, paused, playerIndex, participants } = useContext(LobbyContext);
  const { data, update } = useRealtime<GameState>(`rooms/${id}`);

  const resources = useMemo(
    () => data?.players?.[playerIndex]?.resources,
    [data?.players, playerIndex]
  );

  const updateCallback = useCallback(
    (action: BuildAction | UnitAction, cost: object = null) => {
      // Do not allow users to double-submit an action by accident
      if (hasPendingActions.current) return;
      hasPendingActions.current = true;

      // Pass target as index, quicker for updates, access from tiles[target] if needed
      const updates = (target.type === 'unit') ? 
        (action as UnitAction)(data.units[target.val], data.board.tiles[data.units[target.val].hexIdx])
        :
        (action as BuildAction)(target.val, playerIndex, data.board.tiles);

      if (cost) {
        let updatedResources = {};
        Object.entries(resources).forEach(([key, value]) => {
          updatedResources[key] = Math.max(0, value - (cost[key] ?? 0));
        });
        // Subtract cost of build from player resources
        updates["/players/" + playerIndex + "/resources/"] = updatedResources;
      }


      update(updates).then(() => (hasPendingActions.current = false));
    },
    [data?.board?.tiles, data?.units, playerIndex, resources, target, update]
  );

  if (!data || playerIndex === -1) return null; // If loading or player not found in game lobby (playerIndex = -1)

  if (paused) {
    return (
      <HUDContainer h={'100%'} position={"absolute"} w={'100%'} zIndex={999}>
        <Div flex={1} h={"100%"} alignItems={"center"}>
          <Text fontSize={"4xl"}>{"Paused"}</Text>
        </Div>
      </HUDContainer>
    );
  }

  if (!!data.winner) {
    return (
      <HUDContainer h={'100%'} position={"absolute"} w={'100%'} zIndex={999}>
        <Div
          alignItems={"center"}
        >
          <Text fontSize={"6xl"} fontWeight={'bold'} >
            {data.winner.split("and").map((idx) => (
              <Text key={idx} color={playerColors[idx]}>
                {participants[idx]?.name}
              </Text>
            ))}
            {" WINS!"}
          </Text>
          <Text pt={8} fontSize={"2xl"}>
            Points:
          </Text>
          {data.players.map((player, idx) => {
            if (!participants[idx]) return null;
            return (
              <Text key={idx} fontSize={"4xl"} fontWeight={'bold'}>
                <Text color={playerColors[idx]}>
                  {participants[idx]?.name}
                  {": "}
                </Text>
                {player.points}
              </Text>
            );
          })}
        </Div>
      </HUDContainer>
    );
  } else {
    return (
      <Div
        w={'100%'}
        h={'100%'}
        // userSelect={"none"}
        //pointerEvents={"none"}
        zIndex={999}
        position={'absolute'}
        justifyContent={"space-between"}
        {...props}
      >
        <Div>
          <HUDContainer>
            <ResourceDisplay {...resources} />
          </HUDContainer>

          {!!data?.turn && (
            <Text selectable={false} textAlign={"right"} pr={4} color={'white'}>
              Turn: {data.turn}
            </Text>
          )}
          {!!data?.players &&
            data.players.map((player, idx) => {
              if (!participants[idx]) return null;
              return (
                <Text selectable={false} key={idx} textAlign={"right"} color={'white'} fontWeight={'bold'} pr={4}>
                  <Text selectable={false} color={playerColors[idx]}>
                    {participants[idx]?.name}
                    {": "}
                  </Text>
                  {player.points}
                </Text>
              );
            })}
        </Div>

        {/* If tile or unit is currently selected, display info and actions */}
        {target !== null && ( 
          <HUDContainer w={'100%'} bottom={0} h={200}>
            {target.type === "tile" ? (
              <Div row h={'100%'}>
                <TileInfo
                  p={4}
                  tile={data.board.tiles[target.val]}
                  participants={participants}
                  maxW={"50%"}
                />
                <TileControls
                  tiles={data.board.tiles}
                  playerIndex={playerIndex}
                  resources={resources}
                  tile={data.board.tiles[target.val]}
                  callback={updateCallback}
                />
              </Div>
            ) : (
              <>
                <UnitInfo 
                  unit={data.units[target.val]}
                  participants={participants}
                  maxW={"50%"}
                />
                <UnitControls
                  unit={data.units[target.val]}
                  playerIndex={playerIndex}
                  tile={data.board.tiles[data.units[target.val].hexIdx]}
                  callback={updateCallback}
                  resources={resources}
                />
              </>
            )}
          </HUDContainer>
        )}
      </Div>
    );
  }
}
