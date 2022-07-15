import { Button } from '@chakra-ui/button';
import { Input } from '@chakra-ui/input';
import { useDocument } from '@nandorojo/swr-firestore';
import { useState } from 'react'

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

const CreateUser = ({ id, isAnonymous }) => {
  const [name, setName] = useState(isAnonymous ? 'Guest' : 'User')
  const { set } = useDocument(`user_data/${id}`)

  async function onSubmit(e: any) {
    e.preventDefault();

    await set({...defaultUserData, username: name})
      .then(() => console.log('New user data created!'))
      .catch((e) => {
        console.error(e)
      })
  }

  return (
      <form onSubmit={onSubmit}>
        <Input minLength={3} value={name} onChange={e => setName(e.target.value)} />
        <Button role={'submit'}>Submit</Button>
      </form>
  )
}

export default CreateUser