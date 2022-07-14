import ReadDataFromCloudFirestore from '../firebase/components/cloudFirestore/read'
import WriteToCloudFirestore from '../firebase/components/cloudFirestore/write'
import styles from '../styles/Home.module.css'
import { useUser } from '../firebase/components/auth/useUser'
import NextLink from 'next/link'
import { useUserData } from '../firebase/components/cloudFirestore/useUserData'
import CreateUser from '../firebase/components/cloudFirestore/CreateUser';

export default function Home() {
  const { user, logout } = useUser();
  // normally we should probably use this hook within a subcomponent that only gets rendered
  // after user has fully loaded, and just pass user id as a param
  const { userData } = useUserData(user ? user.id : null);

  if (user) {
    if (userData === null) {
      return <div>loading...</div>
    } else {
      return (
        <div>
          <h5>{JSON.stringify(user)}</h5>
          { userData ? 
            userData.active_game ?
              <h5>{/* load game data here... */ JSON.stringify(userData)}</h5>
              /* check if game exists -> check exists -> check finished -> check started (not in lobby) -> check age -> 
                    rejoin or throw err message and update user */
              :
              // we can worry about host migration in the future...
              <>
                <h1>Select from list:</h1>
                <h5>{/* host/join game here... */ JSON.stringify(userData)}</h5>
              </>
            :
            // If user account is not set up, prompt them with a form to set username, etc.
            <CreateUser id={user.id} isAnonymous={user.isAnonymous} />
          }
          <WriteToCloudFirestore />
          <ReadDataFromCloudFirestore />
          <button onClick={() => logout()}>Log Out</button>
        </div>
      )
    }
  }
  else {
    return (
      <div className={styles.container}>
        <p><NextLink href="/auth"><a>Log In!</a></NextLink></p>
      </div>
    )
  }
}
