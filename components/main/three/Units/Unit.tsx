import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { UnitData, getMaxHp } from '../../Units';
import { motion } from "framer-motion-3d";
import { useTarget } from "../../MouseEvents";
import useAnimatedChar, { Equipment } from "../gltfjsx/characters/useAnimatedChar";
import { Transition } from "framer-motion";
import { useRealtime } from "../../../realtimeDatabase/Hooks/useRealtime";
import { indexToHex, cubeDirection, cubeToPos } from "../../helpers/hexGrid";
import { tilePos, tileSize } from "../Tiles/Tile";
import AxeDoubleCommon from "../gltfjsx/items/axeDouble_common";
import SwordCommon from "../gltfjsx/items/sword_common";
import ShieldCommon from "../gltfjsx/items/shield_common";
import StaffCommon from "../gltfjsx/items/staff_common";
import CrossbowCommon from "../gltfjsx/items/crossbow_common";
import QuiverFull from "../gltfjsx/items/quiver_full";
import { CharacterType } from "../gltfjsx/characters/Parts/useParts";
import { Billboard } from "@react-three/drei";
import HealthBar from "../UI/HealthBar";

type MotionPos = {
  x: number;
  y: number;
  z: number;
  opacity: number;
  rotateY: number;
};

function normalDistance(dx: number, dy: number): number {
  return Math.sqrt(dx ** 2 + dy ** 2);
}

function getAttackAnim(type: CharacterType) {
  switch (type) {
    case "Barbarian":
      return "HeavyAttack";
    case "Knight":
      return "AttackCombo";
    case "Rogue":
      return "Shooting(1h)";
    case "Mage":
      return "Shooting(2h)";
    default:
      return "Attack(1h)";
  }
}

function getEquipment(type: CharacterType) {
  switch (type) {
    case "Barbarian":
      return {
        armRight: <AxeDoubleCommon />,
      };
    case "Knight":
      return {
        armRight: <SwordCommon />,
        armLeft: <ShieldCommon />,
      };
    case "Rogue":
      return {
        armRight: <CrossbowCommon />,
        body: <QuiverFull />,
      };
    case "Mage":
      return {
        armRight: <StaffCommon />,
      };
    default:
      return null;
  }
}

interface UnitProps {
  id: string; //Id of room
  uid: string;
  playerIndex: number;
}

// Fetch data from RTDB, only render once loaded
export default function Unit({ id, uid, playerIndex }: UnitProps) {
  const { data, update, deleteReference } = useRealtime<UnitData>(`rooms/${id}/units/${uid}`);

  if (!data) {
    return null;
  }

  return <UnitGraphic {...data} update={update} deleteReference={deleteReference} isOwner={data.owner === playerIndex}/>;
}

interface UnitGraphicProps extends UnitData {
  update: (data: Partial<UnitData>) => void;
  deleteReference: () => any;
  isOwner: boolean;
}

