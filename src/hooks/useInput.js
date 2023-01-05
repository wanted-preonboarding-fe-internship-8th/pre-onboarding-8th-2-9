import { useCallback, useState } from 'react';

const useInput = (initialValue) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const handler = useCallback(
    (e) => {
      setInputValue({ ...inputValue, [e.target.name]: e.currentTarget.value });
    },
    [inputValue]
  );
  return [inputValue, handler];
};

export default useInput;
