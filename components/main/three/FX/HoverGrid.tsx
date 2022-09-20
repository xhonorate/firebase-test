import React, { useEffect, useState } from "react";
import { Instance, Instances } from '@react-three/drei';
import { motion } from 'framer-motion-3d';
import { tileSize, tilePos } from '../Tiles/Tile';
import { Target } from "../../MouseEvents";
import { useRealtime } from '../../../realtimeDatabase/Hooks/useRealtime';
import { GameState } from "../../RoomInstance";
import { pathfindTo } from "../../helpers/pathfinding";

interface HoverGridProps {
  id: string;
  playerIndex: number;
  target: Target;
  hovered: Target;
}

export default function HoverGrid({id, playerIndex, target, hovered}: HoverGridProps) {
  const { data } = useRealtime<GameState>(`rooms/${id}`);
  const [highlighted, setHighlighted] = useState<number[]>([]);

  const handleClick = (idx: number) => {

  }

  useEffect(() => {
    // If nothing is hovered, set highligted to []
    if (!hovered) {
      setHighlighted([]);
      return;
    } else {
      const hoveredIdx = hovered.type === 'unit' ? data?.units?.[hovered.val].hexIdx : hovered.val
      if (target && target.type === 'unit') {
        const targetIdx = data?.units?.[target.val].hexIdx;
        // Show unit pathfinding
        const path = pathfindTo(data, targetIdx, hoveredIdx, playerIndex);
        if (path) {
          setHighlighted(path);
          return;
        } else {
          // TODO: pathfind to closest point, maybe highlight the issue?
          setHighlighted([]);
          return;
        }
      } else {
        // No target selected, highlight tile itself
        if (hovered.type === 'tile') {
          setHighlighted([hovered.val]);
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hovered, playerIndex, target]);
  
  return (
    <Instances>
      <circleGeometry args={[tileSize, 6]} />
      <motion.meshStandardMaterial
        whileHover={{
          // TODO: Show attack / move / range attack icon
          opacity: 1
        }}
        depthWrite={false}
        // depthWrite - Whether rendering this material has any effect on the depth buffer. Default is true.
        // When drawing 2D overlays it can be useful to disable the depth writing in order to layer several
        // things together without creating z-index artifacts.
        transparent={true}
        opacity={0.5}
        color={'white'}
      />
      {highlighted.map((tileIdx) => {
        const tile = data?.board?.tiles?.[tileIdx];
        if (!tile) {
          return null;
        }

        const pos = tilePos(tile.hex, tile.height, true);
        return (
          <Instance
            raycast={null /* allow click through */ }
            key={tileIdx}
            position={pos}
            rotation={[-Math.PI / 2, 0, Math.PI / 2]}
          />
        );
      })}
    </Instances>
  );
}
