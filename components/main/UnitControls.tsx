import { useContext } from "react";
import { GameContext } from "./RoomInstance";
import { UnitData } from "./Units";

// Range and action indicators
export default function UnitControls ({unit}: {unit: UnitData}) {    
  const { data, update, playerIndex } = useContext(GameContext);

  // Only show controls for units you own
  if (unit.owner !== playerIndex) {
    return null;
  }

  return null;
}
  