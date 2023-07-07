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
  function getPath(){
    return window.location.pathname;
  }

  function getFullName(user){
    return `${user.first_name} ${user.middle_name.substring(0,1)}. ${user.last_name}`
  }
  //SESSION FUNCTIONS
  function saveItem(key, value) {
    localStorage.setItem(key, value);
  }
  function getItem(key) {
    return localStorage.getItem(key);
  }

  const value = {
    createBreadCrumb,
    getFullName,
    capitalize,
    trimString,
    saveItem,
    getPath,
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
