
import { Text, Button } from '@chakra-ui/react'
import { update, useDocument } from "@nandorojo/swr-firestore"
import { useCallback } from "react";
import firebase from 'firebase/app';

export interface GameData {
  id: string,
  exists?: boolean,
  hasPendingWrites?: boolean,
  created: firebase.firestore.Timestamp,
  started: boolean,
  finished: boolean,
  participants: {id: string, name:string, connected:boolean}[],
  __snapshot?: any,
}

const GameLobby = ({userData}) => {
  const { data, deleteDocument }: {data: GameData, deleteDocument: () => Promise<void>} = useDocument('games/' + userData?.active_game, { listen: true });

  const leaveLobby = useCallback(
    () => {
      if (data['participants']?.length <= 1) {
        // If the user leaving was the only user in the lobby, delete it
        deleteDocument();
      } else {
        update('games/' + userData.active_game, { participants: firebase.firestore.FieldValue.arrayRemove({id: userData.id, name: userData.username ?? null, connected: true})})
      }
      update('user_data/' + userData?.id, {active_game: null});

      // Note: unsubscribe() is not neccessary for useDocument
    },
    [userData, deleteDocument, data],
  );
  
  return (
    <>
      {data?.participants?.length && data?.participants.map((participant, idx) => {
        const me = participant.id === userData.id;
        return <>
          <Text color={me ? 'yellow.400' : 'blue.400'}>{!idx ? 'Host' : 'User'}: {participant?.name ?? participant.id}{me && ' (me)'}</Text>
        </>}
      )}
      <Button onClick={() => leaveLobby()}>Leave</Button>
    </>
  )
}

export default GameLobby