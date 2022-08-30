import { TileData } from "../three/Tiles/Tile";
import { hexToIndex, cubeRing } from "../Board";
import { ResourceStates } from "../RoomInstance";
import { Button, chakra, Flex, Text } from "@chakra-ui/react";
import React from "react";
import { buildOptions, Action } from "./buildOptions";
import { findResourceTypeByName, resourceTypes } from '../three/Tiles/Resource';

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

      cubeRing(tile.hex, 1).forEach((hex) => {
        let index = hexToIndex(hex);
        // If tile exists (not outside of board)
        if (index < tiles.length) {
          option?.allAdjReq?.forEach((req) => {
            if (!req(tiles[index], playerIndex)) {
              // If all tiles must pass a condition, and any fail, return false
              reqPassed = false;
            }
          });

          // Only check if none of the tiles have yet to meet the requirement
          if (!anyAdjPassed) {
            let passedAll = true;
            option?.anyAdjReq?.forEach((req) => {
              if (!req(tiles[index], playerIndex)) {
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

  //TODO: gold per resource
  const goldPerResource = 3;

  return (
    <>
      {options.map((option, idx) => {
        const costText = []; //text to be displayed on button
        var goldCost = 0; // Calculate whether user can purchase this item (either with resources or gold);

        // If object has diminishing returns (e.g. increased cost per time built, add its cost)
        const drCost = !!option.dr ? option.dr(tiles, playerIndex) : null;

        resourceTypes.forEach(({name}) => {
          // Add base cost plus dr cost for this resource
          const totalCost = (option?.cost?.[name] ?? 0) + (drCost?.[name] ?? 0);
          // If there is no cost set, no need to display text, return
          if (!totalCost) return;
          if (name === "Gold") {
            goldCost += totalCost; // If gold is required add it directly
            costText.push(["Gold", totalCost, 0]); //Do not show amtMissing for gold (since we cannot replace it with gold..)
          } else {
            const amtMissing = Math.max(0, totalCost - resources[name]);
            goldCost += amtMissing * goldPerResource; // Calculate cost to replace insufficient resource with gold
            costText.push([name, totalCost, amtMissing]); // Add to text to display
          }
        });

        // If we do not have enough gold to cover the goldcost, disable button
        return (
          <Button
            key={idx}
            zIndex={1000}
            colorScheme={'blackAlpha'}
            h={"min-content"}
            cursor={"pointer"}
            isDisabled={
              goldCost >
              resources["Gold"] /* if user cannot afford, disable button */
            }
            onClick={() =>
              updateTile(option.action, { ...option.cost, Gold: goldCost })
            }
          >
            <Flex direction={"column"}>
              <Text color={'white'} fontWeight={600}>{option.name}</Text>
              {costText.map(([key, value, amtMissing]) => (
                <Text key={key}>
                  <chakra.span color={findResourceTypeByName(key).color}>
                    {key}
                  </chakra.span>
                  {": "}
                  <chakra.span
                    as={!!amtMissing ? "del" : null}
                    color={!!amtMissing ? "red" : "white"}
                  >
                    {value}
                  </chakra.span>
                  {!!amtMissing && (
                    <>
                      {!!(value - amtMissing) && " " + (value - amtMissing)}
                      <chakra.span color={findResourceTypeByName("Gold").color}>
                        {" +" + amtMissing * goldPerResource + "g"}
                      </chakra.span>
                    </>
                  )}
                </Text>
              ))}
            </Flex>
          </Button>
        );
      })}
    </>
  );
}
