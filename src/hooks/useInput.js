import { useCallback, useState } from 'react';

const useInput = (initialValue) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const handler = useCallback(
    (e) => {
      if (e.type === 'click') {
        setInputValue({
          ...inputValue,
          [e.target.closest('li').dataset.name]: e.target.textContent,
        });
        return;
      }
      setInputValue({ ...inputValue, [e.target.name]: e.currentTarget.value });
    },
    [inputValue]
  );
  return [inputValue, handler];
};

export default useInput;
