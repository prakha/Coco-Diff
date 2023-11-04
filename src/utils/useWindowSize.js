import React, { useEffect, useLayoutEffect, useState } from 'react';


export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function useWindowSize() {
  const [size, setSize] = useState([3000, 2000]);

  useIsomorphicLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    if(typeof window !== 'undefined'){
      window.addEventListener('resize', updateSize);
      updateSize();
    }
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return size;
}