import { GameContext, ResourceStates } from "../../RoomInstance";
import React, { useCallback, useContext, useMemo, useRef } from "react";
import { UnitAction, unitOptions } from "./unitOptions";
import CostButton from "../Tiles/CostButton";

interface UnitControlProps {
  uid: string;
}

// Display buttons to interact with unit once selected
export default function UnitControls({ uid }: UnitControlProps) {
  const { data, update, playerIndex } = useContext(GameContext);
  const resources = useMemo(
    () => data.players[playerIndex].resources,
    [data.players, playerIndex]
  );
  const hasPendingActions = useRef(false);

  const unit = data.units[uid];
  const tile = data.board.tiles[unit.hexIdx];

  const updateUnit = useCallback(
    (action: UnitAction, cost?: object) => {
      if (hasPendingActions.current) return;
      hasPendingActions.current = true;

      const updates = action(unit, tile);

      if (cost) {
        let updatedResources = {};
        Object.entries(resources).forEach(([key, value]) => {
          updatedResources[key] = Math.max(0, value - (cost[key] ?? 0));
        });
        // Subtract cost of build from player resources
        updates["/players/" + playerIndex + "/resources/"] = updatedResources;
      }

      update(updates).then(() => (hasPendingActions.current = false));
    },
    [unit, tile, update, resources, playerIndex]
  );

  //NOTE: most unit controls should be handled in Units file, since it has access to board info
  // Just do stuff like Automate / Delete unit here

  // Set resting button
  // defend?
  // other interactions

  return (
    <>
      {unitOptions.map((option, idx) => {
        if (option.req) {
          // If option has requirements
          option.req.forEach((req) => {
            if (!req(unit, tile)) {
              // If any requirement is not met, do not return button
              return null;
            }
          });
        }

        // All reqs have been met
        return (
          <CostButton
            key={idx}
            option={option}
            resources={resources}
            callback={updateUnit}
          />
        );
      })}
    </>
  );
}
