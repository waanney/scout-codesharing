const HeaderForAllPages = () => {
  return (
    <div className="w-[100%] fixed flex justify-between items-center px-[20px] z-20">
      <a className="flex justify-between items-center mt-[10px]" href="/">
        <img
          className="h-[37px] w-[37px] mr-[5px]"
          src="src/assets/Scout.ico"
          alt="Scout Logo"
        />
        <h4 className="text-[32px] font-bold font-raleway">Scout</h4>
      </a>

      <div className="flex items-center justify-between bg-black bg-opacity-50 h-[68px] w-[498px] rounded-[10px] mt-[10px] ml-[30px] px-[15px]">
        <div className="mx-[30px] hover:underline hover:font-bold cursor-pointer">
          <a
            className="section"
            onClick={() => (window.location.href = 'http://localhost:5173/')}
          >
            Home
          </a>
        </div>
        <div className="mx-[30px] hover:underline hover:font-bold cursor-pointer">
          <a
            className="section"
            onClick={() =>
              (window.location.href = 'http://localhost:5173/discussion')
            }
          >
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

      <div className="justify-between space-x-1">
        <button className="h-[40px] w-[90px] bg-black text-white rounded-[10px] font-raleway text-[16px] cursor-pointer hover:font-bold">
          Sign up
        </button>
        <button className="h-[40px] w-[90px] bg-white text-black rounded-[10px] font-raleway text-[16px] cursor-pointer hover:font-bold hover:bg-[#e0e0e0]">
          Log in
        </button>
      </div>
    </div>
  );
};

export default HeaderForAllPages;
