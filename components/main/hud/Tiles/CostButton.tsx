import { Pressable } from "react-native";
import { Button, Div, Text } from "react-native-magnus";
import { findResourceTypeByName, resourceTypes } from "../../three/Tiles/Resource";

//TODO: gold per resource
const goldPerResource = 3;

export default function CostButton({option, resources, callback}) {
  const costText = []; //text to be displayed on button
  var goldCost = 0; // Calculate whether user can purchase this item (either with resources or gold);

  resourceTypes.forEach(({ name }) => {
    // Add base cost plus dr cost for this resource
    const totalCost = (option?.cost?.[name] ?? 0);
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
      bg={'gray600'}
      //h={"min-content"}
      disabled={
        goldCost > resources["Gold"] /* if user cannot afford, disable button */
      }
      onPress={() => {
        console.log("AYYY")
        callback(option.action, { ...option.cost, Gold: goldCost })
      }
      }
    >
      <Div>
        <Text color={"white"} fontWeight={'600'}>
          {option.name}
        </Text>
        {costText.map(([key, value, amtMissing]) => (
          <Text key={key}>
            <Text color={findResourceTypeByName(key).color}>
              {key}
            </Text>
            {": "}
            <Text
              textDecorLine={!!amtMissing ? "line-through" : "none"}
              color={!!amtMissing ? "red" : "white"}
            >
              {value}
            </Text>
            {!!amtMissing && (
              <>
                {!!(value - amtMissing) && " " + (value - amtMissing)}
                <Text color={findResourceTypeByName("Gold").color}>
                  {" +" + amtMissing * goldPerResource + "g"}
                </Text>
              </>
            )}
          </Text>
        ))}
      </Div>
    </Button>
  );
}
