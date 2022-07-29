import { useState } from 'react';
import { useRealtime } from './Hooks';

const Counter = ({ id }) => {
  ///// tbh... probably best to just use one ref without the hook
  // use .child().on... to listen to diff types of events
  // useEffect to remove all listeners on dismout,....
  // oooooor mmaybe we just separatly hook into each thing we need ?
  // -- then pass unitData / resourceData / whateverData as props to components
  // uuuh would be good to do specific functions on update tho, so probs not hooks...
  // rip
  const {data, set, unsubscribe} = useRealtime(`counts/${id}`);

  return (
    <>
      <button onClick={() => set(data+1)}>Increase count {data ? data : '–––'}</button>
      <br />
      <button onClick={unsubscribe}>Unsub</button>
    </>
  )
}

export default Counter