import { Line } from "@react-three/drei";
import { cubeToPos } from './Tile';
import { cubeDirection } from '../../Board';

export default function Borders({borders, color}: {borders: boolean[], color: string}) {
  return (
    <group position={[0, 1.05, 0]}> 
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