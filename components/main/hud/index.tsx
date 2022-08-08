import { 
  Box,
  Flex,
  Spacer,
  Text,
  Button,
  ChakraProps,
  Tooltip,
  chakra
} from "@chakra-ui/react";
import { useContext, useRef, useEffect, useMemo, useState, useCallback } from "react";
import { GameContext, ResourceStates } from '../room';
import { tileTypes, TileData } from '../three/Tile';

const HUDContainer = ({children}) => <Flex 
  pointerEvents={'all'}
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

// Requirement functions:
const notOwned = (tile: TileData) => !('owner' in tile);
const ownedByMe = (tile: TileData, playerIndex: number) => { return tile?.owner === playerIndex; }
const ownedByOther = (tile: TileData, playerIndex: number) => { return tile?.owner !== playerIndex; }
const hasObject = (obj: string) => { return (tile: TileData) => tile?.obj?.type === obj };
const hasNoObject = (tile: TileData) => !('obj' in tile);
// TODO set up requirements, including adjacency

interface BuildOption {
  name: string,
  cost: { [type: string]: number },
  req?: ((tile: TileData, playerIndex?: number) => boolean)[]
}

// Name of object when built
// Resource cost to build
// Req function on tile to determine whether build option should be presented
const buildOptions: BuildOption[] = [
  { name: 'Settlement', cost: { 'Wood': 1, 'Brick': 1, 'Sheep': 1, 'Wheat': 1 } },
  { name: 'Road', cost: { 'Wood': 1, 'Brick': 1 }, req: [] },
  { name: 'City', cost: { 'Wheat': 2, 'Ore': 3 }, req: [ownedByMe, hasObject('Settlement')] }
];

interface TileControlProps {
  playerIndex: number, 
  resources: ResourceStates, 
  tile: TileData, 
  updateTile: (name: string, cost: object) => void
}

// Display buttons to interact with tile that has been selected
function TileControls({playerIndex, resources, tile, updateTile}: TileControlProps) {
  const options = []; 

  // Map array of options (const) buttons for what may be built, depending on requirements
  // enable or disable buttons based on resources available (hover tooltip?)
  //TODO: add support for gold
  buildOptions.forEach(option => {
    let reqPassed = true;
    option?.req?.forEach(req => {
      // For all options that are possible to build on this tile, push to options list to display as buttons
      if (!req(tile, playerIndex)) {
        // If any of the build conditions are not met
        reqPassed = false;
      }
    })

    // If all build conditions were met
    if (reqPassed) {
      options.push(option);
    }
  })

  //TODO: gold per resource
  const goldPerResource = 1;

  return <>
    {options.map((option, idx) => {
      const costText = []; //text to be displayed on button
      var goldCost = 0; // Calculate whether user can purchase this item (either with resources or gold);
      Object.entries(option.cost).forEach(([key, value]) => {
        // Calculate how much gold would be required to cover any missing resources
        if (typeof value !== 'number') return;
        let amtMissing = Math.max(0, value - resources[key]);
        goldCost += amtMissing * goldPerResource;

        costText.push([key, value, amtMissing]);
      })

      // If we do not have enough gold to cover the goldcost, disable button      
      return <>
        <Button 
          key={idx} 
          zIndex={1000}
          h={'min-content'}
          cursor={'pointer'}
          isDisabled={goldCost > resources['Gold'] /* if user cannot afford, disable button */}
          onClick={() => updateTile(option.name, {...option.cost, Gold: goldCost })}
        >
          <Flex direction={'column'} >
          <Text>Build {option.name}</Text>
          { costText.map(([key, value, amtMissing]) => 
            <Text key={key}>
              <chakra.span  color={tileTypes.find((tile) => tile.name === key).color}>{key}</chakra.span>
              {': '}
              <chakra.span as={!!amtMissing ? 'del' : null} color={!!amtMissing ? 'red' : null}>{value}</chakra.span>
              {!!amtMissing && <>
                {!!(value - amtMissing) && ' ' + (value - amtMissing)}
                <chakra.span color={tileTypes.find((tile) => tile.name === 'Gold').color}>{' +' + amtMissing * goldPerResource + 'g'}</chakra.span> 
              </>}
            </Text>
          )}
          </Flex>
        </Button>
      </>
    })}
  </>;
}

export interface HUDProps extends ChakraProps {
  playerIndex: number,
  target?: TileData
}

export default function HUD ({ playerIndex, target=null, ...props }: HUDProps) {
  const hasPendingActions = useRef(false);
  const { data, set, update, paused } = useContext(GameContext);
  
  const resources = useMemo(() => data?.players?.[playerIndex]?.resources, [data?.players, playerIndex]);
  
  const updateTile = useCallback((name: string, cost: object) => {
    // Do not allow users to double-submit an action by accident
    if (hasPendingActions.current) return;
    hasPendingActions.current = true;

    let updatedTile = target; 
    // Build new object on tile
    target.obj = name;
    target.owner = playerIndex;

    let updatedResources = {};
    Object.entries(resources).forEach(([key, value]) => {
      updatedResources[key] = Math.max(0, value - (cost[key] ?? 0));
    })

    update({
      ['/board/tiles/' + target.index]: updatedTile,
      ['/players/' + playerIndex + '/resources/']: updatedResources
    }).then(() => hasPendingActions.current = false);

  }, [playerIndex, resources, target, update])

  if (!data || playerIndex === -1) return null; // If loading or player not found in game lobby (playerIndex = -1)
  return (
    <Flex 
      userSelect={'none'}
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
          <Text maxW={'50%'}>{JSON.stringify(target)}</Text>
          <TileControls playerIndex={playerIndex} resources={resources} tile={target} updateTile={updateTile} />
        </HUDContainer>
      }
      { !!data?.turn && <Text>Turn: {data.turn}</Text>}
    </Flex>
  )
}