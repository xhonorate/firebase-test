import { useEffect, useState } from 'react'
import {
    removeUserCookie,
    setUserCookie,
    getUserFromCookie,
} from './userCookies'
import { mapUserData, User } from './mapUserData'
import { Dispatch } from 'react';
import { fuego } from '@nandorojo/swr-firestore'

const useUser = () => {
    const [loading, setLoading] = useState(true);
    const [user, setUser]: [User, Dispatch<any>] = useState(null);

    const logout = async () => {
      return fuego
        .auth()
        .signOut()
        .then(() => {
          // Sign-out successful.
          //router.push('/auth')
        })
        .catch((e) => {
          console.error(e)
        })
    }

    useEffect(() => {
      // Firebase updates the id token every hour, this
      // makes sure the react state and the cookie are
      // both kept up to date
      const cancelAuthListener = fuego.auth().onIdTokenChanged((user) => {
        if (user) {
          const userData = mapUserData(user)
          setUserCookie(userData)
          setUser(userData)
        } else {
          removeUserCookie()
          setUser(null)
        }
      })

      const userFromCookie = getUserFromCookie()
      if (userFromCookie) {
        setUser(userFromCookie)
      }

      // Has fishished determining if user is logged in or not
      setLoading(false);

      return () => {
        cancelAuthListener()
      }
    }, [])

    return { user, loading, logout }
}

export { useUser }