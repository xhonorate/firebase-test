import React from 'react';
import Tile, { tileTypes, TileData} from './three/Tile';

// Return a random int less than max
export function randomInt(max: number) {
  return Math.floor(Math.random()*max);
}

// Return random item from array
export function randomChoice(arr: any[]) {
  return arr[randomInt(arr.length)];
}

// Return index of tile at x,y location
export function coordsToIndex(x: number, y: number, size: number): number {
  if (x < 0 || y < 0 || x >= size || y >= size) return null;
  return y*size + x;
}

// Return index of tile at x,y location
export function indexToCoords(index: number, size: number): {x: number, y: number} {
  return { x: index%size, y: Math.floor(index/size) }
}

export function boardSize(tiles: TileData[]) {
  return Math.sqrt(tiles.length);
}

// Return minimum number of tiles between two x,y coords
// if directly adjacent, return 1, if need to travel 1 tile between, return 2
export function hexDist(x1:number, y1:number, x2:number, y2:number) {

  //https://www.redblobgames.com/grids/hexagons/
 
  
    // TODO: SWITCH TO RQS / CUBE coords system!!!





}

// Return array of tiles adjacent to tile
export function adjacentTiles(tiles: TileData[], tile: TileData | number, dist:number = 1) {
  // Access by index if passed as param
  if (typeof tile === 'number') tile = tiles[tile];

  let adjacent = [];

  for (let x = tile.x - dist; x <= tile.x + dist; x++) {
    for (let y = tile.y - dist; y <= tile.y + dist; y++) {
      // vertical offset of either 0 or 1 depending on whether tile is on an odd column and comparison tile is not
      let yOffset = (tile.x % 2) - (x % 2);

      





      // if tile or any adjacent tiles are already owned
      if (tiles[coordsToIndex(x, y, boardSize(tiles))]?.owner !== undefined) return false;
    }
  }

  return adjacent;
}

// Treat as 2d x-y plane grid
// Every other column will be vertically offset to achieve hex grid
// Vertex offset will shift based on even or odd column 

export interface BoardProps {
  tiles: TileData[],
  size: number
}

export interface BoardSettings {
  size: number,
  seed: string,
}

function shouldBeWater(x: number, y: number, size: number) {
  // Smallest number of tiles to one edge of the board
  const edgeDist = Math.min(x, y, size - y - 1, size - x - 1);
  // Tiles on edges are always water, tiles closer to center are less likely to be water
  // 100% chance at edge, falling to ~0% near 3/4 to edge and 0% in center
  return Math.random() > ((edgeDist**3 / size));
}

// Test a few different locations to find the best start for this player
function chooseSpawn(tiles: TileData[], size: number, passes: number) {
  let availableTiles = tiles.filter((tile) => {
    if (tile.type === 0) return false; // not a water tile


    for (let x = tile.x - 1; x <= tile.x + 1; x++) {
      for (let y = tile.y - 1; y <= tile.y + 1; y++) {
        // if tile or any adjacent tiles are already owned
        if (tiles[coordsToIndex(x, y, size)]?.owner !== undefined) return false;
      }
    }


  });
  let bestSoFar = { tile: null, value: 0 };

  for (let i = 0; i < passes; i++) {
    // choose random tiles
    // clc value including adjacent tiles odds
    let currentTile = randomChoice(availableTiles);
    




    if (bestSoFar.value > 0) {






    }
  }
}

// Called by Host to generate new board with random tile distribution based on settings
export function generateBoard(settings: BoardSettings): BoardProps {
  let tiles: TileData[] = [];
  for (let x = 0; x < settings.size; x++) {
    for (let y = 0; y < settings.size; y++) {
      tiles.push({
        type: shouldBeWater(x, y, settings.size) ? 0 : randomInt(tileTypes.length),
        x: x,
        y: y,
        odds: randomInt(3) + 1
      })
    }
  }

  return {
    tiles, 
    size: settings.size + 0
  };
}

export function Board ({tiles, onSelect}: BoardProps & {onSelect: (tile) => void}) {
  // Board graphics
  return <>
    { tiles.length > 0 &&
      tiles.map((tile: TileData, idx) => (
        <Tile key={idx} {...tile} onClick={() => onSelect(idx)} />
      ))
    }
  </>
}