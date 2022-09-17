import React, { useEffect, useMemo, useRef, useState } from "react";
import { UnitData } from "../../Units";
import { motion } from "framer-motion-3d";
import { useTarget } from "../../MouseEvents";
import useAnimatedChar from "../gltfjsx/characters/useAnimatedChar";
import { Transition } from "framer-motion";

interface UnitProps extends UnitData {
  x: number;
  y: number;
  z: number;
}

function normalDistance(
  dx: number,
  dy: number,
): number {
  return Math.sqrt(dx ** 2 + dy ** 2);
}

export default function Unit({ x, y, z, ...unit }: UnitProps) {
  const prevData = useRef<Partial<UnitProps>>(null);
  const transition = useRef<Transition>(null);
  const onMotionComplete = useRef<() => void>(null);
  const [motionPos, setMotionPos] = useState<{
    x: number;
    y: number;
    z: number;
    rotateY: number;
  }>({ x, y, z, rotateY: 0 });
  const { play, Model } = useAnimatedChar(unit.type);

  /*
  useEffect(() => {
    if (!prevData.current) {
      // If not mounted yet, do not play animations
      return;
    }
    if (unit.hp) {
      // Unit recieved damage, but not dead
      //TODO: obviously this is a bad way to do this... need better way to chain
      anim.play("Block", false, { anim: 'Idle', loop: true });
    } else {
      // Unit dying
      anim.play("Defeat", false, null);
      motionControls
        .start(
          {
            opacity: 0,
          },
          { duration: 2, ease: "linear" }
      )
    }
  }, [anim, motionControls, unit]); */

  // On moving to a new hex, update position and rotation
  useEffect(() => {
    console.log("effect!");
    if (!prevData.current) {
      console.log("Initial unit motion");
      // First render, do not animate motion or run unneccessary calculations
    } else {
      const deltaX = x - prevData.current.x;
      const deltaY = y - prevData.current.y;
      const delta = normalDistance(
        deltaX,
        deltaY
      );
      // Check if position has actually changed
      if (delta > 0) {
        // Rotate to face direction, then move
        const rotateY = Math.atan2(deltaY, -deltaX) - Math.PI / 2;
        console.log(rotateY);

        transition.current = { duration: 0.25, ease: "easeInOut" };
        setMotionPos({
          x: prevData.current.x,
          y: prevData.current.y,
          z: prevData.current.z,
          rotateY,
        });
        onMotionComplete.current = () => {
          console.log("hello?", x, y, z);
          play("Run", true);
          transition.current = { duration: delta, ease: "linear" };
          setMotionPos({ x, y, z, rotateY });
          onMotionComplete.current = () => {
            play("Idle", true);
          };
        };
      }
    }// Update previous data
    prevData.current = { x, y, z, hp: unit.hp };
  }, [play, x, y, z, unit.hp]);

  return (
    <motion.group
      {...useTarget({ type: "unit", val: unit })}
      scale={1}
      whileHover={{ scale: 1.2 }}
      initial={{
        opacity: 0,
        x: x,
        y: 5,
        z: z,
        rotateY: 0,
      }}
      animate={{
        opacity: 1,
        ...motionPos,
      }}
      transition={transition.current}
      onAnimationComplete={onMotionComplete.current}
    >
      {Model}
    </motion.group>
  );
}
