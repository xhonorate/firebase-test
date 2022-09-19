import React, { Ref, useEffect } from "react";
import Tile, { TileData } from "./three/Tiles/Tile";
import { biomeTypes, tileSize } from "./three/Tiles/Tile";
import { resourceTypes, findResourceIndexByName } from "./three/Tiles/Resource";
import { getTransition } from "./three/Tiles/transitions";
import { GameSettings } from "../cloudFirestore/GameSettings";
import {
  adjacentIndexes,
  cubeDistance,
  center,
  cubeRing,
  hexToIndex,
  cubeScale,
  cubeDirection,
  cubeNeighbor,
  HexCoords,
  containedTiles,
} from "./helpers/hexGrid";
import { randomChoice, weightedChoice } from "./helpers/random";

// Place start spawns for players
// Spawns will be spaced out as well as possible, and then balanced
// Pass strength to determine how good of a start players should have (0 is random)
function chooseSpawns(
  tiles: TileData[],
  numPlayers: number,
  strength: number = 0
) {
  const goldIndex = findResourceIndexByName("Gold");

  // Array of possible spawns tile indexes
  const validIndexes = tiles
    .map((tile, idx) => {
      // FIRST MAP, then FILTER to keep original idx
      if (tile.biome === 0) return null; // Not a water tile
      let adjWaterTiles = 0;
      adjacentIndexes(idx).forEach((adjIdx) => {
        if (tiles?.[adjIdx]?.biome === 0) {
          adjWaterTiles += 1;
        }
      });
      if (adjWaterTiles > 1) {
        return null; // Maximum of one adjacent water tile
      }
      return idx;
    })
    .filter((res) => res !== null); // Filter out invalid options

  let choices = null;
  let minDist = cubeDistance(center, tiles[tiles.length - 1].hex);
  distLoop: while (minDist > 0) {
    choices = [];
    let indexesInRange = validIndexes;
    for (let playerIndex = 0; playerIndex < numPlayers; playerIndex++) {
      // If there are no more available spawns in range
      if (!indexesInRange.length) {
        // Search with incrementaly smaller minimum separation between spawns
        minDist -= 1;
        continue distLoop;
      } else {
        const choice = randomChoice(indexesInRange);
        choices.push(choice);
        // Filter out tiles too close to this new choice
        indexesInRange = indexesInRange.filter((idx) => {
          return cubeDistance(tiles[idx].hex, tiles[choice].hex) > minDist;
        });
      }
    }
    // If here - All choices are valid
    break;
  }

  // Place players on chosen tiles
  choices.forEach((choice: number, playerNum: number) => {
    // Add settlement on center tile
    tiles[choice].obj = { type: "Settlement", owner: playerNum, level: 1 };
    tiles[choice].type = goldIndex; // Set center tile to no yeild
    tiles[choice].odds = 1;
    tiles[choice].owner = playerNum;

    // Set ownership of adjacent tiles
    const adjIdxs = adjacentIndexes(choice);
    adjIdxs.forEach((adjIdx) => {
      // If tile exists
      if (adjIdx < tiles.length) {
        // Assign ownership
        tiles[adjIdx].owner = playerNum;
      }
    });

    // Balance Strengths
    if (!strength) {
      // If strength === 0, allow random spawns -- do not balance
      return;
    }

    // TODO: add balance for having TOO strong of a start by default (right now we only buff bad starts, no nerf)
    const desiredNumYields = Math.floor(strength / 2);
    const desiredTotalValue = 5 + strength;

    // Array of index values of yield types (discluding none and base)
    const possibleYields = Array(resourceTypes.length - 2)
      .fill(null)
      .map((_, i) => i + 1); // [1, 2, 3, ...]

    // Remove all duplicate yield types
    let idxsWithYields = adjIdxs.filter((idx) =>
      possibleYields.includes(tiles[idx]?.type)
    );
    const existingYields = [];
    idxsWithYields.forEach((idx) => {
      if (existingYields.includes(tiles[idx]?.type)) {
        // If there is already another tile with this same yield type, reset it
        tiles[idx].odds = 1;
        tiles[idx].type = goldIndex; // Reset to base yield type
      } else {
        existingYields.push(tiles[idx].type); // Record unique yield type
      }
    });

    // Get array of all tiles with base yields, but without special yields
    while (existingYields.length < desiredNumYields) {
      const idxsWithoutYields = adjIdxs.filter(
        (idx) => tiles[idx].type === goldIndex
      );
      if (!idxsWithoutYields.length) {
        // If there are no more available tiles to assign yields to, just break
        break;
      }
      // Choose a new yield for this tile -- not one already present
      const newYield = randomChoice(
        possibleYields.filter((val) => !existingYields.includes(val))
      );
      existingYields.push(newYield);
      tiles[randomChoice(idxsWithoutYields)].type = newYield;
    }

    // Fetch new indexes with yields
    idxsWithYields = adjIdxs.filter((idx) =>
      possibleYields.includes(tiles[idx].type)
    );
    let totalValue = adjIdxs.reduce((prev, idx) => prev + tiles[idx].odds, 0);
    // Continually increase value of random tile until desired total is reached
    while (totalValue < desiredTotalValue) {
      // Select only tiles that can still be increased in odds
      const options = idxsWithYields.filter((idx) => tiles[idx].odds < 3);
      if (!options.length) {
        break; // If desiredvalue has been set impossibly high, break eventually
      }
      // Increased chosen tiles odds by 1
      tiles[randomChoice(options)].odds += 1;
      totalValue += 1;
    }
  });
}

