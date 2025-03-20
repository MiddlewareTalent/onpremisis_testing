// MyProvider.js
import React, { createContext, useState } from 'react';

export const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const [state, setState] = useState([]);

  const updateState = (newState) => setState(newState);

  return (
    <MyContext.Provider value={{ state, updateState }}>
      {children}
    </MyContext.Provider>
  );
};
