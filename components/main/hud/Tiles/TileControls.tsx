import { TileData } from "../../three/Tiles/Tile";
import { ResourceStates } from "../../RoomInstance";
import { Button, chakra, Flex, Text } from "@chakra-ui/react";
import React from "react";
import { buildOptions, Action } from "./buildOptions";
import { findResourceTypeByName, resourceTypes } from '../../three/Tiles/Resource';
import { adjacentIndexes, hexToIndex } from "../../helpers/hexGrid";
import CostButton from "./CostButton";

interface TileControlProps {
  tiles: TileData[];
  playerIndex: number;
  resources: ResourceStates;
  tile: TileData;
  updateTile: (action: Action, cost: object) => void;
}

// Display buttons to interact with tile that has been selected
export default function TileControls({
  tiles,
  playerIndex,
  resources,
  tile,
  updateTile,
}: TileControlProps) {
  const options = [];

  // Map array of options (const) buttons for what may be built, depending on requirements
  buildOptions.forEach((option) => {
    let reqPassed = true;
    option?.req?.forEach((req) => {
      // For all options that are possible to build on this tile, push to options list to display as buttons
      if (!req(tile, playerIndex, tiles)) {
        // If any of the build conditions are not met
        reqPassed = false;
      }
    });

    // Check conditions for adjacent tiles
    if (option?.anyAdjReq || option?.allAdjReq) {
      // if no requirements are passed, return true
      let anyAdjPassed =
        "anyAdjReq" in option
          ? option.anyAdjReq.length > 0
            ? false
            : true
          : true;

      adjacentIndexes(hexToIndex(tile.hex)).forEach((index) => {
        // If tile exists (not outside of board)
        if (index < tiles.length) {
          option?.allAdjReq?.forEach((req) => {
            if (!req(tiles[index], playerIndex, tiles)) {
              // If all tiles must pass a condition, and any fail, return false
              reqPassed = false;
            }
          });

          // Only check if none of the tiles have yet to meet the requirement
          if (!anyAdjPassed) {
            let passedAll = true;
            option?.anyAdjReq?.forEach((req) => {
              if (!req(tiles[index], playerIndex, tiles)) {
                passedAll = false;
              }
            });
            // If any tile manages to pass all requirements, return true
            if (passedAll) anyAdjPassed = true;
          }
        }
      });

      // If anyAdjReq was given and no adj tile passed, return false for overall requirement pass
      if (!anyAdjPassed) reqPassed = false;
    }

    // If all build conditions were met
    if (reqPassed) {
      options.push(option);
    }
  });

  return (<>
    {options.map((option, idx) => {
      option.cost = option.cost ?? {};
      
      // If object has diminishing returns (e.g. increased cost per time built, add its cost)
      const drCost = option.dr ? option.dr(tiles, playerIndex) : {};
      Object.entries(drCost).forEach(([key, value]) => {
        option.cost[key] = (option.cost[key] ?? 0) + value;
      })

      return <CostButton key={idx} option={option} resources={resources} callback={updateTile}/>
    })}
  </>)
}
