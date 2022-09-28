import { Text, Div, DivProps } from "react-native-magnus";
//import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { ResourceStates } from "../RoomInstance";
import { resourceTypes } from '../three/Tiles/Resource';

//const MotionBox = motion<Omit<DivProps, "transition">>(Div);

// Show current counts of all resources owned by player
export default function ResourceDisplay(resources: ResourceStates) {
  const prevValues = useRef(null);
  const anims = useRef({}); // Keeps track of all deltas that are currently animating, popped once anim complete
  const [popups, setPopups] = useState({}); // Updates on resource change, keeps prev anims not yet done and adds for new changes

  // On change, display animation for resources added
  /* useEffect(() => {
    if (prevValues.current) {
      let valuesChanged = false;
      const deltas = {...anims.current};
      resourceTypes.forEach(({name}) => {
        const delta = resources[name] - prevValues.current[name];
        if (delta) {
          if (!(name in deltas)) {
            // Initialize array if empty
            deltas[name] = [];
          }
          valuesChanged = true; // Mark that at least one value has changed
          deltas[name].push(delta);
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
  }, [resources, popups]); */

  if (!resources) return null;

  return (
    <Div alignItems={'flex-end'} row px={4} justifyContent={'space-between'} >
      {resourceTypes.map(({name, color}, idx) => {
        if (name === "None") return null;
        return (
          <Text
            h={'100%'}
            selectable={false}
            fontWeight={'700'}
            key={idx}
            color={color}
          >
            {name + ": " + resources[name]}

            {!!popups?.[name] && popups[name].map((val: number, idx: number) => (
              <Div key={idx} position={'relative'} w={'100%'}>
                <Div
                  position={'absolute'}
                  w={'100%'}
                  /* animate={{
                    opacity: [0, 1, 1, 0],
                    y: [0, 10, 14],
                    scale: [1, 1.2]
                  }}
                  transition={{
                    duration: 3,
                  }}
                  onAnimationComplete={(e) => anims.current[name].pop() } /* remove played animation */
                >
                  <Text textAlign={'center'}>{(val > 0 ? '+' : '') + val}</Text>
                </Div>
              </Div>
            ))}
          </Text> )
        })}
    </Div>
  );
}
