import { CharacterType } from "./three/gltfjsx/characters/Parts/useParts";
import Unit from "./three/Units/Unit";
import { Target } from "./RoomInstance";
import { generateUUID } from "three/src/math/MathUtils";
import { BoardProps } from './Board';
import UnitControls from "./UnitControls";

// Data to be stored in RTDB /units/
export interface UnitData {
  uid: any;
  owner: number; // Player Index
  type: CharacterType; // Barbarian, Knight, etc.
  level?: number; // Level up ammount
  moves: number; // Moves left, resets to default every tick
  hp: number; // Dies when hp reaches 0
  hexIdx: number; // Index of current hex position on board
}

export const defaultStats: { [key in CharacterType]?: Partial<UnitData> } = {
  Knight: {
    moves: 2,
    hp: 10,
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
    hp: 10, // TODO: access this stuff dynamically based on type / level
    hexIdx: 0, // Should be passed to overwrite
    ...props,
  };
}

export interface UnitsProps extends BoardProps {
  units: UnitData[];
  target?: Target;
}

export function Units({ units, target, tiles, onSelect }: UnitsProps) {
  // Board graphics
  return (
    <>
      { target.type === 'unit' && 
        <UnitControls unit={target.val} />
      }

      {Object.values(units).map((unit: UnitData) => (
        <Unit
          key={unit.uid}
          // TODO: we do not need to be passing around all of the tile data, just locations and heights...
          tile={tiles[unit.hexIdx]} 
          onClick={(e) => {
            e.stopPropagation();
            onSelect({ type: "unit", val: unit })}
          }
          {...unit}
        />
      ))}
    </>
  );
}
