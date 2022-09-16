import { Text, Stack, chakra, StackProps, Progress, Box } from "@chakra-ui/react";
import { TileData, playerColors } from "../../three/Tiles/Tile";
import { resourceTypes } from "../../three/Tiles/Resource";
import { Participant } from "../../../cloudFirestore/GameLobby";
import React from "react";
import { getBuildingStats } from "../../three/Objects/Building";

interface TileInfoProps extends StackProps {
  tile: TileData;
  participants: Participant[];
}

// Display more detailed information about tile (pass participants to get real usernames)
export default function TileInfo({
  tile,
  participants,
  ...props
}: TileInfoProps) {
  const tileType = resourceTypes[tile.type];

  return (
    <Stack direction={"column"} spacing={1} {...props}>
      {"obj" in tile && (
        <>
          <Text fontSize={"lg"}>
            {tile.obj.type === "Settlement" && tile.obj?.level > 1
              ? tile.obj?.level === 2
                ? "City"
                : "Upgraded City"
              : tile.obj.type}
          </Text>
          {"hp" in tile.obj && (
            <Box whiteSpace={"nowrap"}>
              HP:{" "}
              <Progress
                ms={1}
                display={"inline-flex"}
                colorScheme="green"
                size="md"
                w={"full"}
                value={Math.round(
                  (100 * tile.obj.hp) / (getBuildingStats(tile.obj.type).hp)
                )}
              />
            </Box>
          )}
        </>
      )}

      <Text>
        Resource:{" "}
        {<chakra.span color={tileType.color}>{tileType.name}</chakra.span>}
      </Text>

      <Text>Yield Rate: {[...Array(tile.odds)].map(() => "★")}</Text>
      {"owner" in tile && (
        <Text>
          Owner:{" "}
          {
            <chakra.span color={playerColors[tile.owner]}>
              {participants[tile.owner]?.name ?? "None"}
            </chakra.span>
          }
        </Text>
      )}

      {tile?.obj?.t2c && (
        <Text>
          {"Complete in "}
          {tile.obj.t2c}
          {" Turns"}
        </Text>
      )}
      {/* Has been rolled text display
      <Text>
        Has been rolled {tile?.procs ?? 0} time{tile.procs !== 1 && "s"}
      </Text>
      */}
    </Stack>
  );
}
