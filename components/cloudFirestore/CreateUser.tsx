import { Button, Input, Text } from 'react-native-magnus';
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
  async function onSubmit() {
    if (name.length < 1) {
      //TODO: Throw error
      return;
    }

    await set({...defaultUserData, username: name})
      .then(() => console.log('New user data created!'))
      .catch((e) => {
        console.error(e)
      })
  }

  return (
      <>
        <Input value={name} onChangeText={setName} />
        <Button onPress={onSubmit}>Submit</Button>
      </>
  )
}

export default CreateUser