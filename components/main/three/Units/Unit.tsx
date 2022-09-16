import React, { useEffect, useMemo, useRef, useState } from "react";
import { UnitData } from "../../Units";
import { GroupProps } from "@react-three/fiber";
import { motion } from "framer-motion-3d";
import {
  HexCoords,
  cubeSubtract,
  cubeToPos,
  cubeDistance,
} from "../../helpers/hexGrid";
import { TileData, tilePos } from "../Tiles/Tile";
import AnimatedCharacter, {
  ActionName,
} from "../gltfjsx/characters/AnimatedChar";
import { useTarget } from "../../MouseEvents";
import { useAnimationControls } from "framer-motion";

interface UnitProps extends Omit<GroupProps, "type"> {
  unit: UnitData;
  tile: TileData;
}

export default function Unit({ unit, tile, ...props }: UnitProps) {
  const prevHex = useRef<HexCoords>(null);
  const prevHeight = useRef<number>(0);
  const [anim, setAnim] = useState<ActionName>("Idle");
  const motionControls = useAnimationControls();
  const onMotionComplete = useRef(null);

  const pos = useMemo(() => tilePos(tile.hex, tile.height, true), [tile]);

  useEffect(() => {
    if (!prevHex.current) {
      // If not mounted yet, do not play animations
      return;
    }
    if (unit.hp) {
      // Unit recieved damage, but not dead
      //TODO: obviously this is a bad way to do this... need better way to chain
      setAnim("Block");
    } else {
      // Unit dying
      setAnim("Defeat");
      motionControls
        .start(
          {
            opacity: 0,
          },
          { duration: 2, ease: "linear" }
      )
    }
  }, [unit.hp]);

  // On moving to a new hex, update position and rotation
  useEffect(() => {
    if (!prevHex.current) {
      // First render, do not animate motion or run unneccessary calculations
      prevHex.current = tile.hex;
      prevHeight.current = pos[1];

      // Animate falling in from the sky
      motionControls.start({
        opacity: 1,
        x: pos[0],
        y: pos[1],
        z: pos[2],
      });
    } else {
      const newHex = tile.hex;
      const dist = cubeDistance(newHex, prevHex.current);
      // Check if position has actually changed
      if (dist > 0) {
        const delta = cubeToPos(cubeSubtract(newHex, prevHex.current));
        // Rotate to face direction, then move
        motionControls
          .start({
            rotateY: Math.atan2(delta[2], -delta[0]) - Math.PI / 2,
          })
          .then(() => {
            // If position has actually changed
            setAnim("Run");
            // Animate change in hex
            motionControls
              .start(
                {
                  x: pos[0],
                  y: pos[1], // Animate y, 2 parts jump up and down
                  //TODO: bounce multiple times if moving multiple tiles
                  z: pos[2],
                },
                { duration: dist, ease: "linear" }
              )
              .then(() => {
                // Once character has finished walking, go back to idle
                prevHeight.current = pos[1];
                prevHex.current = newHex;
                setAnim("Idle");
              });
          });
      }
    }
  }, [motionControls, pos, tile]);

  return (
    <motion.group
      {...useTarget({ type: "unit", val: unit })}
      scale={1}
      whileHover={{ scale: 1.2 }}
      initial={{
        opacity: 0,
        x: pos[0],
        y: 5,
        z: pos[2],
        rotateY: 0,
      }}
      animate={motionControls}
      onAnimationComplete={onMotionComplete.current}
    >
      <AnimatedCharacter character={unit.type} anim={anim} {...props} />
    </motion.group>
  );
}
