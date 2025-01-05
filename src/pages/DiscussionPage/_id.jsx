//Users detail
import { useEffect, useState } from 'react';
import { fetchBoardDetails_API } from '../../api/index';
import Discussion from '../DiscussionPage/Discussion.jsx';

function Board() {
  const [board, setBoard] = useState(null);
  useEffect(() => {
    // tạm thời const để test sau này dùng react router doom
    const boardId = '677a0ae0b67142323ecfe7e3';
    // call API
    fetchBoardDetails_API(boardId).then(board => {
      setBoard(board);
    });
  }, []);
  return <Discussion board={board} />;
}

export default Board;
