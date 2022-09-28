import { useEffect, useRef } from 'react';

export default function useHax(codes: [string, () => void][], maxBufferDuration: number = 1000) {
  const buffer = useRef('');
  const lastKeyTime = useRef(Date.now());

  useEffect(() => {
    const keyListener = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
  
      const currentTime = Date.now();
  
      if (currentTime - lastKeyTime.current > maxBufferDuration) {
          buffer.current = '';
      }
  
      buffer.current += key;
  
      codes.forEach(([code, callback]) => {
        if (buffer.current.includes(code)) {
          callback();
          buffer.current = '';
        }
      })
  
      lastKeyTime.current = currentTime;
    }
    
    addEventListener("keyup", keyListener);

    return () => {
      removeEventListener("keyup", keyListener);
    }
  }, [codes, maxBufferDuration])
}