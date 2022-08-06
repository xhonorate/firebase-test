import { 
  Box,
  Flex,
  Spacer,
  Text,
  Button,
  ChakraProps
} from "@chakra-ui/react";
import { useContext, useRef, useEffect, useMemo } from "react";
import { GameContext, ResourceStates } from '../room';
import { tileTypes, TileData } from '../three/Tile';

const HUDContainer = ({children}) => <Flex 
  backdropFilter={'blur(10px) brightness(0.75);'}
  borderBottom={'1px'} 
  borderColor={'whiteAlpha.500'} 
  background={'whiteAlpha.200'} 
  py={2} 
  justifyContent={'space-evenly'}
>
  {children}
</Flex>

// Show current counts of all resources owned by player
function ResourceDisplay (resources: ResourceStates) {
  const prevValues = useRef(null);

  // On change, display animation for resources added
  useEffect(() => {
    if (prevValues.current) {
      //TODO: add animation for resource gains
    }
    prevValues.current === resources;
  }, [resources])

  if (!resources) return null;  

  return (
    <HUDContainer>
      {Object.entries(resources).map(([key, value]) => <>
        <Text color={tileTypes.find(tileType => tileType.name === key).color}>{key + ': ' + value}</Text>
      </>)}
    </HUDContainer>
  )
}

// Display buttons to interact with tile that has been selected
function TileControls({playerIndex, resources, tile}: {playerIndex: number, resources: ResourceStates, tile: TileData}) {
  // Check if tile is currently owned by a player
  if ('owner' in tile) {
    // Check if this tile is owned by the current player
    if (tile.owner === playerIndex) {
      // Check if there is a structure on this tile
      if ('obj' in tile) {
        // TODO: unit actions (future)
        // TODO: allow delete/replace building
      } else {
        // Map array of options (const) buttons for what may be built, depending on requirements
        // enable or disable buttons based on resources available (hover tooltip?)
        //TODO: add support for gold
      }
    }
  } else {
    // Check if tile can be purchased or otherwise interacted with
    // roads...
  }


  return null;
}


export interface HUDProps extends ChakraProps {
  playerIndex: number,
  target?: TileData
}

export default function HUD ({ playerIndex, target=null, ...props }: HUDProps) {
  const { data, set, update, paused } = useContext(GameContext);

  const resources = useMemo(() => data?.players?.[playerIndex]?.resources, [data?.players, playerIndex]);

  if (!data || playerIndex === -1) return null; // If loading or player not found in game lobby (playerIndex = -1)
  return (
    <Flex 
      pointerEvents={'none'}
      zIndex={999}
      direction={'column'}
      justifyContent={'space-between'}
      position={'absolute'}
      {...props}
    >
      <ResourceDisplay {...resources} />
      { !!target && 
        <HUDContainer>
          <Text>{JSON.stringify(target)}</Text>
          <TileControls playerIndex={playerIndex} resources={resources} tile={target} />
        </HUDContainer>
      }
      { !!data?.turn && <Text>Turn: {data.turn}</Text>}
    </Flex>
  )
}