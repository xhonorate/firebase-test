import { Line } from "@react-three/drei";
import { GroupProps } from "@react-three/fiber";
import { cubeDirection, cubeToPos } from "../../helpers/hexGrid";

export interface BorderProps extends GroupProps {
  borders: boolean[];
  color: string;
}

export default function Borders({borders, color, ...props}: BorderProps) {
  return (
    <group {...props}> 
      { borders.map((hasBorder, idx) => {
        if (!hasBorder) return null;
        const edgePoint = cubeToPos(cubeDirection(idx));
        // Create line at edge, rotated by 90 degrees relative to direction towards edge
        return (
          <Line
            key={idx}            
            points={[
              [
                0.57 * (edgePoint[0] + edgePoint[2] * 0.55),
                0,
                0.57 * (edgePoint[2] - edgePoint[0] * 0.55),
              ],
              [
                0.57 * (edgePoint[0] - edgePoint[2] * 0.55),
                0,
                0.57 * (edgePoint[2] + edgePoint[0] * 0.55),
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