import React, { useEffect, useRef, useState } from "react";
import { UnitData } from "../../Units";
import { GroupProps } from "@react-three/fiber";
import { motion } from "framer-motion-3d";
import {
  HexCoords,
  indexToHex,
  cubeSubtract,
  cubeToPos,
  cubeDistance,
} from "../../helpers/hexGrid";
import { TileData, heightScale, tilePos } from '../Tiles/Tile';
import AnimatedCharacter, { ActionName } from '../gltfjsx/characters/AnimatedChar';
import { useTarget } from "../../MouseEvents";

interface UnitProps extends Omit<GroupProps, "type"> {
  unit: UnitData;
  tile: TileData;
}

export default function Unit({ unit, tile, ...props }: UnitProps) {
  const prevHex = useRef<HexCoords>(null);
  const [anim, setAnim] = useState<ActionName>('Idle');
  const [pos, setPos] = useState<number[]>(tilePos(tile.hex, tile.height));
  const [facing, setFacing] = useState<number>(0); // y-axis rotation

  // On moving to a new hex, update position and rotation
  useEffect(() => {
    if (!prevHex.current) {
      // First render, do not animate motion or run unneccessary calculations
      prevHex.current = tile.hex;
    } else {
      const newHex = tile.hex;
      if (cubeDistance(newHex, prevHex.current)) { // If position has actually changed
        // Convert hex coordinate to x, y, z coords
        setPos(tilePos(tile.hex, tile.height));

        const delta = cubeToPos(cubeSubtract(newHex, prevHex.current));
        // Determine rotation from hex
        setFacing(Math.atan2(delta[2], -delta[0]) - Math.PI/2);

        prevHex.current = newHex;
      }
    }
  }, [tile]);
  
  return (
    <motion.group
      {...useTarget('unit', unit )}
      scale={1}
      whileHover={{ scale: 1.2 }}
      initial={{
        opacity: 0,
        x: pos[0],
        y: 5,
        z: pos[2],
        rotateY: 0,
      }}
      animate={{
        opacity: 1,
        x: pos[0],
        y: 0.5 + tile.height * heightScale, // Based on height of current tile
        z: pos[2],
        rotateY: facing,
      }}
    >
      <AnimatedCharacter character={unit.type} anim={anim} {...props} />
    </motion.group>
  );
}
