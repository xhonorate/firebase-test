import { TileData } from "../../three/Tiles/Tile";
import { findResourceIndexByName } from "../../three/Tiles/Resource";
import { createUnit } from "../../Units";
import {
  hexToIndex,
  adjacentIndexes,
  cubeRing,
  indexToHex,
} from "../../helpers/hexGrid";
import { getRoadType } from "../../helpers/road";
import { getBorders } from "../../helpers/borders";

//////////////////////// Requirement functions: ////////////////////////
export const not = (fn: (params?: any) => boolean) => (params?: any) => !fn(params);

const notOwned = (tile: TileData) => !("owner" in tile);
const ownedByMe = (tile: TileData, playerIndex: number) => {
  return tile?.owner === playerIndex;
};
const ownedByOther = (tile: TileData, playerIndex: number) => {
  return !!tile?.owner && tile?.owner !== playerIndex;
};
const notOwnedByOther = (tile: TileData, playerIndex: number) => {
  return !tile?.owner || tile?.owner === playerIndex;
};

const hasRoad = (tile: TileData) => !!tile?.road;
const roadOwnedByMe = (tile: TileData, playerIndex: number) =>
  tile.road?.owner === playerIndex;

// Pass one or more string of object names, if array is passed, return true if object in array
const hasObject = (objs: string | string[]) => {
  return (tile: TileData) => objs.includes(tile?.obj?.type);
};
const hasNoObject = (tile: TileData) => !("obj" in tile);
const objOwnedByMe = (tile: TileData, playerIndex: number) =>
  hasNoObject(tile) || tile.obj?.owner === playerIndex;

// Pass object of params i.e. { level: 2 } that must be met on object in tile
const objHasParams = (params: object) => {
  return (tile: TileData) => {
    // If object does not exist or fails to meet any of the parameters passed, return false
    return !Object.entries(params).some(
      ([key, value]) => tile?.obj?.[key] !== value
    );
  };
};

// Check tile biome type, if array is passed, will check if type matches any in array
const hasBiome = (biome: number | number[]) => {
  if (Array.isArray(biome)) {
    return (tile: TileData) => biome.includes(tile.biome);
  } else {
    return (tile: TileData) => tile.biome === biome;
  }
};

// Check tile resource type, if array is passed, will check if type matches any in array
const hasType = (type: number | number[]) => {
  if (Array.isArray(type)) {
    return (tile: TileData) => type.includes(tile.type);
  } else {
    return (tile: TileData) => tile.type === type;
  }
};

const isWater = (tile: TileData) => tile.biome === 0;
const isLand = (tile: TileData) => tile.biome !== 0;

// Check if hex has a connecting path of roads to a settlement owned by me
const hasRoadToSettlement = (
  tile: TileData,
  playerIndex: number,
  tiles: TileData[]
) => {
  const tileIndex = hexToIndex(tile.hex);
  const checkedTiles = [tileIndex]; // Do not check the same tile we are on

  // Array of indexies
  const tilesToCheck = adjacentIndexes(tileIndex);
  // Start by checking all adjacent tiles for roads, then branch out
  while (tilesToCheck.length > 0) {
    const currentIndex = tilesToCheck.pop();
    checkedTiles.push(currentIndex); // Add to list of checked tiles, so we do not double-check this path

    const currentTile = tiles?.[currentIndex];
    if (!currentTile) continue; // Make sure tile exists

    if (
      hasObject("Settlement")(currentTile) &&
      objOwnedByMe(currentTile, playerIndex)
    ) {
      // If we have reached another settlement/city owned by us, return true;
      return true;
    } else if (
      hasRoad(currentTile) &&
      roadOwnedByMe(currentTile, playerIndex)
    ) {
      // If we reach another road, add all tiles adjacent to it to our tilesToCheck list
      const adjTiles = adjacentIndexes(currentIndex);
      adjTiles.forEach((index) => {
        if (!checkedTiles.includes(index) && !tilesToCheck.includes(index)) {
          tilesToCheck.push(index);
        }
      });
    }
  }

  return false;
};

