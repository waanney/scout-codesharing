import { useDispatch } from 'react-redux';
import HeaderForAllPages from '../components/header.jsx';
import { loginUser } from '../redux/apiRequest.js';
import {Link, useNavigate} from 'react-router-dom';
import { useState } from 'react'; 

const Login = () => {
  const[UserID, setUsername]=useState("");
  const[Password, setPassword]=useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const newUser = {
      userID: UserID,
      password: Password,
    };
    loginUser(newUser,dispatch,navigate)
  };
  return (
    <>
      <div className="flex min-h-screen flex-col">
        <HeaderForAllPages />
        <div className="flex flex-col items-center justify-center px-4 mt-[100px]">
          <h1 className="text-center text-[60px] font-bold mb-10 text-white">Log in</h1>
          <form onSubmit={handleLogin} className="flex flex-grow flex-col h-[500px] w-[500px] bg-black bg-opacity-50 rounded-[10px]">
            <div className= "mt-[31px] ml-[8px]"> 
              <label className="font-Inter font-bold text-[18px]" htmlFor="userid">UserID</label>
              <input 
                onChange={(e)=>setUsername(e.target.value)}
                className="w-[484px] h-[63px] items-center rounded-[10px] bg-transparent  border-[1px] border-[#a2a2a2] pl-[15px] mt-[8px]" 
                type="text"  
                placeholder="UserID" 
                required>
              </input>
            </div>
            <div className= "mt-[31px] ml-[8px]"> 
              <label className="font-Inter font-bold text-[18px]" htmlFor="password">Password</label>
              <input 
                onChange={(e)=>setPassword(e.target.value)}
                className="w-[484px] h-[63px] items-center rounded-[10px] bg-transparent  border-[1px] border-[#a2a2a2] pl-[15px] mt-[8px]"
                type="password"
                placeholder="Password" 
                required>
              </input>
            </div>
            <div className="font-Inter font-bold text-[18px] text-right mr-[8px] mt-[43px]">Forgot your password?</div>
            <div className="flex items-center justify-center mt-[35px] ">
              <button type="submit" className="flex items-center justify-center h-[50px] w-[150px] bg-[#3366cc] bg-opacity-50 font-Inter font-bold text-[25px] rounded-[10px] cursor-pointer">Log In</button>
            </div> 
            <div className=" text-center mt-[28px] text-[20px] text-white text-opacity-70">
              Don't have an account? <Link to="/signup"><span className="font-bold italic cursor-pointer hover:underline">Sign up</span></Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;

