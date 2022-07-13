import { useState, useEffect } from 'react'
import firebase from 'firebase/compat/app'
import 'firebase/compat/database'

const Counter = ({ id }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
      const onCountIncrease = (count) => setCount(count.val())
      
      const fetchData = async () => {
          firebase.database().ref('counts').child(id).on('value', onCountIncrease)
      }

      fetchData()

      return () => {
          firebase.database().ref('counts').child(id).off('value', onCountIncrease)
      }
  }, [id])

  const increaseCount = async () => {
    firebase.database().ref('counts').child(id).set(count + 1);
      // I think the reason to do this as an api endpoint is to avoid hacking...

      //const registerCount = () => fetch(`/api/incrementCount?id=${encodeURIComponent(id)}`)
      //registerCount()
  }

  return (
      <button onClick={increaseCount}>Increase count {count ? count : '–––'}</button>
  )
}

export default Counter