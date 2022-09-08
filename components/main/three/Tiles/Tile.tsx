import React, { useRef, useState, useEffect, useMemo } from "react";
import { randomInt, cubeScale } from "../../Board";
import { motion } from "framer-motion-3d";
import { useAnimation } from "framer-motion";
import useRoad from "./useRoad";
import Resource from "./Resource";
import Borders from './Borders';
import Building from "../Objects/Building";
import HexForestRoadA from "../gltfjsx/tiles/hex_forest_roadA";
import HexForestRoadB from "../gltfjsx/tiles/hex_forest_roadB";
import HexForestRoadC from "../gltfjsx/tiles/hex_forest_roadC";
import HexForestRoadD from "../gltfjsx/tiles/hex_forest_roadD";
import HexForestRoadE from "../gltfjsx/tiles/hex_forest_roadE";
import HexForestRoadF from "../gltfjsx/tiles/hex_forest_roadF";
import HexForestRoadG from "../gltfjsx/tiles/hex_forest_roadG";
import HexForestRoadH from "../gltfjsx/tiles/hex_forest_roadH";
import HexForestRoadI from "../gltfjsx/tiles/hex_forest_roadI";
import HexForestRoadJ from "../gltfjsx/tiles/hex_forest_roadJ";
import HexForestRoadK from "../gltfjsx/tiles/hex_forest_roadK";
import HexForestRoadL from "../gltfjsx/tiles/hex_forest_roadL";
import HexForestRoadM from "../gltfjsx/tiles/hex_forest_roadM";
import HexRockRoadA from "../gltfjsx/tiles/hex_rock_roadA";
import HexRockRoadB from "../gltfjsx/tiles/hex_rock_roadB";
import HexRockRoadC from "../gltfjsx/tiles/hex_rock_roadC";
import HexRockRoadD from "../gltfjsx/tiles/hex_rock_roadD";
import HexRockRoadE from "../gltfjsx/tiles/hex_rock_roadE";
import HexRockRoadF from "../gltfjsx/tiles/hex_rock_roadF";
import HexRockRoadG from "../gltfjsx/tiles/hex_rock_roadG";
import HexRockRoadH from "../gltfjsx/tiles/hex_rock_roadH";
import HexRockRoadI from "../gltfjsx/tiles/hex_rock_roadI";
import HexRockRoadJ from "../gltfjsx/tiles/hex_rock_roadJ";
import HexRockRoadK from "../gltfjsx/tiles/hex_rock_roadK";
import HexRockRoadL from "../gltfjsx/tiles/hex_rock_roadL";
import HexRockRoadM from "../gltfjsx/tiles/hex_rock_roadM";
import HexSandRoadA from "../gltfjsx/tiles/hex_sand_roadA";
import HexSandRoadB from "../gltfjsx/tiles/hex_sand_roadB";
import HexSandRoadC from "../gltfjsx/tiles/hex_sand_roadC";
import HexSandRoadD from "../gltfjsx/tiles/hex_sand_roadD";
import HexSandRoadE from "../gltfjsx/tiles/hex_sand_roadE";
import HexSandRoadF from "../gltfjsx/tiles/hex_sand_roadF";
import HexSandRoadG from "../gltfjsx/tiles/hex_sand_roadG";
import HexSandRoadH from "../gltfjsx/tiles/hex_sand_roadH";
import HexSandRoadI from "../gltfjsx/tiles/hex_sand_roadI";
import HexSandRoadJ from "../gltfjsx/tiles/hex_sand_roadJ";
import HexSandRoadK from "../gltfjsx/tiles/hex_sand_roadK";
import HexSandRoadL from "../gltfjsx/tiles/hex_sand_roadL";
import HexSandRoadM from "../gltfjsx/tiles/hex_sand_roadM";
import HexForestWaterA from '../gltfjsx/tiles/hex_forest_waterA';
import HexForestWaterC from '../gltfjsx/tiles/hex_forest_waterC';
import HexForestWaterD from '../gltfjsx/tiles/hex_forest_waterD';
import HexRockWaterA from '../gltfjsx/tiles/hex_rock_waterA';
import HexRockWaterC from '../gltfjsx/tiles/hex_rock_waterC';
import HexRockWaterD from '../gltfjsx/tiles/hex_rock_waterD';
import HexSandWaterA from '../gltfjsx/tiles/hex_sand_waterA';
import HexSandWaterC from '../gltfjsx/tiles/hex_sand_waterC';
import HexSandWaterD from '../gltfjsx/tiles/hex_sand_waterD';
import HexWaterDetail from '../gltfjsx/tiles/hex_water_detail';
import HexForest from '../gltfjsx/tiles/hex_forest';
import HexRock from '../gltfjsx/tiles/hex_rock';
import HexSand from '../gltfjsx/tiles/hex_sand';
import HexEmptyDetail from '../gltfjsx/tiles/hex_empty_detail';
import { Obj } from '../Objects/Building';

