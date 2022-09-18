import { Button, chakra, Flex, Text } from "@chakra-ui/react";
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
      zIndex={1000}
      colorScheme={"blackAlpha"}
      h={"min-content"}
      cursor={"pointer"}
      isDisabled={
        goldCost > resources["Gold"] /* if user cannot afford, disable button */
      }
      onClick={() =>
        callback(option.action, { ...option.cost, Gold: goldCost })
      }
    >
      <Flex direction={"column"}>
        <Text color={"white"} fontWeight={600}>
          {option.name}
        </Text>
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
}
