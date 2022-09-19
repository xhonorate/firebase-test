import { GameSettings } from '../cloudFirestore/GameSettings';
import { Participant } from '../cloudFirestore/GameLobby';
import { fuego } from '@nandorojo/swr-firestore';
import { generateBoard } from '../main/Board';
import { resourceTypes } from '../main/three/Tiles/Resource';

// Generate new board and initialize user resources
export async function intitializeRoom(id: string, settings: GameSettings, participants: Participant[]) {
  //@ts-ignore
  return await fuego?.rtdb.ref(`rooms/${id}`).set({
    board: generateBoard(settings),
    players: participants.map((player: Participant) => {
      return {
        id: player.id,
        resources: resourceTypes.reduce(
          (a, v) => (v.name === "None" ? a : { ...a, [v.name]: 1 }),
          {}
        ),
        points: 1,
      };
    }),
    turn: 0,
  });
}

// Delete all RTDB room data
export function deleteRoom(id: string) {
  //@ts-ignore
  fuego?.rtdb.ref(`rooms/${id}`).remove();
}

export function updateRoom(id: string, updates: object) {
  //@ts-ignore
  fuego?.rtdb.ref(`rooms/${id}`).update(updates);
}