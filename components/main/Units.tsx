import { CharacterType } from "./three/gltfjsx/characters/Parts/useParts";
import Unit from "./three/Units/Unit";
import { GameContext, GameState, TilesContext } from './RoomInstance';
import { generateUUID } from "three/src/math/MathUtils";
import { useCallback, useContext, useEffect, useRef } from "react";
import { HexCoords, hexToIndex, cubeDistance, findTileByHex } from './helpers/hexGrid';
import { Target } from "./MouseEvents";

// Data to be stored in RTDB /units/
export interface UnitData {
  uid: any;
  owner: number; // Player Index
  type: CharacterType; // Barbarian, Knight, etc.
  level?: number; // Level up ammount
  moves: number; // Moves left, resets to default every tick
  actions: number; // Actions left (generally just 1)
  range: number; // Attack range (1 for melee)
  hp: number; // Dies when hp reaches 0
  hex: HexCoords; // Index of current hex position on board
}

export const defaultStats: { [key in CharacterType]?: Partial<UnitData> } = {
  Knight: {
    moves: 2,
    actions: 1,
    hp: 10,
    range: 1,
  },
};

// Create new document in RTDB for unit with set props
export function createUnit({
  owner,
  type,
  ...props
}: Partial<UnitData>): UnitData {
  return {
    uid: generateUUID(),
    owner,
    type,
    moves: 0,
    actions: 0,
    range: defaultStats[type].range,
    hp: defaultStats[type].hp, 
    hex: {
      q: 0,
      r: 0,
      s: 0
    },
    ...props,
  };
}

// Pass to affect units
export function useUnitActions() {
  const { data, update } = useContext(GameContext);

  // Store as refs to avoid recalculating the callbacks - update does not actually trigger re-renders
  const dataRef = useRef(data);
  useEffect(() => {
    dataRef.current = data;
  }, [data])

  const unitAction = useCallback((unit: UnitData, target: Target) => {
    update(unitActionUpdates(dataRef.current, unit, target));
  }, [update])

  return {
    unitAction
  }
}

// Return array of tiles that must be crossed to reach target
function pathfindTo(state: GameState, currentHex: HexCoords, target: Target) {
  
}

// Return updates object - set target and move if moves are available
function unitActionUpdates (state: GameState, unit: UnitData, target: Target) {
  const updates = {};
  if (unit.moves > 0) {
    // TODO: Pathfind towards by moves
    updates["/units/" + unit.uid + "/hex"] = target.val.hex;
    updates["/units/" + unit.uid + "/moves"] = unit.moves - cubeDistance(target.val.hex, unit.hex);
  }
  updates["/units/" + unit.uid + "/target"] = target.val.hex;
  return updates;
}

// Auto-move units towards their targets - return update object
export function allUnitUpdates(state: GameState): object {
  const updates = {};

  if (!state.units) {
    return updates;
  }

  Object.keys(state.units).forEach((uid: string) => {
    const { moves, actions } = defaultStats[state.units[uid].type];
    if (state.units[uid].moves !== moves) {
      // Reset unit movement to default
      updates["/units/" + uid + "/moves"] = moves;
    }
    if (state.units[uid].moves !== actions) {
      // Reset unit actions
      updates["/units/" + uid + "/actions"] = actions;
    }
  });

  return updates;
}

export function Units() {
  const { data } = useContext(GameContext);
  const StaticTiles = useContext(TilesContext);

  if (!data?.units) {
    return null;
  }

  // Board graphics
  return (
    <>
      {Object.keys(data.units).map((uid: string) => (
        <Unit
          key={uid}
          // TODO: we do not need to be passing around all of the tile data, just locations and heights...
          unit={data.units[uid]}
          height={StaticTiles[hexToIndex(data.units[uid].hex)].height}
        />
      ))}
    </>
  );
}
