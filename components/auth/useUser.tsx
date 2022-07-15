import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import {
    removeUserCookie,
    setUserCookie,
    getUserFromCookie,
} from './userCookies'
import { mapUserData, User } from './mapUserData'
import { Dispatch } from 'react';
import { fuego } from '@nandorojo/swr-firestore'

const useUser = () => {
    const [user, setUser]: [User, Dispatch<any>] = useState(null);
    const router = useRouter()

    const logout = async () => {
      return fuego
        .auth()
        .signOut()
        .then(() => {
          // Sign-out successful.
          router.push('/auth')
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
      if (!userFromCookie) {
        router.push('/auth')
        return
      }
      setUser(userFromCookie)

      return () => {
        cancelAuthListener()
      }
    }, [router])

    return { user, logout }
}

export { useUser }