function UnitGraphic({
  uid,
  type,
  hp,
  action,
  actions,
  facing,
  hexIdx,
  update,
  deleteReference,
  isOwner,
}: UnitGraphicProps) {
  const [x, y, z] = useMemo(
    //TODO: tile height
    () => tilePos(indexToHex(hexIdx ?? 0), 0.5, true),
    [hexIdx]
  );

  // Keep track of previous pos for movement purposes
  const prevMotionPos = useRef<MotionPos>(null);

  const transition = useRef<Transition>(null);
  const onMotionComplete = useRef<() => void>(null);

  // Allow updating of individual props in motionpos
  const [motionPos, updateMotionPos] = useReducer<
    (state: MotionPos, updates: Partial<MotionPos>) => MotionPos
  >(
    (state, updates: Partial<MotionPos>) => {
      prevMotionPos.current = { ...state, ...updates };
      return { ...state, ...updates };
    },
    { x, y, z, rotateY: 0, opacity: 1 }
  );

  // Async update motion pos - resolves once unit reaches pos (or another motion upadate is called)
  const updateMotion = useCallback(
    (updates: Partial<MotionPos>, transitionSettings: Transition = null) =>
      new Promise<void>((resolve) => {
        if (onMotionComplete.current) {
          //If there is a pending wait on animation, finish it imediately
          console.log("Unit - updateMotion - Resolve Previous Motion");
          const prevCallback = onMotionComplete.current;
          onMotionComplete.current = null;
          prevCallback();
        }

        onMotionComplete.current = () => {
          console.log("Unit - updateMotion - Resolve Motion");
          onMotionComplete.current = null;
          resolve();
        };
        transition.current = transitionSettings;
        updateMotionPos(updates);
      }),
    [updateMotionPos]
  );

  const equitment: Equipment = useMemo(() => getEquipment(type), [type]);
  const { play, Model } = useAnimatedChar(type, equitment);

  // Pass attack or defend action type, play animation / motion, then resolve
  const playCombatAnim = useCallback(
    (action: "attack" | "defend", facing: number = null) =>
      new Promise<void>(async (resolve) => {
        // Rotate to face target
        transition.current = { duration: 0.25, ease: "easeInOut" };
        if (facing !== null) {
          // Wait for unit to rotate if need be
          await updateMotion({ rotateY: (facing * Math.PI) / 3 });

          if (action === "attack") {
            // Move unit half way into enemy square before playing animation
            const attackMovement = cubeToPos(cubeDirection(facing));
            await updateMotion({
              x: prevMotionPos.current.x + (attackMovement[0] * tileSize) / 2,
              z: prevMotionPos.current.z + (attackMovement[2] * tileSize) / 2,
            });
          }
        }
        play(action === "attack" ? getAttackAnim(type) : "Block").then(() => {
          resolve();
        });
      }),
    [updateMotion, play, type]
  );

  const moveIn = useCallback(
    (x: number, y: number, z: number) =>
      new Promise<void>(async (resolve) => {
        // Check if unit position has changed! - Move if so
        const deltaX = x - prevMotionPos.current.x;
        const deltaZ = z - prevMotionPos.current.z;
        const delta = normalDistance(deltaX, deltaZ);

        if (delta > 0) {
          // Rotate to face direction, then move
          // TODO: random 360s?
          const rotateY = Math.atan2(-deltaZ, deltaX) + Math.PI / 2;
          updateMotion({ rotateY }, { duration: 0.25, ease: "easeInOut" }).then(() => {
            play("Run"); // Start playing run animation
            updateMotion({ x, y, z }, { duration: delta, ease: "linear" }).then(() => {
              resolve();
            });
          });
        } else {
          // no movement
          resolve();
        }
      }),
    [play, updateMotion]
  );

  // On moving to a new hex, update position and rotation
  useEffect(() => {
    if (!prevMotionPos.current) {
      prevMotionPos.current = { x, y, z, rotateY: 0, opacity: 1 };
      console.log("Initial unit motion");
      // First render, do not animate motion or run unneccessary calculations
    } else {
      // Async so we can do these acions in timed-out order
      // FIRST: play actions for combat / ability use
      if (action) {
        const combatType = action.includes("attack") ? "attack" : action.includes("defend") ? "defend" : null;
        const result = action.includes("Victory") ? "Victory" : action.includes("Defeat") ? "Defeat" : null;

        if (combatType) {
          // Do combat animaition
          playCombatAnim(combatType, facing).then(() => {
            // Move in if necessary (will be skipped if pos has not changed)
            moveIn(x, y, z).then(() => {
              if (result === "Victory") {
                // If victory, play victory anim
                play('Cheer');
              } else if (result === "Defeat") {
                // If killed, animate out then delete from DB
                updateMotionPos({ opacity: 0 })
                play('Defeat').then(() => {
                  play('LayingDownIdle');
                  // Only unit owner player will update RTDB
                  if (isOwner) {
                    try {
                      deleteReference(); //Destroy unit in RTDB
                    } catch {
                      console.warn("unit already deleted!");
                    }
                  }
                })
              }
            })
          })
        } else {
          //Non-combat actions
          if (action === 'rest') {
            console.log("rest time!!")
            moveIn(x,y,z).then(() => play("LayingDownIdle", true));
          }
        }
      }
      else {
        // No actions set, simply move in, then go to idle
        moveIn(x,y,z).then(() => play('Idle'));
      }

    }
  }, [play, x, y, z, actions, action, facing, type, playCombatAnim, updateMotion, moveIn, deleteReference, isOwner]);

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
      <HealthBar position-y={2.2} hp={hp} maxHp={getMaxHp(type)} />
    </motion.group>
  );
}
