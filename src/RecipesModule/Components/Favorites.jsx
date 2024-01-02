
import axios from "axios";
import { useState, useContext } from 'react';
import Header from './../../SharedModule/Components/Header/Header';
import { AuthContext } from '../../Context/AuthContext';
import { useEffect } from "react";
import nodata from './../../assets/images/nodata.png'
import Nodata from './../../SharedModule/Components/Nodata/Nodata';
import { ToastContext } from './../../Context/ToastContext';
import Modal from "react-bootstrap/Modal";
import Loader from './../../SharedModule/Components/Loader/Loader';


const Favorites = () => {
  const imgUrl = "https://upskilling-egypt.com/";
  const [favList, setFivList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalState, setModalState] = useState("close");
  const [itemId, setItemId] = useState(0);
  const {requestHeaders, baseUrl } = useContext(AuthContext);
  const { getToastValue } = useContext(ToastContext);

  const showDeleteModal = (id) => {
    setItemId(id);
    setModalState("delete-modal");
  };
  
  const handleClose = () => setModalState("close");

  const getFavoriteList = async(pageNo) =>{
    setIsLoading(true);
    await axios
    .get(`${baseUrl}userRecipe`, {
      headers: requestHeaders,
      },{
      params: {
        pageSize: 20,
      },
  })
    .then((response) => {
      setIsLoading(false);
      // console.log(response.data.data);
      setFivList(response?.data?.data)
    })
    .catch((error) => {
      setIsLoading(false);
      console.log(error);
      getToastValue(error?.response?.data?.message || "Axios Error!!!");
    });
  }

  const deleteFavorite = async() =>{
    setIsLoading(true);
    await axios
    .delete(`${baseUrl}userRecipe/${itemId}`, 
    {
      headers: requestHeaders,
   
    })
    .then((response) => {
      setIsLoading(false);
      console.log(response);
      getToastValue("success", "Recipe deleted from favorite successfully");
      handleClose();
      getFavoriteList();
    })
    .catch((error) => {
      setIsLoading(false);
      console.log(error);
      getToastValue("error", error?.response?.data?.message || "Axios Error!!!");
    });
  }

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
      <Modal show={modalState == "delete-modal"} onHide={handleClose}>
        <Modal.Body>
          <div className="text-center">
            <img className="w-50" src={nodata} alt="avatar" />
            <h4 className="my-3">Remove From Favourite List ?</h4>
            <span className="text-muted">
              are you sure you want to remove this recipe ? if you are sure just
              click on remove this recipe
            </span>
            <hr />
            <div className="form-group my-3 text-end">
              <button
                onClick={deleteFavorite}
                className={
                  "btn btn-outline-danger" + (isLoading ? " disabled" : "")
                }
              >
                {isLoading == true ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  "Remove this recipe"
                )}
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <div className="row mx-5 g-md-2">
      {
            isLoading ? ( <Loader/>):(<>
      {favList.length > 0 
      ? (<>
      {
          favList.map((favory)=>(
          <div key={favory.id} className=" col-md-4">
            <div className="position-relative  rounded-2 border shadow p-3">
            <div className="position-absolute me-0">
                <i className="fa fa-heart fa-2x text-danger"></i>
            </div>
            { favory?.recipe?.imagePath 
            ?(
              <div className="text-center">
                  <img
                  className="w-100 img-height"
                  src={`${imgUrl}` + favory?.recipe?.imagePath}
                  alt="recipe-image"
                />
              </div> 
            )
            : (<img
                  className="w-100 img-height"
                  src={nodata}
                  alt="recipe-img"/>)}
            <h4 className="text-center">{favory.recipe.name}</h4>  
            <button 
             onClick={() =>showDeleteModal(favory.id)}
            className="btn btn-outline-danger w-50 mt-5 d-flex flex-end">Delete favorite</button> 
            </div>           
          </div>
              )
          )
        }
      </>) 
      :(
        <Nodata />
      )}  
      </>)
          }     
      </div>    
      </>)
}

export default Favorites