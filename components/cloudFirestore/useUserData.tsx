import { useEffect, useState, useRef, Dispatch } from 'react'

export interface UserData {
  created: Date,
  username: string,
  active_game: string,
  past_games: string[]
}

export const defaultUserData: UserData = {
  created: new Date(),
  username: '',
  active_game: null,
  past_games: []
}

// Takes user id param, which will corrospond to doc name in user_data db
// Returns null while loading (or passed id set to null)
// Returns false if id is not null, but no doc currently exists (promp user to finish setup)
// Returns 
const useUserData = (id: string) => {
  const [userData, setUserData]: [UserData, Dispatch<any>] = useState(null);

  // function that will be used to cancel data listener
  const cancelDataListener = useRef(null);

  // Update doc for this user, only if the doc actually exists (userData !== null/false)
  const updateUser = async (data: object) => {
  /*  if (userData) {
      // NOTE: probably should use Update instead of set, for less writes
      // https://firebase.google.com/docs/firestore/manage-data/add-data#node.js_11
      db.collection('user_data').doc(id)
        .set(data)
        .then(() => alert('Data was successfully sent to cloud firestore!'))
        .catch((e) => {
          console.error(e)
        })
    }
  }

  useEffect(() => {
    // If we have not yet been passed a user id, return
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
    cancelDataListener.current = db.collection('user_data').doc(id).onSnapshot((doc) => {
      if (doc.exists) {
        setUserData(doc.data());
      } else {
        // Return userData=false (prompt user to set up info)
        setUserData(false);
      }      
    })

    return () => {
      // On unmount, remove listener for data updates
      cancelDataListener.current();
    }
  }, [id])
*/}
  return { userData, updateUser }
}

export { useUserData }