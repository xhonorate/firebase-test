import React, { useContext } from "react";
import Tile, { TileData, HexCoords } from "./three/Tiles/Tile";
import { GameContext } from "./RoomInstance";
import { GameSettings } from "../cloudFirestore/GameLobby";
import { biomeTypes } from "./three/Tiles/Tile";
import { resourceTypes } from "./three/Tiles/Resource";

// Return a random int less than max (may be 0)
export function randomInt(max: number) {
  return Math.floor(Math.random() * max);
}

// Return random item from array
export function randomChoice(arr: any[]) {
  return arr[randomInt(arr.length)];
}

// Take array list of relative chances, return index of choice
export function weightedChoice(weights: number[]) {
  // Get total weight of all options
  const total = weights.reduce((a, b) => a + b, 0);
  let targetVal = randomInt(total);
  for (let i = 0; i < weights.length; i++) {
    targetVal -= weights[i];
    if (targetVal < 0) {
      return i;
    }
  }
}

/// HEX GRID SYSTEM ///
// https://www.redblobgames.com/grids/hexagons/

/*
Moving one space in hex coordinates involves changing one of the 3 cube coordinates by +1 and changing another one by -1 
(the sum must remain 0). There are 3 possible coordinates to change by +1, and 2 remaining that could be changed by -1. 
This results in 6 possible changes. Each corresponds to one of the hexagonal directions. 
The simplest and fastest approach is to precompute the permutations and put them into a table of (dq, dr, ds):
*/
const cubeDirectionVectors = [
  { q: 1, r: 0, s: -1 }, // Right (0 deg)
  { q: 1, r: -1, s: 0 }, // Top-Right (60 deg)
  { q: 0, r: -1, s: 1 }, // Top-Left (120 deg)
  { q: -1, r: 0, s: 1 }, // Left (180 deg)
  { q: -1, r: 1, s: 0 }, // Bottom-Left (240 deg)
  { q: 0, r: 1, s: -1 }, // Bottom-Right (300 deg)
];

// Coordinates of center tile (0,0,0)
const center = {
  q: 0,
  r: 0,
  s: 0,
};

// Get cube direction vector at index (directions of radial coord system: 0 is right, circles counter clockwise)
export function cubeDirection(direction: number) {
  return cubeDirectionVectors[direction];
}

// Return hex coordinates offset by vector
export function cubeAdd(hex: HexCoords, vec: HexCoords) {
  return {
    q: hex.q + vec.q,
    r: hex.r + vec.r,
    s: hex.s + vec.s,
  };
}

// Get vector distance from b to a
export function cubeSubtract(a: HexCoords, b: HexCoords) {
  return {
    q: a.q - b.q,
    r: a.r - b.r,
    s: a.s - b.s,
  };
}

// Return scalar distance between two hex coords
export function cubeDistance(a: HexCoords, b: HexCoords) {
  let vec = cubeSubtract(a, b);
  return (Math.abs(vec.q) + Math.abs(vec.r) + Math.abs(vec.s)) / 2;
}

// Multiply cube distance by a given factor ( useful for scaling distance vectors )
export function cubeScale(hex: HexCoords, factor: number) {
  return {
    q: hex.q * factor,
    r: hex.r * factor,
    s: hex.s * factor,
  };
}

// Return coordinates of given neighboring hex (of index 0 - 5)
export function cubeNeighbor(hex: HexCoords, dir: number) {
  return cubeAdd(hex, cubeDirection(dir));
}

// Return array of hex coords of all tiles at given radius (not 0) away from center tile
export function cubeRing(center: HexCoords, radius: number) {
  let results: HexCoords[] = [];
  let hex = cubeAdd(center, cubeScale(cubeDirection(0), radius));

  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < radius; j++) {
      results.push(hex);
      hex = cubeNeighbor(hex, (i + 2) % 6);
    }
  }

  return results;
}

// Return information on position of hex at given index
function indexDetails(index: number): [number, number, number, number] {
  if (index === 0) return [0, 0, 0, 0];
  const radiusVal = (1 + Math.sqrt(1 + 4 * ((index - 1) / 6) * 2)) / 2;

  // Rounded value of radius (as int)
  const radius = Math.floor(radiusVal);

  const ringIndex = Math.floor(radius * 6 * (radiusVal - radius));
  const sector = Math.floor(ringIndex / radius);
  const sectorIndex = ringIndex - sector * radius;

  return [radius, ringIndex, sector, sectorIndex];
}

