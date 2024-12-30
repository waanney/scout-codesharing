import HeaderForAllPages from '../components/header.jsx';
import {Link} from 'react-router-dom';

function Signup() {
  return (
    <>
      <div className="flex min-h-screen flex-col">
        <HeaderForAllPages />
        <div className="flex flex-col items-center justify-center px-4 mt-[100px]">
          <h1 className="text-center text-[60px] font-bold mb-[16px] text-white">Create an account</h1>
          <div className="flex flex-grow flex-col h-[600px] w-[500px] bg-black bg-opacity-50 rounded-[10px]">
            <div className= "mt-[22px] ml-[8px]"> 
              <label className="font-Inter font-bold text-[18px]" htmlFor="username">Username <span className="text-[15px] text-white text-opacity-70"> &#40;display name&#41;</span></label>
              <input className="w-[484px] h-[63px] items-center rounded-[10px] bg-transparent  border-[1px] border-[#a2a2a2] pl-[15px] mt-[8px]" type="text" id="username" placeholder="Username" required></input>
            </div>
            <div className= "mt-[15px] ml-[8px]"> 
              <label className="font-Inter font-bold text-[18px]" htmlFor="userid">UserID <span className="text-[15px] text-white text-opacity-70"> &#40;use to log in and only you can see your id&#41;</span></label>
              <input className="w-[484px] h-[63px] items-center rounded-[10px] bg-transparent  border-[1px] border-[#a2a2a2] pl-[15px] mt-[8px]" type="text" id="userid" placeholder="UserID" required></input>
            </div>
            <div className= "mt-[15px] ml-[8px]"> 
              <label className="font-Inter font-bold text-[18px]" htmlFor="password">Password </label>
              <input className="w-[484px] h-[63px] items-center rounded-[10px] bg-transparent  border-[1px] border-[#a2a2a2] pl-[15px] mt-[8px]" type="password" id="password" placeholder="8+ characters &#40;at least 1 letter & 1 number&#41;" required></input>
            </div>
            <div className= "mt-[15px] ml-[8px]"> 
              <label className="font-Inter font-bold text-[18px]" htmlFor="confirm_password">Confirm Password</label>
              <input className="w-[484px] h-[63px] items-center rounded-[10px] bg-transparent  border-[1px] border-[#a2a2a2] pl-[15px] mt-[8px]" type="password" id="confirm_password" placeholder="Confirm Password" required></input>
            </div>
            <div className="flex items-center justify-center mt-[35px] ">
              <button type="submit" className="flex items-center justify-center h-[50px] w-[150px] bg-[#3366cc] bg-opacity-50 font-Inter font-bold text-[25px] rounded-[10px] cursor-pointer">Sign up</button>
            </div>  
            <div className=" text-center mt-[12px] text-[20px] text-white text-opacity-70">
              Already have an account? <Link to="/login"><span className="font-bold italic cursor-pointer hover:underline">Log in</span> </Link>
            </div>        
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
