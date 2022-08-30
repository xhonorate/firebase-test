import React, { useEffect, useCallback, useRef, useContext } from "react";
import { GameContext, GameState } from "./RoomInstance";
import { resourceTypes } from "./three/Tiles/Resource";
import { cubeRing, findTileByHex } from "./Board";
import { GameSettings } from "../cloudFirestore/GameLobby";

// Return list of all updates needed for state (rather than updating entire state every proc)
function procTiles(state: GameState, frequency: number): object {
  const updates = {turn: state.turn + 1};
  // TODO: something with this number
  const multiplier = 25 - frequency;

  // Update tiles with number of times proc'd and assign resources to owners
  state.board.tiles.forEach((tile, idx) => {
    if (tile.type !== 0 && tile.odds > Math.random() * multiplier) {
      updates["board/tiles/" + idx + "/procs"] = (tile.procs ?? 0) + 1;
      // If the tile is owned by a player, assign its resources
      if ("owner" in tile) {
        // Get level of tile based on neighboring hexes (check if there are upgrades / cities)
        const level = [
          tile,
          ...cubeRing(tile.hex, 1).map((hex) =>
            findTileByHex(state.board.tiles, hex)
          ),
        ].reduce((prev, tile) => {
          return !!tile && tile?.obj?.level > prev ? tile.obj.level : prev;
        }, 1);

        if (state.players[tile.owner]) {
          const type = resourceTypes[tile.type].name; // convert index of type to text name of type

          // Get value from other updates or from state if no updates for this resource are pending
          const prevVal =
            updates["/players/" + tile.owner + "/resources/" + type] ??
            state.players[tile.owner].resources?.[type] ?? 0;

          // Update resource yields individually
          updates["/players/" + tile.owner + "/resources/" + type] =
            prevVal + level; // give amt of related resource
        }
      }
    }
  });

  return updates;
}

// Count and record total points for each player
// Also check if any player has reached the number of points to win
function calcPoints(state: GameState, pointsToWin: number): object {
  const updates = {};

  const newPoints = {};
  state.board.tiles.forEach((tile) => {
    if (tile?.obj?.type === 'Settlement') {
      newPoints[tile.owner] = (newPoints[tile.owner] ?? 0) + 1 * tile.obj.level;
    }
  });

  Object.entries(newPoints).forEach(([key, val]) => {
    updates["/players/" + key + "/points"] = val;
    if (val >= pointsToWin) {
      // If any player has reached required points to win, record it in database
      // in the event of a tie, record winner1 and winner2 and winner3 ...
      updates["/winner"] = "/winner" in updates ? updates["/winner"] + 'and' + key : key;
    }
  });

  return updates;
}

export default function HostControl(settings: GameSettings) {
  const { data, set, update, paused } = useContext(GameContext);

  // Store data in ref rather than state so we do not need to remount tick loop on data change
  const dataRef = useRef(data);
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const hostTick = useCallback(() => {
    const state = dataRef.current;

    const updates = {
      // Proc Tiles
      ...procTiles(state, settings.yieldFrequency),
      // Calculate Points
      ...calcPoints(state, settings.pointsToWin)
    }    

    // Update state information -- tile procs and resources
    update(updates);

  }, [update, settings.yieldFrequency]);

  // Mount ticking timer to perform server actions
  useEffect(() => {
    // If paused, do not mount ticker
    if (paused) {
      console.log("Game Paused");
      return;
    }

    console.log("Host mounted");
    const interval = setInterval(() => {
      console.log("Host Tick!");
      hostTick();
    }, settings.tickRate ?? 5000);

    return () => {
      // Clear ticker on dismount or pause
      console.log("Host unmounted");
      clearInterval(interval);
    };
  }, [paused, hostTick, settings.tickRate]);

  return <></>;
}
