import { getUnitStats, UnitData, getMaxHp } from "../Units";
import { getBuildingStats, Obj } from "../three/Objects/Building";
import { randomChoice } from "./random";
import { indexToHex, cubeSubtract, HexCoords, cubeDirection, getSector } from "./hexGrid";

const hpWeight = 0.4; // How much unit hp affects strength (0 - 1)

// Get damage unit will deal
function dmgDealt(unit: UnitData | Obj, applyHpWeight: boolean = false, applyRNG: boolean = false) {
  // Get damage dealt (multiplied by current hp %)
  const hpMultiplier =
    "uid" in unit
      ? applyHpWeight
        ? 1 - hpWeight + hpWeight * (unit.hp / getMaxHp(unit.type))
        : 1
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
function fightUntilDeath(
  atkDmg: number,
  defDmg: number,
  atkHp: number,
  defHp: number
): [number, number] {
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
    return [atkHp - defDmg, defHp - atkDmg];
  }
}

// TODO: dmg predict display
function predictResult() {
  return null;
}

// Mutate data of both units
export function initiateCombat(
  attacker: UnitData,
  defender: UnitData | Obj,
  attackerHex: HexCoords,
  defenderHex: HexCoords
): void {
  // Check if defending target is unit (as opposed to building)
  const defIsUnit = "uid" in defender;

  // If a building is being attacked (hp not set)
  if (!defIsUnit && !("hp" in defender)) {
    // If building has not yet been attacked (full hp) get max hp and defense stats
    Object.assign(defender, getBuildingStats(defender.type));
  }

  const atkDmg = dmgDealt(attacker, true, true);
  // Apply defender dmg only if attacker is melee
  // Only apply hp weight if defender is unit (not building)
  const defDmg = attacker?.range ? 0 : dmgDealt(defender, defIsUnit, true);
  console.log(atkDmg, defDmg);
  // Apply damage to unit (will be updated outside of this function)
  const [atkHp2, defHp2] = fightUntilDeath(atkDmg, defDmg, attacker.hp, defender.hp);
  attacker.hp = atkHp2 === Infinity ? 0 : atkHp2;
  defender.hp = defHp2 === Infinity ? 0 : defHp2;

  const facing = getSector(cubeSubtract(attackerHex, defenderHex))[0];
  attacker.facing = facing; // Face towards defender for combat
  if (!(attacker.hp > 0)) {
    attacker.targetIdx = null;
  }
  attacker.action =
    attacker.hp > 0 ? (defender.hp > 0 ? "attack" : "attackVictory") : "attackDefeat";
  if (defIsUnit) {
    defender.facing = (facing + 3) % 6; // Face towards attacker for combat
    defender.action =
      defender.hp > 0 ? (attacker.hp > 0 ? "defend" : "defendVictory") : "defendDefeat";
  }
}
