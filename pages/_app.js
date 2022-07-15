import theme from '../styles/theme'
import { ChakraProvider } from '@chakra-ui/react'
import React from 'react'
import 'firebase/firestore'
import 'firebase/auth'
import { FuegoProvider } from '@nandorojo/swr-firestore'
import { Fuego } from '../components/fuego';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const fuego = new Fuego(firebaseConfig)

function App({ Component, pageProps }) {
  return (
    <FuegoProvider fuego={fuego}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </FuegoProvider>
  )
}

export default App
