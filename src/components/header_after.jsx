const HeaderForAllPages_after = () => {
    return (
      <div className="fixed w-full px-[10px] z-20 ">
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
          <div className="mx-[30px] hover:underline hover:font-bold cursor-pointer">
            <a className="section" href="#home">
              Home
            </a>
          </div>
          <div className="mx-[30px] hover:underline hover:font-bold cursor-pointer">
            <a className="section" href="#discussion">
              Discussion
            </a>
          </div>
          <div className="mx-[30px] hover:underline hover:font-bold cursor-pointer">
            <a className="section" href="#projects">
              Projects
            </a>
          </div>
          <div className="mx-[30px] hover:underline hover:font-bold cursor-pointer">
            <a className="section" href="#profile">
              Profile
            </a>
          </div>
        </div>
  
        <div className=" flex items-center space-x-1 justify-end">
          <a className="flex items-center">
          <svg height="30" width="30" xmlns="http://www.w3.org/2000/svg">
            <circle r="15" cx="15" cy="15" fill="#D9D9D9" />
          </svg>
          <h5 className="ml-[5px] font-Raleway font-bold text-[22px]">Username</h5>
          </a>
        </div>
        </div>
      </div>
    );
  };
  
  export default HeaderForAllPages_after;
  