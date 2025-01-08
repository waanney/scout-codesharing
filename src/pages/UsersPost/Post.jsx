import { Send } from 'lucide-react';
import { Save } from 'lucide-react';
import { Share } from 'lucide-react';
import HeaderForAllPages from '../../components/header.jsx';
import FooterAllPage from '../../components/footer.jsx';

function Post({ board }) {
  const SendClick = () => {
    alert('Button clicked!');
  };
  function stringToArray(inputString) {
    return inputString.split('\n'); // Tách chuỗi dựa trên dấu xuống dòng
  }
  //const numbers = Array.from({ length: 1 }, (_, index) => index + 1);

  return (
    <>
      <div className="flex min-h-screen flex-col bg-[#0b2878]">
        {/* Header*/}
        <HeaderForAllPages />
        {/* body */}
        <div className="cards grid grid-cols-[2fr_3fr] gap-[34px] place-items-center overflow-hidden px-5 lg:mt-16 lg:flex-row lg:items-stretch lg:px-[calc(160px-(1920px-100vw)/3)]">
          {/* thẻ thông tin */}
          <div className="card rounded-[10px] h-[636px] lg:flex lg:min-w-[336px] lg:flex-col xl:items-stretch aos-init aos-animate bg-[#05143c] mt-[50px] mb-[50px]">
            {/* User Info */}
            <div className="cards grid grid-cols-2 gap-[10px] mt-[37px]">
              <div className="card flex flex-row">
                <div className="ml-[37px] h-[50px] w-[50px]">
                  <img
                    className="rounded-full"
                    src="..\src\assets\demo_avatar.png"
                    alt="User Avatar"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="ml-[10px] text-white font-bold text-2xl leading-9">
                    userName
                  </div>
                  <div className="ml-[10px] text-white text-sm font-normal leading-[21pt]">
                    hh:mm dd/mm/yyyy
                  </div>
                </div>
              </div>
              <div className="card flex flex-col items-end mr-[40px]">
                <div className="w-[100px]">
                  <button
                    onClick={SendClick}
                    className="text-white flex flex-row items-center hover:scale-110"
                  >
                    <Share className="h-[30px] w-[30px]" />
                    Share
                  </button>
                </div>
                <div className="w-[100px]">
                  <button
                    onClick={SendClick}
                    className="text-white flex flex-row items-center hover:scale-110"
                  >
                    <Save className="h-[30px] w-[30px]" />
                    Save
                  </button>
                </div>
              </div>
            </div>
            {/* Problem Title */}
            <div className="mx-[38px] text-white">
              <div className="text-center text-2xl font-bold leading-[150%]">
                Problem solving
              </div>
              <div className="text-xl font-normal leading-[150%]">
                {board?.title}
              </div>
            </div>
            {/* Comments Section */}
            <div
              className="w-[80%] h-[60%] mx-auto px-[10px]
                      overflow-x-auto overflow-y-auto snap-y snap-mandatory 
                      scrollbar-thumb-gray-300 scrollbar-track-[#05143c] scrollbar-thin"
            >
              {[1, 2, 3, 4, 5, 6].map(num => (
                <div key={num} className="mb-4">
                  <div className="text-white text-2xl font-bold leading-9">
                    User{num}
                  </div>
                  <div className="text-white text-[15px] font-normal leading-[150%]">
                    {num === 1 && 'afdsafsadf'}
                    {num === 2 && 'Code này quá tệ'}
                    {num === 3 && 'Tôi sẽ copy code về dùng'}
                    {num === 4 && 'Tự bơi đi bro'}
                    {num === 5 &&
                      'Demo_text_comment Demo_text_comment Demo_text_comment'}
                    {num === 6 &&
                      'Demo_text_comment Demo_text_comment Demo_text_comment Demo_text_comment Demo_text_comment Demo_text_comment'}
                  </div>
                </div>
              ))}
            </div>
            {/* Comment Input */}
            <div className="flex flex-row px-[20px] py-[20px]">
              <input
                className="w-[90%] h-[43px] rounded-[10px] bg-[#253767] text-white text-[15px] font-normal leading-[150%] hover:drop-shadow-[0px_0px_10px_rgba(0,0,0,0.5)]"
                placeholder="  Add your comment..."
                type="text"
              />
              <button
                onClick={SendClick}
                type="submit"
                name="comment"
                value="user_input_comment"
                className="text-white align-middle ml-[10px] rotate-45"
              >
                <Send className="h-[30px] w-[30px] hover:scale-110" />
              </button>
            </div>
          </div>
          {/* Code Space */}
          <div className="card rounded-[10px] h-[636px] px-[10px] py-[20px] swiper swiper-initialized swiper-horizontal relative w-full swiper-backface-hidden aos-init aos-animate bg-[#05143c] mt-[50px] mb-[50px]">
            <div
              className="font-mono w-[100%] h-[100%] bg-[#00000080]
                        overflow-x-auto overflow-y-auto snap-y snap-mandatory 
                        scrollbar-thumb-gray-300 scrollbar-track-[#00000000] scrollbar-thin"
            >
              {stringToArray(board.content).map((code, line) => (
                <div key={line}>
                  <p className="font-mono flex">
                    <div className="text-gray-400 ml-[10px] w-[30px] text-right">
                      {line + 1}
                    </div>
                    <div className="text-white ml-[30px]">{code}</div>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* foot*/}
      <FooterAllPage />
    </>
  );
}

export default Post;
