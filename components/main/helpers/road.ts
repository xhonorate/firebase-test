import { TileData } from '../three/Tiles/Tile';

const roadTypes = [
  [0], //A
  [0,3], //B
  [0,5], //C
  [0,4], //D
  [0,3,5], //E
  [0,1,3], //F
  [0,2,4], //G
  [0,4,5], //H
  [0,2,4,5], //I
  [0,2,3,5], //J
  [0,3,4,5], //K
  [1,2,3,4,5], //L
  [0,1,2,3,4,5] //M
]

// Return type of road that should be built on this tile
export function getRoadType(tileIndex: number, tiles: TileData[]): { type: number, orientation: number } {
  const tile = tiles[tileIndex];

  // Keep track of connections to avoid additional calculations on every board change
  const connections = [];

  tile.adjIdxs.forEach((adjIdx, idx) => {
    if (tiles?.[adjIdx]?.road ||  tiles?.[adjIdx]?.obj?.type === "Settlement") {
      connections.push(idx);
    }
  });
  
  // If there are no connections, return null (should be impossible...)
  if (!connections.length) return null;
  
  // Try each rotation of tile to see if any road type fits at any orientation
  for (let orientation = 0; orientation < 6; orientation++) {
    // Check if any of the road types fit
    typeLoop: for (let type = 0; type < roadTypes.length; type++) {
      // Only check if there are the correct number of connections
      if (roadTypes[type].length !== connections.length) {
        // Wrong number of points
        continue typeLoop;
      } else {
        for (let i = 0; i < connections.length; i++) {
          // Check if any point in connections (offset by orientation does not fit)
          if (!roadTypes[type].includes((connections[i] + orientation) % 6)) {
            // If any point is not included, give up on this type at this orientation
            continue typeLoop;
          }
        }
        // If here, all connections points passed at this orientation
        return { type, orientation }
      }
    }
  }

  return null;
}