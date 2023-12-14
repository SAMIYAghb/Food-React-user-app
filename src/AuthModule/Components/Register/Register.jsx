import axios from "axios";
import logo from "../../../assets/images/logo4-3.png";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useContext } from "react";
import { AuthContext } from "./../../../Context/AuthContext";
import { ToastContext } from './../../../Context/ToastContext';

const Register = () => {
  let { saveUserData, baseUrl } = useContext(AuthContext);
  let { getToastValue } = useContext(ToastContext);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const appendToFormData = (data) => {
    const formData = new FormData();
    formData.append("userName", data["userName"]);
    formData.append("password", data["password"]);
    formData.append("confirmPassword", data["confirmPassword"]);
    formData.append("email", data["email"]);
    formData.append("country", data["country"]);
    formData.append("phoneNumber", data["phoneNumber"]);
    return formData;
  };

  const onSubmit = async(data) => {
    console.log(data)
    const addFormData = appendToFormData(data);
    await axios
      .post(`${baseUrl}Users/Register`, addFormData)
      .then((response) => {
        setTimeout(() => {
          getToastValue("success", "Account created successfully! A verification code has been sent to your email address");
        }, 1000);

        console.log(response);
        navigate("/verify");
      })
      .catch((error) => {
        console.log(error);
        getToastValue("error", error.response.data.message);
      });
    };

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
            <h2>Register</h2>
            <p>Welcome Back! Please enter your details</p>
            <div className="row">
              <div className="col-md-6 ">
                  <div className="form-group my-3">
                  <input
                    {...register("userName", {
                      required: true,
                      pattern:/^[a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*$/

                    })}
                    type="text"
                    className="form-control"
                    placeholder="userName"
                  />
                  {errors.userName && errors.userName.type === "required" && (
                    <span className="text-danger">userName is required</span>
                  )}
                 {errors.userName && errors.userName.type === "pattern" && (
                    <span className="text-danger ">The userName must contain characters and end with numbers without spaces</span>
                  )}
                  </div>
                  <div className="form-group my-3">
                  <input
                    {...register("password", {
                      required: true,
                      pattern:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    })}
                    type="password"
                    className="form-control"
                    placeholder="password "
                  />
                  {errors.password && errors.password.type === "required" && (
                    <span className="text-danger">password is required</span>
                  )}
                  {errors.password && errors.password.type === "pattern" && (
                    <span className="text-danger ">password is invalid</span>
                  )}
                 
                  </div>
                  <div className="form-group my-3">
                  <input
                    {...register("confirmPassword", {
                      required: true,
                    })}
                    type="password"
                    className="form-control"
                    placeholder="confirmPassword "
                  />
                  {errors.confirmPassword && errors.confirmPassword.type === "required" && (
                    <span className="text-danger">confirmPassword is required</span>
                  )}
                 
                  </div>
              </div>
              <div className="col-md-6">

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
                  <div className="form-group my-3">
                  <input
                    {...register("country", {
                      required: true,
                    })}
                    type="text"
                    className="form-control"
                    placeholder="country"
                  />
                  {errors.country && errors.country.type === "required" && (
                    <span className="text-danger">countryis required</span>
                  )}
                  
                  </div>
                  <div className="form-group my-3">
                  <input
                    {...register("phoneNumber", {
                      required: true,
                    })}
                    type="text"
                    className="form-control"
                    placeholder="phoneNumber"
                  />
                  {errors.phoneNumber && errors.phoneNumber.type === "required" && (
                    <span className="text-danger">phoneNumber is required</span>
                  )}
                  
                  </div>
              </div>
            </div>
            
            
            
            <div className="form-group my-3">
              <button type="submit" className="btn btn-success w-100">
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </div>
  )
}

export default Register