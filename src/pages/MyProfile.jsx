/* eslint-disable no-unused-vars */
import HeaderForAllPages from '../components/header.jsx';
import FooterAllPage from '../components/footer.jsx';
import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";

function MyProfile() {
  const currentUser = useSelector(state => state.auth.login.currentUser) || JSON.parse(localStorage.getItem('currentUser')); // Lấy currentUser từ Redux hoặc từ localStorage
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [text, setText] = useState("")
  const [lineNumbers, setLineNumbers] = useState([true])
  const textareaRef = useRef(null)
  const lineHeight = "1.5rem"
  const numberOfVisibleLines = 18

  // Update line numbers when text changes
  useEffect(() => {
    const lines = text.split("\n")
    setLineNumbers(lines.map(() => true))
  }, [text])

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const newLineNumbers = [...lineNumbers]
      newLineNumbers.push(true)
      setLineNumbers(newLineNumbers)
    }
  }

  const handleTextChange = (e) => {
    const newText = e.target.value
    setText(newText)

    // Handle backspace/delete that removes lines
    const currentLines = newText.split("\n")
    if (currentLines.length < lineNumbers.length) {
      setLineNumbers(prev => prev.slice(0, currentLines.length))
    }
  }

  return( 
  <>
    <HeaderForAllPages/>
    <div className="flex ">
    <div className="flex min-h-screen flex-col">
      <div className="h-[360px] w-[230px] bg-[#3366CC] mt-[125px] ml-[35px] rounded-[10px]">
        <a className="flex flex-col items-center">
          <h2 className="font-Manrope font-extrabold text-[16px] text-center mt-[16px]">{currentUser.username}</h2>
          <svg className="my-[12px]" height="142" width="142" xmlns="http://www.w3.org/2000/svg">
              <circle r="71" cx="71" cy="71" fill="#D9D9D9" />
          </svg>
        </a>
        <div className="grid grid-cols-2">
          <div className="text-[8px] font-Manrope text-[#A3A3A3] ml-[15px] ">AGE</div>
          <div className="text-[11px] font-Manrope text-[#EAEBF6] mr-[28px]">27</div>
          <div className="text-[8px] font-Manrope text-[#A3A3A3] ml-[15px]">EDUCATION</div>
          <div className="text-[11px] font-Manrope text-[#EAEBF6] mr-[28px]">Master in Business</div>
          <div className="text-[8px] font-Manrope text-[#A3A3A3] ml-[15px]">STATUS</div>
          <div className="text-[11px] font-Manrope text-[#EAEBF6] mr-[28px]">Single</div>
          <div className="text-[8px] font-Manrope text-[#A3A3A3] ml-[15px]">OCCUPATION</div>
          <div className="text-[11px] font-Manrope text-[#EAEBF6] mr-[28px]">Sale Manager</div>
          <div className="text-[8px] font-Manrope text-[#A3A3A3] ml-[15px]">LOCATION</div>
          <div className="text-[11px] font-Manrope text-[#EAEBF6] mr-[28px]">Sydney</div>
          <div className="text-[8px] font-Manrope text-[#A3A3A3] ml-[15px]">High</div>
          <div className="text-[11px] font-Manrope text-[#EAEBF6] mr-[28px]">27</div>
        </div>
      </div>
      <div className="flex h-[92px] w-[230px] bg-[#3366CC] mt-[11px] ml-[35px] rounded-[10px]">
        <img 
          className="h-[13px] w-[14px] m-[11px]"
          src="src/assets/Content.svg">
        </img>
        <span className="text-[12px] font-Manrope text-[#EAEBF6] mt-[11px]">I am used to with online service and I usually do my online shopping from Instagram.</span>
      </div>
      <div className="h-[100px] w-[230px] bg-[#3366CC] mt-[11px] ml-[35px] rounded-[10px]">
        <span className="text-[12px] font-Manrope font-bold text-[#9F9F9F] ml-[11px] mt-[11px] ">PERSONALITY</span>
        <div className="flex flex-wrap gap-[4px] mx-[11px] mt-[8px]">
          <div className="px-[8px] py-[2px] bg-white rounded-full text-black text-sm font-medium ">Introvert</div>
          <div className="px-[8px] py-[2px] bg-white rounded-full text-black text-sm font-medium ">Thinker</div>
          <div className="px-[8px] py-[2px] bg-white rounded-full text-black text-sm font-medium ">Spender</div>
          <div className="px-[8px] py-[2px] bg-white rounded-full text-black text-sm font-medium ">Tech-savvy</div>
        </div>
      </div>
    </div>
    
    <div className="mt-[125px] ml-[30px] w-[900px] h-[570px] bg-black bg-opacity-50 rounded-[10px]">
      <div className="relative rounded-[10px]">
        <div className="flex justify-between mt-[10px] mx-[10px]">
          <div className=" flex items-center space-x-1">
            <a className="flex items-center">
            <svg height="30" width="30" xmlns="http://www.w3.org/2000/svg">
              <circle r="15" cx="15" cy="15" fill="#D9D9D9" />
            </svg>
            <h5 className="ml-[5px] font-Raleway font-bold text-[22px]">{currentUser.username}</h5>
            </a>
          </div>
          <button className="h-[40px] w-[90px] bg-white text-black rounded-[10px] font-raleway text-[16px] cursor-pointer hover:font-bold">
              Submit
          </button>
        </div>
        <input 
            onChange={(e)=>setTitle(e.target.value)}
            className="w-[845px] h-[lineHeight] items-center bg-black bg-opacity-50  rounded-[5px] pl-[15px] mt-[8px] mx-[28px] text-wrap"
            type="text"
            placeholder="Add your title here!" 
            required>
        </input>
        <input 
            onChange={(e)=>setDescription(e.target.value)}
            className="w-[845px] h-[lineHeight] items-center bg-black bg-opacity-50  rounded-[5px]  pl-[15px] mt-[8px] mx-[28px] text-wrap"
            type="text"
            placeholder="What do you want to share today?" 
            required>
        </input>
        
        
        <div className="flex bg-black bg-opacity-50 mx-[28px] mt-[8px]">
          {/* Line numbers */}
          <div 
            className="py-2 px-2 text-right bg-muted font-mono select-none overflow-hidden"
            style={{ 
              minWidth: "3rem",
              height: `calc(${lineHeight} * ${numberOfVisibleLines})`,
            }}
          >
            <div 
              className="h-full"
              style={{
                transform: textareaRef.current ? 
                  `translateY(-${textareaRef.current.scrollTop}px)` : 
                  'none'
              }}
            >
              {Array.from({ length: Math.max(numberOfVisibleLines, lineNumbers.length) }, (_, index) => (
                <div 
                  key={index} 
                  className="text-muted-foreground"
                  style={{ 
                    height: lineHeight, 
                    lineHeight,
                    opacity: index < lineNumbers.length ? 1 : 0
                  }}
                >
                  {(index + 1).toString().padStart(2, "0")}
                </div>
              ))}
            </div>
          </div>
          {/* Text area */}
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            onScroll={(e) => {
              // Force re-render to update line numbers position
              const target = e.target;
              if (target) {
                const lineNumbersContainer = target.previousSibling.firstChild;
                if (lineNumbersContainer) {
                  lineNumbersContainer.style.transform = `translateY(-${target.scrollTop}px)`;
                }
              }
            }}
            className="flex-1 p-2 bg-transparent border-none outline-none resize-none font-mono"
            placeholder="Press Enter to create new numbered lines..."
            style={{
              lineHeight,
              height: `calc(${lineHeight} * ${numberOfVisibleLines})`,
              overflowY: "auto",
            }}
            aria-label="Numbered text editor"
          />
        </div>
      </div>
    </div>
    </div>
    <FooterAllPage/>
  </>
  
  );
}

export default MyProfile;
