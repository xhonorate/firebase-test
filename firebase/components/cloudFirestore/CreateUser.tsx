import { useState } from 'react'
import db from './db';
import { defaultUserData } from './useUserData';

const CreateUser = ({ id, isAnonymous }) => {
  const [name, setName] = useState(isAnonymous ? 'Guest' : 'User')

  function onSubmit(e: any) {
    e.preventDefault();

    db.collection('user_data').doc(id)
      .set({
        ...defaultUserData, 
        username: name
      })
      .then(() => console.log('New user data created!'))
      .catch((e) => {
        console.error(e)
      })
  }

  return (
      <form onSubmit={onSubmit}>
        <input minLength={3} value={name} onChange={e => setName(e.target.value)} />
        <button role={'submit'}>Submit</button>
      </form>
  )
}

export default CreateUser