// Return true if any adjacent tile is a settlement
const adjacentToSettlement = (
  tile: TileData,
  playerIndex: number,
  tiles: TileData[]
) => {
  const tileIndex = hexToIndex(tile.hex);
  return adjacentIndexes(tileIndex).some((adjIdx) =>
    hasObject("Settlement")(tiles?.[adjIdx])
  );
};

const notAdjacentToSettlement = (
  tile: TileData,
  playerIndex: number,
  tiles: TileData[]
) => {
  const tileIndex = hexToIndex(tile.hex);
  return !adjacentIndexes(tileIndex).some((adjIdx) =>
    hasObject("Settlement")(tiles?.[adjIdx])
  );
};

////////////////////////////////////////////////////////////////////////////////////////////////

export type BuildAction = (
  target: number, // INDEX of tile
  playerIndex?: number,
  tiles?: TileData[]
) => object;

interface BuildOption {
  name: string;
  cost: { [type: string]: number };
  dr?: (tiles: TileData[], playerIndex: number) => { [type: string]: number }; // Function to determine increase in cost based on existing tiles
  req?: ((
    tile: TileData,
    playerIndex?: number,
    tiles?: TileData[]
  ) => boolean)[];
  anyAdjReq?: ((
    tile: TileData,
    playerIndex?: number,
    tiles?: TileData[]
  ) => boolean)[]; // At least one adjacent tile must fit condition
  allAdjReq?: ((
    tile: TileData,
    playerIndex?: number,
    tiles?: TileData[]
  ) => boolean)[]; // ALL adjacent tiles must fit condition
  action: BuildAction; // action that occurs when built
}

