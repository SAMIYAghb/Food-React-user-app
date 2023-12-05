import { Navigate } from "react-router-dom"


const ProtectedRoute = ({userData, children}) => {
  if(userData == null && localStorage.getItem('adminToken') == null){
       return <Navigate to='/login'/>;
  }else{
    return children;
  }
}

export default ProtectedRoute