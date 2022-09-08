import { TileData } from '../three/Tiles/Tile';
import { hexToIndex, adjacentIndexes, cubeRing } from '../Board';
import { Obj } from '../three/Objects/Building';

// Return closest settlement to tile, or array of settlements if there is a tie
// If owner param is passed, will ignore settlements that dont have that owner
export default function findClosestSettlement(tiles: TileData[], tile: TileData | number, owner: number = null): Obj | Obj[] {
  // If passed index of tile, convert to TileData
  if (typeof tile === 'number') {
    tile = tiles[tile]; 
  } 

  // If passed tile is already a settlement, return it
  if (tile?.obj?.type === "Settlement") return tile.obj;

  const found = [];
  for (let radius = 1; radius < tiles[tiles.length - 1].hex.q; radius++) {
    cubeRing(tile.hex, radius).forEach((adjHex) => {
      const adjTile = tiles?.[hexToIndex(adjHex)];
      if (adjTile?.obj?.type === "Settlement") {
        // If owner param is passed, make sure this settlement has the correct owner
        if (owner === null || adjTile.owner === owner) {
          found.push(adjTile.obj);
        } 
      }
    });
    
    // Return object if 1 was found, or array if more than 1 was found
    if (found.length === 1) {
      return found[0];
    } else if (found.length > 1) {
      return found;
    }
  }

  // No settlements found
  return null;
}