import { Line } from "@react-three/drei";
import { GroupProps } from "@react-three/fiber";
import { intToBools } from "../../helpers/borders";
import { cubeDirection, cubeToPos } from "../../helpers/hexGrid";
import { tileSize } from "./Tile";
import React from "react";

export interface BorderProps extends GroupProps {
  borders: number;
  color: string;
}

export default function Borders({borders, color, ...props}: BorderProps) {
  const distFromCenter = 0.5 * tileSize;
  const lineWidth = distFromCenter - 0.01;
  if (!borders) {
    return null;
  }

  return (
    <group {...props}> 
      { intToBools(borders).map((hasBorder, idx) => {
        if (!hasBorder) return null;

        const edgePoint = cubeToPos(cubeDirection(idx));
        // Create line at edge, rotated by 90 degrees relative to direction towards edge
        return (
          <Line
            key={idx}            
            points={[
              [
                distFromCenter * (edgePoint[0] + edgePoint[2] * lineWidth),
                0,
                distFromCenter * (edgePoint[2] - edgePoint[0] * lineWidth),
              ],
              [
                distFromCenter * (edgePoint[0] - edgePoint[2] * lineWidth),
                0,
                distFromCenter * (edgePoint[2] + edgePoint[0] * lineWidth),
              ],
            ]}
            color={color}
            dashed={false}
            lineWidth={5}
            transparent={true}
            opacity={0.6}
          />
        );
      })
    } 
    </group>)
}