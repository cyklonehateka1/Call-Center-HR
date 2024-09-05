import { ChangeEvent, FormEventHandler, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

interface ApplicationForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

const ApplicationFormBasic = () => {
  const [formData, setFormData] = useState<ApplicationForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [error, setError] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const navigate = useNavigate();

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    // Form validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone
    ) {
      setError("All fields are required");
      return;
    }

    const dataToBeSent = {
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
    };
    // Axios request

    localStorage.setItem("applicationData", JSON.stringify(dataToBeSent));
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    });

    setError("");
    navigate("/application/test");
  };

  return (
    <div className="w-full bg-[#0A0925] min-h-screen">
      <Navbar />
      <div className="w-full relative top-[6.5rem] px-[25%] py-5 bg-[#0A0925]">
        <h3 className="font-montserratalt text-white font-bold text-[2rem] mb-5">
          Want to be part?🖐
        </h3>
        <form action="" className=" w-full" onSubmit={handleSubmit}>
          <div className="w-full mb-7">
            <label htmlFor="" className="font-montserrat text-white">
              Name
            </label>
            <div className="flex full justify-between mt-2">
              <input
                type="text"
                placeholder="first name"
                name="firstName"
                onChange={handleChange}
                className="bg-[#222234] w-[49%] h-14 rounded-md px-4 outline-none text-white font-montserrat"
              />
              <input
                type="text"
                placeholder="last name"
                name="lastName"
                onChange={handleChange}
                className="bg-[#222234] w-[49%] h-14 rounded-md px-4 outline-none text-white font-montserrat"
              />
            </div>
          </div>
          <div className="flex w-full flex-col mb-7">
            <label htmlFor="" className="font-montserrat text-white">
              Your email
            </label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              placeholder="person@example.com"
              className="bg-[#222234] w-full h-14 mt-2 rounded-md px-4 outline-none text-white font-montserrat"
            />
          </div>
          <div className="w-full flex flex-col mb-7">
            <label htmlFor="" className="font-montserrat text-white">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              onChange={handleChange}
              placeholder="+233567890123"
              className="bg-[#222234] w-full h-14 mt-2 rounded-md px-4 outline-none text-white font-montserrat"
            />
          </div>

          <p className="text-rose-500 text-[0.8rem] mb-2 mt-2">{error}</p>
          <button
            className={`py-3 w-full font-montserrat text-white bg-[#5D5FEF] rounded-md`}
          >
            Next
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplicationFormBasic;
