import * as THREE from "three";
import React, { useRef, useState, useEffect, useMemo } from "react";
import Settlement from "../Settlement";
import Road from "../Road";
import HexWater from "../gltfjsx/tiles/hex_water";
import HexForestDetail from "../gltfjsx/tiles/hex_forest_detail";
import { randomInt, cubeScale } from "../../Board";
import { motion } from "framer-motion-3d";
import { useAnimation } from "framer-motion";
import HexRock from "../gltfjsx/tiles/hex_rock";
import HexForest from "../gltfjsx/tiles/hex_forest";
import HexSand from '../gltfjsx/tiles/hex_sand';
import useRoad from './useRoad';
import HexForestRoadA from '../gltfjsx/tiles/hex_forest_roadA';
import HexForestRoadB from '../gltfjsx/tiles/hex_forest_roadB';
import HexForestRoadC from '../gltfjsx/tiles/hex_forest_roadC';
import HexForestRoadD from '../gltfjsx/tiles/hex_forest_roadD';
import HexForestRoadE from '../gltfjsx/tiles/hex_forest_roadE';
import HexForestRoadF from '../gltfjsx/tiles/hex_forest_roadF';
import HexForestRoadG from '../gltfjsx/tiles/hex_forest_roadG';
import HexForestRoadH from '../gltfjsx/tiles/hex_forest_roadH';
import HexForestRoadI from '../gltfjsx/tiles/hex_forest_roadI';
import HexForestRoadJ from '../gltfjsx/tiles/hex_forest_roadJ';
import HexForestRoadK from '../gltfjsx/tiles/hex_forest_roadK';
import HexForestRoadL from '../gltfjsx/tiles/hex_forest_roadL';
import HexForestRoadM from '../gltfjsx/tiles/hex_forest_roadM';
import HexRockRoadA from '../gltfjsx/tiles/hex_rock_roadA';
import HexRockRoadB from '../gltfjsx/tiles/hex_rock_roadB';
import HexRockRoadC from '../gltfjsx/tiles/hex_rock_roadC';
import HexRockRoadD from '../gltfjsx/tiles/hex_rock_roadD';
import HexRockRoadE from '../gltfjsx/tiles/hex_rock_roadE';
import HexRockRoadF from '../gltfjsx/tiles/hex_rock_roadF';
import HexRockRoadG from '../gltfjsx/tiles/hex_rock_roadG';
import HexRockRoadH from '../gltfjsx/tiles/hex_rock_roadH';
import HexRockRoadI from '../gltfjsx/tiles/hex_rock_roadI';
import HexRockRoadJ from '../gltfjsx/tiles/hex_rock_roadJ';
import HexRockRoadK from '../gltfjsx/tiles/hex_rock_roadK';
import HexRockRoadL from '../gltfjsx/tiles/hex_rock_roadL';
import HexRockRoadM from '../gltfjsx/tiles/hex_rock_roadM';
import HexSandRoadA from '../gltfjsx/tiles/hex_sand_roadA';
import HexSandRoadB from '../gltfjsx/tiles/hex_sand_roadB';
import HexSandRoadC from '../gltfjsx/tiles/hex_sand_roadC';
import HexSandRoadD from '../gltfjsx/tiles/hex_sand_roadD';
import HexSandRoadE from '../gltfjsx/tiles/hex_sand_roadE';
import HexSandRoadF from '../gltfjsx/tiles/hex_sand_roadF';
import HexSandRoadG from '../gltfjsx/tiles/hex_sand_roadG';
import HexSandRoadH from '../gltfjsx/tiles/hex_sand_roadH';
import HexSandRoadI from '../gltfjsx/tiles/hex_sand_roadI';
import HexSandRoadJ from '../gltfjsx/tiles/hex_sand_roadJ';
import HexSandRoadK from '../gltfjsx/tiles/hex_sand_roadK';
import HexSandRoadL from '../gltfjsx/tiles/hex_sand_roadL';
import HexSandRoadM from '../gltfjsx/tiles/hex_sand_roadM';
import DetailForestA from '../gltfjsx/objects/detail_forestA';
import DetailRocks from '../gltfjsx/objects/detail_rocks';
import DetailHill from '../gltfjsx/objects/detail_hill';
import DetailRocksSmall from '../gltfjsx/objects/detail_rocks_small';
import DetailForestB from '../gltfjsx/objects/detail_forestB';

/* eslint-disable react-hooks/exhaustive-deps */

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

