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

function normalDistance(dx: number, dy: number): number {
  return Math.sqrt(dx ** 2 + dy ** 2);
}

export default function Unit({ x, y, z, ...unit }: UnitProps) {
  const prevData = useRef<Partial<UnitProps>>(null);
  const transition = useRef<Transition>(null);
  const onMotionComplete = useRef<() => void>(null);
  const [motionPos, setMotionPos] = useState<
    Partial<{
      opacity?: number;
      x: number;
      y: number;
      z: number;
      rotateY: number;
    }>
  >({ x, y, z, rotateY: 0, opacity: 1 });
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
      const deltaZ = z - prevData.current.z;
      const delta = normalDistance(deltaX, deltaZ);
      if (unit.hp !== prevData.current.hp) {
        //TODO: probs set anims in db? idk
        if (unit.hp) {
          // Unit recieved damage, but not dead
          //TODO: obviously this is a bad way to do this... need better way to chain
          play("Block", false, { anim: "Idle", loop: true });
        } else {
          // Unit dying
          play("Defeat", false, null);
          transition.current = { duration: 1, ease: "linear" };
          setMotionPos({
            x: prevData.current.x,
            y: prevData.current.y,
            z: prevData.current.z,
            opacity: 0,
          });
        }
      }
      // Check if position has actually changed
      if (delta > 0) {
        // Rotate to face direction, then move
        // TODO: random 360s?
        const rotateY = Math.atan2(-deltaZ, deltaX) + Math.PI / 2;

        transition.current = { duration: 0.25, ease: "easeInOut" };
        setMotionPos({
          x: prevData.current.x,
          y: prevData.current.y,
          z: prevData.current.z,
          rotateY,
        });
        onMotionComplete.current = () => {
          play("Run", true);
          transition.current = { duration: delta, ease: "linear" };
          setMotionPos({ x, y, z, rotateY });
          onMotionComplete.current = () => {
            transition.current = { duration: 0.25, ease: "easeInOut" };
            play("Idle", true);
          };
        };
      }
    } // Update previous data
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
      animate={motionPos}
      transition={transition.current}
      onAnimationComplete={onMotionComplete.current}
    >
      {Model}
    </motion.group>
  );
}
