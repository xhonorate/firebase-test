import { useGLTF } from "@react-three/drei";
import { useMemo } from "react"
import barbarianParts from './barbarian';
import prototypePeteParts from './prototypePete';
import knightParts from './knightParts';
import mageParts from './mageParts';
import rogueParts from './rogueParts';
import skeletonArcherParts from './skeletons/skeletonArcher';
import skeletonArcherBrokenParts from "./skeletons/skeletonArcherBroken";
import skeletonMageParts from './skeletons/skeletonMage';
import skeletonMageBrokenParts from './skeletons/skeletonMageBroken';
import skeletonMinionParts from './skeletons/skeletonMinion';
import skeletonMinionBrokenParts from './skeletons/skeletonMinionBroken';
import skeletonWarriorParts from './skeletons/skeletonWarrior';
import skeletonWarriorBrokenParts from './skeletons/skeletonWarriorBroken';

export interface CharacterParts {
  body: JSX.Element,
  head: JSX.Element,
  armLeft: JSX.Element,
  armRight: JSX.Element
}

export type CharacterType =
| 'Barbarian'
| 'Knight'
| 'Mage'
| 'Rogue'
| 'SkeletonArcher'
| 'SkeletonMage'
| 'SkeletonMinion'
| 'SkeletonWarrior'
| 'SkeletonArcherBroken'
| 'SkeletonMageBroken'
| 'SkeletonMinionBroken'
| 'SkeletonWarriorBroken'

type partsFunction = (gltf: any) => CharacterParts;

// Array of gltf file locations
export const characterParts: { [x in CharacterType | 'default']?: { parts: partsFunction, gltf: string }} = {
  Barbarian: {
    parts: barbarianParts,
    gltf: '/assets/kaykit/Models/characters/character_barbarian.gltf'
  },
  Knight: {
    parts: knightParts,
    gltf: '/assets/kaykit/Models/characters/character_knight.gltf'
  },
  Rogue: {
    parts: rogueParts,
    gltf: '/assets/kaykit/Models/characters/character_rogue.gltf'
  },
  Mage: {
    parts: mageParts,
    gltf: '/assets/kaykit/Models/characters/character_mage.gltf'
  },
  SkeletonArcher: {
    parts: skeletonArcherParts,
    gltf: '/assets/kaykit/Models/characters/skeletons/character_skeleton_archer.gltf'
  },
  SkeletonArcherBroken: {
    parts: skeletonArcherBrokenParts,
    gltf: '/assets/kaykit/Models/characters/skeletons/character_skeleton_archer_broken.gltf'
  },
  SkeletonMage: {
    parts: skeletonMageParts,
    gltf: '/assets/kaykit/Models/characters/skeletons/character_skeleton_mage.gltf'
  },
  SkeletonMageBroken: {
    parts: skeletonMageBrokenParts,
    gltf: '/assets/kaykit/Models/characters/skeletons/character_skeleton_mage_broken.gltf'
  },
  SkeletonMinion: {
    parts: skeletonMinionParts,
    gltf: '/assets/kaykit/Models/characters/skeletons/character_skeleton_minion.gltf'
  },
  SkeletonMinionBroken: {
    parts: skeletonMinionBrokenParts,
    gltf: '/assets/kaykit/Models/characters/skeletons/character_skeleton_minion_broken.gltf'
  },
  SkeletonWarrior: {
    parts: skeletonWarriorParts,
    gltf: '/assets/kaykit/Models/characters/skeletons/character_skeleton_warrior.gltf'
  },
  SkeletonWarriorBroken: {
    parts: skeletonWarriorBrokenParts,
    gltf: '/assets/kaykit/Models/characters/skeletons/character_skeleton_warrior_broken.gltf'
  },
  default: {
    parts: prototypePeteParts,
    gltf: '/assets/kaykit/Models/characters/PrototypePete.gltf'
  }
}

// Return file location of given character (default to prototype pete)
const getGLTFLocation = (character: CharacterType): string => {
  return (characterParts?.[character] ?? characterParts['default']).gltf;
}

const getPartFunction = (character: CharacterType): partsFunction => {
  return (characterParts?.[character] ?? characterParts['default']).parts;
}

// Wrapper function to memorize part structure for character with given name (string)
export default function useParts(character: CharacterType): CharacterParts {
  const gltf = useGLTF(getGLTFLocation(character)) as any;

  const parts = useMemo(() => {
    // Return parts object (head, body, etc.) for given character type
    return getPartFunction(character)(gltf);
  }, [character, gltf]);

  return parts;
}