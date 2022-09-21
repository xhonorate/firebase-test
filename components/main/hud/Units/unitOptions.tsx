import { TileData } from "../../three/Tiles/Tile";
import { getUnitStats, UnitData } from "../../Units";
import { CharacterType } from '../../three/gltfjsx/characters/Parts/useParts';
import { not } from "../Tiles/buildOptions";

export type UnitAction = (
    unit: UnitData,
    tile: TileData
  ) => object;
  
interface UnitOption {
  name: string;
  cost?: { [type: string]: number };
  req?: ((
    unit: UnitData,
    tile: TileData,
  ) => boolean)[];
  action: UnitAction; // action that occurs when built
}


const unitType = (type: CharacterType) => (unit: UnitData) => unit.type === type;
const fullHp = (unit: UnitData) => !('hp' in unit) || unit.hp === getUnitStats(unit.type).hp;
const notResting = (unit: UnitData, tile: TileData) => unit.action !== 'rest';
const hasActions = (unit: UnitData, tile: TileData) => unit.actions > 0;

// Resource cost to build
// Req function on tile to determine whether build option should be presented
export const unitOptions: UnitOption[] = [
  {
    name: "Rest",
    req: [hasActions, notResting, not(fullHp)],
    action: (unit, tile) => {
      const updates = {};
      // Update selected tile (by index === target)
      updates["/units/" + unit.uid + "/action"] = 'rest';
      updates["/units/" + unit.uid + "/actions"] = 0;
      updates["/units/" + unit.uid + "/targetIdx"] = null;

      return updates;
    },
  }, 
  /*
  {
    name: "Upgrade Tile",
    req: [unitType('Mage'), notResting],
    action: (unit, tile) => {
      const updates = {};
      // Update selected tile (by index === target)
      updates["/units/" + unit.uid + "/actions"] = 0;
      updates["/units/" + unit.uid + "/targetIdx"] = null;
      updates["/board/tiles/" + tile.index + "/type"] = randomChoice

      return updates;
    },
  } */
]  