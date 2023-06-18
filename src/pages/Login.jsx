import { useRef, useState } from "react";
import login_img from "../assets/login_img.jpg";
import { useAuth } from "../context/authContext";
import { Button, TextInput } from "../components/Forms";
import { useFunction } from "../context/FunctionContext";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Alert from "../components/Containers/Alert";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { capitalize, saveItem } = useFunction();
  const { signInUser } = useAuth();

  const [formStatus, setFormStatus] = useState(null);
  const [loginResult, setLoginResult] = useState(null);

  const username = useRef();
  const password = useRef();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setFormStatus("submitting");
    const user = username.current.value;
    const pass = password.current.value;

    const result = await signInUser(user, pass);
    if (typeof result === "object") {
      saveItem("currentUser", JSON.stringify(result));
      setFormStatus(null);
      navigate("/dashboard");
    } else {
      setFormStatus("warning");
      setLoginResult(result);
    }
  };

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
        <div className="bg-gradient-to-br from-main via-secondary via-40% to-tertiary p-2 lg:w-1/2 flex flex-col lg:gap-10">
          <p className="text-white text-[1.1rem] font-semibold mx-4 lg:py-1 lg:pt-4">
            Edwin and Lina Poultry Farm
          </p>
          <form
            className="lg:py-4 flex flex-col justify-between gap-4 lg:gap-10"
            onSubmit={handleLogin}
          >
            <p className="text-center text-white text-[2rem]">Sign In</p>
            <div className="flex flex-col gap-4">
              {["username", "password"].map((input, index) => {
                return (
                  <TextInput
                    type={index === 1 ? "password" : "text"}
                    key={index}
                    id={input}
                    textHint={capitalize(input)}
                    inputRef={input === "username" ? username : password}
                    inputClasses={
                      "mx-4 p-3 rounded-[10rem] px-4 bg-gradient-to-br from-[#fffffff0] to-[#ffffff40] placeholder:text-main shadow-md"
                    }
                  />
                );
              })}
            </div>
            <Button
              type="submit"
              disabled={formStatus === "submitting"}
              value={
                formStatus ? (
                  <AiOutlineLoading3Quarters className="animate-spin" />
                ) : (
                  "Sign In"
                )
              }
              className={[
                "transition-all py-3 rounded-[10rem] font-semibold text-[1.1rem] text-main w-[50%] m-auto shadow-lg hover:animate-bounce-light",
                formStatus !== "null" &&
                  "flex items-center justify-center font-semibold",
              ]}
            />
          </form>
        </div>
      </div>
      {formStatus === "warning" && (
        <Alert
          type={formStatus}
          title="Login Alert"
          message={loginResult}
          onClose={() => {
            setLoginResult(null);
            setFormStatus(null);
          }}
        />
      )}
    </div>
  );
}
