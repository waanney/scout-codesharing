import HeaderForAllPages from '../components/header.jsx';

function Changepassword() {
  return (
    <>
      <div className="flex min-h-screen flex-col">
        <HeaderForAllPages />
        <div className="flex flex-col items-center justify-center px-4 mt-[100px]">
          <h1 className="text-center text-[60px] font-bold mb-[16px] text-white">
            Change password
          </h1>
          {/*{showError && error && (
                    <div className="fixed inset-0 flex items-center justify-center z-10">
                        <div
                            className={`w-[450px] h-[110px] bg-gradient-to-r from-[#3366CC] to-[#1A3366] rounded-[10px] 
                                ${fadeError ? 'opacity-0 visibility-hidden' : 'opacity-100 visibility-visible'} 
                                transition-all duration-1000 ease-in-out flex items-center justify-center`}
                        >
                            <p className="text-[22px] font-bold text-center text-red-600">
                                {error}
                            </p>
                        </div>
                    </div>
                )}*/}
          <div className="flex flex-grow flex-col h-[500px] w-[500px] bg-black bg-opacity-50 rounded-[10px]">
            <div className="mt-[22px] ml-[8px]">
              <label
                className="font-Inter font-bold text-[18px]"
                htmlFor="oldpassword"
              >
                Old Password{' '}
              </label>
              <input
                className="w-[484px] h-[63px] items-center rounded-[10px] bg-transparent border-[1px] border-[#a2a2a2] pl-[15px] mt-[8px]"
                type="password"
                id="oldpassword"
                placeholder="Your old password"
                required
              ></input>
            </div>
            <div className="mt-[15px] ml-[8px]">
              <label
                className="font-Inter font-bold text-[18px]"
                htmlFor="newpassword"
              >
                New Password{' '}
              </label>
              <input
                className="w-[484px] h-[63px] items-center rounded-[10px] bg-transparent border-[1px] border-[#a2a2a2] pl-[15px] mt-[8px]"
                type="password"
                id="newpassword"
                placeholder="8+ characters &#40;at least 1 letter & 1 number&#41;"
                required
              ></input>
            </div>
            <div className="mt-[15px] ml-[8px]">
              <label
                className="font-Inter font-bold text-[18px]"
                htmlFor="confirmnewpassword"
              >
                Confirm New Password
              </label>
              <input
                className="w-[484px] h-[63px] items-center rounded-[10px] bg-transparent border-[1px] border-[#a2a2a2] pl-[15px] mt-[8px]"
                type="password"
                placeholder="Confirm your new Password"
                required
              ></input>
            </div>
            <div className="flex items-center justify-center mt-[35px] ">
              <button
                type="submit"
                className="flex items-center justify-center h-[50px] w-[150px] bg-[#3366cc] bg-opacity-50 font-Inter font-bold text-[25px] rounded-[10px] cursor-pointer"
              >
                Change
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Changepassword;
