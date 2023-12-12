import { createContext } from "react";
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';


export let AuthContext = createContext();

export default function AuthContextProvider(props) {
  const [userData, setUserData] = useState(null);
  // console.log(userData);
  let requestHeaders = {
    Authorization: `Bearer ${localStorage.getItem("userToken")}`,
  }
  const baseUrl = 'https://upskilling-egypt.com/api/v1/';

  let saveUserData = () => {
    const userToken = localStorage.getItem("userToken");
    const decodedAdminToken = jwtDecode(userToken); // decode your token
    // console.log(decodedAdminToken);
    setUserData(decodedAdminToken);
  };

  //handle the refresh problem(quant on fait refrech le userData = null mais avec le useEffect on obtien les detail de userData)
  useEffect(() => {
    if (localStorage.getItem("userToken")) {
      saveUserData();
    }
  }, []);

  return (
    <AuthContext.Provider value={{userData, saveUserData, requestHeaders, baseUrl }}>
        {props.children}
    </AuthContext.Provider>
  );
}