// Name of object when built
// Resource cost to build
// Req function on tile to determine whether build option should be presented
export const buildOptions: BuildOption[] = [
  {
    name: "Build Settlement",
    cost: { Wood: 2, Ore: 2, Food: 5 },
    dr: (tiles: TileData[], playerIndex: number) => {
      return {
        //Increase gold cost by 1 per settlement built so far
        Gold:
          tiles.filter(
            (tile) =>
              tile.owner === playerIndex && tile.obj?.type === "Settlement"
          ).length - 1,
      };
    },
    req: [notOwned, hasNoObject, hasRoadToSettlement],
    allAdjReq: [notAdjacentToSettlement], // Adjacent tiles not claimed territory
    action: (target, playerIndex, tiles) => {
      const updates = {};

      let updatedTile = tiles[target];
      // Build new object on tile
      updatedTile.obj = { type: "Settlement", owner: playerIndex, level: 1 };

      // Claim territory of adjacent tiles
      updatedTile.owner = playerIndex;
      updatedTile.adjIdxs.forEach((adjIdx) => {
        // If tile exists (not outside of board)
        if (adjIdx < tiles.length) {
          tiles[adjIdx].owner = playerIndex;
          updates["/board/tiles/" + adjIdx + "/owner"] = playerIndex;
        
          // Update all adjacent roads to connect
          if (tiles[adjIdx].road) {
            updates["/board/tiles/" + adjIdx + "/road"] = {
              owner: playerIndex,
              ...getRoadType(adjIdx, tiles),
            };
          }
        }
      });

      // AFTER setting ownership of all tiles, recalculate borders
      updatedTile.adjIdxs.forEach((adjIdx) => {
        updates["/board/tiles/" + adjIdx + "/borders"] = getBorders(adjIdx, tiles);
      });

      // Update selected tile (by index === target)
      updates["/board/tiles/" + target] = updatedTile;

      return updates;
    },
  },
  {
    name: "Build Road",
    cost: { Wood: 1, Ore: 1 },
    dr: (tiles: TileData[], playerIndex: number) => {
      return {
        //Increase gold cost by 1 per two roads built so far
        Gold: Math.floor(
          tiles.filter(
            (tile) => tile.owner === playerIndex && tile.obj?.type === "Road"
          ).length / 3
        ),
      };
    },
    req: [notOwnedByOther, not(hasRoad)],
    anyAdjReq: [
      //Has road or settlement owned by me
      (tile: TileData, playerIndex: number) => {
        return (
          (!!tile?.road && tile.road.owner === playerIndex) ||
          (tile?.obj?.type === "Settlement" && tile?.obj?.owner === playerIndex)
        );
      },
    ], // Must have an adjacent settlment or road owned by me
    action: (target, playerIndex, tiles) => {
      const updates = {};
      tiles[target].road = {
        owner: playerIndex,
        ...getRoadType(target, tiles),
      };

      updates["/board/tiles/" + target + "/road"] = tiles[target].road;

      // Update adjacent roads to connect to this one
      tiles[target].adjIdxs.forEach((adjIdx) => {
        if (tiles[adjIdx].road) {
          updates["/board/tiles/" + adjIdx + "/road"] = {
            owner: playerIndex,
            ...getRoadType(adjIdx, tiles),
          };
        }
      });

      return updates;
    },
  },
  {
    name: "Build City",
    cost: { Wood: 3, Ore: 4, Food: 10 },
    dr: (tiles: TileData[], playerIndex: number) => {
      return {
        //Increase gold cost by 1 per city built so far
        Gold: tiles.filter(
          (tile) =>
            tile.owner === playerIndex &&
            tile.obj?.type === "Settlement" &&
            tile.obj.level > 1
        ).length,
      };
    },
    req: [ownedByMe, hasObject("Settlement"), objHasParams({ level: 1 })],
    action: (target) => {
      return {
        ["/board/tiles/" + target + "/obj/level"]: 2, // Increase level value of settlement to 2
      };
    },
  },
  /* {
    name: "Upgrade City",
    cost: { Brick: 1, Wheat: 2, Ore: 2, Sheep: 2 },
    dr: (tiles: TileData[], playerIndex: number) => {
      return {
        //Increase gold cost by 1 per upgraded city built so far
        Gold:
          tiles.filter(
            (tile) =>
              tile.owner === playerIndex &&
              tile.obj?.type === "Settlement" &&
              tile.obj.level > 2
          ).length * 2,
      };
    },
    req: [ownedByMe, hasObject("Settlement"), objHasParams({ level: 2 })],
    action: (target) => {
      return {
        ["/board/tiles/" + target + "/obj/level"]: 3, // Increase level value of settlement to 2
      };
    },
  }, */
  {
    name: "Build Market",
    cost: { Wood: 1, Food: 2 },
    dr: (tiles: TileData[], playerIndex: number) => {
      return {
        //Increase gold cost by 1 per city built so far
        Gold: tiles.filter(
          (tile) => tile.owner === playerIndex && tile.obj?.type === "Market"
        ).length,
      };
    },
    req: [
      ownedByMe,
      hasNoObject,
      hasType(findResourceIndexByName("Gold")),
      hasBiome(3 /* sand */),
    ],
    action: (target, playerIndex) => {
      return {
        ["/board/tiles/" + target + "/odds"]: 2, // Increase gold tick rate to 2 //TODO: remove this?
        ["/board/tiles/" + target + "/obj"]: {
          type: "Market",
          owner: playerIndex,
          level: 1,
        },
      };
    },
  },

  {
    name: "Build Lumbermill",
    cost: { Wood: 2, Ore: 1 },
    req: [ownedByMe, hasNoObject, hasType(findResourceIndexByName("Wood"))],
    action: (target, playerIndex) => {
      return {
        ["/board/tiles/" + target + "/obj"]: {
          type: "Lumbermill",
          owner: playerIndex,
          level: 1,
        },
      };
    },
  },

  {
    name: "Build Mine",
    cost: { Wood: 1, Ore: 2 },
    req: [ownedByMe, hasNoObject, hasType(findResourceIndexByName("Ore"))],
    action: (target, playerIndex) => {
      return {
        ["/board/tiles/" + target + "/obj"]: {
          type: "Mine",
          owner: playerIndex,
          level: 1,
        },
      };
    },
  },

  {
    name: "Build Farm",
    cost: { Wood: 1, Ore: 1 },
    req: [
      ownedByMe,
      hasNoObject,
      hasType(findResourceIndexByName("Food")),
      hasBiome(1 /* forest */),
    ],
    action: (target, playerIndex) => {
      return {
        ["/board/tiles/" + target + "/obj"]: {
          type: "Farm",
          owner: playerIndex,
          level: 1,
        },
      };
    },
  },

  {
    name: "Build Barracks",
    cost: { Wood: 2, Ore: 4 },
    req: [ownedByMe, hasNoObject],
    action: (target, playerIndex) => {
      return {
        ["/board/tiles/" + target + "/obj"]: {
          type: "Barracks",
          owner: playerIndex,
          // level: 1, // Level does not need to be set, will be 0 by default, set to 1 when t2c ends
          t2c: 5, // Turns to construction
        },
      };
    },
  },

  {
    name: "Build Archery Range",
    cost: { Wood: 4, Ore: 2 },
    req: [ownedByMe, hasNoObject],
    action: (target, playerIndex) => {
      return {
        ["/board/tiles/" + target + "/obj"]: {
          type: "Archeryrange",
          owner: playerIndex,
          // level: 1, // Level does not need to be set, will be 0 by default, set to 1 when t2c ends
          t2c: 5, // Turns to construction
        },
      };
    },
  },

  {
    name: "Build Watchtower",
    cost: { Wood: 3, Ore: 5 },
    req: [ownedByMe, hasNoObject],
    action: (target, playerIndex) => {
      return {
        ["/board/tiles/" + target + "/obj"]: {
          type: "Watchtower",
          owner: playerIndex,
          // level: 1, // Level does not need to be set, will be 0 by default, set to 1 when t2c ends
          t2c: 5, // Turns to construction
        },
      };
    },
  },

  {
    name: "Recruit Knight",
    cost: { Ore: 2, Food: 3, Gold: 2 },
    req: [ownedByMe, hasObject("Barracks"), objHasParams({ level: 1 })],
    action: (target, playerIndex) => {
      // Generate a new unit (comes with a uid)
      const unit = createUnit({
        type: "Knight",
        hexIdx: target,
        owner: playerIndex,
      });

      return {
        ["/units/" + unit.uid]: unit,
      };
    },
  },

  {
    name: "Recruit Barbarian",
    cost: { Wood: 1, Food: 3, Gold: 1 },
    req: [ownedByMe, hasObject("Barracks"), objHasParams({ level: 1 })],
    action: (target, playerIndex) => {
      // Generate a new unit (comes with a uid)
      const unit = createUnit({
        type: "Barbarian",
        hexIdx: target,
        owner: playerIndex,
      });

      return {
        ["/units/" + unit.uid]: unit,
      };
    },
  },

  {
    name: "Recruit Archer",
    cost: { Wood: 1, Food: 3, Gold: 1 },
    req: [ownedByMe, hasObject("Archeryrange"), objHasParams({ level: 1 })],
    action: (target, playerIndex) => {
      // Generate a new unit (comes with a uid)
      const unit = createUnit({
        type: "Rogue",
        hexIdx: target,
        owner: playerIndex,
      });

      return {
        ["/units/" + unit.uid]: unit,
      };
    },
  },

  {
    name: "Recruit Mage",
    cost: { Wood: 1, Food: 2, Gold: 3 },
    req: [ownedByMe, hasObject("Watchtower"), objHasParams({ level: 1 })],
    action: (target, playerIndex) => {
      // Generate a new unit (comes with a uid)
      const unit = createUnit({
        type: "Mage",
        hexIdx: target,
        owner: playerIndex,
      });

      return {
        ["/units/" + unit.uid]: unit,
      };
    },
  },

  {
    name: "Buy Tile",
    cost: { Gold: 5 },
    dr: (tiles: TileData[], playerIndex: number) => {
      return {
        //Increase gold cost by 1 per extra tile owned (total - 7 per settlment)
        Gold:
          tiles.filter((tile) => tile.owner === playerIndex).length -
          tiles.filter(
            (tile) =>
              tile?.obj?.type === "Settlement" &&
              tile?.obj?.owner === playerIndex
          ).length *
            7,
      };
    },
    req: [notOwned],
    anyAdjReq: [ownedByMe, adjacentToSettlement], //an adjacent tile has to be adjacent to a setltment (e.g. max 2 away)
    action: (target, playerIndex, tiles) => {
      const updates = {}
      
      tiles[target].owner = playerIndex;
      updates["/board/tiles/" + target + "/owner"] = playerIndex, // Gain control of tile

      tiles[target].adjIdxs.forEach((adjIdx) => {
        // Update adjacent tile borders
        updates["/board/tiles/" + adjIdx + "/borders"] = getBorders(adjIdx, tiles);
      });

      return updates;
    },
  },
];
