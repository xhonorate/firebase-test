import initFirebase from '../../initFirebase'
import { useEffect, useState } from 'react'
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import { setUserCookie } from './userCookies'
import { mapUserData } from './mapUserData'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'

initFirebase() // initialize firebase

const firebaseAuthConfig = {
    signInFlow: 'popup',
    // Auth providers
    // https://github.com/firebase/firebaseui-web#configure-oauth-providers
    signInOptions: [
        {
            provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
            requireDisplayName: false,
        },
        // add additional auth flows below
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ],
    signInSuccessUrl: '/',
    credentialHelper: 'none',
    callbacks: {
        signInSuccessWithAuthResult: async ({ user }, redirectUrl) => {
            const userData = mapUserData(user)
            setUserCookie(userData)
        },
    },
}

const FirebaseAuth = () => {
  // Do not SSR FirebaseUI, because it is not supported.
  // https://github.com/firebase/firebaseui-web/issues/213
  const [renderAuth, setRenderAuth] = useState(false)
  useEffect(() => {
      if (typeof window !== 'undefined') {
          setRenderAuth(true)
      }
  }, [])
  return (
      <div>
          {renderAuth ? (
              <StyledFirebaseAuth
                  uiConfig={firebaseAuthConfig}
                  firebaseAuth={firebase.auth()}
              />
          ) : null}
      </div>
  )
}

export default FirebaseAuth