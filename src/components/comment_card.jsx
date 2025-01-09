const CommentCard = ({ image, title, description }) => {
  return (
    <div className="bg-[#0b2878] rounded-lg shadow-md overflow-hidden transition transform hover:translate-y-[-4px] hover:shadow-lg w-full md:w-80 m-4">
      {image && (
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover" // Adjusted height and object-cover
        />
      )}
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">Bui minh quan</h3>
        <p className="text-gray-600 text-sm">code like this</p>
      </div>
      {description}
    </div>
  );
};

export default CommentCard;
