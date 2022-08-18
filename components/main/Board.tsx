import React, {useContext} from 'react';
import Tile, { TileData, HexCoords} from './three/Tiles/Tile';
import { GameContext } from './RoomInstance';
import { GameSettings } from '../cloudFirestore/GameLobby';
import { biomeTypes, resourceTypes } from './three/Tiles/Tile';

// Return a random int less than max (may be 0)
export function randomInt(max: number) {
  return Math.floor(Math.random()*max);
}

// Return random item from array
export function randomChoice(arr: any[]) {
  return arr[randomInt(arr.length)];
}

// Take array list of relative chances, return index of choice
export function weightedChoice (weights: number[]) {
  // Get total weight of all options
  const total = weights.reduce((a,b) => a + b, 0);
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
]

// Coordinates of center tile (0,0,0)
const center = {
  q: 0,
  r: 0,
  s: 0
}

// Get cube direction vector at index (directions of radial coord system: 0 is right, circles counter clockwise)
export function cubeDirection(direction: number) {
  return cubeDirectionVectors[direction];
}

// Return hex coordinates offset by vector
export function cubeAdd(hex: HexCoords, vec: HexCoords) {
  return {
    q: hex.q + vec.q,
    r: hex.r + vec.r,
    s: hex.s + vec.s
  }
}

// Get vector distance from b to a
function cubeSubtract(a: HexCoords, b: HexCoords) {
  return {
    q: a.q - b.q,
    r: a.r - b.r,
    s: a.s - b.s
  }
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
    s: hex.s * factor
  }
}

