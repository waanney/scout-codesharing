import HeaderForAllPages from '~/components/header.jsx';
import FooterAllPage from '~/components/footer.jsx';
import PostCard from '~/components/post_card';
import ScrollTop from '~/components/scrollTop';
import { searchResults } from '../api';
import {useState } from 'react';
import SearchBar from '~/components/searchBar.jsx'
export default function SearchBarPage() {

  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 


 const [searchTerm, setSearchTerm] = useState(''); 

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event) => {
       event.preventDefault();
    setLoading(true); 
    setError(null);    

    searchResults(searchTerm)
      .then(data => {
        setBoard(data || []); 
      })
      .catch(err => {
        setError(err);
        setBoard([]); 
      })
      .finally(() => setLoading(false)); 
  }
  if (loading){}

  if (error) {
    return <div>Error: {error.message}</div>; 
  }
  return (
    <>
      <HeaderForAllPages className="sticky" />
      <div className="pt-[90px]">
        {/*temporarily searchbar*/}
      <SearchBar handleChange ={handleChange} handleSubmit={handleSubmit} searchTerm ={searchTerm}/>
      </div>
      <div className="flex flex-col min-h-screen bg-[#0b2878] p-4 md:p-8">
        <div className="mx-auto mt-[30px]  font-raleway text-[32px] md:text-[48px] text-white font-bold text-center">
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

