import { useState } from 'react';
import { Send } from 'lucide-react';
export default function LineComment() {
  {
    ('test');
  }
  const [line_content, setLineContent] = useState('');
  const handleComment2 = async e => {
    e.preventDefault();
    if (!line_content.trim()) {
      alert('Comment must have at least 1 letter.');
      return;
    }
  };
  {
    ('/test');
  }
  return (
    <div>
      <div className="w-[80%] h-[100%] mx-auto px-[10px] overflow-x-auto overflow-y-auto snap-y snap-mandatory scrollbar-thumb-gray-300 scrollbar-track-[#05143c] scrollbar-thin">
        comment display
      </div>
      <form
        onSubmit={handleComment2}
        className="flex flex-row px-[20px] py-[20px]"
      >
        <input
          value={line_content}
          onChange={e => setLineContent(e.target.value)}
          className="w-[90%] h-[43px] rounded-[10px] bg-[#253767] text-white text-[15px] font-normal leading-[150%] hover:drop-shadow-[0px_0px_10px_rgba(0,0,0,0.5)]"
          placeholder="  Add your comment..."
          type="text"
        />
        <button
          type="submit"
          className="text-white align-middle ml-[10px] rotate-45"
        >
          <Send className="h-[30px] w-[30px] hover:scale-110" />
        </button>
      </form>
    </div>
  );
}
