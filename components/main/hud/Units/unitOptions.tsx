import { TileData } from "../../three/Tiles/Tile";
import { UnitData } from "../../Units";

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

const notResting = (unit: UnitData, tile: TileData) => !unit.resting;
const hasActions = (unit: UnitData, tile: TileData) => unit.actions > 0;

// Resource cost to build
// Req function on tile to determine whether build option should be presented
export const unitOptions: UnitOption[] = [
  {
    name: "Rest",
    req: [hasActions, notResting],
    action: (unit, tile) => {
      const updates = {};
      // Update selected tile (by index === target)
      updates["/units/" + unit.uid + "/resting"] = true;
      updates["/units/" + unit.uid + "/actions"] = 0;
      updates["/units/" + unit.uid + "/targetIdx"] = null;

      return updates;
    },
  }
]  