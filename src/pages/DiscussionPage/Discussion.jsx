import HeaderForAllPages from '../../components/header.jsx';
import { Save } from 'lucide-react';
import { Share } from 'lucide-react';

function Discussion() {
  const SendClick = () => {
    alert('Button clicked!');
  };
  const numbers = Array.from({ length: 50 }, (_, index) => index + 1);
  return (
    <>
      <div className="flex min-h-screen flex-col">
        <HeaderForAllPages />
        <div className="fixed z-10 flex w-full items-center justify-between p-5 transition-all md:py-3.5 lg:px-7 lg:py-5 shadow-[0px_6px_15px_rgba(64,79,104,0.05)]"></div>
        <div className="place-items-center font-raleway text-[48px] text-white font-bold mt-[103px]">
          <p>What is on?</p>
        </div>
        <div className="cards grid grid-cols-2 gap-[66x] place-items-center mt-[21px]">
          <div
            className="card bg-[#05143c] w-[543px] h-[600px] rounded-[10px] p-[20px] hover:drop-shadow-[4px_4px_4px_rgba(0,0,0,0.5)]"
            onClick={() =>
              (window.location.href = 'http://localhost:5173/post')
            }
          >
            {/*User info*/}
            <div className="cards grid grid-cols-2 gap-[10px]">
              <div className="card flex flex-row">
                <div className="h-[30px] w-[30px]">
                  <img
                    className="rounded-full"
                    src="../src/assets/demo_avatar.png"
                    alt="User Avatar"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="ml-[10px] text-white font-bold text-[16px]">
                    userName
                  </div>
                  <div className="ml-[10px] text-white text-[8px] font-normal">
                    hh:mm dd/mm/yyyy
                  </div>
                </div>
              </div>
              <div className="card flex flex-col items-end">
                <div className="w-[100px]">
                  <button
                    onClick={SendClick}
                    className="text-white flex flex-row items-center hover:scale-110"
                  >
                    <Share className="h-[20px] w-[20px]" />
                    Share
                  </button>
                </div>
                <div className="w-[100px]">
                  <button
                    onClick={SendClick}
                    className="text-white flex flex-row items-center hover:scale-110"
                  >
                    <Save className="h-[20px] w-[20px]" />
                    Save
                  </button>
                </div>
              </div>
            </div>

            {/*Title*/}
            <div className="mx-[38px] text-white text-[14px] font-normal leading-[150%]">
              caption_from_DataBase caption_from_DataBase caption_from_DataBase
              caption_from_DataBase
            </div>
            {/*Code display*/}
            <div
              className="font-mono text-[12px] w-[80%] h-[55%] mt-[10px] bg-[#00000080] rounded-[5px] place-self-center
                        overflow-x-auto overflow-y-auto snap-y snap-mandatory"
            >
              {numbers.slice(0, 17).map(line => (
                <div key={line}>
                  <p className="font-mono flex">
                    <div className="text-gray-400 ml-[15px] w-[15px] text-right">
                      {line}
                    </div>
                    <div className="text-white ml-[15px]">{line}</div>
                  </p>
                </div>
              ))}
            </div>
            {/* Comments Section */}
            <div
              className="w-[80%] h-[25%] mt-[10px] mx-auto px-[10px] 
                      overflow-x-auto overflow-y-auto snap-y snap-mandatory 
                      scrollbar-thumb-gray-300 scrollbar-track-[#05143c] scrollbar-thin"
            >
              {[1, 2, 3, 4, 5, 6].map(num => (
                <div key={num} className="mb-4">
                  <p className="text-white text-[14px] font-bold">User{num}</p>
                  <p className="text-white text-[12px] font-normal leading-[150%]">
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
          </div>
        </div>
      </div>
    </>
  );
}

export default Discussion;
