import {
  Text,
  Stack,
  chakra,
  StackProps,
  Progress,
  Box,
} from "@chakra-ui/react";
import { playerColors } from "../../three/Tiles/Tile";
import { Participant } from "../../../cloudFirestore/GameLobby";
import { getUnitStats, UnitData } from "../../Units";
import React from "react";

interface UnitInfoProps extends StackProps {
  unit: UnitData;
  participants: Participant[];
}

// Display more detailed information about tile (pass participants to get real usernames)
export default function UnitInfo({
  unit,
  participants,
  ...props
}: UnitInfoProps) {
  return (
    <Stack direction={"column"} spacing={1} {...props}>
      <Text>{JSON.stringify(unit)}</Text>
      <Text fontSize={"lg"}>{unit.type}</Text>

      {unit.level && (
        <Text>Level: {[...Array(unit.level)].map(() => "★")}</Text>
      )}

      <Box whiteSpace={"nowrap"}>
        HP:{" "}
        <Progress
          ms={1}
          display={"inline-flex"}
          colorScheme="green"
          size="md"
          w={"full"}
          value={Math.round((100 * unit.hp) / getUnitStats(unit.type).hp)}
        />
      </Box>

      <Text>
        Owner:{" "}
        {
          <chakra.span color={playerColors[unit.owner]}>
            {participants[unit.owner]?.name ?? "None"}
          </chakra.span>
        }
      </Text>
    </Stack>
  );
}