type TileElement = (props: JSX.IntrinsicElements["group"]) => JSX.Element;

interface BiomeProps {
  name: string;
  tile: {
    default: TileElement,
    detail?: TileElement,
    road?: TileElement[],
    transition?: TileElement[],
  },
}

export const biomeTypes: BiomeProps[] = [
  { name: "Water", tile: {
    default: HexWater
  }},
  { name: "Forest", tile: {
    default: HexForest,
    detail: HexForestDetail,
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
    transition: []
  }},
  { name: "Rock", tile: {
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
    ]
  } },
  { name: "Sand", tile: {
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
    ]
  } },
  { name: "Snow", tile: null },
];

export const playerColors = [
  "red",
  "blue",
  "green",
  "brown",
  "purple",
  "yellow",
  "teal",
  "orange",
];

export interface HexCoords {
  q: number;
  r: number;
  s: number;
}

export interface Obj {
  type: string;
  owner?: number;
  level?: number;
}

export interface TileData {
  index?: number;
  type: number; // Yield type
  biome?: number;
  height?: number;
  detail?: boolean;
  transition?: number;
  hex: HexCoords;
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
  hex,
  type,
  procs,
  biome = 0,
  height = 0,
  odds,
  obj,
  owner,
  onClick,
}: TileData & { onClick: any }) {
  const pos = useMemo(
    () =>
      cubeToPos(
        cubeScale(hex, 1.15 /*scale for difference in size of hex mesh */)
      ),
    [hex]
  );

  const heightScale = 1 + height * 0.1;

  // Select which details should be displayed for resource
  const ResourceDetail = useMemo(() => {
    switch (type) {
      case 1:
        return DetailForestA
      case 2:
        return DetailRocks
      case 3:
        return DetailRocksSmall
      case 4:
        return DetailHill
      case 5:
        return DetailForestB
      default:
        return null;
    }
  }, [type]);

  const tileProc = useAnimation();
  const [hovered, hover] = useState(false);

  // If tile has a road on it, figure out which shape it should be based on neighbors
  const [roadType, orientation] = useRoad(hex, obj);
  
  const TileGraphic = useMemo(() => 
    roadType ? biomeTypes[biome].tile.road[roadType] : biomeTypes[biome].tile.default
  ,[roadType]);

  //When procs increases, this has been rolled, play animation
  useEffect(() => {
    if (procs) {
      tileProc.start({
        opacity: [0, 0.6, 0.6, 0],
      });
    }
  }, [procs]);
  //useFrame((state, delta) => (ref.current.rotation.x += 0.01))
  return (
    <>
      <group position={pos} dispose={null}>
        {type !== 0 && (
          // Yield Proc Display //
          <mesh position={[0, 0.675 * heightScale, 0]}>
            <cylinderGeometry args={[1.0, 1.0, 0.675 * heightScale, 6]} />
            <motion.meshStandardMaterial
              initial={{ opacity: 0 }}
              animate={tileProc}
              transition={{ duration: 3, ease: "easeOut" }}
              transparent={true}
              color={"white"}
            />
          </mesh>
        )}

        <mesh position={[0, 0.5 * heightScale, 0]}>
          <cylinderGeometry args={[1.16, 1.16, 1.01 * heightScale, 6]} />
          <motion.meshStandardMaterial
            animate={{ opacity: hovered ? 0.2 : 0 }}
            transition={{ duration: hovered ? 0.05 : 0.4, ease: "easeOut" }}
            transparent={true}
            color={"black"}
          />
        </mesh>

        {/* Render tile resources */}
        {!!ResourceDetail && <ResourceDetail position={[0, heightScale, 0]}/>}

        {/* Render buildings */}
        {!!obj && (
          <>
            {obj.type === "Settlement" && (
              <Settlement
                level={
                  obj?.level ?? 1 /* whether settlment has been upgraded */
                }
                color={playerColors[obj?.owner ?? owner]}
                position={[0, heightScale, 0]}
                castShadow={true}
              />
            )}
          </>
        )}

        {/* hex has two parts, bottom/water level cylinder, then top 'tile' graduated cylinder
      TODO: Combine into one mesh
      */}
        <TileGraphic
          rotation-y={-orientation * Math.PI / 3}
          scale={[1, heightScale, 1]}
          onClick={(event) => {
            if (type !== 0) onClick();
          }}
          onPointerOver={(event) => {
            event.stopPropagation();
            hover(true);
          }}
          onPointerOut={(event) => hover(false)}
        />
      </group>
    </>
  );
}
