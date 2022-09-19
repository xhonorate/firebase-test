import { ResourceStates } from '../../RoomInstance';
import React from "react";
import { UnitAction, unitOptions } from "./unitOptions";
import CostButton from "../Tiles/CostButton";
import { TileData } from '../../three/Tiles/Tile';
import { UnitData } from '../../Units';

interface UnitControlProps {
  unit: UnitData;
  tile: TileData;
  resources: ResourceStates;
  playerIndex: number;
  callback: (action: UnitAction, cost: object) => void; //update DB function callback
}

// Display buttons to interact with unit once selected
export default function UnitControls({ unit, tile, resources, playerIndex, callback }: UnitControlProps) {
  return (
    <>
      {unitOptions.map((option, idx) => {
        if (option.req) {
          // If option has requirements
          option.req.forEach((req) => {
            if (!req(unit, tile)) {
              // If any requirement is not met, do not return button
              return null;
            }
          });
        }

        // All reqs have been met
        return (
          <CostButton
            key={idx}
            option={option}
            resources={resources}
            callback={callback}
          />
        );
      })}
    </>
  );
}
