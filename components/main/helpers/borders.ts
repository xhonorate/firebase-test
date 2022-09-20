import { TileData } from '../three/Tiles/Tile';

export function intToBools(bordersInt: number) {
  return bordersInt.toString(2).padStart(6,'0').split('').map(i => i === '1');
}

// Return which sides of this tile are borders to the player's territory (converted to byte)
export function getBorders(tileIndex: number, tiles: TileData[]): number {
  const tile = tiles[tileIndex];

  // Unowned tile, no borders
  if (!('owner' in tile)) {
    return null;
  }

  let borders = 0;

  // Borders occur where adjacent tiles are not owned by same user
  tile.adjIdxs.forEach((adjIdx, idx) => {
    if (tiles?.[adjIdx]?.owner !== tile.owner) {
      borders += 2**(5-idx); // Count as bits (first side worth 1, second worth 2, third 4, etc...)
    }
  });

  return borders;
}