import { Save } from 'lucide-react';
import { Share } from 'lucide-react';
import { CodeBlock, hybrid } from 'react-code-blocks';

const PostCard = ({ post }) => {
  const SendClick = () => {
    alert('Button clicked!');
  };
  const customTheme = {
    ...hybrid,
    backgroundColor: 'transparent',
  };
  return (
    <div
      className="card bg-[#05143c] w-[543px] h-[600px] rounded-[10px] p-[20px] hover:drop-shadow-[4px_4px_4px_rgba(0,0,0,0.5)]"
      onClick={() =>
        (window.location.href = `http://localhost:5173/post/${post._id}`)
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
        {post.title}
      </div>
      {/*Code display*/}
      <div
        className=" font-mono text-[12px] w-[80%] h-[81%] mt-[10px] bg-[#00000080] rounded-[5px] mx-auto
                    overflow-x-auto overflow-y-hidden snap-y snap-mandatory
                    scrollbar-thumb-gray-300 scrollbar-track-[#00000000] scrollbar-thin"
      >
        <CodeBlock
          text={post.content}
          language="cpp"
          theme={customTheme}
          showLineNumbers={true}
          wrapLines
        />
      </div>
    </div>
  );
};

export default PostCard;
