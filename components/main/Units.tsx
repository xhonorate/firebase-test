import { CharacterType } from "./three/gltfjsx/characters/Parts/useParts";
import Unit from "./three/Units/Unit";
import { GameContext, GameState } from "./RoomInstance";
import { generateUUID } from "three/src/math/MathUtils";
import { useCallback, useContext, useEffect, useRef } from "react";
import { Target } from "./MouseEvents";
import {
  followPath,
  pathfindTo,
  stepTowardsTarget,
} from "./helpers/pathfinding";
import { tilePos } from "./three/Tiles/Tile";

// Data to be stored in RTDB /units/
export interface UnitData {
  uid: any;
  owner: number; // Player Index
  type: CharacterType; // Barbarian, Knight, etc.
  level?: number; // Level up ammount
  moves: number; // Moves left, resets to default every tick
  actions: number; // Actions left (generally just 1)
  range?: number; // Attack range (null for melee)
  hp: number; // Dies when hp reaches 0
  str: number; // combat strength
  resting?: boolean;
  hexIdx: number; // Index of current hex position on board
  targetIdx?: number; // Array of steps to reach target
}

const defaultStats: { [key in CharacterType | "default"]?: Partial<UnitData> } =
  {
    Knight: {
      moves: 2,
      actions: 1,
      hp: 40,
      str: 10,
    },
    default: {
      moves: 1,
      actions: 1,
      hp: 10,
      str: 10,
    },
  };

// Return default stats for building of given type
export function getUnitStats(type: any): Partial<UnitData> {
  if (type in defaultStats) {
    return defaultStats[type];
  } else {
    return defaultStats["default"];
  }
}

// Create new document in RTDB for unit with set props
export function createUnit({
  owner,
  type,
  ...props
}: Partial<UnitData>): UnitData {
  return {
    uid: generateUUID(),
    owner,
    hexIdx: 0,
    type,
    hp: 10,
    str: 10,
    ...defaultStats[type], // Stat overrides for unit type
    moves: 0, // Initialize with 0 moves / actions (summoning sickness)
    actions: 0,
    ...props, // Prop overrides
  };
}

// Pass to affect units
export function useUnitActions() {
  const { data, update } = useContext(GameContext);

  // Store as refs to avoid recalculating the callbacks - update does not actually trigger re-renders
  const dataRef = useRef(data);
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const setUnitTarget = useCallback(
    (unit: UnitData, target: Target) => {
      update(setTarget(dataRef.current, unit, target));
    },
    [update]
  );

  return {
    setUnitTarget,
  };
}

// Return updates object - set target and move if moves are available
export function setTarget(
  state: GameState,
  unit: UnitData,
  target: Target
): object {
  const targetIdx =
    target.type === "tile" ? target.val.index : target.val.hexIdx;
  if (targetIdx === unit.hexIdx || !(unit.hp > 0)) {
    // Do not attempt to pathfind to hex we are already on
    // or if unit is dead
    return null;
  }
  // Set target for pathfinding
  const path = pathfindTo(state, unit.hexIdx, targetIdx, unit.owner);
  if (path) {
    // If there is a possible path to this point - target is reachable
    unit.targetIdx = targetIdx; // Set target
    return followPath(state, unit, path); // Follow path as much as possible
  }
  return {};
}

// Auto-move units towards their targets - return update object
export function allUnitUpdates(state: GameState) {
  const updates = {};
  // If unit has pathfinding set
  Object.values(state?.units ?? {}).forEach((unit) => {
    if (unit.hp === 0) {
      // If unit is dying
      updates["/units/" + unit.uid + "/hp"] = -1;
    } else if (unit.hp === -1) {
      // Play dying animation for one tick, then set unit to null;
      updates["/units/" + unit.uid] = null;
    } else {
      if (unit.targetIdx && (unit.actions || unit.moves)) {
        // If unit target and has actions / moves, perform pathfinding
        Object.assign(updates, stepTowardsTarget(state, unit));
      }

      const stats = defaultStats[unit.type];

      if (unit.resting) {
        // Increase up to max hp
        // TODO: health per turn
        unit.hp = Math.min(stats.hp, unit.hp + 1 + Math.floor(stats.hp / 10));
        if (unit.hp === stats.hp) {
          unit.resting = false;
        }
      }

      // Reset unit movement range and actions - mutate unit object inside of update
      if (unit.actions < stats.actions) {
        if (updates["/units/" + unit.uid]) {
          updates["/units/" + unit.uid].actions = stats.actions;
        } else {
          updates["/units/" + unit.uid + "/actions"] = stats.actions;
        }
      }
      if (unit.moves < stats.moves) {
        if (updates["/units/" + unit.uid]) {
          updates["/units/" + unit.uid].moves = stats.moves;
        } else {
          updates["/units/" + unit.uid + "/moves"] = stats.moves;
        }
      }
    }
  });
  return updates;
}

export function Units() {
  const { data } = useContext(GameContext);

  if (!(data?.units)) {
    return null;
  }

  // Board graphics
  return (
    <>
      {Object.keys(data.units).map((uid: string) => {
        // TODO: should be a way to memo this?
        const tile = data.board.tiles[data.units[uid].hexIdx];
        const pos = tilePos(tile.hex, tile.height, true);
      
        return (
          <Unit
            key={uid}
            // TODO: we do not need to be passing around all of the tile data, just locations and heights...
            x={pos[0]}
            y={pos[1]}
            z={pos[2]}
            {...data.units[uid]}
          />
        )}
      )}
    </>
  );
}
