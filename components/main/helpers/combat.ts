import { getUnitStats, UnitData } from "../Units";
import { getBuildingStats, Obj } from "../three/Objects/Building";
import { randomChoice } from "./random";

const hpWeight = 0.4; // How much unit hp affects strength (0 - 1)

// Get damage unit will deal
function dmgDealt(
  unit: UnitData | Obj,
  applyHpWeight: boolean = false,
  applyRNG: boolean = false
) {
  // Get damage dealt (multiplied by current hp %)
  const hpMultiplier = applyHpWeight
    ? 1 - hpWeight + hpWeight * (unit.hp / getUnitStats(unit.type).hp)
    : 1;

  const rngMultiplier = applyRNG ? randomChoice([0.8, 0.9, 1, 1.1, 1.5]) : 1;

  if (rngMultiplier === 1.5) {
    //TODO: CRIT display!
    console.log("CRIT");
  }

  return Math.round(unit.str * rngMultiplier * hpMultiplier);
}

// Get actuall dmg that would be dealt by each target before dying
// return final hp's [atkHp, defHp]
function fightUntilDeath(atkDmg: number, defDmg: number, atkHp: number, defHp: number): [number, number] {
  // Check if there will be any overkill
  if (atkDmg > defHp || defDmg > atkHp) {
    const atkOverkill = (atkDmg - defHp) / defHp; // % overkill
    const defOverkill = (defDmg - atkHp) / atkHp; // % overkill
    // Return damage unit would deal before being killed
    if (atkOverkill > defOverkill) {
      // Defender dies
      return [Math.max(0, atkHp - defDmg * (1 - atkOverkill)), 0];
    } else {
      // Attacker dies
      return [0, Math.max(0, defHp - atkDmg * (1 - defOverkill))];
    }
  } else {
    // No overkill calculations necessary, just return hp after dmg dealt
    return [atkHp - defDmg, defHp - atkDmg]
  }
}

// TODO: dmg predict display
function predictResult() {
  return null;
}

// Mutate data of both units
export function initiateCombat(
  attacker: UnitData,
  defender: UnitData | Obj
): void {
  // Check if defending target is unit (as opposed to building)
  const defIsUnit = 'uid' in defender;

  // If a building is being attacked (hp not set)
  if (!defIsUnit && !("hp" in defender)) {
    // If building has not yet been attacked (full hp) get max hp and defense stats
    Object.assign(defender, getBuildingStats(defender.type));
  }

  const atkDmg = dmgDealt(attacker, true, true);
  // Apply defender dmg only if attacker is melee
  // Only apply hp weight if defender is unit (not building)
  const defDmg = attacker?.range ? 0 : dmgDealt(defender, defIsUnit, true);
  
  // Apply damage to unit (will be updated outside of this function)
  [attacker.hp, defender.hp] = fightUntilDeath(atkDmg, defDmg, attacker.hp, defender.hp);
}