// Return coordinates of given neighboring hex (of index 0 - 5)
function cubeNeighbor(hex: HexCoords, dir: number) {
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

// For a given index, return the hex coordinate
export function indexToHex(index: number) {
  // Tiles are organized in a spiral pattern from center, starting from right, circling counter-clockwise
  if (index === 0) return center
  let radius = 0;
  // Each ring has a number of tiles in it eqaul to 6 * radius
  let contained = 0; // Count number of tiles inside of ring at current radius
  while (contained + radius * 6 <= index) {
    contained += radius === 0 ? 1 : radius * 6;
    radius += 1;
  }

  let remainder = index - contained;
  let sector = Math.floor(remainder / radius);
  let sectorIndex = remainder - sector * radius;
  
  return cubeAdd(
    cubeScale(cubeDirection(sector), radius), // Position of first tile in this 'slice' at this radius
    cubeScale(cubeDirection((sector + 2) % 6), sectorIndex) // offset for index in this sector (counter clockwise distance)
  )
}

// Search for tile with given hex coordinates in tiles list, return false if not found
export function findTileByHex(tiles: TileData[], hex: HexCoords) {
  const index = hexToIndex(hex);
  if (index >= tiles.length) return false;
  return tiles[index];
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
  
  // sum of first n numbers = (1/2)*n*(n-1);
  // multiply by 6 (6 sections * radius hex's per section)
  // add 1 for center tile
  const contained = 1 + 6 * (1/2)*radius*(radius-1);

  const [sector, indexInSector] = getSector(hex);
  return contained + sector * radius + indexInSector;
}

// Test a few different locations to find the best start for this player
function chooseSpawn(tiles: TileData[], player: number, passes: number) {
  const availableTiles = tiles.filter((tile) => {
    if (tile.type === 0) return false; // not a water tile

    // Check all tiles surrounding given hex, if any are owned return false
    cubeRing(tile.hex, 1).forEach(hex => {
      let neighbor = findTileByHex(tiles, hex);
      if (neighbor && 'owner' in neighbor) return false;
    });

    return true;
  });

  let bestSoFar = { tile: null, value: -1 };

  for (let i = 0; i < passes; i++) {
    // choose random tiles
    // calc value including adjacent tiles odds
    let currentTile = randomChoice(availableTiles);
    let value = currentTile.odds;

    cubeRing(currentTile.hex, 1).forEach(hex => {
      let neighbor = findTileByHex(tiles, hex);
      if (neighbor && neighbor.type !== 0) {
        value += neighbor.odds;
      }
    });

    if (value > bestSoFar.value) {
      bestSoFar = { tile: currentTile, value: -1 }
    }
  }

  // Add settlement on center tile
  bestSoFar.tile.obj = { type: 'Settlement', owner: player, level: 1 };
  bestSoFar.tile.owner = player;

  // Set ownership of adjacent tiles
  cubeRing(bestSoFar.tile.hex, 1).forEach(hex => {
    let neighbor = findTileByHex(tiles, hex);
    if (neighbor) {
      neighbor.owner = player;
    }
  });
}

export interface BoardProps {
  tiles: TileData[]
}

// Base Rate multiplies all other values
// If any influance type is not set, it will have no affect on the rate
// Passed value should be a value between 0 and 1 (0 being min possible, 1 being max possible)
// If set, should return a number which base rate will be multipled by (greater than or equal to 0)
interface SpawnWeight {
  base: number, // Base rate all other values will be multiplied by
  sameAdjacencyInfluance?: (n: number) => number, // Affect of neighboring tiles with same property value
  diffAdjacencyInfluance?: (n: number) => number, // Affect of neighboring tiles with different property value
  emptyAdjacencyInfluance?: (n: number) => number, // Affect of neighboring tiles with no property value
  sameGlobalInfluance?: (n: number) => number, // Affect of total tiles with same property value
  diffGlobalInfluance?: (n: number) => number, // Affect of total tiles with different property value
  radiusInfluance?: (n: number) => number, // Increases affect at farther out radius
  verticalInfluance?: (n: number) => number,
}

// Called by Host to generate new board with random tile distribution based on settings
export function generateBoard({numPlayers, boardSize, resourceSpawns}: GameSettings): BoardProps {
  const tiles: TileData[] = [];

  const biomeWeights: SpawnWeight[] = [
    { // Water
      base: 10,
      sameAdjacencyInfluance: x => -x
    },
    { // Forest
      base: 10
    },
    { // Rock
      base: 10
    },
    { // Sand
      base: 10
    },
    { // Snow
      base: 0
    },
  ];

  const biomeCounts = Array(biomeTypes.length).fill(0);
  const resourceCounts = Array(resourceTypes.length).fill(0);

  const tileChoice = (hex: HexCoords): TileData => {
    // STEP 1: Choose biome - water or land
    const adjacentIndexes = cubeRing(hex, 1).map((neighborHex) => hexToIndex(neighborHex)).filter(i => i < tiles.length);
    
    // array of weights
    const weights = biomeWeights.map((spawnWeight: SpawnWeight, checkingBiomeIdx: number) => {
      let weight = spawnWeight.base;
      if (adjacentIndexes.length && spawnWeight.sameAdjacencyInfluance || spawnWeight.diffAdjacencyInfluance || spawnWeight.emptyAdjacencyInfluance) {
        let same: number, diff: number, empty: number = 0; 
        adjacentIndexes.forEach((adjIndex) => {
          // Check for each adjacent tile, how many have the same property / different / none
          if (!('biome' in tiles[adjIndex])) {
            empty += 1;
          } else if (tiles[adjIndex]['biome'] === checkingBiomeIdx) {
            same += 1;
          } else {
            diff += 1;
          }
        });

        // Apply set influances for adjacent tiles (weighted against maximum value (num of adj tiles))
        if (spawnWeight.sameAdjacencyInfluance) {
          weight *= spawnWeight?.sameAdjacencyInfluance(same / adjacentIndexes.length);
        }
        if (spawnWeight.diffAdjacencyInfluance) {
          weight *= spawnWeight?.diffAdjacencyInfluance(diff / adjacentIndexes.length);
        }
        if (spawnWeight.emptyAdjacencyInfluance) {
          weight *= spawnWeight?.emptyAdjacencyInfluance(empty / adjacentIndexes.length);
        }
      }

      const totalCounts = biomeCounts.reduce((a,b) => a + b, 0);

      // Apply global influances (weighted against total number of tiles)
      if (totalCounts && spawnWeight.sameGlobalInfluance) {
        weight *= spawnWeight.sameGlobalInfluance(biomeCounts[checkingBiomeIdx] / totalCounts)
      }

      if (totalCounts && spawnWeight.diffGlobalInfluance) {
        weight *= spawnWeight.diffGlobalInfluance((totalCounts - biomeCounts[checkingBiomeIdx]) / totalCounts)
      }

      if (spawnWeight.radiusInfluance) {
        weight *= spawnWeight.radiusInfluance(Math.max(hex.q, hex.r, hex.s) / boardSize)
      }

      return weight;
    });
    
    const biome = weightedChoice(weights);
            
    // STEP 2: Choose additional resources (dependant on biome + neighbors + total # of resource)

    const type = resourceSpawns > randomInt(10) ? randomInt(5) + 1 : 6;


    // STEP 3: Choose odds, based on neighbors
    // only 1 base odds for non-resource tiles
    const odds = type === 6 ? 1 : randomChoice([1, 1, 1, 2, 2, 3]);

    // add to totals...
    return {
      type,
      biome,
      hex,
      odds,
    }
  }

  tiles.push(tileChoice(center));

  // Board size determines radius of hex grid, middle tile being radius = 0, surrounding tiles radius = 1, etc.
  for (let radius = 1; radius < boardSize + 1; radius++) { //NOTE: added +1 to size for a 1 tile water border...
    // For all 6 directions
    for (let i = 0; i < 6; i ++) {
      let hex = cubeScale(cubeDirection(i), radius);
      // Amount of tiles per ring = 6 * radius of ring
      for (let j = 0; j < radius; j++) {
        tiles.push(tileChoice(hex));
        
        // Step to next tile in section of ring
        hex = cubeNeighbor(hex, (i + 2) % 6);
      }
    }
  }

  //TODO: Run second pass on tiles

  // Select spawn location for players
  for (let playerIndex = 0; playerIndex < numPlayers; playerIndex++) {
    // TODO: scuffed balanace solution of giving subsequent players +1 pass to find a good spawn
    // should probs redo the whole spawn selection thing at some point, but w/e
    chooseSpawn(tiles, playerIndex, (10 + playerIndex));
  }

  return {
    tiles
  };
}

export function Board ({tiles, onSelect}: BoardProps & {onSelect: (idx: number) => void}) {
  // Board graphics
  return <>
    { tiles.length > 0 &&
      tiles.map((tile: TileData, idx) => (
        <Tile key={idx} {...tile} onClick={() => onSelect(idx)} />
      ))
    }
  </>
}