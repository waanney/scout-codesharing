/* eslint-disable react-refresh/only-export-components */
import {useState } from "react";
import { Link } from "react-router-dom";

export const useUser = () => {
  const [user, setUser] = useState(null);

  return { user, setUser };
};

const HeaderForAllPages = () => {
  const { user } = useUser();

  return (
    <div className="fixed w-full px-[10px] z-20 ">
      {user ? (
        <>
          <div className="mx-auto flex items-center justify-between">
        <a className="flex justify-between items-center mt-[10px]" href="/">
          <img
            className="h-[37px] w-[37px] mr-[5px]"
            src="src/assets/Scout.ico"
            alt="Scout Logo"
          />
          <h4 className="text-[32px] font-bold font-raleway">Scout</h4>
        </a>
  
        <div className="absolute left-1/2 -translate-x-1/2 mt-[20px] flex items-center justify-between bg-black bg-opacity-50 h-[68px] w-[498px] rounded-[10px]">
          <Link to="/" className="clickHome">
          <div className="mx-[30px] hover:underline hover:font-bold cursor-pointer">
            <a className="section">
              Home
            </a>
          </div>
          </Link>
          <Link to="/discussion" className="discussion">
          <div className="mx-[30px] hover:underline hover:font-bold cursor-pointer">
            <a className="section" href="#discussion">
              Discussion
            </a>
          </div>
          </Link>
          <div className="mx-[30px] hover:underline hover:font-bold cursor-pointer">
            <a className="section" href="#projects">
              Projects
            </a>
          </div>
          <Link to="/myprofile" className="clickProfile">
              <div className="mx-[30px] hover:underline hover:font-bold cursor-pointer">
                <a className="section" href="#profile">
                  Profile
                </a>
              </div>
          </Link>
        </div>
  
        <div className=" flex items-center space-x-1 justify-end">
          <a className="flex items-center">
          <svg height="30" width="30" xmlns="http://www.w3.org/2000/svg">
            <circle r="15" cx="15" cy="15" fill="#D9D9D9" />
          </svg>
          <h5 className="ml-[5px] font-Raleway font-bold text-[22px]">{user}</h5>
          </a>
        </div>
        </div>
        </>
      ):(
        <>
          <div className="mx-auto flex items-center justify-between">
            <a className="flex justify-between items-center mt-[10px]" href="/">
              <img
                className="h-[37px] w-[37px] mr-[5px]"
                src="src/assets/Scout.ico"
                alt="Scout Logo"
              />
              <h4 className="text-[32px] font-bold font-raleway">Scout</h4>
            </a>
            <div className="flex absolute left-1/2 -translate-x-1/2 mt-[20px] items-center justify-between bg-black bg-opacity-50 h-[68px] w-[498px] rounded-[10px]">
              <Link to="/" className="clickHome" >
              <div className="mx-[30px] hover:underline hover:font-bold cursor-pointer">
                <a className="section">
                  Home
                </a>
              </div>
              </Link>
              <Link to="/login" className="discussion-nologin">
                <div className="mx-[30px] hover:underline hover:font-bold cursor-pointer">
                  <a className="section" href="#discussion">
                    Discussion
                  </a>
                </div>
              </Link>
              <div className="mx-[30px] hover:underline hover:font-bold cursor-pointer">
                <a className="section" href="#projects">
                  Projects
                </a>
              </div>
              <Link to="/login" className="clickProfile-nologin">
                <div className="mx-[30px] hover:underline hover:font-bold cursor-pointer">
                  <a className="section" href="#profile">
                    Profile
                  </a>
                </div>
              </Link>
            </div>
            <div className="justify-between space-x-1">
              <Link to="/signup" className="clickSignup">
              <button className="h-[40px] w-[90px] bg-black text-white rounded-[10px] font-raleway text-[16px] cursor-pointer hover:font-bold">
                Sign up
              </button>
              </Link>
              <Link to="/login" className="clickLogin">
              <button className="h-[40px] w-[90px] bg-white text-black rounded-[10px] font-raleway text-[16px] cursor-pointer hover:font-bold hover:bg-[#e0e0e0]">
                Log in
              </button>
              </Link>
            </div>
          </div>
        </>
      )
      }
      
    </div>
  );
};


export default HeaderForAllPages ;