import { CharacterType } from "./three/gltfjsx/characters/Parts/useParts";
import { GameState } from "./RoomInstance";
import { generateUUID } from "three/src/math/MathUtils";
import { Target } from "./MouseEvents";
import {
  followPath,
  pathfindTo,
  stepTowardsTarget,
} from "./helpers/pathfinding";
import React, { useEffect, useMemo, useState } from "react";
import Unit from "./three/Units/Unit";
import { useRealtime } from "../realtimeDatabase/Hooks";
import { snapshot, updateRoom } from "../realtimeDatabase/roomFunctions";

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
      hp: 50,
      str: 12,
    },
    Barbarian: {
      moves: 2,
      actions: 1,
      hp: 30,
      str: 10
    },
    Rogue: {
      moves: 2,
      actions: 1,
      range: 1,
      hp: 20,
      str: 10
    },
    Mage: {
      moves: 1,
      actions: 1,
      range: 1,
      hp: 15,
      str: 15
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

// Return updates object - set target and move if moves are available
export function setUnitTarget(id: string, uid: string, target: Target) {
  snapshot(id).then((state: GameState) => {
    const unit = state.units[uid];

    const targetIdx =
      target.type === "tile" ? target.val : state.units[target.val].hexIdx;
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
      
      // Update unit in RTDB
      updateRoom(id, followPath(state, unit, path));
    }
  });
}

export function Units({id}) {
  const { data } = useRealtime(`rooms/${id}/units`);
  // uids of all units in list
  const [uids, setUids] = useState<string[]>([]);
  
  useEffect(() => {
    if (!data) {
      return;
    }
    const newUids = Object.keys(data);
    
    // If uid has been added/removed or changed
    if (newUids.length !== uids.length || newUids.some(uid => !uids.includes(uid))) {
      setUids(newUids);
    }
  }, [data])

  // Board graphics
  return (
    <>
      {uids.map((uid: string) => {
        return (
          <Unit
            key={uid}
            id={id}
            uid={uid}
          />
        )}
      )}
    </>
  );
}
