import { useUser } from '../components/auth/useUser'
import NextLink from 'next/link'
import CreateUser from '../components/cloudFirestore/CreateUser';
import { useDocument } from '@nandorojo/swr-firestore'
import { Button } from '@chakra-ui/react';
import LobbyBrowser from '../components/cloudFirestore/LobbyBrowser';
import GameLobby from '../components/cloudFirestore/GameLobby';

export default function Home() {
  // TODO: Should use SWR or fuego somehow for auth...
  const { user, logout } = useUser();

  // SWR to pull user data
  const { data: userData, update, error } = useDocument(`user_data/${user?.id}`, {
    parseDates: ['created'],
    listen: true,
    onError: console.error
  })

  if (user) {
    if (!userData) {
      return <div>loading...</div>
    } else {
      return (
        <div>
          <h5>{JSON.stringify(user)}</h5>        
          { userData.exists ?
            userData['active_game'] ?
              <><h5>{/* load game data here... */ JSON.stringify(userData)}</h5>
                   {/* check if game exists -> check exists -> check finished -> check started (not in lobby) -> check age -> 
                    rejoin or throw err message and update user */}
                  <GameLobby userData={userData} />
                </>
              :
              // we can worry about host migration in the future...
              <>
                <h1>Select from list:</h1>
                <h5><LobbyBrowser userData={userData} /></h5>
              </>
            :
            // If user account is not set up, prompt them with a form to set username, etc.
            <CreateUser id={user.id} isAnonymous={user.isAnonymous} />
          }
          <Button onClick={() => logout()}>Log Out</Button>
        </div>
      )
    }
  }
  else {
    return (
      <div>
        <p><NextLink href="/auth"><a>Log In!</a></NextLink></p>
      </div>
    )
  }
}
