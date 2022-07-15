import { useDocument } from '@nandorojo/swr-firestore';
import { useUser } from '../auth/useUser'

const WriteToCloudFirestore = () => {
  const { user } = useUser()
  const { data, set, update } = useDocument(`user_data/${user?.id}`);

  const sendData = () => {
    // calling this will automatically update your global cache & Firestore
    set(
      {
        thisisatest: true,
      },
      { merge: true }
    )

    /*
    // or you could call this: 
    update({
      thisisatest: true,
    }) 
    */
  }

  return (
      <div style={{ margin: '5px 0' }}>
          <button onClick={sendData}>Send Data To Cloud Firestore</button>
      </div>
  )
}

export default WriteToCloudFirestore