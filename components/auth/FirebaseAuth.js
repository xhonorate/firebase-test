import initFirebase from '../../firebase/initFirebase'
import { useEffect, useState } from 'react'
import { setUserCookie } from './userCookies'
import { mapUserData } from './mapUserData'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import { fuego } from '@nandorojo/swr-firestore'

//initFirebase() // initialize firebase

//var anonymousUser = firebase.auth().currentUser;

const firebaseAuthConfig = {
    signInFlow: 'popup',
    // Auth providers
    // https://github.com/firebase/firebaseui-web#configure-oauth-providers
    autoUpgradeAnonymousUsers: true,
    signInOptions: [
        {
            provider: fuego?.auth.EmailAuthProvider.PROVIDER_ID,
            requireDisplayName: false,
        },
        // add additional auth flows below
        {
          provider: fuego?.auth.GoogleAuthProvider.PROVIDER_ID,
          customParameters: {
            // Forces account selection even when one account
            // is available.
            prompt: 'select_account'
          }
        },
        'anonymous'
    ],
    signInSuccessUrl: '/',
    credentialHelper: 'none',
    callbacks: {
        signInSuccessWithAuthResult: async ({ user }, redirectUrl) => {
            const userData = mapUserData(user)
            setUserCookie(userData)
        },
        // signInFailure callback must be provided to handle merge conflicts which
        // occur when an existing credential is linked to an anonymous user.
        signInFailure: function(error) {
          // For merge conflicts, the error.code will be
          // 'firebaseui/anonymous-upgrade-merge-conflict'.
          if (error.code != 'firebaseui/anonymous-upgrade-merge-conflict') {
            return Promise.resolve();
          }
          // The credential the user tried to sign in with.
          var cred = error.credential;
          // Copy data from anonymous user to permanent user and delete anonymous
          // user.
          // ...
          // Finish sign-in after data is copied.
          return fuego.auth().signInWithCredential(cred);
        }
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
                  firebaseAuth={fuego.auth()}
              />
          ) : null}
      </div>
  )
}

export default FirebaseAuth