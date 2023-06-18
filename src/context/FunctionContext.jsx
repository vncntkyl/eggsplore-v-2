import React, { useContext } from "react";
const FunctionContext = React.createContext();

export function useFunction() {
  return useContext(FunctionContext);
}
export function FunctionProvider({ children }) {
  function capitalize(str = "", separator = " ") {
    const tempStr = str.split(separator);
    tempStr.forEach((str, index) => {
      tempStr[index] = str.charAt(0).toUpperCase() + str.slice(1);
    });
    return tempStr.join(" ");
  }
  function trimString(str = "") {
    return str.substring(0, 75);
  }

  function saveItem(key, value) {
    sessionStorage.setItem(key, value);
  }
  function getItem(key) {
    return sessionStorage.getItem(key);
  }

  const value = {
    capitalize,
    trimString,
    saveItem,
    getItem,
  };

  return (
    <FunctionContext.Provider value={value}>
      {children}
    </FunctionContext.Provider>
  );
}
