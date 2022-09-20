import React, { useEffect, useMemo, useRef, useState } from "react";
import { UnitData } from "../../Units";
import { motion } from "framer-motion-3d";
import { useTarget } from "../../MouseEvents";
import useAnimatedChar, { Equipment } from "../gltfjsx/characters/useAnimatedChar";
import { Transition } from "framer-motion";
import { useRealtime } from "../../../realtimeDatabase/Hooks/useRealtime";
import { indexToHex } from "../../helpers/hexGrid";
import { tilePos } from "../Tiles/Tile";
import AxeDoubleCommon from "../gltfjsx/items/axeDouble_common";
import SwordCommon from '../gltfjsx/items/sword_common';
import ShieldCommon from "../gltfjsx/items/shield_common";
import StaffCommon from '../gltfjsx/items/staff_common';
import CrossbowCommon from '../gltfjsx/items/crossbow_common';
import QuiverFull from "../gltfjsx/items/quiver_full";

interface UnitProps {
  id: string; //Id of room
  uid: string;
}

function normalDistance(dx: number, dy: number): number {
  return Math.sqrt(dx ** 2 + dy ** 2);
}

// Fetch data from RTDB, only render once loaded
export default function Unit({ id, uid }: UnitProps) {
  const { data } = useRealtime<UnitData>(`rooms/${id}/units/${uid}`);

  if (!data) {
    return null;
  }

  return <UnitGraphic {...data} />
}

function UnitGraphic({ uid, type, hp, actions, hexIdx }: UnitData) {
  const [x, y, z] = useMemo(
    //TODO: tile height
    () => tilePos(indexToHex(hexIdx ?? 0), 1, true),
    [hexIdx]
  );

  const prevData = useRef<
    {
      x: number;
      y: number;
      z: number;
      hp: number;
      actions: number
    }
  >(null);
  const transition = useRef<Transition>(null);
  const onMotionComplete = useRef<() => void>(null);
  const [motionPos, setMotionPos] = useState<
    Partial<{
      opacity?: number;
      x: number;
      y: number;
      z: number;
      rotateY: number;
    }>
  >({ x, y, z, rotateY: 0, opacity: 1 });

  const equitment: Equipment = useMemo(() => {
    switch (type) {
      case 'Barbarian':
        return {
          armRight: <AxeDoubleCommon />
        }
      case 'Knight':
        return {
          armRight: <SwordCommon />,
          armLeft: <ShieldCommon />
        }
      case 'Rogue':
        return {
          armRight: <CrossbowCommon />,
          body: <QuiverFull />
        }
      case 'Mage':
        return {
          armRight: <StaffCommon />
        }
      default:
        return null;
    }
  }, [type]);
  const { play, Model } = useAnimatedChar(type, equitment);

  // On moving to a new hex, update position and rotation
  useEffect(() => {
    console.log("effect!");
    if (!prevData.current) {
      console.log("Initial unit motion");
      // First render, do not animate motion or run unneccessary calculations
    } else {
      const deltaX = x - prevData.current.x;
      const deltaZ = z - prevData.current.z;
      const delta = normalDistance(deltaX, deltaZ);

      if (hp !== prevData.current.hp) {
        // If unit made an action (attack)
        if (actions !== prevData.current.actions) {
          const attackAnim = type === 'Barbarian' ? 'HeavyAttack' :
            type === 'Knight' ? 'AttackCombo' :
            type === 'Rogue' ? 'Shooting(1h)' :
            type === 'Mage' ? 'Shooting(2h)' :
            'Attack(1h)'
          
          play(attackAnim, false, { anim: "Idle", loop: true });
          //TODO: apply update and move in here?
          
        } else {
          //TODO: probs set anims in db? idk
          if (hp) {
            // Unit recieved damage, but not dead
            //TODO: obviously this is a bad way to do this... need better way to chain
            play("Block", false, { anim: "Idle", loop: true });
          } else {
            // Unit dying
            play("Defeat", false, null);
            transition.current = { duration: 1, ease: "linear" };
            setMotionPos({
              x: prevData.current.x,
              y: prevData.current.y,
              z: prevData.current.z,
              opacity: 0,
            });
          }
        }
        
      }
      // Check if position has actually changed
      if (delta > 0) {
        // Rotate to face direction, then move
        // TODO: random 360s?
        const rotateY = Math.atan2(-deltaZ, deltaX) + Math.PI / 2;

        transition.current = { duration: 0.25, ease: "easeInOut" };
        setMotionPos({
          x: prevData.current.x,
          y: prevData.current.y,
          z: prevData.current.z,
          rotateY,
        });
        onMotionComplete.current = () => {
          play("Run", true);
          transition.current = { duration: delta, ease: "linear" };
          setMotionPos({ x, y, z, rotateY });
          onMotionComplete.current = () => {
            transition.current = { duration: 0.25, ease: "easeInOut" };
            play("Idle", true);
          };
        };
      }
    } // Update previous data
    prevData.current = { x, y, z, hp, actions };
  }, [play, x, y, z, hp, actions, type]);

  return (
    <motion.group
      {...useTarget({ type: "unit", val: uid })}
      scale={1}
      whileHover={{ scale: 1.2 }}
      initial={{
        opacity: 0,
        x: x,
        y: 5,
        z: z,
        rotateY: 0,
      }}
      animate={motionPos}
      transition={transition.current}
      onAnimationComplete={onMotionComplete.current}
    >
      {Model}
    </motion.group>
  );
}
