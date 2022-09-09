import { TileData } from "../../three/Tiles/Tile";
import { ResourceStates } from "../../RoomInstance";
import React from "react";
import { UnitData } from '../../Units';

interface UnitControlProps {
  tiles: TileData[];
  units: UnitData[];
  playerIndex: number;
  resources: ResourceStates;
  unitIdx: number;
}

// Display buttons to interact with unit once selected
export default function TileControls({
  tiles,
  units,
  playerIndex,
  resources,
  unitIdx,
}: UnitControlProps) {

  //NOTE: most unit controls should be handled in Units file, since it has access to board info
  // Just do stuff like Automate / Delete unit here


  return (
    <>
    
    </>
  );
}
