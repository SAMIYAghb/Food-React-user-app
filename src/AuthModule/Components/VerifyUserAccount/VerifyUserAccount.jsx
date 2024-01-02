

import { useForm } from "react-hook-form";
import axios from "axios";
import logo from "../../../assets/images/logo4-3.png";
import { ToastContainer } from "react-toastify";
import { useContext, useState } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import { ToastContext } from "../../../Context/ToastContext";
import { useNavigate } from 'react-router-dom';

const VerifyUserAccount = () => {
  const { baseUrl, requestHeaders } = useContext(AuthContext);
  const { getToastValue } = useContext(ToastContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm();

      const onSubmit = async (data) => {
        // console.log(data);
        setIsLoading(true);
        await axios
      .put(`${baseUrl}Users/verify`,data,{
        headers: requestHeaders,
      })
      .then((response) => {
        setIsLoading(false);
          getToastValue("success", "Account created successfully. A verification code has been sent to your email address");
          // getToastValue("success", data.response.data.message);
        console.log(response);
        navigate("/login");
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error);
        getToastValue("error", error?.response?.data?.message);
      });
      }
    
  return (
    <div className="auth-container container-fluid">
      <ToastContainer />
      <div className="row bg-overlay vh-100 justify-content-center align-items-center">
        <div className="col-md-6">
          <div className="bg-white p-2">
            <div className="logo-cont text-center">
              <img src={logo} className="w-50" alt="logo" />
            </div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="m-auto w-75"
            >
              <h2>Verification</h2>
              
              <p>Enter the verification code</p>
              <div className="form-group my-3">
                <input
                  {...register("email", {
                    required: true,
                    pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                  })}
                  type="email"
                  className="form-control"
                  placeholder="Enter your E-mail"
                />

                 {errors.email && errors.email.type === "required" && (
                  <span className="text-danger ">Email is required</span>
                )}

                 {errors.email && errors.email.type === "pattern" && (
                  <span className="text-danger ">Email is invalid</span>
                )} 
              </div> 
              <div className="form-group my-3 position-relative">
                <input
                  {...register("code", {
                    required: true,
                    
                  })}
                  type="text"
                  className="form-control"
                  placeholder="verification code"
                />
                {errors.code && errors.code.type === "required" && (
                  <span className="text-danger">Verification code is required</span>
                )}
              </div>
              <div className="form-group my-3">
                <button type="submit" className={
                      "btn btn-success w-100" + (isLoading ? " disabled" : " ")
                    }
                  >
                    {isLoading == true ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                      " Verify"
                    )}
                 
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifyUserAccount