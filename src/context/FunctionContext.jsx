import React, { useContext } from "react";
const FunctionContext = React.createContext();

export function useFunction() {
  return useContext(FunctionContext);
}
export function FunctionProvider({ children }) {
  //STRING FUNCTIONS
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

  function toLink(string = "") {
    return string.toLowerCase().split(" ").join("_");
  }
  function toTitle(string = "") {
    return string.toLowerCase().split("_").join(" ");
  }
  function createBreadCrumb(path = "") {
    let tempString = path.substring(1);
    return tempString.split("/");
  }

  //SESSION FUNCTIONS
  function saveItem(key, value) {
    sessionStorage.setItem(key, value);
  }
  function getItem(key) {
    return sessionStorage.getItem(key);
  }

  const value = {
    createBreadCrumb,
    capitalize,
    trimString,
    saveItem,
    getItem,
    toTitle,
    toLink,
  };

  return (
    <FunctionContext.Provider value={value}>
      {children}
    </FunctionContext.Provider>
  );
}
