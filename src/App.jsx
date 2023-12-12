import './App.css';


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
import { useContext } from 'react';
import { AuthContext } from './Context/AuthContext';
import Register from './AuthModule/Components/Register/Register';



function App() {
  let {userData, saveUserData} = useContext(AuthContext)

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
        {index: true, element:<Login/>},
        {path: "login", element:<Login/>},
        {path: "change-pass",element:<ChangePass/>},
        {path: "request-reset-pass",element:<RequestResetPass/>},
        {path: "reset-pass",element:<ResetPass/>},
        {path: "resgister",element:<Register/>},
       
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