/* eslint-disable react-hooks/exhaustive-deps */

type TileElement = (props: JSX.IntrinsicElements["group"]) => JSX.Element;

interface BiomeProps {
  name: string;
  tile: {
    default: TileElement;
    road?: TileElement[];
    transition?: TileElement[];
  };
}

// TODO: transition tiles
export const biomeTypes: BiomeProps[] = [
  {
    name: "Water",
    tile: {
      default: HexWaterDetail,
      transition: [
        HexForestWaterA,
        HexForestWaterC,
        HexForestWaterD,

        HexRockWaterA,
        HexRockWaterC,
        HexRockWaterD,

        HexSandWaterA,
        HexSandWaterC,
        HexSandWaterD,
      ],
    },
  },
  {
    name: "Forest",
    tile: {
      default: HexForest,
      road: [
        HexForestRoadA,
        HexForestRoadB,
        HexForestRoadC,
        HexForestRoadD,
        HexForestRoadE,
        HexForestRoadF,
        HexForestRoadG,
        HexForestRoadH,
        HexForestRoadI,
        HexForestRoadJ,
        HexForestRoadK,
        HexForestRoadL,
        HexForestRoadM,
      ],
    },
  },
  {
    name: "Rock",
    tile: {
      default: HexRock,
      road: [
        HexRockRoadA,
        HexRockRoadB,
        HexRockRoadC,
        HexRockRoadD,
        HexRockRoadE,
        HexRockRoadF,
        HexRockRoadG,
        HexRockRoadH,
        HexRockRoadI,
        HexRockRoadJ,
        HexRockRoadK,
        HexRockRoadL,
        HexRockRoadM,
      ],
    },
  },
  {
    name: "Sand",
    tile: {
      default: HexSand,
      road: [
        HexSandRoadA,
        HexSandRoadB,
        HexSandRoadC,
        HexSandRoadD,
        HexSandRoadE,
        HexSandRoadF,
        HexSandRoadG,
        HexSandRoadH,
        HexSandRoadI,
        HexSandRoadJ,
        HexSandRoadK,
        HexSandRoadL,
        HexSandRoadM,
      ],
    },
  },
  { name: "Snow", tile: null },
];

export const playerColors = [
  "red",
  "blue",
  "yellow",
  "brown",
  "purple",
  "green",
  "teal",
  "orange",
];

export interface HexCoords {
  q: number;
  r: number;
  s: number;
}


export interface TileData {
  index?: number;
  type: number; // Yield type
  biome?: number;
  height?: number;
  transition?: { type: number; orientation: number }; // Which type of transition based on neighboring biomes
  hex: HexCoords;
  borders?: boolean[]; // array of sides of this tile touching unowed terrirory (true if border; false if not)
  odds: number; //weighted likelyhood of being "rolled"
  obj?: Obj; //any building or object on this tile
  procs?: number; //how many times this tile has been "rolled", use listener
  owner?: number; //index of player owning this tile
}

