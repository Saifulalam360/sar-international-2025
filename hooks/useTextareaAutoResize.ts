import { useEffect, RefObject } from 'react';

export const useTextareaAutoResize = (
  ref: RefObject<HTMLTextAreaElement>,
  value: string
) => {
  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'auto'; // Reset height
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  }, [ref, value]);
};