import React, { useEffect, useCallback, useContext } from "react";
import { GameState } from "./RoomInstance";
import { resourceTypes } from "./three/Tiles/Resource";
import findClosestSettlement from "./helpers/findClosestSettlement";
import { getUnitStats } from "./Units";
import { snapshot, updateRoom } from "../realtimeDatabase/roomFunctions";
import { LobbyContext } from "../cloudFirestore/GameLobby";
import { stepTowardsTarget } from "./helpers/pathfinding";

// Return list of all updates needed for state (rather than updating entire state every proc)
function procTiles(state: GameState, frequency: number): object {
  const updates = { turn: state.turn + 1 };
  // TODO: something with this number
  const multiplier = 20 - frequency;

  // Update tiles with number of times proc'd and assign resources to owners
  state.board.tiles.forEach((tile, idx) => {
    if (tile?.obj?.t2c) {
      // If tile is under construction
      let newT2C = tile.obj.t2c - 1;
      if (newT2C === 0) {
        newT2C = null; // If construction is complete, remove t2c counter (set to null)
        updates["board/tiles/" + idx + "/obj/level"] =
          (tile.obj?.level ?? 0) + 1; // Increase level by 1 (enable)
      }
      updates["board/tiles/" + idx + "/obj/t2c"] = newT2C;
    }

    // Note: "owner" in tile -- requirement means that tiles will not show procs at all unless owned by a player
    if (
      "owner" in tile &&
      tile.type !== 0 &&
      tile.odds > Math.random() * multiplier
    ) {
      updates["board/tiles/" + idx + "/procs"] = (tile.procs ?? 0) + 1;
      // If the tile is owned by a player, assign its resources
      // if ("owner" in tile) { <-- moved to earlier if statement to hide procs on unowned tiles
      // Get level of tile based on neighboring hexes (check if there are upgrades / cities)
      let level = tile?.obj?.level ?? 0; //Default to level of object built on tile
      const ownerSettlement = findClosestSettlement(
        state.board.tiles,
        idx,
        tile.owner
      );
      // If a settlement was found
      if (ownerSettlement !== null) {
        // If more than one are equidistant, take the max of the levels
        if (Array.isArray(ownerSettlement)) {
          level += ownerSettlement.reduce(
            (prev, obj) => Math.max(prev, obj.level),
            0
          );
        } else {
          level += ownerSettlement.level; // Add value of settlement / city
        }
      }

      if (state.players[tile.owner]) {
        const type = resourceTypes[tile.type].name; // convert index of type to text name of type

        // Get value from other updates or from state if no updates for this resource are pending
        const prevVal =
          updates["/players/" + tile.owner + "/resources/" + type] ??
          state.players[tile.owner].resources?.[type] ??
          0;

        // Update resource yields individually
        updates["/players/" + tile.owner + "/resources/" + type] =
          prevVal + level; // give amt of related resource
      }
      //}
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
    if (tile?.obj?.type === "Settlement") {
      newPoints[tile.owner] = (newPoints[tile.owner] ?? 0) + 1 * tile.obj.level;
    }
  });

  Object.entries(newPoints).forEach(([key, val]) => {
    updates["/players/" + key + "/points"] = val;
    if (val >= pointsToWin) {
      // If any player has reached required points to win, record it in database
      // in the event of a tie, record winner1 and winner2 and winner3 ...
      updates["/winner"] =
        "/winner" in updates ? updates["/winner"] + "and" + key : key;
    }
  });

  return updates;
}

// TODO: let units update themselves individually! Just make sure no dupe updates (only let owner send updates?)

// Auto-move units towards their targets - return update object
function allUnitUpdates(state: GameState) {
  const updates = {};
  // If unit has pathfinding set
  Object.values(state?.units ?? {}).forEach((unit) => {
    if (unit.targetIdx && (unit.actions || unit.moves)) {
      // If unit target and has actions / moves, perform pathfinding
      Object.assign(updates, stepTowardsTarget(state, unit));
    }

    const stats = getUnitStats(unit.type);

    // If unit is resting
    if (unit.action === 'rest') {
      // Increase up to max hp
      unit.hp = Math.min(stats.hp, unit.hp + 1 + Math.floor(stats.hp / 10));
      if (updates["/units/" + unit.uid]) {
        updates["/units/" + unit.uid].hp = unit.hp;
      } else {
        updates["/units/" + unit.uid + "/hp"] = unit.hp;
      }
      if (unit.hp === stats.hp) {
        // If unit reaches max hp
        unit.action = null;
        if (updates["/units/" + unit.uid]) {
          updates["/units/" + unit.uid].action = null;
        } else {
          updates["/units/" + unit.uid + "/action"] = null;
        }
      }
    }

    // Reset unit movement range and actions - mutate unit object inside of update
    if (unit.actions < stats.actions) {
      if (updates["/units/" + unit.uid]) {
        updates["/units/" + unit.uid].actions = stats.actions;
      } else {
        updates["/units/" + unit.uid + "/actions"] = stats.actions;
      }
    }
    if (unit.moves < stats.moves) {
      if (updates["/units/" + unit.uid]) {
        updates["/units/" + unit.uid].moves = stats.moves;
      } else {
        updates["/units/" + unit.uid + "/moves"] = stats.moves;
      }
    }
  });
  return updates;
}

export default function HostControl() {
  const { id, settings, paused } = useContext(LobbyContext);

  const hostTick = useCallback(() => {
    // Get data at moment of tick (no need to listen constantly)
    snapshot(id).then((state: GameState) => {
      const updates = {
        // Proc Tiles
        ...procTiles(state, settings.yieldFrequency),
        // Calculate Points
        ...calcPoints(state, settings.pointsToWin),
        // Move Units that have targets set
        ...allUnitUpdates(state),
      };

      // Update state information -- tile procs and resources
      updateRoom(id, updates);
    });
  }, [id, settings.yieldFrequency, settings.pointsToWin]);

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