// For a given index, return the hex coordinate
export function indexToHex(index: number) {
  // Tiles are organized in a spiral pattern from center, starting from right, circling counter-clockwise
  if (index === 0) return center;

  const [radius, , sector, sectorIndex] = indexDetails(index);

  return cubeAdd(
    cubeScale(cubeDirection(sector), radius), // Position of first tile in this 'slice' at this radius
    cubeScale(cubeDirection((sector + 2) % 6), sectorIndex) // offset for index in this sector (counter clockwise distance)
  );
}

// Search for tile with given hex coordinates in tiles list, return false if not found
export function findTileByHex(tiles: TileData[], hex: HexCoords) {
  const index = hexToIndex(hex);
  if (index >= tiles.length) return false;
  return tiles[index];
}

// Get number of tiles inside of a given radius
function containedTiles(radius: number): number {
  // sum of first n numbers = (1/2)*n*(n-1);
  // multiply by 6 (6 sections * radius hex's per section)
  // add 1 for center tile
  return 1 + 6 * (1 / 2) * radius * (radius - 1);
}

// Return corrected position in ring of given index
function ringMod(ringIndex: number, ringSize: number): number {
  if (ringIndex < 0) {
    // If looping backwards around ring 0 --> radius
    return ringSize + ringIndex;
  } else {
    return ringIndex % ringSize;
  }
}

// Return array of indexes (in direction order 0 - 5) of all tiles adjacent to tile at given index
export function adjacentIndexes(index: number) {
  const indexes = [1, 2, 3, 4, 5, 6];

  // Center tile
  if (index === 0) return indexes;

  const [radius, ringIndex, sector, sectorIndex] = indexDetails(index);
  const ringSize = radius * 6;

  const contained = containedTiles(radius);
  const containedIn = contained - 6 * (radius - 1);
  const containedOut = contained + ringSize;
  const inOne = (radius - 1) * sector + sectorIndex; // Tile directly in one ring (ring index of)
  const outOne = (radius + 1) * sector + sectorIndex; // Tile directly out one ring (ring index of)

  // One tile before and after in same ring
  indexes[(2 + sector) % 6] = contained + ringMod(ringIndex + 1, ringSize);
  indexes[((!sectorIndex ? 4 : 5) + sector) % 6] =
    contained + ringMod(ringIndex - 1, ringSize);

  // Tiles directly in and out by one ring
  indexes[(3 + sector) % 6] =
    radius === 1 ? 0 : containedIn + ringMod(inOne, ringSize - 6);
  indexes[(0 + sector) % 6] = containedOut + ringMod(outOne, ringSize + 6);

  // If on a corner, add point directly on inner ring and three points on outer ring
  if (!sectorIndex) {
    indexes[(1 + sector) % 6] =
      containedOut + ringMod(outOne + 1, ringSize + 6);
    indexes[(5 + sector) % 6] =
      containedOut + ringMod(outOne - 1, ringSize + 6);
  } else {
    // Otherwise add two closest points on inner and outer rings
    indexes[(4 + sector) % 6] = containedIn + ringMod(inOne - 1, ringSize - 6);
    indexes[(1 + sector) % 6] =
      containedOut + ringMod(outOne + 1, ringSize + 6);
  }

  return indexes;
}

// Return the sector the hex is in (0 - 5) counter clockwise from right
// To get relative direction of a hex pass cubeSubtract(a, b) instead
// Return [ sector, indexInSector ]
function getSector(hex: HexCoords) {
  const absQ = Math.abs(hex.q);
  const absR = Math.abs(hex.r);
  const absS = Math.abs(hex.s);

  if (absQ > absR && absQ >= absS) {
    return [hex.q > 0 ? 0 : 3, absR];
  } else if (absR >= absQ && absR > absS) {
    return [hex.r > 0 ? 4 : 1, absS];
  } else {
    return [hex.s > 0 ? 2 : 5, absQ];
  }
}

// Calculate index of hex at given coord
// CAREFUL: This may return indexies that are out of range
export function hexToIndex(hex: HexCoords) {
  const radius = Math.max(Math.abs(hex.q), Math.abs(hex.r), Math.abs(hex.s));
  if (radius === 0) return 0;

  const [sector, indexInSector] = getSector(hex);
  return containedTiles(radius) + sector * radius + indexInSector;
}

