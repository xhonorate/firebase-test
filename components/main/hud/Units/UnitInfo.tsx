import {
  Text,
  Div,
  DivProps,
} from "react-native-magnus";
import { playerColors } from "../../three/Tiles/Tile";
import { Participant } from "../../../cloudFirestore/GameLobby";
import { getUnitStats, UnitData } from "../../Units";
import React from "react";

interface UnitInfoProps extends DivProps {
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
    <Div {...props}>
      { /* <Text>{JSON.stringify(unit)}</Text> */ }
      <Text fontSize={"lg"}>{unit.type}</Text>

      {unit.level && (
        <Text>Level: {[...Array(unit.level)].map(() => "★")}</Text>
      )}

      <Div row>
        HP:{" "}{Math.round((100 * unit.hp) / getUnitStats(unit.type).hp)}
        { /* <Progress
          ms={1}
          display={"inline-flex"}
          colorScheme="green"
          size="md"
          w={"100%"}
          value={Math.round((100 * unit.hp) / getUnitStats(unit.type).hp)}
        /> */ }
      </Div>

      <Text>
        Owner:{" "}
        {
          <Text color={playerColors[unit.owner]}>
            {participants[unit.owner]?.name ?? "None"}
          </Text>
        }
      </Text>
    </Div>
  );
}
