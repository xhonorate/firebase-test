import ReadDataFromCloudFirestore from '../firebase/components/cloudFirestore/read'
import WriteToCloudFirestore from '../firebase/components/cloudFirestore/write'
import styles from '../styles/Home.module.css'
import { useUser } from '../firebase/components/auth/useUser'
import NextLink from 'next/link'
import Counter from '../firebase/components/realtimeDatabase/Counter'

export default function Home() {
  const { user, logout } = useUser()

    if (user) {
      return (
        <div>
          <h1>{user.name}</h1>
          <h3>{user.email}</h3>
          {user.profilePic ? <image src={user.profilePic} height={50} width={50}></image> : <p>No profile pic</p>}
          <WriteToCloudFirestore />
          <ReadDataFromCloudFirestore />
          <Counter id={user.id} />
          <button onClick={() => logout()}>Log Out</button>
        </div>
      )
    }

    else return (
      <div className={styles.container}>
        <p><NextLink href="/auth"><a>Log In!</a></NextLink></p>
      </div>
    )
}
