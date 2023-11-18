import { useEffect, useRef, useState } from "react";
import login_img from "../assets/login_img.jpg";
import { useAuth } from "../context/authContext";
import { TextInput } from "../components/Forms";
import { useFunction } from "../context/FunctionContext";
import Alert from "../components/Containers/Alert";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { HiMail } from "react-icons/hi";
import { MdSend } from "react-icons/md";

export default function PasswordRecovery() {
  const { capitalize } = useFunction();
  const [formStatus, setFormStatus] = useState(null);
  const emailRef = useRef();
  const passRef = useRef();
  const conPassRef = useRef();
  const { checkEmail, resetPassword, checkPasswordStrength } = useAuth();
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  const handleSubmitEmail = async (e) => {
    e.preventDefault();

    const response = await checkEmail(emailRef.current.value);
    if (typeof response === "object") {
      setAlert({
        title: "Email Verified",
        message:
          "Your email has been verified, please check your email for the OTP which you will enter onto the next step.",
      });
      localStorage.setItem("email", response.email_address);
      localStorage.setItem("id", response.user_id);
      localStorage.setItem("v", response.code);
    } else {
      setAlert({
        title: "Verification Error",
        message: "Email not found",
      });
    }
  };
  const handleSubmitCode = async (e) => {
    e.preventDefault();

    const code = emailRef.current.value;
    const otp = localStorage.getItem("v");

    if (parseInt(code) === parseInt(otp)) {
      setAlert({
        title: "Success",
        message:
          "You have completed the verification process! You may know change your password.",
      });
      localStorage.removeItem("email");
      localStorage.removeItem("v");
    } else {
      setAlert({
        title: "Verification Error",
        message: "Incorrect OTP. Please check your email.",
      });
    }
  };
  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    const password = passRef.current.value;
    const confirmPassword = conPassRef.current.value;

    if (password === confirmPassword) {
      const result = checkPasswordStrength(confirmPassword);
      if (result.length === 0) {
        const response = await resetPassword(
          confirmPassword,
          localStorage.getItem("id")
        );
        if (response === 1) {
          setAlert({
            title: "Password Changed",
            message:
              "Your have successfully changed your password. You can now log in with your new password.",
          });
        } else {
          setAlert({
            title: "Server Error",
            message: response,
          });
        }
      } else {
        console.log(result.length);
        setAlert({
          title: "Password Change Error",
          message: (
            <>
              <ol className="pl-4">
                {result.map((err, index) => {
                  return (
                    <li key={index} className="list-disc">
                      {err}
                    </li>
                  );
                })}
              </ol>
            </>
          ),
        });
      }
    } else {
      setAlert({
        title: "Password Change Error",
        message: "Passwords do not match",
      });
    }
  };
  const nextStep = (to) => {
    if (alert.title === "Success" || alert.title === "Email Verified") {
      const timeout = setTimeout(navigate(`./${to}`), 2000);
      setAlert(null);
      return () => clearTimeout(timeout);
    } else {
      setAlert(null);
    }
  };
  useEffect(() => {
    const path = window.location.pathname;
    if (path === "/password_recovery/verification") {
      if (!localStorage.getItem("email")) {
        navigate("/forgot-password/");
      }
    }
    if (path === "/password_recovery/change-password") {
      if (!localStorage.getItem("id")) {
        navigate("/forgot-password/");
      }
    }
  }, [window.location.pathname]);
  return (
    <div className="w-screen h-screen flex justify-center items-center p-2 lg:p-0 bg-default">
      <div className="flex flex-col lg:flex-row w-full md:w-[70%] lg:w-[80%] xl:w-1/2 max-h-[500px] rounded-xl overflow-hidden shadow-lg">
        <div className="bg-login bg-cover bg-center min-h-[75px] sm:min-h-[200px] lg:h-full lg:bg-transparent w-full lg:w-1/2">
          <img
            src={login_img}
            alt="Edwin And Lina Poultry Farm"
            className="hidden lg:block w-full"
          />
        </div>
        <div className="bg-gradient-to-br from-main via-secondary via-40% to-tertiary p-2 lg:w-1/2 flex flex-col justify-between">
          <p className="text-white text-[1.1rem] font-semibold mx-4 lg:py-1 lg:pt-4">
            Forgot Password
          </p>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <form
                    className="flex flex-col items-center gap-2 p-4 rounded-lg w-full mb-auto"
                    onSubmit={handleSubmitEmail}
                  >
                    <div className="flex flex-col gap-2 w-full">
                      <p className="text-justify indent-6 text-white">
                        To reset your account please provide the email address
                        linked to your account. We&apos;ll send a one-time
                        verification code (OTP) to your email. Once you&apos;ve
                        verified your email with the provided OTP, you can
                        proceed to set your new password.
                      </p>
                      <div className="flex flex-row gap-2 w-full bg-white p-1 justify-between rounded-md">
                        <input
                          type="email"
                          id="email"
                          required
                          ref={emailRef}
                          className="outline-none w-full"
                        />
                        <button
                          color="transparent"
                          className="bg-main text-white hover:bg-secondary w-fit p-1 px-2 rounded"
                          type="submit"
                        >
                          Verify
                        </button>
                      </div>
                    </div>
                  </form>
                  {alert && (
                    <Alert
                      type={
                        alert.title.includes("Error") ? "failure" : "sucess"
                      }
                      title={alert.title}
                      message={alert.message}
                      onClose={() => nextStep("verification")}
                    />
                  )}
                </>
              }
            />
            <Route
              path="/verification"
              element={
                <>
                  <form
                    className="flex flex-col items-center gap-2 p-4 rounded-lg w-full mb-auto"
                    onSubmit={handleSubmitCode}
                  >
                    <div className="flex flex-col gap-2">
                      <p className="text-justify indent-5 text-white">
                        An OTP has been sent to your email address ,{" "}
                        <strong>{localStorage.getItem("email")}</strong>. Please
                        enter the code below to proceed.
                      </p>
                      <div className="flex flex-row gap-2">
                        <input
                          type="number"
                          id="number"
                          required
                          ref={emailRef}
                          className="outline-none w-full"
                        />
                        <button
                          color="transparent"
                          className="bg-main text-white hover:bg-secondary w-fit p-1 px-2 rounded"
                          type="submit"
                        >
                          <MdSend className="text-xl" />
                        </button>
                      </div>
                    </div>
                  </form>
                  {alert && (
                    <Alert
                      type={
                        alert.title.includes("Error") ? "failure" : "sucess"
                      }
                      title={alert.title}
                      message={alert.message}
                      onClose={() => nextStep("change-password")}
                    />
                  )}
                </>
              }
            />
            <Route
              path="/change-password"
              element={
                <>
                  <form
                    className="flex flex-col items-center gap-2 p-4 rounded-lg w-full mb-auto"
                    onSubmit={handleSubmitPassword}
                  >
                    <div className="flex flex-col gap-2">
                      <p className="text-justify indent-5 text-white">
                        You may now change your password. Please enter a strong
                        password and remember it this time.
                      </p>
                      <div className="flex flex-row gap-2 items-center">
                        <label htmlFor="password" className="text-white w-1/2">
                          New Password
                        </label>
                        <input
                          type="password"
                          id="password"
                          required
                          ref={passRef}
                          defaultValue=""
                          className="outline-none w-1/2"
                        />
                      </div>
                      <div className="flex flex-row gap-2 items-center">
                        <label htmlFor="conPass" className="text-white w-1/2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          id="conPass"
                          required
                          ref={conPassRef}
                          defaultValue=""
                          className="outline-none w-1/2"
                        />
                      </div>
                      <button
                        color="transparent"
                        className="bg-main text-white hover:bg-secondary w-fit p-1 px-3 rounded ml-auto"
                        type="submit"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                  {alert && (
                    <Alert
                      type={
                        alert.title.includes("Error") ? "failure" : "sucess"
                      }
                      title={alert.title}
                      message={alert.message}
                      onClose={() => {
                        if (alert.title === "Password Changed") {
                          setAlert(null);
                          navigate("../login");
                        } else {
                          setAlert(null);
                        }
                      }}
                    />
                  )}
                </>
              }
            />
          </Routes>
          <div className="flex flex-col gap-1 items-center justify-center text-white text-sm">
            <p>Remembered your password?</p>
            <Link
              to="/login"
              className="bg-transparent border-2 border-white text-white transition-all hover:bg-white hover:text-main p-2 px-4 rounded-full"
            >
              Back to Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
