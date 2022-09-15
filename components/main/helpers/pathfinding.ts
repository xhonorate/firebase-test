import { TileData } from "../three/Tiles/Tile";
import { PriorityQueue } from './priorityQueue';
import { cubeDistance } from './hexGrid';

// Get cost of traveling over this type of tile, if tile is impassible, return -1
function getCost(current: TileData, next: TileData): number {
  if (next.biome === 0) {
    return -1;
  }
  return next.biome; //TODO: test <--
  return 1;
}

// Return array of tile indexes from start index to end index, accounting for obstables
export function pathfindTo(tiles: TileData[], start: number, end: number): number[] {
  const frontier = new PriorityQueue;
  frontier.enqueue(start, 0);
  const cameFrom = {}; // Path A-B is stored as cameFrom[B] == A
  cameFrom[start] = null;
  const costSoFar = {};
  costSoFar[start] = 0;

  while (!frontier.isEmpty) {
    // Dequeue from frontier (first-in first-out)
    const current = frontier.dequeue();

    // If we have reached our goal
    if (current === end) {
      break;
    }

    tiles[current].adjIdxs.forEach((next: number) => {
      const travelCost = getCost(tiles[current], tiles[next]);
      // Do not enqueue impassible tiles
      if (travelCost !== -1) { 
        const newCost = costSoFar[current] + travelCost;
        // If this tile has not yet been reached
        if (!(next in costSoFar || newCost < costSoFar[next])) {
          costSoFar[next] = newCost;
          // Combine calculated cost and estimated distance to end (avoid going off course)
          frontier.enqueue(next, newCost + cubeDistance(tiles[end].hex, tiles[next].hex));
          cameFrom[next] = current;
        }
      }      
    });
  }

  return retraceSteps(cameFrom, start, end);
}

// Go backwards from goal to start by retracing cameFrom path - reverse result
function retraceSteps (cameFrom: object, start:number, end: number): number[] {
  let current = end;
  const path = [];
  while (current !== start) {
    path.push(current)
    current = cameFrom[current];
  }
  path.push(start);
  path.reverse();

  return path;
}