import {
  Box,
  Flex,
  Spacer,
  Text,
  Button,
  ChakraProps,
  Tooltip,
  chakra,
} from "@chakra-ui/react";
import {
  useContext,
  useRef,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { GameContext, ResourceStates } from "../room";
import { tileTypes, TileData } from "../three/Tile";
import { cubeRing, hexToIndex, findTileByHex } from "../Board";

const HUDContainer = ({ children }) => (
  <Flex
    pointerEvents={"all"}
    backdropFilter={"blur(10px) brightness(0.75);"}
    borderBottom={"1px"}
    borderColor={"whiteAlpha.500"}
    background={"whiteAlpha.200"}
    py={2}
    justifyContent={"space-evenly"}
  >
    {children}
  </Flex>
);

// Show current counts of all resources owned by player
function ResourceDisplay(resources: ResourceStates) {
  const prevValues = useRef(null);

  // On change, display animation for resources added
  useEffect(() => {
    if (prevValues.current) {
      //TODO: add animation for resource gains
    }
    prevValues.current === resources;
  }, [resources]);

  if (!resources) return null;

  return (
    <HUDContainer>
      {Object.entries(resources).map(([key, value]) => (
        <>
          <Text
            color={tileTypes.find((tileType) => tileType.name === key).color}
          >
            {key + ": " + value}
          </Text>
        </>
      ))}
    </HUDContainer>
  );
}

// Requirement functions:
const notOwned = (tile: TileData) => !("owner" in tile);
const ownedByMe = (tile: TileData, playerIndex: number) => {
  return tile?.owner === playerIndex;
};
const ownedByOther = (tile: TileData, playerIndex: number) => {
  return tile?.owner !== playerIndex;
};
const notOwnedByOther = (tile: TileData, playerIndex: number) => {
  return !tile?.owner || tile.owner === playerIndex;
};

// Pass one or more string of object names, if array is passed, return true if object in array
const hasObject = (objs: string | string[]) => {
  return (tile: TileData) => objs.includes(tile?.obj?.type);
};
const hasNoObject = (tile: TileData) => !("obj" in tile);
const objOwnedByMe = (tile: TileData, playerIndex: number) =>
  hasNoObject(tile) || tile.obj?.owner === playerIndex;

// Check if hex has a connecting path of roads to a settlement owned by me
const hasRoadToSettlement = (
  tile: TileData,
  playerIndex: number,
  tiles: TileData[]
) => {
  const checkedTiles = [hexToIndex(tile.hex)]; // Do not check the same tile we are on

  // Array of indexies
  const tilesToCheck = cubeRing(tile.hex, 1).map(hexToIndex);
  // Start by checking all adjacent tiles for roads, then branch out
  while (tilesToCheck.length > 0) {
    const currentIndex = tilesToCheck.pop();
    checkedTiles.push(currentIndex); // Add to list of checked tiles, so we do not double-check this path

    const currentTile = tiles?.[currentIndex];
    if (!currentTile) continue; // Make sure tile exists

    if (
      hasObject(["Settlement", "City"])(currentTile) &&
      objOwnedByMe(currentTile, playerIndex)
    ) {
      // If we have reached another settlement/city owned by us, return true;
      return true;
    } else if (
      hasObject("Road")(currentTile) &&
      objOwnedByMe(currentTile, playerIndex)
    ) {
      // If we reach another road, add all tiles adjacent to it to our tilesToCheck list
      const adjTiles = cubeRing(currentTile.hex, 1).map(hexToIndex);
      adjTiles.forEach((index) => {
        if (!checkedTiles.includes(index) && !tilesToCheck.includes(index)) {
          tilesToCheck.push(index);
        }
      });
    }
  }

  return false;
};

// TODO set up requirements, including adjacency

interface BuildOption {
  name: string;
  cost: { [type: string]: number };
  req?: ((
    tile: TileData,
    playerIndex?: number,
    tiles?: TileData[]
  ) => boolean)[];
  anyAdjReq?: ((tile: TileData, playerIndex?: number) => boolean)[]; // At least one adjacent tile must fit condition
  allAdjReq?: ((tile: TileData, playerIndex?: number) => boolean)[]; // ALL adjacent tiles must fit condition
}

// Name of object when built
// Resource cost to build
// Req function on tile to determine whether build option should be presented
const buildOptions: BuildOption[] = [
  {
    name: "Settlement",
    cost: { Wood: 1, Brick: 1, Sheep: 1, Wheat: 1 },
    req: [notOwned, hasNoObject, hasRoadToSettlement],
    allAdjReq: [notOwned], // Adjacent tiles not claimed territory
  },
  {
    name: "Road",
    cost: { Wood: 1, Brick: 1 },
    req: [notOwnedByOther, hasNoObject],
    anyAdjReq: [hasObject(["Road", "Settlement", "City"]), objOwnedByMe], // Must have an adjacent settlment or road owned by me
  },
  {
    name: "City",
    cost: { Wheat: 2, Ore: 3 },
    req: [ownedByMe, hasObject("Settlement")],
  },
];

interface TileControlProps {
  tiles: TileData[];
  playerIndex: number;
  resources: ResourceStates;
  tile: TileData;
  updateTile: (name: string, cost: object) => void;
}

// Display buttons to interact with tile that has been selected
function TileControls({
  tiles,
  playerIndex,
  resources,
  tile,
  updateTile,
}: TileControlProps) {
  const options = [];

  // Map array of options (const) buttons for what may be built, depending on requirements
  buildOptions.forEach((option) => {
    let reqPassed = true;
    option?.req?.forEach((req) => {
      // For all options that are possible to build on this tile, push to options list to display as buttons
      if (!req(tile, playerIndex, tiles)) {
        // If any of the build conditions are not met
        reqPassed = false;
      }
    });

    // Check conditions for adjacent tiles
    if (option?.anyAdjReq || option?.allAdjReq) {
      // if no requirements are passed, return true
      let anyAdjPassed =
        "anyAdjReq" in option
          ? option.anyAdjReq.length > 0
            ? false
            : true
          : true;

      cubeRing(tile.hex, 1).forEach((hex) => {
        let index = hexToIndex(hex);
        // If tile exists (not outside of board)
        if (index < tiles.length) {
          option?.allAdjReq?.forEach((req) => {
            if (!req(tiles[index], playerIndex)) {
              // If all tiles must pass a condition, and any fail, return false
              reqPassed = false;
            }
          });

          // Only check if none of the tiles have yet to meet the requirement
          if (!anyAdjPassed) {
            let passedAll = true;
            option?.anyAdjReq?.forEach((req) => {
              if (!req(tiles[index], playerIndex)) {
                passedAll = false;
              }
            });
            // If any tile manages to pass all requirements, return true
            if (passedAll) anyAdjPassed = true;
          }
        }
      });

      // If anyAdjReq was given and no adj tile passed, return false for overall requirement pass
      if (!anyAdjPassed) reqPassed = false;
    }

    // If all build conditions were met
    if (reqPassed) {
      options.push(option);
    }
  });

  //TODO: gold per resource
  const goldPerResource = 2;

  return (
    <>
      {options.map((option, idx) => {
        const costText = []; //text to be displayed on button
        var goldCost = 0; // Calculate whether user can purchase this item (either with resources or gold);
        Object.entries(option.cost).forEach(([key, value]) => {
          // Calculate how much gold would be required to cover any missing resources
          if (typeof value !== "number") return;
          let amtMissing = Math.max(0, value - resources[key]);
          goldCost += amtMissing * goldPerResource;

          costText.push([key, value, amtMissing]);
        });

        // If we do not have enough gold to cover the goldcost, disable button
        return (
          <>
            <Button
              key={idx}
              zIndex={1000}
              h={"min-content"}
              cursor={"pointer"}
              isDisabled={
                goldCost >
                resources["Gold"] /* if user cannot afford, disable button */
              }
              onClick={() =>
                updateTile(option.name, { ...option.cost, Gold: goldCost })
              }
            >
              <Flex direction={"column"}>
                <Text>Build {option.name}</Text>
                {costText.map(([key, value, amtMissing]) => (
                  <Text key={key}>
                    <chakra.span
                      color={tileTypes.find((tile) => tile.name === key).color}
                    >
                      {key}
                    </chakra.span>
                    {": "}
                    <chakra.span
                      as={!!amtMissing ? "del" : null}
                      color={!!amtMissing ? "red" : null}
                    >
                      {value}
                    </chakra.span>
                    {!!amtMissing && (
                      <>
                        {!!(value - amtMissing) && " " + (value - amtMissing)}
                        <chakra.span
                          color={
                            tileTypes.find((tile) => tile.name === "Gold").color
                          }
                        >
                          {" +" + amtMissing * goldPerResource + "g"}
                        </chakra.span>
                      </>
                    )}
                  </Text>
                ))}
              </Flex>
            </Button>
          </>
        );
      })}
    </>
  );
}

export interface HUDProps extends ChakraProps {
  playerIndex: number;
  target?: TileData;
}

export default function HUD({
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
    (name: string, cost: object) => {
      // Do not allow users to double-submit an action by accident
      if (hasPendingActions.current) return;
      hasPendingActions.current = true;

      const updates = {};

      let updatedTile = target;
      // Build new object on tile
      target.obj = { type: name, owner: playerIndex };
      if (name === "Settlement") {
        // Claim territory of adjacent tiles
        target.owner = playerIndex;
        cubeRing(target.hex, 1).forEach((hex) => {
          let index = hexToIndex(hex);
          // If tile exists (not outside of board)
          if (index < data?.board?.tiles.length) {
            updates["/board/tiles/" + index + "/owner"] = playerIndex;
          }
        });
      }

      // Update selected tile
      updates["/board/tiles/" + target.index] = updatedTile;

      let updatedResources = {};
      Object.entries(resources).forEach(([key, value]) => {
        updatedResources[key] = Math.max(0, value - (cost[key] ?? 0));
      });
      // Subtract cost of build from player resources
      updates["/players/" + playerIndex + "/resources/"] = updatedResources;

      update(updates).then(() => (hasPendingActions.current = false));
    },
    [playerIndex, resources, target, update]
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
      <ResourceDisplay {...resources} />
      {!!target && (
        <HUDContainer>
          <Text maxW={"50%"}>{JSON.stringify(target)}</Text>
          <TileControls
            tiles={data.board.tiles}
            playerIndex={playerIndex}
            resources={resources}
            tile={target}
            updateTile={updateTile}
          />
        </HUDContainer>
      )}
      {!!data?.turn && <Text>Turn: {data.turn}</Text>}
    </Flex>
  );
}
