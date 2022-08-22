import { GroupProps, MeshProps } from '@react-three/fiber';
export function findResourceTypeByName(name: string) {
  return resourceTypes.find((tile) => tile.name === name);
}

export const resourceTypes = [
  { name: "None", color: "#000000" },
  { name: "Wood", color: "#23A84D" },
  { name: "Brick", color: "#A30000" },
  { name: "Wheat", color: "#DBA11A" },
  { name: "Ore", color: "#333F71" },
  { name: "Sheep", color: "#4BD2BC" },
  { name: "Gold", color: "#D5CB89" },
];

interface ResourceProps extends Omit<MeshProps, 'type'> {
  type: number, 
  odds: number,
}

// If type is set, display resource of type, else return null
export default function Resource({ type, odds, ...props }: ResourceProps) {
  // Select which details should be displayed for resource
  /*switch (type) {
    case 1: // Wood
      return DetailForestA
    case 2: // Brick
      return DetailRocks
    case 3: // Wheat
      return DetailRocksSmall
    case 4: // Ore
      return DetailHill
    case 5: // Sheep
      return DetailForestB
    case 6: // Gold
      return DetailForestB
    default:
      return null;
  } */

  if (type === 0 || type === 6) return null;

  return (
    <mesh {...props}>
      <cylinderGeometry args={[0.5, 0.5, 0.1 * (odds+1)**2, 30]} />
      <meshStandardMaterial
        color={resourceTypes[type].color}
      />
    </mesh>
  )
}