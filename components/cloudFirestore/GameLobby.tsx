
import { Text, Button, VStack } from '@chakra-ui/react'
import { update, useDocument } from "@nandorojo/swr-firestore"
import { useCallback, useState, useEffect } from "react";
import firebase from 'firebase/app';
import Room from '../main/room';

export interface GameSettings {
  maxPlayers: number,
}

export interface GameData {
  created: firebase.firestore.Timestamp,
  started: boolean,
  finished: boolean,
  settings: GameSettings,
  participants: {id: string, name:string, connected:boolean}[]
}

// TODO: migrate to settings
const minPlayers = 1;

const GameLobby = ({userData}) => {
  const { data, update: updateGame, deleteDocument } = useDocument<GameData>('games/' + userData?.active_game, { listen: true });
  const [playerIndex, setPlayerIndex] = useState(-1); // Index of player in participants (0 is host, -1 means not found or loading)

  useEffect(() => {
    if (!data?.participants || !Array.isArray(data.participants)) return;
    setPlayerIndex(data?.participants.findIndex((participant) => participant.id === userData.id ));
  }, [data, userData.id]);

  // Remove use from game participants, and set current_game to null. If last to leave, delete the room
  const leaveLobby = useCallback(
    () => {
      if (data['participants']?.length <= 1) {
        // If the user leaving was the only user in the lobby, delete it
        deleteDocument();
      } else {
        updateGame({ participants: firebase.firestore.FieldValue.arrayRemove({id: userData.id, name: userData.username ?? null, connected: true})})
      }
      update('user_data/' + userData?.id, {active_game: null});

      // Note: unsubscribe() is not neccessary for useDocument
    },
    [userData, updateGame, deleteDocument, data],
  );

  // Create a game lobby in RTDB and set status to started
  const startGame = useCallback(
    () => {
      updateGame({started: true});
    }, 
    [updateGame]
  )

  return (
    <VStack m={4} align={'start'}>
      { data?.started ?
      <Room playerIndex={playerIndex} id={data.id} participants={data.participants} />
      :
      <>{data?.participants?.length && data?.participants.map((participant, idx) => {
        const me = participant.id === userData.id;
        return (
          <Text key={idx} color={me ? 'yellow.400' : 'blue.400'}>{!idx ? 'Host' : 'User'}: {participant?.name ?? participant.id}{me && ' (me)'}</Text>
        )}
      )}
      <Button 
        colorScheme={'green'} 
        isDisabled={(playerIndex !== 0) || data.participants.length < minPlayers}
        onClick={startGame}
      >Start</Button>
      </>}
      <Button onClick={() => leaveLobby()}>Leave</Button>
    </VStack>
  )
}

export default GameLobby