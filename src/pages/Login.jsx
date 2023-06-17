import login_img from "../assets/login_img.jpg";

export default function Login() {
  return (
    <div className="w-screen h-screen flex justify-center items-center p-2">
      <div className="flex flex-col lg:flex-row w-full rounded-md overflow-hidden">
        <div className="bg-login bg-cover bg-center min-h-[100px] sm:min-h-[200px] lg:bg-none w-full">
          <img
            src={login_img}
            alt="Edwin And Lina Poultry Farm"
            className="w-full"
          />
        </div>
        <div className="bg-main p-2">
          <p>Edwin and Lina Poultry Farm</p>
          <form>
            <p>Sign In</p>
          </form>
        </div>
      </div>
    </div>
  );
}
