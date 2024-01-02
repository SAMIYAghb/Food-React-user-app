import axios from "axios";
import logo from "../../../assets/images/logo4-3.png";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useContext, useState } from "react";
import { AuthContext } from "./../../../Context/AuthContext";
import { ToastContext } from "./../../../Context/ToastContext";

const Login = () => {
  let { saveUserData, baseUrl } = useContext(AuthContext);
  let { getToastValue } = useContext(ToastContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register, //contient the data of the form
    handleSubmit,
    // watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    // console.log(data)
    // console.log(watch("email"))
    // console.log(watch("password"))
    await axios
      .post(`${baseUrl}Users/Login`, data)
      .then((response) => {
        setIsLoading(false);
        setTimeout(() => {
          getToastValue("success", "Congratulations! You are logIn");
        }, 1000);

        // console.log(response.data.token);
         localStorage.setItem(
          "userToken",
          response.data.token
        );
        // console.log(userToken);
        saveUserData();
        navigate("/dashboard");
      })
      .catch((error) => {
        setIsLoading(false);
        // console.log(error.response.data.message);
        getToastValue("error", error?.response?.data?.message);
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
              action=""
              className="m-auto w-75"
            >
              <h2>Log In</h2>
              <p>Welcome Back! Please enter your details</p>
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
                  {...register("password", {
                    required: true,
                    pattern:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  })}
                  type="password"
                  className="form-control"
                  placeholder="Password"
                />
                {errors.password && errors.password.type === "required" && (
                  <span className="text-danger">Password is required</span>
                )}
                {errors.password && errors.password.type === "pattern" && (
                  <span className="text-danger ">password is invalid</span>
                )}
              </div>
              <div className="form-group my-3 d-flex justify-content-between">
                <Link to="/register" className="text-success text-decoration-none">Register Now?</Link>
                <Link to="/request-reset-pass" className="text-success text-decoration-none">
                  Forgot Password?
                </Link>
              </div>
              <div className="form-group my-3">
                <button type="submit" className={
                      "btn btn-success w-100" + (isLoading ? " disabled" : " ")
                    }
                  >
                    {isLoading == true ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                      "Login"
                    )}
                 
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
