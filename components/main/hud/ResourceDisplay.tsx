import { Text, Box, BoxProps } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { ResourceStates } from "../Room";
import { findTileTypeByName, tileTypes } from "../three/Tile";

const MotionBox = motion<Omit<BoxProps, "transition">>(Box);

// Show current counts of all resources owned by player
export default function ResourceDisplay(resources: ResourceStates) {
  const prevValues = useRef(null);
  const anims = useRef({}); // Keeps track of all deltas that are currently animating, popped once anim complete
  const [popups, setPopups] = useState({}); // Updates on resource change, keeps prev anims not yet done and adds for new changes

  // On change, display animation for resources added
  useEffect(() => {
    if (prevValues.current) {
      let valuesChanged = false;
      const deltas = {...anims.current};
      Object.keys(resources).forEach((key) => {
        const delta = resources[key] - prevValues.current[key];
        if (delta) {
          if (!(key in deltas)) {
            // Initialize array if empty
            deltas[key] = [];
          }
          valuesChanged = true; // Mark that at least one value has changed
          deltas[key].push(delta);
        }
      });

      if (valuesChanged) {
        prevValues.current = resources; // Update prevValues when checking for new deltas
        anims.current = deltas;
        // Set popups to object with keys and how much it changed e.g. { "Wood": [2, -1], "Brick": [1] }, etc
        setPopups(deltas);
      }
    } else {
      prevValues.current = resources;
    }
  }, [resources, popups]);

  if (!resources) return null;

  return (
    <>
      {Object.entries(resources).map(([key, value]) => (
        <>
          <Text
            fontWeight={600}
            key={key}
            color={findTileTypeByName(key).color}
          >
            {key + ": " + value}

            {!!popups?.[key] && popups[key].map((val: number, idx: number) => (
              <Box key={idx} position={'relative'} w={'full'}>
                <MotionBox
                  position={'absolute'}
                  textAlign={'center'}
                  w={'full'}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    y: [0, 10, 14],
                    scale: [1, 1.2]
                  }}
                  transition={{
                    duration: 3,
                  }}
                  onAnimationComplete={(e) => anims.current[key].pop()} /* remove played animation */
                >
                  {(val > 0 ? '+' : '') + val}
                </MotionBox>
              </Box>
            ))}
          </Text>
        </>
      ))}
    </>
  );
}