// Test a few different locations to find the best start for this player
function chooseSpawn(tiles: TileData[], player: number, passes: number) {
  const availableTiles = tiles.filter((tile) => {
    if (tile.type === 0) return false; // not a water tile

    // Check all tiles surrounding given hex, if any are owned return false
    cubeRing(tile.hex, 1).forEach((hex) => {
      let neighbor = findTileByHex(tiles, hex);
      if (neighbor && "owner" in neighbor) return false;
    });

    return true;
  });

  let bestSoFar = { tile: null, value: -1 };

  for (let i = 0; i < passes; i++) {
    // choose random tiles
    // calc value including adjacent tiles odds
    let currentTile = randomChoice(availableTiles);
    let value = currentTile.odds;

    cubeRing(currentTile.hex, 1).forEach((hex) => {
      let neighbor = findTileByHex(tiles, hex);
      if (neighbor && neighbor.type !== 0) {
        value += neighbor.odds;
      }
    });

    if (value > bestSoFar.value) {
      bestSoFar = { tile: currentTile, value: -1 };
    }
  }

  // Add settlement on center tile
  bestSoFar.tile.obj = { type: "Settlement", owner: player, level: 1 };
  bestSoFar.tile.owner = player;

  // Set ownership of adjacent tiles
  cubeRing(bestSoFar.tile.hex, 1).forEach((hex) => {
    let neighbor = findTileByHex(tiles, hex);
    if (neighbor) {
      neighbor.owner = player;
    }
  });
}

export interface BoardProps {
  tiles: TileData[];
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

// Called by Host to generate new board with random tile distribution based on settings
export function generateBoard({
  numPlayers,
  boardSize,
  resourceSpawns,
}: GameSettings): BoardProps {
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
        // Brick
        base: [0, 10, 30, 10, 10],
        sameAdjacencyInfluance: (n) => -50 * n,
        sameGlobalInfluance: (n) => -20 * n,
      },
      {
        // Wheat
        base: [0, 20, 10, 0, 0],
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
        // Sheep
        base: [0, 20, 10, 5, 5],
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
        base: [100, 60, 10, 80, 50],
      },
      {
        // 2 - SHORT
        base: [0, 25, 25, 20, 25],
        sameAdjacencyInfluance: (n) => 30 * n,
      },
      {
        // 3
        base: [0, 10, 30, 0, 10],
        sameAdjacencyInfluance: (n) => 20 * n,
      },
      {
        // 4
        base: [0, 5, 20, 0, 10],
      },
      {
        // 5 - TALL
        base: [0, 0, 15, 0, 5],
        sameAdjacencyInfluance: (n) => -20 * n,
      },
    ],
  };

  const counts: { [key in weightTypes]?: number[] } = {
    biome: [...Array(biomeTypes.length)].fill(0),
    type: [...Array(resourceTypes.length)].fill(0),
    odds: [0,0,0],
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
    const adjacentIndexes = cubeRing(hex, 1)
      .map((neighborHex) => hexToIndex(neighborHex))
      .filter((i) => i < tiles.length);

    // STEP 1: Choose biome - water or land
    const biome = makeChoice("biome", adjacentIndexes, hex);

    // STEP 2: Choose additional resources (dependant on biome + neighbors + total # of resource)
    const type =
      biome === 0 ? 0 : makeChoice("type", adjacentIndexes, hex, biome);

    // STEP 3: Choose odds, based on neighbors
    // only 1 base odds for non-resource tiles
    const odds = type === 6 ? 1 : makeChoice("odds", adjacentIndexes, hex, biome);

    //TODO: relative heights based on neighbors / biome
    const height = type === 0 ? 0 : makeChoice("height", adjacentIndexes, hex, biome);

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
  

  // Select spawn location for players
  for (let playerIndex = 0; playerIndex < numPlayers; playerIndex++) {
    // TODO: scuffed balanace solution of giving subsequent players +1 pass to find a good spawn
    // should probs redo the whole spawn selection thing at some point, but w/e
    chooseSpawn(tiles, playerIndex, 10 + playerIndex);
  }

  return {
    tiles,
  };
}

export function Board({
  tiles,
  onSelect,
}: BoardProps & { onSelect: (idx: number) => void }) {
  // Board graphics
  return (
    <>
      {tiles.length > 0 &&
        tiles.map((tile: TileData, idx) => {
          return (
            <Tile
              key={idx}
              {...tile}
              borders={
                ("owner" in tile)
                  ? adjacentIndexes(idx).map(
                      (adjIdx) => tiles?.[adjIdx].owner !== tile.owner
                    )
                  : null
              }
              onClick={() => onSelect(idx)}
            />
          );
        })}
    </>
  );
}
