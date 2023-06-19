import option_1 from "../../assets/egg_production.png";
import option_2 from "../../assets/chicken_mortality.png";
import option_3 from "../../assets/medicine_remaining.png";
import option_4 from "../../assets/feed_remaining.png";
import option_5 from "../../assets/egg_segregation.png";
export default function StaffMenu() {
  return (
    <div className="pt-4 body">
      <h1>Menu</h1>
      <div className="flex gap-2">
        <div className="bg-white shadow-md p-4 w-fit border-t-8 border-main hover:animate-bounce-light select-none">
          <img src={option_1} className="max-w-[100px]" />
          <p className="text-main font-semibold text-[1.1rem]">
            Egg Production
          </p>
          <p>Form for managing egg collections</p>
        </div>
        <div className="bg-white shadow-md p-4 w-fit border-t-8 border-main hover:animate-bounce-light select-none">
          <img src={option_2} className="max-w-[100px]" />
          <p className="text-main font-semibold text-[1.1rem]">
            Chicken Mortality
          </p>
          <p>Form for managing chicken conditions</p>
        </div>
        <div className="bg-white shadow-md p-4 w-fit border-t-8 border-main hover:animate-bounce-light select-none">
          <img src={option_3} className="max-w-[100px]" />
          <p className="text-main font-semibold text-[1.1rem]">
            Medicine Remaining
          </p>
          <p>Form for managing medicine</p>
        </div>
        <div className="bg-white shadow-md p-4 w-fit border-t-8 border-main hover:animate-bounce-light select-none">
          <img src={option_4} className="max-w-[100px]" />
          <p className="text-main font-semibold text-[1.1rem]">
            Feed Remaining
          </p>
          <p>Form for managing feeds</p>
        </div>
        <div className="bg-white shadow-md p-4 w-fit border-t-8 border-main hover:animate-bounce-light select-none">
          <img src={option_5} className="max-w-[100px]" />
          <p className="text-main font-semibold text-[1.1rem]">
            Egg Segregation
          </p>
          <p>Form for segregation of collected eggs</p>
        </div>
      </div>
    </div>
  );
}
