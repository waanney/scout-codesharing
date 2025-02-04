import HeaderForAllPages from '../../components/header.jsx';
import FooterAllPage from '../../components/footer.jsx';
import CommentCard from '../../components/comment_card.jsx';

export default function UserStorage() {
  return (
    <>
      <HeaderForAllPages className="sticky" />
      <div className="bg-navy-900 min-h-screen p-8 bg-[#0b2878] padding">
        <div className="container mx-auto">
          {' '}
          {/* Để căn giữa nội dung nếu cần */}
          <h1 className="text-2xl font-bold my-12 text-center text-white">
            <CommentCard />
          </h1>{' '}
          {/* Tiêu đề */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {' '}
            {/* Lưới cho các card (hiện tại chỉ là khoảng trống) */}
            {/* Tạo các div rỗng để giữ chỗ cho các card, giúp background hiển thị đúng */}
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="bg-navy-700 rounded-lg p-4 shadow-md h-48"
              >
                hello
              </div>
            ))}
          </div>
        </div>
      </div>
      <FooterAllPage />
    </>
  );
}
