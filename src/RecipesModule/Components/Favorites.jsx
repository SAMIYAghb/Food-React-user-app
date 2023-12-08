import axios from "axios";
import { useState, useContext } from 'react';
import Header from './../../SharedModule/Components/Header/Header';
import { AuthContext } from '../../Context/AuthContext';
import { useEffect } from "react";

const Favorites = () => {
  const [favList, setFivList] = useState([]);
  const {requestHeaders, baseUrl } = useContext(AuthContext);

  const getFavoriteList = async() =>{
    await axios
    .get(`${baseUrl}userRecipe`, 
    {
      headers: {
        requestHeaders,
      },
    })
    .then((response) => {
      // console.log(response);
      setFivList(response.data.data)
    })
    .catch((error) => {
      console.log(error);
    });
  }

  // const deleteFavorite = async() =>{
  //   await axios
  //   .delete(`${baseUrl}userRecipe`, 
  //   {
  //     headers: {
  //       requestHeaders,
  //     },
  //   })
  //   .then((response) => {
  //     // console.log(response);

  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });
  // }

  useEffect(() => {
    getFavoriteList();
  }, []);

  return (<>
    <Header
        title={"Favorite receipes"}
        paragraph={
          "You can now add your items that any user can order it from the Application and you can edit"
        }
      />
      <div className="row mx-4 p-3">
        {
          favList.map((favory, key)=>(
          <div key={favory.id} className="col-md-4">
            <h2>{favory.id}</h2>
                <div className="">                 
                  <img src="" alt="" />
                </div>
          </div>
              )
          )
        }
      </div>
    
      </>)
}

export default Favorites