import {
  Flex,
  Text,
  ChakraProps,
  Box,
  chakra,
  Stack,
  Button,
} from "@chakra-ui/react";
import { useContext, useRef, useMemo, useCallback } from "react";
import { GameState } from '../RoomInstance';
import { BuildAction } from "./Tiles/buildOptions";
import TileControls from "./Tiles/TileControls";
import ResourceDisplay from "./ResourceDisplay";
import TileInfo from "./Tiles/TileInfo";
import { playerColors } from "../three/Tiles/Tile";
import { Participant, LobbyContext } from '../../cloudFirestore/GameLobby';
import UnitInfo from "./Units/UnitInfo";
import UnitControls from "./Units/UnitControls";
import { useRealtime } from '../../realtimeDatabase/Hooks/useRealtime';
import { UnitAction } from "./Units/unitOptions";
import { Target } from "../MouseEvents";

const HUDContainer = ({ children, ...props }) => (
  <Flex
    pointerEvents={"all"}
    backdropFilter={"blur(10px) brightness(0.75);"}
    borderBottom={"1px"}
    borderColor={"whiteAlpha.500"}
    background={"whiteAlpha.200"}
    fontWeight={600}
    py={2}
    justifyContent={"space-evenly"}
    {...props}
  >
    {children}
  </Flex>
);

export interface HUDProps extends ChakraProps {
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
      // TODO: check pending actions on RTDB (from host tick, etc)
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
    [data?.board?.tiles, playerIndex, resources, target, update]
  );

  if (!data || playerIndex === -1) return null; // If loading or player not found in game lobby (playerIndex = -1)

  if (paused) {
    return (
      <HUDContainer h={"650px"} position={"absolute"} w={"650px"} zIndex={999}>
        <Flex h={"full"} alignItems={"center"}>
          <Text fontSize={"4xl"}>{"Paused"}</Text>
        </Flex>
      </HUDContainer>
    );
  }

  if (!!data.winner) {
    return (
      <HUDContainer h={"650px"} position={"absolute"} w={"650px"} zIndex={999}>
        <Stack
          direction={"column"}
          align={"center"}
          fontFamily={"heading"}
          fontWeight={600}
        >
          <Text fontSize={"6xl"}>
            {data.winner.split("and").map((idx) => (
              <chakra.span key={idx} color={playerColors[idx]}>
                {participants[idx]?.name}
              </chakra.span>
            ))}
            {" WINS!"}
          </Text>
          <Text pt={8} fontSize={"2xl"}>
            Points:
          </Text>
          {data.players.map((player, idx) => {
            if (!participants[idx]) return null;
            return (
              <Text key={idx} fontSize={"4xl"}>
                <chakra.span color={playerColors[idx]}>
                  {participants[idx]?.name}
                  {": "}
                </chakra.span>
                {player.points}
              </Text>
            );
          })}
        </Stack>
      </HUDContainer>
    );
  } else {
    return (
      <Flex
        userSelect={"none"}
        pointerEvents={"none"}
        zIndex={999}
        direction={"column"}
        justifyContent={"space-between"}
        position={"absolute"}
        {...props}
      >
        <Box>
          <HUDContainer>
            <ResourceDisplay {...resources} />
          </HUDContainer>

          {!!data?.turn && (
            <Text align={"end"} pe={4}>
              Turn: {data.turn}
            </Text>
          )}
          {!!data?.players &&
            data.players.map((player, idx) => {
              if (!participants[idx]) return null;
              return (
                <Text key={idx} align={"end"} fontWeight={600} pe={4}>
                  <chakra.span color={playerColors[idx]}>
                    {participants[idx]?.name}
                    {": "}
                  </chakra.span>
                  {player.points}
                </Text>
              );
            })}
        </Box>

        {/* If tile or unit is currently selected, display info and actions */}
        {target !== null && ( 
          <HUDContainer>
            {target.type === "tile" ? (
              <>
                <TileInfo
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
              </>
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
      </Flex>
    );
  }
}
