import FooterAllPage from '../components/footer.jsx';
import HeaderForAllPages_after from '../components/header_after.jsx';
function HomePage() {
  return (
    <>
      <div className="flex min-h-screen flex-col">
        <HeaderForAllPages_after/>
        <div
          className=" bg-fixed bg-no-repeat bg-center bg-cover font-raleway text-white/70 font-bold relative top-0 left-1/2 transform -translate-x-1/2 w-full h-[500px] flex items-center justify-center text-center text-[60px] px-5 my-[90px]"
          style={{
            backgroundImage: "url('src/assets/Scout_blur.png')",
            backgroundSize: '500px 500px',
          }}
        >
          Source Code Open for <br></br>Universal Testing
        </div>

        <div className="relative  p-[20px]">
          <h2 className="relative flex text-[60px] text-white font-bold w-full">
            Who are we?
          </h2>
          <div className="cards grid grid-cols-4 gap-[34px_23px] mt-7 place-items-center">
            <div className="card w-[280px] h-[252px] bg-[#274494] rounded-[10px] border border-[#3653a3] text-left shadow-md">
              <img
                className="h-[44px] w-[44px] bg-black rounded-[9px] mt-[29px] mb-[19px] ml-[22px]"
                src="src/assets/Devteam.svg"
              ></img>
              <span className="ml-[22px] mb-[18px] font-inter font-semibold text-[20px]">
                @DC1: Devteam-4
              </span>
              <p className="ml-[22px] w-[231px] font-inter font-medium text-[14px]">
                We are 4 Devmems of Fessior - GDSC - HCMUT. Especially, we are
                all the freshmen of Computer Science of HCMUT - OISP.
              </p>
            </div>
            <div className="card w-[280px] h-[252px] bg-[#274494] rounded-[10px] border border-[#3653a3] text-left shadow-md">
              <img
                className="h-[44px] w-[44px] bg-black rounded-[9px] mt-[29px] mb-[19px] ml-[22px]"
                src="src/assets/Scout.svg"
              ></img>
              <span className="ml-[22px] mb-[18px] font-inter font-semibold text-[20px]">
                Scout
              </span>
              <p className="ml-[22px] w-[231px] font-inter font-medium text-[14px]">
                It means Source Code Open for Universal Testing. We discuss
                about C++ - a coding language on this website.
              </p>
            </div>
            <div className="card w-[280px] h-[252px] bg-[#274494] rounded-[10px] border border-[#3653a3] text-left shadow-md">
              <img
                className="h-[44px] w-[44px] bg-black rounded-[9px] mt-[29px] mb-[19px] ml-[22px]"
                src="src/assets/Profile.svg"
              ></img>
              <span className="ml-[22px] mb-[18px] font-inter font-semibold text-[20px]">
                Profile
              </span>
              <p className="ml-[22px] w-[231px] font-inter font-medium text-[14px]">
                {' '}
                Introduction about you. Everyone can get more infomation about
                you. Your posts and what you shared will be here, too.
              </p>
            </div>
            <div className="card w-[280px] h-[536px] row-span-2 bg-[#274494] rounded-[10px] border border-[#3653a3] text-left shadow-md">
              <img
                className="h-[44px] w-[44px] bg-black rounded-[9px] mt-[29px] mb-[19px] ml-[22px]"
                src="src/assets/Scout.ico"
              ></img>
              <span className="ml-[22px] mb-[18px] font-inter font-semibold text-[20px]">
                Discussion
              </span>
              <p className="ml-[22px] w-[231px] font-inter font-medium text-[14px]">
                This is where your code is shared and enhanced by others
                suggestion
              </p>
              <img
                className="mt-[30px] ml-[27.5px]"
                style={{ height: '280px', width: '223px' }}
                src="src/assets/Discussion.png"
                alt="Discussion"
              />
            </div>
            <div className="card w-[280px] h-[252px] bg-[#274494] rounded-[10px] border border-[#3653a3] text-left shadow-md">
              <img
                className="h-[44px] w-[44px] bg-black rounded-[9px] mt-[29px] mb-[19px] ml-[22px]"
                src="src/assets/Storage.svg"
              ></img>
              <span className="ml-[22px] mb-[18px] font-inter font-semibold text-[20px]">
                Storage
              </span>
              <p className="ml-[22px] w-[231px] font-inter font-medium text-[14px]">
                When you “Save” a post, it will be sent to Storage.
              </p>
            </div>
            <div className="card w-[280px] h-[252px] bg-[#274494] rounded-[10px] border border-[#3653a3] text-left shadow-md">
              <img
                className="h-[44px] w-[44px] bg-black rounded-[9px] mt-[29px] mb-[19px] ml-[22px]"
                src="src/assets/Newfeed.svg"
              ></img>
              <span className="ml-[22px] mb-[18px] font-inter font-semibold text-[20px]">
                Newfeed
              </span>
              <p className="ml-[22px] w-[231px] font-inter font-medium text-[14px]">
                All the posts of everyone will be here for you to surf.
              </p>
            </div>
            <div className="card w-[280px] h-[252px] bg-[#274494] rounded-[10px] border border-[#3653a3] text-left shadow-md">
              <img
                className="h-[44px] w-[44px] bg-black rounded-[9px] mt-[29px] mb-[19px] ml-[22px]"
                src="src/assets/Posts.svg"
              ></img>
              <span className="ml-[22px] mb-[18px] font-inter font-semibold text-[20px]">
                Posts
              </span>
              <p className="ml-[22px] w-[231px] font-inter font-medium text-[14px]">
                When you have a C++ problem or you want to share your C++ code
                with everyone, you can post them on Discussion.
              </p>
            </div>
          </div>
        </div>
      </div>
      <FooterAllPage />
    </>
  );
}

export default HomePage;
