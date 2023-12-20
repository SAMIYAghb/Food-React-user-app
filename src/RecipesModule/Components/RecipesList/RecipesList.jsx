import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { ToastContainer } from "react-toastify";
import { AuthContext } from "../../../Context/AuthContext";
import Header from "../../../SharedModule/Components/Header/Header";
import { default as defaultrecipeImg, default as noRecipeImg } from "../../../assets/images/1.webp";
import { ToastContext } from "./../../../Context/ToastContext";
import Nodata from "./../../../SharedModule/Components/Nodata/Nodata";
import Loader from './../../../SharedModule/Components/Loader/Loader';


const RecipesList = () => {
  const { requestHeaders, baseUrl } = useContext(AuthContext);
  const { getToastValue } = useContext(ToastContext);

  const imgUrl = "https://upskilling-egypt.com/";
  const [itemId, setItemId] = useState(0);
  //state for pagination
  const [pagesArray, setPagesArray] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); //************* */

  const [searchString, setSearchString] = useState("");
  const [selectedTagId, setSelectedTagId] = useState(0);
  const [selectedCategoryId, setSelectedCategoryId] = useState(0);
  const [recipesList, setRecipesList] = useState([]);
  const [tagsList, setTagsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recipeDetails, setRecipeDetails] = useState({});

  // Modal
  const [modalState, setModalState] = useState("close");

  const showViewModal = (id) => {
    // alert(id);
    setItemId(id);
    getRecipeDetails(id);
    setModalState("view-modal");
  };

  const handleClose = () => setModalState("close");
  // Modal

  const getTagsList = async () => {
    await axios
      .get(`${baseUrl}tag`)
      .then((response) => {
        // console.log(response.data, 'tags');
        setTagsList(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getCategoriesList = async () => {
    await axios
      .get(`${baseUrl}Category/?pageSize=10&pageNumber=1`, {
        headers: {
          //pour obtenir les caterories on doit étre login 'authorized'
          requestHeaders,
        },
      })
      .then((response) => {
        // console.log(response.data.data, 'to get category id from recipeListe');
        setCategoriesList(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  let totalPages;
  const getRecipesList = async (pageNo, name, tagId, categoryId) => {
    setIsLoading(true);
    await axios
      .get(`${baseUrl}Recipe`, {
        headers:requestHeaders,
        },{
        params: {
          pageSize: 5, //statique
          pageNumber: pageNo, //dynamique
          name: name,
          tagId: tagId,
          categoryId: categoryId,
        },
      })
      .then((response) => {
        setIsLoading(false);
        // console.log(response.data.data , 'recipesList');
        let totalPages = response.data.totalNumberOfPages; //************ */
        let arrayOfNumberOfPages = Array(response.data.totalNumberOfPages)
          .fill()
          .map((_, i) => i + 1);
        setPagesArray(arrayOfNumberOfPages);
        // console.log(pagesArray);
        setRecipesList(response?.data?.data);
        setCurrentPage(pageNo); //************** */
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  // reel time search filtration
  const getNameValue = (input) => {
    // console.log(input.target.value);
    setSearchString(input.target.value); //pour passer le parametre du filtre aux autre pages
    // getRecipesList(1, input.target.value);//filtrer par nom seulement
    getRecipesList(1, input.target.value, selectedTagId, selectedCategoryId); //filtrer par nom et category et tag au meme temps
  };

  const getTagValue = (select) => {
    // console.log(select.target.value);
    setSelectedTagId(select.target.value);
    getRecipesList(1, null, select.target.value, selectedCategoryId); //il me faut 4 argument pour la function getRecipesList
  };

  const getCategoryValue = (select) => {
    // console.log(select.target.value);
    setSelectedCategoryId(select.target.value);
    getRecipesList(1, null, selectedTagId, select.target.value);
    //selectedTagId, select.target.value pour faire le filtre par category
  };
  // end reel time search filtration

  const getRecipeDetails = async (id) => {
    await axios
      .get(`${baseUrl}Recipe/${id}`, {
        headers: {
          requestHeaders,
        },
      })
      .then((response) => {
        console.log(response);
        setRecipeDetails(response.data);
        // handleClose();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const addToFavorite = async() => {
    // alert(' selected recipe'); 
    await axios
      .post(`${baseUrl}userRecipe/`,{
        recipeId: itemId,
      }
      ,{
        headers: requestHeaders,
      }
    )
      .then((response) => {
        console.log(response);
        handleClose();
        getToastValue("success", "Recipe added to favorite successfully");
       
      })
      .catch((error) => {
        console.log(error);
        getToastValue("error", "Error");
      });
  };

  useEffect(() => {
    getRecipesList(1);
    getTagsList();
    getCategoriesList();
  }, []);

  return (
    <>
      <ToastContainer />
      <Header
        title={"Receipes Items!"}
        paragraph={
          "You can now add your items that any user can order it from the Application and you can edit"
        }
      />

      {/* modal View recipe*/}
      <Modal
        show={modalState === "view-modal"}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Body>
          <Modal.Header closeButton></Modal.Header>
          <div>
            <h2 className="text-center">Recipe details</h2>
            <div className="text-center">
              {recipeDetails?.imagePath ? (
                <img
                  src={imgUrl + recipeDetails?.imagePath}
                  alt="recipe-img"
                  className="w-50 mt-3"
                />
              ) : (
                <img src={noRecipeImg} alt="recipe-img" className="w-50 mt-3" />
              )}
              <h3 className="my-3">{recipeDetails?.name}</h3>
              <h4 className="">{recipeDetails?.price} $</h4>
            </div>

            <p className="border p-2">Description: {recipeDetails?.description}</p>
            <div className="border mb-3">
              <p className=" p-2 ">Tag: {recipeDetails?.tag?.name}</p>
              {/* {recipeDetails?.category[0].name ? <p className=" p-2">Category: {recipeDetails?.category[0]?.name}</p> : ""} */}
              
            </div>
            <div className="text-end">
              <button
                onClick={addToFavorite}
                className="btn btn-outline-success w-50 "
              >
                Add to favorite list
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {/*end modal View recipe*/}

      <div className="row align-items-center justify-content-between rounded-3 p-4">
        <h3>Recipe Table Details</h3>
        <p>You can check all details</p>
        <div className="">
          {/* Filtration */}
          <div className="row">
            <div className="col-md-4 col-sm-12">
              <input
                onChange={getNameValue}
                placeholder="Search By Recipe Name..."
                className="form-control my-2"
                type="text"
              />
            </div>
            <div className="col-md-4 col-sm-12">
              <select onChange={getTagValue} className="form-select my-2">
                <option value="" className="text-muted">
                  Select tag
                </option>
                {tagsList?.map((tag) => (
                  <>
                    <option key={tag.id} value={tag.id}>
                      {tag.name}
                    </option>
                  </>
                ))}
              </select>
            </div>
            <div className="col-md-4 col-sm-12">
              <select onChange={getCategoryValue} className="form-select my-2">
                <option value="" className="text-muted">
                  Select category
                </option>
                {categoriesList?.map((category) => (
                  <>
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  </>
                ))}
              </select>
            </div>
          </div>
          {/* End Filtration */}
          {
            isLoading ? ( <Loader/>):(<>
          {recipesList.length > 0 ? (
            <div className="">
              <div className="table-responsive">
                <table className="table my-4 table-striped">
                  <thead className="table-success">
                    <tr className="text-center">
                      <th scope="col">#</th>
                      <th scope="col">Recipe Name</th>
                      <th scope="col">Image</th>
                      <th scope="col">Price</th>
                      <th scope="col">Description</th>
                      <th scope="col">Tag</th>
                      <th scope="col">Category</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {recipesList.map((recipe, index) => (
                      <>
                        <tr className="text-center" key={recipe.id}>
                          <th scope="row">{index + 1}</th>
                          <td scope="row">{recipe?.name}</td>
                          <td>
                            <div className="img-container">
                              {recipe.imagePath ? (
                                <img
                                  src={imgUrl + recipe.imagePath}
                                  alt="recipe-image"
                                  className="w-100 img-fluid"
                                />
                              ) : (
                                <img
                                  src={defaultrecipeImg}
                                  alt="recipe-image"
                                  className="w-100 img-fluid"
                                />
                              )}
                            </div>
                          </td>
                          <td>{recipe?.price}</td>
                          <td>{recipe?.description}</td>
                          <td>{recipe?.tag?.name}</td>
                          <td>{recipe?.category[0]?.name}</td>
                          <td>
                            <i
                              onClick={() => {
                                showViewModal(recipe.id);
                              }}
                              className="fa fa-eye text-success mx-5"
                            ></i>
                          </td>
                        </tr>
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination  */}
              <nav aria-label="Page navigation example ">
                <ul className="pagination justify-content-center">
                  <li className="page-item">
                    <a
                      onClick={() =>
                        getRecipesList(currentPage - 1, searchString)
                      }
                      disabled={currentPage === 1}
                      className="page-link pag-clic"
                      aria-label="Previous"
                    >
                      <span aria-hidden="true">«</span>
                    </a>
                  </li>
                  {pagesArray.map((pageNo) => (
                    <>
                      <li
                        onClick={() => getRecipesList(pageNo, searchString)}
                        key={pageNo}
                        // className="page-item "
                        className={`page-item ${
                          pageNo === currentPage ? "active" : ""
                        }`}
                      >
                        <a className="page-link pag-clic">{pageNo}</a>
                      </li>
                    </>
                  ))}
                  <li
                    onClick={() =>
                      getRecipesList(currentPage + 1, searchString)
                    }
                    disabled={currentPage === totalPages}
                    className="page-item"
                  >
                    <a className="page-link pag-clic" aria-label="Next">
                      <span aria-hidden="true">» </span>
                    </a>
                  </li>
                </ul>
              </nav>
              {/* Pagination  */}
            </div>
          ) : (
            <Nodata />
          )}
           </>)
          }
        </div>
      </div>
    </>
  );
};

export default RecipesList;
