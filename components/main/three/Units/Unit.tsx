import React, { useEffect, useRef, useState } from "react";
import AnimatedCharacter from "../gltfjsx/characters/AnimatedChar";
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
import { TileData, heightScale } from '../Tiles/Tile';

interface UnitProps extends UnitData, Omit<GroupProps, "type"> {
  tile: TileData;
}

export default function Unit({ type, hexIdx, tile, ...props }: UnitProps) {
  const prevHex = useRef<HexCoords>(null);
  const [pos, setPos] = useState<number[]>(cubeToPos(indexToHex(hexIdx)));
  const [facing, setFacing] = useState<number>(0); // y-axis rotation

  // On moving to a new hex, update position and rotation
  useEffect(() => {
    if (!prevHex.current) {
      // First render, do not animate motion or run unneccessary calculations
      prevHex.current = indexToHex(hexIdx);
    } else {
      const newHex = indexToHex(hexIdx);
      if (cubeDistance(newHex, prevHex.current)) { // If position has actually changed
        // Convert hex coordinate to x, y, z coords
        setPos(cubeToPos(newHex));

        const delta = cubeToPos(cubeSubtract(newHex, prevHex.current));
        // Determine rotation from hex
        if (delta[2]) { // Avoid division by 0
          setFacing(Math.atan(delta[0] / delta[2]));
        }

        prevHex.current = newHex;
      }
    }
  }, [hexIdx, tile]);
  
  return (
    <motion.group
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
      <AnimatedCharacter character={type} anim={"Idle"} {...props} />
    </motion.group>
  );
}
