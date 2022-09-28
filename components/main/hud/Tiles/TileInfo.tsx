import { Text, Div, DivProps } from "react-native-magnus";
import { TileData, playerColors } from "../../three/Tiles/Tile";
import { resourceTypes } from "../../three/Tiles/Resource";
import { Participant } from "../../../cloudFirestore/GameLobby";
import React from "react";
import { getBuildingStats } from "../../three/Objects/Building";

interface TileInfoProps extends DivProps {
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
    <Div {...props} w={'50%'} h={'100%'}>
      {"obj" in tile && (
        <>
          <Text color={'gray200'} fontSize={"lg"}>
            {tile.obj.type === "Settlement" && tile.obj?.level > 1
              ? tile.obj?.level === 2
                ? "City"
                : "Upgraded City"
              : tile.obj.type}
          </Text>
          {"hp" in tile.obj && (
            <Div row>
              <Text color={'gray100'}>HP:{" "}{(100 * tile.obj.hp) / (getBuildingStats(tile.obj.type).hp)}</Text>
              { /* <Progress
                ms={1}
                display={"inline-flex"}
                colorScheme="green"
                size="md"
                w={"100%"}
                value={Math.round(
                  (100 * tile.obj.hp) / (getBuildingStats(tile.obj.type).hp)
                )}
                /> */ }
            </Div>
          )}
        </>
      )}

      <Text color={'gray100'}>
        Resource:{" "}
        {<Text color={tileType.color}>{tileType.name}</Text>}
      </Text>

      <Text color={'gray100'}>Yield Rate: {[...Array(tile.odds)].map(() => "★")}</Text>
      {"owner" in tile && (
        <Text color={'gray100'}>
          Owner:{" "}
          {
            <Text color={playerColors[tile.owner]}>
              {participants[tile.owner]?.name ?? "None"}
            </Text>
          }
        </Text>
      )}

      {tile?.obj?.t2c && (
        <Text color={'gray100'}>
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
    </Div>
  );
}