export function cubeToPos(hex: HexCoords): [number, number, number] {
  return [
    Math.sqrt(3) * hex.q + (Math.sqrt(3) / 2) * hex.r,
    0,
    (3 / 2) * hex.r,
  ];
}

export default function Tile({
  index,
  hex,
  type,
  procs,
  biome = 0,
  height = 0,
  transition = null,
  odds,
  obj,
  owner,
  borders,
  onClick,
}: TileData & { onClick: any }) {
  const mounted = useRef(false);

  const pos: [number, number, number] = useMemo(() => {
    const pos = cubeToPos(
      cubeScale(hex, 1.15 /*scale for difference in size of hex mesh */)
    );
    pos.splice(1, 1, height * 0.1);
    return pos;
  }, [hex, height]);

  // Randomly rotate each tile some multiple of 60 deg
  const rotation = useMemo(() => (randomInt(6) * Math.PI) / 3, []);

  const tileProc = useAnimation();
  const [hovered, hover] = useState(false);

  // If tile has a road on it, figure out which shape it should be based on neighbors
  const [roadType, roadOrientation] = useRoad(index, obj);

  const TileGraphic = useMemo(
    () =>
      transition !== null
        ? biomeTypes[biome].tile.transition[transition.type]
        : roadType !== null
        ? biomeTypes[biome].tile.road[roadType]
        : biomeTypes[biome].tile.default,
    [biome, roadType, transition]
  );

  //When procs increases, this has been rolled, play animation
  useEffect(() => {
    if (mounted.current && procs) {
      tileProc.start({
        opacity: [0, 0.6, 0.6, 0],
      });
    }
  }, [procs]);

  //TODO: add useEffect for object type -> dust cloud / build animation

  useEffect(() => {
    // Mark component as mounted, allow animations to begin playing
    if (!mounted.current) {
      mounted.current = true;
    }
  }, []);

  //useFrame((state, delta) => (ref.current.rotation.x += 0.01))
  return (
    <>
      <group position={pos} dispose={null}>
        {!!borders && <Borders borders={borders} color={playerColors[owner]} /> }

        {type !== 0 && (
          // Yield Proc Display //
          <mesh position={[0, 1, 0]}>
            <cylinderGeometry args={[1.0, 1.0, 0.16, 6]} />
            <motion.meshStandardMaterial
              initial={{ opacity: 0 }}
              animate={tileProc}
              transition={{ duration: 3, ease: "easeOut" }}
              transparent={true}
              color={"white"}
            />
          </mesh>
        )}

        <mesh position={[0, 0.425, 0]}>
          <cylinderGeometry args={[1.16, 1.16, 1.16, 6]} />
          <motion.meshStandardMaterial
            animate={{ opacity: hovered ? 0.2 : 0 }}
            transition={{ duration: hovered ? 0.05 : 0.4, ease: "easeOut" }}
            transparent={true}
            color={"black"}
          />
        </mesh>

        {/* Render tile resources */}
        <Resource
          type={type}
          odds={odds}
          position={[0, 0.5, 0]}
          rotation={[0, rotation, 0]}
        />

        {/* Render buildings */}
        <Building 
          obj={obj} 
          rotation={[0, rotation, 0]}
          position={[0, 0.5, 0]}
          castShadow={true}
        />
        
        { /* dirt underneath tile */ }
        { height > 5 && <HexEmptyDetail scale-y={height * 0.2} position-y={-height*0.1}/> }

        <TileGraphic
          rotation-y={
            -((transition?.orientation ?? roadOrientation ?? 0) * Math.PI) / 3
          }
          scale-y={0.5}
          onClick={(event) => {
            event.stopPropagation();
            if (type !== 0) onClick();
          }}
          onPointerOver={(event) => {
            event.stopPropagation();
            hover(true);
          }}
          onPointerOut={() => hover(false)}
        />
      </group>
    </>
  );
}
