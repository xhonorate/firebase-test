
import { Text, Button } from '@chakra-ui/react'
import { update, useDocument } from "@nandorojo/swr-firestore"
import { useCallback } from "react";
import firebase from 'firebase/app';

const GameLobby = ({userData}) => {
  const { data, deleteDocument } = useDocument('games/' + userData?.active_game, { listen: true });

  const leaveLobby = useCallback(
    () => {
      if (data['participants']?.length <= 1) {
        // If the user leaving was the only user in the lobby, delete it
        deleteDocument();
      } else {
        update('games/' + userData.active_game, { participants: firebase.firestore.FieldValue.arrayRemove({id: userData.id, connected: true})})
      }
      update('user_data/' + userData?.id, {active_game: null});

      // Note: unsubscribe() is not neccessary for useDocument
    },
    [userData, deleteDocument, data],
  );

  return (
    <>
      {JSON.stringify(data)}
      <Button onClick={() => leaveLobby()}>Leave</Button>
    </>
  )
}

export default GameLobby