import { CharacterType } from "./three/gltfjsx/characters/Parts/useParts";
import Unit from "./three/Units/Unit";

// Data to be stored in RTDB /units/
export interface UnitData {
  owner: number; // Player Index
  type: CharacterType; // Barbarian, Knight, etc.
  level?: number; // Level up ammount
  moves: number; // Moves left, resets to default every tick
  hp: number; // Dies when hp reaches 0
  hex: number; // Index of current hex position on board
}

const defaultStats = {
  'Knight': {
    level: 1,
    hp: 10,
  }
}

// Create new document in RTDB for unit with set props
export function createUnit({owner, type, ...props}: Partial<UnitData>): UnitData {
  return {
    owner,
    type,
    moves: 0,
    hp: 10, // TODO: access this stuff dynamically based on type / level
    hex: 0, // Should be passed to overwrite
    ...props
  };
}

export function Units(units: UnitData[]) {
  // Board graphics
  return (
    <>
      {units.length > 0 &&
        units.map((unit: UnitData, idx) => <Unit key={idx} {...unit} />)}
    </>
  );
}
