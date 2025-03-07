import { X } from 'lucide-react';
import { env } from '~/configs/environment.js';
import useUserId from '~/utils/useUserId';

const CommentInlineCard = ({ comment, onRequestDelete }) => {
  const currentUserId = useUserId();

  const handleRequestDelete = () => {
    onRequestDelete(comment._id);
  };

  return (
    <div className="relative w-full rounded-[10px] mb-2 p-2 bg-[#253767] text-white">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <a
            target="_blank"
            href={`${env.FE_ROOT}/profile/${comment.userId}`}
            className="font-bold text-lg"
          >
            {comment.username}
          </a>
        </div>
        {comment.userId === currentUserId && (
          <button
            className="absolute top-[5px] right-[5px] z-10"
            onClick={handleRequestDelete}
          >
            <X
              size={20}
              className="text-white hover:text-red-600 cursor-pointer"
            />
          </button>
        )}
      </div>
      <div className="mt-1 ml-3 text-[16px] break-words">{comment.content}</div>
    </div>
  );
};

export default CommentInlineCard;
