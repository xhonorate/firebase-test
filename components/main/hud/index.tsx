import {
  Flex,
  Text,
  ChakraProps,
} from "@chakra-ui/react";
import {
  useContext,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { GameContext } from "../Room";
import { Action } from './buildOptions';
import TileControls from './TileControls';
import ResourceDisplay from "./ResourceDisplay";
import TileInfo from './TileInfo';
import { Participant } from '../../cloudFirestore/LobbyBrowser';

const HUDContainer = ({ children }) => (
  <Flex
    pointerEvents={"all"}
    backdropFilter={"blur(10px) brightness(0.75);"}
    borderBottom={"1px"}
    borderColor={"whiteAlpha.500"}
    background={"whiteAlpha.200"}
    fontWeight={600}
    py={2}
    justifyContent={"space-evenly"}
  >
    {children}
  </Flex>
);

export interface HUDProps extends ChakraProps {
  participants: Participant[],
  playerIndex: number;
  target?: number; // index of tile in tiles[]
}

export default function HUD({
  participants,
  playerIndex,
  target = null,
  ...props
}: HUDProps) {
  const hasPendingActions = useRef(false);
  const { data, update, paused } = useContext(GameContext);

  const resources = useMemo(
    () => data?.players?.[playerIndex]?.resources,
    [data?.players, playerIndex]
  );

  const updateTile = useCallback(
    (action: Action, cost: object) => {
      // Do not allow users to double-submit an action by accident
      if (hasPendingActions.current) return;
      hasPendingActions.current = true;

      // Pass target as index, quicker for updates, access from tiles[target] if needed
      const updates = action(target, playerIndex, data.board.tiles);

      let updatedResources = {};
      Object.entries(resources).forEach(([key, value]) => {
        updatedResources[key] = Math.max(0, value - (cost[key] ?? 0));
      });
      // Subtract cost of build from player resources
      updates["/players/" + playerIndex + "/resources/"] = updatedResources;

      update(updates).then(() => (hasPendingActions.current = false));
    },
    [data?.board?.tiles, playerIndex, resources, target, update]
  );

  if (!data || playerIndex === -1) return null; // If loading or player not found in game lobby (playerIndex = -1)
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
      <HUDContainer>
        <ResourceDisplay {...resources} />
      </HUDContainer>
      {target !== null && (
        <HUDContainer>
          <TileInfo tile={data.board.tiles[target]} participants={participants} maxW={'50%'} />
          <TileControls
            tiles={data.board.tiles}
            playerIndex={playerIndex}
            resources={resources}
            tile={data.board.tiles[target]}
            updateTile={updateTile}
          />
        </HUDContainer>
      )}
      {!!data?.turn && <Text>Turn: {data.turn}</Text>}
    </Flex>
  );
}
