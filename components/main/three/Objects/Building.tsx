import { GroupProps } from "@react-three/fiber";
import Market from "../gltfjsx/objects/market";
import { Obj, playerColors } from '../Tiles/Tile';
import Settlement from './Settlement';
import Lumbermill from '../gltfjsx/objects/lumbermill';
import Mine from '../gltfjsx/objects/mine';
import FarmPlot from '../gltfjsx/objects/farm_plot';

interface BuildingProps extends GroupProps {
  obj: Obj
}

export default function Building({obj, ...props}: BuildingProps): JSX.Element {
  // If there is no object, return null
  if (!obj || !obj?.type) return null;

  if (obj.type === "Settlement") {
    return <Settlement
      level={
        obj?.level ?? 1 /* whether settlment has been upgraded */
      }
      color={playerColors[obj.owner] ?? null}
      {...props}
    />
  }

  // Select which details should be displayed for resource
  const Mesh: (props: any) => JSX.Element = (() => { 
    switch (obj.type) { //TODO: add hybrid resource types?
      case 'Market':
        return Market
      case 'Lumbermill':
        return Lumbermill
      case 'Mine':
        return Mine
      case 'Farm':
        return FarmPlot
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