// Base Rate is int relative weight OR array of weights based on passed index (like biome)
// If any influance type is not set, it will have no affect on the rate
// Passed value should be a value between 0 and 1 (0 being min possible, 1 being max possible)
// If set, should return a number which base rate will be increased/decreased by
interface SpawnWeight {
  base: number | number[]; // Base rate all other values will be multiplied by
  sameAdjacencyInfluance?: (n: number) => number; // Affect of neighboring tiles with same property value
  diffAdjacencyInfluance?: (n: number) => number; // Affect of neighboring tiles with different property value
  emptyAdjacencyInfluance?: (n: number) => number; // Affect of neighboring tiles with no property value
  sameGlobalInfluance?: (n: number) => number; // Affect of total tiles with same property value
  diffGlobalInfluance?: (n: number) => number; // Affect of total tiles with different property value
  radiusInfluance?: (n: number) => number; // Increases affect at farther out radius
  verticalInfluance?: (n: number) => number;
}

export interface BoardState {
  tiles: TileData[];
}

// Called by Host to generate new board with random tile distribution based on settings
export function generateBoard({
  numPlayers,
  boardSize,
  resourceSpawns,
  spawnStrength,
}: GameSettings): BoardState {
  const tiles: TileData[] = [];

  type weightTypes = "biome" | "type" | "odds" | "height";

  const weights: { [key in weightTypes]?: SpawnWeight[] } = {
    // Biome types
    biome: [
      {
        // Water
        base: 0,
        radiusInfluance: (n) => (100 * (n - 0.8)) ** 3,
      },
      {
        // Forest
        base: 30,
        sameAdjacencyInfluance: (n) => 30 * n,
        sameGlobalInfluance: (n) => -4 * n,
      },
      {
        // Rock
        base: 10,
        sameAdjacencyInfluance: (n) => 10 * n,
        sameGlobalInfluance: (n) => -4 * n,
      },
      {
        // Sand
        base: 10,
        sameAdjacencyInfluance: (n) => 10 * n,
        sameGlobalInfluance: (n) => -4 * n,
      },
      {
        // Snow
        base: 0,
      },
    ],

    // Resource Types
    type: [
      {
        // None
        base: 0, // resourceSpawns: 1 - 10
      },
      {
        // Wood
        base: [0, 30, 10, 0, 20],
        sameAdjacencyInfluance: (n) => -50 * n,
        sameGlobalInfluance: (n) => -20 * n,
      },
      {
        // Ore
        base: [0, 10, 30, 20, 10],
        sameAdjacencyInfluance: (n) => -50 * n,
        sameGlobalInfluance: (n) => -20 * n,
      },
      {
        // Food
        base: [30, 20, 10, 5, 5],
        sameAdjacencyInfluance: (n) => -50 * n,
        sameGlobalInfluance: (n) => -20 * n,
      },
      {
        // Gold
        base: 200 - resourceSpawns * 15,
      },
    ],

    // Odds
    odds: [
      {
        // NO Yield!
        base: 0,
      },
      {
        // 1
        base: 30,
      },
      {
        // 2
        base: 20,
        sameAdjacencyInfluance: (n) => -30 * n,
      },
      {
        // 3
        base: 10,
        sameAdjacencyInfluance: (n) => -20 * n,
      },
    ],

    // Heights
    height: [
      {
        // 1 - FLAT
        base: [100, 50, 20, 85, 50],
      },
      {
        // 2 - SHORT
        base: [0, 30, 25, 15, 25],
        sameAdjacencyInfluance: (n) => 30 * n,
      },
      {
        // 3
        base: [0, 15, 30, 0, 10],
        sameAdjacencyInfluance: (n) => 20 * n,
      },
      {
        // 4
        base: [0, 5, 15, 0, 10],
      },
      {
        // 5 - TALL
        base: [0, 0, 10, 0, 5],
        sameAdjacencyInfluance: (n) => -20 * n,
      },
    ],
  };

  const counts: { [key in weightTypes]?: number[] } = {
    biome: [...Array(biomeTypes.length)].fill(0),
    type: [...Array(resourceTypes.length)].fill(0),
    odds: [0, 0, 0],
  };

  // Safely check if weight funcion is set, and apply it if so, otherwise just return weight
  function applyWeight(
    weight: number,
    spawnWeight: SpawnWeight,
    key: keyof Omit<SpawnWeight, "base">,
    value: number
  ) {
    if (
      value === NaN ||
      value === Infinity ||
      value === -Infinity ||
      !(key in spawnWeight)
    ) {
      return weight;
    } else {
      return Math.max(0, weight + Math.round(spawnWeight[key](value)));
    }
  }

  // Select based on weights, total counts, and type (biome/tile)
  function makeChoice(
    type: weightTypes,
    adjacentIndexes: number[],
    hex: HexCoords,
    baseIndex?: number
  ) {
    // Calculate values that are going to be reused
    const totalCounts = counts[type]?.reduce((a, b) => a + b, 0);
    const radiusVal = cubeDistance(center, hex) / boardSize;

    const choice = weightedChoice(
      weights[type].map((spawnWeight: SpawnWeight, checkingIdx: number) => {
        // Get base rate based on index (biome) if passed, otherwise get flat base value
        let weight = Array.isArray(spawnWeight.base)
          ? spawnWeight.base[baseIndex]
          : spawnWeight.base;

        // If there are adjacent tiles...
        if (
          adjacentIndexes.length &&
          (spawnWeight.sameAdjacencyInfluance ||
            spawnWeight.diffAdjacencyInfluance ||
            spawnWeight.emptyAdjacencyInfluance)
        ) {
          let same: number = 0,
            diff: number = 0,
            empty: number = 0;
          adjacentIndexes.forEach((adjIndex) => {
            // Check for each adjacent tile, how many have the same property / different / none
            if (!(type in tiles[adjIndex])) {
              empty += 1;
            } else if (tiles[adjIndex][type] === checkingIdx) {
              same += 1;
            } else {
              diff += 1;
            }
          });

          // Apply set influances for adjacent tiles (weighted against maximum value (num of adj tiles))
          weight = applyWeight(
            weight,
            spawnWeight,
            "sameAdjacencyInfluance",
            same / adjacentIndexes.length
          );
          weight = applyWeight(
            weight,
            spawnWeight,
            "diffAdjacencyInfluance",
            diff / adjacentIndexes.length
          );
          weight = applyWeight(
            weight,
            spawnWeight,
            "emptyAdjacencyInfluance",
            empty / adjacentIndexes.length
          );
        }

        // Apply global influances (weighted against total number of tiles)
        if (totalCounts) {
          weight = applyWeight(
            weight,
            spawnWeight,
            "sameGlobalInfluance",
            counts[type][checkingIdx] / totalCounts
          );
          weight = applyWeight(
            weight,
            spawnWeight,
            "diffGlobalInfluance",
            (totalCounts - counts[type][checkingIdx]) / totalCounts
          );
        }

        weight = applyWeight(weight, spawnWeight, "radiusInfluance", radiusVal);

        return weight;
      })
    );

    // Track count of this type for subsequent spawn calculations
    if (type in counts) {
      counts[type][choice] += 1;
    }

    // Return chosen option
    return choice;
  }

  // Select all options for tile at given hex
  const tileChoice = (hex: HexCoords): TileData => {
    const adjIdxs = cubeRing(hex, 1)
      .map((neighborHex) => hexToIndex(neighborHex))
      .filter((i) => i < tiles.length);

    // STEP 1: Choose biome - water or land
    const biome = makeChoice("biome", adjIdxs, hex);

    // STEP 2: Choose additional resources (dependant on biome + neighbors + total # of resource)
    const type = makeChoice("type", adjIdxs, hex, biome);

    // STEP 3: Choose odds, based on neighbors
    // only 1 base odds for non-resource tiles
    const odds =
      type === findResourceIndexByName("Gold")
        ? 1
        : makeChoice("odds", adjIdxs, hex, biome);

    //TODO: relative heights based on neighbors / biome
    const height = biome === 0 ? 0 : makeChoice("height", adjIdxs, hex, biome);

    // add to totals...
    return {
      type,
      biome,
      height,
      hex,
      odds,
    };
  };

  // Add center tile first
  tiles.push(tileChoice(center));

  // Board size determines radius of hex grid, middle tile being radius = 0, surrounding tiles radius = 1, etc.
  for (let radius = 1; radius < boardSize + 1; radius++) {
    //NOTE: added +1 to size for a 1 tile water border...
    // For all 6 directions
    for (let i = 0; i < 6; i++) {
      let hex = cubeScale(cubeDirection(i), radius);
      // Amount of tiles per ring = 6 * radius of ring
      for (let j = 0; j < radius; j++) {
        tiles.push(tileChoice(hex));

        // Step to next tile in section of ring
        hex = cubeNeighbor(hex, (i + 2) % 6);
      }
    }
  }

  //TODO: Run second pass for river generation?, height generation, and balance?
  // Assign transition types to tiles (e.g. half water half sand, etc.)
  tiles.forEach((tile: TileData, idx: number) => {
    tile.adjIdxs = adjacentIndexes(idx).filter(
      (adjIdx) => adjIdx < tiles.length
    );

    // Tile transitions (between biome types)
    tile.transition = getTransition(
      tile.biome,
      tile.adjIdxs.map((adjIdx) => tiles?.[adjIdx]?.biome)
    );

    // Smoothe out heights
    if (tile.biome !== 0) {
      let val = tile.height * 6; // 1/2 weight for tiles own height, 1/2 weight for adjacent average
      tile.adjIdxs.forEach((adjIdx) => {
        val += tiles?.[adjIdx]?.height ?? 0; // weight for adjacent tiles height (default 0)
      });
      tile.height = Math.round(val / 12);
    }
  });

  // Select spawn location for players
  chooseSpawns(tiles, numPlayers, spawnStrength);

  return {
    tiles,
  };
}

interface BoardProps {
  id: string; //Room id
  size: number;
}

const Board = ({ id, size }: BoardProps) => {
  console.log("BOARD REMOUNT")
  return (
  <>
    {[...Array(containedTiles(size))].map((_, idx) => <Tile key={idx} id={id} index={idx} />)
    }
  </>
)}

export default Board;

/*
const Board = React.forwardRef(({ tiles }: BoardState, ref: Ref<THREE.Group>) => {
  // TODO: there should be a way to do this much more intelligently, prevent remouting every time prop updates...
  // Note - tiles import is better than full data import, but would be best to useMemo on tiles individually?

  console.log("RERENDER!")
  if (!tiles || !tiles.length) {
    return null;
  }
  return (
    <group ref={ref}>
      {tiles.length > 0 &&
        tiles.map((tile: TileData, idx) => (
          <Tile
            key={idx}
            index={idx}
            {...tile}
            borders={
              "owner" in tile
                ? tile.adjIdxs.map(
                    (adjIdx) => tiles?.[adjIdx]?.owner !== tile.owner
                  )
                : null
            }
          />
        ))}
    </group>
  );
});

Board.displayName = "Board";
export default Board; */
