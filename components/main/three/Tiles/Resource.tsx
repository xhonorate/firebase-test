import { MeshProps } from '@react-three/fiber';
import DetailForestA from '../gltfjsx/objects/detail_forestA';
import DetailRocks from '../gltfjsx/objects/detail_rocks';
import DetailForestB from '../gltfjsx/objects/detail_forestB';
import DetailRocksSmall from '../gltfjsx/objects/detail_rocks_small';
import Mountain from '../gltfjsx/objects/mountain';
import Forest from '../gltfjsx/objects/forest';

export function findResourceIndexByName(name: string) {
  return resourceTypes.findIndex((tile) => tile.name === name);
}

export function findResourceTypeByName(name: string) {
  return resourceTypes.find((tile) => tile.name === name);
}

export const resourceTypes = [
  { name: "None", color: "#000000" },
  { name: "Wood", color: "#23A84D" },
  { name: "Ore", color: "#7776BC" },
  { name: "Food", color: "#4BD2BC" },
  { name: "Gold", color: "#D5CB89" },
];

interface ResourceProps extends Omit<MeshProps, 'type'> {
  type: number, 
  odds: number,
}

// If type is set, display resource of type, else return null
export default function Resource({ type, odds, ...props }: ResourceProps) {
  // Select which details should be displayed for resource
  const Mesh: (props: any) => JSX.Element = (() => { 
    switch (type) { //TODO: add hybrid resource types?
      case 1: // Wood
        switch (odds) {
          case 1:
            return DetailForestA
          case 2:
            return DetailForestB
          case 3:
            return Forest
        }
      case 2: // Ore
        switch (odds) {
          case 1:
            return DetailRocksSmall
          case 2:
            return DetailRocks
          case 3:
            return Mountain
        }
      case 3: // Food
        return (
          () => <mesh {...props}>
            <cylinderGeometry args={[0.5, 0.5, 0.1 * (odds+1)**2, 30]} />
            <meshStandardMaterial
              color={resourceTypes[type].color}
            />
          </mesh>
        )
      case 4: // Gold
        return null;
      default:
        return null;
    }
  })();

  if (!Mesh) {
    return null;
  } else {
    return <Mesh {...props} />
  }
}