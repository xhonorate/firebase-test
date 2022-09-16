import { TileData } from "../three/Tiles/Tile";
import { PriorityQueue } from './priorityQueue';
import { cubeDistance } from './hexGrid';
import { GameState } from '../RoomInstance';
import { UnitData } from '../Units';
import { initiateCombat } from './combat';
import { Obj } from "../three/Objects/Building";

// Mutates unit, also returns object of database updates
// Pathfind towards target - reduce moves / actions accordingly
export function stepTowardsTarget (state: GameState, unit: UnitData): object {
  const path = pathfindTo(state, unit.hexIdx, unit.targetIdx, unit.owner);
  return followPath(state, unit, path);
}

// Use unit moves to follow pathfinding
// Once target is reached, perform action, then set target to null
// Mutates unit, also returns object of database updates
export function followPath (state: GameState, unit: UnitData, path: number[]): object {
  const updates = {};

  if (unit?.resting) {
    unit.resting = false;
  }

  // If pathfinding to point is not possible, set target to null
  if (!path || path.length < 2) {
    unit.targetIdx = null;
  } else {
    path.pop(); //pop off starting tile (already on it)
    // Only stop when unit is out of moves or actions, or end of path is reached
    while (unit.moves > 0 && unit.actions > 0) {
      const next = path.pop(); // Index of next hex in path
      const blocking = mustFight(state, next, unit.owner);
      // Check if unit must fight a target here
      if (blocking) {
        // Fight target
        unit.actions -= 1;
        initiateCombat(unit, blocking);

        // If other unit was destroyed, move in
        if (unit.hp && blocking.hp === 0) {
          unit.hexIdx = unit.targetIdx;
          unit.moves -= 1;
          unit.targetIdx = null;
        }

        if ('uid' in blocking) {
          // If blocker was another unit
          //TODO: unit death
          updates["/units/" + blocking.uid] = blocking;
        } else {
          // If blocker was building
          if (blocking.hp === 0) { // Building destroyed
            // Move in / take over building
            blocking.owner = unit.owner;
            blocking.hp = null; //restore to full hp
            // TODO: animations?
            updates["/board/tiles/" + unit.targetIdx + "/obj"] = blocking;
            // Gain control of tile
            updates["/board/tiles/" + unit.targetIdx].owner = unit.owner;
            if (blocking.type === 'Settlement') {
              // Gain control of surrounding tiles
              state.board.tiles[unit.targetIdx].adjIdxs.forEach((adjIdx) => {
                updates["/board/tiles/" + adjIdx].owner = unit.owner;
              })
            }
          } else {
            // update damage taken
            updates["/board/tiles/" + unit.targetIdx + "/obj/hp"] = blocking.hp;
          }
        }

      } else {
        // Simply move in
        unit.moves -= 1;
        unit.hexIdx = next;
      }

      // Check if we have reached the end of the path
      if (!path.length) {
        unit.targetIdx = null;
        break;
      }
    }
  }
  
  updates["/units/" + unit.uid] = unit;
  return updates;
}

// Return whether target must be fought/destroyed to pathfind through
function mustFight(state: GameState, targetIdx: number, playerIndex: number): UnitData | Obj {
  // Find if there are any units on this tile
  const blockingUnit = Object.values(state.units).find((unit) => unit.hexIdx === targetIdx);
  if (blockingUnit) {
    return blockingUnit;
  }

  const tile = state.board.tiles[targetIdx];
  // If tile is owned by another player
  if ('owner' in tile && tile.owner !== playerIndex) {
    // If there is an object on this tile (besides roads)
    if ('obj' in tile && tile.obj.type !== 'Road') {
      return tile.obj;
    }
  }

  return null;
}

// Get cost of traveling over this type of tile, if tile is impassible, return -1
function getTravelCost(state: GameState, targetIdx: number): number {
  if (state.board.tiles[targetIdx].biome === 0) {
    return -1;
  }
  return 1;
}

// Return array of tile indexes from start index to end index, accounting for obstables
export function pathfindTo(state: GameState, start: number, end: number, playerIndex: number): number[] {
  // Check if tile is passible, if not dont bother trying to pathfind
  if (getTravelCost(state, end) === -1) {
    return null;
  }

  const frontier = new PriorityQueue;
  frontier.enqueue(start, 0);
  const cameFrom = {}; // Path A-B is stored as cameFrom[B] == A
  cameFrom[start] = null;
  const costSoFar = {};
  costSoFar[start] = 0;

  while (!frontier.isEmpty()) {
    // Dequeue from frontier (first-in first-out)
    const current = frontier.dequeue().element;

    // If we have reached our goal
    if (current === end) {
      return retraceSteps(cameFrom, start, end);
    }

    state.board.tiles[current].adjIdxs.forEach((next: number) => {
      const travelCost = getTravelCost(state, next);
      // Do not enqueue impassible tiles, or tiles where user must fight (unless it is the final target)
      if (travelCost === -1 || (mustFight(state, next, playerIndex) && next !== end)) { 
        // Do nothing
      } else {
        const newCost = costSoFar[current] + travelCost;
        // If this tile has not yet been reached
        if (!(next in costSoFar || newCost < costSoFar[next])) {
          costSoFar[next] = newCost;
          // Combine calculated cost and estimated distance to end (avoid going off course)
          frontier.enqueue(next, newCost + cubeDistance(state.board.tiles[end].hex, state.board.tiles[next].hex));
          cameFrom[next] = current;
        }
      }      
    });
  }

  // Exhausted options without finding path, return null
  return null;
}

// Go backwards from goal to start by retracing cameFrom path
function retraceSteps (cameFrom: object, start: number, end: number): number[] {
  let current = end;
  const path = [];
  while (current !== start) {
    path.push(current)
    current = cameFrom[current];
  }
  path.push(start);

  return path;
}