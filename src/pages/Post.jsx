import { Send } from 'lucide-react';
import { Save } from 'lucide-react';
import { Share } from 'lucide-react';

function Post() {
  const SendClick = () => {
    alert('Button clicked!');
  };
  const numbers = Array.from({ length: 50 }, (_, index) => index + 1);

  return (
    <div className="h-[100%] w-auto flex flex-row justify-start flex-shrink-0 font-[Inter] antialiased bg-[#0b2878]">
      {/* Comment Space */}
      <div className="relative w-[444px] h-[636px] rounded-[10px] bg-[#05143c] ml-[50px] mt-[150px] mb-[50px]">
        {/* User Info */}
        <div className="flex flex-row mt-[37px]">
          <div className="ml-[37px] h-[50px] w-[50px]">
            <img src="/placeholder.svg" alt="User Avatar" />
          </div>
          <div className="flex flex-col">
            <div className="ml-[10px] text-white font-bold text-2xl leading-9">
              userName
            </div>
            <div className="ml-[10px] text-white text-sm font-normal leading-[21pt]">
              hh:mm dd/mm/yyyy
            </div>
          </div>
          <div className="flex flex-col">
            <button
              onClick={SendClick}
              className="text-white align-middle ml-[150px] mt-[-10px] flex flex-row items-center"
            >
              <Share className="h-[30px] w-[30px]" />
              Share
            </button>
            <button
              onClick={SendClick}
              className="text-white align-middle ml-[150px] mt-[10px] flex flex-row items-center"
            >
              <Save className="h-[30px] w-[30px]" />
               Save
            </button>
          </div>
        </div>
        {/* Problem Title */}
        <div>
          <div className="mx-[38px] text-white text-center text-2xl font-bold leading-[150%]">
            Problem solving
          </div>
          <div className="ml-[38px] text-white text-xl font-normal leading-[150%]">
            caption_from_DataBase
          </div>
        </div>
        {/* Comments Section */}
        <div className="w-[80%] h-[400px] mx-auto mb-[10px] px-[10px] 
                        overflow-x-auto overflow-y-auto snap-y snap-mandatory 
                        scrollbar scrollbar-thumb-gray-300 scrollbar-track-[#05143c] scrollbar-thin">
          {[1, 2, 3, 4, 5, 6].map(num => (
            <div key={num} className="mb-4">
              <p className="text-white text-2xl font-bold leading-9">
                User{num}
              </p>
              <p className="text-white text-[15px] font-normal leading-[150%]">
                {num === 1 && 'Tôi thích những dòng code này, help what??'}
                {num === 2 && 'Code này quá tệ'}
                {num === 3 && 'Tôi sẽ copy code về dùng'}
                {num === 4 && 'Tự bơi đi bro'}
                {num === 5 &&
                  'Demo_text_comment Demo_text_comment Demo_text_comment'}
                {num === 6 &&
                  'Demo_text_comment Demo_text_comment Demo_text_comment Demo_text_comment Demo_text_comment Demo_text_comment'}
              </p>
            </div>
          ))}
        </div>
        {/* Comment Input */}
        <div className="flex flex-row">
          <input
            className="ml-[18px] w-[370px] h-[43px] rounded-[10px] bg-[#253767] text-white text-[15px] font-normal leading-[150%]"
            placeholder="  Add a comment..."
            type="text"
          />
          <button
            onClick={SendClick}
            type="submit"
            name="comment"
            value="user_input_comment"
            className="text-white align-middle ml-[10px] rotate-45"
          >
            <Send className="h-[30px] w-[30px]" />
          </button>
        </div>
      </div>

      {/* Code Space */}
      <div className="relative w-[769px] h-[636px] rounded-[10px] bg-[#05143c] ml-[20px] mt-[150px] mb-[50px]">
        <br />
        <div className="font-mono w-[760px] h-[600px] px-[10px] overflow-x-auto overflow-y-auto snap-y snap-mandatory scrollbar scrollbar-thumb-gray-300 scrollbar-track-[#05143c] scrollbar-thin">
          {numbers.map(
            (
              line, //mảng numbers là hằng được tạo để test
            ) => (
              <div key={line}>
                <p className="font-mono flex">
                  <div className="text-gray-400 ml-[10px] w-[30px] text-right">
                    {line}
                  </div>
                  <div className="text-white ml-[30px]">
                    Code_of_line_{line}
                  </div>
                </p>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

export default Post;
