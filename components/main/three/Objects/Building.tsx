import { GroupProps } from "@react-three/fiber";
import Market from "../gltfjsx/objects/market";
import { playerColors } from "../Tiles/Tile";
import Settlement from "./Settlement";
import Lumbermill from "../gltfjsx/objects/lumbermill";
import Mine from "../gltfjsx/objects/mine";
import FarmPlot from "../gltfjsx/objects/farm_plot";
import Barracks from "../gltfjsx/objects/barracks";
import { Billboard } from "@react-three/drei";
import React, { useMemo } from "react";
import Cloud from "../FX/Cloud";
import Archeryrange from '../gltfjsx/objects/archeryrange';
import Watchtower from "../gltfjsx/objects/watchtower";

interface DefaultStats {
  hp: number;
  str: number; // Defensive strength (dmg delt to attackers)
}

// Return default stats for building of given type
export function getBuildingStats(type: ObjectType): DefaultStats {
  if (type in defaultStats) {
    return defaultStats[type];
  } else {
    return defaultStats['default'];
  }
}

const defaultStats: { [key in ObjectType | 'default']?: DefaultStats } = {
  Settlement: {
    hp: 100,
    str: 5
  },
  default: {
    hp: 10,
    str: 1
  }
};

type ObjectType =
  | "Road"
  | "Settlement"
  | "Market"
  | "Lumbermill"
  | "Mine"
  | "Farm"
  | "Barracks"
  | "Archeryrange"
  | "Watchtower"

export interface Obj {
  type: ObjectType;
  hp?: number;
  str?: number;
  owner?: number;
  level?: number;
  t2c?: number; //Turns until construction is complete
}

interface BuildingProps extends GroupProps {
  obj: Obj;
}

export default function Building({
  obj,
  ...props
}: BuildingProps): JSX.Element {
  // Get JSX element of building to be shown based on type, level, etc.
  const buildingElem: JSX.Element = useMemo(() => {
    // If there is no object, return null
    if (!obj || !obj?.type) return null;

    switch (
      obj.type //TODO: add hybrid resource types?
    ) {
      case "Settlement":
        return (
          <Settlement
            level={obj?.level ?? 1 /* whether settlment has been upgraded */}
            color={playerColors[obj.owner] ?? null}
            {...props}
          />
        );
      case "Market":
        return <Market {...props} />;
      case "Lumbermill":
        return <Lumbermill {...props} />;
      case "Mine":
        return <Mine {...props} />;
      case "Farm":
        return <FarmPlot {...props} />;
      case "Barracks":
        return <Barracks {...props} />;
      case "Archeryrange":
        return <Archeryrange {...props} />;
      case "Watchtower":
        return <Watchtower {...props} />;
      default:
        return null;
    }
  }, [obj, props]);

  return (
    <>
      {obj?.t2c && (
        //TODO: improve this animation
        // Show cloud effect for building animation
        <Billboard
          follow={true}
          lockX={false}
          lockY={false}
          lockZ={false} // Lock the rotation on the z axis (default=false)
          position-y={props.position[1] + 0.5}
        >
          <Cloud
            scale={0.25}
            speed={3.5} // Rotation speed
            width={1} // Width of the full cloud
            depth={1.5} // Z-dir depth
            segments={20} // Number of particles
            opacity={obj.t2c / 5}
            color={"#9A7447"}
            depthTest={false}
            castShadow={false}
          />
        </Billboard>
      )}
      {buildingElem}
    </>
  );
}
