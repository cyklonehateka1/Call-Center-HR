import esla_logo from "../assets/esal.jpeg";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="bg-[#0A0925] w-full px-20 py-3 flex items-center justify-between fixed z-100">
      <img src={esla_logo} alt="" className="w-12" />
      <div className=" flex">
        <Link
          to=""
          className="text-white font-montserrat font-semibold mx-4 text-[1rem]"
        >
          Services
        </Link>
        <Link
          to=""
          className="text-white font-montserrat font-semibold mx-4 text-[1rem]"
        >
          Solutions
        </Link>
        <Link
          to=""
          className="text-white font-montserrat font-semibold mx-4 text-[1rem]"
        >
          Careers
        </Link>
      </div>
      <div className="w-[4rem] cursor-pointer bg-white h-[2rem] rounded-full flex justify-end items-center px-[0.1rem]">
        <div className="w-[1.9rem] h-[1.9rem] rounded-full bg-[#0A0925]"></div>
      </div>
    </div>
  );
};

export default Navbar;
