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
import { TileData, heightScale, tilePos } from '../Tiles/Tile';
import AnimatedCharacter, { ActionName } from '../gltfjsx/characters/AnimatedChar';
import { useTarget } from "../../MouseEvents";
import { useAnimationControls } from "framer-motion";

interface UnitProps extends Omit<GroupProps, "type"> {
  unit: UnitData;
  height: number; // Height of current tile
}

export default function Unit({ unit, height, ...props }: UnitProps) {
  const prevHex = useRef<HexCoords>(null);
  const [anim, setAnim] = useState<ActionName>('Idle');
  const motionControls = useAnimationControls();
  const onMotionComplete = useRef(null);
  
  const pos = useMemo(() => tilePos(unit.hex, height), [unit.hex, height]);

  // On moving to a new hex, update position and rotation
  useEffect(() => {
    if (!prevHex.current) {
      // First render, do not animate motion or run unneccessary calculations
      prevHex.current = unit.hex;

      // Animate falling in from the sky
      motionControls.start({
        opacity: 1,
        x: pos[0],
        y: pos[1],
        z: pos[2],
      });
    } else {
      if (cubeDistance(unit.hex, prevHex.current)) { // If position has actually changed
        setAnim('Walk')

        // Animate change in hex
        motionControls.start({
          x: pos[0],
          z: pos[2],
        }, { duration: 1, ease: 'linear' });
        
        // Animate y, 2 parts jump up and down
        motionControls.start({
          y: 5,
        }, { duration: 0.5 }).then(() => motionControls.start({
          y: pos[1],
        }, { duration: 0.5 }));

        const delta = cubeToPos(cubeSubtract(unit.hex, prevHex.current));
        motionControls.start({
          rotateY: Math.atan2(delta[2], -delta[0]) - Math.PI/2
        });

        // Once character has finished walking, go back to idle
        onMotionComplete.current = () => {  
          setAnim('Idle');
        }

        prevHex.current = unit.hex;
      }
    }
  }, [motionControls, pos]);
  
  return (
    <motion.group
      {...useTarget({type: 'unit', val: unit})}
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
