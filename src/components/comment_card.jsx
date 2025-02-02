const CommentCard = ({ comment }) => {
  return (
    <div className=" bg-blue-950  w-[500px] h-[40px] snap-mandatory ">
      <div>
        <p className="text-xl font-semibold mb-4">
          {comment?.username}: {comment?.content}
        </p>
      </div>
    </div>
  );
};

export default CommentCard;
