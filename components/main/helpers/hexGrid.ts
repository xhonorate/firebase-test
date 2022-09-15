import { TileData } from "../three/Tiles/Tile";
/// HEX GRID SYSTEM ///
// https://www.redblobgames.com/grids/hexagons/

/*
Moving one space in hex coordinates involves changing one of the 3 cube coordinates by +1 and changing another one by -1 
(the sum must remain 0). There are 3 possible coordinates to change by +1, and 2 remaining that could be changed by -1. 
This results in 6 possible changes. Each corresponds to one of the hexagonal directions. 
The simplest and fastest approach is to precompute the permutations and put them into a table of (dq, dr, ds):
*/

export interface HexCoords {
  q: number;
  r: number;
  s: number;
}

const cubeDirectionVectors: HexCoords[] = [
  { q: 1, r: 0, s: -1 }, // Right (0 deg)
  { q: 1, r: -1, s: 0 }, // Top-Right (60 deg)
  { q: 0, r: -1, s: 1 }, // Top-Left (120 deg)
  { q: -1, r: 0, s: 1 }, // Left (180 deg)
  { q: -1, r: 1, s: 0 }, // Bottom-Left (240 deg)
  { q: 0, r: 1, s: -1 }, // Bottom-Right (300 deg)
];

// Coordinates of center tile (0,0,0)
export const center: HexCoords = {
  q: 0,
  r: 0,
  s: 0,
};

export function cubeToPos(hex: HexCoords): [number, number, number] {
  return [
    Math.sqrt(3) * hex.q + (Math.sqrt(3) / 2) * hex.r,
    0,
    (3 / 2) * hex.r,
  ];
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

// Return whether array of hexCoords contains a given hex (since hexes are objects, array.includes(hex) would not work)
export function includesHex(arr: HexCoords[], hex: HexCoords) {
  return arr.some(arrHex => arrHex.q === hex.q && arrHex.r === hex.r && arrHex.s === hex.s)
}

// Return hex coordinates of all hexes less than or equal to <range> tiles from the given hex
// Note: these hex coords may or may not exist on the board!
export function cubeRange(hex: HexCoords, range: number) {
  const results = [];
  for (let q = -range; q <= range; q++) {
    for (
      let r = Math.max(-range, -q - range);
      r <= Math.min(range, -q + range);
      r++
    ) {
      const s = -q - r; // q + r + s = 0 constraint
      results.push(cubeAdd(hex, { q, r, s }));
    }
  }
  return results;
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

// Search for tile with given hex coordinates in tiles list, return null if not found
export function findTileByHex(tiles: TileData[], hex: HexCoords) {
  const index = hexToIndex(hex);
  if (index >= tiles.length) return null;
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