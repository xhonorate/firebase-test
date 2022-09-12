import { useEventListener } from "@chakra-ui/react";


export default function useHax(codes: [string, () => void][], maxBufferDuration: number = 1000) {
  let buffer = '';
  let lastKeyTime = Date.now();

  useEventListener("keyup", (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      const currentTime = Date.now();

      if (currentTime - lastKeyTime > maxBufferDuration) {
          buffer = '';
      }

      buffer += key;

      codes.forEach(([code, callback]) => {
        if (buffer.includes(code)) {
          callback();
          buffer = '';
        }
      })

      lastKeyTime = currentTime;
  });
}