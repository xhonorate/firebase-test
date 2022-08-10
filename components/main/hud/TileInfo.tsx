import { Text, Stack, chakra, StackProps } from "@chakra-ui/react";
import { TileData, tileTypes, playerColors } from "../three/Tile";
import { Participant } from "../../cloudFirestore/LobbyBrowser";

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
  const tileType = tileTypes[tile.type];

  return (
    <Stack direction={"column"} spacing={1} {...props}>
      {"obj" in tile && (
        <Text fontSize={"lg"}>
          {tile.obj.type === "Settlement" && tile.obj?.level > 1
            ? tile.obj?.level === 2
              ? "City"
              : "Upgraded City"
            : tile.obj.type}
        </Text>
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

      <Text>
        Has been rolled {tile?.procs ?? 0} time{tile.procs !== 1 && "s"}
      </Text>
    </Stack>
  );
}
