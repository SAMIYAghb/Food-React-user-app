import './App.css';

import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import ChangePass from './AuthModule/Components/ChangePass/ChangePass';
import Login from './AuthModule/Components/Login/Login';
import ProtectedRoute from './AuthModule/Components/ProtectedRoute/ProtectedRoute';
import RequestResetPass from './AuthModule/Components/RequestResetPass/RequestResetPass';
import ResetPass from './AuthModule/Components/ResetPass/ResetPass';
import Home from './HomeModule/Components/Home/Home';
import Favorites from './RecipesModule/Components/Favorites';
import RecipesList from './RecipesModule/Components/RecipesList/RecipesList';
import AuthLayout from './SharedModule/Components/AuthLayout/AuthLayout';
import MasterLayout from './SharedModule/Components/MasterLayout/MasterLayout';
import NotFound from './SharedModule/Components/NotFound/NotFound';




function App() {
  const [userData, setUserData] = useState(null);
  // console.log(userData);
  let saveUserData =() => {
      const adminToken=  localStorage.getItem('adminToken');
      const decodedAdminToken = jwtDecode(adminToken); // decode your token
      // console.log(decodedAdminToken);
      setUserData(decodedAdminToken);
  }

  //handle the refresh problem(quant on fait refrech le userData = null mais avec le useEffect on obtien les detail de userData)
  useEffect(()=>{
    if(localStorage.getItem("adminToken")){
      saveUserData();
    }
  },[]) 

  const routes = createBrowserRouter([     
    {
      path:"dashboard",
      element:(
          <ProtectedRoute userData={userData}>
            <MasterLayout userData={userData} />
          </ProtectedRoute>
      ),
      errorElement: <NotFound/>,
      children:[
        {index: true, element:<Home userData={userData}/>},      
        {path: "recipes", element:<RecipesList/>},
        {path: "favorites", element:<Favorites/>},
      ]
    },
    {
      path:"/",
    //   element: (
    //     // <ProtectedRoute userData={userData}>
    //       <AuthLayout/>   
    //     // </ProtectedRoute>
    // ),
      element: <AuthLayout/>,
      errorElement: <NotFound/>,
      children:[
        {index: true, element:<Login saveUserData={saveUserData}/>},
        {path: "login", element:<Login saveUserData={saveUserData}/>},
        {path: "change-pass",element:<ChangePass/>},
        {path: "request-reset-pass",element:<RequestResetPass/>},
        {path: "reset-pass",element:<ResetPass/>},
       
      ]
    }
  ])
  return(
    <>
      <RouterProvider router={routes} /> 
      
    </>
  )
}

export default App
