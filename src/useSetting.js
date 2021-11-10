import {useState} from 'react';

const useSetting = (key, defaultValue) => {
  if (defaultValue == null) {
    throw Error('The default value must not be null');
  }

  const [cachedValue, setCachedValue] = useState(null);

  const handleChangeValue = (value) => {
    console.log('saving', value);
    localStorage.setItem(key, JSON.stringify(value));
    setCachedValue(value);
  };

  const refresh = () => {
    const storedValue = localStorage.getItem(key);
    console.log('reading', storedValue);
    if (storedValue == null) {
      // no need to set the default value in localStorage
      // this way we can change the defaults for users later on
      setCachedValue(defaultValue);
    } else {
      const parsed = JSON.parse(storedValue);
      setCachedValue(parsed);
    }
  };

  if (cachedValue == null) {
    refresh();
  }

  return [cachedValue, handleChangeValue, refresh];
};

export default useSetting;