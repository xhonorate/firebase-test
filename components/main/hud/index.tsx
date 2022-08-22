import {
  Flex,
  Text,
  ChakraProps,
  Box,
  chakra,
  Stack,
} from "@chakra-ui/react";
import {
  useContext,
  useRef,
  useMemo,
  useCallback,
  useState,
  useEffect,
} from "react";
import { GameContext } from "../RoomInstance";
import { Action } from './buildOptions';
import TileControls from './TileControls';
import ResourceDisplay from "./ResourceDisplay";
import TileInfo from './TileInfo';
import { Participant } from '../../cloudFirestore/LobbyBrowser';
import { playerColors } from "../three/Tiles/Tile";

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
  const [playerPoints, setPlayerPoints] = useState([]);
  const justUpdated = useRef(false);
  const { data, update, paused } = useContext(GameContext);

  const resources = useMemo(
    () => data?.players?.[playerIndex]?.resources,
    [data?.players, playerIndex]
  );

  // Count how many points each player has
  useEffect(() => {
    if (justUpdated.current) {
      justUpdated.current = false;
      return;
    }
    if (!data?.board?.tiles) return;

    const newPoints = participants.map((participant, idx) => { return { name: participant.name, points: 0, color: playerColors[idx] }});
    data.board.tiles.forEach((tile) => {
      if (tile?.obj?.type === 'Settlement') {
        if (newPoints?.[tile.owner]) {
          newPoints[tile.owner].points += 1 * tile.obj.level;
        }
      }
    });

    // If there are any changes in points, update state
    if (newPoints.some((val, index) => val.points !== playerPoints?.[index]?.points)) {
      justUpdated.current = true; //prevent infinate update loop
      setPlayerPoints(newPoints);
    }
  }, [data?.board?.tiles, participants, playerPoints]);

  const updateTile = useCallback(
    (action: Action, cost: object) => {
      // TODO: check pending actions on RTDB (from host tick, etc)
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

  // If game is over, sort players by points, otherwise return null;
  // TODO: set winning number of points dynamically
  const gameOverPoints = playerPoints.some((player) => player.points > 10) ? playerPoints.sort((a,b) => b.points - a.points) : null;

  if (!data || playerIndex === -1) return null; // If loading or player not found in game lobby (playerIndex = -1)
  
  if (!!gameOverPoints) {
    return (
      <HUDContainer h={'650px'} position={'absolute'} w={'650px'} zIndex={9999}>
      <Stack direction={'column'} align={'center'}  fontFamily={'heading'} fontWeight={600}>
        <Text fontSize={'6xl'}>
          <chakra.span color={gameOverPoints[0].color}>{ gameOverPoints[0].name }</chakra.span>{' WINS!'}
        </Text>
        <Text pt={8} fontSize={'2xl'}>Points:</Text>
        { gameOverPoints.map((player, idx) => {
          return <Text key={idx} fontSize={'4xl'}>
            <chakra.span color={player.color}>{player.name}{': '}</chakra.span>
              {player.points}
          </Text>
      })}
      </Stack>
    </HUDContainer>)
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
        
        {!!data?.turn && <Text align={'end'} pe={4}>Turn: {data.turn}</Text>}
        { playerPoints.map((player, idx) => {
          return <Text key={idx} align={'end'} fontWeight={600} pe={4}><chakra.span color={player.color}>{player.name}{': '}</chakra.span>{player.points}</Text>
        })}
      </Box>
      

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
    </Flex>)
  }
}
