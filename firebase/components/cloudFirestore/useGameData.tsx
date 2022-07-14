import { useEffect, useState, useRef, Dispatch } from 'react'
import firebase from 'firebase/compat/app'
import db from './db';

export interface GameData {
  created: firebase.firestore.Timestamp,
  started: boolean,
  finished: boolean,
  participants: string[],
}

export const defaultGameData: GameData = {
  created: firebase.firestore.Timestamp.fromDate(new Date()),
  started: false,
  finished: false,
  participants: []
}

// Takes game id param, which will corrospond to doc name in games db
// Returns null while loading (or passed id set to null)
// Returns false if passed game id no longer exists
const useGameData = (id: string) => {
  const [gameData, setGameData]: [GameData, Dispatch<any>] = useState(null);

  // function that will be used to cancel data listener
  const cancelDataListener = useRef(null);

  // Begin hosting a new game, set passed user id as only current participant
  const createGame = async (userId: string) => {
    db.collection('user_data').doc(id)
      .set({
        ...defaultGameData,
        participants: [userId]
      })
      .then(() => console.log('New game created!'))
      .catch((e) => {
        console.error(e)
      })
  }

  useEffect(() => {
    // If we have not yet been passed a game id, return
    if (!id) {
      return
    }

    // If there is already a listener, disable it before adding a new one
    // Happens if id has changed for some reason
    if (!!cancelDataListener.current) {
      cancelDataListener.current();
    }

    // Add event listener for updates to user_data with doc id=user id
    // onSnapshot function returns function to cancel this listner, which we call on unmount
    cancelDataListener.current = db.collection('games').doc(id).onSnapshot((doc) => {
      if (doc.exists) {
        setGameData(doc.data());
      } else {
        // Return userData=false (prompt user to set up info)
        setGameData(false);
      }      
    })

    return () => {
      // On unmount, remove listener for data updates
      cancelDataListener.current();
    }
  }, [id])

  return { gameData, createGame }
}

export { useGameData }