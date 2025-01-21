import React from "react";

const LoadingAnimation = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="relative w-48 h-16">
        {/* Circles */}
        <div className="absolute w-5 h-5 bg-white rounded-full left-[-5%] animate-circle"></div>
        <div className="absolute w-5 h-5 bg-white rounded-full left-[20%] animate-circle2"></div>
        <div className="absolute w-5 h-5 bg-white rounded-full left-[45%] animate-circle3"></div>
        <div className="absolute w-5 h-5 bg-white rounded-full right-[20%] animate-circle4"></div>
        <div className="absolute w-5 h-5 bg-white rounded-full right-[-5%] animate-circle5"></div>
        
        
        {/* Shadows */}
        <div className="absolute w-5 h-1 bg-gray-700 rounded-full opacity-90 blur-sm left-[-5%] top-[62px] animate-shadow"></div>
        <div className="absolute w-5 h-1 bg-gray-700 rounded-full opacity-90 blur-sm left-[20%] top-[62px] animate-shadow2"></div>
        <div className="absolute w-5 h-1 bg-gray-700 rounded-full opacity-90 blur-sm left-[45%] top-[62px] animate-shadow3 "></div>
        <div className="absolute w-5 h-1 bg-gray-700 rounded-full opacity-90 blur-sm right-[20%] top-[62px] animate-shadow3"></div>
        <div className="absolute w-5 h-1 bg-gray-700 rounded-full opacity-90 blur-sm right-[-5%] top-[62px] animate-shadow3"></div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
