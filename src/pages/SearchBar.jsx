import HeaderForAllPages from '~/components/header.jsx';
import FooterAllPage from '~/components/footer.jsx';
import PostCard from '~/components/post_card';
import ScrollTop from '~/components/scrollTop';
import { searchResults } from '../api';
import {useState } from 'react';
export default function SearchBarPage() {

  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true); // Th├¬m trß║íng th├íi loading
  const [error, setError] = useState(null); // Th├¬m trß║íng th├íi lß╗ùi


  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event) => {
       event.preventDefault();
    setLoading(true); // Set loading to true before making the API call
    setError(null);    // Clear any previous errors

    searchResults(searchTerm)
      .then(data => {
        setBoard(data || []); // Set to empty array if data is null or undefined
      })
      .catch(err => {
        setError(err);
        setBoard([]); // Clear the board on error to avoid displaying old results
      })
      .finally(() => setLoading(false)); 
  }
  if (loading){}

  if (error) {
    return <div>Error: {error.message}</div>; // Hiß╗ân thß╗ï th├┤ng b├ío lß╗ùi
  }
  return (
    <>
      <HeaderForAllPages className="sticky" />
      <div className="pt-[90px]">
        {/*temporarily searchbar*/}
        <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
          <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>

            </div>
            <input type="search"
              id="default-search"
              className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search posts"
              required
              value={searchTerm}
              onChange={handleChange}
            />
            <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
          </div>
        </form>
      </div>
      <div className="flex flex-col min-h-screen bg-[#0b2878] p-4 md:p-8">
        <div className="mx-auto mt-[60px] md:mt-[90px] font-raleway text-[32px] md:text-[48px] text-white font-bold text-center">
          Search Results
        </div>
        {!board || board.length === 0 ? (
          <div className="text-center text-white text-2xl mt-8">
            No posts yet.
          </div>
        ) : (
          <>
            <nav className="mx-auto mb-[10px] text-[20px] md:text-[30px] flex items-center justify-center">
              <ul className="pagination flex items-center space-x-1 md:space-x-2">
              </ul>
            </nav>

            <ul className="cards grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px] md:gap-[66px] place-items-center">
              {board.map(board => (
                <li key={board._id} className="w-full">
                  <PostCard board={board} />
                </li>
              ))}
            </ul>
          </>
        )}
        <ScrollTop />
      </div>
      <FooterAllPage />
    </>
  );
}

