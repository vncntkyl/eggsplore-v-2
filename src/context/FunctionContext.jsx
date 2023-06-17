import React, { useContext } from "react";
const FunctionContext = React.createContext();

export function useFunction() {
  return useContext(FunctionContext);
}
export function FunctionProvider({ children }) {
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function saveItem(key, value) {
    sessionStorage.setItem(key, value);
  }
  function getItem(key) {
    return sessionStorage.getItem(key);
  }
  function getCurrentUser() {
    return sessionStorage.getItem("currentUser");
  }

  const value = {
    getCurrentUser,
    capitalize,
    saveItem,
    getItem,
  };

  return (
    <FunctionContext.Provider value={value}>
      {children}
    </FunctionContext.Provider>
  );
}
