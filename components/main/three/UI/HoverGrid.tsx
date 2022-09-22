import React, { useEffect, useState } from "react";
import { Instance, Instances } from "@react-three/drei";
import { tileSize, tilePos } from "../Tiles/Tile";
import { Target } from "../../MouseEvents";
import { useRealtime } from "../../../realtimeDatabase/Hooks/useRealtime";
import { GameState } from "../../RoomInstance";
import { pathfindTo } from "../../helpers/pathfinding";

interface HoverGridProps {
  id: string;
  playerIndex: number;
  target: Target;
  hovered: Target;
}

export default function HoverGrid({
  id,
  playerIndex,
  target,
  hovered,
}: HoverGridProps) {
  const { data } = useRealtime<GameState>(`rooms/${id}`);
  const [targeted, setTargeted] = useState<number>(); // Which tile is targeted
  const [highlighted, setHighlighted] = useState<number[]>([]);

  useEffect(() => {
    // If nothing is hovered, set highligted to []
    if (!hovered || !data) {
      setHighlighted([]);
      return;
    } else {
      const hoveredIdx =
        hovered.type === "unit"
          ? data?.units?.[hovered.val].hexIdx
          : hovered.val;
      if (target && target.type === "unit") {
        const currentIdx = data?.units?.[target?.val]?.hexIdx ?? null;
        // Make sure unit still exists
        if (currentIdx === null) {
          setHighlighted([]);
          setTargeted(null);
          return;
        }
        // Whichever tile is clicked on (pathfinding final goal)
        setTargeted(data.units[target?.val]?.targetIdx ?? currentIdx);
        // Show unit pathfinding
        const path = pathfindTo(data, currentIdx, hoveredIdx, playerIndex);
        if (path) {
          path.pop();
          setHighlighted(path);
          return;
        } else {
          // TODO: pathfind to closest point, maybe highlight the issue?
          setHighlighted([]);
          setTargeted(null);
          return;
        }
      } else {
        setTargeted(null);
        setHighlighted([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hovered, playerIndex, target, data?.units?.[target?.val]?.hexIdx]);

  return (
    <Instances>
      <circleGeometry args={[tileSize, 6]} />
      <meshStandardMaterial
        depthTest={false}
        // depthWrite - Whether rendering this material has any effect on the depth buffer. Default is true.
        // When drawing 2D overlays it can be useful to disable the depth writing in order to layer several
        // things together without creating z-index artifacts.
        transparent={true}
        opacity={0.8}
        color={"white"}
      />
      {(highlighted.includes(targeted) ? highlighted : highlighted.concat(targeted)).map((tileIdx) => {
        const tile = data?.board?.tiles?.[tileIdx];
        if (!tile) {
          return null;
        }

        const pos = tilePos(tile.hex, tile.height, true);
        return (
          <Instance
            raycast={null /* allow click through */}
            color={tileIdx === targeted ? 'red' : 'white'}
            key={tileIdx}
            position={pos}
            rotation={[-Math.PI / 2, 0, Math.PI / 2]}
          />
        );
      })}
    </Instances>
  );
}